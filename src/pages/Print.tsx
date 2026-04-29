import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { SLIDES } from "@/components/slides/registry";
import { useApplyOverrides } from "@/lib/editor/useApplyOverrides";
import { EditorProvider, useEditor } from "@/lib/editor/EditorContext";

/**
 * 1920×1080 单页渲染路由,供导出截图使用。
 * URL: /print/1, /print/2 ... /print/N
 *
 * - 应用云端 overrides
 * - 等 EditorProvider 拉到云端数据 + 字体 + 图片就绪后,给 body 加 data-ready="1"
 */
function PrintInner() {
  const { n } = useParams<{ n: string }>();
  const index = Math.max(0, Math.min(SLIDES.length - 1, (parseInt(n ?? "1", 10) || 1) - 1));
  const slide = SLIDES[index];
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState<HTMLDivElement | null>(null);
  const editor = useEditor();

  // 应用 overrides(和正式播放页一致)
  useApplyOverrides(
    index,
    containerRef,
    () => { /* 截图模式不允许选中 */ },
    () => { /* 截图模式不允许选中 */ },
    mounted,
  );

  useEffect(() => {
    document.body.setAttribute("data-ready", "0");
    document.documentElement.style.background = "transparent";
    document.body.style.margin = "0";
    document.body.style.background = "transparent";
    document.body.style.overflow = "hidden";
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // 等编辑器数据就绪
    if (!editor.loaded) return;

    let cancelled = false;
    document.body.setAttribute("data-ready", "0");

    const ready = async () => {
      try { await document.fonts?.ready; } catch { /* noop */ }
      const fontProbes = [
        '700 48px "Noto Serif SC"',
        '400 48px "Noto Sans SC"',
        '400 48px "Ma Shan Zheng"',
        '400 48px "Caveat"',
      ];
      try {
        await Promise.all(fontProbes.map((f) => document.fonts.load(f, "测试中文 Test")));
      } catch { /* noop */ }
      try { await document.fonts?.ready; } catch { /* noop */ }

      const imgs = Array.from(document.querySelectorAll("img"));
      await Promise.all(imgs.map((img) =>
        img.complete && img.naturalWidth > 0
          ? Promise.resolve()
          : new Promise<void>((res) => {
              img.addEventListener("load", () => res(), { once: true });
              img.addEventListener("error", () => res(), { once: true });
            })
      ));
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      await new Promise((r) => setTimeout(r, 250));
      if (!cancelled) document.body.setAttribute("data-ready", "1");
    };
    ready();

    return () => { cancelled = true; };
  }, [index, mounted, editor.loaded, editor.data]);

  if (!slide) return null;

  return (
    <div
      ref={(el) => { containerRef.current = el; setMounted(el); }}
      className="slide-content"
      style={{
        width: 1920,
        height: 1080,
        position: "fixed",
        top: 0,
        left: 0,
        overflow: "hidden",
      }}
    >
      {slide.render({ pageNumber: index + 1, totalPages: SLIDES.length })}
    </div>
  );
}

const Print = () => (
  <EditorProvider>
    <PrintInner />
  </EditorProvider>
);

export default Print;
