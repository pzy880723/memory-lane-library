import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
  type ReactNode,
} from "react";
import {
  loadOverrides, saveOverrides, setText, setImage, clearOverrides,
  type AllOverrides, type TextOverride, type ImageOverride,
} from "./storage";

const PASSWORDS = new Set(["880723", "pzy5565283", "boomer2016"]);
const SESSION_KEY = "boomer_off_editor_unlocked";

interface EditorContextValue {
  unlocked: boolean;
  editing: boolean;
  data: AllOverrides;
  currentSlide: number;
  setCurrentSlide: (i: number) => void;
  tryUnlock: (password: string) => boolean;
  lock: () => void;
  toggleEditing: () => void;
  updateText: (slideIndex: number, key: string, patch: TextOverride) => void;
  updateImage: (slideIndex: number, key: string, patch: ImageOverride) => void;
  resetAll: () => void;
  reload: (next: AllOverrides) => void;
}

const EditorContext = createContext<EditorContextValue | null>(null);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AllOverrides>(() => loadOverrides());
  const [unlocked, setUnlocked] = useState<boolean>(
    () => sessionStorage.getItem(SESSION_KEY) === "1",
  );
  const [editing, setEditing] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const dataRef = useRef(data);
  dataRef.current = data;

  // 防抖写入
  useEffect(() => {
    const t = setTimeout(() => saveOverrides(data), 300);
    return () => clearTimeout(t);
  }, [data]);

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
    setData((d) => setText(d, slideIndex, key, patch));
  }, []);

  const updateImage = useCallback((slideIndex: number, key: string, patch: ImageOverride) => {
    setData((d) => setImage(d, slideIndex, key, patch));
  }, []);

  const resetAll = useCallback(() => {
    clearOverrides();
    setData({ version: 1, updatedAt: new Date().toISOString(), slides: {} });
  }, []);

  const reload = useCallback((next: AllOverrides) => {
    setData(next);
    saveOverrides(next);
  }, []);

  const value = useMemo<EditorContextValue>(() => ({
    unlocked, editing, data, currentSlide, setCurrentSlide,
    tryUnlock, lock, toggleEditing,
    updateText, updateImage, resetAll, reload,
  }), [
    unlocked, editing, data, currentSlide,
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
