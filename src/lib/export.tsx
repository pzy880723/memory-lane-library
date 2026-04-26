import { SLIDES, SlideStaticRenderer } from "@/components/slides/registry";
import { createRoot } from "react-dom/client";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * 离屏渲染单页幻灯片为 1920x1080 PNG/JPEG dataURL
 *
 * 关键约束：
 * - 与预览页面用同一个 SLIDES[i].render() —— DOM/CSS 完全一致
 * - html2canvas 栅格化整页为图片：border-radius、box-shadow、阴影、字体均保留
 * - 嵌入 PPT 时是「整页大图」，PowerPoint 不会重排元素 → 圆角不会被改
 */
async function renderSlideToImage(
  index: number,
  format: "jpeg" | "png" = "jpeg",
): Promise<string> {
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "-99999px";
  container.style.left = "-99999px";
  container.style.width = "1920px";
  container.style.height = "1080px";
  container.style.zIndex = "-1";
  // 防止外层全局样式影响
  container.style.background = "transparent";
  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(<SlideStaticRenderer index={index} />);

  // 等待渲染、字体、图片全部就绪
  await new Promise((r) => setTimeout(r, 350));
  if (document.fonts) {
    try { await document.fonts.ready; } catch { /* noop */ }
  }
  // 等待容器内所有 <img> 加载完成（含 logo / 实拍 / 二维码）
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
  await new Promise((r) => setTimeout(r, 200));

  const target = (container.firstElementChild as HTMLElement) || container;

  // scale: 1.5 提高清晰度，圆角边缘抗锯齿更好；同时不至于让文件爆炸
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

  const dataUrl =
    format === "png"
      ? canvas.toDataURL("image/png")
      : canvas.toDataURL("image/jpeg", 0.94);

  root.unmount();
  document.body.removeChild(container);

  return dataUrl;
}

/* ─────────────────────────  对比预览数据缓存  ───────────────────────── */

export interface ExportPreviewItem {
  index: number;
  title: string;
  imageDataUrl: string;
}

let lastExportPreview: ExportPreviewItem[] = [];

export function getLastExportPreview(): ExportPreviewItem[] {
  return lastExportPreview;
}

/* ───────────────────────────────  PDF  ─────────────────────────────── */

export class ExportCancelledError extends Error {
  constructor() {
    super("Export cancelled");
    this.name = "ExportCancelledError";
  }
}

export interface ExportOptions {
  signal?: AbortSignal;
}

function checkAborted(signal?: AbortSignal) {
  if (signal?.aborted) throw new ExportCancelledError();
}

export async function exportPDF(
  onProgress?: (current: number, total: number) => void,
  options?: ExportOptions,
) {
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [1920, 1080],
    compress: true,
  });

  const previews: ExportPreviewItem[] = [];

  for (let i = 0; i < SLIDES.length; i++) {
    checkAborted(options?.signal);
    onProgress?.(i + 1, SLIDES.length);
    const img = await renderSlideToImage(i, "jpeg");
    checkAborted(options?.signal);
    if (i > 0) pdf.addPage([1920, 1080], "landscape");
    pdf.addImage(img, "JPEG", 0, 0, 1920, 1080);
    previews.push({ index: i, title: SLIDES[i].title, imageDataUrl: img });
  }

  lastExportPreview = previews;
  pdf.save("BOOMER-OFF-Vintage-品牌手册.pdf");
  return previews;
}

/* ───────────────────────────────  PPTX  ────────────────────────────── */

export async function exportPPTX(
  onProgress?: (current: number, total: number) => void,
  options?: ExportOptions,
) {
  const pptxgen = (await import("pptxgenjs")).default;
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5 inches (16:9)
  pres.title = "BOOMER OFF Vintage 品牌手册";
  pres.author = "宝暮（上海）品牌管理有限公司";

  const previews: ExportPreviewItem[] = [];

  for (let i = 0; i < SLIDES.length; i++) {
    checkAborted(options?.signal);
    onProgress?.(i + 1, SLIDES.length);
    const img = await renderSlideToImage(i, "jpeg");
    checkAborted(options?.signal);
    const slide = pres.addSlide();
    slide.background = { color: "F5EFE0" };
    slide.addImage({
      data: img,
      x: 0,
      y: 0,
      w: 13.333,
      h: 7.5,
    });
    previews.push({ index: i, title: SLIDES[i].title, imageDataUrl: img });
  }

  lastExportPreview = previews;
  await pres.writeFile({ fileName: "BOOMER-OFF-Vintage-品牌手册.pptx" });
  return previews;
}
