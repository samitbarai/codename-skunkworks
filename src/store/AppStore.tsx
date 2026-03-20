import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { useWorkspace } from "./WorkspaceProvider";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Doc {
  id: string;
  title: string;
  parentId: string | null;
  isFolder: boolean;
  updatedAt: number;
}

export interface AppState {
  docs: Doc[];
  activeDocId: string | null;
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;
  isLoading: boolean;
  // Actions
  createDoc: (title?: string, parentId?: string | null) => Promise<string>;
  createFolder: (title?: string, parentId?: string | null) => Promise<string>;
  renameDoc: (id: string, title: string) => void;
  deleteDoc: (id: string) => void;
  moveDoc: (id: string, parentId: string | null) => Promise<void>;
  setActiveDoc: (id: string | null) => void;
  toggleLeft: () => void;
  toggleRight: () => void;
  focusMode: boolean;
  toggleFocus: () => void;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const PREFS_KEY = "skunkworks-prefs";

function loadPrefs() {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) return JSON.parse(raw) as { leftOpen: boolean; rightOpen: boolean };
  } catch {}
  return { leftOpen: true, rightOpen: false };
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AppContext = createContext<AppState | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppStoreProvider");
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const { workspaceId } = useWorkspace();

  // Convex reactive query — returns undefined while loading
  const rawDocs = useQuery(api.documents.listDocuments, { workspaceId });

  // Convex mutations
  const createDocMut = useMutation(api.documents.createDocument);
  const renameMut = useMutation(api.documents.renameDocument);
  const deleteMut = useMutation(api.documents.deleteDocument);
  const moveMut = useMutation(api.documents.moveDocument);

  // Map Convex docs to our bridge type
  const docs: Doc[] = (rawDocs ?? []).map((d) => ({
    id: d._id,
    title: d.title,
    parentId: (d.parentId as string) ?? null,
    isFolder: d.isFolder,
    updatedAt: d.updatedAt,
  }));

  const isLoading = rawDocs === undefined;

  // Local UI state
  const prefs = loadPrefs();
  const [leftPanelOpen, setLeft] = useState(prefs.leftOpen);
  const [rightPanelOpen, setRight] = useState(prefs.rightOpen);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [focusMode, setFocusMode] = useState(false);
  const savedPanels = useRef({ left: prefs.leftOpen, right: prefs.rightOpen });

  // Persist panel prefs
  useEffect(() => {
    localStorage.setItem(PREFS_KEY, JSON.stringify({ leftOpen: leftPanelOpen, rightOpen: rightPanelOpen }));
  }, [leftPanelOpen, rightPanelOpen]);

  const createDoc = useCallback(
    async (title = "Untitled", parentId: string | null = null): Promise<string> => {
      const id = await createDocMut({
        title,
        workspaceId,
        parentId: parentId ? (parentId as Id<"documents">) : undefined,
        isFolder: false,
      });
      return id;
    },
    [createDocMut, workspaceId],
  );

  const createFolder = useCallback(
    async (title = "New Folder", parentId: string | null = null): Promise<string> => {
      const id = await createDocMut({
        title,
        workspaceId,
        parentId: parentId ? (parentId as Id<"documents">) : undefined,
        isFolder: true,
      });
      return id;
    },
    [createDocMut, workspaceId],
  );

  const renameDoc = useCallback(
    (id: string, title: string) => {
      renameMut({ documentId: id as Id<"documents">, title });
    },
    [renameMut],
  );

  const deleteDoc = useCallback(
    (id: string) => {
      deleteMut({ documentId: id as Id<"documents"> });
      setActiveDocId((cur) => (cur === id ? null : cur));
    },
    [deleteMut],
  );

  const moveDoc = useCallback(
    async (id: string, parentId: string | null): Promise<void> => {
      await moveMut({
        documentId: id as Id<"documents">,
        parentId: parentId ? (parentId as Id<"documents">) : undefined,
      });
    },
    [moveMut],
  );

  const setActiveDoc = useCallback((id: string | null) => setActiveDocId(id), []);
  const toggleLeft = useCallback(() => {
    if (focusMode) {
      savedPanels.current = { ...savedPanels.current, left: true };
      setFocusMode(false);
      return;
    }
    setLeft((v) => !v);
  }, [focusMode]);

  const toggleRight = useCallback(() => {
    if (focusMode) {
      savedPanels.current = { ...savedPanels.current, right: true };
      setFocusMode(false);
      return;
    }
    setRight((v) => !v);
  }, [focusMode]);

  const toggleFocus = useCallback(() => {
    setFocusMode((v) => {
      if (!v) {
        savedPanels.current = { left: leftPanelOpen, right: rightPanelOpen };
      }
      return !v;
    });
  }, [leftPanelOpen, rightPanelOpen]);

  useEffect(() => {
    if (focusMode) {
      setLeft(false);
      setRight(false);
    } else {
      setLeft(savedPanels.current.left);
      setRight(savedPanels.current.right);
    }
  }, [focusMode]);

  return (
    <AppContext.Provider
      value={{
        docs,
        activeDocId,
        leftPanelOpen,
        rightPanelOpen,
        isLoading,
        createDoc,
        createFolder,
        renameDoc,
        deleteDoc,
        moveDoc,
        setActiveDoc,
        toggleLeft,
        toggleRight,
        focusMode,
        toggleFocus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
