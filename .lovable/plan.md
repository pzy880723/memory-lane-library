## 目标

在保持现有横版（16:9 / 1920×1080）PPT 完整功能不变的前提下，新增**竖版（9:16 / 1080×1920）适配模式**，让 iPhone 等手机用户能舒适浏览，并支持手动横/竖切换。

---

## 方案概览

采用**"同一份内容、两套排版渲染器"**的架构：保留所有现有横版幻灯片代码不动，新增一个"竖版渲染管线"，复用相同的内容数据（标题、正文、图片、关键数字），但用更适合 9:16 比例的布局重新组织（垂直堆叠为主）。

通过 `useDeviceOrientation` hook 自动检测设备类型 + 用户手动按钮覆盖，决定使用哪一套渲染器。

---

## 1. 设备检测 Hook（新增）

**新文件：`src/hooks/use-slide-orientation.tsx`**

- 检测设备：`window.innerWidth < 768` 或 `navigator.userAgent` 含 `iPhone/Android` → 默认竖版
- 检测视口比例：`innerHeight > innerWidth` → 默认竖版
- 提供 `orientation: "landscape" | "portrait"` 状态 + `setOrientation()` 手动切换
- 用户手动选择后存入 `localStorage`（key: `slide-orientation-preference`），覆盖自动检测
- 返回：`{ orientation, setOrientation, isAutoDetected, isMobileDevice }`

---

## 2. 竖版舞台尺寸 + 缩放（修改 CSS）

**修改 `src/index.css`**

新增竖版舞台样式（与现有 `.slide-wrapper` 并列）：

```css
.slide-wrapper-portrait {
  position: absolute;
  width: 1080px;
  height: 1920px;
  left: 50%; top: 50%;
  margin-left: -540px;
  margin-top: -960px;
  transform: scale(var(--scale, 1));
  transform-origin: center center;
}
```

并提升竖版下的字体下限（手机屏幕实际像素小，缩放后更小），新增 scoped 字号：

```css
.slide-content-portrait .text-xs,
.slide-content-portrait .text-sm,
.slide-content-portrait .text-base { font-size: 28px !important; }
.slide-content-portrait .text-lg { font-size: 32px !important; }
.slide-content-portrait .text-xl { font-size: 36px !important; }
/* 大数字保持冲击力 */
```

---

## 3. ScaledSlide 支持双模式（修改）

**修改 `src/components/slides/ScaledSlide.tsx`**

- 增加 prop `orientation?: "landscape" | "portrait"`（默认 landscape）
- 根据方向选择基准尺寸（1920×1080 或 1080×1920）和对应的 wrapper class
- 缩放计算逻辑同样按方向切换

---

## 4. 竖版 SlideShell（新增）

**新文件：`src/components/slides/SlideShellPortrait.tsx`**

- 接受与 `SlideShell` 相同的 props，但布局改为：
  - 顶部 logo 条（更紧凑，180px 高）
  - 左右边距收窄到 60px（横版是 64px）
  - 底部页脚同样压缩
  - 装饰元素（网点）位置调整以适应竖向画面

---

## 5. 竖版幻灯片组件（新增 - 核心工作量）

**新文件：`src/components/slides/AllSlidesPortrait.tsx`**

为现有的 ~30 个幻灯片各自做一个竖版变体，命名 `Slide01CoverPortrait`、`Slide05TrafficPortrait` 等。**复用相同的文本/图片资源**，但按以下布局原则重排：

| 横版结构 | 竖版重排策略 |
|---------|-------------|
| 左右两栏 | 上下两栏堆叠 |
| 4 列网格 | 2 列网格 或 单列 |
| 横向 timeline/flywheel | 竖向 timeline |
| 大数字 + 旁注 | 大数字居中 + 下方说明 |
| 大幅图片 + 文字 | 图片占上半屏，文字占下半屏 |
| 多行 KPI 卡片 | 2×N 网格 |

**字号准则（竖版下）：**
- 主标题：`text-7xl` ~ `text-8xl`
- 副标题：`text-4xl` ~ `text-5xl`
- 正文：`text-2xl`（不低于 28px 渲染）
- 大数字 KPI：`text-9xl`（保持视觉冲击）
- 图片宽度：尽量铺满 940px 可用宽度

---

## 6. 竖版 Registry（新增）

**新文件：`src/components/slides/registryPortrait.tsx`**

- 镜像 `SLIDES` 数组结构，但 `render` 指向 `*Portrait` 组件
- 同样的 id / title / chapter / 顺序，确保切换后页码对齐
- 导出 `SLIDES_PORTRAIT`、`SlideRendererPortrait`、`SlideStaticRendererPortrait`

---

## 7. 主页面集成（修改）

**修改 `src/pages/Index.tsx`**

- 引入 `useSlideOrientation` hook
- 根据 `orientation` 选择 `SLIDES` vs `SLIDES_PORTRAIT`、`SlideRenderer` vs `SlideRendererPortrait`
- **新增工具栏按钮**：横/竖切换图标（用 `Smartphone` / `Monitor` lucide 图标），点击调用 `setOrientation()`
- 顶部工具栏在小屏（手机）下自动收起非关键按钮（导出/分享塞进 overflow 菜单），避免拥挤
- 缩略图抽屉网格在竖版时改为 `grid-cols-3`（缩略图本身也按竖版渲染）
- 舞台容器的 `aspectRatio` 跟随：横版 `16/9`，竖版 `9/16`

---

## 8. 导出兼容（修改）

**修改 `src/lib/export.tsx`**

- `exportPDF` / `exportPPTX` 增加参数 `orientation`
- 竖版导出时：
  - 离屏容器尺寸改为 1080×1920
  - 渲染 `SlideStaticRendererPortrait`
  - jsPDF 用 `orientation: "portrait"`、`format: [1080, 1920]`
  - pptxgenjs 用 `LAYOUT_USER`，自定义 `defineLayout({ name: "PORTRAIT", width: 7.5, height: 13.333 })`
- 工具栏导出按钮按当前方向导出对应版本

---

## 9. 移动端 UX 优化

- 手机视口下点击区域增大（左右翻页热区从 25% 改为 35%）
- 添加触摸手势：左右滑动翻页（用 `onTouchStart/End` 监听 X 偏移 > 50px）
- 顶部工具栏在手机上变成简化版（仅 logo + 菜单 + 横竖切换 + 全屏）
- 章节菜单改为全屏模态以方便手指点击

---

## 10. 用户体验流程

1. iPhone 用户打开链接 → 自动检测为手机 → 默认竖版排版
2. 用户可点击工具栏 **📱 / 🖥️** 切换按钮，强制切换到横版
3. 选择保存到 localStorage，下次访问保留偏好
4. PC 用户默认横版，也可主动切到竖版预览
5. 导出按钮根据当前方向导出对应版本的 PDF/PPTX

---

## 涉及文件清单

**新增（4 个）：**
- `src/hooks/use-slide-orientation.tsx`
- `src/components/slides/SlideShellPortrait.tsx`
- `src/components/slides/AllSlidesPortrait.tsx`
- `src/components/slides/registryPortrait.tsx`

**修改（4 个）：**
- `src/index.css`（竖版 wrapper + 字号）
- `src/components/slides/ScaledSlide.tsx`（支持 orientation prop）
- `src/pages/Index.tsx`（集成 hook + 切换按钮 + 触摸手势）
- `src/lib/export.tsx`（导出竖版支持）

**完全不动：**
- 现有 `AllSlides.tsx`、`SlideShell.tsx`、`registry.tsx`（横版逻辑零改动，保证现有 PC 体验完全不受影响）

---

## 工作量提示

竖版幻灯片重排是本任务**最大的工作量**——30+ 个组件需要按竖屏比例重新设计布局。我会保持每个竖版组件的视觉质感与横版一致（同样的颜色、字体、装饰元素），只调整骨架结构。

如果你希望先做一个 MVP（例如先做封面 + 5 个核心页的竖版），其余页面用通用的"自动竖排适配器"兜底，请告诉我，可以分阶段交付。否则按上述完整方案推进。