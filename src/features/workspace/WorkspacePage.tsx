import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/store/AppStore";
import styles from "./WorkspacePage.module.css";

export function WorkspacePage() {
  const { docs, setActiveDoc, isLoading } = useApp();
  const navigate = useNavigate();

  // Auto-open the first non-folder document on mount only
  const hasNavigated = useRef(false);
  useEffect(() => {
    if (hasNavigated.current || isLoading) return;
    const firstDoc = docs.find((d) => !d.isFolder);
    if (firstDoc) {
      hasNavigated.current = true;
      setActiveDoc(firstDoc.id);
      navigate(`/doc/${firstDoc.id}`, { replace: true });
    }
  }, [docs, navigate, setActiveDoc, isLoading]);

  return (
    <AppShell>
      <div className={styles.workspaceEmpty}>
        <p className={styles.workspaceEmptyHint}>
          Select a document to get started.
        </p>
      </div>
    </AppShell>
  );
}
