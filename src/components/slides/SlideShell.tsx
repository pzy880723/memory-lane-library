import logo from "@/assets/boomer-off-logo.png";

interface SlideShellProps {
  children: React.ReactNode;
  /** Slide number (1-based) for footer */
  pageNumber?: number;
  totalPages?: number;
  /** Show top brand bar */
  showHeader?: boolean;
  /** Background variant */
  variant?: "paper" | "cream" | "red" | "ink";
  /** Hide footer entirely (e.g. cover page) */
  noFooter?: boolean;
  /** Optional chapter label shown in footer */
  chapter?: string;
}

const bgMap = {
  paper: "paper-texture",
  cream: "paper-cream",
  red: "bg-boomer-red",
  ink: "bg-ink",
};

export function SlideShell({
  children,
  pageNumber,
  totalPages,
  showHeader = true,
  variant = "paper",
  noFooter = false,
  chapter,
}: SlideShellProps) {
  const isDark = variant === "red" || variant === "ink";
  const fg = isDark ? "text-paper-cream" : "text-ink";
  const muted = isDark ? "text-paper-cream/70" : "text-ink/60";

  return (
    <div className={`relative w-[1920px] h-[1080px] overflow-hidden ${bgMap[variant]} ${fg}`}>
      {/* 装饰：四角网点 */}
      {variant !== "red" && variant !== "ink" && (
        <>
          <div className="absolute top-0 left-0 w-64 h-64 dots-pattern opacity-50 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-80 h-80 dots-pattern opacity-40 pointer-events-none" />
        </>
      )}

      {/* 顶部品牌条 */}
      {showHeader && (
        <div className="absolute top-0 left-0 right-0 h-20 px-16 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <img src={logo} alt="BOOMER OFF Vintage" className="h-12 w-auto" />
          </div>
          <div className={`font-condensed text-2xl tracking-widest ${muted}`}>
            BRAND BOOK · 2026
          </div>
        </div>
      )}

      {/* 顶部红线 */}
      {showHeader && (
        <div className="absolute top-20 left-16 right-16 h-[3px] bg-boomer-red z-10" />
      )}

      {/* 内容区 */}
      <div className="relative z-[5] w-full h-full">{children}</div>

      {/* 底部页脚 */}
      {!noFooter && (
        <div className="absolute bottom-0 left-0 right-0 h-16 px-16 flex items-center justify-between z-10">
          <div className={`font-condensed tracking-widest text-xl ${muted}`}>
            BOOMER · OFF · VINTAGE
          </div>
          <div className="flex items-center gap-4">
            {chapter && (
              <span className={`font-display text-xl ${muted}`}>{chapter}</span>
            )}
            {pageNumber && totalPages && (
              <span className="font-en text-3xl tracking-wider">
                <span className={isDark ? "text-paper-cream" : "text-boomer-red"}>
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
