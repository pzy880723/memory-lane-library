import logo from "@/assets/boomer-off-logo.png";

interface SlideShellPortraitProps {
  children: React.ReactNode;
  pageNumber?: number;
  totalPages?: number;
  showHeader?: boolean;
  variant?: "paper" | "cream" | "warm" | "sand" | "red" | "red-soft";
  noFooter?: boolean;
  chapter?: string;
}

const bgMap: Record<string, string> = {
  paper: "paper-texture",
  cream: "paper-cream",
  warm: "paper-warm-bg",
  sand: "paper-sand-bg",
  red: "bg-boomer-red",
  "red-soft": "bg-boomer-red-soft",
};

/**
 * 竖版幻灯片外框 (1080×1920)
 */
export function SlideShellPortrait({
  children,
  pageNumber,
  totalPages,
  showHeader = true,
  variant = "paper",
  noFooter = false,
  chapter,
}: SlideShellPortraitProps) {
  const isRed = variant === "red";
  const fg = isRed ? "text-paper-cream" : "text-ink";
  const muted = isRed ? "text-paper-cream/75" : "text-ink/65";

  return (
    <div className={`relative w-[1080px] h-[1920px] overflow-hidden ${bgMap[variant]} ${fg}`}>
      {/* 装饰：四角网点 */}
      {!isRed && (
        <>
          <div className="absolute top-0 left-0 w-64 h-64 dots-pattern opacity-50 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-72 h-72 dots-pattern opacity-40 pointer-events-none" />
        </>
      )}
      {isRed && (
        <>
          <div className="absolute top-0 right-0 w-80 h-80 dots-pattern-cream opacity-40 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 dots-pattern-cream opacity-30 pointer-events-none" />
        </>
      )}

      {/* 顶部品牌条 */}
      {showHeader && (
        <div className="absolute top-0 left-0 right-0 h-28 px-12 flex items-center justify-between z-10">
          <img
            src={logo}
            alt="BOOMER OFF Vintage"
            className={`h-16 w-auto ${isRed ? "brightness-0 invert" : ""}`}
          />
          <div className={`font-condensed text-2xl tracking-[0.3em] ${muted}`}>
            BRAND BOOK · 2026
          </div>
        </div>
      )}
      {showHeader && (
        <div className={`absolute top-28 left-12 right-12 h-1 z-10 ${isRed ? "bg-paper-cream" : "bg-boomer-red"}`} />
      )}

      <div className="relative z-[5] w-full h-full">{children}</div>

      {/* 底部页脚 */}
      {!noFooter && (
        <div className="absolute bottom-0 left-0 right-0 h-24 px-12 flex items-center justify-between z-10">
          <div className={`font-condensed tracking-[0.3em] text-2xl ${muted}`}>
            BOOMER · OFF · VINTAGE
          </div>
          <div className="flex items-center gap-5">
            {chapter && (
              <span className={`font-display text-xl font-bold ${muted}`}>{chapter}</span>
            )}
            {pageNumber && totalPages && (
              <span className="font-en text-4xl tracking-wider">
                <span className={isRed ? "text-paper-cream" : "text-boomer-red"}>
                  {String(pageNumber).padStart(2, "0")}
                </span>
                <span className={muted}> / {String(totalPages).padStart(2, "0")}</span>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
