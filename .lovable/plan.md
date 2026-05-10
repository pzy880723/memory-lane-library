# 目标
让幻灯片图片（包括内置图和后台编辑上传的图片）加载更快、首屏更早出图、翻页不卡顿。

# 现状诊断
- 内置 27 张图已经是 webp，总共约 2 MB，本身不大，但启动用 `priority: "low"` 全量并发拉，第一页要等。
- 编辑器上传的图片直接原图存到 Storage，没有压缩/缩放——手机拍的几 MB 大图会原样下发，是主要慢的来源。
- 所有 `<img>` 都写了 `loading="eager"`，浏览器立刻为远端的 27 页图建立连接，挤占首屏带宽。
- 没有 `fetchpriority`，浏览器无法区分"当前页关键图 vs 后续页背景图"。
- Supabase 公共 URL 没有走图片变换（按宽度缩放），导致 PC 上传的 4000 px 图永远以 4000 px 下发。

# 计划
1. 编辑器上传前做客户端压缩
   - 用户在编辑模式上传图片时，先在浏览器里把图缩放到最长边 ≤ 1920 px，重新编码为 webp（质量 ~0.85），再上传。
   - 大幅缩小用户上传的原图体积（常见从 4 MB → 200 KB 量级）。
   - 保留原始文件名和扩展信息，上传后仍是公开 URL。

2. 内置图加载优先级分层
   - 启动预拉只对「前 2 页 + Logo / 二维码」用 `priority: "high"`，其余继续 `priority: "low"`。
   - 当前页 + 下一页继续走 `decodeForSlide` 串行解码。
   - 第一页关键图加 `fetchpriority="high"`，让浏览器优先调度。

3. 调整 `<img>` loading 策略
   - 当前页与相邻页：`loading="eager"` + `fetchpriority="high"`。
   - 远离当前页的图：`loading="lazy"` + `fetchpriority="low"`，避免一次性占满网络。
   - 由于幻灯片是单页切换，可基于 `current` 索引动态决定。

4. 编辑器替换图也走"显示尺寸友好"
   - 上传后的 URL 仍是 Supabase 原图链接，但因为已经在第 1 步压缩过，整体体积已经可控。
   - 给 `<img>` 加 `decoding="async"` 与按需 `loading` 配合。

5. 提升首屏感知速度
   - 第一页大图加 LQIP（低分辨率占位）或纯色背景兜底，避免空白。
   - 在 `index.html` 里给 Supabase Storage 域名加 `<link rel="preconnect">`，缩短 TLS 握手时间。

6. 验证
   - 用浏览器性能面板看首屏 LCP、首页大图加载时间、翻页过程是否还有抖动。
   - 测试上传一张 4–5 MB 的手机大图，确认上传后 Storage 中文件 ≤ ~300 KB 且替换后页面立刻显示。

# 技术说明
预计修改文件：
- `src/lib/editor/storage.ts`：在 `uploadImageToCloud` 前加压缩管线。
- `src/lib/preloadImages.ts`：分层 priority + 暴露"高优先组"。
- `src/components/slides/AllSlides.tsx`：把硬编码 `loading="eager"` 改为根据当前页判断（用一个轻量 hook / 工具函数）。
- `src/main.tsx`：仅启动高优先组。
- `index.html`：加 preconnect。

不需要新增数据库或 edge function；纯前端优化。

# 预期结果
- 首页大图出现速度明显加快；
- 编辑后台替换的大图上传后立刻显示，下次翻页也快；
- 整体翻页过程不再因为后台图片下载导致卡顿。