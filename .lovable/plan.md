## 现状诊断

先看一下当前图片加载为什么慢：

- `src/assets/` 总共约 **8.8MB**，单张图 200~460KB（jpg/jpeg/png 原图）
- 所有图都用 ESM `import` 静态导入，每张走 Vite 的资源 hash URL
- 代码里**没有任何**优化提示：没有 `loading=`、没有 `decoding=`、没有 `fetchpriority=`、没有相邻页预加载
- 结果就是：每次切到新一页，浏览器才开始下载这一页的几张图，单张图 300KB 在弱网下要 1~3 秒才出现

> ⚠️ 老实说一句：**"0.5 秒"是一个体感目标，不是技术保证**。最终到达时间取决于用户网络（4G、Wi-Fi、海外）+ 图片字节数。我能做的是把"下载 + 解码 + 上屏"这条链路压到极限，让 95% 的场景下图片在切页瞬间就已经在缓存里 → 看起来就是"秒开"。

---

## 优化方案（4 步组合拳）

### 1. 图片压缩为 WebP（收益最大，体积砍 60~70%）

把 `src/assets/ugc/` 和 `src/assets/store/` 下所有 jpg/jpeg/png 用 `sharp` 批量转成 WebP（quality 82，接近无损）：

- 预期：单张 300KB → **80~120KB**
- 总体积：8.8MB → **约 2.5MB**
- 兼容性：现代浏览器 100% 支持，无需 fallback
- 替换所有 `import xxx from "@/assets/.../xxx.jpg"` → `.webp`

### 2. 给所有 `<img>` 加上浏览器优化提示

在所有幻灯片 `<img>` 标签上统一加：
- `loading="eager"` （幻灯片都要看，不延迟）
- `decoding="async"` （后台解码，不阻塞主线程）
- 当前页 / 相邻页的图加 `fetchpriority="high"`

### 3. 相邻页预加载（核心体验优化）

在 `src/pages/Index.tsx` 中新建一个 hook：当用户停留在第 N 页时，立刻在后台 `new Image().src = ...` 预热第 **N-1, N+1, N+2** 页用到的所有图片。

实现方式：
- 在 `src/components/slides/registry.tsx` 的 `SlideMeta` 上加一个 `preloadImages: string[]` 字段，列出该页用到的图片 URL
- `Index.tsx` 监听 `current` 变化 → 触发邻页 preload
- 这样用户翻到下一页时，图片其实已经在浏览器 HTTP 缓存里，瞬间显示

### 4. 首屏关键图片 `<link rel="preload">`

在 `index.html` 的 `<head>` 里给封面页（Slide01Cover）用到的几张图加 preload，让 HTML 解析时就并行下载：

```html
<link rel="preload" as="image" href="/src/assets/..." fetchpriority="high">
```

(开发环境用 Vite 路径，生产环境用打包后的 hash 路径——需要在 `main.tsx` 启动时动态注入，避免 hash 失效)

---

## 预期效果

| 阶段 | 现状 | 优化后 |
|---|---|---|
| 首屏封面图出现 | ~1.5s | **~0.4s** |
| 切到下一页图片出现 | ~0.8~2s（重新下载） | **~50ms**（已预加载，命中缓存） |
| 整页总下载体积 | ~1.5MB | **~400KB** |

---

## 不在本次改动范围

- 不改幻灯片视觉、不调整文案、不动布局
- 不引入 CDN（项目本身没接 CDN，超出范围）
- WebP 转换会**保留原 jpg 文件**，只新增 webp 版本，避免破坏其他引用

---

## 实施步骤

1. 用 `sharp` 批量把 `src/assets/ugc/*.jpg` 和 `src/assets/store/*.jpeg` 转成 `.webp`
2. 全局替换 `AllSlides.tsx` 中 `.jpg` → `.webp` 的 import
3. 给所有 `<img>` 加 `decoding="async" loading="eager"`
4. 在 `registry.tsx` 给每个 slide 添加 `preloadImages` 元数据
5. 在 `Index.tsx` 加邻页预加载 hook
6. 在 `index.html` 给封面图加 `<link rel="preload">`