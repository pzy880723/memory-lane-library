/**
 * 编辑数据本地存储层
 * 数据按 slide index + 元素 key 存放在 localStorage
 * 支持文字内容、字号、颜色、图片 URL 的覆盖
 */

export interface TextOverride {
  text?: string;
  fontSize?: string; // e.g. "32px"
  color?: string;    // e.g. "#c0392b"
}

export interface ImageOverride {
  src?: string; // URL 或 base64
}

export interface SlideOverrides {
  texts: Record<string, TextOverride>;   // key = 元素稳定 ID
  images: Record<string, ImageOverride>; // key = 元素稳定 ID
}

export interface AllOverrides {
  version: 1;
  updatedAt: string;
  slides: Record<number, SlideOverrides>; // slide index → overrides
}

const STORAGE_KEY = "boomer_off_editor_overrides_v1";

const empty = (): AllOverrides => ({
  version: 1,
  updatedAt: new Date().toISOString(),
  slides: {},
});

export function loadOverrides(): AllOverrides {
  if (typeof window === "undefined") return empty();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty();
    const parsed = JSON.parse(raw);
    if (parsed?.version !== 1) return empty();
    return parsed;
  } catch {
    return empty();
  }
}

export function saveOverrides(data: AllOverrides) {
  data.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearOverrides() {
  localStorage.removeItem(STORAGE_KEY);
}

export function setText(
  data: AllOverrides,
  slideIndex: number,
  key: string,
  patch: TextOverride,
): AllOverrides {
  const slide = data.slides[slideIndex] ?? { texts: {}, images: {} };
  const prev = slide.texts[key] ?? {};
  const merged: TextOverride = { ...prev, ...patch };
  // 清掉空值
  (Object.keys(merged) as (keyof TextOverride)[]).forEach((k) => {
    if (merged[k] === "" || merged[k] == null) delete merged[k];
  });
  const nextSlide: SlideOverrides = {
    ...slide,
    texts: { ...slide.texts, [key]: merged },
  };
  if (Object.keys(merged).length === 0) {
    delete nextSlide.texts[key];
  }
  return {
    ...data,
    slides: { ...data.slides, [slideIndex]: nextSlide },
  };
}

export function setImage(
  data: AllOverrides,
  slideIndex: number,
  key: string,
  patch: ImageOverride,
): AllOverrides {
  const slide = data.slides[slideIndex] ?? { texts: {}, images: {} };
  const prev = slide.images[key] ?? {};
  const merged: ImageOverride = { ...prev, ...patch };
  if (!merged.src) {
    const next = { ...slide.images };
    delete next[key];
    return {
      ...data,
      slides: { ...data.slides, [slideIndex]: { ...slide, images: next } },
    };
  }
  return {
    ...data,
    slides: {
      ...data.slides,
      [slideIndex]: { ...slide, images: { ...slide.images, [key]: merged } },
    },
  };
}

export function exportJSON(data: AllOverrides) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `boomer-off-content-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importJSON(file: File): Promise<AllOverrides> {
  const text = await file.text();
  const parsed = JSON.parse(text);
  if (parsed?.version !== 1 || !parsed?.slides) {
    throw new Error("无效的内容文件");
  }
  return parsed as AllOverrides;
}
