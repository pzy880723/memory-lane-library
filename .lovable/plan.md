## 问题诊断

**现象**:编辑模式下替换图片,刷新后图片恢复为原图,修改丢失。

**根本原因**:
1. 当前实现 (`src/lib/editor/storage.ts`) 把上传的图片转成 **base64 dataURL** 后,跟其他文字 overrides 一起写入 **localStorage** 同一个 key (`boomer_off_editor_overrides_v1`)。
2. 一张图片 base64 化后通常 1-3MB,而浏览器对单个 origin 的 localStorage 总容量限制通常只有 **5-10MB**。
3. `saveOverrides` 中的 `localStorage.setItem(...)` 没有 try/catch — 一旦超容量抛出 `QuotaExceededError`,**整个** JSON(包含其他文字修改)都写入失败,但 UI 上看不到任何报错。刷新后从 localStorage 读到的还是旧数据,所以"修改全部消失"。
4. 即使写入成功,base64 dataURL 也无法被预生成的 PDF/PPT 用到(因为预生成在构建期跑,读不到用户浏览器里的 localStorage)。

---

## 解决方案

启用 **Lovable Cloud**,把图片放到 Storage Bucket(永久持久化、有 CDN URL),把 overrides JSON 放到数据库表里(永久 + 跨设备同步)。文字 overrides 也一起迁移过去,这样所有编辑都不会因为浏览器限制丢失。

### 1. 启用 Lovable Cloud 后端
- 自动生成 Supabase 项目 + 客户端配置 (`src/integrations/supabase/client.ts`)。

### 2. 创建 Storage Bucket
- Bucket 名:`editor-images`,设为 **public**(图片需要直接 URL 加载,且预生成 PDF 时也要能访问)。
- RLS 策略:
  - 所有人可 SELECT(读图)。
  - 仅"已解锁编辑器"的用户可 INSERT(为简化,我们会让前端使用 anon key 上传到固定路径前缀;真正的写权限通过密码门控+只允许 `slide-{n}/{key}-{timestamp}.{ext}` 这种命名约束)。

### 3. 创建数据库表存放 overrides
```sql
create table public.content_overrides (
  id uuid primary key default gen_random_uuid(),
  -- 单租户场景:用一个固定 key 'default' 存全局唯一一份内容
  scope text not null unique default 'default',
  data jsonb not null,                 -- 即原 AllOverrides
  updated_at timestamptz not null default now()
);
alter table public.content_overrides enable row level security;
-- 所有人可读(因为前端要展示)
create policy "anyone can read content" on public.content_overrides
  for select using (true);
-- 所有人可 upsert(写权限通过前端密码门控保护;后续可以加 has_role 收紧)
create policy "anyone can write content" on public.content_overrides
  for insert with check (true);
create policy "anyone can update content" on public.content_overrides
  for update using (true);
```
> 说明:由于编辑模式已通过密码本地门控(880723 等),且这是一个内部演示工具,本期先用宽松策略保证功能可用。如果你之后想接 Lovable Auth,我们再加 `has_role()` 收紧。

### 4. 改造存储层 `src/lib/editor/storage.ts`
- 新增:`loadOverridesRemote()` — 从 `content_overrides` 表读取。
- 新增:`saveOverridesRemote(data)` — upsert 到表。
- 新增:`uploadImageToCloud(file, slideIndex, key)` — 上传到 Storage,返回 public URL。
- 保留 localStorage 作为离线兜底缓存(读不到云端时用本地)。

### 5. 改造 `src/lib/editor/EditorContext.tsx`
- 启动时 `useEffect` 异步从云端拉取 → setState。
- 数据变更时,debounce 600ms 后写云端(同时写一份到 localStorage 兜底)。
- 增加 `saving` / `loaded` 状态供 UI 显示"已保存 ✓"。

### 6. 改造 `src/components/editor/EditorPanel.tsx`
- `handleImageFile`:不再 `FileReader.readAsDataURL`,改为调用 `uploadImageToCloud(file, ...)` → 拿到 URL → `updateImage(slideIndex, key, { src: url })`。
- 加上传中 loading 提示。
- 移除 4MB 容量警告(Storage 没这个限制)。

### 7. 预生成脚本兼容
- `scripts/prerender-exports.mjs` 在 Puppeteer 内打开页面前,Print 页 (`src/pages/Print.tsx`) 已经会从云端拉 overrides → 自动应用最新内容。无需手动同步。
- 如果你希望"管理员触发重新生成 PDF/PPT",我们可以另起一个按钮(本期不做)。

### 8. 数据迁移(一次性)
- EditorContext 初始化时检测:如果云端是空的、但 localStorage 有数据,自动把 localStorage 的 overrides upsert 到云端(图片如果是 dataURL 就跳过,其他原样上传),让你之前的文字修改不丢失。

---

## 涉及的文件

**新建**
- 数据库 migration:`content_overrides` 表 + RLS + Storage Bucket `editor-images` + Bucket 策略
- `src/integrations/supabase/client.ts`(Lovable Cloud 自动生成)

**修改**
- `src/lib/editor/storage.ts` — 增加云端读写 + 图片上传
- `src/lib/editor/EditorContext.tsx` — 启动拉取、debounce 写云端、迁移逻辑
- `src/components/editor/EditorPanel.tsx` — 图片走 Storage 上传
- `src/pages/Print.tsx` — 确保预生成时也从云端读 overrides(只读路径)

**不动**
- 现有 `useApplyOverrides.ts`、各 Slide 组件、PDF/PPT 预生成脚本主体逻辑

---

## 预期效果

1. ✅ 图片上传后立即获得 CDN URL,刷新、换浏览器、换设备都还在。
2. ✅ 不再受 localStorage 5-10MB 限制,可以放高清大图。
3. ✅ 文字修改也持久化到云端,不会因图片超容量被一锅端丢失。
4. ✅ 编辑面板会显示"已保存 ✓",不再有"以为保存了其实没保存"的隐患。
5. ✅ 离线场景下仍可使用 localStorage 兜底浏览。

需要你点击 Approve 后,我会启用 Lovable Cloud 并执行上述改造。