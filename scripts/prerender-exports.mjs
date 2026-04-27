/**
 * 预生成 PDF / PPTX 脚本
 * ------------------------------------------------------------------
 * 在 `npm run build` 中自动运行：
 *   1. 启动一个静态服务器服务 dist/ 目录
 *   2. 用 puppeteer 打开 /print/N 路由（每页 1920×1080 纯净渲染）
 *   3. 截图为高清 PNG（deviceScaleFactor=2）
 *   4. 用 pdf-lib 拼成 PDF，用 pptxgenjs 拼成 PPTX
 *   5. 输出到 dist/exports/ （用户访问 /exports/xxx 即可下载）
 * ------------------------------------------------------------------
 * 设计要点：
 * - 使用系统 chromium（避免下载 puppeteer 自带的 170MB chromium）
 * - 每页等待 body[data-ready="1"] —— 由 src/pages/Print.tsx 在所有图加载完后设置
 * - PDF 用 JPEG quality 92 嵌入（平衡画质/体积），PPTX 用同样的 JPEG buffer
 */
import { spawn } from "node:child_process";
import { mkdir, writeFile, readFile, access, copyFile } from "node:fs/promises";
import { existsSync, realpathSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";
import { PDFDocument } from "pdf-lib";
import pptxgen from "pptxgenjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const OUT_DIR = path.join(DIST, "exports");
const PUBLIC_OUT = path.join(ROOT, "public", "exports");

const FILENAME_BASE = "BOOMER-OFF-Vintage-品牌手册";
const PORT = 4173;
const HOST = `http://127.0.0.1:${PORT}`;

const TOTAL_SLIDES = 35; // 上限（实际由 Print 路由 clamp）；多截会 404，少截会缺页

/* ---------- 找系统 chromium ---------- */
function findChromium() {
  const candidates = [
    process.env.CHROME_BIN,
    "/bin/chromium",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
  ].filter(Boolean);
  for (const p of candidates) {
    if (!p) continue;
    try {
      // realpathSync 会解析符号链接（处理 nix store 的情况）
      const real = realpathSync(p);
      if (existsSync(real)) return real;
    } catch { /* not exist */ }
  }
  throw new Error(
    "找不到 Chromium 可执行文件。请安装 chromium / google-chrome，或设置环境变量 CHROME_BIN。",
  );
}

/* ---------- 启动静态服务器 ---------- */
async function startServer() {
  const serveBin = path.join(ROOT, "node_modules", ".bin", "serve");
  const proc = spawn(serveBin, ["-l", String(PORT), "-s", DIST], {
    stdio: ["ignore", "pipe", "pipe"],
  });
  // 等服务器就绪
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(`${HOST}/`);
      if (res.ok) return proc;
    } catch { /* not ready */ }
    await new Promise((r) => setTimeout(r, 250));
  }
  proc.kill();
  throw new Error("静态服务器启动超时");
}

/* ---------- 探测真实页数 ---------- */
async function detectSlideCount(page) {
  // 用 print 路由跳到一个明显不存在的大页码，react-router 会渲染 404
  // 我们改用一个更稳的方案：在 build 时由前端 expose 总数到 window
  // 这里先试 1..N，看 body 是否 ready
  for (let n = 1; n <= TOTAL_SLIDES + 1; n++) {
    const url = `${HOST}/print/${n}`;
    await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
    // Print 页面会把 body[data-ready] 置 1，NotFound 不会
    const ok = await page
      .waitForFunction(
        () => document.body.getAttribute("data-ready") === "1",
        { timeout: 4000 },
      )
      .then(() => true)
      .catch(() => false);
    if (!ok) return n - 1;
  }
  return TOTAL_SLIDES;
}

/* ---------- 截一页 ---------- */
async function snapPage(page, n) {
  const url = `${HOST}/print/${n}`;
  await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });
  await page.waitForFunction(
    () => document.body.getAttribute("data-ready") === "1",
    { timeout: 30000 },
  );
  // PNG 然后再交给 sharp/pdf-lib —— 但 PNG 体积大，直接截 jpeg 更快
  const buf = await page.screenshot({
    type: "jpeg",
    quality: 92,
    clip: { x: 0, y: 0, width: 1920, height: 1080 },
    omitBackground: false,
  });
  return buf;
}

/* ---------- 生成 PDF ---------- */
async function buildPDF(images, outPath) {
  const pdf = await PDFDocument.create();
  pdf.setTitle("BOOMER OFF Vintage 品牌手册");
  pdf.setAuthor("宝暮（上海）品牌管理有限公司");
  for (const buf of images) {
    const img = await pdf.embedJpg(buf);
    // 1920x1080 px @ 72dpi → 1920x1080 PDF points (jspdf 的旧约定一致)
    const page = pdf.addPage([1920, 1080]);
    page.drawImage(img, { x: 0, y: 0, width: 1920, height: 1080 });
  }
  const bytes = await pdf.save();
  await writeFile(outPath, bytes);
}

/* ---------- 生成 PPTX ---------- */
async function buildPPTX(images, outPath) {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5 inches (16:9)
  pres.title = "BOOMER OFF Vintage 品牌手册";
  pres.author = "宝暮（上海）品牌管理有限公司";
  for (const buf of images) {
    const slide = pres.addSlide();
    slide.background = { color: "F5EFE0" };
    slide.addImage({
      data: `data:image/jpeg;base64,${buf.toString("base64")}`,
      x: 0,
      y: 0,
      w: 13.333,
      h: 7.5,
    });
  }
  await pres.writeFile({ fileName: outPath });
}

/* ---------- 主流程 ---------- */
async function main() {
  if (!existsSync(DIST) || !existsSync(path.join(DIST, "index.html"))) {
    throw new Error(`找不到 dist/，请先跑 vite build。期望路径：${DIST}`);
  }
  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(PUBLIC_OUT, { recursive: true });

  console.log("⚙️  启动静态服务器…");
  const server = await startServer();
  console.log(`   服务运行在 ${HOST}`);

  const browser = await puppeteer.launch({
    executablePath: findChromium(),
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--font-render-hinting=none",
    ],
  });

  try {
    const page = await browser.newPage();
    // 1920×1080 @ 2x = 真实 3840×2160 截图（高清）
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 2,
    });

    console.log("🔍 探测幻灯片总数…");
    const total = await detectSlideCount(page);
    if (total <= 0) throw new Error("未检测到任何幻灯片");
    console.log(`   共 ${total} 页`);

    const images = [];
    for (let i = 1; i <= total; i++) {
      process.stdout.write(`📸 截图 ${i}/${total}…`);
      const t = Date.now();
      const buf = await snapPage(page, i);
      images.push(buf);
      console.log(` ${((Date.now() - t) / 1000).toFixed(1)}s  (${(buf.length / 1024).toFixed(0)}KB)`);
    }

    const pdfPath = path.join(OUT_DIR, `${FILENAME_BASE}.pdf`);
    const pptxPath = path.join(OUT_DIR, `${FILENAME_BASE}.pptx`);

    console.log("📄 生成 PDF…");
    await buildPDF(images, pdfPath);
    console.log(`   ✓ ${pdfPath}`);

    console.log("📊 生成 PPTX…");
    await buildPPTX(images, pptxPath);
    console.log(`   ✓ ${pptxPath}`);

    // 同时复制到 public/exports/，让下次开发模式 (vite dev) 也能下载
    await copyFile(pdfPath, path.join(PUBLIC_OUT, `${FILENAME_BASE}.pdf`));
    await copyFile(pptxPath, path.join(PUBLIC_OUT, `${FILENAME_BASE}.pptx`));
    console.log(`   ✓ 同步到 public/exports/`);
  } finally {
    await browser.close();
    server.kill();
  }
}

main().catch((err) => {
  console.error("❌ 预生成失败：", err);
  process.exit(1);
});
