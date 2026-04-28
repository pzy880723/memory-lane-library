## 目标

对编辑模式工具栏做三处改造:

1. **删除**: 工具浮标里的「导入」「导出」「重置全部」三个功能
2. **新增**: 撤销 (Undo) / 重做 (Redo) 功能
3. **改进文字编辑**: 不再在页面里直接 contenteditable,改为在右侧编辑面板里用文本框编辑(放在「字号」输入框上方)

## 交互改造

### 浮标展开卡片 (改造后)

```
┌──────────────────┐
│ 第 3 页 · 已保存  │
│ ↶ 撤销  ↷ 重做   │
│ ↗ 退出           │
└──────────────────┘
```

- 去掉「⚙ 工具」按钮(因为里面只剩退出了,直接放到卡片里)
- 撤销/重做按钮:无可用历史时禁用(灰色)

### 选中文字时的编辑面板 (改造后)

```
┌─────────────────────┐
│ ✎ 编辑文字       ✕  │
├─────────────────────┤
│ 文字内容             │
│ ┌─────────────────┐ │  ← 新增多行文本框
│ │ 这里是当前文字...│ │
│ └─────────────────┘ │
│                     │
│ 字号                │
│ [32px] [↻]         │
│ [20] [28] [36]...  │
│                     │
│ 颜色                │
│ [■] [#000000] [↻]  │
│                     │
│ [↻ 重置此处文字]    │
└─────────────────────┘
```

页面上选中的文字节点不再变成可编辑状态(去掉 contenteditable 和虚线框的"可输入"感),只保留「点击选中 → 在面板编辑」的模式。仍保留选中高亮(实线描边)。

## 技术改动

### 1. `src/lib/editor/EditorContext.tsx` - 新增撤销/重做

- 新增 `historyRef`(过去栈)和 `futureRef`(未来栈),都是 `AllOverrides` 数组
- 改造 `markDirtyAndSet`:每次用户操作前,把当前 `data` push 到 `historyRef`,清空 `futureRef`,设上限 50 条
- 暴露:
  - `canUndo: boolean`、`canRedo: boolean`
  - `undo()`、`redo()`:互相搬运栈顶,设置 dirty=true 触发云端写入
- `resetAll` 也走 history(可被撤销)

### 2. `src/lib/editor/useApplyOverrides.ts` - 文字不再页面内编辑

- 移除 contenteditable 相关:`setAttribute("contenteditable")`、`input` 事件、`focus/blur` 描边切换
- 编辑模式下文字节点只:
  - 加一个虚线 outline (hover 时变实线提示可点)
  - 绑定 `click` 事件 → 调用 `onSelectText(key, el)`
  - 鼠标样式 `cursor: pointer`(不再是 `text`)
- 应用 overrides 的逻辑(text/fontSize/color)保持不变

### 3. `src/components/editor/EditorPanel.tsx` - 三处改动

**a) 浮标展开卡片**:
- 删除「工具」按钮和整个 `showTools` 分支(连带 `showTools` state、`importJsonRef`、`exportJSON`/`importJSON`/`resetAll`/`reload` 的引用)
- 加 2 个图标按钮:撤销 (`Undo2` 图标)、重做 (`Redo2` 图标),disabled 状态根据 `canUndo`/`canRedo`
- 退出按钮单独一行

**b) 文字编辑面板**:
- 在「字号」上方新增「文字内容」区块:`<Textarea>`,`value = currentTextOv?.text ?? selected.initialText ?? ""`,`onChange` → `updateText(currentSlide, selected.key, { text: e.target.value })`
- `Selected` 接口加 `initialText?: string`,在 `__editorSelectText` 回调里从 `el.dataset.origText ?? el.textContent` 取初值
- 实时把 textarea 的值同步回页面节点(`useApplyOverrides` 已经在监听 data 变化时重新 setText,所以会自动同步,无需额外处理)

**c) 清理 imports**:
- 删除 `Download`、`Upload`、`RotateCcw`(只用于工具面板的部分)、`Settings`、`importJSON`、`exportJSON`、`reload`、`resetAll`
- 保留 `RotateCcw` (字号/颜色/重置此处文字 仍在用)
- 新增 `Undo2`、`Redo2` 图标
- 新增 `Textarea` 引入

## 不改动

- 浮标拖拽、位置持久化、保存中/已保存状态
- 图片编辑流程
- 翻页、键盘快捷键、Supabase 存储
- 选中后的属性面板智能定位 (`computeAutoPos`)
