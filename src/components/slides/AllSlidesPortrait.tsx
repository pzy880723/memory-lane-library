import logo from "@/assets/boomer-off-logo.png";
import {
  TrendingUp, MapPin, Users, Sparkles, Gamepad2, Heart, Zap,
  Shield, Award, Recycle, Building2, Phone, Star, Quote, ChevronRight,
  Package, Coffee, Headphones, Gift, Store, Home as HomeIcon,
  ShoppingBag, Smartphone, Warehouse, MessageCircle, BadgeCheck, Disc3,
  Check, X, Camera, Music, ArrowRight, Eye,
} from "lucide-react";

import photoVinyl from "@/assets/store/vinyl-player.jpeg";
import photoCeramics from "@/assets/store/ceramics-shelf.jpeg";
import photoDIY from "@/assets/store/diy-zone.jpeg";
import photoSato from "@/assets/store/sato-elephant.jpeg";
import photoSatoDetail from "@/assets/store/sato-detail.jpeg";
import photoCups from "@/assets/store/cup-collection.jpeg";
import photoUltraman from "@/assets/store/ultraman-toys.jpeg";
import photoTeapot from "@/assets/store/iron-teapot.jpeg";
import photoPikachu from "@/assets/store/pikachu-mug.jpeg";
import photoDiatone from "@/assets/store/diatone-spinning.jpeg";
import wechatQR from "@/assets/wechat-qr.png";

/* ============================================================
 * 竖版幻灯片 (1080×1920) — 重新设计版
 * 设计语言：
 *  - 满版图 + 文字叠加（电影海报式）
 *  - 大色块对角/横切分割
 *  - 超大数字、最少留白、强烈对比
 *  - 垂直叙事节奏：标题 / 主视觉 / 收尾
 * ============================================================ */

/* ---- 通用：极简页脚 + logo 角标 ---- */
function Footer({ page, total, chapter, dark = false }: { page?: number; total?: number; chapter?: string; dark?: boolean }) {
  const cls = dark ? "text-paper-cream/85" : "text-ink/60";
  return (
    <div className="absolute bottom-0 left-0 right-0 h-14 px-10 flex items-center justify-between z-30 pointer-events-none">
      <div className={`font-condensed tracking-[0.3em] text-xl ${cls}`}>BOOMER · OFF · VINTAGE</div>
      <div className="flex items-center gap-4">
        {chapter && <span className={`font-display text-lg font-bold ${cls}`}>{chapter}</span>}
        {page && total && (
          <span className="font-en text-3xl tracking-wider">
            <span className={dark ? "text-paper-cream" : "text-boomer-red"}>{String(page).padStart(2, "0")}</span>
            <span className={cls}> / {String(total).padStart(2, "0")}</span>
          </span>
        )}
      </div>
    </div>
  );
}

function Frame({ children, bg = "paper", page, total, chapter, dark = false, flex = false }: {
  children: React.ReactNode; bg?: string; page?: number; total?: number; chapter?: string; dark?: boolean;
  /** 设为 true 时，根容器变 flex-col，子级用 flex-1/grow 自适应撑满 1920 高度 */
  flex?: boolean;
}) {
  const bgCls: Record<string, string> = {
    paper: "paper-texture",
    cream: "paper-cream",
    warm: "paper-warm-bg",
    sand: "paper-sand-bg",
    red: "bg-boomer-red",
    "red-deep": "bg-boomer-red-deep",
  };
  return (
    <div className={`relative w-[1080px] h-[1920px] overflow-hidden ${bgCls[bg]} ${dark ? "text-paper-cream" : "text-ink"} ${flex ? "flex flex-col" : ""}`}>
      {children}
      <Footer page={page} total={total} chapter={chapter} dark={dark} />
    </div>
  );
}

/* ============ 1. 封面 — 全屏拼贴海报 ============ */
export function P_Cover() {
  return (
    <Frame bg="paper" flex>
      {/* 上半部分：红色满版照片 60% 高 */}
      <div className="relative basis-[60%] grow-0 shrink-0 bg-boomer-red overflow-hidden">
        <div className="absolute inset-0 dots-pattern-cream opacity-25" />
        <img src={photoSatoDetail} alt="" className="absolute right-0 top-0 w-[680px] h-full object-cover opacity-95" />
        <div className="absolute inset-0 bg-gradient-to-r from-boomer-red via-boomer-red/80 to-transparent" />

        {/* 顶部品牌条 */}
        <div className="absolute top-12 left-12 right-12 flex items-center justify-between z-10">
          <img src={logo} alt="BOOMER OFF" className="h-16 brightness-0 invert" />
          <div className="font-condensed text-2xl tracking-[0.4em] text-paper-cream/90">BRAND BOOK · 2026</div>
        </div>

        {/* 主标题 — 居中偏下 */}
        <div className="absolute bottom-16 left-12 right-12 z-10">
          <div className="font-handwrite text-5xl text-vintage-gold mb-3">— National No.1 —</div>
          <h1 className="font-display text-paper-cream text-[120px] font-black leading-[0.92]">
            国 内 首 家
          </h1>
          <h1 className="font-display text-paper-cream text-[80px] font-black leading-tight mt-3">
            标准化中古连锁
          </h1>
        </div>
      </div>

      {/* 下半部分：米色块 — flex 自适应填满剩余 40% */}
      <div className="relative grow flex flex-col justify-between px-12 py-14">
        {/* 顶部印章 + 右侧照片 */}
        <div className="flex items-start justify-between gap-6">
          <div className="vintage-border bg-paper-cream px-10 py-7 rotate-[-2deg]">
            <p className="font-display text-7xl font-black tracking-wider whitespace-nowrap">
              虽 古 但 新
            </p>
            <p className="font-display text-5xl text-boomer-red font-black mt-2 whitespace-nowrap">信 任 可 见</p>
          </div>
          <div className="relative shrink-0 mt-2">
            <img src={photoCeramics} alt="" className="absolute -top-4 -right-2 w-[180px] h-[230px] object-cover photo-vintage rotate-[-5deg]" />
            <img src={photoVinyl} alt="" className="relative w-[230px] h-[290px] object-cover photo-vintage rotate-[6deg] ml-32" />
          </div>
        </div>

        {/* 底部引用 + 大编号 */}
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="font-handwrite text-4xl text-boomer-red leading-tight">A Tiny Basement Shop</div>
            <div className="font-handwrite text-4xl text-boomer-red leading-tight">Full of Old Toys</div>
            <div className="font-condensed text-xl tracking-widest text-ink/60 mt-3">— SmartShanghai · 2026.03</div>
          </div>
          <div className="font-en text-[180px] text-boomer-red/15 leading-none -mb-6">No.1</div>
        </div>
      </div>
    </Frame>
  );
}

/* ============ 2. 目录 — 满屏大色块网格 ============ */
export function P_TOC({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  const items = [
    { num: "01", title: "市场表现", en: "MARKET PROOF", color: "bg-boomer-red text-paper-cream", icon: TrendingUp },
    { num: "02", title: "品牌定位", en: "WHO WE ARE", color: "bg-paper-cream", icon: Heart },
    { num: "03", title: "市场机遇", en: "OPPORTUNITY", color: "bg-vintage-gold", icon: Recycle },
    { num: "04", title: "商业模式", en: "BUSINESS", color: "bg-paper-cream", icon: Store },
    { num: "05", title: "BOVAS 体系", en: "TRUST", color: "bg-vintage-coral text-paper-cream", icon: Shield },
    { num: "06", title: "核心价值", en: "VALUE", color: "bg-paper-cream", icon: Sparkles },
    { num: "07", title: "门店合作", en: "PARTNERSHIP", color: "bg-vintage-gold", icon: BadgeCheck },
    { num: "08", title: "品牌矩阵", en: "MATRIX", color: "bg-boomer-red text-paper-cream", icon: Building2 },
    { num: "09", title: "联系我们", en: "CONTACT", color: "bg-paper-cream", icon: Phone },
  ];
  return (
    <Frame bg="paper" page={pageNumber} total={totalPages}>
      {/* 顶部标题块 */}
      <div className="absolute top-0 left-0 right-0 h-[280px] bg-ink text-paper-cream px-12 flex items-end pb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <img src={logo} alt="" className="h-10 brightness-0 invert" />
            <span className="font-condensed text-lg tracking-[0.3em] text-paper-cream/70">BRAND BOOK · 2026</span>
          </div>
          <div className="flex items-baseline gap-6">
            <span className="font-en text-[120px] text-boomer-red leading-none">9</span>
            <div>
              <div className="font-en text-7xl text-paper-cream leading-none">CONTENTS</div>
              <div className="font-display text-3xl mt-2">章 节 目 录</div>
            </div>
          </div>
        </div>
      </div>

      {/* 9 个章节 — 3×3 网格 */}
      <div className="absolute top-[280px] left-0 right-0 bottom-14 grid grid-cols-3 gap-0">
        {items.map((it) => (
          <div key={it.num} className={`${it.color} relative p-6 flex flex-col justify-between border-r-2 border-b-2 border-ink/15`}>
            <div>
              <div className="font-en text-6xl leading-none opacity-90">{it.num}</div>
              <div className="font-condensed text-sm tracking-[0.2em] mt-2 opacity-75">{it.en}</div>
            </div>
            <div>
              <it.icon className="w-10 h-10 mb-3" strokeWidth={2} />
              <div className="font-display text-3xl font-black leading-tight">{it.title}</div>
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

/* ============ 3. 核心摘要 — 满版照片 + 数据条 ============ */
export function P_Executive({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  return (
    <Frame bg="paper" page={pageNumber} total={totalPages} chapter="EXECUTIVE" flex>
      {/* 上半 满版图 — 50% */}
      <div className="relative basis-1/2 grow-0 shrink-0 overflow-hidden">
        <img src={photoCeramics} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/20 to-ink/85" />

        <div className="absolute top-12 left-12 right-12 z-10">
          <div className="font-handwrite text-4xl text-vintage-gold mb-2">Executive Summary</div>
          <div className="font-condensed text-2xl tracking-[0.3em] text-paper-cream/80">摘 · 要</div>
        </div>

        <div className="absolute bottom-10 left-12 right-12 z-10">
          <h1 className="font-display text-paper-cream text-[92px] font-black leading-[0.95]">
            一 个<br/>
            <span className="text-boomer-red bg-paper-cream px-4 py-1 inline-block mt-2">现 象 级</span><br/>
            <span className="mt-2 inline-block">零售新物种</span>
          </h1>
        </div>
      </div>

      {/* 下半 红色块自适应 — 数据 + 双基因 */}
      <div className="relative grow flex flex-col bg-boomer-red text-paper-cream px-12 pt-10 pb-20">
        <div className="font-handwrite text-4xl text-vintage-gold mb-6">— 开业首店 · 实绩 —</div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          {[
            { v: "300", u: "万+", l: "全网曝光" },
            { v: "10",  u: "万+", l: "定向客流" },
            { v: "No.1", u: "",   l: "大众点评" },
          ].map((d) => (
            <div key={d.l}>
              <div className="mega-number text-[120px] leading-none">{d.v}<span className="text-4xl ml-1">{d.u}</span></div>
              <div className="font-display text-2xl font-bold mt-3 border-t-2 border-paper-cream/60 pt-3">{d.l}</div>
            </div>
          ))}
        </div>

        {/* 自适应填充：双基因卡片 */}
        <div className="grow flex flex-col justify-end">
          <div className="bg-paper-cream text-ink p-7 vintage-border-red">
            <div className="font-handwrite text-3xl text-boomer-red mb-2">Double DNA</div>
            <p className="font-display text-4xl font-black leading-tight">
              首创 <span className="bg-vintage-gold px-3 py-0.5">「标准化 × 氛围感」</span>
            </p>
            <p className="font-display text-4xl font-black leading-tight mt-2">双基因融合模式</p>
            <div className="grid grid-cols-3 gap-3 mt-5">
              {["可复制", "高粘性", "强口碑"].map((t) => (
                <div key={t} className="bg-ink text-paper-cream font-display text-xl font-bold py-2 text-center">{t}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* ============ 章节扉页 — 极简大字 ============ */
export function P_Chapter({
  num, title, en, desc, pageNumber, totalPages,
}: { num: string; title: string; en: string; desc: string; pageNumber: number; totalPages: number }) {
  return (
    <Frame bg="red" page={pageNumber} total={totalPages} chapter={`CH ${num}`} dark>
      <div className="absolute inset-0 dots-pattern-cream opacity-20" />

      {/* 顶部 */}
      <div className="absolute top-12 left-12 right-12 flex items-center justify-between">
        <img src={logo} alt="" className="h-12 brightness-0 invert" />
        <div className="font-condensed text-xl tracking-[0.3em] text-paper-cream/80">CHAPTER · {num}</div>
      </div>

      {/* 巨大编号 */}
      <div className="absolute top-[200px] left-12 right-12">
        <div className="font-en text-[600px] leading-[0.78] text-paper-cream/15">{num}</div>
      </div>

      {/* 主内容 */}
      <div className="absolute bottom-[180px] left-12 right-12 z-10">
        <div className="font-handwrite text-5xl text-vintage-gold mb-4">— Chapter {num} —</div>
        <div className="font-en text-7xl text-paper-cream/95 leading-none mb-6">{en}</div>
        <h1 className="font-display text-[88px] font-black leading-[0.95] mb-8">{title}</h1>
        <div className="w-32 h-2 bg-vintage-gold mb-6" />
        <p className="font-body text-3xl leading-relaxed font-medium text-paper-cream/95">{desc}</p>
      </div>
    </Frame>
  );
}

/* ============ 5. 自然流量奇迹 — 数据轰炸 ============ */
export function P_Traffic({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  return (
    <Frame bg="paper" page={pageNumber} total={totalPages} chapter="01 · 首店实绩">
      {/* 顶部标题 */}
      <div className="absolute top-12 left-12 right-12">
        <div className="flex items-center gap-3 mb-2">
          <img src={logo} alt="" className="h-10" />
          <span className="font-handwrite text-3xl text-boomer-red">Zero Marketing</span>
        </div>
        <h1 className="font-display text-7xl font-black leading-[0.95]">
          零投放的<br/>
          <span className="text-boomer-red highlight-yellow">自然流量奇迹</span>
        </h1>
      </div>

      {/* 主数据：超大 */}
      <div className="absolute top-[420px] left-0 right-0 bg-boomer-red text-paper-cream px-12 py-10">
        <div className="flex items-end gap-4 mb-6 border-b-4 border-paper-cream/40 pb-5">
          <TrendingUp className="w-16 h-16" strokeWidth={2.5} />
          <div className="font-display text-3xl font-bold">全 网 曝 光</div>
        </div>
        <div className="mega-number text-[200px] leading-[0.85]">300<span className="text-6xl ml-3">万+</span></div>
        <div className="font-handwrite text-4xl text-vintage-gold mt-4">— 现象级自然爆发 —</div>
      </div>

      {/* 第二数据 */}
      <div className="absolute top-[920px] left-0 right-0 bg-vintage-gold text-ink px-12 py-10">
        <div className="flex items-end gap-4 mb-6 border-b-4 border-ink/40 pb-5">
          <Users className="w-16 h-16 text-boomer-red" strokeWidth={2.5} />
          <div className="font-display text-3xl font-bold">定 向 客 流</div>
        </div>
        <div className="mega-number text-[200px] leading-[0.85] text-boomer-red">10<span className="text-6xl ml-3 text-ink">万+</span></div>
      </div>

      {/* 底部 6 个排名 */}
      <div className="absolute top-[1420px] left-0 right-0 bottom-14 px-10 pt-8 grid grid-cols-3 gap-3">
        {[
          { l: "南京西路", v: "No.1", s: "商圈" },
          { l: "静安区", v: "No.1", s: "全域" },
          { l: "上海", v: "No.5", s: "全市" },
          { l: "小红书", v: "AI推荐", s: "杂货铺" },
          { l: "明星KOL", v: "自发", s: "打卡" },
          { l: "月均收藏", v: "1K+", s: "持续" },
        ].map((d) => (
          <div key={d.l} className="vintage-border bg-paper-cream p-3 text-center">
            <div className="font-condensed text-xs tracking-widest text-ink/55">{d.l}</div>
            <div className="font-display text-3xl font-black text-boomer-red leading-tight my-1">{d.v}</div>
            <div className="font-body text-sm text-ink/65">{d.s}</div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

/* ============ 6. SmartShanghai — 杂志报道感 ============ */
export function P_Media({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  return (
    <Frame bg="cream" page={pageNumber} total={totalPages} chapter="01 · 首店实绩">
      {/* 顶部红色标签条 */}
      <div className="absolute top-0 left-0 right-0 bg-boomer-red text-paper-cream py-5 px-12 flex items-center justify-between">
        <div className="font-condensed text-2xl tracking-[0.3em]">FEATURED · MEDIA</div>
        <div className="font-handwrite text-3xl text-vintage-gold">SmartShanghai</div>
      </div>

      {/* 大标题区 */}
      <div className="absolute top-20 left-12 right-12 pt-8">
        <div className="font-condensed text-lg tracking-[0.3em] text-ink/55 mb-2">2026.03 · COVER STORY</div>
        <h1 className="font-display text-7xl font-black leading-[0.95]">
          被<span className="text-boomer-red">权威媒体</span><br/>
          专 题 报 道
        </h1>
      </div>

      {/* 满版图 */}
      <img src={photoDiatone} alt="" className="absolute top-[480px] left-0 right-0 w-full h-[460px] object-cover" />

      {/* 标题印章 */}
      <div className="absolute top-[420px] left-12 bg-ink text-paper-cream px-6 py-4 rotate-[-3deg] z-10 vintage-border-soft">
        <div className="font-en text-3xl">A TINY BASEMENT SHOP</div>
        <div className="font-en text-3xl">FULL OF OLD TOYS</div>
      </div>

      {/* 引用 1 */}
      <div className="absolute top-[1000px] left-12 right-12 bg-paper-cream vintage-border p-7 rotate-[-1deg]">
        <Quote className="absolute -top-5 -left-3 w-14 h-14 text-boomer-red bg-paper-cream rounded-full p-2 vintage-border-soft" />
        <p className="font-display text-3xl leading-tight font-bold mb-2 mt-2">
          "It's not the kind of place you walk through in five minutes."
        </p>
        <p className="font-body text-xl text-ink/70 mt-3">— 这不是五分钟就能逛完的店</p>
      </div>

      {/* 引用 2 */}
      <div className="absolute bottom-32 left-12 right-12 bg-vintage-gold vintage-border-red p-7 rotate-[1deg]">
        <Quote className="absolute -top-5 -left-3 w-14 h-14 text-boomer-red bg-vintage-gold rounded-full p-2 vintage-border-soft" />
        <p className="font-display text-3xl leading-tight font-bold mb-2 mt-2">
          "Easy to stop by, easy to stay longer than planned."
        </p>
        <p className="font-body text-xl text-ink/80 mt-3">— 很容易待得比计划久得多</p>
      </div>
    </Frame>
  );
}

/* ============ 7. 关键词 — 大色块标签云 ============ */
export function P_Keywords({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  return (
    <Frame bg="paper" page={pageNumber} total={totalPages} chapter="01 · 首店实绩">
      {/* 顶部 */}
      <div className="absolute top-12 left-12 right-12">
        <div className="font-handwrite text-3xl text-boomer-red">Voice of Customers</div>
        <h1 className="font-display text-7xl font-black mt-2 leading-[0.95]">
          高频<span className="text-boomer-red">关键词</span>
        </h1>
        <div className="font-condensed text-xl tracking-[0.2em] text-ink/65 mt-3">小红书 · 大众点评 · 抖音</div>
      </div>

      {/* 大引言色块 */}
      <div className="absolute top-[460px] left-0 right-0 bg-ink text-paper-cream px-12 py-8">
        <Quote className="w-14 h-14 text-boomer-red mb-3" />
        <p className="font-display text-4xl leading-[1.2] font-bold">
          "上海少见的<span className="text-vintage-gold">日本中古</span>，
          可以逛<span className="text-vintage-gold">一下午</span>，
          翻筐<span className="text-vintage-gold">停不下来</span>"
        </p>
      </div>

      {/* 6 个分类 — 满宽两列 */}
      <div className="absolute top-[860px] left-0 right-0 bottom-14 grid grid-cols-2 gap-0">
        {[
          { cat: "稀缺性", quotes: ["上海少见", "国内第一"], color: "bg-boomer-red text-paper-cream", icon: Star },
          { cat: "沉浸感", quotes: ["可以逛一下午", "翻筐停不下来"], color: "bg-paper-cream", icon: Eye },
          { cat: "情绪价值", quotes: ["治愈", "回忆杀", "有温度"], color: "bg-vintage-gold", icon: Heart },
          { cat: "性价比", quotes: ["几块钱淘到好东西", "比代购便宜"], color: "bg-paper-warm", icon: BadgeCheck },
          { cat: "社交传播", quotes: ["拍照超好看", "必带闺蜜"], color: "bg-vintage-coral text-paper-cream", icon: Camera },
          { cat: "商业口碑", quotes: ["招商有品位", "终于有趣"], color: "bg-boomer-red text-paper-cream", icon: TrendingUp },
        ].map((g) => (
          <div key={g.cat} className={`${g.color} p-6 border-r-2 border-b-2 border-ink/15`}>
            <div className="flex items-center gap-2 mb-3">
              <g.icon className="w-7 h-7" strokeWidth={2.5} />
              <div className="font-display text-2xl font-black">{g.cat}</div>
            </div>
            {g.quotes.map((q) => (
              <div key={q} className="font-body text-xl leading-snug font-medium opacity-90">"{q}"</div>
            ))}
          </div>
        ))}
      </div>
    </Frame>
  );
}

/* ============ 10. 解决问题 — 三段式对比表 ============ */
export function P_Problem({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  return (
    <Frame bg="paper" page={pageNumber} total={totalPages} chapter="02 · 品牌定位">
      {/* 顶部 */}
      <div className="absolute top-12 left-12 right-12 text-center">
        <div className="font-handwrite text-3xl text-boomer-red">ダブル DNA · 双基因</div>
        <h1 className="font-display text-7xl font-black mt-2 leading-[0.95]">
          标准化 <span className="text-boomer-red">×</span> 氛围感
        </h1>
        <div className="font-display text-3xl mt-3 text-ink/75">融 合 模 式</div>
      </div>

      {/* A 模式 */}
      <div className="absolute top-[400px] left-0 right-0 bg-paper-cream border-y-4 border-ink/15 p-7">
        <div className="flex items-start gap-5">
          <div className="font-en text-7xl text-ink/30 leading-none">A</div>
          <div className="flex-1">
            <div className="font-condensed text-base tracking-[0.2em] text-ink/55">如 BOOK OFF · 日本</div>
            <div className="font-display text-3xl font-black mb-3">标准化中古店</div>
            <div className="flex flex-wrap gap-2">
              {["✓ 明码标价", "✓ 标准陈列", "✓ 可复制"].map(t => (
                <span key={t} className="px-3 py-1 bg-vintage-moss/15 text-vintage-moss font-display text-lg font-bold">{t}</span>
              ))}
              {["✗ 缺氛围", "✗ 情绪低"].map(t => (
                <span key={t} className="px-3 py-1 bg-ink/10 text-ink/45 font-display text-lg font-bold line-through">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* B 模式 - BOOMER OFF 突出 */}
      <div className="absolute top-[720px] left-0 right-0 bg-boomer-red text-paper-cream p-8 z-10 shadow-2xl">
        <div className="absolute -top-4 -right-4 bg-vintage-gold text-ink font-display text-2xl font-black px-4 py-2 rotate-6 vintage-border-soft">★ BOOMER OFF</div>
        <div className="flex items-start gap-5">
          <div className="font-en text-8xl text-paper-cream leading-none">B</div>
          <div className="flex-1">
            <div className="font-condensed text-base tracking-[0.2em] text-paper-cream/85">融 · 合 · 模 · 式</div>
            <div className="font-display text-4xl font-black mb-4">两者最优组合</div>
            <div className="grid grid-cols-2 gap-2">
              {["★ 标准化 + 氛围感", "★ 透明定价 + 评级", "★ 沉浸声光 + IP", "★ 6.9 元起售", "★ 可复制可加盟", "★ 信任可见"].map(t => (
                <div key={t} className="font-display text-xl font-bold leading-snug">{t}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* C 模式 */}
      <div className="absolute bottom-14 left-0 right-0 bg-paper-cream border-y-4 border-ink/15 p-7">
        <div className="flex items-start gap-5">
          <div className="font-en text-7xl text-ink/30 leading-none">C</div>
          <div className="flex-1">
            <div className="font-condensed text-base tracking-[0.2em] text-ink/55">主理人审美 · 街边</div>
            <div className="font-display text-3xl font-black mb-3">设计师中古店</div>
            <div className="flex flex-wrap gap-2">
              {["✓ 设计感强", "✓ 氛围出片"].map(t => (
                <span key={t} className="px-3 py-1 bg-vintage-moss/15 text-vintage-moss font-display text-lg font-bold">{t}</span>
              ))}
              {["✗ 定价不透明", "✗ 依赖主理人"].map(t => (
                <span key={t} className="px-3 py-1 bg-ink/10 text-ink/45 font-display text-lg font-bold line-through">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* ============ 11. 品牌故事 — 红色全屏故事书 ============ */
export function P_Story({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  return (
    <Frame bg="red" page={pageNumber} total={totalPages} chapter="02 · 品牌定位" dark>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] dots-pattern-cream opacity-20" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] dots-pattern-cream opacity-15" />
      </div>

      {/* 顶部 */}
      <div className="absolute top-12 left-12 right-12">
        <img src={logo} alt="" className="h-12 brightness-0 invert mb-3" />
        <div className="font-handwrite text-4xl text-vintage-gold">Brand Story</div>
        <div className="font-condensed text-xl tracking-[0.3em] text-paper-cream/80 mt-1">品 · 牌 · 故 · 事</div>
      </div>

      {/* 主标题 — 巨型 */}
      <div className="absolute top-[280px] left-12 right-12">
        <h1 className="font-display text-[140px] font-black leading-[0.85]">
          一 个<br/>
          <span className="font-handwrite text-[180px] text-vintage-gold leading-none">时间</span><br/>
          收容所
        </h1>
      </div>

      {/* 中部金色色条 */}
      <div className="absolute top-[1080px] left-0 right-0 bg-vintage-gold text-ink px-12 py-7">
        <p className="font-display text-3xl leading-tight font-bold">
          让都市白领下班后<br/>
          可以「<span className="font-handwrite text-4xl text-boomer-red">合法浪费时间</span>」
        </p>
      </div>

      {/* 下部正文 */}
      <div className="absolute top-[1280px] left-12 right-12">
        <p className="font-body text-2xl leading-relaxed font-medium">
          <span className="font-display font-black text-vintage-gold text-3xl">BOOMER OFF</span> 诞生于一个洞察 ——
        </p>
        <p className="font-display text-3xl leading-tight font-bold mt-3">
          我们需要的不是更多新商品，<br/>
          而是<span className="bg-vintage-gold text-ink px-2 font-black">带有时间温度的旧物</span>
        </p>
      </div>

      {/* 底部双标签 */}
      <div className="absolute bottom-24 left-12 right-12 grid grid-cols-2 gap-4">
        <div className="bg-paper-cream text-ink p-5 vintage-border-soft">
          <div className="font-handwrite text-xl text-boomer-red">Slogan</div>
          <div className="font-display text-3xl font-black">虽古但新</div>
        </div>
        <div className="bg-vintage-gold text-ink p-5 vintage-border-soft">
          <div className="font-handwrite text-xl text-boomer-red">Model</div>
          <div className="font-display text-3xl font-black">标准×氛围</div>
        </div>
      </div>
    </Frame>
  );
}

/* ============ 12. 用户画像 — 满屏五段彩条 ============ */
export function P_Persona({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  const personas = [
    { age: "儿童", num: "3-12", emoji: "🧸", pref: "玩具 · IP 收藏", color: "bg-boomer-red text-paper-cream" },
    { age: "青少年", num: "13-22", emoji: "🎒", pref: "毛绒 · 二次元", color: "bg-paper-cream" },
    { age: "都市白领", num: "23-35", emoji: "📷", pref: "CCD · 配饰 · 瓷器", color: "bg-vintage-gold" },
    { age: "中年群体", num: "36-55", emoji: "🎵", pref: "黑胶 · 铁壶", color: "bg-paper-cream" },
    { age: "老年群体", num: "55+", emoji: "🍵", pref: "瓷器 · 线香", color: "bg-vintage-coral text-paper-cream" },
  ];
  return (
    <Frame bg="paper" page={pageNumber} total={totalPages} chapter="02 · 品牌定位">
      {/* 顶部 */}
      <div className="absolute top-12 left-12 right-12">
        <div className="font-handwrite text-3xl text-boomer-red">Target Audience</div>
        <h1 className="font-display text-7xl font-black mt-2 leading-[0.95]">
          覆 盖 <span className="text-boomer-red">全年龄</span>
        </h1>
        <div className="font-display text-3xl text-ink/75 mt-3">从 3 岁到 90 岁，全家共同打卡</div>
      </div>

      {/* 5 个人群 — 满宽彩条 */}
      <div className="absolute top-[420px] left-0 right-0 bottom-[180px] flex flex-col">
        {personas.map((p) => (
          <div key={p.age} className={`flex-1 ${p.color} px-12 flex items-center justify-between border-b-2 border-ink/15`}>
            <div className="text-7xl">{p.emoji}</div>
            <div className="flex-1 ml-6">
              <div className="font-display text-4xl font-black leading-tight">{p.age}</div>
              <div className="font-body text-xl mt-1 opacity-85 font-medium">{p.pref}</div>
            </div>
            <div className="font-en text-5xl opacity-40 leading-none">{p.num}</div>
          </div>
        ))}
      </div>

      {/* 底部金色总结 */}
      <div className="absolute bottom-14 left-0 right-0 h-[180px] bg-ink text-paper-cream flex items-center justify-center px-12">
        <div className="text-center">
          <div className="text-6xl mb-2">👨‍👩‍👧‍👦</div>
          <div className="font-display text-3xl font-black">全 家 人 · 共 同 怀 旧</div>
          <div className="font-handwrite text-2xl text-vintage-gold mt-1">每个人都能找到自己的回忆</div>
        </div>
      </div>
    </Frame>
  );
}

/* ============ 13. 蓝海赛道 — 万亿数据全屏 ============ */
export function P_Market({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  return (
    <Frame bg="paper" page={pageNumber} total={totalPages} chapter="03 · 市场机遇">
      {/* 顶部 */}
      <div className="absolute top-12 left-12 right-12">
        <div className="font-handwrite text-3xl text-boomer-red">Blue Ocean Market</div>
        <h1 className="font-display text-7xl font-black mt-2 leading-[0.95]">
          万亿级市场<br/>
          <span className="text-boomer-red">线 下 空 白</span>
        </h1>
      </div>

      {/* 巨大数据色块 */}
      <div className="absolute top-[460px] left-0 right-0 bg-boomer-red text-paper-cream px-12 py-10 relative overflow-hidden">
        <div className="absolute -bottom-16 -right-16 w-72 h-72 dots-pattern-cream opacity-30" />
        <div className="font-handwrite text-3xl text-vintage-gold mb-3">2024 中国二手交易额</div>
        <div className="mega-number text-[260px] leading-[0.78]">1.69</div>
        <div className="flex items-end justify-between mt-2">
          <div className="font-display text-5xl font-black">万 亿</div>
          <div className="bg-vintage-gold text-ink px-5 py-3 vintage-border-soft rotate-3">
            <div className="font-en text-5xl leading-none">↑28%</div>
          </div>
        </div>
      </div>

      {/* 底部三段 */}
      <div className="absolute top-[1280px] left-0 right-0 bottom-14 grid grid-cols-3 gap-0">
        <div className="bg-vintage-gold p-6 border-r-2 border-ink/15 flex flex-col justify-between">
          <div>
            <div className="font-handwrite text-2xl text-boomer-red">主力人群</div>
            <div className="font-display text-3xl font-black mt-1">00 后</div>
            <div className="font-display text-3xl font-black">+ 90 后</div>
          </div>
          <Users className="w-12 h-12 text-boomer-red self-end" strokeWidth={2.5} />
        </div>
        <div className="bg-paper-cream p-6 border-r-2 border-ink/15 flex flex-col justify-between">
          <div>
            <div className="font-handwrite text-2xl text-boomer-red">线下空白</div>
            <div className="font-display text-3xl font-black mt-1 leading-tight">标准化<br/>平价店</div>
          </div>
          <Store className="w-12 h-12 text-boomer-red self-end" strokeWidth={2.5} />
        </div>
        <div className="bg-ink text-paper-cream p-6 flex flex-col justify-between">
          <div>
            <div className="font-handwrite text-2xl text-vintage-gold">机遇</div>
            <div className="font-display text-3xl font-black mt-1 leading-tight">现在<br/>正当时</div>
          </div>
          <Sparkles className="w-12 h-12 text-vintage-gold self-end" strokeWidth={2.5} />
        </div>
      </div>
    </Frame>
  );
}

/* ============ 14. 对标日本 — 巨型对比数据 ============ */
export function P_Japan({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  return (
    <Frame bg="cream" page={pageNumber} total={totalPages} chapter="03 · 市场机遇">
      {/* 顶部 */}
      <div className="absolute top-12 left-12 right-12">
        <div className="flex items-center gap-4">
          <div className="font-handwrite text-3xl text-boomer-red">Benchmark · Japan</div>
          <div className="text-5xl">🇯🇵</div>
        </div>
        <h1 className="font-display text-7xl font-black mt-2 leading-[0.95]">
          对 标<br/>
          <span className="text-boomer-red">日本 Reuse</span>
        </h1>
      </div>

      {/* 数据 1 - 满版 */}
      <div className="absolute top-[480px] left-0 right-0 bg-boomer-red text-paper-cream px-12 py-8">
        <div className="flex items-center gap-3 mb-2">
          <Recycle className="w-12 h-12" strokeWidth={2.5} />
          <div className="font-display text-2xl font-bold">市场规模</div>
        </div>
        <div className="mega-number text-[200px] leading-[0.85]">3.5<span className="text-5xl ml-3">万亿</span></div>
        <div className="font-display text-3xl mt-2">日 元 · 约 1,700 亿 RMB</div>
      </div>

      {/* 数据 2 */}
      <div className="absolute top-[1060px] left-0 right-0 bg-vintage-gold text-ink px-12 py-7 flex items-center justify-between">
        <div>
          <TrendingUp className="w-10 h-10 text-boomer-red mb-1" strokeWidth={2.5} />
          <div className="font-handwrite text-2xl text-boomer-red">持续增长</div>
          <div className="font-display text-3xl font-black">连续多年</div>
        </div>
        <div className="mega-number text-[140px] text-boomer-red leading-none">15<span className="text-3xl text-ink ml-2">年+</span></div>
      </div>

      {/* 数据 3 */}
      <div className="absolute top-[1420px] left-0 right-0 bottom-14 bg-ink text-paper-cream px-12 py-7 flex items-center justify-between">
        <div>
          <Users className="w-10 h-10 text-vintage-gold mb-1" strokeWidth={2.5} />
          <div className="font-handwrite text-2xl text-vintage-gold">国民渗透</div>
          <div className="font-display text-3xl font-black">购买二手</div>
        </div>
        <div className="mega-number text-[140px] text-vintage-gold leading-none">44.1<span className="text-3xl text-paper-cream ml-2">%</span></div>
      </div>
    </Frame>
  );
}

/* ============ 16. 空间概念 — 上下两层全屏 ============ */
export function P_Space({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  return (
    <Frame bg="paper" page={pageNumber} total={totalPages} chapter="04 · 商业模式">
      {/* 顶部超薄标题 */}
      <div className="absolute top-12 left-12 right-12">
        <div className="flex items-end justify-between">
          <div>
            <div className="font-handwrite text-3xl text-boomer-red">Space Concept</div>
            <h1 className="font-display text-6xl font-black leading-[0.95]">
              超 高 密 度<br/>× <span className="text-boomer-red">寻 宝</span>
            </h1>
          </div>
          <div className="text-right">
            <div className="mega-number text-7xl text-boomer-red leading-none">10K+</div>
            <div className="font-condensed text-lg tracking-widest text-ink/65">SKU</div>
          </div>
        </div>
      </div>

      {/* 上层 — 满版图 + 文字叠加 */}
      <div className="absolute top-[400px] left-0 right-0 h-[680px] overflow-hidden">
        <img src={photoCeramics} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-boomer-red via-boomer-red/30 to-transparent" />

        {/* 楼层标签 */}
        <div className="absolute top-6 left-6 bg-paper-cream px-4 py-2 vintage-border-soft">
          <div className="font-en text-2xl leading-none">FLOOR · 01</div>
        </div>

        <div className="absolute bottom-7 left-7 right-7 text-paper-cream">
          <div className="font-handwrite text-3xl text-vintage-gold">Upper Floor</div>
          <div className="font-display text-6xl font-black leading-tight">上 层 · 精 品 区</div>
          <div className="flex flex-wrap gap-2 mt-3">
            {["绝版手办", "复古相机", "品牌瓷器", "中古腕表", "黑胶机"].map(t => (
              <span key={t} className="px-3 py-1 bg-paper-cream text-ink font-display text-lg font-bold">{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* 下层 — 金色块 */}
      <div className="absolute top-[1080px] left-0 right-0 bottom-14 bg-vintage-gold text-ink px-10 pt-7 relative overflow-hidden">
        <div className="absolute inset-0 dots-pattern-red opacity-25" />

        <div className="relative z-10">
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="bg-boomer-red text-paper-cream px-3 py-1 inline-block font-en text-2xl leading-none mb-2">FLOOR · 02</div>
              <div className="font-handwrite text-3xl text-boomer-red">Lower Floor</div>
              <div className="font-display text-6xl font-black leading-tight">下 层 · 翻 筐 乐</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-5">
            <div className="bg-paper-cream vintage-border-soft p-4 text-center">
              <div className="mega-number text-5xl text-boomer-red leading-none">100<span className="text-xl">+</span></div>
              <div className="font-body text-base text-ink/75 mt-1 font-bold">平价木筐</div>
            </div>
            <div className="bg-paper-cream vintage-border-soft p-4 text-center">
              <div className="mega-number text-5xl text-boomer-red leading-none">¥6.9</div>
              <div className="font-body text-base text-ink/75 mt-1 font-bold">起售价</div>
            </div>
            <div className="bg-boomer-red text-paper-cream vintage-border-soft p-4 text-center">
              <div className="mega-number text-5xl leading-none">45-90</div>
              <div className="font-body text-base mt-1 font-bold">分钟停留</div>
            </div>
          </div>

          <p className="font-display text-2xl mt-4 leading-snug">
            「<span className="font-handwrite text-3xl text-boomer-red">逛不完</span>」驱动深度停留
          </p>
        </div>
      </div>
    </Frame>
  );
}

/* ============ 17. 沉浸体验 — 满版四宫格 ============ */
export function P_Experience({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  const items = [
    { icon: Disc3, title: "Diatone 唱片机", subtitle: "昭和经典 · 视听共振", photo: photoVinyl },
    { icon: Gamepad2, title: "巨型 Gameboy", subtitle: "可实操 · 跨年龄打卡", photo: photoUltraman },
    { icon: Sparkles, title: "佐藤象店头", subtitle: "无声招牌 · 合影圣地", photo: photoSato },
    { icon: Gift, title: "DIY 互动区", subtitle: "免费冰箱贴 · 月均 1K+", photo: photoDIY },
  ];
  return (
    <Frame bg="paper" page={pageNumber} total={totalPages} chapter="04 · 商业模式">
      {/* 顶部紧凑标题 */}
      <div className="absolute top-12 left-12 right-12">
        <div className="font-handwrite text-3xl text-boomer-red">Experience Design</div>
        <h1 className="font-display text-7xl font-black mt-2 leading-[0.95]">
          四 大 <span className="text-boomer-red">沉浸体验</span>
        </h1>
      </div>

      {/* 满屏 2x2 网格 — 大图 */}
      <div className="absolute top-[380px] left-0 right-0 bottom-14 grid grid-cols-2 grid-rows-2 gap-0">
        {items.map((it, i) => (
          <div key={it.title} className="relative overflow-hidden border-2 border-ink/20">
            <img src={it.photo} alt={it.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
            <div className="absolute top-4 right-4 w-14 h-14 bg-boomer-red rounded-full flex items-center justify-center vintage-border-soft">
              <it.icon className="w-7 h-7 text-paper-cream" strokeWidth={2.5} />
            </div>
            <div className="absolute top-4 left-4 bg-vintage-gold text-ink font-en text-xl px-3 py-1">0{i+1}</div>
            <div className="absolute bottom-5 left-5 right-5 text-paper-cream">
              <div className="font-display text-3xl font-black leading-tight">{it.title}</div>
              <div className="font-body text-lg mt-1 text-paper-cream/90 font-medium">{it.subtitle}</div>
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

/* ============ 18. 四大品类 — 满屏四列彩条 ============ */
export function P_Categories({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  const cats = [
    { icon: Package, name: "玩具动漫", photo: photoUltraman, items: ["不二家", "三丽鸥", "奥特曼", "假面骑士"], color: "bg-boomer-red text-paper-cream" },
    { icon: Coffee, name: "家居日用", photo: photoTeapot, items: ["日式餐具", "中古线香", "丝巾手帕", "玻璃器皿"], color: "bg-paper-cream" },
    { icon: Award, name: "首饰配饰", photo: photoPikachu, items: ["中古项链", "复古腕表", "经典徽章", "古着配饰"], color: "bg-vintage-gold" },
    { icon: Headphones, name: "数码音像", photo: photoVinyl, items: ["黑胶唱片", "随身听", "CCD 相机", "复古游戏"], color: "bg-vintage-coral text-paper-cream" },
  ];
  return (
    <Frame bg="paper" page={pageNumber} total={totalPages} chapter="04 · 商业模式">
      {/* 顶部 */}
      <div className="absolute top-12 left-12 right-12">
        <div className="font-handwrite text-3xl text-boomer-red">Four Categories</div>
        <h1 className="font-display text-6xl font-black mt-2 leading-[0.95]">
          覆盖<span className="text-boomer-red">半个世纪</span><br/>
          的宝藏品类
        </h1>
      </div>

      {/* 4 列满高 */}
      <div className="absolute top-[420px] left-0 right-0 bottom-14 grid grid-cols-2 grid-rows-2 gap-0">
        {cats.map((c) => (
          <div key={c.name} className={`${c.color} flex flex-col border-r-2 border-b-2 border-ink/15 overflow-hidden`}>
            <div className="relative h-[380px] overflow-hidden">
              <img src={c.photo} alt={c.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 w-12 h-12 bg-paper-cream rounded-full flex items-center justify-center vintage-border-soft">
                <c.icon className="w-6 h-6 text-boomer-red" strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex-1 p-5">
              <div className="font-display text-3xl font-black mb-3 leading-tight">{c.name}</div>
              <ul className="space-y-1">
                {c.items.map(i => (
                  <li key={i} className="font-body text-lg font-medium opacity-90 flex items-start gap-1.5">
                    <ChevronRight className="w-4 h-4 mt-1.5 flex-shrink-0" />{i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

/* ============ 19. 翻筐乐 — 满屏招牌 ============ */
export function P_FlipperFun({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  return (
    <Frame bg="red" page={pageNumber} total={totalPages} chapter="04 · 杀手锏" dark>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 dots-pattern-cream opacity-15" />
      </div>

      {/* 顶部小标 */}
      <div className="absolute top-12 left-12 right-12 flex items-center justify-between">
        <div className="font-handwrite text-3xl text-vintage-gold">Killer Sub-Brand</div>
        <div className="bg-vintage-gold text-ink px-4 py-1.5 font-display text-lg font-black rotate-3 vintage-border-soft">★ 流量爆点</div>
      </div>

      {/* 巨型招牌字 */}
      <div className="absolute top-[180px] left-12 right-12 text-center">
        <h1 className="font-display text-[180px] font-black text-paper-cream leading-[0.85]">翻 筐 乐</h1>
        <div className="font-en text-5xl text-vintage-gold mt-3">FLIPPER · FUN</div>
      </div>

      {/* 三大数字 */}
      <div className="absolute top-[680px] left-0 right-0 grid grid-cols-3 gap-0">
        <div className="bg-paper-cream text-ink p-6 text-center border-r-2 border-ink/30">
          <div className="font-handwrite text-xl text-boomer-red">起售</div>
          <div className="mega-number text-7xl text-boomer-red leading-none">¥6.9</div>
        </div>
        <div className="bg-vintage-gold text-ink p-6 text-center border-r-2 border-ink/30">
          <div className="font-handwrite text-xl text-boomer-red">停留</div>
          <div className="mega-number text-7xl text-boomer-red leading-none">45<span className="text-2xl">'</span></div>
        </div>
        <div className="bg-paper-cream text-ink p-6 text-center">
          <div className="font-handwrite text-xl text-boomer-red">UGC</div>
          <div className="mega-number text-7xl text-boomer-red leading-none">∞</div>
        </div>
      </div>

      {/* 双照片 */}
      <div className="absolute top-[920px] left-0 right-0 grid grid-cols-2 gap-0 h-[640px]">
        <img src={photoCups} alt="" className="w-full h-full object-cover border-r-4 border-paper-cream" />
        <img src={photoPikachu} alt="" className="w-full h-full object-cover" />
      </div>

      {/* 底部金色总结 */}
      <div className="absolute bottom-14 left-0 right-0 bg-vintage-gold text-ink px-12 py-5">
        <p className="font-display text-3xl font-black leading-tight text-center">
          统一低价 <span className="text-boomer-red">+</span> 自由翻找 <span className="text-boomer-red">=</span>
          <span className="font-handwrite text-4xl text-boomer-red ml-2">UGC 内容引爆</span>
        </p>
      </div>
    </Frame>
  );
}

/* ============ 20. VERITAS-CHAIN ============ */
export function P_Veritas({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  const steps = ["收购", "鉴定", "清洗", "评级", "上链", "包装"];
  return (
    <Frame bg="paper" page={pageNumber} total={totalPages} chapter="05 · BOVAS">
      {/* 顶部 */}
      <div className="absolute top-12 left-12 right-12">
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="font-handwrite text-3xl text-boomer-red">BOVAS · Part 1</div>
            <h1 className="font-display text-6xl font-black mt-2 leading-[0.95]">
              VERITAS-<br/><span className="text-boomer-red">CHAIN</span>
            </h1>
            <div className="font-display text-3xl mt-2">区 块 链 溯 源</div>
          </div>
          <div className="stamp-red text-2xl">开发中</div>
        </div>
      </div>

      {/* 满版六步流程 */}
      <div className="absolute top-[540px] left-0 right-0 bg-ink text-paper-cream px-10 py-7">
        <div className="font-handwrite text-2xl text-vintage-gold mb-3">— 全流程上链 —</div>
        <div className="grid grid-cols-6 gap-2">
          {steps.map((s, i) => (
            <div key={s} className="text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-boomer-red flex items-center justify-center font-en text-2xl mb-2">{i+1}</div>
              <div className="font-display text-xl font-bold">{s}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 三大特性 */}
      <div className="absolute top-[860px] left-0 right-0 bottom-14">
        <div className="bg-vintage-gold text-ink px-12 py-6 flex items-center gap-5 border-b-2 border-ink/20">
          <Shield className="w-16 h-16 text-boomer-red flex-shrink-0" strokeWidth={2.5} />
          <div>
            <div className="font-display text-3xl font-black leading-tight">NFC 红色吊牌</div>
            <div className="font-body text-xl text-ink/80 mt-1 font-medium">扫码查看商品「前世今生」</div>
          </div>
        </div>
        <div className="bg-paper-cream px-12 py-6 flex items-center gap-5 border-b-2 border-ink/20">
          <BadgeCheck className="w-16 h-16 text-boomer-red flex-shrink-0" strokeWidth={2.5} />
          <div>
            <div className="font-display text-3xl font-black leading-tight">全流程视频</div>
            <div className="font-body text-xl text-ink/75 mt-1 font-medium">鉴定到包装上链可追溯</div>
          </div>
        </div>
        <div className="bg-boomer-red text-paper-cream px-12 py-6 flex items-center gap-5">
          <Sparkles className="w-16 h-16 text-vintage-gold flex-shrink-0" strokeWidth={2.5} />
          <div>
            <div className="font-display text-3xl font-black leading-tight">行业开创性</div>
            <div className="font-body text-xl text-paper-cream/90 mt-1 font-medium">消除来源与品质疑虑</div>
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* ============ 21. AESTHETICA ============ */
export function P_Aesthetica({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  const grades = [
    { g: "N", name: "New", desc: "全新未使用", color: "bg-boomer-red text-paper-cream" },
    { g: "S", name: "Mint", desc: "极品微痕", color: "bg-vintage-gold" },
    { g: "A", name: "Excellent", desc: "优良品相", color: "bg-vintage-coral text-paper-cream" },
    { g: "B", name: "Good", desc: "良好品相", color: "bg-paper-cream" },
    { g: "C", name: "Fair", desc: "岁月痕迹", color: "bg-paper-warm" },
    { g: "J", name: "Junk", desc: "战损配件", color: "bg-ink text-paper-cream" },
  ];
  return (
    <Frame bg="cream" page={pageNumber} total={totalPages} chapter="05 · BOVAS">
      {/* 顶部 */}
      <div className="absolute top-12 left-12 right-12">
        <div className="flex items-start justify-between">
          <div>
            <div className="font-handwrite text-3xl text-boomer-red">BOVAS · Part 2</div>
            <h1 className="font-display text-6xl font-black mt-2 leading-[0.95]">
              AESTHETICA
            </h1>
            <div className="font-display text-4xl text-boomer-red mt-2 font-black">6 级品相评级</div>
          </div>
          <div className="stamp-red text-2xl">开发中</div>
        </div>
        <div className="font-body text-2xl text-ink/75 mt-3 font-medium">日本最严苛评级 · 明码标价</div>
      </div>

      {/* 6 级评级 — 满屏 2x3 */}
      <div className="absolute top-[480px] left-0 right-0 bottom-[180px] grid grid-cols-2 grid-rows-3 gap-0">
        {grades.map((g) => (
          <div key={g.g} className={`${g.color} flex items-center px-10 py-5 gap-6 border-r-2 border-b-2 border-ink/15`}>
            <div className="font-en text-[120px] leading-none">{g.g}</div>
            <div>
              <div className="font-condensed text-base tracking-[0.2em] opacity-75">{g.name}</div>
              <div className="font-display text-3xl font-black leading-tight mt-1">{g.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 底部红色总结 */}
      <div className="absolute bottom-14 left-0 right-0 h-[180px] bg-boomer-red text-paper-cream px-12 flex items-center">
        <div>
          <div className="font-handwrite text-3xl text-vintage-gold mb-1">— 全链路信任机制 —</div>
          <p className="font-display text-3xl font-black leading-tight">
            从源头到终端 · 每一件都有<span className="text-vintage-gold">身份证</span>
          </p>
        </div>
      </div>
    </Frame>
  );
}

/* ============ 22. 四大核心价值 ============ */
export function P_Value({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  const values = [
    { icon: Users, num: "01", title: "高粘性目的客流", desc: "孤品 + 寻宝 = 高复购", color: "bg-paper-cream" },
    { icon: Zap, num: "02", title: "延长停留 · 连带消费", desc: "10K+ SKU · 停留 45-90 分钟", color: "bg-vintage-gold" },
    { icon: TrendingUp, num: "03", title: "自发传播引擎", desc: "曝光 300 万+ · 零付费", color: "bg-boomer-red text-paper-cream" },
    { icon: Award, num: "04", title: "提升商圈调性", desc: "「招商终于有品位了」", color: "bg-vintage-coral text-paper-cream" },
  ];
  return (
    <Frame bg="paper" page={pageNumber} total={totalPages} chapter="06 · 核心价值">
      {/* 顶部 */}
      <div className="absolute top-12 left-12 right-12">
        <div className="font-handwrite text-3xl text-boomer-red">Why BOOMER OFF</div>
        <h1 className="font-display text-7xl font-black mt-2 leading-[0.95]">
          四 大 <span className="text-boomer-red">核 心 价 值</span>
        </h1>
      </div>

      {/* 满屏四块 */}
      <div className="absolute top-[400px] left-0 right-0 bottom-14 flex flex-col">
        {values.map((v) => (
          <div key={v.num} className={`flex-1 ${v.color} px-10 flex items-center gap-5 border-b-2 border-ink/15`}>
            <div className="font-en text-[120px] leading-none opacity-25">{v.num}</div>
            <v.icon className="w-20 h-20 flex-shrink-0" strokeWidth={2} />
            <div className="flex-1">
              <div className="font-display text-4xl font-black leading-tight">{v.title}</div>
              <div className="font-body text-2xl mt-2 opacity-85 font-medium">{v.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

/* ============ 23. 数据见真章 — 数据轰炸 ============ */
export function P_Wall({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  return (
    <Frame bg="warm" page={pageNumber} total={totalPages} chapter="06 · 核心价值">
      {/* 顶部 */}
      <div className="absolute top-12 left-12 right-12">
        <div className="font-handwrite text-3xl text-boomer-red">Numbers Speak</div>
        <h1 className="font-display text-8xl font-black mt-2 leading-[0.9]">
          数 据 见<br/>
          <span className="text-boomer-red">真 章</span>
        </h1>
      </div>

      {/* 主数据 */}
      <div className="absolute top-[500px] left-0 right-0 bg-boomer-red text-paper-cream px-12 py-9">
        <div className="font-handwrite text-3xl text-vintage-gold mb-2">— 全网曝光 —</div>
        <div className="mega-number text-[260px] leading-[0.78]">300<span className="text-6xl ml-3">万+</span></div>
        <div className="font-display text-3xl font-black mt-3">零付费 · 自然传播</div>
      </div>

      {/* 4 个副数据满屏 */}
      <div className="absolute top-[1180px] left-0 right-0 bottom-14 grid grid-cols-2 grid-rows-2 gap-0">
        <div className="bg-paper-cream p-6 flex flex-col justify-between border-r-2 border-b-2 border-ink/15">
          <div className="font-handwrite text-2xl text-boomer-red">累计客流</div>
          <div className="mega-number text-[120px] text-boomer-red leading-none">10<span className="text-3xl ml-1">万+</span></div>
        </div>
        <div className="bg-vintage-gold p-6 flex flex-col justify-between border-b-2 border-ink/15">
          <div className="font-handwrite text-2xl text-boomer-red">单店 SKU</div>
          <div className="mega-number text-[120px] leading-none">10K<span className="text-3xl">+</span></div>
        </div>
        <div className="bg-vintage-coral text-paper-cream p-6 flex flex-col justify-between border-r-2 border-ink/15">
          <div className="font-handwrite text-2xl text-vintage-gold">起售价</div>
          <div className="mega-number text-[120px] leading-none">¥6.9</div>
        </div>
        <div className="bg-ink text-paper-cream p-6 flex flex-col justify-between">
          <div className="font-handwrite text-2xl text-vintage-gold">月均打卡</div>
          <div className="mega-number text-[120px] text-vintage-gold leading-none">1K<span className="text-3xl text-paper-cream">+</span></div>
        </div>
      </div>
    </Frame>
  );
}

/* ============ 24. 合作条件 ============ */
export function P_Cooperation({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  const conds = [
    { label: "目标面积", value: "80-100 ㎡", icon: Store, color: "bg-paper-cream" },
    { label: "优选楼层", value: "B1 / 1F", icon: Building2, sub: "高人流", color: "bg-vintage-gold" },
    { label: "铺位条件", value: "需基础装修", icon: HomeIcon, sub: "暂不接受毛胚", color: "bg-paper-cream" },
    { label: "工程要求", value: "用电 + 网络", icon: Zap, sub: "无特殊上下水", color: "bg-vintage-coral text-paper-cream" },
    { label: "合作方式", value: "销售额扣点", icon: BadgeCheck, sub: "按月结算", color: "bg-boomer-red text-paper-cream" },
  ];
  return (
    <Frame bg="cream" page={pageNumber} total={totalPages} chapter="07 · 合作">
      {/* 顶部 */}
      <div className="absolute top-12 left-12 right-12">
        <div className="font-handwrite text-3xl text-boomer-red">Partnership</div>
        <h1 className="font-display text-7xl font-black mt-2 leading-[0.95]">
          标准店<br/>
          <span className="text-boomer-red">合 作 条 件</span>
        </h1>
      </div>

      {/* 满屏 5 项 */}
      <div className="absolute top-[420px] left-0 right-0 bottom-[200px] flex flex-col">
        {conds.map((c) => (
          <div key={c.label} className={`flex-1 ${c.color} px-10 flex items-center gap-5 border-b-2 border-ink/15`}>
            <c.icon className="w-16 h-16 flex-shrink-0" strokeWidth={2.5} />
            <div className="flex-1">
              <div className="font-condensed text-base tracking-[0.2em] opacity-65">{c.label}</div>
              <div className="font-display text-3xl font-black leading-tight">{c.value}</div>
              {c.sub && <div className="font-body text-lg opacity-75 mt-1 font-medium">{c.sub}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* 底部红色总结 */}
      <div className="absolute bottom-14 left-0 right-0 h-[200px] bg-ink text-paper-cream px-12 py-7">
        <div className="font-handwrite text-3xl text-vintage-gold">— 双赢机制 —</div>
        <p className="font-display text-3xl font-black mt-2 leading-tight">
          <span className="bg-vintage-gold text-ink px-2">高频次 · 高粘性</span>流量业态<br/>
          <span className="font-handwrite text-4xl text-vintage-gold">销售越好 · 收益越高</span>
        </p>
      </div>
    </Frame>
  );
}

/* ============ 26. 七大店型上 ============ */
export function P_Matrix1({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  const stores = [
    { name: "Vintage", icon: Store, area: "80-100㎡", tag: "标准商场店", desc: "全品类中古杂货铺", color: "bg-boomer-red text-paper-cream", main: true },
    { name: "Home", icon: HomeIcon, area: "80-150㎡", tag: "家居垂直", desc: "瓷器、家具、线香", color: "bg-paper-cream" },
    { name: "Hobby", icon: Gamepad2, area: "80-150㎡", tag: "兴趣爱好", desc: "玩具、手办、二次元", color: "bg-vintage-gold" },
    { name: "Collection", icon: ShoppingBag, area: "80-200㎡", tag: "高端二奢", desc: "时尚收藏品", color: "bg-vintage-coral text-paper-cream" },
  ];
  return (
    <Frame bg="paper" page={pageNumber} total={totalPages} chapter="08 · 矩阵">
      <div className="absolute top-12 left-12 right-12">
        <div className="font-handwrite text-3xl text-boomer-red">Brand Matrix · 1/2</div>
        <h1 className="font-display text-7xl font-black mt-2 leading-[0.95]">
          七 大 店 型<br/>
          <span className="text-boomer-red">[ 上 ]</span>
        </h1>
      </div>

      {/* 满屏 2x2 */}
      <div className="absolute top-[440px] left-0 right-0 bottom-14 grid grid-cols-2 grid-rows-2 gap-0">
        {stores.map((s) => (
          <div key={s.name} className={`${s.color} p-6 flex flex-col justify-between border-r-2 border-b-2 border-ink/15 relative`}>
            {s.main && <div className="absolute top-3 right-3 bg-vintage-gold text-ink px-3 py-1 font-display text-base font-black rotate-6 vintage-border-soft">★ 核心</div>}
            <div>
              <s.icon className="w-12 h-12 mb-3" strokeWidth={2} />
              <div className="font-en text-5xl leading-none">{s.name}</div>
              <div className="font-display text-2xl font-black mt-3">{s.tag}</div>
            </div>
            <div>
              <div className="font-condensed text-base tracking-widest opacity-70">{s.area}</div>
              <div className="font-body text-xl mt-1 font-medium opacity-85">{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

/* ============ 27. 七大店型下 ============ */
export function P_Matrix2({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  const stores = [
    { name: "Digital", icon: Smartphone, area: "80-150㎡", tag: "数码家电", desc: "中古数码、二手家电、3C 配件", color: "bg-vintage-gold" },
    { name: "NB", icon: Coffee, area: "30-60㎡", tag: "Neighborhood 社区店", desc: "标准化二手交换/寄售，社区循环站", color: "bg-paper-cream" },
    { name: "Plus", icon: Warehouse, area: "1,000㎡+", tag: "大型特卖", desc: "郊区清仓出口，淘宝薅羊毛好去处", color: "bg-vintage-coral text-paper-cream" },
  ];
  return (
    <Frame bg="paper" page={pageNumber} total={totalPages} chapter="08 · 矩阵">
      <div className="absolute top-12 left-12 right-12">
        <div className="font-handwrite text-3xl text-boomer-red">Brand Matrix · 2/2</div>
        <h1 className="font-display text-7xl font-black mt-2 leading-[0.95]">
          七 大 店 型<br/>
          <span className="text-boomer-red">[ 下 ]</span>
        </h1>
      </div>

      {/* 三块满宽 */}
      <div className="absolute top-[440px] left-0 right-0 bottom-[200px] flex flex-col">
        {stores.map((s) => (
          <div key={s.name} className={`flex-1 ${s.color} px-10 flex items-center gap-6 border-b-2 border-ink/15`}>
            <s.icon className="w-20 h-20 flex-shrink-0" strokeWidth={2} />
            <div className="flex-1">
              <div className="font-en text-5xl leading-none">{s.name}</div>
              <div className="font-display text-2xl font-black mt-1">{s.tag} · {s.area}</div>
              <div className="font-body text-xl mt-2 font-medium opacity-85">{s.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 底部红色总结 */}
      <div className="absolute bottom-14 left-0 right-0 h-[200px] bg-boomer-red text-paper-cream px-12 py-6 flex flex-col justify-center">
        <div className="font-handwrite text-2xl text-vintage-gold">— 渐进扩张路径 —</div>
        <p className="font-display text-2xl font-black mt-2 leading-tight">
          核心商场 → 高端 → 垂直 → 数码 → 社区 → 郊区
        </p>
      </div>
    </Frame>
  );
}

/* ============ 28. 增长飞轮 ============ */
export function P_Flywheel({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  const stages = [
    { stage: "核心商场", store: "Vintage", color: "bg-boomer-red text-paper-cream" },
    { stage: "高端精品", store: "Collection", color: "bg-vintage-gold" },
    { stage: "垂直品类", store: "Home/Hobby", color: "bg-vintage-coral text-paper-cream" },
    { stage: "数码专营", store: "Digital", color: "bg-paper-cream" },
    { stage: "社区渗透", store: "NB", color: "bg-vintage-gold" },
    { stage: "郊区特卖", store: "Plus", color: "bg-ink text-paper-cream" },
  ];
  return (
    <Frame bg="cream" page={pageNumber} total={totalPages} chapter="08 · 矩阵">
      <div className="absolute top-12 left-12 right-12">
        <div className="font-handwrite text-3xl text-boomer-red">Growth Flywheel</div>
        <h1 className="font-display text-7xl font-black mt-2 leading-[0.95]">
          长 期<br/>
          <span className="text-boomer-red">增 长 飞 轮</span>
        </h1>
      </div>

      {/* 满屏 2x3 */}
      <div className="absolute top-[440px] left-0 right-0 bottom-[280px] grid grid-cols-2 grid-rows-3 gap-0">
        {stages.map((s, i) => (
          <div key={s.stage} className={`${s.color} px-8 flex items-center justify-between border-r-2 border-b-2 border-ink/15`}>
            <div className="font-en text-7xl leading-none opacity-30">{String(i+1).padStart(2,"0")}</div>
            <div className="text-right">
              <div className="font-display text-3xl font-black leading-tight">{s.stage}</div>
              <div className="font-body text-xl mt-1 font-bold opacity-85">{s.store}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 底部三大数据 */}
      <div className="absolute bottom-14 left-0 right-0 h-[280px] bg-boomer-red text-paper-cream px-12 py-7">
        <div className="font-handwrite text-2xl text-vintage-gold mb-3">— 终局规划 —</div>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <div className="mega-number text-8xl text-vintage-gold leading-none">7</div>
            <div className="font-display text-2xl font-black mt-2">店 型</div>
          </div>
          <div>
            <div className="mega-number text-8xl text-vintage-gold leading-none">∞</div>
            <div className="font-display text-2xl font-black mt-2">城 市</div>
          </div>
          <div>
            <div className="mega-number text-8xl text-vintage-gold leading-none">100%</div>
            <div className="font-display text-2xl font-black mt-2">人 群</div>
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* ============ 29. 联系我们 ============ */
export function P_Contact({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  return (
    <Frame bg="paper" page={pageNumber} total={totalPages} chapter="09 · 联系">
      {/* 顶部 */}
      <div className="absolute top-12 left-12 right-12">
        <div className="font-handwrite text-3xl text-boomer-red">Get in Touch</div>
        <h1 className="font-display text-7xl font-black mt-2 leading-[0.95]">
          期 待 与 您<br/>
          <span className="text-boomer-red">携 手 同 行</span>
        </h1>
      </div>

      {/* 公司信息 — 金色块 */}
      <div className="absolute top-[440px] left-0 right-0 bg-vintage-gold text-ink px-12 py-7">
        <div className="font-handwrite text-2xl text-boomer-red mb-2">— Company —</div>
        <div className="font-condensed text-base tracking-[0.2em] text-ink/65">公 司 名 称</div>
        <div className="font-display text-3xl font-black leading-tight mt-1">宝暮（上海）品牌管理有限公司</div>

        <div className="mt-4 font-condensed text-base tracking-[0.2em] text-ink/65">加 盟 体 验 中 心</div>
        <div className="font-display text-2xl font-black leading-tight mt-1">
          上海市闵行区光华路 728 号<br/>
          728Space C5 栋 3 楼
        </div>
      </div>

      {/* 联系人 — 红色巨型块 + 二维码 */}
      <div className="absolute top-[860px] left-0 right-0 bottom-14 bg-boomer-red text-paper-cream px-10 py-7 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 dots-pattern-cream opacity-25" />

        <div className="font-handwrite text-2xl text-vintage-gold mb-3">— Contact —</div>

        <div className="grid grid-cols-[1fr_auto] gap-6">
          <div>
            <div className="font-condensed text-base tracking-[0.2em] text-paper-cream/85">联 系 人</div>
            <div className="font-display text-6xl font-black leading-none mt-1">潘 瞻 远</div>

            <div className="mt-6 font-condensed text-base tracking-[0.2em] text-paper-cream/85">联 系 电 话</div>
            <div className="font-en text-4xl flex items-center gap-2 mt-1">
              <Phone className="w-8 h-8" strokeWidth={2.5} />
              186 5743 3310
            </div>

            <div className="mt-6 pt-4 border-t-2 border-paper-cream/40">
              <div className="font-handwrite text-3xl text-vintage-gold">欢迎招商 · 加盟</div>
              <div className="font-display text-xl mt-1 font-bold">品牌合作洽谈</div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 pt-4">
            <div className="bg-paper-cream/10 vintage-border-soft p-3">
              <img src={wechatQR} alt="WeChat" className="w-44 h-44 object-contain" style={{ filter: "brightness(0) invert(1)" }} />
            </div>
            <div className="font-handwrite text-xl text-vintage-gold">扫码加微信</div>
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* ============ 30. 门店地址 ============ */
export function P_Stores({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  return (
    <Frame bg="cream" page={pageNumber} total={totalPages} chapter="09 · 联系">
      {/* 顶部 */}
      <div className="absolute top-12 left-12 right-12">
        <div className="font-handwrite text-3xl text-boomer-red">Our Stores</div>
        <h1 className="font-display text-7xl font-black mt-2 leading-[0.95]">
          门 店 <span className="text-boomer-red">地 址</span>
        </h1>
      </div>

      {/* 营业中 — 大色块 */}
      <div className="absolute top-[420px] left-0 right-0 bg-boomer-red text-paper-cream px-12 py-9 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 dots-pattern-cream opacity-25" />

        <div className="flex items-center gap-3 mb-3">
          <div className="bg-vintage-gold text-ink px-3 py-1.5 font-display text-xl font-black vintage-border-soft">营业中</div>
          <div className="font-handwrite text-2xl text-vintage-gold">First Store</div>
        </div>

        <div className="flex items-start gap-4">
          <MapPin className="w-16 h-16 flex-shrink-0 text-vintage-gold" strokeWidth={2} />
          <div>
            <div className="font-display text-5xl font-black leading-tight">中信泰富店</div>
            <div className="font-display text-2xl font-bold mt-3 leading-snug">
              上海市静安区南京西路 1168 号<br/>
              中信泰富广场 B1 层
            </div>
          </div>
        </div>

        <div className="mt-5 pt-5 border-t-2 border-paper-cream/40 grid grid-cols-3 gap-3">
          <div>
            <div className="font-en text-4xl text-vintage-gold leading-none">No.1</div>
            <div className="font-body text-sm mt-1">南京西路</div>
          </div>
          <div>
            <div className="font-en text-4xl text-vintage-gold leading-none">No.1</div>
            <div className="font-body text-sm mt-1">静安区</div>
          </div>
          <div>
            <div className="font-en text-4xl text-vintage-gold leading-none">No.5</div>
            <div className="font-body text-sm mt-1">全上海</div>
          </div>
        </div>
      </div>

      {/* 筹备中 */}
      <div className="absolute top-[1180px] left-0 right-0 bg-vintage-gold text-ink px-12 py-7">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-boomer-red text-paper-cream px-3 py-1 font-display text-lg font-black">筹备中</div>
          <div className="font-handwrite text-2xl text-boomer-red">Coming Soon</div>
        </div>
        <div className="flex items-start gap-4">
          <MapPin className="w-12 h-12 flex-shrink-0 text-boomer-red" strokeWidth={2} />
          <div>
            <div className="font-display text-3xl font-black">更 多 门 店</div>
            <div className="font-body text-xl mt-1 font-medium">敬请期待 · 与您共同复制成功</div>
          </div>
        </div>
      </div>

      {/* 底部 CTA */}
      <div className="absolute bottom-14 left-0 right-0 bg-ink text-paper-cream px-12 py-6 text-center">
        <p className="font-display text-3xl font-black leading-tight">
          正 在 寻 找<br/>
          <span className="font-handwrite text-4xl text-vintage-gold">志 同 道 合</span>
          的合作伙伴
        </p>
      </div>
    </Frame>
  );
}
