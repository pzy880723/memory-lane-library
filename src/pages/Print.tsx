import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { SLIDES, SlideStaticRenderer } from "@/components/slides/registry";

/**
 * 纯净的单页渲染路由，仅供构建时 puppeteer 截图使用。
 * URL: /print/1, /print/2 ... /print/N
 *
 * - 无导航条/工具栏/全屏按钮
 * - 渲染 1920×1080 原始尺寸（不缩放）
 * - 等所有图加载完成后，给 body 加 data-ready="1" 让 puppeteer 知道可以截图了
 */
const Print = () => {
  const { n } = useParams<{ n: string }>();
  const index = Math.max(0, Math.min(SLIDES.length - 1, (parseInt(n ?? "1", 10) || 1) - 1));

  useEffect(() => {
    document.body.setAttribute("data-ready", "0");
    document.documentElement.style.background = "transparent";
    document.body.style.margin = "0";
    document.body.style.background = "transparent";
    document.body.style.overflow = "hidden";

    let cancelled = false;
    const ready = async () => {
      // 等字体（多次等待，确保 @import 级联加载的中文字体也就绪）
      try { await document.fonts?.ready; } catch { /* noop */ }
      // 主动加载关键字体面（防止 ready 提前 resolve）
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
      // 等所有图片
      const imgs = Array.from(document.querySelectorAll("img"));
      await Promise.all(imgs.map((img) =>
        img.complete && img.naturalWidth > 0
          ? Promise.resolve()
          : new Promise<void>((res) => {
              img.addEventListener("load", () => res(), { once: true });
              img.addEventListener("error", () => res(), { once: true });
            })
      ));
      // 多 wait 几帧让浏览器布局稳定
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      await new Promise((r) => setTimeout(r, 200));
      if (!cancelled) document.body.setAttribute("data-ready", "1");
    };
    ready();

    return () => { cancelled = true; };
  }, [index]);

  // 直接占满 1920×1080，由 puppeteer 设置 viewport 来匹配
  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        position: "fixed",
        top: 0,
        left: 0,
        overflow: "hidden",
      }}
    >
      <SlideStaticRenderer index={index} />
    </div>
  );
};

export default Print;
