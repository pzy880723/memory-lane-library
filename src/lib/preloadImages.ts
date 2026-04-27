/**
 * 预加载所有幻灯片用到的图片。
 * - app 启动时立即并行下载所有 webp（共 ~4.5MB），后续翻页可命中浏览器缓存
 * - 同时触发 decode()，让位图提前栅格化
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

// 首屏关键图（封面 / 顶部 logo），高优先级
const CRITICAL = [logo, wechatQR];

// 其余图片（按用户翻页顺序大致排序，让前面的页先被缓存）
const REST = [
  // ch1 - 流量 / UGC / KOL / 评价
  celebWenqi, celebHuye,
  xhs1, xhs2, xhs3, xhs4, xhs5, xhs6, xhs7,
  dy1, dy2,
  dp1, dp2, dp3, dp4, dp5, dp6,
  // ch4 - 店铺实拍
  photoVinyl, photoCeramics, photoDIY, photoSato, photoSatoDetail,
  photoCups, photoUltraman, photoTeapot, photoPikachu, photoDiatone,
];

let started = false;

export function preloadAllImages() {
  if (started || typeof window === "undefined") return;
  started = true;

  const fire = (src: string, priority: "high" | "low" = "low") => {
    const img = new Image();
    // fetchpriority 在新版浏览器有效，旧版会忽略
    (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority = priority;
    img.decoding = "async";
    img.src = src;
    // decode() 在缓存命中后再次调用是 no-op，但能让首次解码提前发生
    img.decode?.().catch(() => { /* ignore */ });
  };

  // 关键图立刻发起
  CRITICAL.forEach((src) => fire(src, "high"));

  // 其余图在 idle 时分批发起，避免抢占首屏带宽
  const startRest = () => REST.forEach((src) => fire(src, "low"));
  type IdleWindow = Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  };
  const w = window as IdleWindow;
  if (typeof w.requestIdleCallback === "function") {
    w.requestIdleCallback(startRest, { timeout: 800 });
  } else {
    setTimeout(startRest, 200);
  }
}
