import { useState, useRef, useEffect } from "react";
import { useApp } from "@/store/AppStore";
import { useTheme } from "@/hooks/useTheme";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { Leftside, Sun, Moon, CircleMessage2Stars, Comment } from "@/components/icons";
import { IconButton } from "@/components/ui";
import { AvatarStack } from "@/components/collaboration/AvatarStack";
import { useCollaborationProvider } from "@/components/editor/CollaborationContext";
import styles from "./PaperTopBar.module.css";

export function PaperTopBar() {
  const { activeDocId, docs, renameDoc, leftPanelOpen, rightPanelOpen, toggleLeft, toggleRight } = useApp();
  const collabProvider = useCollaborationProvider();
  const { theme, toggleTheme } = useTheme();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const activeDoc = docs.find((d) => d.id === activeDocId);

  useKeyboardShortcut({ key: "\\", modifiers: ["meta"],          onTrigger: toggleLeft });
  useKeyboardShortcut({ key: "\\", modifiers: ["meta", "shift"], onTrigger: toggleRight });

  useEffect(() => { if (editing) inputRef.current?.select(); }, [editing]);

  function startEdit() {
    if (!activeDoc || activeDoc.isFolder) return;
    setDraft(activeDoc.title);
    setEditing(true);
  }
  function commitEdit() {
    if (activeDocId && draft.trim()) renameDoc(activeDocId, draft.trim());
    setEditing(false);
  }

  return (
    <header className={styles.paperTopBar}>
      {/* Left: sidebar toggle + doc title */}
      <div className={styles.paperTopBarLeft}>
        <IconButton
          size="sm"
          active={leftPanelOpen}
          onClick={toggleLeft}
          aria-label={`${leftPanelOpen ? "Close" : "Open"} sidebar`}
          aria-pressed={leftPanelOpen}
          title="Toggle sidebar (⌘\)"
        >
          <Leftside size={18} />
        </IconButton>

        {editing ? (
          <input
            ref={inputRef}
            className={styles.paperTopBarDocTitleInput}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitEdit();
              if (e.key === "Escape") setEditing(false);
            }}
          />
        ) : (
          <span
            className={styles.paperTopBarDocTitle}
            onDoubleClick={startEdit}
            title="Double-click to rename"
          >
            {activeDoc?.title ?? "Skunkworks"}
          </span>
        )}
      </div>

      {/* Right: controls */}
      <div className={styles.paperTopBarRight}>
        <AvatarStack provider={collabProvider} />
        <IconButton
          size="sm"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          title="Toggle theme"
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </IconButton>
        <IconButton size="sm" aria-label="Comments" title="Comments">
          <Comment size={18} />
        </IconButton>
        <IconButton
          size="sm"
          active={rightPanelOpen}
          onClick={toggleRight}
          aria-label={`${rightPanelOpen ? "Close" : "Open"} AI panel`}
          aria-pressed={rightPanelOpen}
          title="Toggle AI panel (⌘⇧\)"
        >
          <CircleMessage2Stars size={18} />
        </IconButton>
      </div>
    </header>
  );
}
