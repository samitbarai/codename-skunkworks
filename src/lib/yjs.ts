import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";

export interface DocProvider {
  ydoc: Y.Doc;
  provider: HocuspocusProvider;
}

/**
 * Creates a Y.Doc + HocuspocusProvider pair for a given document ID.
 * Each document gets its own Y.Doc instance (scoped to the documentId room).
 */
export function createDocProvider(documentId: string, token: string): DocProvider {
  const ydoc = new Y.Doc();

  const provider = new HocuspocusProvider({
    url: import.meta.env.VITE_HOCUSPOCUS_URL as string,
    name: documentId,
    document: ydoc,
    token,
    onConnect: () => {
      if (import.meta.env.DEV) console.log(`[Y.js] Connected to room: ${documentId}`);
    },
    onDisconnect: () => {
      if (import.meta.env.DEV) console.log(`[Y.js] Disconnected from room: ${documentId}`);
    },
    onAuthenticationFailed: ({ reason }) => {
      console.error(`[Y.js] Auth failed: ${reason}`);
    },
  });

  return { ydoc, provider };
}
