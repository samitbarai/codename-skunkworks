import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { SLASH_ITEMS, type SlashCommandItem } from "../extensions/SlashCommand";
import styles from "./SlashCommandMenu.module.css";

export interface SlashCommandMenuHandle {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

interface Props {
  items: SlashCommandItem[];
  command: (item: SlashCommandItem) => void;
}

export const SlashCommandMenu = forwardRef<SlashCommandMenuHandle, Props>(
  ({ items, command }, ref) => {
    const [selected, setSelected] = useState(0);
    useEffect(() => setSelected(0), [items]);

    useImperativeHandle(ref, () => ({
      onKeyDown({ event }) {
        if (event.key === "ArrowUp") { setSelected((s) => (s - 1 + items.length) % items.length); return true; }
        if (event.key === "ArrowDown") { setSelected((s) => (s + 1) % items.length); return true; }
        if (event.key === "Enter") { if (items[selected]) command(items[selected]); return true; }
        return false;
      },
    }));

    if (!items.length) return <div className={styles.slashMenu} role="listbox"><p className={styles.slashMenuEmpty}>No results</p></div>;

    return (
      <div className={styles.slashMenu} role="listbox" aria-label="Slash commands">
        {items.map((item, i) => (
          <button
            key={item.title}
            role="option"
            aria-selected={i === selected}
            className={`${styles.slashMenuItem} ${i === selected ? styles.slashMenuItemSelected : ""}`}
            onMouseEnter={() => setSelected(i)}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => command(item)}
          >
            <span className={styles.slashMenuItemIcon}>{item.icon}</span>
            <span className={styles.slashMenuItemBody}>
              <span className={styles.slashMenuItemTitle}>{item.title}</span>
              <span className={styles.slashMenuItemDesc}>{item.description}</span>
            </span>
          </button>
        ))}
      </div>
    );
  }
);
SlashCommandMenu.displayName = "SlashCommandMenu";

export function filterSlashItems(query: string) {
  return SLASH_ITEMS.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
  );
}
