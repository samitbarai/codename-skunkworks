import { Extension, type Editor } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";
import type { SuggestionOptions } from "@tiptap/suggestion";

export type SlashCommandItem = {
  title: string;
  description: string;
  icon: string;
  command: (args: { editor: Editor; range: { from: number; to: number } }) => void;
};

/**
 * Helper that deletes the slash-trigger range then executes a chained command.
 * Avoids repeating the same @ts-expect-error for every item.
 */
function slashAction(
  editor: Editor,
  range: { from: number; to: number },
  chainFn: (chain: ReturnType<Editor["chain"]>) => ReturnType<Editor["chain"]>,
) {
  // deleteRange exists at runtime via StarterKit but isn't in the base chain types.
  // clearNodes() normalises the current block to a plain paragraph BEFORE applying
  // the new format — prevents a heading (or other block) from bleeding into list/quote
  // commands when Enter was pressed inside a heading and the cursor stayed there.
  const chain = (editor.chain().focus() as any).deleteRange(range).clearNodes();
  chainFn(chain).run();
}

// Exported so the menu component can access them
export const SLASH_ITEMS: SlashCommandItem[] = [
  {
    title: "Heading 1",
    description: "Large section heading",
    icon: "H1",
    command: ({ editor, range }) =>
      slashAction(editor, range, (c) => c.setNode("heading", { level: 1 })),
  },
  {
    title: "Heading 2",
    description: "Medium section heading",
    icon: "H2",
    command: ({ editor, range }) =>
      slashAction(editor, range, (c) => c.setNode("heading", { level: 2 })),
  },
  {
    title: "Heading 3",
    description: "Small section heading",
    icon: "H3",
    command: ({ editor, range }) =>
      slashAction(editor, range, (c) => c.setNode("heading", { level: 3 })),
  },
  {
    title: "Bullet List",
    description: "Unordered list of items",
    icon: "•—",
    command: ({ editor, range }) =>
      slashAction(editor, range, (c) => c.toggleBulletList()),
  },
  {
    title: "Numbered List",
    description: "Ordered list of items",
    icon: "1—",
    command: ({ editor, range }) =>
      slashAction(editor, range, (c) => c.toggleOrderedList()),
  },
  {
    title: "Code Block",
    description: "Multiline code with syntax",
    icon: "</>",
    command: ({ editor, range }) =>
      slashAction(editor, range, (c) => c.toggleCodeBlock()),
  },
  {
    title: "Quote",
    description: "Blockquote callout",
    icon: "❝",
    command: ({ editor, range }) =>
      slashAction(editor, range, (c) => c.toggleBlockquote()),
  },
  {
    title: "Divider",
    description: "Horizontal rule",
    icon: "—",
    command: ({ editor, range }) =>
      slashAction(editor, range, (c) => c.setHorizontalRule()),
  },
];

export const SlashCommand = Extension.create({
  name: "slashCommand",
  addOptions() {
    return { suggestion: {} as Partial<SuggestionOptions> };
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        char: "/",
        allowSpaces: false,
        startOfLine: false,
        ...this.options.suggestion,
      }),
    ];
  },
});
