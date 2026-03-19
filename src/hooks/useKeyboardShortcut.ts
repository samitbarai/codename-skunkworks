import { useEffect } from "react";

type ModifierKey = "meta" | "ctrl" | "alt" | "shift";

interface ShortcutOptions {
  key: string;
  modifiers?: ModifierKey[];
  onTrigger: () => void;
  disabled?: boolean;
}

/**
 * Registers a global keyboard shortcut.
 * Uses `meta` for Cmd on Mac, `ctrl` on Windows/Linux.
 *
 * @example
 * useKeyboardShortcut({ key: "\\", modifiers: ["meta"], onTrigger: togglePanel });
 */
export function useKeyboardShortcut({ key, modifiers = [], onTrigger, disabled = false }: ShortcutOptions) {
  useEffect(() => {
    if (disabled) return;

    const handler = (e: KeyboardEvent) => {
      // For "meta", accept either metaKey or ctrlKey (cross-platform Cmd/Ctrl)
      const metaMatch = modifiers.includes("meta") ? (e.metaKey || e.ctrlKey) : (!e.metaKey && !e.ctrlKey);
      const altMatch  = modifiers.includes("alt")  ? e.altKey  : !e.altKey;
      const shiftMatch = modifiers.includes("shift") ? e.shiftKey : !e.shiftKey;

      // When "meta" is requested and satisfied via ctrlKey, don't also require ctrl to be absent
      const ctrlUsedAsMeta = modifiers.includes("meta") && !modifiers.includes("ctrl") && e.ctrlKey && !e.metaKey;
      const ctrlMatch = modifiers.includes("ctrl") ? e.ctrlKey : (ctrlUsedAsMeta || !e.ctrlKey);

      if (e.key === key && metaMatch && ctrlMatch && altMatch && shiftMatch) {
        e.preventDefault();
        onTrigger();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [key, modifiers, onTrigger, disabled]);
}
