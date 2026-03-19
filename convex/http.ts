import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
import { auth } from "./auth";
import type { Id } from "./_generated/dataModel";

const http = httpRouter();

auth.addHttpRoutes(http);

// ─── Y.js persistence endpoints (called by Hocuspocus server) ───────────────

// Allowed origins for CORS — add your deployment URL here
const ALLOWED_ORIGINS = new Set([
  process.env.SITE_URL ?? "",
  "http://localhost:5173",
  "http://localhost:3000",
]);

function getAllowedOrigin(request: Request): string | null {
  const origin = request.headers.get("Origin");
  if (origin && ALLOWED_ORIGINS.has(origin)) return origin;
  return null;
}

/**
 * Verifies the request carries a valid Bearer token.
 * Hocuspocus server must forward the user's token in the Authorization header.
 */
function getAuthToken(request: Request): string | null {
  const header = request.headers.get("Authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice(7) || null;
}

/**
 * Load Y.js document state.
 * POST /api/yjs/load { documentId: string }
 * Returns { snapshot: base64 | null, updates: base64[] }
 */
http.route({
  path: "/api/yjs/load",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const origin = getAllowedOrigin(request);

    const token = getAuthToken(request);
    if (!token) {
      return new Response("Unauthorized", { status: 401, headers: corsHeaders(origin) });
    }

    let body: { documentId?: string };
    try {
      body = await request.json();
    } catch {
      return new Response("Invalid JSON", { status: 400, headers: corsHeaders(origin) });
    }

    const { documentId } = body;
    if (!documentId) {
      return new Response("Missing documentId", { status: 400, headers: corsHeaders(origin) });
    }

    const result = await ctx.runQuery(api.yjsSnapshots.getSnapshot, {
      documentId: documentId as Id<"documents">,
    });

    // Convert ArrayBuffer to base64 for JSON transport
    const snapshot = result.snapshot
      ? bufferToBase64(result.snapshot)
      : null;
    const updates = result.updates.map((u: ArrayBuffer) => bufferToBase64(u));

    return new Response(JSON.stringify({ snapshot, updates }), {
      headers: corsHeaders(origin),
    });
  }),
});

/**
 * Store Y.js document state (full snapshot).
 * POST /api/yjs/store { documentId: string, snapshot: base64 }
 */
http.route({
  path: "/api/yjs/store",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const origin = getAllowedOrigin(request);

    const token = getAuthToken(request);
    if (!token) {
      return new Response("Unauthorized", { status: 401, headers: corsHeaders(origin) });
    }

    let body: { documentId?: string; snapshot?: string };
    try {
      body = await request.json();
    } catch {
      return new Response("Invalid JSON", { status: 400, headers: corsHeaders(origin) });
    }

    const { documentId, snapshot } = body;
    if (!documentId || !snapshot) {
      return new Response("Missing documentId or snapshot", { status: 400, headers: corsHeaders(origin) });
    }

    let snapshotBuffer: ArrayBuffer;
    try {
      snapshotBuffer = base64ToBuffer(snapshot);
    } catch {
      return new Response("Invalid base64 snapshot", { status: 400, headers: corsHeaders(origin) });
    }

    await ctx.runMutation(api.yjsSnapshots.saveSnapshot, {
      documentId: documentId as Id<"documents">,
      snapshot: snapshotBuffer,
    });

    return new Response("OK", { headers: corsHeaders(origin) });
  }),
});

// Handle CORS preflight for Y.js endpoints
http.route({
  path: "/api/yjs/load",
  method: "OPTIONS",
  handler: httpAction(async (_ctx, request) => {
    return new Response(null, { status: 204, headers: corsHeaders(getAllowedOrigin(request)) });
  }),
});

http.route({
  path: "/api/yjs/store",
  method: "OPTIONS",
  handler: httpAction(async (_ctx, request) => {
    return new Response(null, { status: 204, headers: corsHeaders(getAllowedOrigin(request)) });
  }),
});

// ─── Helpers ────────────────────────────────────────────────────────────────

function corsHeaders(origin: string | null) {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": origin ?? "",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export default http;
