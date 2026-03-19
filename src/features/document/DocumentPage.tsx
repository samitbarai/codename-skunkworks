import { useEffect } from "react";
import { useParams } from "react-router";
import { useAuthToken } from "@convex-dev/auth/react";
import { AppShell } from "@/components/layout/AppShell";
import { Editor } from "@/components/editor/Editor";
import { CollaborationProvider } from "@/components/editor/CollaborationContext";
import { useCollaboration } from "@/components/editor/hooks/useCollaboration";
import { useApp } from "@/store/AppStore";
import styles from "./DocumentPage.module.css";

export function DocumentPage() {
  const { documentId } = useParams<{ documentId: string }>();
  const token = useAuthToken();
  const { setActiveDoc } = useApp();

  // Sync activeDocId from URL so sidebar highlights the correct doc
  useEffect(() => {
    if (documentId) setActiveDoc(documentId);
  }, [documentId, setActiveDoc]);

  if (!documentId) return <div>Document not found</div>;

  // Don't create the collaboration provider until we have a token
  if (!token) return null;

  return (
    <DocumentPageInner documentId={documentId} token={token} />
  );
}

function DocumentPageInner({ documentId, token }: { documentId: string; token: string }) {
  const collab = useCollaboration(documentId, token);

  return (
    <CollaborationProvider provider={collab?.provider ?? null}>
      <AppShell>
        {collab ? (
          <Editor documentId={documentId} collab={collab} />
        ) : (
          <main className={styles.connecting}>
            Connecting...
          </main>
        )}
      </AppShell>
    </CollaborationProvider>
  );
}
