import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { preloadAllImages } from "./lib/preloadImages";

createRoot(document.getElementById("root")!).render(<App />);

// 立刻并行预加载所有幻灯片图片，命中浏览器缓存 → 翻页瞬时显示
preloadAllImages();
