## 问题诊断

从你上传的截图可以清楚看到：**幻灯片确实旋转了 90°，但只显示在屏幕中间一个小方框里，远没有铺满整个手机屏幕**。

### 根本原因（三层问题叠加）

**① 内层 `aspectRatio: 16/9` + `p-4` 包装把舞台压成小盒子**

`src/pages/Index.tsx` 第 276-280 行：
```tsx
<div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
  <div className="w-full h-full max-w-full max-h-full" style={{ aspectRatio: "16/9" }}>
    <SlideRenderer index={current} />
  </div>
</div>
```

这层 wrapper 在桌面端是为了「让 16:9 幻灯片在任意容器里居中并保持比例」，但**旋转后的舞台本身就已经是 16:9 比例的横版**（宽 = 100dvh ≈ 844px，高 = 100dvw ≈ 390px），再套一层 `aspectRatio: 16/9` + `p-4 / md:p-8` 内边距，就会把内容再次缩成一个小框 → 这就是你看到的"小卡片飘在中间"的根因。

**② iOS Safari 的 `100dvh` 和地址栏会动态变化**

虽然 `100dvh` 应该是「动态视口高度」，但在 iOS Safari 进入页面后地址栏的展开/收起会让数值跳变，导致旋转后的尺寸不稳定。

**③ `transform-origin: top left` + `left: 100dvw` 的布局**

当前用 `left: 100dvw` 把元素推到屏幕右边、再 `rotate(90deg)` 转回来，这种写法依赖 `100dvw` 精确等于视口宽度，在某些 Safari 状态下会有 1-2px 误差导致出现滚动条/黑边。

---

## 修复方案

### 改动 1：旋转模式下移除内层 wrapper 的 padding 和 aspectRatio

在 `src/pages/Index.tsx` 第 276-280 行，把那层 wrapper 改为**条件渲染**：
- `forceLandscape = false` 时：保持原样（`p-4 md:p-8` + `aspectRatio: 16/9`）—— 桌面/iPad 体验不变
- `forceLandscape = true` 时：直接 `<div className="absolute inset-0">` 铺满，让 `SlideRenderer` 内部的 `ScaledSlide` 自己根据父容器 100% × 100% 去算 scale —— 这样旋转后的整个 844×390 区域全部用来显示幻灯片，按 16:9 自动 fit 到最大尺寸

### 改动 2：用更稳的旋转 transform 写法

把第 261-274 行的旋转样式从：
```js
{ left: "100dvw", transform: "rotate(90deg)", transformOrigin: "top left", width: "100dvh", height: "100dvw" }
```
改为更稳定的「中心旋转」写法：
```js
{
  position: "fixed",
  top: "50%",
  left: "50%",
  width: "100dvh",
  height: "100dvw",
  transform: "translate(-50%, -50%) rotate(90deg)",
  transformOrigin: "center center",
  zIndex: 9999,
}
```
中心旋转避免了 `top-left` 模式下对 `100dvw` 像素级精度的依赖，在 iOS Safari 地址栏伸缩时也不会出现黑边/滚动条。

### 改动 3：进入伪全屏时锁定 body 滚动 + 隐藏溢出

在 `pseudoFullscreen` 的 useEffect 里给 `document.body` 加：
```js
document.body.style.overflow = "hidden";
document.body.style.position = "fixed";
document.body.style.width = "100%";
```
退出时还原。这样可以防止 iOS Safari 出现"被旋转元素撑出页面边界 → 出现可滚动的灰色空白"的现象（你截图里幻灯片上下都是大块黑色其实就是这个）。

### 改动 4：横屏提示组件也跟随旋转

第 367-379 行的"请把手机横过来"提示当前在旋转后的舞台**内部**，所以会跟着一起转——这是对的，用户看时已经是横版方向。**保留现状不动**，只是确认它视觉上正确。

---

## 涉及文件

| 文件 | 改动 |
|------|------|
| `src/pages/Index.tsx` | ① 第 276-280 行内层 wrapper 改为条件渲染；② 第 261-274 行 stage 旋转 transform 改成中心旋转写法；③ 第 106-125 行 useEffect 增加 body overflow 锁定与还原 |

**仅改这一个文件，不影响：**
- 桌面端 / iPad 体验（`forceLandscape = false` 分支完全不变）
- PDF / PPT 导出（走 `SlideStaticRenderer`，跟伪全屏完全无关）
- 所有幻灯片内容文件

---

## 验收标准

- ✅ iPhone Safari 点击全屏 → 幻灯片旋转后**完全铺满整个手机屏幕**（横过来看就是真正的全屏 16:9）
- ✅ 上下黑边消失，左右无滚动条
- ✅ 横屏提示"请把手机横过来"3 秒后淡出
- ✅ 退出按钮在视觉右上角可正常点击退出
- ✅ 退出后页面恢复正常滚动，体验无任何残留