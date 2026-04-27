import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { SLIDES, SlideRenderer } from "@/components/slides/registry";
import { decodeForSlide } from "@/lib/preloadImages";
import { downloadPDF, downloadPPTX } from "@/lib/export";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  ChevronLeft, ChevronRight, Download, Share2,
  Maximize2, Minimize2, LayoutGrid, X, Menu, FileDown, Presentation,
} from "lucide-react";
import logo from "@/assets/boomer-off-logo.png";
import { EditorProvider, useEditor } from "@/lib/editor/EditorContext";
import { PasswordDialog } from "@/components/editor/PasswordDialog";
import { EditorPanel } from "@/components/editor/EditorPanel";

const IndexInner = () => {
  const [current, setCurrent] = useState(0);
  const [showThumbs, setShowThumbs] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pseudoFullscreen, setPseudoFullscreen] = useState(false);
  const [isPhonePortrait, setIsPhonePortrait] = useState(false);
  const [showRotateHint, setShowRotateHint] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  // 编辑器入口：5 击 logo
  const [showPwd, setShowPwd] = useState(false);
  const logoClicksRef = useRef<{ count: number; timer: number | null }>({ count: 0, timer: null });
  const editor = useEditor();

  // 同步 currentSlide 到 editor context
  useEffect(() => { editor.setCurrentSlide(current); }, [current, editor]);

  // 翻页时按需解码：当前页 + 后两页 + 前一页（已解码的会跳过）
  useEffect(() => {
    decodeForSlide(
      SLIDES[current]?.images,
      SLIDES[current + 1]?.images,
      SLIDES[current + 2]?.images,
      SLIDES[current - 1]?.images,
    );
  }, [current]);

  const onLogoClick = useCallback(() => {
    if (editor.unlocked) {
      editor.toggleEditing();
      return;
    }
    const ref = logoClicksRef.current;
    ref.count += 1;
    if (ref.timer) window.clearTimeout(ref.timer);
    ref.timer = window.setTimeout(() => { ref.count = 0; }, 1500);
    if (ref.count >= 5) {
      ref.count = 0;
      setShowPwd(true);
    }
  }, [editor]);

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
  const pseudoFullscreenViewportStyle: CSSProperties | undefined = pseudoFullscreen
    ? isPhonePortrait
      ? {
          paddingTop: "max(12px, env(safe-area-inset-top))",
          paddingRight: "12px",
          paddingBottom: "max(88px, calc(env(safe-area-inset-bottom) + 76px))",
          paddingLeft: "12px",
        }
      : {
          // 横屏：完全不留 padding，让 16:9 画面以高度撑满整个屏幕
          padding: 0,
        }
    : undefined;
  const pseudoFullscreenSlideStyle: CSSProperties | undefined = pseudoFullscreen
    ? isPhonePortrait
      ? {
          width: "100%",
          maxWidth: "100%",
          maxHeight: "100%",
          aspectRatio: "16 / 9",
        }
      : {
          height: "100%",
          width: "auto",
          maxWidth: "100%",
          aspectRatio: "16 / 9",
        }
    : undefined;

  // 进入伪全屏 → 锁 body 滚动 + 检测手机方向 + 必要时显示「请横过来」提示
  useEffect(() => {
    if (!pseudoFullscreen) {
      setIsPhonePortrait(false);
      setShowRotateHint(false);
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
      return;
    }
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.height = "100%";

    const ua = navigator.userAgent || "";
    const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const isIpad =
      /iPad/.test(ua) || (/Macintosh/.test(ua) && "ontouchend" in document);
    const isPhoneUA = /iPhone|Android.*Mobile|Mobi/i.test(ua);
    const isLikelyPhone =
      (isPhoneUA || (hasTouch && Math.min(window.innerWidth, window.innerHeight) < 500)) &&
      !isIpad;

    let hintTimer: number | undefined;

    const syncOrientation = () => {
      const w = window.visualViewport?.width ?? window.innerWidth;
      const h = window.visualViewport?.height ?? window.innerHeight;
      const portrait = h > w;
      const phonePortrait = isLikelyPhone && portrait;
      setIsPhonePortrait(phonePortrait);
      if (phonePortrait) {
        setShowRotateHint(true);
        if (hintTimer) clearTimeout(hintTimer);
        hintTimer = window.setTimeout(() => setShowRotateHint(false), 3000);
      } else {
        setShowRotateHint(false);
      }
    };
    syncOrientation();
    window.addEventListener("resize", syncOrientation);
    window.addEventListener("orientationchange", syncOrientation);
    window.visualViewport?.addEventListener("resize", syncOrientation);

    return () => {
      window.removeEventListener("resize", syncOrientation);
      window.removeEventListener("orientationchange", syncOrientation);
      window.visualViewport?.removeEventListener("resize", syncOrientation);
      if (hintTimer) clearTimeout(hintTimer);
    };
  }, [pseudoFullscreen]);
  // 键盘导航（含 ESC 退出伪全屏）
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.target instanceof HTMLTextAreaElement) return;
      // 编辑模式下，可编辑元素拥有焦点时不响应快捷键
      if (e.target instanceof HTMLElement && e.target.isContentEditable) return;
      // 编辑模式下完全禁用方向键翻页，避免误触
      if (editor.editing && ["ArrowRight", "ArrowLeft", " ", "PageDown", "PageUp"].includes(e.key)) return;
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
  }, [current, go, total, toggleFullscreen, pseudoFullscreen, editor.editing]);

  // 复制分享链接
  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: "✓ 链接已复制", description: "可直接分享给合作伙伴" });
    } catch {
      toast({ title: "复制失败", description: "请手动复制地址栏链接", variant: "destructive" });
    }
  }, []);

  const handleExport = (type: "pdf" | "pptx") => {
    const label = type.toUpperCase();
    if (type === "pdf") downloadPDF();
    else downloadPPTX();
    toast({ title: `${label} 下载已开始`, description: "正在保存到本地..." });
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
            <img
              src={logo}
              alt="BOOMER OFF"
              onClick={onLogoClick}
              className="h-8 brightness-0 invert cursor-pointer select-none"
              draggable={false}
            />
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  className="bg-boomer-red text-paper-cream hover:bg-boomer-red-deep gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">下载</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => handleExport("pdf")}
                  className="gap-3 cursor-pointer"
                >
                  <FileDown className="w-4 h-4 text-boomer-red" />
                  <div className="flex flex-col">
                    <span className="font-bold">下载 PDF</span>
                    <span className="text-xs text-muted-foreground">便于阅读分享</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleExport("pptx")}
                  className="gap-3 cursor-pointer"
                >
                  <Presentation className="w-4 h-4 text-boomer-red" />
                  <div className="flex flex-col">
                    <span className="font-bold">下载 PPT</span>
                    <span className="text-xs text-muted-foreground">可二次编辑</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
        <div
          ref={stageRef}
          className="flex-1 relative overflow-hidden bg-ink"
        >
          <div
            className={
              pseudoFullscreen
                ? "absolute inset-0 flex items-center justify-center"
                : "absolute inset-0 flex items-center justify-center p-4 md:p-8"
            }
            style={pseudoFullscreenViewportStyle}
          >
            {/* 16:9 容器：用 aspect-ratio + max-w/h 让幻灯片在任意视口下等比缩放 + 居中 */}
            <div
              className={pseudoFullscreen ? "max-w-full max-h-full" : "max-w-full max-h-full w-full"}
              style={pseudoFullscreenSlideStyle ?? { aspectRatio: "16 / 9" }}
            >
              <SlideRenderer index={current} />
            </div>
          </div>

          {/* 左右点击区域（编辑模式下禁用，避免与选中元素冲突） */}
          {!editor.editing && (
            <>
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
            </>
          )}

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

          {/* 伪全屏：仅在竖屏（需提示横过来）时显示退出按钮；横屏完全沉浸，仅靠左右点击翻页 */}
          {pseudoFullscreen && isPhonePortrait && (
            <Button
              size="icon"
              className="absolute z-30 h-12 w-12 rounded-full bg-ink/70 text-paper-cream hover:bg-ink/90 backdrop-blur border border-paper-cream/30"
              style={{
                top: "max(1rem, env(safe-area-inset-top))",
                right: "max(1rem, env(safe-area-inset-right))",
              }}
              onClick={() => setPseudoFullscreen(false)}
              aria-label="退出全屏"
            >
              <Minimize2 className="w-5 h-5" />
            </Button>
          )}

          {pseudoFullscreen && (
            <>

              {/* 手机竖屏：「请横过来」提示，3 秒后淡出 */}
              {isPhonePortrait && (
                <div
                  className={`absolute inset-0 z-40 flex items-center justify-center pointer-events-none transition-opacity duration-700 ${
                    showRotateHint ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="bg-ink/85 backdrop-blur-md text-paper-cream px-8 py-6 rounded-2xl border-2 border-boomer-red shadow-2xl flex flex-col items-center gap-3">
                    <div className="text-5xl animate-pulse">📱↻</div>
                    <div className="font-display text-xl font-black tracking-wide">请将手机横过来观看</div>
                    <div className="font-condensed text-xs tracking-widest text-paper-cream/60">ROTATE YOUR PHONE FOR FULLSCREEN</div>
                  </div>
                </div>
              )}
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

      </div>

      {/* 编辑器入口 + 面板 */}
      <PasswordDialog open={showPwd} onOpenChange={setShowPwd} />
      <EditorPanel />
    </>
  );
};

const Index = () => (
  <EditorProvider>
    <IndexInner />
  </EditorProvider>
);

export default Index;
