## 目标

让用户在「下载」按钮区域看到后台静默生成 PDF/PPT 的状态，知道云端文档是否已是最新。

## 实现思路

### 1. `src/lib/export.tsx` — 暴露后台生成状态

新增一个简单的发布订阅(模块级):

```ts
export type PrecacheStatus =
  | { phase: "idle"; lastSuccessAt: number | null }
  | { phase: "running"; startedAt: number }
  | { phase: "success"; lastSuccessAt: number }
  | { phase: "error"; message?: string };

export function getPrecacheStatus(): PrecacheStatus
export function subscribePrecache(fn: (s) => void): () => void  // 返回 unsubscribe
```

在 `precacheAll` 内部:
- 开始时 `setStatus({ phase: "running", startedAt: now })`
- 全部完成后 `setStatus({ phase: "success", lastSuccessAt: now })`
- 失败时 `setStatus({ phase: "error", ... })`
- 5 秒后自动回到 `idle`(避免一直停在 success 提示上)

### 2. `src/pages/Index.tsx` — 在下载按钮上显示状态

新增一个 `usePrecacheStatus()` 自定义 hook(或直接 useState + useEffect 订阅)。

下载按钮文案/视觉变化:

| 状态 | 按钮文案 | 副文案/角标 |
|------|---------|------------|
| `idle` (从未生成) | 下载 | (无) |
| `running` | 下载 | 旋转图标 + 「正在更新文档…」 |
| `success` (5s 内) | 下载 | 绿色 ✓ 「已是最新版本」 |
| 用户点击下载中 (`downloading`) | 准备中… | (现有逻辑保持) |

具体改动:
- 在 `<DropdownMenuTrigger>` 的 Button 旁边或下方加一个小角标(absolute 定位的圆点)。
- 在 `<DropdownMenuContent>` 顶部加一行小字状态条:
  - running: `🔄 正在后台更新 PDF/PPT…(约 30 秒)`
  - success: `✓ 文档已更新到最新版本`
  - idle 且 `lastSuccessAt` 存在: `上次更新: X 分钟前`
  - idle 且 `lastSuccessAt` 为 null: 不显示

### 3. 视觉细节

- 使用现有 `Loader2` 图标(已 import 过) + `animate-spin` 类
- 颜色用语义 token:成功用 `text-green-600`(若没有就加到 tailwind config)、运行中用 `text-muted-foreground`
- 角标:右上角 `w-2 h-2 rounded-full bg-amber-500 animate-pulse`(运行中时显示)

## 涉及文件

- `src/lib/export.tsx` — 新增订阅 API + 在 `precacheAll` 内更新状态
- `src/pages/Index.tsx` — 订阅状态 + 在下载按钮区显示

不涉及数据库、edge function 或其他文件。
