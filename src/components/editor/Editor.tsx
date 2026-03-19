import { useEffect, useMemo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import type { Editor as TiptapEditor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { SlashCommand, type SlashCommandItem } from "./extensions/SlashCommand";
import { filterSlashItems } from "./menus/SlashCommandMenu";
import { SelectionToolbar } from "./menus/SelectionToolbar";
import { userColor } from "@/lib/colors";
import { slashSuggestionRenderer } from "./menus/slashSuggestionRenderer";
import type { DocProvider } from "@/lib/yjs";
import styles from "./Editor.module.css";

interface EditorProps {
  documentId: string;
  collab: DocProvider;
}

export function Editor({ documentId, collab }: EditorProps) {
  const user = useQuery(api.users.getCurrentUser);

  // Build extensions once — collab is guaranteed non-null by parent
  const extensions = useMemo(
    () => [
      StarterKit.configure({ history: false }),
      Collaboration.configure({
        document: collab.ydoc,
        field: "default",
      }),
      CollaborationCursor.configure({
        provider: collab.provider,
        user: {
          name: "Anonymous",
          color: userColor(documentId),
        },
      }),
      Placeholder.configure({
        placeholder: "Start typing, or press / for options.",
      }),
      Link.configure({ openOnClick: false }),
      SlashCommand.configure({
        suggestion: {
          items: ({ query }: { query: string }) => filterSlashItems(query),
          render: slashSuggestionRenderer,
          // Required: TipTap's suggestion plugin calls this when props.command(item) is invoked
          command: ({
            editor,
            range,
            props: item,
          }: {
            editor: TiptapEditor;
            range: { from: number; to: number };
            props: SlashCommandItem;
          }) => {
            item.command({ editor, range });
          },
        },
      }),
    ],
    // Only recreate if the actual Y.js doc or provider instance changes
    [collab.ydoc, collab.provider, documentId],
  );

  const editor = useEditor({
    extensions,
    autofocus: true,
  });

  // Update cursor user info when user data loads (without recreating editor)
  useEffect(() => {
    if (!editor || !user) return;
    const commands = editor.chain().focus();
    if (typeof (commands as any).user === "function") {
      (commands as any)
        .user({
          name: user.name ?? "Anonymous",
          color: userColor(user._id),
        })
        .run();
    }
  }, [editor, user]);

  return (
    <main
      className={styles.editorRoot}
      onClick={() => editor?.chain().focus().run()}
    >
      <EditorContent editor={editor} />
      {editor && <SelectionToolbar editor={editor} />}
    </main>
  );
}
