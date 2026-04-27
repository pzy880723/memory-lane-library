/**
 * 图片加载策略：下载与解码解耦
 *
 * 1. preloadAllImages()  → 启动时调用：低优先级 fetch 所有 webp 进 HTTP 缓存
 *                          （只下载，不解码 → 不卡主线程）
 * 2. decodeForSlide(srcs) → 翻页时调用：串行 decode 当前页 + 邻页的图
 *                          （已解码过的不会重复处理）
 *
 * 这样翻页时图早就在内存里了，但又不会一次性 27 张全 decode 把主线程堵死。
 */

import logo from "@/assets/boomer-off-logo.png";
import wechatQR from "@/assets/wechat-qr.png";

import photoVinyl from "@/assets/store/vinyl-player.webp";
import photoCeramics from "@/assets/store/ceramics-shelf.webp";
import photoDIY from "@/assets/store/diy-zone.webp";
import photoSato from "@/assets/store/sato-elephant.webp";
import photoSatoDetail from "@/assets/store/sato-detail.webp";
import photoCups from "@/assets/store/cup-collection.webp";
import photoUltraman from "@/assets/store/ultraman-toys.webp";
import photoTeapot from "@/assets/store/iron-teapot.webp";
import photoPikachu from "@/assets/store/pikachu-mug.webp";
import photoDiatone from "@/assets/store/diatone-spinning.webp";

import celebWenqi from "@/assets/ugc/celeb-wenqi.webp";
import celebHuye from "@/assets/ugc/celeb-huye.webp";

import xhs1 from "@/assets/ugc/xhs-1.webp";
import xhs2 from "@/assets/ugc/xhs-2.webp";
import xhs3 from "@/assets/ugc/xhs-3.webp";
import xhs4 from "@/assets/ugc/xhs-4.webp";
import xhs5 from "@/assets/ugc/xhs-5.webp";
import xhs6 from "@/assets/ugc/xhs-6.webp";
import xhs7 from "@/assets/ugc/xhs-7.webp";
import dy1 from "@/assets/ugc/dy-1.webp";
import dy2 from "@/assets/ugc/dy-2.webp";

import dp1 from "@/assets/ugc/dp-1.webp";
import dp2 from "@/assets/ugc/dp-2.webp";
import dp3 from "@/assets/ugc/dp-3.webp";
import dp4 from "@/assets/ugc/dp-4.webp";
import dp5 from "@/assets/ugc/dp-5.webp";
import dp6 from "@/assets/ugc/dp-6.webp";

/* ───────────── 资源地图（导出供 registry/AllSlides 使用）───────────── */

export const ASSETS = {
  logo, wechatQR,
  photoVinyl, photoCeramics, photoDIY, photoSato, photoSatoDetail,
  photoCups, photoUltraman, photoTeapot, photoPikachu, photoDiatone,
  celebWenqi, celebHuye,
  xhs1, xhs2, xhs3, xhs4, xhs5, xhs6, xhs7,
  dy1, dy2,
  dp1, dp2, dp3, dp4, dp5, dp6,
} as const;

const ALL_SRCS: string[] = Object.values(ASSETS);

/* ───────────── 1. 下载阶段：把所有图塞进 HTTP 缓存 ───────────── */

let downloadStarted = false;
const downloadedSrcs = new Set<string>();

export function preloadAllImages() {
  if (downloadStarted || typeof window === "undefined") return;
  downloadStarted = true;

  // 用 fetch 而不是 new Image()，避免触发自动 decode
  // priority: "low" 让首屏关键资源（JS/CSS）先走
  for (const src of ALL_SRCS) {
    fetch(src, {
      // @ts-expect-error  priority 是较新的 fetch 选项
      priority: "low",
      cache: "force-cache",
    })
      .then(() => downloadedSrcs.add(src))
      .catch(() => { /* ignore */ });
  }
}

/* ───────────── 2. 解码阶段：按需串行 decode ───────────── */

const decodedSrcs = new Set<string>();
const decodeQueue: string[] = [];
let decoding = false;

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
};

function scheduleIdle(cb: () => void) {
  const w = window as IdleWindow;
  if (typeof w.requestIdleCallback === "function") {
    w.requestIdleCallback(cb, { timeout: 200 });
  } else {
    setTimeout(cb, 0);
  }
}

async function decodeOne(src: string): Promise<void> {
  if (decodedSrcs.has(src)) return;
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.src = src;
    const done = () => { decodedSrcs.add(src); resolve(); };
    img.decode?.().then(done).catch(done) ?? img.addEventListener("load", done, { once: true });
    img.addEventListener("error", done, { once: true });
  });
}

function pump() {
  if (decoding) return;
  const next = decodeQueue.shift();
  if (!next) return;
  decoding = true;
  scheduleIdle(async () => {
    await decodeOne(next);
    decoding = false;
    pump();
  });
}

/**
 * 把图加入解码队列，串行执行（每张之间让出主线程一次 idle 周期）。
 * 已解码的会被自动跳过。
 */
export function decodeForSlide(...srcGroups: (string[] | undefined)[]) {
  if (typeof window === "undefined") return;
  for (const group of srcGroups) {
    if (!group) continue;
    for (const src of group) {
      if (decodedSrcs.has(src) || decodeQueue.includes(src)) continue;
      decodeQueue.push(src);
    }
  }
  pump();
}
