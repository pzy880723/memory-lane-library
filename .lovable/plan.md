## 目标

让 **iPhone / iPad Safari** 用户点击「全屏」按钮后，也能获得接近原生全屏的沉浸式幻灯片体验 —— 解决目前 iOS 上点击全屏「无反应」的问题。

---

## 方案概述：三级降级策略

```
点击全屏按钮
    │
    ├─ 1️⃣ 标准 Fullscreen API        → 桌面浏览器、安卓 Chrome
    │      ↓ 不支持
    ├─ 2️⃣ webkitRequestFullscreen   → 老版本 Safari、部分 WebView
    │      ↓ 不支持
    └─ 3️⃣ CSS 伪全屏（fixed 铺满）   → iOS Safari ✅
```

无论什么设备，按钮都「有反应」，体验一致。

---

## 具体改动

### 1. 修改 `src/pages/Index.tsx`

**新增状态**：
- `pseudoFullscreen: boolean` — 标记当前是否处于「伪全屏」模式

**重写 `toggleFullscreen` 函数**：
- 优先尝试 `requestFullscreen()`
- 失败则尝试 `webkitRequestFullscreen()`（带 `any` 类型断言）
- 都不支持时，切换 `pseudoFullscreen` 状态启用 CSS 伪全屏
- 退出时同样按顺序处理：`exitFullscreen` → `webkitExitFullscreen` → 关闭伪全屏

**伪全屏视觉效果**（通过条件 className 实现）：
- 当 `pseudoFullscreen === true` 时：
  - 整个 `<div className="fixed inset-0">` 容器变为 `z-[9999]`
  - **隐藏顶部黑色工具栏**（`<header>`）
  - **隐藏底部页码控制条**和**顶部进度条**
  - 幻灯片舞台扩展到整个视口
  - 显示一个**浮动的「退出全屏」小按钮**（右上角，半透明，方便 iOS 用户退出）
- 使用 `100dvh`（动态视口高度）确保 Safari 地址栏收起后内容自动撑满

**键盘 ESC 兼容**：
- 监听 ESC 键，若处于伪全屏模式则退出

---

### 2. 修改 `index.html`

新增 PWA / iOS 优化 meta 标签：
- `<meta name="apple-mobile-web-app-capable" content="yes">` — 允许「添加到主屏幕」后无浏览器 UI
- `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">` — 状态栏透明
- 更新 viewport：`<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">` — 支持刘海屏 / 灵动岛

---

### 3. （可选小增强）横屏提示

在伪全屏模式下，若检测到手机**竖屏**，在角落显示一个小提示：「💡 横屏观看体验更佳」，几秒后自动淡出。

---

## 涉及文件

| 文件 | 改动类型 |
|------|---------|
| `src/pages/Index.tsx` | 重构全屏逻辑 + 新增伪全屏样式条件 + 退出按钮 |
| `index.html` | 增加 iOS PWA meta 标签 |

**不会改动** `SlideShell` / `ScaledSlide` / `AllSlides` 等幻灯片内容文件，纯外壳层调整，零风险。

---

## 验收标准

- ✅ **桌面 Chrome / Edge**：点击全屏 = 真原生全屏（行为不变）
- ✅ **安卓 Chrome**：点击全屏 = 真原生全屏
- ✅ **iOS Safari（iPhone）**：点击全屏 = 幻灯片铺满整个屏幕，工具栏全部隐藏，右上角有退出按钮
- ✅ **iPad Safari**：同上
- ✅ ESC 键 / 退出按钮可正常退出

---

确认后我会切换到执行模式实施这些改动 🚀