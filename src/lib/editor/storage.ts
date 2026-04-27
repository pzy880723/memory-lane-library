/**
 * 编辑数据持久化层
 * - 主存储:Lovable Cloud 数据库 `content_overrides` 表(单条 scope='default')
 * - 本地缓存:localStorage(离线兜底 + 启动加速)
 * - 图片:Lovable Cloud Storage `editor-images` bucket
 */
import { supabase } from "@/integrations/supabase/client";

export interface TextOverride {
  text?: string;
  fontSize?: string; // e.g. "32px"
  color?: string;    // e.g. "#c0392b"
}

export interface ImageOverride {
  src?: string; // 公开 URL(Storage)或 https:// 外链
}

export interface SlideOverrides {
  texts: Record<string, TextOverride>;
  images: Record<string, ImageOverride>;
}

export interface AllOverrides {
  version: 1;
  updatedAt: string;
  slides: Record<number, SlideOverrides>;
}

const STORAGE_KEY = "boomer_off_editor_overrides_v1";
const SCOPE = "default";
const IMAGE_BUCKET = "editor-images";

const empty = (): AllOverrides => ({
  version: 1,
  updatedAt: new Date().toISOString(),
  slides: {},
});

/* ─────────────── 本地缓存(同步,启动时立刻可用)─────────────── */

export function loadOverridesLocal(): AllOverrides {
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

export function saveOverridesLocal(data: AllOverrides) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // 容量超限不影响主流程,云端是真源
  }
}

export function clearOverridesLocal() {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
}

/* ─────────────── 云端读写(异步,真源)─────────────── */

export async function loadOverridesRemote(): Promise<AllOverrides | null> {
  const { data, error } = await supabase
    .from("content_overrides")
    .select("data")
    .eq("scope", SCOPE)
    .maybeSingle();
  if (error) {
    console.warn("[storage] load remote failed:", error.message);
    return null;
  }
  if (!data) return null;
  const parsed = data.data as unknown;
  if (parsed && typeof parsed === "object" && (parsed as AllOverrides).version === 1) {
    return parsed as AllOverrides;
  }
  return null;
}

export async function saveOverridesRemote(data: AllOverrides): Promise<void> {
  data.updatedAt = new Date().toISOString();
  const row = { scope: SCOPE, data: data as unknown as never };
  const { error } = await supabase
    .from("content_overrides")
    .upsert(row, { onConflict: "scope" });
  if (error) {
    console.warn("[storage] save remote failed:", error.message);
    throw error;
  }
}

export async function clearOverridesRemote(): Promise<void> {
  const row = { scope: SCOPE, data: empty() as unknown as never };
  const { error } = await supabase
    .from("content_overrides")
    .upsert(row, { onConflict: "scope" });
  if (error) console.warn("[storage] clear remote failed:", error.message);
}

/* ─────────────── 图片上传到 Storage ─────────────── */

/**
 * 上传一张图片到 editor-images bucket,返回公开 URL。
 * 路径形如 slide-12/abc123-1738000000.jpg
 */
export async function uploadImageToCloud(
  file: File,
  slideIndex: number,
  key: string,
): Promise<string> {
  // 文件名清理,只保留扩展名
  const m = /\.([a-z0-9]{1,5})$/i.exec(file.name);
  const ext = (m ? m[1] : (file.type.split("/")[1] ?? "bin")).toLowerCase();
  // key 可能包含 / 等,做安全替换
  const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 60);
  const path = `slide-${slideIndex}/${safeKey}-${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(path, file, {
      cacheControl: "31536000",
      upsert: false,
      contentType: file.type || undefined,
    });
  if (error) throw error;

  const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/* ─────────────── 兼容旧 API(部分组件还在用)─────────────── */

/** @deprecated 请改用 loadOverridesLocal + loadOverridesRemote */
export const loadOverrides = loadOverridesLocal;

/** @deprecated 请改用 saveOverridesLocal + saveOverridesRemote */
export function saveOverrides(data: AllOverrides) {
  saveOverridesLocal(data);
}

/** @deprecated 请改用 clearOverridesLocal + clearOverridesRemote */
export const clearOverrides = clearOverridesLocal;

/* ─────────────── 不可变更新工具(纯函数)─────────────── */

export function setText(
  data: AllOverrides,
  slideIndex: number,
  key: string,
  patch: TextOverride,
): AllOverrides {
  const slide = data.slides[slideIndex] ?? { texts: {}, images: {} };
  const prev = slide.texts[key] ?? {};
  const merged: TextOverride = { ...prev, ...patch };
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
