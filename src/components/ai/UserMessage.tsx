import styles from "./Message.module.css";

interface UserMessageProps {
  avatarUrl?: string;
  name: string;
  time: string;
  message: string;
}

export function UserMessage({ avatarUrl, name, time, message }: UserMessageProps) {
  return (
    <div className={styles.message}>
      {/* Avatar */}
      <div className={styles.avatar}>
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className={styles.avatarImg} />
        ) : (
          <span className={styles.avatarFallback}>{name.charAt(0).toUpperCase()}</span>
        )}
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.name}>{name}</span>
          <span className={styles.time}>{time}</span>
        </div>
        <p className={styles.body}>{message}</p>
      </div>
    </div>
  );
}
