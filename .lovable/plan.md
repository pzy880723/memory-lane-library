## 目标（你确认过的）

1. **导出的 PDF/PPTX 跟网页看到的一模一样**（用 1920×1080 高清截图，逐页拼成）
2. **构建时预生成**，文件直接放在 `public/exports/` 下，用户点"下载"= 浏览器直接 GET 静态文件，**0 等待**
3. **删除"导出对比预览"功能**（无意义）
4. 编辑器修改不需要反映到导出（你已确认）— 导出的就是"线上发布版本"

---

## 方案概览

```
你执行 npm run build 时：
  ├─ 1. vite build           （正常构建网页）
  ├─ 2. 启动 Headless Chromium（puppeteer）
  ├─ 3. 打开刚 build 出来的页面，逐页截 1920×1080 高清 PNG
  ├─ 4. 把 PNG 拼成 PDF 和 PPTX
  └─ 5. 输出到 dist/exports/BOOMER-OFF-Vintage-品牌手册.pdf / .pptx

用户点"下载 PDF"：
  └─ <a href="/exports/BOOMER-OFF-Vintage-品牌手册.pdf" download> → 瞬间下载
```

为什么用 puppeteer 而不是当前的 html2canvas：
- html2canvas 是"模拟渲染"，复杂 CSS（阴影、滤镜、字体）会有误差 → 这就是为什么之前需要"对比预览"
- puppeteer 是真 Chromium，**所见即所得，100% 一致**，再也不需要对比

---

## 详细实施步骤

### 1. 新增构建脚本 `scripts/prerender-exports.mjs`

- 用 `puppeteer-core` + `@sparticuz/chromium`（或本地 Chrome）
- 启动 `vite preview` 服务（端口 4173）作为静态服务器
- 打开 `http://localhost:4173/#slide-1` … `#slide-N`，每页等字体/图片 ready
- 用 `page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 })` 拿到 **2x 高清**截图
- 用 `pdf-lib` 把所有 PNG 拼成 1920×1080 的 PDF（无损 JPEG quality 95）
- 用 `pptxgenjs`（已有依赖）把同样的 PNG 拼成 PPTX，每张图铺满整页
- 输出到 `public/exports/BOOMER-OFF-Vintage-品牌手册.pdf` 和 `.pptx`
- **关键**：放 `public/exports/` 而不是 `dist/exports/`，这样 vite build 会自动复制到 `dist/`，下次开发也能用

### 2. 修改 `package.json` build 脚本

```json
"build": "vite build && node scripts/prerender-exports.mjs",
"build:exports": "node scripts/prerender-exports.mjs"   // 单独跑导出（不重新 build）
```

新增依赖：`puppeteer`（约 170MB，仅 devDependencies，不进生产 bundle）和 `pdf-lib`。

### 3. 改写 `src/lib/export.tsx` → 极简版

```ts
export function downloadPDF() {
  const a = document.createElement("a");
  a.href = "/exports/BOOMER-OFF-Vintage-品牌手册.pdf";
  a.download = "BOOMER-OFF-Vintage-品牌手册.pdf";
  a.click();
}
export function downloadPPTX() { /* 同理 */ }
```

**删除**：`renderSlideToImage`、`html2canvas`、`jsPDF` 相关代码、`ExportPreviewItem`、`getLastExportPreview`、`ExportCancelledError`、进度回调 — 全部不再需要。

### 4. 移除 `package.json` 里不再用的依赖

- `html2canvas`（导出用，删）
- `jspdf`（导出用，删）
- `pptxgenjs` 改为 devDependencies（只构建时用）
- 这能让生产 bundle **小约 800KB**（jspdf + html2canvas 都很大），网页打开更快

### 5. 改写 `src/pages/Index.tsx`

- `handleExport(type)` → 改成 `downloadPDF()` / `downloadPPTX()`，瞬间触发
- 删除：`exporting` state、`exportPreview` state、`exportAbortRef`、`cancelExport`、所有"对比预览" JSX（约 130 行，对应 line 633-760 那块）、"生成中 N/Total" 进度文案
- 下拉菜单的"下载 PDF / 下载 PPT"按钮保留，但点击后**立即下载，无 loading**

### 6. 关于编辑器

由于你确认"编辑器修改不需要进导出"：
- 编辑器的功能保留（5 击 logo 仍能进入），但导出按钮在编辑模式下可以**显示一个小提示**："下载的是线上版本，编辑内容仅本地预览"
- 或者直接不管，让用户知道下载 = 线上发布版

### 7. 部署流程对你来说会变成

1. 在 Lovable 改完内容
2. 点 Publish（Lovable 会跑 `npm run build`，自动生成新的 pdf/pptx 进 `dist/exports/`）
3. 部署完成后，`https://你的域名/exports/xxx.pdf` 就是最新版

> ⚠️ **关键确认点**：Lovable 的构建环境**能不能跑 puppeteer**？这取决于 Lovable 的 build sandbox 是否预装了 Chromium 或允许 npm 装 puppeteer（170MB 二进制）。我下一步实施时会先验证；如果 Lovable build 环境不支持，备选方案是：
> - **备选 A**：用 `playwright-core` + 系统已有的 Chrome
> - **备选 B**：你**本地手动跑 `npm run build:exports` 一次，把生成的两个文件 commit 进 `public/exports/`**，之后 Lovable 每次部署都直接复制这两个静态文件。这种最稳，缺点是内容更新后要本地再跑一次。

---

## 删改清单一览

| 文件 | 操作 |
|---|---|
| `scripts/prerender-exports.mjs` | **新增**（核心构建脚本） |
| `src/lib/export.tsx` | **重写**（从 200 行 → ~20 行） |
| `src/pages/Index.tsx` | 删除导出进度/对比预览 UI（~150 行） |
| `package.json` | 改 build 脚本；加 puppeteer/pdf-lib；删 html2canvas/jspdf |
| `public/exports/.gitkeep` | 新增占位 |

---

## 你能拿到的效果

| 项目 | 现在 | 改造后 |
|---|---|---|
| 用户点下载到拿到文件 | 30~90 秒（在线渲染） | **<1 秒** |
| 文件画质 | html2canvas 模拟，有偏差 | **真 Chromium 渲染，像素级一致** |
| 网页 bundle 体积 | 含 html2canvas+jspdf ~800KB | **小 800KB，首屏更快** |
| 对比预览功能 | 占代码 150 行 | **删除** |
| 导出失败概率 | 偶发（用户设备性能差时） | **0**（构建时已生成好） |
