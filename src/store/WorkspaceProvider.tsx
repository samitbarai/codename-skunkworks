import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

interface WorkspaceCtx {
  workspaceId: Id<"workspaces">;
}

const WorkspaceContext = createContext<WorkspaceCtx | null>(null);

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used within WorkspaceProvider");
  return ctx;
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const workspaceId = useQuery(api.workspaces.getMyWorkspace);
  const bootstrap = useMutation(api.workspaces.bootstrapWorkspace);
  const bootstrapped = useRef(false);

  useEffect(() => {
    // workspaceId === undefined means query is still loading
    // workspaceId === null means user has no workspace yet
    if (workspaceId === null && !bootstrapped.current) {
      bootstrapped.current = true;
      bootstrap();
    }
  }, [workspaceId, bootstrap]);

  // Still loading or bootstrapping
  if (!workspaceId) return null;

  return (
    <WorkspaceContext.Provider value={{ workspaceId }}>
      {children}
    </WorkspaceContext.Provider>
  );
}
