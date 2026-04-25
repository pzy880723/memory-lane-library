import { SLIDES, SlideStaticRenderer } from "@/components/slides/registry";
import { SLIDES_PORTRAIT, SlideStaticRendererPortrait } from "@/components/slides/registryPortrait";
import { createRoot } from "react-dom/client";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

type Orientation = "landscape" | "portrait";

/**
 * 离屏渲染单页幻灯片为 PNG dataURL
 */
async function renderSlideToImage(index: number, orientation: Orientation): Promise<string> {
  const W = orientation === "portrait" ? 1080 : 1920;
  const H = orientation === "portrait" ? 1920 : 1080;

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "-99999px";
  container.style.left = "-99999px";
  container.style.width = `${W}px`;
  container.style.height = `${H}px`;
  container.style.zIndex = "-1";
  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(
    orientation === "portrait"
      ? <SlideStaticRendererPortrait index={index} />
      : <SlideStaticRenderer index={index} />
  );

  await new Promise((r) => setTimeout(r, 500));
  if (document.fonts) await document.fonts.ready;
  await new Promise((r) => setTimeout(r, 200));

  const target = container.firstElementChild as HTMLElement;
  const canvas = await html2canvas(target || container, {
    width: W,
    height: H,
    scale: 1,
    useCORS: true,
    backgroundColor: null,
    logging: false,
  });

  const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
  root.unmount();
  document.body.removeChild(container);
  return dataUrl;
}

/**
 * 导出 PDF
 */
export async function exportPDF(
  onProgress?: (current: number, total: number) => void,
  orientation: Orientation = "landscape"
) {
  const slides = orientation === "portrait" ? SLIDES_PORTRAIT : SLIDES;
  const W = orientation === "portrait" ? 1080 : 1920;
  const H = orientation === "portrait" ? 1920 : 1080;

  const pdf = new jsPDF({
    orientation: orientation === "portrait" ? "portrait" : "landscape",
    unit: "px",
    format: [W, H],
    compress: true,
  });

  for (let i = 0; i < slides.length; i++) {
    onProgress?.(i + 1, slides.length);
    const img = await renderSlideToImage(i, orientation);
    if (i > 0) pdf.addPage([W, H], orientation === "portrait" ? "portrait" : "landscape");
    pdf.addImage(img, "JPEG", 0, 0, W, H);
  }

  const suffix = orientation === "portrait" ? "竖版" : "横版";
  pdf.save(`BOOMER-OFF-Vintage-品牌手册-${suffix}.pdf`);
}

/**
 * 导出 PPTX
 */
export async function exportPPTX(
  onProgress?: (current: number, total: number) => void,
  orientation: Orientation = "landscape"
) {
  const slides = orientation === "portrait" ? SLIDES_PORTRAIT : SLIDES;
  const pptxgen = (await import("pptxgenjs")).default;
  const pres = new pptxgen();

  if (orientation === "portrait") {
    // 自定义竖版尺寸 (9:16) — 7.5" × 13.333"
    pres.defineLayout({ name: "PORTRAIT_9_16", width: 7.5, height: 13.333 });
    pres.layout = "PORTRAIT_9_16";
  } else {
    pres.layout = "LAYOUT_WIDE"; // 13.333 × 7.5 (16:9)
  }
  pres.title = "BOOMER OFF Vintage 品牌手册";
  pres.author = "宝暮（上海）品牌管理有限公司";

  const slideW = orientation === "portrait" ? 7.5 : 13.333;
  const slideH = orientation === "portrait" ? 13.333 : 7.5;

  for (let i = 0; i < slides.length; i++) {
    onProgress?.(i + 1, slides.length);
    const img = await renderSlideToImage(i, orientation);
    const slide = pres.addSlide();
    slide.background = { color: "F5EFE0" };
    slide.addImage({ data: img, x: 0, y: 0, w: slideW, h: slideH });
  }

  const suffix = orientation === "portrait" ? "竖版" : "横版";
  await pres.writeFile({ fileName: `BOOMER-OFF-Vintage-品牌手册-${suffix}.pptx` });
}
