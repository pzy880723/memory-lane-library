## 背景
日志显示 Browserless 返回 `429 Too Many Requests`——免费档只允许 1 个并发会话，但前端用 3 路并发触发，所以同一时刻 3 个请求互相挤掉。
你的使用场景是「编辑完一次，手动生成一份缓存好，普通用户走缓存秒下载」，所以串行慢一点完全可以接受。

## 改动

### 1. `src/lib/export.tsx`
- `RENDER_CONCURRENCY` 从 `3` 改为 `1`（串行）。
- `renderOneSlide` 加一层重试：失败时再试 1 次，仍失败抛错并中止整个导出，避免 PDF 缺页。

### 2. `supabase/functions/render-slide/index.ts`
- Browserless 返回 `429 / 503` 时，按 `1s → 2s → 4s → 8s` 指数退避，最多重试 4 次。
- 其它错误码或网络异常照常透传。

### 3. 前端兜底提示
- `runExport` 外层加 try/catch，失败时用现有 toast 系统提示具体错误（页号 + 状态码），而不是按钮一直转圈。

## 验证步骤
1. `curl_edge_functions` 单测一次 `/render-slide`，确认能拿到 JPEG。
2. 浏览器进入 `/#slide-1`，点「下载 PDF」，观察进度从 1/35 单调推进到 35/35，最终触发本地下载。
3. 紧接着点「下载 PPTX」，应命中共享 hash（不再重新截图），秒级出文件。
4. 查 `export_cache` 表，应新增 2 条 `v5-browserless` 路径记录。

## 不在范围内
- 不做付费档自动并发提升（你手动触发够用）。
- 不重构 PDF/PPTX 拼装逻辑。