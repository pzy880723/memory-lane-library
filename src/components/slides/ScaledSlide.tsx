import { useEffect, useRef, useState } from "react";

interface ScaledSlideProps {
  children: React.ReactNode;
  className?: string;
  contentRef?: (el: HTMLDivElement | null) => void;
}

/**
 * 1920x1080 fixed-resolution slide that scales to fit its parent.
 */
export function ScaledSlide({ children, className = "", contentRef }: ScaledSlideProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      const el = stageRef.current;
      if (!el) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      const s = Math.min(w / 1920, h / 1080);
      setScale(s);
    };
    update();
    const ro = new ResizeObserver(update);
    if (stageRef.current) ro.observe(stageRef.current);
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return (
    <div ref={stageRef} className={`slide-stage ${className}`}>
      <div
        ref={contentRef}
        className="slide-wrapper slide-content"
        style={{ ["--scale" as string]: scale } as React.CSSProperties}
      >
        {children}
      </div>
    </div>
  );
}
