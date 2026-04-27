## 🎯 目标

让"下载 PDF / PPT"在 **任何部署环境**（Lovable 预览、腾讯云 COS+CDN、自己服务器）下都稳定可用，不再依赖本地构建是否产出了静态文件。

## 🔍 当前问题根因

1. **`public/exports/` 在 git 仓库里只有 `.gitkeep`**，没有真实的 PDF/PPTX 文件
2. `scripts/prerender-exports.mjs` 需要 puppeteer + chromium，**只能在你本地 `npm run build` 时跑**，腾讯云 COS 是纯静态托管不会跑构建脚本
3. 部署到腾讯云后，前端去 fetch `/exports/xxx.pdf` → **404** → 报"网络问题"

另外即便每次本地都构建并上传，也有这些痛点：
- 用户在编辑器里改了文字/图片后，导出的还是旧版本
- 中文文件名在某些 CDN 节点不稳定
- 文件大（几十 MB），上传 COS 慢

## 🏗️ 解决方案架构

```
┌─────────────────┐     ┌────────────────────────┐     ┌──────────────────┐
│ 前端（腾讯云）   │ →  │ Edge Function          │ →  │ Lovable Cloud    │
│ 点击"下载"       │     │ generate-export        │     │ Storage          │
│                 │     │ (Deno + Puppeteer-less)│     │ exports/ 桶      │
└─────────────────┘     └────────────────────────┘     └──────────────────┘
        ↑                                                       │
        └──────────  返回永久 CDN URL，浏览器直接下载  ──────────┘
```

### 核心思路：**云端按需生成，缓存到 Storage**

- 把 PDF/PPTX 生成逻辑从本地构建脚本搬到 **Lovable Cloud Edge Function**
- 第一次有人点"下载"时，Edge Function 渲染并把文件存到 Storage 桶
- 之后所有人下载，直接命中 Storage 永久 URL（CDN 加速、永不 404）
- 内容编辑过后，让缓存失效并重新生成

## 📋 实施步骤

### 1. 创建 Storage 桶 `exports`（公开读）

存生成好的 PDF/PPTX，文件名按内容哈希区分版本。

### 2. 创建 `export_cache` 数据表

```
- id (uuid)
- type ('pdf' | 'pptx')
- content_hash (text)        // 基于 content_overrides 的哈希
- file_path (text)           // Storage 中的路径
- file_url (text)            // 公开下载 URL
- status ('pending'|'ready'|'failed')
- created_at, updated_at
```

启用 RLS：所有人可读，只有服务端可写。

### 3. 新建 Edge Function `generate-export`

参数：`{ type: 'pdf' | 'pptx' }`

逻辑：
1. 读取最新的 `content_overrides` → 计算 hash
2. 查 `export_cache` 是否已有 (type, hash) 的 ready 记录 → 有就直接返回 URL
3. 否则插入 pending 记录、立即返回 `{ status: 'pending', jobId }`
4. 后台异步执行：
   - **PDF**：直接用 `pdf-lib` 在 Deno 中拼接（不需要 chromium）
     - 把每张幻灯片渲染成 SVG → 用 `pdf-lib` 嵌入；或者
     - 调用 Lovable AI Gateway 的 `gemini-3-pro-image-preview` 或外部 API 把渲染好的 HTML/data 转成截图
   - **更稳的方案**：调用 **Browserless / Bright Data / ScreenshotOne** 这类「云端无头浏览器即服务」（每月有免费额度）截图，再拼 PDF/PPTX。这个最匹配现有 puppeteer 逻辑，质量 100% 一致。
5. 完成后上传到 Storage，更新 `export_cache.status = ready`

### 4. 前端 `src/lib/export.tsx` 改造

```ts
async function downloadExport(type: 'pdf' | 'pptx') {
  // 1. 调 Edge Function
  const { data } = await supabase.functions.invoke('generate-export', { body: { type } });
  
  // 2. 如果 ready 直接下载
  if (data.status === 'ready') return downloadAsBlob(data.url, filename);
  
  // 3. 如果 pending，轮询数据库（或用 Realtime 订阅）
  await pollUntilReady(data.jobId);
  // ... 拉到 url 后 downloadAsBlob
}
```

UI 上显示进度："正在生成中…（首次约 60 秒，之后秒下）"

### 5. 缓存失效

在 `EditorContext` 保存 overrides 后，可选地把 `export_cache` 中所有 ready 记录标记为 stale，下次下载触发重新生成。

### 6. 兼容老逻辑（可选保留）

保留 `public/exports/` 作为本地预览的 fallback：先 fetch 本地静态文件，404 再走 Edge Function。这样在 Lovable 自身的预览环境（已经有打包好的文件）依然秒下载。

## 🌐 关于云端截图方案的选择

需要你拍板用哪个：

| 方案 | 成本 | 画质 | 复杂度 |
|---|---|---|---|
| **A. Browserless.io（推荐）** | 免费额度 1000 截图/月，超出按量 | ⭐⭐⭐⭐⭐ 与本地完全一致 | 低 |
| **B. ScreenshotOne** | 免费 100/月 | ⭐⭐⭐⭐⭐ | 低 |
| **C. 纯 pdf-lib 重绘** | 免费 | ⭐⭐⭐ 需要重写所有幻灯片为矢量 PDF 元素 | 高 |
| **D. 用户本地浏览器渲染**（html2canvas + jsPDF） | 免费 | ⭐⭐⭐ 中文字体/图标可能丢 | 中，但部署到任何地方都能用 |

我推荐 **A 或 D**：
- **A** 画质最佳，但需要你注册 browserless 账号并提供 API token
- **D** 完全免费、零依赖，但首次下载要等 30-60 秒（用户的浏览器渲染 35 张高清幻灯片）

## ⚡ 立即可用的应急方案（不用等大改）

如果你想**今天就让腾讯云能下载**，最快路径是：

1. 我**不**改架构，只改 `package.json` 的 `build` 脚本，确保本地 `npm run build` 总是产出 `dist/exports/*` 和 `public/exports/*`
2. 你本地 build 一次，把 `dist/` 整个上传到 COS
3. **同时** 把生成好的 PDF/PPTX 也直接传一份到 COS 根目录的 `/exports/`，并把文件名改成纯英文（`brand-book.pdf` / `brand-book.pptx`），代码里同步改路径

这只是临时绷带，不解决"用户编辑后导出还是旧版本"的问题。

## 🤔 需要你回答

1. **截图方案选 A / B / C / D 的哪个？**（强烈推荐 D，完全自包含，无需额外服务）
2. **是否要先用「应急方案」**让腾讯云上的下载今天就能用，然后再上正式架构？
3. **编辑后的内容**是否需要反映到导出文件里？（如果只是给你内部看，每次本地 build 上传 COS 也能接受）

确认后我会按你的选择落地。