## 目标

让 PDF / PPTX 在每次内容修改后**静默地在后台自动重新生成并上传到云端缓存**，覆盖旧文件。用户点击「下载 PDF/PPTX」时直接秒下，不再触发实时渲染。

## 整体方案

复用现有 `src/lib/export.tsx` 中的渲染管线（离屏渲染 → html2canvas → pdf-lib / pptxgenjs → 上传到 `exports` 桶 → 写 `export_cache`）。

新增一个**静默预生成调度器**：监听 `EditorContext` 的 `data` 变化，debounce 后台跑一次「PDF + PPTX」全量重生，结果覆盖云端缓存。任何后续点击下载只会命中 `export_cache` 直接拿 URL。

### 关键改动

**1. `src/lib/export.tsx` — 拆出无下载副作用的核心**

抽出一个内部函数 `generateAndCache(type, { force })`：
- 走原 `runExport` 的「计算 hash → 查缓存 → 渲染 → 打包 → 上传 → 写缓存」流程
- 不调 `triggerDownload`，只返回 `{ url, hash, fromCache }`
- `force=true` 时跳过缓存查询，强制重生（用于内容变化后覆盖旧文件）

`runExport` 改为薄壳：调 `generateAndCache(type)` → 拿 URL → `triggerDownload`。行为对用户完全不变。

新增导出：
```ts
export async function precacheAll(opts?: { force?: boolean }): Promise<void>
```
内部并发执行 `generateAndCache("pdf")` 和 `generateAndCache("pptx")`，错误吞掉只 console.warn（后台任务不能影响 UI）。

**2. 上传时支持「同 type 覆盖旧文件」**

当前 `export_cache` 表只能 INSERT，不能 UPDATE/DELETE（看 RLS）。这会导致同 type 老 hash 的记录残留。两种方案：

- **方案 A（推荐，零迁移）**：上传时 `upsert: true` 已经会覆盖同 path 的存储对象。`export_cache` 表多条记录共存无害——查询时按 `(type, content_hash)` 精确匹配，老 hash 自然永不再被命中。存储桶里旧 hash 文件会留下，但 storage 是按 path 覆盖（同 hash 才覆盖），不同 hash 是新文件。**这就是"每次生成替换"的事实语义**：当前 hash 永远只有一份，老 hash 文件留作历史不影响功能。
- **方案 B（彻底清理）**：开 RLS DELETE 策略 + 上传后异步删旧文件。需要写 migration、改 storage policy、加清理逻辑，复杂度高。

采用 **方案 A**，无需任何 DB / storage 改动。

**3. `src/lib/editor/EditorContext.tsx` — 接入静默预生成调度**

在已有 "数据变更 → debounce 写云端" 的 `useEffect` 旁，新增一个调度器：

```ts
useEffect(() => {
  if (!loaded || !dirtyRef.current) return;
  const t = setTimeout(() => {
    // 等云端写入稳定（至少比上面的 600ms 长）后再触发
    void precacheAll({ force: true }).catch(() => {});
  }, 3000);
  return () => clearTimeout(t);
}, [data, loaded]);
```

特点：
- **3 秒 debounce**：用户连续编辑时只在最后一次操作 3 秒后才跑一次，不会每个按键都跑
- **`force: true`**：忽略缓存，确保覆盖。其实因为内容变了 hash 也变了，自动 miss，但显式更清晰
- **错误静默**：catch 后只 warn，不打扰用户
- **页面关闭即取消**：clearTimeout 防止离开页面后还跑

**4. `EditorContext` 暴露后台状态（可选 UI 反馈）**

新增 `precaching: boolean` 状态 + `lastPrecacheAt: number | null`，让 `EditorPanel` 浮标可以显示一个小角标（例如 "已保存 · 文档已更新 ✓"）。可选，初版可以不加 UI，后台跑就行。

## 用户感知变化

| 场景 | 之前 | 之后 |
|------|------|------|
| 编辑文字后等 3 秒 | 无事发生 | 后台静默渲染 + 上传 PDF/PPTX |
| 点「下载 PDF」 | 30-60 秒首生成 | 0.5 秒命中缓存秒下 |
| 多人协作 | 第一个点击的人等首生成 | 编辑者已预生成好 |
| 离线编辑 | 不影响 | 后台预生成失败静默忽略，下次点下载时回退到实时生成 |

## 注意事项 / 取舍

- **算力成本**：每次编辑 stop-typing 3 秒就会跑一次完整渲染，对编辑者本机 CPU 有压力。可以加节流：例如每分钟最多跑一次，且页面隐藏时（`document.hidden`）暂停。建议在 `precacheAll` 内加 `if (document.hidden) return;` 和「上次执行时间 < 60s 则跳过」的简单节流。
- **冲突保护**：如果预生成正在跑，用户又点了下载，让点击下载走 `runExport` 即可——它会命中刚写入的缓存或者重跑（pdf-lib/html2canvas 都可重入）。再加一个模块级 `isGenerating` 锁，让第二次 `precacheAll` 调用直接 return 即可。
- **首次加载不触发**：`dirtyRef.current` 守卫保证启动时拉云端覆盖本地的那次不会触发预生成。

## 涉及文件

- `src/lib/export.tsx` — 抽 `generateAndCache`、新增 `precacheAll`，加并发锁与节流
- `src/lib/editor/EditorContext.tsx` — 新增 debounce 调度 useEffect
- `.lovable/plan.md` — 同步更新规划文档

无需数据库迁移、无需新建表、无需改 RLS / Storage 策略。
