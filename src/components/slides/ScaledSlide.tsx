import { useEffect, useRef, useState } from "react";

interface ScaledSlideProps {
  children: React.ReactNode;
  className?: string;
  orientation?: "landscape" | "portrait";
}

/**
 * Fixed-resolution slide that scales to fit its parent.
 * - landscape: 1920×1080
 * - portrait:  1080×1920
 */
export function ScaledSlide({ children, className = "", orientation = "landscape" }: ScaledSlideProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const baseW = orientation === "portrait" ? 1080 : 1920;
  const baseH = orientation === "portrait" ? 1920 : 1080;

  useEffect(() => {
    const update = () => {
      const el = stageRef.current;
      if (!el) return;
      const { width, height } = el.getBoundingClientRect();
      const s = Math.min(width / baseW, height / baseH);
      setScale(s);
    };
    update();
    const ro = new ResizeObserver(update);
    if (stageRef.current) ro.observe(stageRef.current);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [baseW, baseH]);

  const wrapperClass =
    orientation === "portrait"
      ? "slide-wrapper-portrait slide-content slide-content-portrait"
      : "slide-wrapper slide-content";

  return (
    <div ref={stageRef} className={`slide-stage ${className}`}>
      <div className={wrapperClass} style={{ ["--scale" as string]: scale } as React.CSSProperties}>
        {children}
      </div>
    </div>
  );
}
