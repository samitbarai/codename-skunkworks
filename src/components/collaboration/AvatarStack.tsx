import { useEffect, useState } from "react";
import type { HocuspocusProvider } from "@hocuspocus/provider";

import styles from "./AvatarStack.module.css";

interface AwarenessUser {
  name: string;
  color: string;
  clientId?: number;
}

interface AvatarStackProps {
  provider: HocuspocusProvider | null;
}

export function AvatarStack({ provider }: AvatarStackProps) {
  const [users, setUsers] = useState<AwarenessUser[]>([]);

  useEffect(() => {
    if (!provider) return;

    const awareness = provider.awareness;
    if (!awareness) return;

    function update() {
      const states = awareness!.getStates();
      const list: AwarenessUser[] = [];
      states.forEach((state, clientId) => {
        if (clientId === awareness!.clientID) return; // skip self
        if (state.user) {
          list.push({ ...state.user, clientId });
        }
      });
      setUsers(list);
    }

    awareness.on("change", update);
    update();

    return () => {
      awareness.off("change", update);
    };
  }, [provider]);

  if (users.length === 0) return null;

  return (
    <div className={styles.avatarStack} aria-label={`${users.length} collaborator${users.length > 1 ? "s" : ""} online`}>
      {users.slice(0, 5).map((u, i) => (
        <div
          key={u.clientId ?? `avatar-${i}`}
          className={styles.avatar}
          style={{ backgroundColor: u.color, zIndex: 5 - i }}
          title={u.name}
        >
          {u.name?.[0]?.toUpperCase() ?? "?"}
        </div>
      ))}
      {users.length > 5 && (
        <div className={styles.avatarOverflow}>+{users.length - 5}</div>
      )}
    </div>
  );
}
