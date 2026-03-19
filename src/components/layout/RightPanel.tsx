import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useApp } from "@/store/AppStore";
import { AIPanel, type ChatMessage } from "@/components/ai/AIPanel";
import { ChatInput } from "@/components/ai/ChatInput";
import { CloseRemove } from "@/components/icons";
import { IconButton } from "@/components/ui";
import styles from "./RightPanel.module.css";

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function RightPanel() {
  const { toggleRight } = useApp();
  const user = useQuery(api.users.getCurrentUser);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  function handleSend(text: string) {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "user",
        text,
        time: formatTime(new Date()),
        userName: user?.name ?? "You",
        avatarUrl: user?.image ?? undefined,
      },
    ]);
  }

  return (
    <aside className={styles.rightPanel}>
      {/* Jam header — matches Figma topbar */}
      <div className={styles.rightPanelHeader}>
        <span className={styles.rightPanelHeaderTitle}>Jam</span>
        <IconButton
          size="md"
          onClick={toggleRight}
          aria-label="Close AI panel"
          title="Close AI panel (⌘⇧\)"
        >
          <CloseRemove size={18} />
        </IconButton>
      </div>

      {/* AI chat content */}
      <div className={styles.rightPanelContent}>
        <AIPanel messages={messages} />
      </div>

      {/* Chat input footer */}
      <ChatInput onSend={handleSend} />
    </aside>
  );
}
