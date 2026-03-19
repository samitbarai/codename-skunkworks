import { createRoot, type Root } from "react-dom/client";
import { SlashCommandMenu, filterSlashItems } from "./SlashCommandMenu";
import type { SlashCommandItem } from "../extensions/SlashCommand";

/**
 * TipTap Suggestion plugin renderer for the slash command menu.
 * Creates a floating DOM element and renders the React menu into it.
 */
export function slashSuggestionRenderer() {
  let container: HTMLDivElement | null = null;
  let root: Root | null = null;
  let menuRef: { onKeyDown: (props: { event: KeyboardEvent }) => boolean } | null = null;

  return {
    onStart(props: {
      clientRect: (() => DOMRect | null) | null;
      command: (item: SlashCommandItem) => void;
      query: string;
    }) {
      container = document.createElement("div");
      container.style.position = "absolute";
      // CSS vars can't be used via .style.zIndex — use setProperty instead
      container.style.setProperty("z-index", "var(--z-dropdown, 50)");
      document.body.appendChild(container);
      updatePosition(container, props.clientRect);

      root = createRoot(container);
      root.render(
        <SlashCommandMenu
          ref={(handle) => { menuRef = handle; }}
          items={filterSlashItems(props.query)}
          command={props.command}
        />,
      );
    },

    onUpdate(props: {
      clientRect: (() => DOMRect | null) | null;
      command: (item: SlashCommandItem) => void;
      query: string;
    }) {
      if (container) updatePosition(container, props.clientRect);
      root?.render(
        <SlashCommandMenu
          ref={(handle) => { menuRef = handle; }}
          items={filterSlashItems(props.query)}
          command={props.command}
        />,
      );
    },

    onKeyDown(props: { event: KeyboardEvent }) {
      if (props.event.key === "Escape") {
        return true;
      }
      return menuRef?.onKeyDown(props) ?? false;
    },

    onExit() {
      root?.unmount();
      root = null;
      menuRef = null;
      container?.remove();
      container = null;
    },
  };
}

function updatePosition(el: HTMLElement, clientRect: (() => DOMRect | null) | null) {
  const rect = clientRect?.();
  if (!rect) return;
  el.style.left = `${rect.left}px`;
  el.style.top = `${rect.bottom + 4}px`;
}
