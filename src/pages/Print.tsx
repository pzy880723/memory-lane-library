import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { SLIDES } from "@/components/slides/registry";
import { useApplyOverrides } from "@/lib/editor/useApplyOverrides";
import { EditorProvider } from "@/lib/editor/EditorContext";

/**
 * 纯净的单页 1920×1080 渲染路由,供导出截图使用。
 * URL: /print/1, /print/2 ... /print/N
 *
 * - 无导航 / 无缩放,1:1 渲染
 * - 应用云端 overrides(文字 / 图片 / 字号 / 颜色)
 * - 等字体 + 图片就绪后给 body 加 data-ready="1"
 */
function PrintInner() {
  const { n } = useParams<{ n: string }>();
  const index = Math.max(0, Math.min(SLIDES.length - 1, (parseInt(n ?? "1", 10) || 1) - 1));
  const slide = SLIDES[index];
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState<HTMLDivElement | null>(null);

  // 应用 overrides(和正式播放页保持一致)
  useApplyOverrides(
    index,
    containerRef,
    () => { /* 截图模式不允许选中图片 */ },
    () => { /* 截图模式不允许选中文字 */ },
    mounted,
  );

  useEffect(() => {
    document.body.setAttribute("data-ready", "0");
    document.documentElement.style.background = "transparent";
    document.body.style.margin = "0";
    document.body.style.background = "transparent";
    document.body.style.overflow = "hidden";

    let cancelled = false;
    const ready = async () => {
      // 字体加载
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
      // 等图片
      const imgs = Array.from(document.querySelectorAll("img"));
      await Promise.all(imgs.map((img) =>
        img.complete && img.naturalWidth > 0
          ? Promise.resolve()
          : new Promise<void>((res) => {
              img.addEventListener("load", () => res(), { once: true });
              img.addEventListener("error", () => res(), { once: true });
            })
      ));
      // 多 wait 几帧让布局稳定
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      await new Promise((r) => setTimeout(r, 250));
      if (!cancelled) document.body.setAttribute("data-ready", "1");
    };
    ready();

    return () => { cancelled = true; };
  }, [index, mounted]);

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
