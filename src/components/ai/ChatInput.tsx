import { useState } from "react";
import { Plus } from "@/components/icons";
import styles from "./ChatInput.module.css";

/** Send icon — arrow-up inside a circle */
function SendIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  );
}

interface ChatInputProps {
  onSend: (message: string) => void;
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [value, setValue] = useState("");

  function handleSend() {
    if (!value.trim()) return;
    onSend(value.trim());
    setValue("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <footer className={styles.chatInputFooter}>
      <div className={styles.chatInputInner}>
        {/* Top container — textarea */}
        <div className={styles.chatInputTop}>
          <textarea
            className={styles.chatInputTextarea}
            placeholder="Ask Jam anything…"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            aria-label="Chat message"
          />
        </div>

        {/* Bottom container — actions row */}
        <div className={styles.chatInputBottom}>
          <button
            className={styles.chatInputIconBtn}
            aria-label="Attach"
            title="Attach"
            type="button"
          >
            <Plus size={16} />
          </button>

          <button
            className={styles.chatInputSendBtn}
            aria-label="Send message"
            title="Send (Enter)"
            type="button"
            onClick={handleSend}
            disabled={!value.trim()}
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </footer>
  );
}
