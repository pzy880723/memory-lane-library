## 诊断结论（已用工具实测）

幻灯片总共 27 张图，**总像素 40.4 megapixels**，但实际显示尺寸只需要 ~1/20。这就是翻页卡几秒的根本原因：

| 问题 | 现状 | 影响 |
|---|---|---|
| UGC 截图 (xhs/dy/celeb) | 883×1920 像素 → 显示 ~200×435 | 解码 20× 冗余像素 |
| 大众点评 (dp-*) | 1279×1991 像素 → 显示 ~280×435 | 解码 20× 冗余像素，单图 ~270KB |
| 店铺照 | 768×1024 像素 → 显示 ~280×370 | 解码 7× 冗余像素 |
| 当前预加载 | 一次性 27 张 decode() | 主线程被批量解码任务卡住 |

> **关键认知**：浏览器需要把 webp 解压成 RGBA 位图存到内存。40MP × 4 字节 = **160MB 内存压力 + 100~300ms/张主线程占用**。换 CDN 解决的是下载快慢，**解决不了解码卡顿**。

---

## 优化方案（三步）

### 1. 把所有图 resize 到"显示尺寸 ×2"（核心收益）

用 `sharp` 批量处理 `src/assets/ugc/` 和 `src/assets/store/`：

| 图类 | 当前 | 目标尺寸（按 2× DPR） | 预期单张大小 |
|---|---|---|---|
| UGC 竖图 (xhs/dy/celeb) | 883×1920 | **560×1218** | ~50KB |
| 大众点评 (dp-*) | 1279×1991 | **640×996** | ~70KB |
| 店铺照 | 768×1024 | **560×747** | ~45KB |

**预期**：总体积 4.5MB → **~1.3MB**，总像素 40MP → **~10MP**，单张解码时间 200ms → **20ms**。

文件名保持不变（依然是 `.webp`），不需要改任何 import。

### 2. 重写预加载策略：下载与解码解耦

改写 `src/lib/preloadImages.ts`：

- **下载阶段**（启动后立即）：用 `fetch()` + `priority: "low"` 把所有 webp 全部并行下到浏览器 HTTP 缓存
- **解码阶段**（按需触发）：暴露一个 `decodeForSlide(images: string[])` 函数；每次翻页时，只 decode 当前页 + 后两页的图，且用 `requestIdleCallback` 串行执行
- 这样**主线程永远不会被批量解码堵住**，翻页时图已经在内存里了

### 3. 让 `Index.tsx` 在翻页时调用 `decodeForSlide`

- 在 `src/components/slides/registry.tsx` 给每个 SlideMeta 加一个 `images?: string[]` 字段
- 在 `src/pages/Index.tsx` 监听 `current` 变化 → 调用 `decodeForSlide(SLIDES[current+1].images, SLIDES[current+2].images)`
- 已经看过的页不会重复 decode（用 Set 去重）

---

## 预期效果

| 场景 | 现状 | 优化后 |
|---|---|---|
| 首屏封面 | ~1.5s | **~0.3s** |
| 翻到下一页（图未缓存） | 1~3s（下载+解码卡顿） | **~50ms** |
| 翻到下一页（图已缓存） | 200~500ms（解码卡顿） | **<20ms** |
| 主线程长任务 | 100~300ms/图 | **<20ms/图** |
| 总下载量 | 4.5MB | **~1.3MB** |

---

## 不会动的部分

- 不改任何幻灯片视觉/文案/布局
- 不改图片文件名，所有 `import xxx from "@/assets/..."` 不变
- 不引入任何新 npm 依赖（`sharp` 在 sandbox 里跑一次性脚本即可，不进生产 bundle）

---

## 实施步骤

1. 写一次性脚本，用 `sharp` 把 `src/assets/ugc/*.webp` 和 `src/assets/store/*.webp` resize 到目标尺寸（覆盖原文件，quality 80）
2. 重写 `src/lib/preloadImages.ts`：下载与解码解耦，导出 `preloadAllImages()` 和 `decodeForSlide(srcs)`
3. 在 `src/components/slides/registry.tsx` 的每个 SlideMeta 上加 `images: string[]`
4. 在 `src/pages/Index.tsx` 监听 `current` 变化触发 `decodeForSlide` for N、N+1、N+2
5. 验证：跑 `ls -la` 确认体积下降，并截屏 spot-check 几张图视觉无明显损失
