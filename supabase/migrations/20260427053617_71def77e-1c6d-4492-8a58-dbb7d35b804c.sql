-- ============ 1. content_overrides 表 ============
CREATE TABLE public.content_overrides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scope TEXT NOT NULL UNIQUE DEFAULT 'default',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.content_overrides ENABLE ROW LEVEL SECURITY;

-- 任何人可读(前端预览要展示)
CREATE POLICY "Anyone can read content overrides"
  ON public.content_overrides FOR SELECT
  USING (true);

-- 任何人可插入(写权限通过前端密码门控)
CREATE POLICY "Anyone can insert content overrides"
  ON public.content_overrides FOR INSERT
  WITH CHECK (true);

-- 任何人可更新
CREATE POLICY "Anyone can update content overrides"
  ON public.content_overrides FOR UPDATE
  USING (true);

-- 自动 updated_at
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER content_overrides_touch_updated_at
BEFORE UPDATE ON public.content_overrides
FOR EACH ROW
EXECUTE FUNCTION public.touch_updated_at();

-- ============ 2. Storage Bucket: editor-images ============
INSERT INTO storage.buckets (id, name, public)
VALUES ('editor-images', 'editor-images', true)
ON CONFLICT (id) DO NOTHING;

-- 任何人可读(公开 bucket,实际上 SELECT policy 不需要,但加上更明确)
CREATE POLICY "Anyone can view editor images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'editor-images');

-- 任何人可上传(写权限通过前端密码门控)
CREATE POLICY "Anyone can upload editor images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'editor-images');

-- 任何人可更新(替换图片)
CREATE POLICY "Anyone can update editor images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'editor-images');

-- 任何人可删除(清理)
CREATE POLICY "Anyone can delete editor images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'editor-images');