import styles from "./Message.module.css";

interface AIMessageProps {
  time: string;
  message: string;
}

function JamIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
  );
}

export function AIMessage({ time, message }: AIMessageProps) {
  return (
    <div className={styles.message}>
      {/* Avatar */}
      <div className={`${styles.avatar} ${styles.avatarAI}`}>
        <JamIcon />
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={`${styles.name} ${styles.nameAI}`}>Jam</span>
          <span className={styles.time}>{time}</span>
        </div>
        <p className={styles.body}>{message}</p>
      </div>
    </div>
  );
}
