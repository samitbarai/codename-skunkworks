// TODO: Phase 6 — right-side AI chat panel
// Handles: AI invocation, text-reference-to-chat (select text → quote into panel),
// streaming AI responses, accept/reject controls for AI block suggestions

import { useEffect, useRef } from "react";
import { UserMessage } from "./UserMessage";
import { AIMessage } from "./AIMessage";
import styles from "./AIPanel.module.css";

export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  text: string;
  time: string;
  userName?: string;
  avatarUrl?: string;
}

interface AIPanelProps {
  messages: ChatMessage[];
}

export function AIPanel({ messages }: AIPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={styles.aiPanel}>
      {messages.map((msg) =>
        msg.role === "user" ? (
          <UserMessage
            key={msg.id}
            name={msg.userName ?? "You"}
            avatarUrl={msg.avatarUrl}
            time={msg.time}
            message={msg.text}
          />
        ) : (
          <AIMessage
            key={msg.id}
            time={msg.time}
            message={msg.text}
          />
        )
      )}
      <div ref={bottomRef} />
    </div>
  );
}
