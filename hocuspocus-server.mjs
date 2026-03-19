/**
 * Standalone Hocuspocus WebSocket server for local development.
 * Matches VITE_HOCUSPOCUS_URL=ws://localhost:1234 in .env.local
 *
 * Run: node hocuspocus-server.mjs
 * Production: deploy this to Railway/Fly.io as a separate service.
 *
 * Requires CONVEX_SITE_URL environment variable for persistence
 * (e.g. https://your-app.convex.site)
 */

import { Server } from "@hocuspocus/server";
import * as Y from "yjs";

const CONVEX_SITE_URL = process.env.CONVEX_SITE_URL || "";

if (!CONVEX_SITE_URL) {
  console.warn(
    "[Hocuspocus] CONVEX_SITE_URL not set — persistence disabled. Documents will be in-memory only."
  );
}

const server = new Server({
  port: 1234,

  async onConnect(data) {
    console.log(`[Hocuspocus] Client connected: ${data.socketId}`);
  },

  async onDisconnect(data) {
    console.log(`[Hocuspocus] Client disconnected: ${data.socketId}`);
  },

  async onAuthenticate(data) {
    // TODO: validate Convex auth token for production
    console.log(`[Hocuspocus] Auth (token validation TODO)`);
  },

  /**
   * Load document state from Convex when a room is opened.
   * Applies the persisted snapshot + any incremental updates.
   */
  async onLoadDocument(data) {
    if (!CONVEX_SITE_URL) return data.document;

    const documentId = data.documentName;
    console.log(`[Hocuspocus] Loading document: ${documentId}`);

    try {
      const res = await fetch(`${CONVEX_SITE_URL}/api/yjs/load`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId }),
      });

      if (!res.ok) {
        console.warn(`[Hocuspocus] Load failed (${res.status}), starting fresh`);
        return data.document;
      }

      const { snapshot, updates } = await res.json();

      if (snapshot) {
        const snapshotBytes = base64ToUint8Array(snapshot);
        Y.applyUpdate(data.document, snapshotBytes);
        console.log(`[Hocuspocus] Applied snapshot (${snapshotBytes.length} bytes)`);
      }

      if (updates && updates.length > 0) {
        for (const update of updates) {
          const updateBytes = base64ToUint8Array(update);
          Y.applyUpdate(data.document, updateBytes);
        }
        console.log(`[Hocuspocus] Applied ${updates.length} incremental updates`);
      }
    } catch (err) {
      console.error(`[Hocuspocus] Load error:`, err.message);
    }

    return data.document;
  },

  /**
   * Save document state to Convex when changes are debounced.
   * Saves a full snapshot (the entire Y.Doc state).
   */
  async onStoreDocument(data) {
    if (!CONVEX_SITE_URL) return;

    const documentId = data.documentName;
    const snapshot = Y.encodeStateAsUpdate(data.document);
    const snapshotBase64 = uint8ArrayToBase64(snapshot);

    console.log(
      `[Hocuspocus] Storing document: ${documentId} (${snapshot.length} bytes)`
    );

    try {
      const res = await fetch(`${CONVEX_SITE_URL}/api/yjs/store`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId, snapshot: snapshotBase64 }),
      });

      if (!res.ok) {
        console.error(`[Hocuspocus] Store failed: ${res.status}`);
      }
    } catch (err) {
      console.error(`[Hocuspocus] Store error:`, err.message);
    }
  },
});

// ─── Helpers ────────────────────────────────────────────────────────────────

function base64ToUint8Array(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function uint8ArrayToBase64(bytes) {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

server.listen();
console.log(`[Hocuspocus] WebSocket server running on ws://localhost:1234`);
if (CONVEX_SITE_URL) {
  console.log(`[Hocuspocus] Persistence: ${CONVEX_SITE_URL}`);
} else {
  console.log(`[Hocuspocus] Persistence: DISABLED (set CONVEX_SITE_URL to enable)`);
}
