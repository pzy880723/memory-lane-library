import { useEffect, useRef, useState } from "react";

interface ScaledSlideProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * 1920x1080 fixed-resolution slide that scales to fit its parent.
 *
 * 重要：用 clientWidth/clientHeight 测「未变换」的承载盒，
 * 避免父级被 rotate / transform 后 getBoundingClientRect()
 * 给出旋转后的视觉宽高，导致 scale 算错。
 */
export function ScaledSlide({ children, className = "" }: ScaledSlideProps) {
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
        className="slide-wrapper slide-content"
        style={{ ["--scale" as string]: scale } as React.CSSProperties}
      >
        {children}
      </div>
    </div>
  );
}
