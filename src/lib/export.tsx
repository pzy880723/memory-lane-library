/**
 * 导出 = 下载构建时预生成的静态文件。
 *
 * 文件由 scripts/prerender-exports.mjs 在 `npm run build` 时生成，
 * 输出到 `public/exports/`，vite 构建会自动复制到 `dist/exports/`。
 *
 * 实现细节：
 * - 用 fetch + blob 触发下载（而不是 <a href> 直接指向静态 URL）
 * - 这样浏览器永远走"保存"分支，不会发生顶层导航
 * - 在 Lovable 预览 iframe / 微信内置浏览器 / Safari 等环境下都能稳定不跳走当前 SPA
 */

const PDF_PATH = "/exports/BOOMER-OFF-Vintage-品牌手册.pdf";
const PPTX_PATH = "/exports/BOOMER-OFF-Vintage-品牌手册.pptx";

async function downloadAsBlob(url: string, filename: string): Promise<void> {
  // 1. 拉取静态文件二进制
  const res = await fetch(url, { cache: "force-cache" });
  if (!res.ok) {
    throw new Error(`无法获取文件 (${res.status} ${res.statusText})`);
  }
  const blob = await res.blob();

  // 2. 转 blob URL —— 浏览器对 blob: 协议的 download 属性 100% 遵守
  const blobUrl = URL.createObjectURL(blob);

  // 3. 触发本地保存
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = filename;
  a.style.display = "none";
  // rel=noopener 防止任何意外的 opener 引用
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();

  // 4. 释放 blob URL（延迟一点，确保浏览器已经开始下载）
  setTimeout(() => URL.revokeObjectURL(blobUrl), 4000);
}

export function downloadPDF(): Promise<void> {
  return downloadAsBlob(PDF_PATH, "BOOMER-OFF-Vintage-品牌手册.pdf");
}

export function downloadPPTX(): Promise<void> {
  return downloadAsBlob(PPTX_PATH, "BOOMER-OFF-Vintage-品牌手册.pptx");
}
