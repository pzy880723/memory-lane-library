-- ============ 1. export_cache 表 ============
CREATE TABLE public.export_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('pdf', 'pptx')),
  content_hash TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  content_updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (type, content_hash)
);

CREATE INDEX idx_export_cache_lookup ON public.export_cache (type, content_hash);

ALTER TABLE public.export_cache ENABLE ROW LEVEL SECURITY;

-- 任何人可查询缓存（用于命中判断）
CREATE POLICY "Anyone can read export cache"
  ON public.export_cache FOR SELECT
  USING (true);

-- 任何人可写入缓存（生成完上传后写入）
CREATE POLICY "Anyone can insert export cache"
  ON public.export_cache FOR INSERT
  WITH CHECK (true);

-- ============ 2. Storage Bucket: exports ============
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('exports', 'exports', true, 104857600)  -- 100 MB
ON CONFLICT (id) DO UPDATE SET file_size_limit = 104857600, public = true;

-- 任何人可读
CREATE POLICY "Anyone can view exports"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'exports');

-- 任何人可上传
CREATE POLICY "Anyone can upload exports"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'exports');