import { useQuery } from "convex/react";
import { useNavigate } from "react-router";
import { api } from "../../../convex/_generated/api";
import { useApp } from "@/store/AppStore";
import { FileTree } from "@/components/filetree/FileTree";
import { Search, EditSquare, FolderFileOpen, Setting } from "@/components/icons";
import { IconButton } from "@/components/ui";
import styles from "./LeftPanel.module.css";

export function LeftPanel() {
  const { createDoc, createFolder, setActiveDoc } = useApp();
  const navigate = useNavigate();
  const user = useQuery(api.users.getCurrentUser);

  async function handleNewDoc() {
    const id = await createDoc(undefined);
    setActiveDoc(id);
    navigate(`/doc/${id}`);
  }

  return (
    <aside className={styles.leftPanel}>
      {/* Icon toolbar — matches Figma's top icon row */}
      <div className={styles.leftPanelToolbar}>
        <IconButton size="sm" aria-label="Search" title="Search">
          <Search size={18} />
        </IconButton>
        <IconButton
          size="sm"
          aria-label="New document"
          title="New document"
          onClick={handleNewDoc}
        >
          <EditSquare size={18} />
        </IconButton>
        <IconButton
          size="sm"
          aria-label="New folder"
          title="New folder"
          onClick={() => void createFolder(undefined)}
        >
          <FolderFileOpen size={18} />
        </IconButton>
        <IconButton size="sm" aria-label="Settings" title="Settings">
          <Setting size={18} />
        </IconButton>
      </div>

      {/* File tree */}
      <div className={styles.leftPanelFileTree}>
        <FileTree />
      </div>

      {/* User footer */}
      <div className={styles.leftPanelFooter}>
        <div className={styles.leftPanelAvatar}>
          {user?.image ? (
            <img src={user.image} alt={user.name ?? "User"} className={styles.leftPanelAvatarImg} />
          ) : (
            <span className={styles.leftPanelAvatarFallback}>
              {(user?.name ?? "U").charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <span className={styles.leftPanelUserName}>{user?.name ?? "Anonymous"}</span>
      </div>
    </aside>
  );
}
