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
import { precacheAll } from "@/lib/export";
import { editorLogin, editorLogout, editorSession } from "@/lib/bookApi";

interface EditorContextValue {
  unlocked: boolean;
  editing: boolean;
  data: AllOverrides;
  loaded: boolean;          // 云端已拉取一次
  saving: boolean;          // 正在写云端
  saveError: string | null;
  retrySave: () => void;
  currentSlide: number;
  setCurrentSlide: (i: number) => void;
  tryUnlock: (password: string) => Promise<boolean>;
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
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveAttempt, setSaveAttempt] = useState(0);
  const retrySave = useCallback(() => setSaveAttempt((attempt) => attempt + 1), []);
  const [unlocked, setUnlocked] = useState(false);
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
      try {
        const remote = await loadOverridesRemote();
        if (cancelled) return;
        if (!remote) throw new Error("服务器内容暂时不可用");
        setData(remote);
        saveOverridesLocal(remote);
        setLoaded(true);
      } catch {
        if (!cancelled) setSaveError("读取服务器内容失败，请刷新后再试。");
      }
    })();
    void editorSession().then((active) => { if (!cancelled) setUnlocked(active); }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  /* ─── 2. 数据变更 → debounce 写云端 + 立刻写本地 ─── */
  useEffect(() => {
    // 启动初始化、远程加载这两次不应该触发回写
    if (!loaded || !dirtyRef.current) return;
    saveOverridesLocal(data);
    setSaving(true);
    setSaveError(null);
    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        await saveOverridesRemote(data);
      } catch {
        if (!cancelled) setSaveError("云端保存失败，更改暂存于本机。请重试保存。");
      } finally {
        if (!cancelled) setSaving(false);
      }
    }, 600);
    return () => { cancelled = true; clearTimeout(t); };
  }, [data, loaded, saveAttempt]);

  /* ─── 2b. 数据变更 → 后台静默预生成 PDF/PPTX(更长 debounce) ─── */
  useEffect(() => {
    if (!loaded || !dirtyRef.current) return;
    const t = setTimeout(() => {
      void precacheAll({ force: true });
    }, 5000);
    return () => clearTimeout(t);
  }, [data, loaded]);

  // ─── 撤销/重做历史栈 ───
  const [historyVersion, setHistoryVersion] = useState(0); // 仅用于触发 canUndo/canRedo 重算
  const historyRef = useRef<AllOverrides[]>([]);   // 过去栈
  const futureRef = useRef<AllOverrides[]>([]);    // 未来栈
  const bumpHistory = () => setHistoryVersion((v) => v + 1);

  const pushHistory = useCallback((snapshot: AllOverrides) => {
    historyRef.current.push(snapshot);
    if (historyRef.current.length > HISTORY_LIMIT) historyRef.current.shift();
    futureRef.current = [];
    bumpHistory();
  }, []);

  const markDirtyAndSet = useCallback((updater: (prev: AllOverrides) => AllOverrides) => {
    dirtyRef.current = true;
    setData((prev) => {
      pushHistory(prev);
      return updater(prev);
    });
  }, [pushHistory]);

  const tryUnlock = useCallback(async (password: string) => {
    await editorLogin(password.trim());
    setUnlocked(true);
    setEditing(true);
    return true;
  }, []);

  const lock = useCallback(() => {
    void editorLogout().catch(console.warn);
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
    setData((prev) => {
      pushHistory(prev);
      return { version: 1, updatedAt: new Date().toISOString(), slides: {} };
    });
  }, [pushHistory]);

  const reload = useCallback((next: AllOverrides) => {
    dirtyRef.current = true;
    setData((prev) => {
      pushHistory(prev);
      return next;
    });
  }, [pushHistory]);

  const undo = useCallback(() => {
    const past = historyRef.current.pop();
    if (!past) return;
    dirtyRef.current = true;
    setData((curr) => {
      futureRef.current.push(curr);
      if (futureRef.current.length > HISTORY_LIMIT) futureRef.current.shift();
      return past;
    });
    bumpHistory();
  }, []);

  const redo = useCallback(() => {
    const next = futureRef.current.pop();
    if (!next) return;
    dirtyRef.current = true;
    setData((curr) => {
      historyRef.current.push(curr);
      if (historyRef.current.length > HISTORY_LIMIT) historyRef.current.shift();
      return next;
    });
    bumpHistory();
  }, []);

  const canUndo = historyRef.current.length > 0;
  const canRedo = futureRef.current.length > 0;
  // 引用 historyVersion 让 memo 重算
  void historyVersion;

  const value = useMemo<EditorContextValue>(() => ({
    unlocked, editing, data, loaded, saving, saveError, retrySave, currentSlide, setCurrentSlide,
    tryUnlock, lock, toggleEditing,
    updateText, updateImage, resetAll, reload,
    undo, redo, canUndo, canRedo,
  }), [
    unlocked, editing, data, loaded, saving, saveError, retrySave, currentSlide,
    tryUnlock, lock, toggleEditing,
    updateText, updateImage, resetAll, reload,
    undo, redo, canUndo, canRedo,
  ]);

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used inside EditorProvider");
  return ctx;
}
