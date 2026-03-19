import { useEffect, useRef, useState } from "react";
import { createDocProvider, type DocProvider } from "@/lib/yjs";

/**
 * Sets up Y.js + HocuspocusProvider for a document.
 * Returns the DocProvider (ydoc + provider) once connected, or null while waiting.
 *
 * Only recreates the provider when `documentId` changes.
 * Token is captured at creation time via ref to avoid reconnect loops.
 */
export function useCollaboration(documentId: string, token: string) {
  const [docProvider, setDocProvider] = useState<DocProvider | null>(null);
  const tokenRef = useRef(token);
  tokenRef.current = token;

  useEffect(() => {
    if (!documentId || !tokenRef.current) return;

    const dp = createDocProvider(documentId, tokenRef.current);
    setDocProvider(dp);

    return () => {
      dp.provider.destroy();
      setDocProvider(null);
    };
    // Only recreate when documentId changes — token is read from ref
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId]);

  return docProvider;
}
