import { useCallback, useEffect, useRef, useState } from "react";
import { SLIDES, SlideRenderer } from "@/components/slides/registry";
import { SLIDES_PORTRAIT, SlideRendererPortrait } from "@/components/slides/registryPortrait";
import { exportPDF, exportPPTX } from "@/lib/export";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useSlideOrientation } from "@/hooks/use-slide-orientation";
import {
  ChevronLeft, ChevronRight, Download, FileText, Share2,
  Maximize2, Minimize2, LayoutGrid, X, Menu, Smartphone, Monitor,
} from "lucide-react";
import logo from "@/assets/boomer-off-logo.png";

const Index = () => {
  const { orientation, toggleOrientation } = useSlideOrientation();
  const [current, setCurrent] = useState(0);
  const [showThumbs, setShowThumbs] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [exporting, setExporting] = useState<{ type: string; n: number; total: number } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  const isPortrait = orientation === "portrait";
  const slides = isPortrait ? SLIDES_PORTRAIT : SLIDES;
  const total = slides.length;

  const go = useCallback((i: number) => {
    setCurrent(Math.max(0, Math.min(total - 1, i)));
  }, [total]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      stageRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, []);

  // 键盘导航
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (["ArrowRight", " ", "PageDown", "ArrowDown"].includes(e.key)) { e.preventDefault(); go(current + 1); }
      else if (["ArrowLeft", "PageUp", "ArrowUp"].includes(e.key)) { e.preventDefault(); go(current - 1); }
      else if (e.key === "Home") go(0);
      else if (e.key === "End") go(total - 1);
      else if (e.key === "f" || e.key === "F") toggleFullscreen();
      else if (e.key === "g" || e.key === "G") setShowThumbs((s) => !s);
      else if (e.key === "Escape") { setShowThumbs(false); setShowMenu(false); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [current, go, total, toggleFullscreen]);

  // URL hash 同步
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith("#slide-")) {
      const n = parseInt(hash.slice(7));
      if (!isNaN(n) && n >= 1 && n <= total) setCurrent(n - 1);
    }
  }, [total]);
  useEffect(() => {
    window.history.replaceState(null, "", `#slide-${current + 1}`);
  }, [current]);

  // 切换方向时确保 current 不越界
  useEffect(() => {
    if (current >= total) setCurrent(total - 1);
  }, [total, current]);

  // 触摸滑动手势
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    const threshold = 50;
    if (isPortrait) {
      if (Math.max(absDx, absDy) > threshold) {
        if (absDx > absDy) {
          dx < 0 ? go(current + 1) : go(current - 1);
        } else {
          dy < 0 ? go(current + 1) : go(current - 1);
        }
      }
    } else {
      if (absDx > threshold && absDx > absDy) {
        dx < 0 ? go(current + 1) : go(current - 1);
      }
    }
    touchStart.current = null;
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: "✓ 链接已复制", description: "可直接分享给合作伙伴" });
    } catch {
      toast({ title: "复制失败", description: "请手动复制地址栏链接", variant: "destructive" });
    }
  }, []);

  const handleExport = async (type: "pdf" | "pptx") => {
    setExporting({ type: type.toUpperCase(), n: 0, total });
    try {
      const fn = type === "pdf" ? exportPDF : exportPPTX;
      await fn((n, t) => setExporting({ type: type.toUpperCase(), n, total: t }), orientation);
      toast({ title: `✓ ${type.toUpperCase()} 已生成`, description: `${isPortrait ? "竖版" : "横版"} · 已开始下载` });
    } catch (err) {
      console.error(err);
      toast({ title: "导出失败", description: String(err), variant: "destructive" });
    } finally {
      setExporting(null);
    }
  };

  return (
    <>
      <title>BOOMER OFF Vintage 品牌手册 — 国内首家标准化中古连锁品牌</title>
      <meta name="description" content="BOOMER OFF Vintage 品牌手册：国内首家标准化中古连锁品牌，标准化×氛围感双基因融合。中信泰富首店全网曝光 300 万+，10 万+ 客流。" />
      <meta property="og:title" content="BOOMER OFF Vintage 品牌手册" />
      <meta property="og:description" content="国内首家标准化中古连锁品牌 — 虽古但新，信任可见" />
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />

      <div className="fixed inset-0 paper-texture flex flex-col">
        {/* 顶部工具栏 */}
        <header className="h-14 sm:h-16 flex-shrink-0 bg-ink text-paper-cream flex items-center justify-between px-2 sm:px-6 border-b-4 border-boomer-red z-30">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              className="text-paper-cream hover:bg-paper-cream/10 hover:text-paper-cream flex-shrink-0"
              onClick={() => setShowMenu(true)}
              aria-label="章节菜单"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <img src={logo} alt="BOOMER OFF" className="h-7 sm:h-8 brightness-0 invert flex-shrink-0" />
            <div className="hidden md:block h-8 w-[2px] bg-paper-cream/20" />
            <div className="hidden md:block">
              <div className="font-display text-base font-bold leading-tight">品牌手册 Brand Book</div>
              <div className="font-condensed text-xs tracking-widest text-paper-cream/60">BOOMER · OFF · VINTAGE</div>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* 横/竖切换按钮 */}
            <Button
              variant="ghost"
              size="sm"
              className="text-paper-cream hover:bg-paper-cream/10 hover:text-paper-cream gap-1 sm:gap-2 px-2 sm:px-3"
              onClick={toggleOrientation}
              title={isPortrait ? "切换到横版（电脑模式）" : "切换到竖版（手机模式）"}
            >
              {isPortrait ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
              <span className="hidden md:inline">{isPortrait ? "横版" : "竖版"}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex text-paper-cream hover:bg-paper-cream/10 hover:text-paper-cream gap-2"
              onClick={() => setShowThumbs((s) => !s)}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden lg:inline">缩略图</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex text-paper-cream hover:bg-paper-cream/10 hover:text-paper-cream gap-2"
              onClick={copyLink}
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden lg:inline">分享</span>
            </Button>
            <Button
              size="sm"
              className="bg-paper-cream text-ink hover:bg-paper-cream/90 gap-1 sm:gap-2 px-2 sm:px-3"
              onClick={() => handleExport("pdf")}
              disabled={!!exporting}
            >
              <FileText className="w-4 h-4" />
              <span className="hidden md:inline">PDF</span>
            </Button>
            <Button
              size="sm"
              className="bg-boomer-red text-paper-cream hover:bg-boomer-red-deep gap-1 sm:gap-2 px-2 sm:px-3"
              onClick={() => handleExport("pptx")}
              disabled={!!exporting}
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">PPT</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:inline-flex text-paper-cream hover:bg-paper-cream/10 hover:text-paper-cream"
              onClick={toggleFullscreen}
              aria-label="全屏"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>
        </header>

        {/* 幻灯片舞台 */}
        <div
          ref={stageRef}
          className="flex-1 relative bg-ink overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4 md:p-8">
            <div
              className="w-full h-full max-w-full max-h-full"
              style={{ aspectRatio: isPortrait ? "9/16" : "16/9" }}
            >
              {isPortrait
                ? <SlideRendererPortrait index={current} />
                : <SlideRenderer index={current} />}
            </div>
          </div>

          <button
            onClick={() => go(current - 1)}
            disabled={current === 0}
            className="absolute left-0 top-0 bottom-0 w-1/3 sm:w-1/4 z-10 cursor-w-resize disabled:cursor-default group"
            aria-label="上一页"
          >
            <ChevronLeft className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 text-paper-cream opacity-0 group-hover:opacity-60 transition-opacity bg-ink/40 rounded-full p-2" />
          </button>
          <button
            onClick={() => go(current + 1)}
            disabled={current === total - 1}
            className="absolute right-0 top-0 bottom-0 w-1/3 sm:w-1/4 z-10 cursor-e-resize disabled:cursor-default group"
            aria-label="下一页"
          >
            <ChevronRight className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 text-paper-cream opacity-0 group-hover:opacity-60 transition-opacity bg-ink/40 rounded-full p-2" />
          </button>

          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 bg-ink/80 backdrop-blur text-paper-cream px-3 sm:px-4 py-1.5 sm:py-2 rounded-full flex items-center gap-2 sm:gap-3 border border-paper-cream/20">
            <Button
              variant="ghost" size="icon"
              className="h-7 w-7 sm:h-8 sm:w-8 text-paper-cream hover:bg-paper-cream/10 hover:text-paper-cream"
              onClick={() => go(current - 1)} disabled={current === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="font-en text-lg sm:text-xl tracking-wider min-w-[70px] sm:min-w-[80px] text-center">
              <span className="text-boomer-red">{String(current + 1).padStart(2, "0")}</span>
              <span className="text-paper-cream/50"> / {String(total).padStart(2, "0")}</span>
            </span>
            <Button
              variant="ghost" size="icon"
              className="h-7 w-7 sm:h-8 sm:w-8 text-paper-cream hover:bg-paper-cream/10 hover:text-paper-cream"
              onClick={() => go(current + 1)} disabled={current === total - 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="absolute top-0 left-0 right-0 h-1 bg-paper-cream/10 z-20">
            <div
              className="h-full bg-boomer-red transition-all"
              style={{ width: `${((current + 1) / total) * 100}%` }}
            />
          </div>
        </div>

        {/* 缩略图抽屉 */}
        {showThumbs && (
          <div className="absolute bottom-0 left-0 right-0 max-h-[40vh] bg-ink/95 backdrop-blur border-t-4 border-boomer-red z-40 flex flex-col">
            <div className="flex items-center justify-between px-6 py-3 border-b border-paper-cream/20">
              <h3 className="font-display text-paper-cream text-lg font-bold">所有幻灯片 · {total} 页</h3>
              <Button variant="ghost" size="icon" className="text-paper-cream hover:bg-paper-cream/10 hover:text-paper-cream" onClick={() => setShowThumbs(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className={isPortrait ? "grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-3" : "grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3"}>
                {slides.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => { go(i); setShowThumbs(false); }}
                    className={`group relative bg-paper rounded overflow-hidden border-2 transition-all ${
                      i === current ? "border-boomer-red ring-2 ring-boomer-red/40" : "border-paper-cream/20 hover:border-boomer-red/60"
                    }`}
                    style={{ aspectRatio: isPortrait ? "9/16" : "16/9" }}
                  >
                    <div
                      className="absolute inset-0 origin-top-left pointer-events-none"
                      style={{
                        transform: isPortrait ? "scale(0.1)" : "scale(0.12)",
                        width: isPortrait ? "1080px" : "1920px",
                        height: isPortrait ? "1920px" : "1080px",
                      }}
                    >
                      {s.render({ pageNumber: i + 1, totalPages: total })}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-ink/80 text-paper-cream px-2 py-1 text-xs font-en flex items-center justify-between">
                      <span className="text-boomer-red">{String(i + 1).padStart(2, "0")}</span>
                      <span className="truncate ml-1 text-[10px] text-paper-cream/80">{s.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 章节菜单 */}
        {showMenu && (
          <div className="fixed inset-0 z-50 flex" onClick={() => setShowMenu(false)}>
            <div className="bg-paper-cream w-full max-w-md h-full overflow-y-auto p-6 sm:p-8 shadow-2xl border-r-4 border-boomer-red" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <img src={logo} alt="BOOMER OFF" className="h-10" />
                <Button variant="ghost" size="icon" onClick={() => setShowMenu(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-black mb-4 sm:mb-6">章 节 导 航</h2>

              <div className="mb-4 p-3 bg-paper-deep rounded flex items-center justify-between">
                <div>
                  <div className="font-display font-bold">显示模式</div>
                  <div className="text-xs text-ink/60">{isPortrait ? "竖版（手机优化）" : "横版（电脑优化）"}</div>
                </div>
                <Button size="sm" onClick={toggleOrientation} className="bg-boomer-red text-paper-cream hover:bg-boomer-red-deep gap-2">
                  {isPortrait ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                  切换
                </Button>
              </div>

              <nav className="space-y-2">
                {slides.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => { go(i); setShowMenu(false); }}
                    className={`w-full text-left px-4 py-3 rounded flex items-center gap-4 transition-all ${
                      i === current ? "bg-boomer-red text-paper-cream" : "hover:bg-paper-deep"
                    }`}
                  >
                    <span className="font-en text-2xl w-12">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1 font-display font-bold">{s.title}</span>
                    <span className={`text-xs font-condensed tracking-widest ${i === current ? "text-paper-cream/70" : "text-ink/50"}`}>CH {s.chapter}</span>
                  </button>
                ))}
              </nav>
            </div>
            <div className="flex-1" />
          </div>
        )}

        {/* 导出进度 */}
        {exporting && (
          <div className="fixed inset-0 bg-ink/85 backdrop-blur-sm z-[100] flex items-center justify-center">
            <div className="bg-paper-cream vintage-border-red p-8 sm:p-12 max-w-md w-full mx-4 text-center">
              <div className="font-handwrite text-2xl sm:text-3xl text-boomer-red mb-3">Generating...</div>
              <h3 className="font-display text-2xl sm:text-3xl font-black mb-6">
                正在生成 {exporting.type} <span className="text-boomer-red">{isPortrait ? "竖版" : "横版"}</span>
              </h3>
              <div className="w-full bg-paper-deep rounded-full h-3 overflow-hidden mb-3">
                <div
                  className="bg-boomer-red h-full transition-all"
                  style={{ width: `${(exporting.n / exporting.total) * 100}%` }}
                />
              </div>
              <div className="font-en text-2xl">
                <span className="text-boomer-red">{exporting.n}</span>
                <span className="text-ink/50"> / {exporting.total}</span>
                <span className="font-body text-base ml-3 text-ink/60">页</span>
              </div>
              <p className="font-body text-sm text-ink/60 mt-4">
                请稍候 · 文件较大，预计需要 30-90 秒
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Index;
