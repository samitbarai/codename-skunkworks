import { createContext, useContext, type ReactNode } from "react";
import type { HocuspocusProvider } from "@hocuspocus/provider";

const CollabCtx = createContext<HocuspocusProvider | null>(null);

export function CollaborationProvider({
  provider,
  children,
}: {
  provider: HocuspocusProvider | null;
  children: ReactNode;
}) {
  return <CollabCtx.Provider value={provider}>{children}</CollabCtx.Provider>;
}

export function useCollaborationProvider() {
  return useContext(CollabCtx);
}
