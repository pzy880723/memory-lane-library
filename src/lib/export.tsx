/**
 * 导出 = 直接下载构建时预生成的静态文件。
 *
 * 文件由 scripts/prerender-exports.mjs 在 `npm run build` 时生成，
 * 输出到 `public/exports/`，vite 构建会自动复制到 `dist/exports/`。
 *
 * 用户点"下载" → 浏览器直接 GET 静态文件 → 0 等待。
 */

const PDF_PATH = "/exports/BOOMER-OFF-Vintage-品牌手册.pdf";
const PPTX_PATH = "/exports/BOOMER-OFF-Vintage-品牌手册.pptx";

function trigger(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function downloadPDF() {
  trigger(PDF_PATH, "BOOMER-OFF-Vintage-品牌手册.pdf");
}

export function downloadPPTX() {
  trigger(PPTX_PATH, "BOOMER-OFF-Vintage-品牌手册.pptx");
}
