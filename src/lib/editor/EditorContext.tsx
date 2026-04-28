import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
  type ReactNode,
} from "react";
import {
  loadOverridesLocal, saveOverridesLocal,
  loadOverridesRemote, saveOverridesRemote, clearOverridesRemote,
  setText, setImage, clearOverridesLocal,
  type AllOverrides, type TextOverride, type ImageOverride,
} from "./storage";

const PASSWORDS = new Set(["880723", "pzy5565283", "boomer2016"]);
const SESSION_KEY = "boomer_off_editor_unlocked";

interface EditorContextValue {
  unlocked: boolean;
  editing: boolean;
  data: AllOverrides;
  loaded: boolean;          // 云端已拉取一次
  saving: boolean;          // 正在写云端
  currentSlide: number;
  setCurrentSlide: (i: number) => void;
  tryUnlock: (password: string) => boolean;
  lock: () => void;
  toggleEditing: () => void;
  updateText: (slideIndex: number, key: string, patch: TextOverride) => void;
  updateImage: (slideIndex: number, key: string, patch: ImageOverride) => void;
  resetAll: () => void;
  reload: (next: AllOverrides) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const HISTORY_LIMIT = 50;

const EditorContext = createContext<EditorContextValue | null>(null);

export function EditorProvider({ children }: { children: ReactNode }) {
  // 启动时先用 localStorage 兜底,避免白屏
  const [data, setData] = useState<AllOverrides>(() => loadOverridesLocal());
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [unlocked, setUnlocked] = useState<boolean>(
    () => sessionStorage.getItem(SESSION_KEY) === "1",
  );
  const [editing, setEditing] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const dataRef = useRef(data);
  dataRef.current = data;
  // 跟踪是否需要写云端(避免初次拉云端覆盖本地后又回写)
  const dirtyRef = useRef(false);

  /* ─── 1. 启动:从云端拉取真源 ─── */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const remote = await loadOverridesRemote();
      if (cancelled) return;
      if (remote && Object.keys(remote.slides ?? {}).length > 0) {
        // 云端有内容 → 用云端
        setData(remote);
        saveOverridesLocal(remote);
      } else {
        // 云端没内容 + 本地有内容 → 一次性迁移到云端
        const local = loadOverridesLocal();
        const hasLocal = Object.keys(local.slides ?? {}).length > 0;
        if (hasLocal) {
          try {
            await saveOverridesRemote(local);
            console.info("[editor] migrated local overrides to cloud");
          } catch (e) {
            console.warn("[editor] migrate failed:", e);
          }
        }
      }
      setLoaded(true);
    })();
    return () => { cancelled = true; };
  }, []);

  /* ─── 2. 数据变更 → debounce 写云端 + 立刻写本地 ─── */
  useEffect(() => {
    // 启动初始化、远程加载这两次不应该触发回写
    if (!loaded || !dirtyRef.current) return;
    saveOverridesLocal(data);
    setSaving(true);
    const t = setTimeout(async () => {
      try {
        await saveOverridesRemote(data);
      } catch {
        // 错误已 console.warn,本地仍有兜底
      } finally {
        setSaving(false);
      }
    }, 600);
    return () => clearTimeout(t);
  }, [data, loaded]);

  const markDirtyAndSet = useCallback((updater: (prev: AllOverrides) => AllOverrides) => {
    dirtyRef.current = true;
    setData(updater);
  }, []);

  const tryUnlock = useCallback((password: string) => {
    if (PASSWORDS.has(password.trim())) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setUnlocked(true);
      setEditing(true);
      return true;
    }
    return false;
  }, []);

  const lock = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setUnlocked(false);
    setEditing(false);
  }, []);

  const toggleEditing = useCallback(() => {
    setEditing((e) => !e);
  }, []);

  const updateText = useCallback((slideIndex: number, key: string, patch: TextOverride) => {
    markDirtyAndSet((d) => setText(d, slideIndex, key, patch));
  }, [markDirtyAndSet]);

  const updateImage = useCallback((slideIndex: number, key: string, patch: ImageOverride) => {
    markDirtyAndSet((d) => setImage(d, slideIndex, key, patch));
  }, [markDirtyAndSet]);

  const resetAll = useCallback(() => {
    dirtyRef.current = true;
    clearOverridesLocal();
    void clearOverridesRemote();
    setData({ version: 1, updatedAt: new Date().toISOString(), slides: {} });
  }, []);

  const reload = useCallback((next: AllOverrides) => {
    dirtyRef.current = true;
    setData(next);
  }, []);

  const value = useMemo<EditorContextValue>(() => ({
    unlocked, editing, data, loaded, saving, currentSlide, setCurrentSlide,
    tryUnlock, lock, toggleEditing,
    updateText, updateImage, resetAll, reload,
  }), [
    unlocked, editing, data, loaded, saving, currentSlide,
    tryUnlock, lock, toggleEditing,
    updateText, updateImage, resetAll, reload,
  ]);

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used inside EditorProvider");
  return ctx;
}
