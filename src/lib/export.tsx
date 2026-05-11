/**
 * 客户端导出 PDF / PPTX —— 真·网页高清截图版
 * ─────────────────────────────────────────────────────────────────
 * 原理:
 *  1. 计算当前内容指纹(版本 + 完整 overrides JSON + 页数)
 *  2. 查询 export_cache 表;命中则直接拿 file_url 下载
 *  3. 否则:
 *     - 在隐藏 iframe 里以 1920×1080 加载 /print/N 路由
 *       (Print 路由会自动应用最新 overrides + 等字体/图片就绪)
 *     - iframe 就绪后用 html-to-image (foreignObject SVG) 截取真实页面为 JPEG
 *     - PDF: pdf-lib 拼接;PPTX: pptxgenjs 拼接
 *  4. 上传到 Storage 的 exports 桶(每个 hash 一个独立文件,绝不复用)
 *  5. 触发 blob 下载
 *
 * 与上一版相比:
 *  - 截图来源是「真实网页」而非离屏 React 节点,杜绝字体/层级/拉伸失真
 *  - PDF 与 PPTX 使用同一批截图,视觉绝对一致
 *  - 缓存路径包含完整内容 hash,旧文件不会再回流
 */
import { supabase } from "@/integrations/supabase/client";
import { SLIDES } from "@/components/slides/registry";
import { loadOverridesRemote, type AllOverrides } from "@/lib/editor/storage";

const loadPdfLib = () => import("pdf-lib");
const loadPptxgen = () => import("pptxgenjs").then((m) => m.default);

const FILENAME_BASE = "BOOMER-OFF-Vintage-品牌手册";
const EXPORT_VERSION = "v5-browserless";
const CAPTURE_W = 1920;
const CAPTURE_H = 1080;
const CAPTURE_PIXEL_RATIO = 2;
const RENDER_CONCURRENCY = 1;

export type ExportPhase = "checking" | "rendering" | "packing" | "uploading" | "downloading";
export interface ExportProgress {
  phase: ExportPhase;
  current?: number;
  total?: number;
  message?: string;
}
export type ProgressCallback = (p: ExportProgress) => void;

/* ─────────────── 内容指纹 ─────────────── */

async function sha256(text: string): Promise<string> {
  const buf = new TextEncoder().encode(text);
  const hashBuf = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hashBuf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function stableStringify(obj: unknown): string {
  if (obj === null || typeof obj !== "object") return JSON.stringify(obj);
  if (Array.isArray(obj)) return `[${obj.map(stableStringify).join(",")}]`;
  const keys = Object.keys(obj as Record<string, unknown>).sort();
  return `{${keys
    .map((k) => `${JSON.stringify(k)}:${stableStringify((obj as Record<string, unknown>)[k])}`)
    .join(",")}}`;
}

async function computeContentHash(): Promise<string> {
  const overrides = (await loadOverridesRemote()) ?? ({ slides: {} } as AllOverrides);
  const stable = stableStringify(overrides.slides ?? {});
  return await sha256(`${EXPORT_VERSION}|n=${SLIDES.length}|${stable}`);
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
  const ext = type;
  // 路径包含完整 hash → 内容变了一定是新文件,不会被旧文件污染
  const path = `${type}/${EXPORT_VERSION}/${hash}.${ext}`;
  const { error: uploadErr } = await supabase.storage
    .from("exports")
    .upload(path, blob, {
      contentType:
        type === "pdf"
          ? "application/pdf"
          : "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      cacheControl: "31536000",
      upsert: true,
    });
  if (uploadErr) throw new Error(`上传失败: ${uploadErr.message}`);

  const { data: urlData } = supabase.storage.from("exports").getPublicUrl(path);
  const fileUrl = urlData.publicUrl;

  await supabase.from("export_cache").insert({
    type,
    content_hash: hash,
    file_path: path,
    file_url: fileUrl,
  });

  return fileUrl;
}

/* ─────────────── 隐藏 iframe 截屏 ─────────────── */

/* ─────────────── 服务端截图 (Browserless via Edge Function) ─────────────── */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
const RENDER_FN_URL = `${SUPABASE_URL}/functions/v1/render-slide`;

function publicPrintUrl(index: number, hashBust: string): string {
  // Browserless 必须能访问到这个 URL —— 用当前部署 origin
  return `${window.location.origin}/print/${index + 1}?v=${encodeURIComponent(hashBust)}`;
}

async function renderOneSlide(index: number, hashBust: string): Promise<Blob> {
  const url = publicPrintUrl(index, hashBust);
  const resp = await fetch(RENDER_FN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      url,
      width: CAPTURE_W,
      height: CAPTURE_H,
      pixelRatio: CAPTURE_PIXEL_RATIO,
      quality: 92,
    }),
  });
  if (!resp.ok) {
    let detail = "";
    try { detail = await resp.text(); } catch { /* noop */ }
    throw new Error(`第 ${index + 1} 页截图失败 (${resp.status}): ${detail.slice(0, 200)}`);
  }
  return await resp.blob();
}

async function renderAllSlidesToJpegs(
  hashBust: string,
  onProgress?: ProgressCallback,
): Promise<Blob[]> {
  const total = SLIDES.length;
  const out: Blob[] = new Array(total);
  let done = 0;
  let next = 0;

  async function worker() {
    while (true) {
      const i = next++;
      if (i >= total) return;
      out[i] = await renderOneSlide(i, hashBust);
      done++;
      onProgress?.({ phase: "rendering", current: done, total });
    }
  }

  onProgress?.({ phase: "rendering", current: 0, total });
  const workers = Array.from(
    { length: Math.min(RENDER_CONCURRENCY, total) },
    () => worker(),
  );
  await Promise.all(workers);
  return out;
}


/* ─────────────── PDF / PPTX 打包 ─────────────── */

async function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  return await blob.arrayBuffer();
}

async function buildPdf(jpegs: Blob[]): Promise<Blob> {
  const { PDFDocument } = await loadPdfLib();
  const pdf = await PDFDocument.create();
  pdf.setTitle("BOOMER OFF Vintage 品牌手册");
  pdf.setAuthor("宝暮(上海)品牌管理有限公司");
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
  pres.author = "宝暮(上海)品牌管理有限公司";

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

  const blob = (await pres.write({ outputType: "blob" })) as Blob;
  return blob;
}

/* ─────────────── 触发本地下载 ─────────────── */

async function triggerDownload(urlOrBlob: string | Blob, filename: string) {
  let href: string;
  let revoke = false;
  if (typeof urlOrBlob === "string") {
    // 加 cache-bust,避免浏览器/CDN 给到旧版本
    const sep = urlOrBlob.includes("?") ? "&" : "?";
    const bust = `${sep}t=${Date.now()}`;
    const res = await fetch(urlOrBlob + bust, { cache: "no-store" });
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
export const downloadPDF = exportPDF;
export const downloadPPTX = exportPPTX;

/* ─────────────── 后台静默预生成 + 状态广播 ─────────────── */

let lastPrecacheAt = 0;
const PRECACHE_MIN_INTERVAL_MS = 30_000;

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
export function getPrecacheStatus(): PrecacheStatus { return precacheStatus; }
export function subscribePrecache(fn: (s: PrecacheStatus) => void): () => void {
  precacheListeners.add(fn);
  return () => { precacheListeners.delete(fn); };
}

/* ─────────────── 共享渲染:同 hash 复用同一批截图 ─────────────── */

interface SharedRender {
  hash: string;
  jpegs: Blob[];
}
let sharedRenderInflight: Promise<SharedRender> | null = null;
let sharedRenderHash: string | null = null;

async function getOrRenderJpegs(
  hash: string,
  onProgress?: ProgressCallback,
): Promise<Blob[]> {
  if (sharedRenderInflight && sharedRenderHash === hash) {
    onProgress?.({ phase: "checking", message: "正在等待截图任务完成…" });
    return (await sharedRenderInflight).jpegs;
  }
  sharedRenderHash = hash;
  sharedRenderInflight = (async () => {
    const jpegs = await renderAllSlidesToJpegs(hash, onProgress);
    return { hash, jpegs };
  })();
  try {
    const r = await sharedRenderInflight;
    return r.jpegs;
  } finally {
    // 成功失败都清掉,下次基于最新 hash 重新决定
    sharedRenderInflight = null;
  }
}

/* ─────────────── 单 type 生成 + 上传 ─────────────── */

interface GenerateResult { url: string; hash: string; fromCache: boolean; }

const inflight: Record<"pdf" | "pptx", Promise<GenerateResult> | null> = { pdf: null, pptx: null };

async function generateAndCache(
  type: "pdf" | "pptx",
  opts: { force?: boolean; onProgress?: ProgressCallback; sharedHash?: string } = {},
): Promise<GenerateResult> {
  const { force = false, onProgress } = opts;

  onProgress?.({ phase: "checking", message: "检查云端缓存…" });
  const hash = opts.sharedHash ?? (await computeContentHash());

  if (!force) {
    const cached = await findCached(type, hash);
    if (cached) return { url: cached, hash, fromCache: true };
  }

  const jpegs = await getOrRenderJpegs(hash, onProgress);

  onProgress?.({ phase: "packing", message: type === "pdf" ? "正在生成 PDF…" : "正在生成 PPT…" });
  const fileBlob = type === "pdf" ? await buildPdf(jpegs) : await buildPptx(jpegs);

  onProgress?.({ phase: "uploading", message: "上传到云端缓存…" });
  let cdnUrl: string;
  try {
    cdnUrl = await uploadAndRecord(type, hash, fileBlob);
  } catch (err) {
    console.warn("[export] 上传缓存失败,改用本地 blob:", err);
    cdnUrl = URL.createObjectURL(fileBlob);
  }
  return { url: cdnUrl, hash, fromCache: false };
}

/* ─────────────── 后台预生成 ─────────────── */

export async function precacheAll(opts: { force?: boolean } = {}): Promise<void> {
  if (typeof document !== "undefined" && document.hidden) {
    console.info("[precache] 页面隐藏,跳过");
    return;
  }
  const now = Date.now();
  if (!opts.force && now - lastPrecacheAt < PRECACHE_MIN_INTERVAL_MS) {
    console.info("[precache] 距上次 < 30s,跳过");
    return;
  }

  const prevSuccess = precacheStatus.lastSuccessAt;
  setPrecacheStatus({ phase: "running", startedAt: now, lastSuccessAt: prevSuccess });
  if (successResetTimer) { clearTimeout(successResetTimer); successResetTimer = null; }

  // 先算一次 hash → 两个 type 共用,只截一遍图
  let hash: string;
  try {
    hash = await computeContentHash();
  } catch (err) {
    console.warn("[precache] 计算 hash 失败:", err);
    setPrecacheStatus({ phase: "error", lastSuccessAt: prevSuccess, message: String(err) });
    return;
  }

  const run = async (type: "pdf" | "pptx") => {
    if (inflight[type]) return inflight[type];
    const p = generateAndCache(type, { force: opts.force, sharedHash: hash })
      .catch((err) => {
        console.warn(`[precache] ${type} 失败:`, err);
        return null as unknown as GenerateResult;
      })
      .finally(() => { inflight[type] = null; });
    inflight[type] = p as Promise<GenerateResult>;
    return p;
  };

  console.info("[precache] 开始静默生成 PDF + PPTX…");
  try {
    const results = await Promise.all([run("pdf"), run("pptx")]);
    lastPrecacheAt = Date.now();
    const allOk = results.every((r) => !!r?.url);
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
  }
}

/* ─────────────── 主下载 ─────────────── */

async function runExport(type: "pdf" | "pptx", onProgress?: ProgressCallback): Promise<void> {
  const filename = `${FILENAME_BASE}.${type}`;

  // 等任何在跑的同 type 后台任务完成
  if (inflight[type]) {
    onProgress?.({ phase: "checking", message: "正在等待后台生成完成…" });
    try {
      const r = await inflight[type];
      if (r?.url) {
        onProgress?.({ phase: "downloading", message: "准备下载…" });
        await triggerDownload(r.url, filename);
        return;
      }
    } catch { /* fall through to fresh run */ }
  }

  const { url, fromCache } = await generateAndCache(type, { onProgress });
  onProgress?.({
    phase: "downloading",
    message: fromCache ? "命中缓存,准备下载…" : "保存到本地…",
  });
  if (!url) throw new Error("生成失败");
  await triggerDownload(url, filename);
}
