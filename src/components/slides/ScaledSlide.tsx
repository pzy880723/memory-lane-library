import { useEffect, useRef, useState } from "react";

interface ScaledSlideProps {
  children: React.ReactNode;
  /** 1 = full size (1920x1080), use smaller for thumbnails */
  fitTo?: HTMLElement | null;
  className?: string;
}

/** 1920x1080 fixed-resolution slide that scales to fit its parent */
export function ScaledSlide({ children, className = "" }: ScaledSlideProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      const el = stageRef.current;
      if (!el) return;
      const { width, height } = el.getBoundingClientRect();
      const s = Math.min(width / 1920, height / 1080);
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
  }, []);

  return (
    <div ref={stageRef} className={`slide-stage ${className}`}>
      <div
        className="slide-wrapper slide-content"
        style={{ ["--scale" as string]: scale } as React.CSSProperties}
      >
        {children}
      </div>
    </div>
  );
}
