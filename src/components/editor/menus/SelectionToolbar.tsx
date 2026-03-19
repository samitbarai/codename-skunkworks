import { BubbleMenu, type Editor } from "@tiptap/react";
import styles from "./SelectionToolbar.module.css";

interface ToolbarAction {
  key: string;
  label: string;
  shortcut?: string;
  content: React.ReactNode;
  toggle: (editor: Editor) => void;
}

const TOOLBAR_ACTIONS: ToolbarAction[] = [
  {
    key: "bold",
    label: "Bold",
    shortcut: "⌘B",
    content: "B",
    toggle: (e) => e.chain().focus().toggleBold().run(),
  },
  {
    key: "italic",
    label: "Italic",
    shortcut: "⌘I",
    content: <em>I</em>,
    toggle: (e) => e.chain().focus().toggleItalic().run(),
  },
  {
    key: "strike",
    label: "Strikethrough",
    content: <s>S</s>,
    toggle: (e) => e.chain().focus().toggleStrike().run(),
  },
  {
    key: "code",
    label: "Inline code",
    shortcut: "⌘E",
    content: "</>" ,
    toggle: (e) => e.chain().focus().toggleCode().run(),
  },
];

interface SelectionToolbarProps {
  editor: Editor;
}

export function SelectionToolbar({ editor }: SelectionToolbarProps) {
  function handleLink() {
    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
    } else {
      const url = window.prompt("URL:");
      if (url) {
        try {
          new URL(url);
          editor.chain().focus().setLink({ href: url }).run();
        } catch {
          // Invalid URL — silently ignore
        }
      }
    }
  }

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 150, placement: "top" }}
      className={styles.toolbar}
    >
      {TOOLBAR_ACTIONS.map((action) => (
        <button
          key={action.key}
          type="button"
          className={`${styles.btn} ${editor.isActive(action.key) ? styles.btnActive : ""}`}
          onClick={() => action.toggle(editor)}
          aria-label={`${action.label}${action.shortcut ? ` (${action.shortcut})` : ""}`}
          title={`${action.label}${action.shortcut ? ` (${action.shortcut})` : ""}`}
        >
          {action.content}
        </button>
      ))}
      <div className={styles.divider} />
      <button
        type="button"
        className={`${styles.btn} ${editor.isActive("link") ? styles.btnActive : ""}`}
        onClick={handleLink}
        aria-label="Link (⌘K)"
        title="Link (⌘K)"
      >
        🔗
      </button>
    </BubbleMenu>
  );
}
