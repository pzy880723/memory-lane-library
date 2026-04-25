## 目标

手机用户点击「全屏」按钮时，**自动将幻灯片画面用 CSS 旋转 90° 变成横版**，无需依赖陀螺仪 / 设备旋转 / Screen Orientation API（iOS 不支持）。

用户只需把手机横过来看，即可获得满屏 16:9 的沉浸体验。

---

## 核心原理

**iOS Safari 不支持 `screen.orientation.lock()`**，因此只能用 **CSS Transform 旋转大法**：

```
检测到「手机 + 伪全屏激活」
   ↓
把整个幻灯片舞台 transform: rotate(90deg)
宽 = 视口高度（100dvh）
高 = 视口宽度（100dvw）
   ↓
用户横过手机 = 完美横版全屏
```

此方案在 **iOS Safari、安卓 Chrome、微信内置浏览器** 全部生效。

---

## 改动详情

### 1. `src/pages/Index.tsx`

**新增状态**：
- `forceLandscape: boolean` — 当前是否启用强制横屏旋转

**新增逻辑**：
- 进入伪全屏 (`pseudoFullscreen === true`) **且** 检测到是手机设备 (`window.innerWidth < 768` 或 `navigator.userAgent` 匹配 `Mobi`) → 自动设置 `forceLandscape = true`
- 退出伪全屏 → 自动复位 `forceLandscape = false`
- 监听 `window.resize` 事件，避免设备类型判断失误

**新增 CSS 样式**（通过条件 className）：
当 `forceLandscape === true` 时，给舞台容器添加：
```css
position: fixed;
top: 0;
left: 0;
width: 100dvh;        /* 宽度 = 视口高度 */
height: 100dvw;       /* 高度 = 视口宽度 */
transform: rotate(90deg) translateY(-100dvw);
transform-origin: top left;
```

**手势映射修正**：
- 旋转后用户视觉上的「左右滑」实际是「上下滑」
- 需要调整 `onTouchStart/onTouchMove` 的方向判断逻辑：当 `forceLandscape === true` 时，把 `deltaY` 当作 `deltaX` 来判断翻页

**退出按钮位置修正**：
- 旋转后视觉上的「右上角」实际是 DOM 的「右下角」
- 退出按钮在 `forceLandscape` 时改用 `bottom-4 right-4` 但配合反向旋转保持视觉正确

**横屏提示组件**：
- 进入强制横屏时显示居中浮层：「📱 请将手机横过来观看」
- 3 秒后通过 `setTimeout + opacity 过渡` 自动淡出
- 使用 `useState` 控制显隐 + Tailwind `transition-opacity duration-700`

---

### 2. 兼容性处理

| 设备 / 场景 | 行为 |
|------------|------|
| 桌面浏览器点击全屏 | 真原生全屏，**不旋转** |
| 安卓 Chrome 点击全屏 | 真原生全屏，**不旋转** |
| iPhone Safari 点击全屏 | 伪全屏 + **CSS 旋转 90°** |
| iPad Safari 点击全屏 | 伪全屏 + **不旋转**（屏幕足够大） |
| 已经横屏的手机 | 仍然旋转（按用户选择「所有手机点全屏都旋转」执行）|
| 退出全屏 | 旋转自动还原 |

---

### 3. 不会改动的部分

- ✅ 所有幻灯片内容文件（`AllSlides.tsx`、`SlideShell.tsx` 等）零改动
- ✅ 导出 PDF / PPT 逻辑不受影响（导出走 `SlideStaticRenderer`，不经过旋转）
- ✅ 桌面端体验完全不变

---

## 涉及文件

| 文件 | 改动类型 |
|------|---------|
| `src/pages/Index.tsx` | 新增 `forceLandscape` 状态、CSS 旋转样式、手势映射修正、横屏提示组件 |

仅改一个文件，零风险。

---

## 验收标准

- ✅ **iPhone Safari**：点击全屏 → 画面瞬间旋转成横版铺满屏幕，把手机横过来看 = 完美 16:9 体验
- ✅ **安卓手机**：同上效果
- ✅ **横屏滑动翻页方向正确**（视觉上的左右滑 = 翻页）
- ✅ **「请把手机横过来」提示** 3 秒后自动淡出
- ✅ **退出按钮**位置在视觉右上角，可正常点击退出
- ✅ **桌面/iPad** 行为不变
- ✅ **导出 PDF/PPT** 不受影响