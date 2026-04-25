import { SLIDES, SlideStaticRenderer } from "@/components/slides/registry";
import { createRoot } from "react-dom/client";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * 离屏渲染单页幻灯片为 1920x1080 PNG dataURL
 */
async function renderSlideToImage(index: number): Promise<string> {
  // 创建离屏容器
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "-99999px";
  container.style.left = "-99999px";
  container.style.width = "1920px";
  container.style.height = "1080px";
  container.style.zIndex = "-1";
  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(<SlideStaticRenderer index={index} />);

  // 等待渲染完成 + 字体加载
  await new Promise((r) => setTimeout(r, 500));
  if (document.fonts) await document.fonts.ready;
  await new Promise((r) => setTimeout(r, 200));

  const target = container.firstElementChild as HTMLElement;
  const canvas = await html2canvas(target || container, {
    width: 1920,
    height: 1080,
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
  onProgress?: (current: number, total: number) => void
) {
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [1920, 1080],
    compress: true,
  });

  for (let i = 0; i < SLIDES.length; i++) {
    onProgress?.(i + 1, SLIDES.length);
    const img = await renderSlideToImage(i);
    if (i > 0) pdf.addPage([1920, 1080], "landscape");
    pdf.addImage(img, "JPEG", 0, 0, 1920, 1080);
  }

  pdf.save("BOOMER-OFF-Vintage-品牌手册.pdf");
}

/**
 * 导出 PPTX（每页一张图作为幻灯片）
 */
export async function exportPPTX(
  onProgress?: (current: number, total: number) => void
) {
  const pptxgen = (await import("pptxgenjs")).default;
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5 inches (16:9)
  pres.title = "BOOMER OFF Vintage 品牌手册";
  pres.author = "宝暮（上海）品牌管理有限公司";

  for (let i = 0; i < SLIDES.length; i++) {
    onProgress?.(i + 1, SLIDES.length);
    const img = await renderSlideToImage(i);
    const slide = pres.addSlide();
    slide.background = { color: "F5EFE0" };
    slide.addImage({
      data: img,
      x: 0, y: 0,
      w: 13.333, h: 7.5,
    });
  }

  await pres.writeFile({ fileName: "BOOMER-OFF-Vintage-品牌手册.pptx" });
}
