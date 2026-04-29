/**
 * 客户端导出 PDF / PPTX
 * ─────────────────────────────────────────────────────────────────
 * 设计：
 *  1. 计算当前内容指纹（基于 EditorContext 中的 overrides JSON）
 *  2. 查询 export_cache 表：若 (type, content_hash) 已有 → 直接拿 file_url 下载
 *  3. 否则在浏览器里：
 *     - 用 SlideStaticRenderer 离屏渲染每页 1920×1080
 *     - 用 html2canvas 栅格化为 JPEG
 *     - PDF：用 pdf-lib 拼接
 *     - PPTX：用 pptxgenjs 拼接
 *  4. 上传到 Lovable Cloud Storage（exports 桶），写入 export_cache
 *  5. 触发 blob 下载
 *
 * 部署在任何环境（腾讯云 COS、Lovable preview、自建 nginx）都能用，
 * 不依赖任何静态预生成文件。
 */
import { createRoot } from "react-dom/client";
import { SLIDES, SlideStaticRenderer } from "@/components/slides/registry";
import { supabase } from "@/integrations/supabase/client";
import { loadOverridesRemote, type AllOverrides } from "@/lib/editor/storage";

// 大依赖按需懒加载，避免拖累首屏 bundle
const loadHtml2Canvas = () => import("html2canvas").then((m) => m.default);
const loadPdfLib = () => import("pdf-lib");
const loadPptxgen = () => import("pptxgenjs").then((m) => m.default);

const FILENAME_BASE = "BOOMER-OFF-Vintage-品牌手册";

export type ExportPhase = "checking" | "rendering" | "packing" | "uploading" | "downloading";
export interface ExportProgress {
  phase: ExportPhase;
  current?: number;
  total?: number;
  message?: string;
}
export type ProgressCallback = (p: ExportProgress) => void;

/* ─────────────── 内容指纹（让缓存能命中 / 失效）─────────────── */

async function sha256(text: string): Promise<string> {
  const buf = new TextEncoder().encode(text);
  const hashBuf = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hashBuf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function computeContentHash(): Promise<string> {
  // 拉最新 overrides 作为内容指纹（同时考虑代码版本，用 build hash 不容易拿，用 SLIDES.length 简单代表）
  const overrides = (await loadOverridesRemote()) ?? ({ slides: {} } as AllOverrides);
  // 排序 keys 让结果稳定
  const stable = JSON.stringify(overrides.slides ?? {}, Object.keys(overrides.slides ?? {}).sort());
  return await sha256(`v1|${SLIDES.length}|${stable}`);
}

/* ─────────────── 缓存查询 / 写入 ─────────────── */

async function findCached(type: "pdf" | "pptx", hash: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("export_cache")
    .select("file_url")
    .eq("type", type)
    .eq("content_hash", hash)
    .maybeSingle();
  if (error) {
    console.warn("[export] cache lookup failed:", error.message);
    return null;
  }
  return data?.file_url ?? null;
}

async function uploadAndRecord(
  type: "pdf" | "pptx",
  hash: string,
  blob: Blob,
): Promise<string> {
  const ext = type === "pdf" ? "pdf" : "pptx";
  const path = `${type}/${hash}.${ext}`;
  const { error: uploadErr } = await supabase.storage
    .from("exports")
    .upload(path, blob, {
      contentType: blob.type || (type === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.presentationml.presentation"),
      cacheControl: "31536000",
      upsert: true,
    });
  if (uploadErr) throw new Error(`上传失败: ${uploadErr.message}`);

  const { data: urlData } = supabase.storage.from("exports").getPublicUrl(path);
  const fileUrl = urlData.publicUrl;

  // 写缓存记录（如已存在因 unique 冲突会忽略）
  await supabase.from("export_cache").insert({
    type,
    content_hash: hash,
    file_path: path,
    file_url: fileUrl,
  });

  return fileUrl;
}

/* ─────────────── 离屏渲染单页为 JPEG ─────────────── */

async function renderSlideToJpeg(index: number, quality = 0.9): Promise<Blob> {
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "-99999px";
  container.style.left = "-99999px";
  container.style.width = "1920px";
  container.style.height = "1080px";
  container.style.zIndex = "-1";
  container.style.background = "transparent";
  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(<SlideStaticRenderer index={index} />);

  // 等渲染、字体、图片就绪
  await new Promise((r) => setTimeout(r, 250));
  if (document.fonts) {
    try { await document.fonts.ready; } catch { /* noop */ }
  }
  const imgs = Array.from(container.querySelectorAll("img"));
  await Promise.all(
    imgs.map((img) =>
      img.complete && img.naturalWidth > 0
        ? Promise.resolve()
        : new Promise<void>((res) => {
            img.addEventListener("load", () => res(), { once: true });
            img.addEventListener("error", () => res(), { once: true });
          }),
    ),
  );
  await new Promise((r) => setTimeout(r, 150));

  const target = (container.firstElementChild as HTMLElement) || container;
  const html2canvas = await loadHtml2Canvas();
  const canvas = await html2canvas(target, {
    width: 1920,
    height: 1080,
    windowWidth: 1920,
    windowHeight: 1080,
    scale: 1.5,
    useCORS: true,
    allowTaint: false,
    backgroundColor: null,
    logging: false,
    imageTimeout: 15000,
  });

  // 转成 Blob（比 dataURL 占内存少）
  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("canvas.toBlob 返回 null"))),
      "image/jpeg",
      quality,
    );
  });

  root.unmount();
  document.body.removeChild(container);
  return blob;
}

async function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  return await blob.arrayBuffer();
}

/* ─────────────── PDF / PPTX 打包 ─────────────── */

async function buildPdf(jpegs: Blob[]): Promise<Blob> {
  const { PDFDocument } = await loadPdfLib();
  const pdf = await PDFDocument.create();
  pdf.setTitle("BOOMER OFF Vintage 品牌手册");
  pdf.setAuthor("宝暮（上海）品牌管理有限公司");
  for (const jpeg of jpegs) {
    const bytes = new Uint8Array(await blobToArrayBuffer(jpeg));
    const img = await pdf.embedJpg(bytes);
    const page = pdf.addPage([1920, 1080]);
    page.drawImage(img, { x: 0, y: 0, width: 1920, height: 1080 });
  }
  const bytes = await pdf.save();
  return new Blob([bytes as BlobPart], { type: "application/pdf" });
}

async function buildPptx(jpegs: Blob[]): Promise<Blob> {
  const pptxgen = await loadPptxgen();
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5 inches (16:9)
  pres.title = "BOOMER OFF Vintage 品牌手册";
  pres.author = "宝暮（上海）品牌管理有限公司";

  for (const jpeg of jpegs) {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(jpeg);
    });
    const slide = pres.addSlide();
    slide.background = { color: "F5EFE0" };
    slide.addImage({ data: dataUrl, x: 0, y: 0, w: 13.333, h: 7.5 });
  }

  // pptxgenjs 在浏览器里支持 write 直接拿 Blob
  const blob = (await pres.write({ outputType: "blob" })) as Blob;
  return blob;
}

/* ─────────────── 触发本地下载 ─────────────── */

async function triggerDownload(urlOrBlob: string | Blob, filename: string) {
  let href: string;
  let revoke = false;
  if (typeof urlOrBlob === "string") {
    // 已是公开 URL，但为了避免顶层导航 / iframe 问题，仍 fetch 成 blob 再下载
    const res = await fetch(urlOrBlob, { cache: "no-store" });
    if (!res.ok) throw new Error(`下载失败: ${res.status}`);
    const blob = await res.blob();
    href = URL.createObjectURL(blob);
    revoke = true;
  } else {
    href = URL.createObjectURL(urlOrBlob);
    revoke = true;
  }
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  a.style.display = "none";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  if (revoke) setTimeout(() => URL.revokeObjectURL(href), 4000);
}

/* ─────────────── 主入口 ─────────────── */

export async function exportPDF(onProgress?: ProgressCallback): Promise<void> {
  return runExport("pdf", onProgress);
}

export async function exportPPTX(onProgress?: ProgressCallback): Promise<void> {
  return runExport("pptx", onProgress);
}

// 兼容旧调用方
export const downloadPDF = exportPDF;
export const downloadPPTX = exportPPTX;

/* ─────────────── 后台静默预生成 ─────────────── */

// 模块级并发锁,防止同一 type 重复跑;以及最近一次成功时间戳用于节流
const inflight: Record<"pdf" | "pptx", Promise<string | null> | null> = { pdf: null, pptx: null };
let lastPrecacheAt = 0;
const PRECACHE_MIN_INTERVAL_MS = 30_000; // 同一会话至少间隔 30s 才允许再跑一次

/* ─── 静默生成状态:供 UI 订阅 ─── */
export type PrecacheStatus =
  | { phase: "idle"; lastSuccessAt: number | null }
  | { phase: "running"; startedAt: number; lastSuccessAt: number | null }
  | { phase: "success"; lastSuccessAt: number }
  | { phase: "error"; lastSuccessAt: number | null; message?: string };

let precacheStatus: PrecacheStatus = { phase: "idle", lastSuccessAt: null };
const precacheListeners = new Set<(s: PrecacheStatus) => void>();
let successResetTimer: ReturnType<typeof setTimeout> | null = null;

function setPrecacheStatus(s: PrecacheStatus) {
  precacheStatus = s;
  precacheListeners.forEach((fn) => { try { fn(s); } catch { /* noop */ } });
}

export function getPrecacheStatus(): PrecacheStatus {
  return precacheStatus;
}

export function subscribePrecache(fn: (s: PrecacheStatus) => void): () => void {
  precacheListeners.add(fn);
  return () => { precacheListeners.delete(fn); };
}


interface GenerateResult { url: string | null; hash: string; fromCache: boolean; }

/**
 * 渲染 + 上传一个 type,但不触发下载。返回 CDN URL(失败为 null)。
 * - force=false:命中缓存直接返回
 * - force=true:跳过缓存查询,但同 hash 上传仍是 upsert(覆盖同 path)
 */
async function generateAndCache(
  type: "pdf" | "pptx",
  opts: { force?: boolean; onProgress?: ProgressCallback } = {},
): Promise<GenerateResult> {
  const { force = false, onProgress } = opts;
  const total = SLIDES.length;

  onProgress?.({ phase: "checking", message: "检查云端缓存…" });
  const hash = await computeContentHash();

  if (!force) {
    const cachedUrl = await findCached(type, hash);
    if (cachedUrl) return { url: cachedUrl, hash, fromCache: true };
  }

  const jpegs: Blob[] = [];
  for (let i = 0; i < total; i++) {
    onProgress?.({ phase: "rendering", current: i + 1, total });
    jpegs.push(await renderSlideToJpeg(i));
  }

  onProgress?.({ phase: "packing", message: type === "pdf" ? "正在生成 PDF…" : "正在生成 PPT…" });
  const fileBlob = type === "pdf" ? await buildPdf(jpegs) : await buildPptx(jpegs);

  onProgress?.({ phase: "uploading", message: "上传到云端缓存…" });
  let cdnUrl: string | null = null;
  try {
    cdnUrl = await uploadAndRecord(type, hash, fileBlob);
  } catch (err) {
    console.warn("[export] 上传缓存失败:", err);
  }

  // 给打包好的 blob 一个本地 URL 作为兜底,让调用方仍能下载
  if (!cdnUrl) {
    cdnUrl = URL.createObjectURL(fileBlob);
  }
  return { url: cdnUrl, hash, fromCache: false };
}

/**
 * 后台静默预生成 PDF + PPTX。错误不抛出,只 console.warn。
 * - 同 type 已有任务在跑则复用
 * - 页面隐藏时跳过
 * - 距上次成功 < 30s 时跳过
 */
export async function precacheAll(opts: { force?: boolean } = {}): Promise<void> {
  if (typeof document !== "undefined" && document.hidden) {
    console.info("[precache] 页面隐藏,跳过");
    return;
  }
  const now = Date.now();
  if (now - lastPrecacheAt < PRECACHE_MIN_INTERVAL_MS) {
    console.info("[precache] 距上次 < 30s,跳过");
    return;
  }

  const prevSuccess = precacheStatus.phase === "success" || precacheStatus.phase === "idle"
    ? precacheStatus.lastSuccessAt
    : precacheStatus.lastSuccessAt;
  setPrecacheStatus({ phase: "running", startedAt: now, lastSuccessAt: prevSuccess });
  if (successResetTimer) { clearTimeout(successResetTimer); successResetTimer = null; }

  const run = async (type: "pdf" | "pptx") => {
    if (inflight[type]) return inflight[type];
    const p = generateAndCache(type, { force: opts.force })
      .then((r) => r.url)
      .catch((err) => {
        console.warn(`[precache] ${type} 失败:`, err);
        return null;
      })
      .finally(() => { inflight[type] = null; });
    inflight[type] = p;
    return p;
  };

  console.info("[precache] 开始静默生成 PDF + PPTX…");
  try {
    const results = await Promise.all([run("pdf"), run("pptx")]);
    lastPrecacheAt = Date.now();
    const allOk = results.every((u) => !!u);
    if (allOk) {
      setPrecacheStatus({ phase: "success", lastSuccessAt: lastPrecacheAt });
      successResetTimer = setTimeout(() => {
        setPrecacheStatus({ phase: "idle", lastSuccessAt: lastPrecacheAt });
      }, 5000);
    } else {
      setPrecacheStatus({ phase: "error", lastSuccessAt: prevSuccess, message: "部分文档生成失败" });
      successResetTimer = setTimeout(() => {
        setPrecacheStatus({ phase: "idle", lastSuccessAt: prevSuccess });
      }, 5000);
    }
    console.info("[precache] 完成");
  } catch (err) {
    setPrecacheStatus({ phase: "error", lastSuccessAt: prevSuccess, message: String(err) });
    successResetTimer = setTimeout(() => {
      setPrecacheStatus({ phase: "idle", lastSuccessAt: prevSuccess });
    }, 5000);
  }
}

async function runExport(type: "pdf" | "pptx", onProgress?: ProgressCallback): Promise<void> {
  const filename = `${FILENAME_BASE}.${type}`;

  // 如果后台预生成正在跑,等它完成再下载,避免重复渲染
  if (inflight[type]) {
    onProgress?.({ phase: "checking", message: "正在等待后台生成完成…" });
    try {
      const url = await inflight[type];
      if (url) {
        onProgress?.({ phase: "downloading", message: "准备下载…" });
        await triggerDownload(url, filename);
        return;
      }
    } catch { /* 落入下面正常流程 */ }
  }

  const { url, fromCache } = await generateAndCache(type, { onProgress });
  if (fromCache) {
    onProgress?.({ phase: "downloading", message: "命中缓存,准备下载…" });
  } else {
    onProgress?.({ phase: "downloading", message: "保存到本地…" });
  }
  if (!url) throw new Error("生成失败");

  await triggerDownload(url, filename);
}
