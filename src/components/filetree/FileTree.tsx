import { useState, useRef, useEffect, type DragEvent } from "react";
import { useNavigate } from "react-router";
import { useApp, type Doc } from "@/store/AppStore";
import { File, Folder, FolderOpen, Plus, FolderPlus, Trash } from "@/components/icons";
import { IconButton } from "@/components/ui";
import styles from "./FileTree.module.css";

const DRAG_MIME = "application/x-skunkworks-doc-id";

function FileItem({ doc, depth = 0 }: { doc: Doc; depth?: number }) {
  const { docs, activeDocId, setActiveDoc, renameDoc, deleteDoc, createDoc, createFolder, moveDoc } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [renaming, setRenaming] = useState(false);
  const [draft, setDraft] = useState(doc.title);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const children = docs.filter((d) => d.parentId === doc.id);
  const isActive = activeDocId === doc.id;

  useEffect(() => { if (renaming) inputRef.current?.select(); }, [renaming]);

  function openDoc(id: string) {
    setActiveDoc(id);
    navigate(`/doc/${id}`);
  }

  function commit() {
    if (draft.trim()) renameDoc(doc.id, draft.trim());
    setRenaming(false);
  }

  // ── Drag source ─────────────────────────────────────────────────
  function handleDragStart(e: DragEvent) {
    e.dataTransfer.setData(DRAG_MIME, doc.id);
    e.dataTransfer.effectAllowed = "move";
  }

  // ── Drop target (folders only) ──────────────────────────────────
  function handleDragOver(e: DragEvent) {
    if (!doc.isFolder) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver(true);
  }

  function handleDragLeave() {
    setDragOver(false);
  }

  async function handleDrop(e: DragEvent) {
    setDragOver(false);
    if (!doc.isFolder) return;
    e.preventDefault();
    const draggedId = e.dataTransfer.getData(DRAG_MIME);
    if (!draggedId || draggedId === doc.id) return;
    await moveDoc(draggedId, doc.id);
    setOpen(true);
  }

  return (
    <>
      <div
        role="treeitem"
        tabIndex={0}
        draggable
        className={`${styles.fileTreeRow} ${isActive ? styles.fileTreeRowActive : ""} ${dragOver ? styles.dropTarget : ""}`}
        style={{ paddingLeft: `calc(var(--space-2) + ${depth} * var(--filetree-indent))` }}
        onClick={() => doc.isFolder ? setOpen((v) => !v) : openDoc(doc.id)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); doc.isFolder ? setOpen((v) => !v) : openDoc(doc.id); } }}
        onDoubleClick={() => { setDraft(doc.title); setRenaming(true); }}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <span className={styles.fileTreeRowIcon}>
          {doc.isFolder ? (open ? <FolderOpen size={14} /> : <Folder size={14} />) : <File size={14} />}
        </span>

        {renaming ? (
          <input
            ref={inputRef}
            className={styles.fileTreeRowRenameInput}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") setRenaming(false); }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className={styles.fileTreeRowTitle}>{doc.title}</span>
        )}

        <span className={styles.fileTreeRowActions} onClick={(e) => e.stopPropagation()}>
          {doc.isFolder && (
            <>
              <IconButton size="xxs" aria-label="New document" title="New doc" onClick={async () => { const id = await createDoc("Untitled", doc.id); openDoc(id); }}><Plus size={12} /></IconButton>
              <IconButton size="xxs" aria-label="New folder" title="New folder" onClick={() => void createFolder("New Folder", doc.id)}><FolderPlus size={12} /></IconButton>
            </>
          )}
          <IconButton size="xxs" variant="destructive" aria-label={`Delete ${doc.title}`} title="Delete" onClick={() => deleteDoc(doc.id)}><Trash size={11} /></IconButton>
        </span>
      </div>

      {doc.isFolder && open && children.map((child) => (
        <FileItem key={child.id} doc={child} depth={depth + 1} />
      ))}
    </>
  );
}

export function FileTree() {
  const { docs, createDoc, createFolder, setActiveDoc, moveDoc } = useApp();
  const navigate = useNavigate();
  const roots = docs.filter((d) => d.parentId === undefined || d.parentId === null);
  const [rootDragOver, setRootDragOver] = useState(false);

  function openDoc(id: string) {
    setActiveDoc(id);
    navigate(`/doc/${id}`);
  }

  // Drop on the tree root area → move to root level
  function handleRootDragOver(e: DragEvent<HTMLElement>) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setRootDragOver(true);
  }

  async function handleRootDrop(e: DragEvent<HTMLElement>) {
    e.preventDefault();
    setRootDragOver(false);
    const draggedId = e.dataTransfer.getData(DRAG_MIME);
    if (!draggedId) return;
    await moveDoc(draggedId, null);
  }

  return (
    <nav
      className={`${styles.fileTree} ${rootDragOver ? styles.dropTarget : ""}`}
      onDragOver={handleRootDragOver}
      onDragLeave={() => setRootDragOver(false)}
      onDrop={handleRootDrop}
    >
      <div className={styles.fileTreeHeader}>
        <span>Files</span>
        <div className={styles.fileTreeHeaderActions}>
          <IconButton size="xs" aria-label="New document" title="New document" onClick={async () => { const id = await createDoc(); openDoc(id); }}><Plus size={12} /></IconButton>
          <IconButton size="xs" aria-label="New folder" title="New folder" onClick={() => void createFolder()}><FolderPlus size={12} /></IconButton>
        </div>
      </div>
      {roots.map((doc) => <FileItem key={doc.id} doc={doc} />)}
    </nav>
  );
}
