import { useCallback, useEffect, useRef, useState } from "react";
import { SLIDES, SlideRenderer } from "@/components/slides/registry";
import { exportPDF, exportPPTX, type ExportPreviewItem } from "@/lib/export";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  ChevronLeft, ChevronRight, Download, FileText, Share2,
  Maximize2, Minimize2, LayoutGrid, X, Menu, CheckCircle2,
} from "lucide-react";
import logo from "@/assets/boomer-off-logo.png";

const Index = () => {
  const [current, setCurrent] = useState(0);
  const [showThumbs, setShowThumbs] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [exporting, setExporting] = useState<{ type: string; n: number; total: number } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pseudoFullscreen, setPseudoFullscreen] = useState(false);
  const [forceLandscape, setForceLandscape] = useState(false);
  const [showRotateHint, setShowRotateHint] = useState(false);
  const [exportPreview, setExportPreview] = useState<{
    type: string;
    items: ExportPreviewItem[];
    activeIndex: number;
  } | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const total = SLIDES.length;

  const go = useCallback((i: number) => {
    setCurrent(Math.max(0, Math.min(total - 1, i)));
  }, [total]);

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

  // 三级降级全屏：标准 → webkit → CSS 伪全屏（iOS Safari）
  const toggleFullscreen = useCallback(() => {
    const doc = document as Document & {
      webkitFullscreenElement?: Element;
      webkitExitFullscreen?: () => Promise<void>;
    };
    const el = stageRef.current as (HTMLDivElement & {
      webkitRequestFullscreen?: () => Promise<void>;
    }) | null;

    const inNativeFS = !!(doc.fullscreenElement || doc.webkitFullscreenElement);

    if (inNativeFS) {
      // 退出原生全屏
      (doc.exitFullscreen?.() ?? doc.webkitExitFullscreen?.());
      return;
    }
    if (pseudoFullscreen) {
      // 退出伪全屏
      setPseudoFullscreen(false);
      return;
    }

    // 1️⃣ 标准 Fullscreen API
    if (el?.requestFullscreen) {
      el.requestFullscreen().catch(() => {
        // 2️⃣ webkit 前缀
        if (el.webkitRequestFullscreen) {
          el.webkitRequestFullscreen();
        } else {
          // 3️⃣ CSS 伪全屏兜底
          setPseudoFullscreen(true);
        }
      });
    } else if (el?.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    } else {
      // iOS Safari 走这里
      setPseudoFullscreen(true);
    }
  }, [pseudoFullscreen]);

  // 监听原生全屏状态
  useEffect(() => {
    const handler = () => {
      const doc = document as Document & { webkitFullscreenElement?: Element };
      setIsFullscreen(!!(doc.fullscreenElement || doc.webkitFullscreenElement));
    };
    document.addEventListener("fullscreenchange", handler);
    document.addEventListener("webkitfullscreenchange", handler);
    return () => {
      document.removeEventListener("fullscreenchange", handler);
      document.removeEventListener("webkitfullscreenchange", handler);
    };
  }, []);

  // 任意全屏状态（原生 OR 伪）
  const inAnyFullscreen = isFullscreen || pseudoFullscreen;

  // 进入伪全屏 → 手机自动启用强制横屏旋转 + 显示提示
  useEffect(() => {
    if (!pseudoFullscreen) {
      setForceLandscape(false);
      setShowRotateHint(false);
      return;
    }
    const ua = navigator.userAgent || "";
    const isPhone =
      /iPhone|Android.*Mobile|Mobi/i.test(ua) ||
      (window.innerWidth < 768 && window.innerHeight > window.innerWidth + 100);
    // iPad 不旋转：iPad 走 webkitRequestFullscreen，理论上不会进入伪全屏；
    // 即便误判，屏幕足够大也无需旋转
    const isIpad = /iPad/.test(ua) || (/Macintosh/.test(ua) && "ontouchend" in document);
    if (isPhone && !isIpad) {
      setForceLandscape(true);
      setShowRotateHint(true);
      const t = setTimeout(() => setShowRotateHint(false), 3000);
      return () => clearTimeout(t);
    }
  }, [pseudoFullscreen]);
  // 键盘导航（含 ESC 退出伪全屏）
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (["ArrowRight", " ", "PageDown"].includes(e.key)) { e.preventDefault(); go(current + 1); }
      else if (["ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); go(current - 1); }
      else if (e.key === "Home") go(0);
      else if (e.key === "End") go(total - 1);
      else if (e.key === "f" || e.key === "F") toggleFullscreen();
      else if (e.key === "g" || e.key === "G") setShowThumbs((s) => !s);
      else if (e.key === "Escape") {
        if (pseudoFullscreen) setPseudoFullscreen(false);
        setShowThumbs(false);
        setShowMenu(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [current, go, total, toggleFullscreen, pseudoFullscreen]);

  // 复制分享链接
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
      const items = await fn((n, t) => setExporting({ type: type.toUpperCase(), n, total: t }));
      toast({ title: `✓ ${type.toUpperCase()} 已生成`, description: "已开始下载，对比预览即将打开" });
      // 打开对比预览
      setExportPreview({ type: type.toUpperCase(), items, activeIndex: current });
    } catch (err) {
      console.error(err);
      toast({ title: "导出失败", description: String(err), variant: "destructive" });
    } finally {
      setExporting(null);
    }
  };

  return (
    <>
      {/* SEO */}
      <title>BOOMER OFF Vintage 品牌手册 — 国内首家标准化中古连锁品牌</title>
      <meta name="description" content="BOOMER OFF Vintage 品牌手册：国内首家标准化中古连锁品牌，标准化×氛围感双基因融合。中信泰富首店全网曝光 300 万+，10 万+ 客流。" />
      <meta property="og:title" content="BOOMER OFF Vintage 品牌手册" />
      <meta property="og:description" content="国内首家标准化中古连锁品牌 — 虽古但新，信任可见" />

      <div
        className={`fixed inset-0 paper-texture flex flex-col ${
          pseudoFullscreen ? "z-[9999] bg-ink" : ""
        }`}
        style={pseudoFullscreen ? { height: "100dvh" } : undefined}
      >
        {/* 顶部工具栏 */}
        {!pseudoFullscreen && (
        <header className="h-16 flex-shrink-0 bg-ink text-paper-cream flex items-center justify-between px-6 border-b-4 border-boomer-red z-30">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-paper-cream hover:bg-paper-cream/10 hover:text-paper-cream"
              onClick={() => setShowMenu(true)}
              aria-label="章节菜单"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <img src={logo} alt="BOOMER OFF" className="h-8 brightness-0 invert" />
            <div className="hidden md:block h-8 w-[2px] bg-paper-cream/20" />
            <div className="hidden md:block">
              <div className="font-display text-base font-bold leading-tight">品牌手册 Brand Book</div>
              <div className="font-condensed text-xs tracking-widest text-paper-cream/60">BOOMER · OFF · VINTAGE</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-paper-cream hover:bg-paper-cream/10 hover:text-paper-cream gap-2"
              onClick={() => setShowThumbs((s) => !s)}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">缩略图</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-paper-cream hover:bg-paper-cream/10 hover:text-paper-cream gap-2"
              onClick={copyLink}
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">分享</span>
            </Button>
            <Button
              size="sm"
              className="bg-paper-cream text-ink hover:bg-paper-cream/90 gap-2"
              onClick={() => handleExport("pdf")}
              disabled={!!exporting}
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">下载 PDF</span>
            </Button>
            <Button
              size="sm"
              className="bg-boomer-red text-paper-cream hover:bg-boomer-red-deep gap-2"
              onClick={() => handleExport("pptx")}
              disabled={!!exporting}
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">下载 PPT</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-paper-cream hover:bg-paper-cream/10 hover:text-paper-cream"
              onClick={toggleFullscreen}
              aria-label="全屏"
            >
              {inAnyFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>
        </header>
        )}

        {/* 幻灯片舞台 */}
        <div ref={stageRef} className="flex-1 relative bg-ink overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
            <div className="w-full h-full max-w-full max-h-full" style={{ aspectRatio: "16/9" }}>
              <SlideRenderer index={current} />
            </div>
          </div>

          {/* 左右点击区域 */}
          <button
            onClick={() => go(current - 1)}
            disabled={current === 0}
            className="absolute left-0 top-0 bottom-0 w-1/4 z-10 cursor-w-resize disabled:cursor-default group"
            aria-label="上一页"
          >
            <ChevronLeft className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 text-paper-cream opacity-0 group-hover:opacity-60 transition-opacity bg-ink/40 rounded-full p-2" />
          </button>
          <button
            onClick={() => go(current + 1)}
            disabled={current === total - 1}
            className="absolute right-0 top-0 bottom-0 w-1/4 z-10 cursor-e-resize disabled:cursor-default group"
            aria-label="下一页"
          >
            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 text-paper-cream opacity-0 group-hover:opacity-60 transition-opacity bg-ink/40 rounded-full p-2" />
          </button>

          {/* 底部页码控制（伪全屏时隐藏） */}
          {!pseudoFullscreen && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-ink/80 backdrop-blur text-paper-cream px-4 py-2 rounded-full flex items-center gap-3 border border-paper-cream/20">
            <Button
              variant="ghost" size="icon"
              className="h-8 w-8 text-paper-cream hover:bg-paper-cream/10 hover:text-paper-cream"
              onClick={() => go(current - 1)} disabled={current === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="font-en text-xl tracking-wider min-w-[80px] text-center">
              <span className="text-boomer-red">{String(current + 1).padStart(2, "0")}</span>
              <span className="text-paper-cream/50"> / {String(total).padStart(2, "0")}</span>
            </span>
            <Button
              variant="ghost" size="icon"
              className="h-8 w-8 text-paper-cream hover:bg-paper-cream/10 hover:text-paper-cream"
              onClick={() => go(current + 1)} disabled={current === total - 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          )}

          {/* 顶部进度条（伪全屏时隐藏） */}
          {!pseudoFullscreen && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-paper-cream/10 z-20">
            <div
              className="h-full bg-boomer-red transition-all"
              style={{ width: `${((current + 1) / total) * 100}%` }}
            />
          </div>
          )}

          {/* 伪全屏专属：浮动退出按钮 + 简易翻页 */}
          {pseudoFullscreen && (
            <>
              <Button
                size="icon"
                className="absolute top-4 right-4 z-30 h-12 w-12 rounded-full bg-ink/70 text-paper-cream hover:bg-ink/90 backdrop-blur border border-paper-cream/30"
                onClick={() => setPseudoFullscreen(false)}
                aria-label="退出全屏"
              >
                <Minimize2 className="w-5 h-5" />
              </Button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-ink/70 backdrop-blur text-paper-cream px-4 py-2 rounded-full flex items-center gap-3 border border-paper-cream/20">
                <Button
                  variant="ghost" size="icon"
                  className="h-8 w-8 text-paper-cream hover:bg-paper-cream/10 hover:text-paper-cream"
                  onClick={() => go(current - 1)} disabled={current === 0}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="font-en text-lg tracking-wider min-w-[70px] text-center">
                  <span className="text-boomer-red">{String(current + 1).padStart(2, "0")}</span>
                  <span className="text-paper-cream/50"> / {String(total).padStart(2, "0")}</span>
                </span>
                <Button
                  variant="ghost" size="icon"
                  className="h-8 w-8 text-paper-cream hover:bg-paper-cream/10 hover:text-paper-cream"
                  onClick={() => go(current + 1)} disabled={current === total - 1}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </>
          )}
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
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {SLIDES.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => { go(i); setShowThumbs(false); }}
                    className={`group relative aspect-video bg-paper rounded overflow-hidden border-2 transition-all ${
                      i === current ? "border-boomer-red ring-2 ring-boomer-red/40" : "border-paper-cream/20 hover:border-boomer-red/60"
                    }`}
                  >
                    <div className="absolute inset-0 origin-top-left pointer-events-none" style={{ transform: "scale(0.12)", width: "1920px", height: "1080px" }}>
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
            <div className="bg-paper-cream w-full max-w-md h-full overflow-y-auto p-8 shadow-2xl border-r-4 border-boomer-red" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-8">
                <img src={logo} alt="BOOMER OFF" className="h-10" />
                <Button variant="ghost" size="icon" onClick={() => setShowMenu(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <h2 className="font-display text-3xl font-black mb-6">章 节 导 航</h2>
              <nav className="space-y-2">
                {SLIDES.map((s, i) => (
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

        {/* 导出进度遮罩 */}
        {exporting && (
          <div className="fixed inset-0 bg-ink/85 backdrop-blur-sm z-[100] flex items-center justify-center">
            <div className="bg-paper-cream vintage-border-red p-12 max-w-md w-full mx-4 text-center">
              <div className="font-handwrite text-3xl text-boomer-red mb-3">Generating...</div>
              <h3 className="font-display text-3xl font-black mb-6">正在生成 {exporting.type} 文件</h3>
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

        {/* 导出后对比预览：左=网页预览  右=导出成品 */}
        {exportPreview && (
          <div className="fixed inset-0 bg-ink/95 backdrop-blur-sm z-[110] flex flex-col">
            {/* 顶栏 */}
            <div className="flex items-center justify-between px-6 py-3 bg-ink text-paper-cream border-b-4 border-boomer-red">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-boomer-red" />
                <div>
                  <div className="font-display text-xl font-black">
                    {exportPreview.type} 导出成功 · 对比预览
                  </div>
                  <div className="font-condensed text-xs tracking-widest text-paper-cream/60">
                    左侧为网页预览　·　右侧为导出文件实际效果（含圆角等所有样式）
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-paper-cream hover:bg-paper-cream/10 hover:text-paper-cream"
                onClick={() => setExportPreview(null)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* 主体：左右对比 */}
            <div className="flex-1 grid grid-cols-2 gap-4 p-4 overflow-hidden">
              {/* 左：网页预览（实时渲染） */}
              <div className="flex flex-col min-h-0">
                <div className="text-paper-cream/80 font-display text-sm mb-2 px-2">
                  📺 网页预览（实时 DOM）
                </div>
                <div className="flex-1 bg-ink rounded overflow-hidden border-2 border-paper-cream/20 flex items-center justify-center">
                  <div className="w-full h-full" style={{ aspectRatio: "16/9" }}>
                    <SlideRenderer index={exportPreview.activeIndex} />
                  </div>
                </div>
              </div>
              {/* 右：导出图片 */}
              <div className="flex flex-col min-h-0">
                <div className="text-paper-cream/80 font-display text-sm mb-2 px-2">
                  📄 {exportPreview.type} 文件实际页面（栅格化成品）
                </div>
                <div className="flex-1 bg-ink rounded overflow-hidden border-2 border-boomer-red flex items-center justify-center">
                  <img
                    src={exportPreview.items[exportPreview.activeIndex]?.imageDataUrl}
                    alt={`导出第 ${exportPreview.activeIndex + 1} 页`}
                    className="w-full h-full object-contain"
                    style={{ aspectRatio: "16/9" }}
                  />
                </div>
              </div>
            </div>

            {/* 底栏：缩略图横向导航 */}
            <div className="bg-ink border-t border-paper-cream/20 px-4 py-3 flex items-center gap-3">
              <Button
                size="icon"
                variant="ghost"
                className="text-paper-cream hover:bg-paper-cream/10 hover:text-paper-cream flex-shrink-0"
                onClick={() =>
                  setExportPreview((p) =>
                    p ? { ...p, activeIndex: Math.max(0, p.activeIndex - 1) } : p,
                  )
                }
                disabled={exportPreview.activeIndex === 0}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div className="flex-1 overflow-x-auto">
                <div className="flex gap-2">
                  {exportPreview.items.map((it) => (
                    <button
                      key={it.index}
                      onClick={() =>
                        setExportPreview((p) => (p ? { ...p, activeIndex: it.index } : p))
                      }
                      className={`relative flex-shrink-0 w-28 aspect-video rounded overflow-hidden border-2 transition-all ${
                        it.index === exportPreview.activeIndex
                          ? "border-boomer-red ring-2 ring-boomer-red/40"
                          : "border-paper-cream/20 hover:border-boomer-red/60"
                      }`}
                    >
                      <img src={it.imageDataUrl} alt={it.title} className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 left-0 right-0 bg-ink/80 text-paper-cream text-[10px] font-en text-center py-0.5">
                        {String(it.index + 1).padStart(2, "0")}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="text-paper-cream hover:bg-paper-cream/10 hover:text-paper-cream flex-shrink-0"
                onClick={() =>
                  setExportPreview((p) =>
                    p
                      ? { ...p, activeIndex: Math.min(p.items.length - 1, p.activeIndex + 1) }
                      : p,
                  )
                }
                disabled={exportPreview.activeIndex === exportPreview.items.length - 1}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
              <div className="flex-shrink-0 font-en text-paper-cream text-lg pl-4 border-l border-paper-cream/20">
                <span className="text-boomer-red">
                  {String(exportPreview.activeIndex + 1).padStart(2, "0")}
                </span>
                <span className="text-paper-cream/50"> / {String(exportPreview.items.length).padStart(2, "0")}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Index;
