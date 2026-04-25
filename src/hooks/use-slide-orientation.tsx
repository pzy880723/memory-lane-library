import { useCallback, useEffect, useState } from "react";

export type SlideOrientation = "landscape" | "portrait";

const STORAGE_KEY = "slide-orientation-preference";

function detectInitialOrientation(): { orientation: SlideOrientation; isMobile: boolean } {
  if (typeof window === "undefined") return { orientation: "landscape", isMobile: false };

  const ua = navigator.userAgent || "";
  const isMobileUA = /iPhone|iPod|Android.*Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isNarrow = window.innerWidth < 768;
  const isPortraitViewport = window.innerHeight > window.innerWidth;
  const isMobile = isMobileUA || isNarrow;

  // 手机用户、窄屏、或竖屏视口 → 默认竖版
  const orientation: SlideOrientation =
    isMobile || isPortraitViewport ? "portrait" : "landscape";
  return { orientation, isMobile };
}

export function useSlideOrientation() {
  const [{ orientation, isMobile }, setState] = useState(() => detectInitialOrientation());
  const [isManual, setIsManual] = useState(false);

  // 初始化：读取 localStorage 用户偏好（覆盖自动检测）
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as SlideOrientation | null;
      if (saved === "landscape" || saved === "portrait") {
        setState((s) => ({ ...s, orientation: saved }));
        setIsManual(true);
      }
    } catch {
      /* noop */
    }
  }, []);

  // 视口变化时：仅当未手动选择时自动重新判断
  useEffect(() => {
    if (isManual) return;
    const onResize = () => {
      const detected = detectInitialOrientation();
      setState(detected);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, [isManual]);

  const setOrientation = useCallback((next: SlideOrientation) => {
    setState((s) => ({ ...s, orientation: next }));
    setIsManual(true);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* noop */
    }
  }, []);

  const toggleOrientation = useCallback(() => {
    setOrientation(orientation === "landscape" ? "portrait" : "landscape");
  }, [orientation, setOrientation]);

  const resetToAuto = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
    setIsManual(false);
    setState(detectInitialOrientation());
  }, []);

  return { orientation, setOrientation, toggleOrientation, resetToAuto, isManual, isMobile };
}
