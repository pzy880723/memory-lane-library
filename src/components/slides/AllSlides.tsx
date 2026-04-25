import { SlideShell } from "./SlideShell";
import logo from "@/assets/boomer-off-logo.png";
import {
  TrendingUp, MapPin, Users, Sparkles, Gamepad2, Heart, Zap,
  Shield, Award, Recycle, Building2, Phone, Star, Quote, ChevronRight,
  Package, Coffee, Headphones, Gift, Store, Home as HomeIcon,
  ShoppingBag, Smartphone, Warehouse, MessageCircle, BadgeCheck, Disc3,
  Check, X,
} from "lucide-react";

// 店铺实拍图
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
 * 第 1 页 — 封面（拼贴风 + 真实照片）
 * ============================================================ */
export function Slide01Cover() {
  return (
    <SlideShell variant="paper" showHeader={false} noFooter>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[1100px] h-[1100px] rounded-full bg-boomer-red/15" />
        <div className="absolute -bottom-60 -left-40 w-[800px] h-[800px] dots-pattern-red opacity-60" />
        <div className="absolute top-1/3 right-0 w-1/2 h-1/3 lines-red opacity-40" />
      </div>

      {/* 顶部小标 */}
      <div className="absolute top-16 left-16 right-16 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <div className="w-4 h-4 rounded-full bg-boomer-red" />
          <span className="font-condensed text-3xl tracking-[0.4em] text-ink/70">
            BRAND BOOK · 2026
          </span>
        </div>
        <span className="font-handwrite text-4xl text-boomer-red rotate-[-2deg]">
          since 2026 · Shanghai
        </span>
      </div>

      {/* 实拍照片拼贴 */}
      <img
        src={photoSatoDetail}
        alt="Sato"
        className="absolute top-32 right-20 w-[340px] h-[460px] object-cover photo-vintage rotate-[6deg] z-[3]"
      />
      <img
        src={photoVinyl}
        alt="Vinyl"
        className="absolute bottom-24 left-16 w-[320px] h-[420px] object-cover photo-vintage rotate-[-5deg] z-[3]"
      />
      <div className="tape-gold top-28 right-44 z-[4] rotate-[-8deg]" />
      <div className="tape-red bottom-20 left-44 z-[4] rotate-[12deg]" />

      {/* 中央 Logo 与文案 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-32 z-[6]">
        <img src={logo} alt="BOOMER OFF Vintage" className="w-[1000px] mb-12 drop-shadow-2xl" />

        <div className="vintage-border bg-paper-cream px-20 py-8 mb-10 rotate-[-1.5deg]">
          <p className="font-display text-6xl font-black tracking-wider">
            虽古但新 · <span className="text-boomer-red">信任可见</span>
          </p>
        </div>

        <p className="font-display text-4xl text-ink/85 tracking-wider text-center">
          国 内 首 家 标 准 化 中 古 连 锁 品 牌
        </p>
      </div>

      {/* 底部装饰 */}
      <div className="absolute bottom-16 left-16 right-16 flex items-end justify-between z-10">
        <div>
          <p className="font-condensed text-2xl tracking-[0.3em] text-ink/55">A TINY BASEMENT SHOP</p>
          <p className="font-condensed text-2xl tracking-[0.3em] text-ink/55">FULL OF VINTAGE TREASURES</p>
        </div>
        <div className="text-right">
          <p className="font-handwrite text-3xl text-ink/75">— SmartShanghai · 2026.03</p>
        </div>
      </div>
    </SlideShell>
  );
}

/* ============================================================
 * 第 2 页 — 目录
 * ============================================================ */
export function Slide02TOC({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  const items = [
    { num: "01", title: "已验证的市场表现", desc: "中信泰富首店实绩" },
    { num: "02", title: "品牌定位与愿景", desc: "我们是谁 · 解决什么" },
    { num: "03", title: "市场机遇与赛道", desc: "万亿蓝海 · 对标日本" },
    { num: "04", title: "核心商业模式", desc: "空间 · 品类 · 翻筐乐" },
    { num: "05", title: "BOVAS 信任体系", desc: "区块链溯源 · 6 级评级" },
    { num: "06", title: "BOOMER OFF 的核心价值", desc: "客流 · 停留 · 传播 · 调性" },
    { num: "07", title: "门店模型与合作", desc: "标准店合作条件" },
    { num: "08", title: "品牌矩阵与未来", desc: "七大店型布局" },
    { num: "09", title: "联系我们", desc: "招商 · 加盟 · 合作" },
  ];
  return (
    <SlideShell pageNumber={pageNumber} totalPages={totalPages} variant="cream">
      <div className="absolute inset-0 px-32 pt-40 pb-32">
        <div className="flex items-baseline gap-8 mb-14">
          <span className="font-en text-[10rem] leading-none text-boomer-red">CONTENTS</span>
          <span className="font-display text-5xl">目 录</span>
          <div className="ml-auto stamp-red text-3xl">2026</div>
        </div>
        <div className="grid grid-cols-3 gap-x-14 gap-y-10">
          {items.map((it, i) => (
            <div
              key={it.num}
              className={`border-l-[6px] border-boomer-red pl-7 py-3 ${i % 2 === 0 ? "" : "rotate-[0.5deg]"}`}
            >
              <div className="font-en text-6xl text-ink/30 mb-2">{it.num}</div>
              <div className="font-display text-4xl font-bold mb-2">{it.title}</div>
              <div className="font-body text-2xl text-ink/65">{it.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}

/* ============================================================
 * 第 3 页 — 核心摘要（左文字右大图）
 * ============================================================ */
export function Slide03Executive({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  return (
    <SlideShell pageNumber={pageNumber} totalPages={totalPages} variant="paper" chapter="EXECUTIVE SUMMARY">
      <div className="absolute inset-0 px-28 pt-36 pb-28 grid grid-cols-12 gap-10">
        <div className="col-span-7 flex flex-col">
          <div className="mb-6">
            <span className="font-handwrite text-4xl text-boomer-red">Executive Summary</span>
            <h1 className="font-display text-8xl font-black mt-3 leading-tight">
              一个<span className="text-boomer-red">现象级</span><br />线下零售新物种
            </h1>
          </div>

          <p className="font-body text-3xl leading-relaxed text-ink/85 mb-10">
            BOOMER OFF Vintage 首创<span className="highlight-red font-bold">「标准化 × 氛围感」双基因融合模式</span>，
            将日本 Book Off 式标准化体系与街边设计师店审美氛围结合，开业即成为现象级网红业态。
          </p>

          <div className="grid grid-cols-3 gap-5 mt-auto">
            <div className="bg-paper-cream vintage-border p-7">
              <div className="mega-number text-7xl text-boomer-red mb-2">300<span className="text-4xl">万+</span></div>
              <div className="font-display text-2xl font-bold mb-1">全网曝光</div>
              <div className="font-body text-base text-ink/60">零付费推广</div>
            </div>
            <div className="bg-vintage-gold vintage-border p-7">
              <div className="mega-number text-7xl text-ink mb-2">10<span className="text-4xl">万+</span></div>
              <div className="font-display text-2xl font-bold mb-1">定向客流</div>
              <div className="font-body text-base text-ink/70">高粘性</div>
            </div>
            <div className="bg-boomer-red vintage-border p-7 text-paper-cream">
              <div className="mega-number text-7xl mb-2">No.1</div>
              <div className="font-display text-2xl font-bold mb-1">大众点评</div>
              <div className="font-body text-base text-paper-cream/85">南京西路</div>
            </div>
          </div>
        </div>

        <div className="col-span-5 relative">
          <img
            src={photoCeramics}
            alt="店铺陈列"
            className="absolute inset-0 w-full h-full object-cover photo-vintage rotate-[2deg]"
          />
          <div className="absolute -top-4 -right-4 stamp-red text-2xl z-10">现 象 级</div>
          <div className="absolute bottom-6 left-6 right-6 bg-paper-cream/95 backdrop-blur p-5 vintage-border-soft rotate-[-1deg]">
            <p className="font-handwrite text-3xl text-boomer-red leading-tight">
              "中信泰富首店<br/>开业即爆"
            </p>
          </div>
        </div>
      </div>
    </SlideShell>
  );
}

/* ============================================================
 * 章节扉页 — 红底镂空大字
 * ============================================================ */
export function SlideChapter({
  num, title, en, desc, pageNumber, totalPages,
}: { num: string; title: string; en: string; desc: string; pageNumber: number; totalPages: number }) {
  return (
    <SlideShell pageNumber={pageNumber} totalPages={totalPages} variant="red" chapter={`CHAPTER ${num}`}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-20 chapter-num">{num}</div>
        <div className="absolute bottom-32 right-40 w-[420px] h-[420px] dots-pattern-cream opacity-30" />
        <div className="absolute top-1/3 left-0 w-1/3 h-2/3 lines-pattern opacity-20" />
      </div>
      <div className="absolute inset-0 flex flex-col justify-center px-32">
        <div className="font-handwrite text-6xl text-paper-cream/90 mb-6">— Chapter {num} —</div>
        <div className="font-en text-[11rem] leading-none text-paper-cream mb-8 drop-shadow-lg">{en}</div>
        <h1 className="font-display text-9xl font-black text-paper-cream mb-10">{title}</h1>
        <div className="w-40 h-2 bg-paper-cream mb-10" />
        <p className="font-body text-5xl text-paper-cream max-w-[1500px] leading-relaxed font-medium">{desc}</p>
      </div>
    </SlideShell>
  );
}

/* ============================================================
 * 第 5 页 — 零投放的自然流量奇迹（数字冲击力升级）
 * ============================================================ */
export function Slide05Traffic({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  const subData = [
    { label: "南京西路商圈", value: "No.1", sub: "大众点评", icon: Star, color: "bg-paper-cream" },
    { label: "静安区", value: "No.1", sub: "大众点评", icon: Star, color: "bg-vintage-gold" },
    { label: "全上海", value: "No.5", sub: "大众点评", icon: Award, color: "bg-paper-cream" },
    { label: "小红书", value: "官方 AI 推荐", sub: "中古杂货铺", icon: Sparkles, color: "bg-paper-cream" },
    { label: "明星 / KOL", value: "自发打卡", sub: "多位头部网红", icon: Heart, color: "bg-paper-cream" },
    { label: "大众点评月均", value: "1,000+", sub: "收藏打卡", icon: BadgeCheck, color: "bg-vintage-gold" },
  ];
  return (
    <SlideShell pageNumber={pageNumber} totalPages={totalPages} variant="paper" chapter="01 · 中信泰富首店实绩">
      <div className="absolute inset-0 px-24 pt-36 pb-24">
        <div className="flex items-end justify-between mb-6">
          <h1 className="font-display text-7xl font-black leading-tight">
            零投放的<span className="text-boomer-red highlight-yellow">自然流量奇迹</span>
          </h1>
          <div className="stamp-red text-3xl">0 ¥ 推广费</div>
        </div>

        {/* 顶部两个超大数据 hero 卡 */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="vintage-border bg-boomer-red text-paper-cream p-8 relative overflow-hidden rotate-[-0.5deg]">
            <div className="absolute -top-10 -right-10 w-72 h-72 dots-pattern-cream opacity-30" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-12 h-12" strokeWidth={2.5} />
                <div className="font-display text-3xl font-bold">全网曝光量</div>
              </div>
              <div className="mega-number text-[12rem] leading-none">300<span className="text-6xl ml-2">万+</span></div>
              <div className="font-display text-2xl mt-2 text-paper-cream/90">零付费推广 · 自然爆发</div>
            </div>
          </div>
          <div className="vintage-border bg-vintage-gold text-ink p-8 relative overflow-hidden rotate-[0.5deg]">
            <div className="absolute -bottom-10 -right-10 w-72 h-72 dots-pattern opacity-30" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-12 h-12" strokeWidth={2.5} />
                <div className="font-display text-3xl font-bold">门店定向客流</div>
              </div>
              <div className="mega-number text-[12rem] leading-none text-boomer-red">10<span className="text-6xl ml-2">万+</span></div>
              <div className="font-display text-2xl mt-2 text-ink/80">高粘性 · 累计人次</div>
            </div>
          </div>
        </div>

        {/* 下方 6 个次级卡片 */}
        <div className="grid grid-cols-6 gap-4">
          {subData.map((d, i) => (
            <div
              key={d.label}
              className={`vintage-border p-5 ${d.color} ${i % 2 === 0 ? "rotate-[-0.5deg]" : "rotate-[0.5deg]"}`}
            >
              <d.icon className="w-10 h-10 mb-3 text-boomer-red" strokeWidth={2.5} />
              <div className="font-body text-lg mb-1 opacity-65">{d.label}</div>
              <div className="font-display text-3xl font-black leading-tight">{d.value}</div>
              <div className="font-body text-base mt-1 opacity-65">{d.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}

/* ============================================================
 * 第 6 页 — 媒体背书 SmartShanghai
 * ============================================================ */
export function Slide06Media({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  return (
    <SlideShell pageNumber={pageNumber} totalPages={totalPages} variant="cream" chapter="01 · 中信泰富首店实绩">
      <div className="absolute inset-0 px-28 pt-36 pb-28 grid grid-cols-12 gap-10">
        <div className="col-span-5 flex flex-col justify-center">
          <div className="font-handwrite text-4xl text-boomer-red mb-3">— Featured by —</div>
          <h1 className="font-display text-7xl font-black mb-8 leading-tight">
            SmartShanghai<br/>
            <span className="text-boomer-red">专题报道</span>
          </h1>
          <p className="font-body text-3xl text-ink/75 mb-8 leading-relaxed">
            上海最具影响力的英文生活方式媒体，于 <span className="font-bold text-boomer-red">2026 年 3 月</span>对 BOOMER OFF 进行专题报道
          </p>
          <div className="bg-boomer-red text-paper-cream px-10 py-6 inline-block w-fit vintage-border rotate-[-2deg]">
            <p className="font-en text-4xl tracking-wide">A Tiny Basement Shop</p>
            <p className="font-en text-4xl tracking-wide">Full of Old Japanese Toys</p>
          </div>
          <p className="font-handwrite text-3xl text-ink/65 mt-6">— 2026.03 · SmartShanghai</p>
        </div>

        <div className="col-span-7 flex flex-col justify-center gap-8">
          {/* 实拍图 */}
          <div className="relative">
            <img
              src={photoDiatone}
              alt="Diatone 唱片机"
              className="w-full h-[280px] object-cover photo-vintage"
            />
            <div className="tape-gold -top-4 left-12 z-10 rotate-[-3deg]" />
          </div>

          <div className="bg-paper-cream vintage-border p-8 relative rotate-[1deg]">
            <Quote className="absolute -top-7 -left-7 w-16 h-16 text-boomer-red bg-paper-cream rounded-full p-3" />
            <p className="font-display text-3xl leading-relaxed mb-3">
              "It's not the kind of place you walk through in five minutes.
              You have to take your time and dig a little."
            </p>
            <p className="font-body text-2xl text-ink/65">这不是那种五分钟就能逛完的店。你需要慢下来，仔细翻找。</p>
          </div>

          <div className="bg-vintage-gold vintage-border-red p-8 relative rotate-[-1deg]">
            <Quote className="absolute -top-7 -left-7 w-16 h-16 text-boomer-red bg-vintage-gold rounded-full p-3" />
            <p className="font-display text-3xl leading-relaxed mb-3">
              "Easy to stop by, and easy to end up staying longer than planned."
            </p>
            <p className="font-body text-2xl text-ink/75">很容易路过就走进去，也很容易待得比计划中久得多。</p>
          </div>
        </div>
      </div>
    </SlideShell>
  );
}

/* ============================================================
 * 第 7 页 — 用户评价高频关键词
 * ============================================================ */
export function Slide07Keywords({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  const groups = [
    { cat: "稀缺性认知", quotes: ["上海少见的日本中古杂货铺", "国内第一家这种店"], color: "bg-boomer-red text-paper-cream", rotate: "rotate-[-1deg]" },
    { cat: "沉浸式体验", quotes: ["可以逛一下午", "每次去都有新东西", "翻筐停不下来"], color: "bg-paper-cream", rotate: "rotate-[1deg]" },
    { cat: "情绪价值", quotes: ["治愈", "有温度", "回忆杀", "像走进了日本中古店"], color: "bg-vintage-gold", rotate: "rotate-[-0.5deg]" },
    { cat: "性价比", quotes: ["几块钱就能淘到好东西", "比日本代购便宜"], color: "bg-paper-warm", rotate: "rotate-[0.5deg]" },
    { cat: "社交传播", quotes: ["拍照超好看", "朋友圈素材库", "必须带闺蜜来"], color: "bg-vintage-coral text-paper-cream", rotate: "rotate-[1deg]" },
    { cat: "商业口碑", quotes: ["招商终于有品位了", "商场终于有了有趣的店"], color: "bg-boomer-red text-paper-cream", rotate: "rotate-[-1deg]" },
  ];
  return (
    <SlideShell pageNumber={pageNumber} totalPages={totalPages} variant="paper" chapter="01 · 中信泰富首店实绩">
      <div className="absolute inset-0 px-28 pt-36 pb-24">
        <div className="mb-8">
          <span className="font-handwrite text-4xl text-boomer-red">Voice of Customers</span>
          <h1 className="font-display text-7xl font-black mt-2">
            用户评价<span className="text-boomer-red">高频关键词</span>
          </h1>
          <p className="font-body text-2xl text-ink/65 mt-3">小红书 · 大众点评 · 抖音 真实用户评价整理</p>
        </div>

        <div className="grid grid-cols-3 gap-7">
          {groups.map((g) => (
            <div key={g.cat} className={`vintage-border p-8 ${g.color} ${g.rotate}`}>
              <div className="font-display text-3xl font-black mb-5 flex items-center gap-3">
                <MessageCircle className="w-9 h-9" strokeWidth={2.5} />
                {g.cat}
              </div>
              <div className="space-y-3">
                {g.quotes.map((q) => (
                  <div key={q} className="font-body text-2xl leading-snug">"{q}"</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}

/* ============================================================
 * 第 8 页 — 内容生产机器（数字戏剧化）
 * ============================================================ */
export function Slide08Engine({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  return (
    <SlideShell pageNumber={pageNumber} totalPages={totalPages} variant="warm" chapter="01 · 中信泰富首店实绩">
      <div className="absolute inset-0 px-24 pt-36 pb-24 flex flex-col">
        <span className="font-handwrite text-4xl text-boomer-red mb-3">A Free Marketing Engine</span>
        <h1 className="font-display text-7xl font-black mb-8 leading-tight">
          一台永不停歇的<span className="text-boomer-red highlight-yellow">免费曝光引擎</span>
        </h1>

        <div className="grid grid-cols-12 gap-6 flex-1">
          {/* 左侧主数字 — 撑满 */}
          <div className="col-span-7 vintage-border bg-boomer-red text-paper-cream p-10 flex flex-col justify-between relative overflow-hidden rotate-[-0.5deg]">
            <div className="absolute -top-20 -right-20 w-[500px] h-[500px] dots-pattern-cream opacity-25" />
            <div className="relative">
              <TrendingUp className="w-20 h-20 mb-4" strokeWidth={2.5} />
              <div className="font-display text-3xl font-bold mb-3">全网曝光量</div>
            </div>
            <div className="relative">
              <div className="mega-number text-[16rem] leading-none">300<span className="text-7xl ml-3">万+</span></div>
              <div className="font-display text-3xl mt-4 text-paper-cream/90">零付费 · 自然爆发</div>
            </div>
          </div>

          {/* 右侧 3 个副数字 */}
          <div className="col-span-5 grid grid-rows-3 gap-5">
            <div className="vintage-border bg-paper-cream p-7 flex items-center justify-between rotate-[1deg]">
              <div>
                <Users className="w-12 h-12 text-boomer-red mb-1" strokeWidth={2.5} />
                <div className="font-body text-2xl font-bold">定向客流</div>
              </div>
              <div className="mega-number text-[7rem] leading-none text-boomer-red">10<span className="text-3xl">万+</span></div>
            </div>
            <div className="vintage-border bg-vintage-gold p-7 flex items-center justify-between rotate-[-1deg]">
              <div>
                <Star className="w-12 h-12 text-boomer-red mb-1" strokeWidth={2.5} />
                <div className="font-body text-2xl font-bold">商圈排名</div>
              </div>
              <div className="mega-number text-[7rem] leading-none text-boomer-red">No.1</div>
            </div>
            <div className="vintage-border bg-paper-cream p-7 flex items-center justify-between rotate-[1deg]">
              <div>
                <Heart className="w-12 h-12 text-boomer-red mb-1" strokeWidth={2.5} />
                <div className="font-body text-2xl font-bold">月均打卡</div>
              </div>
              <div className="mega-number text-[7rem] leading-none text-boomer-red">1K<span className="text-3xl">+</span></div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-paper-cream vintage-border-red px-10 py-5">
          <p className="font-display text-3xl">
            <Quote className="inline w-9 h-9 text-boomer-red mr-3" />
            "100+ 平价筐"、"巨型 Gameboy"、"佐藤象打卡" — 标签<span className="font-black highlight-red">自带话题性</span>，
            <span className="text-boomer-red font-black">零付费推广</span>持续传播
          </p>
        </div>
      </div>
    </SlideShell>
  );
}

/* ============================================================
 * 第 10 页 — 解决的问题（图二式三栏卡片）
 * ============================================================ */
export function Slide10Problem({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  const left = {
    sub: "如 Book Off",
    title: "日本标准化中古店",
    pros: ["明码标价", "标准化陈列", "可复制性强"],
    cons: ["缺乏氛围感", "情绪价值低"],
  };
  const right = {
    sub: "主理人个人审美",
    title: "街边设计师中古店",
    pros: ["设计感强", "氛围出片"],
    cons: ["定价不透明", "依赖主理人"],
  };
  const center = {
    sub: "BOOMER OFF",
    title: "融合模式",
    pros: [
      "标准化 + 层次感陈列",
      "透明定价 + 6 级评级",
      "沉浸声光 + IP 元素",
      "6.9 元起 极低门槛",
      "可复制可加盟",
    ],
  };
  return (
    <SlideShell pageNumber={pageNumber} totalPages={totalPages} variant="paper" chapter="02 · 品牌定位与愿景">
      <div className="absolute inset-0 px-24 pt-32 pb-24 flex flex-col">
        {/* 顶部居中标题 */}
        <div className="text-center mb-10">
          <span className="font-handwrite text-3xl text-boomer-red tracking-widest">ダブル DNA · Double Gene</span>
          <h1 className="font-display text-8xl font-black mt-2 leading-tight">
            标准化 <span className="text-boomer-red">×</span> 氛围感
          </h1>
          <p className="font-body text-2xl text-ink/70 mt-3">
            首创双基因融合模式 — 既有日式 Book Off 的信任感，又有街边设计师店的情绪价值
          </p>
        </div>

        {/* 三大卡片 */}
        <div className="grid grid-cols-3 gap-6 flex-1 items-stretch">
          {/* 左卡 */}
          <div className="vintage-border bg-paper-cream p-8 flex flex-col rotate-[-0.5deg]">
            <div className="font-condensed text-3xl tracking-widest text-ink/55 mb-2">{left.sub}</div>
            <div className="font-display text-5xl font-black mb-7">{left.title}</div>
            <ul className="space-y-5 flex-1">
              {left.pros.map(p => (
                <li key={p} className="flex items-start gap-3 font-body text-3xl text-ink/85">
                  <Check className="w-9 h-9 text-boomer-red flex-shrink-0 mt-1" strokeWidth={3} />
                  <span>{p}</span>
                </li>
              ))}
              {left.cons.map(c => (
                <li key={c} className="flex items-start gap-3 font-body text-3xl text-ink/45">
                  <X className="w-9 h-9 text-ink/40 flex-shrink-0 mt-1" strokeWidth={3} />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 中卡 - 高亮主推 */}
          <div className="vintage-border bg-boomer-red text-paper-cream p-8 flex flex-col -translate-y-3 shadow-2xl">
            <div className="font-condensed text-3xl tracking-widest text-paper-cream/80 mb-2 text-center">{center.sub}</div>
            <div className="font-display text-6xl font-black mb-7 text-center">{center.title}</div>
            <ul className="space-y-5 flex-1">
              {center.pros.map(p => (
                <li key={p} className="flex items-start gap-3 font-body text-3xl">
                  <Check className="w-9 h-9 text-paper-cream flex-shrink-0 mt-1" strokeWidth={3} />
                  <span className="font-bold">{p}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 text-center stamp-red text-3xl bg-paper-cream/95 inline-block self-center">★ 推 荐 ★</div>
          </div>

          {/* 右卡 */}
          <div className="vintage-border bg-paper-cream p-8 flex flex-col rotate-[0.5deg]">
            <div className="font-condensed text-3xl tracking-widest text-ink/55 mb-2">{right.sub}</div>
            <div className="font-display text-5xl font-black mb-7">{right.title}</div>
            <ul className="space-y-5 flex-1">
              {right.pros.map(p => (
                <li key={p} className="flex items-start gap-3 font-body text-3xl text-ink/85">
                  <Check className="w-9 h-9 text-boomer-red flex-shrink-0 mt-1" strokeWidth={3} />
                  <span>{p}</span>
                </li>
              ))}
              {right.cons.map(c => (
                <li key={c} className="flex items-start gap-3 font-body text-3xl text-ink/45">
                  <X className="w-9 h-9 text-ink/40 flex-shrink-0 mt-1" strokeWidth={3} />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SlideShell>
  );
}

/* ============================================================
 * 第 11 页 — 品牌故事（去黑色，红色文字版块）
 * ============================================================ */
export function Slide11Story({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  return (
    <SlideShell pageNumber={pageNumber} totalPages={totalPages} variant="cream" chapter="02 · 品牌定位与愿景">
      <div className="absolute inset-0 grid grid-cols-12">
        {/* 左侧大字 — 红底 */}
        <div className="col-span-5 bg-boomer-red text-paper-cream p-20 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] dots-pattern-cream opacity-25" />
          <div className="relative">
            <span className="font-handwrite text-4xl text-paper-cream/90">Brand Story</span>
            <h1 className="font-display text-8xl font-black mt-3 leading-tight">
              一个<br/>
              <span className="font-handwrite text-9xl">时间</span>
              <br/>
              收容所
            </h1>
          </div>
          <div className="relative">
            <p className="font-display text-3xl leading-relaxed">
              让都市白领在下班后<br/>
              可以「<span className="font-handwrite text-4xl text-vintage-gold">合法浪费时间</span>」<br/>
              的治愈系精神避风港
            </p>
          </div>
        </div>

        {/* 右侧故事 */}
        <div className="col-span-7 px-20 pt-36 pb-32 flex flex-col justify-center bg-paper-cream relative">
          <div className="absolute top-32 right-12 stamp-red text-2xl">VINTAGE</div>
          <p className="font-body text-3xl leading-relaxed text-ink/85 mb-7">
            在物质极度丰盛的今天，都市人似乎拥有一切，却又常常感到空虚。
          </p>
          <p className="font-body text-3xl leading-relaxed text-ink/85 mb-7">
            <span className="font-display font-black text-boomer-red">BOOMER OFF</span> 诞生于这样一个洞察 ——
            我们需要的不再是更多的新商品，而是那些<span className="highlight-yellow font-bold">带有时间温度、能引发情感共鸣的「旧物」</span>。
          </p>
          <p className="font-body text-3xl leading-relaxed text-ink/85">
            我们不仅是一家中古店，更是一个让灵魂得以慢下来的<span className="font-bold text-boomer-red">栖息地</span>。
          </p>

          <div className="mt-12 grid grid-cols-2 gap-6">
            <div className="border-l-[6px] border-boomer-red pl-7">
              <div className="font-handwrite text-3xl text-boomer-red mb-2">Slogan</div>
              <div className="font-display text-3xl font-black">虽古但新，信任可见</div>
            </div>
            <div className="border-l-[6px] border-vintage-gold pl-7">
              <div className="font-handwrite text-3xl text-vintage-gold mb-2">Core Model</div>
              <div className="font-display text-3xl font-black">标准化 × 氛围感</div>
            </div>
          </div>
        </div>
      </div>
    </SlideShell>
  );
}

/* ============================================================
 * 第 12 页 — 用户画像
 * ============================================================ */
export function Slide12Persona({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  const personas = [
    { age: "儿童", icon: "🧸", pref: "玩具 IP（哆啦A梦、面包超人、三丽鸥）", case: "在翻筐乐中淘到童年宝藏" },
    { age: "青少年", icon: "🎒", pref: "毛绒挂件、卡通瓷器、二次元周边", case: "初中生专程来淘黑胶唱片" },
    { age: "都市白领", icon: "📷", pref: "CCD 相机、随身听、复古配饰", case: "白领收藏日本瓷器，每周必到" },
    { age: "中年群体", icon: "🎵", pref: "黑胶唱片、数码设备、铁壶摆件", case: "父母带孩子一起来，各有所爱" },
    { age: "老年群体", icon: "🍵", pref: "瓷器、线香、丝巾手帕", case: "70 多岁老奶奶每周来买毛绒玩具" },
  ];
  return (
    <SlideShell pageNumber={pageNumber} totalPages={totalPages} variant="paper" chapter="02 · 品牌定位与愿景">
      <div className="absolute inset-0 px-28 pt-36 pb-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="font-handwrite text-4xl text-boomer-red">Target Audience</span>
            <h1 className="font-display text-7xl font-black mt-2">
              覆盖<span className="text-boomer-red">全年龄段</span>的中古杂货铺
            </h1>
          </div>
          <div className="font-handwrite text-4xl text-ink/65 rotate-[-2deg]">从 3 岁到 90 岁 →</div>
        </div>

        <div className="grid grid-cols-5 gap-5">
          {personas.map((p, i) => (
            <div key={p.age} className={`vintage-border p-7 flex flex-col bg-paper-cream ${i % 2 === 0 ? "rotate-[-0.5deg]" : "rotate-[0.5deg]"}`}>
              <div className="text-8xl mb-4 leading-none">{p.icon}</div>
              <div className="font-display text-4xl font-black text-boomer-red mb-4">{p.age}</div>
              <div className="font-body text-2xl leading-snug mb-5 flex-1 text-ink/85">{p.pref}</div>
              <div className="border-t-2 border-dashed border-ink/25 pt-4">
                <div className="font-handwrite text-2xl text-boomer-red mb-1">真实案例：</div>
                <div className="font-body text-xl leading-snug text-ink/75">{p.case}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-boomer-red text-paper-cream p-8 vintage-border rotate-[-0.5deg]">
          <p className="font-display text-3xl text-center leading-snug">
            <span className="font-black">每一件商品都有属于它的顾客</span> — 一家三口一起来 BOOMER OFF，
            <span className="font-handwrite text-4xl text-vintage-gold ml-2">每个人都能找到自己的回忆</span>
          </p>
        </div>
      </div>
    </SlideShell>
  );
}

/* ============================================================
 * 第 13 页 — 蓝海赛道
 * ============================================================ */
export function Slide13Market({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  return (
    <SlideShell pageNumber={pageNumber} totalPages={totalPages} variant="paper" chapter="03 · 市场机遇与赛道">
      <div className="absolute inset-0 px-28 pt-36 pb-24 grid grid-cols-12 gap-10">
        <div className="col-span-5 flex flex-col justify-center">
          <span className="font-handwrite text-4xl text-boomer-red">Blue Ocean</span>
          <h1 className="font-display text-7xl font-black mt-2 mb-8 leading-tight">
            万亿级市场的<br/><span className="text-boomer-red">线下空白</span>
          </h1>
          <p className="font-body text-3xl leading-relaxed text-ink/85">
            尽管线上二手电商发展迅速，中国线下市场仍以「非标」、「高冷」的奢侈品二手店或杂乱无章的旧货铺为主，
            <span className="highlight-red font-bold">缺乏真正的标准化平价中古连锁店。</span>
          </p>
        </div>

        <div className="col-span-7 flex flex-col justify-center gap-6">
          <div className="bg-boomer-red text-paper-cream vintage-border p-12 relative">
            <div className="font-handwrite text-3xl mb-3">2024 年中国二手商品交易额</div>
            <div className="mega-number text-[10rem]">1.69<span className="text-5xl ml-2">万亿元</span></div>
            <div className="font-display text-3xl mt-3">同比增长 +28%</div>
            <div className="absolute top-8 right-8 bg-vintage-gold text-ink px-5 py-3 font-display text-3xl font-black rotate-6 vintage-border-soft">
              ↑ 28%
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-vintage-gold vintage-border p-8 rotate-[-1deg]">
              <div className="font-handwrite text-2xl mb-1">主力人群</div>
              <div className="font-display text-4xl font-black">00 后 + 90 后</div>
              <div className="font-body text-xl text-ink/75 mt-2">已成为二手交易绝对主力</div>
            </div>
            <div className="bg-paper-cream vintage-border p-8 rotate-[1deg]">
              <div className="font-handwrite text-2xl text-boomer-red mb-1">线下空白</div>
              <div className="font-display text-4xl font-black">标准化平价店</div>
              <div className="font-body text-xl text-ink/75 mt-2">尚无对标 Book Off 的连锁</div>
            </div>
          </div>
        </div>
      </div>
    </SlideShell>
  );
}

/* ============================================================
 * 第 14 页 — 对标日本
 * ============================================================ */
export function Slide14Japan({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  return (
    <SlideShell pageNumber={pageNumber} totalPages={totalPages} variant="cream" chapter="03 · 市场机遇与赛道">
      <div className="absolute inset-0 px-24 pt-32 pb-24 flex flex-col">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="font-handwrite text-4xl text-boomer-red">Benchmark: Japan</span>
            <h1 className="font-display text-7xl font-black mt-2 leading-tight">
              对标<span className="text-boomer-red">日本 Reuse 市场</span>
            </h1>
          </div>
          <div className="font-handwrite text-3xl text-ink/65 rotate-[-2deg]">成熟模式 · 本土化升级</div>
        </div>

        {/* 焦点 + 双辅助 */}
        <div className="grid grid-cols-12 gap-6 flex-1">
          {/* 大焦点 — 3.5 万亿 */}
          <div className="col-span-7 vintage-border bg-paper-cream p-10 flex flex-col justify-between relative overflow-hidden rotate-[-0.5deg]">
            <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] dots-pattern-red opacity-25" />
            <div className="relative">
              <Recycle className="w-20 h-20 text-boomer-red mb-3" strokeWidth={2.5} />
              <div className="font-handwrite text-3xl text-ink/65">日本 Reuse 市场规模</div>
            </div>
            <div className="relative">
              <div className="mega-number text-[16rem] leading-none text-boomer-red">3.5<span className="text-7xl ml-3">万亿</span></div>
              <div className="font-display text-4xl font-black mt-3">日 元</div>
              <div className="font-body text-2xl text-ink/65 mt-2">≈ 1,700 亿人民币</div>
            </div>
          </div>

          {/* 右侧两个辅助 */}
          <div className="col-span-5 grid grid-rows-2 gap-5">
            <div className="vintage-border bg-vintage-gold p-8 flex items-center justify-between rotate-[1deg]">
              <div>
                <TrendingUp className="w-14 h-14 text-boomer-red mb-2" strokeWidth={2.5} />
                <div className="font-handwrite text-2xl text-ink/65">增长态势</div>
                <div className="font-display text-3xl font-black mt-1">持续增长</div>
              </div>
              <div className="text-right">
                <div className="mega-number text-[8rem] leading-none text-boomer-red">15</div>
                <div className="font-display text-3xl font-bold">年</div>
              </div>
            </div>

            <div className="vintage-border bg-boomer-red text-paper-cream p-8 flex items-center justify-between rotate-[-1deg]">
              <div>
                <Users className="w-14 h-14 mb-2" strokeWidth={2.5} />
                <div className="font-handwrite text-2xl text-paper-cream/85">国民渗透率</div>
                <div className="font-display text-3xl font-black mt-1">日本国民</div>
              </div>
              <div className="text-right">
                <div className="mega-number text-[8rem] leading-none">44.1<span className="text-4xl">%</span></div>
                <div className="font-display text-2xl">购买过二手</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-paper-cream vintage-border-red px-10 py-5">
          <p className="font-display text-3xl leading-relaxed">
            <BadgeCheck className="inline w-12 h-12 text-boomer-red mr-3" />
            BOOMER OFF 汲取日本核心优势 ——
            <span className="highlight-red font-bold">严苛评级体系</span> +
            <span className="highlight-yellow font-bold">极致陈列美学</span>，针对中国信任痛点数字化升级
          </p>
        </div>
      </div>
    </SlideShell>
  );
}

/* ============================================================
 * 第 16 页 — 空间概念（嵌入实拍图）
 * ============================================================ */
export function Slide16Space({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  return (
    <SlideShell pageNumber={pageNumber} totalPages={totalPages} variant="paper" chapter="04 · 核心商业模式">
      <div className="absolute inset-0 px-24 pt-32 pb-20">
        {/* 标题 + 总 SKU 数据 */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="font-handwrite text-4xl text-boomer-red">Space Concept</span>
            <h1 className="font-display text-7xl font-black mt-2 leading-none">
              超高密度 × <span className="text-boomer-red">寻宝体验</span>
            </h1>
          </div>
          <div className="text-right">
            <div className="mega-number text-8xl text-boomer-red leading-none">10,000<span className="text-4xl">+</span></div>
            <div className="font-body text-2xl text-ink/65 mt-1">SKU / 80-100㎡ 单店</div>
          </div>
        </div>

        {/* 楼层结构示意 — 上下分层呼应空间含义 */}
        <div className="relative">
          {/* 左侧楼层标尺 */}
          <div className="absolute -left-16 top-0 bottom-0 flex flex-col items-center justify-between py-4 z-10">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 bg-boomer-red rounded-full" />
              <div className="font-en text-3xl text-boomer-red mt-1">UP</div>
            </div>
            <div className="w-[2px] flex-1 bg-ink/30 my-2" />
            <div className="flex flex-col items-center">
              <div className="font-en text-3xl text-vintage-gold mb-1">DOWN</div>
              <div className="w-3 h-3 bg-vintage-gold rounded-full" />
            </div>
          </div>

          {/* 上层 — 精品区（红色调，置于上方） */}
          <div className="vintage-border bg-paper-cream overflow-hidden">
            <div className="grid grid-cols-12 items-stretch min-h-[280px]">
              <div className="col-span-4 bg-boomer-red text-paper-cream p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-en text-5xl text-paper-cream/90">01</span>
                  <span className="font-handwrite text-2xl text-paper-cream/85">Upper Floor</span>
                </div>
                <div className="font-display text-5xl font-black leading-tight">上层 · 精品区</div>
                <div className="font-body text-xl text-paper-cream/85 mt-3">视线及以上 · 高价值精选</div>
              </div>
              <img
                src={photoCeramics}
                alt="精品瓷器"
                className="col-span-4 w-full h-[280px] object-cover"
              />
              <div className="col-span-4 p-6 flex flex-col justify-center bg-paper-cream">
                <div className="font-display text-2xl font-bold mb-3 text-ink">高价值中古商品</div>
                <div className="flex flex-wrap gap-2">
                  {["绝版手办", "复古相机", "品牌瓷器", "中古腕表", "黑胶机", "经典毛绒"].map(t => (
                    <span key={t} className="px-3 py-1.5 bg-boomer-red text-paper-cream font-display text-base font-bold">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 中间分隔条 — 视觉上的"楼板" */}
          <div className="relative h-3 my-3">
            <div className="absolute inset-0 dots-pattern-red opacity-60" />
            <div className="absolute inset-y-0 left-0 right-0 border-t-2 border-b-2 border-dashed border-ink/40" />
          </div>

          {/* 下层 — 翻筐乐区（金色调，置于下方） */}
          <div className="vintage-border-red bg-vintage-gold overflow-hidden">
            <div className="grid grid-cols-12 items-stretch min-h-[280px]">
              <div className="col-span-4 p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-en text-5xl text-boomer-red">02</span>
                  <span className="font-handwrite text-2xl text-ink/70">Lower Floor</span>
                </div>
                <div className="font-display text-5xl font-black leading-tight text-ink">下层 · 淘货区</div>
                <div className="font-display text-3xl text-boomer-red mt-2">「翻 筐 乐」</div>
              </div>
              <div className="col-span-5 p-6 flex flex-col justify-center bg-paper-cream/60">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="mega-number text-5xl text-boomer-red leading-none">100<span className="text-2xl">+</span></div>
                    <div className="font-body text-base text-ink/75 mt-1">平价木筐</div>
                  </div>
                  <div>
                    <div className="mega-number text-5xl text-boomer-red leading-none">¥6.9</div>
                    <div className="font-body text-base text-ink/75 mt-1">起售价</div>
                  </div>
                  <div>
                    <div className="mega-number text-5xl text-boomer-red leading-none">∞</div>
                    <div className="font-body text-base text-ink/75 mt-1">寻宝乐趣</div>
                  </div>
                </div>
                <p className="font-body text-lg text-ink/80 mt-4 leading-snug">
                  海量小物件集中木筐自由翻找，"逛不完"驱动停留 <span className="font-bold text-boomer-red">45-90 分钟</span>
                </p>
              </div>
              <div className="col-span-3 bg-boomer-red text-paper-cream p-6 flex flex-col justify-center items-center text-center">
                <div className="font-handwrite text-xl text-paper-cream/85 mb-1">Discovery</div>
                <div className="font-display text-3xl font-black leading-tight">沉浸式<br/>寻宝体验</div>
              </div>
            </div>
          </div>
        </div>

        <p className="font-body text-2xl text-ink/75 mt-5 text-center">
          每一件皆为<span className="font-display font-black text-boomer-red">孤品</span> ·
          "每次来货都不一样"驱动极高复购率
        </p>
      </div>
    </SlideShell>
  );
}

/* ============================================================
 * 第 17 页 — 空间体验设计四大元素（每个配实拍图）
 * ============================================================ */
export function Slide17Experience({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  const items = [
    {
      icon: Disc3, title: "大通 Diatone 唱片机", en: "AUDIO IMMERSION",
      desc: "每店标配日本立式黑胶唱片机，全程播放昭和经典歌曲。视听共振创造「穿越感」",
      color: "bg-paper-cream", photo: photoVinyl, rotate: "rotate-[-1deg]"
    },
    {
      icon: Gamepad2, title: "巨型 Gameboy 装置", en: "INTERACTIVE PLAY",
      desc: "独家打造可实操的巨型 Gameboy，跨年龄段「回忆杀」打卡点",
      color: "bg-vintage-gold", photo: photoUltraman, rotate: "rotate-[1deg]"
    },
    {
      icon: Sparkles, title: "佐藤象店头", en: "VISUAL LANDMARK",
      desc: "经典橘色佐藤象站在门口，无声招牌 + 顾客合影第一站",
      color: "bg-boomer-red text-paper-cream", photo: photoSato, rotate: "rotate-[1deg]"
    },
    {
      icon: Gift, title: "DIY 互动体验区", en: "PARTICIPATORY EXPERIENCE",
      desc: "大众点评收藏打卡免费 DIY 冰箱贴 — 月均 1,000+ 收藏",
      color: "bg-paper-warm", photo: photoDIY, rotate: "rotate-[-1deg]"
    },
  ];
  return (
    <SlideShell pageNumber={pageNumber} totalPages={totalPages} variant="paper" chapter="04 · 核心商业模式">
      <div className="absolute inset-0 px-24 pt-32 pb-24">
        <div className="mb-6">
          <span className="font-handwrite text-4xl text-boomer-red">Experience Design</span>
          <h1 className="font-display text-7xl font-black mt-1">让每个角落都<span className="text-boomer-red">值得停留</span></h1>
        </div>

        <div className="grid grid-cols-2 gap-7">
          {items.map((it) => (
            <div key={it.title} className={`vintage-border ${it.color} ${it.rotate} overflow-hidden flex`}>
              <img src={it.photo} alt={it.title} className="w-[260px] h-[320px] object-cover flex-shrink-0" />
              <div className="p-7 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <it.icon className="w-12 h-12" strokeWidth={2.5} />
                  <div className="font-condensed text-xl tracking-widest opacity-70">{it.en}</div>
                </div>
                <div className="font-display text-4xl font-black mb-4 leading-tight">{it.title}</div>
                <div className="font-body text-2xl leading-relaxed opacity-90">{it.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}

/* ============================================================
 * 第 18 页 — 四大核心品类（每个品类配实拍）
 * ============================================================ */
export function Slide18Categories({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  const cats = [
    { icon: Package, name: "玩具动漫", en: "Toys & Anime", photo: photoUltraman,
      items: ["不二家 · 佐藤象", "三丽鸥 · 哆啦A梦", "奥特曼 · 假面骑士", "面包超人 · 龙珠"] },
    { icon: Coffee, name: "家居日用", en: "Home & Living", photo: photoTeapot,
      items: ["日式餐具 · 欧式瓷器", "中古线香 · 铁壶摆件", "丝巾手帕 · 毛巾浴巾", "复古玻璃器皿"] },
    { icon: Award, name: "首饰配饰", en: "Jewelry & Acc.", photo: photoPikachu,
      items: ["中古项链 · 胸针", "复古腕表", "经典徽章", "古着配饰"] },
    { icon: Headphones, name: "数码音像", en: "Electronics", photo: photoVinyl,
      items: ["黑胶唱片 · 唱片机", "随身听 · CCD 相机", "复古游戏机", "中古数码玩具"] },
  ];
  return (
    <SlideShell pageNumber={pageNumber} totalPages={totalPages} variant="cream" chapter="04 · 核心商业模式">
      <div className="absolute inset-0 px-24 pt-32 pb-24">
        <div className="flex items-end justify-between mb-7">
          <div>
            <span className="font-handwrite text-4xl text-boomer-red">Four Core Categories</span>
            <h1 className="font-display text-7xl font-black mt-1">覆盖<span className="text-boomer-red">半个世纪</span>的中古宝藏</h1>
          </div>
          <div className="text-right font-display text-2xl text-ink/65">
            从 50 年代到千禧年<br/>满足不同圈层爱好
          </div>
        </div>

        <div className="grid grid-cols-4 gap-5">
          {cats.map((c, i) => (
            <div key={c.name} className={`vintage-border bg-paper-cream overflow-hidden flex flex-col ${i % 2 === 0 ? "rotate-[-0.5deg]" : "rotate-[0.5deg]"}`}>
              <div className="relative aspect-square">
                <img src={c.photo} alt={c.name} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-boomer-red text-paper-cream w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
                  <c.icon className="w-8 h-8" strokeWidth={2.5} />
                </div>
              </div>
              <div className="p-7 flex-1 flex flex-col">
                <div className="font-condensed text-xl tracking-widest text-ink/55 mb-2">{c.en}</div>
                <div className="font-display text-4xl font-black mb-5 text-boomer-red">{c.name}</div>
                <ul className="space-y-3 flex-1">
                  {c.items.map((it) => (
                    <li key={it} className="font-body text-2xl text-ink/85 flex items-start gap-2 leading-snug">
                      <ChevronRight className="w-6 h-6 text-boomer-red mt-1.5 flex-shrink-0" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}

/* ============================================================
 * 第 19 页 — 翻筐乐（红底 + 实拍背景）
 * ============================================================ */
export function Slide19FlipperFun({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  return (
    <SlideShell pageNumber={pageNumber} totalPages={totalPages} variant="red" chapter="04 · 核心商业模式">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 chapter-num text-paper-cream/15">FUN</div>
        <div className="absolute bottom-0 left-0 w-full h-32 dots-pattern-cream opacity-30" />
      </div>

      <div className="absolute inset-0 px-28 pt-36 pb-24 grid grid-cols-12 gap-8">
        <div className="col-span-7 flex flex-col">
          <span className="font-handwrite text-4xl text-paper-cream/90">— Sub-brand Killer —</span>
          <h1 className="font-display text-9xl font-black text-paper-cream mt-2 mb-1 leading-none">
            翻 筐 乐
          </h1>
          <div className="font-en text-6xl text-paper-cream/75 mb-10">FLIPPER FUN</div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-paper-cream text-ink vintage-border-soft p-7 text-center rotate-[-1deg]">
              <div className="font-handwrite text-2xl text-boomer-red mb-2">起售价</div>
              <div className="mega-number text-8xl text-boomer-red">¥6.9</div>
              <div className="font-body text-xl mt-3 font-bold">极致低门槛</div>
            </div>
            <div className="bg-vintage-gold text-ink vintage-border-soft p-7 text-center rotate-[1deg]">
              <div className="font-handwrite text-2xl text-boomer-red mb-2">停留时长</div>
              <div className="mega-number text-8xl text-boomer-red">45<span className="text-4xl">-90</span></div>
              <div className="font-body text-xl mt-3 font-bold">分钟 / 人次</div>
            </div>
            <div className="bg-paper-cream text-ink vintage-border-soft p-7 text-center rotate-[-1deg]">
              <div className="font-handwrite text-2xl text-boomer-red mb-2">UGC 内容</div>
              <div className="mega-number text-8xl text-boomer-red">∞</div>
              <div className="font-body text-xl mt-3 font-bold">最具传播力</div>
            </div>
          </div>

          <div className="bg-paper-cream text-ink p-7 vintage-border-soft">
            <p className="font-display text-3xl leading-relaxed">
              <Quote className="inline w-8 h-8 text-boomer-red mr-2" />
              统一低价 + 木筐自由翻找 — 大量用户在小红书、抖音
              <span className="text-boomer-red font-black highlight-yellow">自发发布翻筐视频</span>
            </p>
          </div>
        </div>

        <div className="col-span-5 flex flex-col gap-4 justify-center">
          <img src={photoCups} alt="翻筐乐" className="w-full h-[260px] object-cover photo-vintage rotate-[2deg]" />
          <img src={photoPikachu} alt="翻筐乐" className="w-full h-[220px] object-cover photo-vintage rotate-[-2deg]" />
          <img src={photoUltraman} alt="翻筐乐" className="w-full h-[220px] object-cover photo-vintage rotate-[1deg]" />
        </div>
      </div>
    </SlideShell>
  );
}

/* ============================================================
 * 第 20 页 — VERITAS-CHAIN
 * ============================================================ */
export function Slide20Veritas({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  const steps = ["源头收购", "鉴定", "清洗", "评级", "上链", "包装"];
  return (
    <SlideShell pageNumber={pageNumber} totalPages={totalPages} variant="paper" chapter="05 · BOVAS 信任体系">
      <div className="absolute inset-0 px-28 pt-36 pb-24">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <span className="font-handwrite text-4xl text-boomer-red">BOVAS · Part 1</span>
            <h1 className="font-display text-6xl font-black mt-1">
              VERITAS-CHAIN <span className="text-boomer-red">区块链溯源</span>
            </h1>
          </div>
          <div className="stamp-red text-3xl">开 发 中</div>
        </div>
        <p className="font-body text-2xl text-ink/70 mb-10">每件高价值商品配备 NFC 芯片专属红色吊牌 · 全流程上链可查</p>

        <div className="bg-paper-cream vintage-border p-10 mb-8">
          <div className="flex items-center justify-between gap-3">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className="w-24 h-24 rounded-full bg-boomer-red text-paper-cream flex items-center justify-center font-en text-4xl mb-3 vintage-border-soft">
                    {i + 1}
                  </div>
                  <div className="font-display text-2xl font-bold">{s}</div>
                </div>
                {i < steps.length - 1 && (
                  <ChevronRight className="w-12 h-12 text-boomer-red flex-shrink-0" strokeWidth={3} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-vintage-gold p-8 vintage-border rotate-[-0.5deg]">
            <Shield className="w-14 h-14 text-boomer-red mb-3" strokeWidth={2.5} />
            <div className="font-display text-3xl font-black mb-2">NFC 红色吊牌</div>
            <div className="font-body text-xl text-ink/80">扫码即可查看商品「前世今生」</div>
          </div>
          <div className="bg-paper-cream p-8 vintage-border">
            <BadgeCheck className="w-14 h-14 text-boomer-red mb-3" strokeWidth={2.5} />
            <div className="font-display text-3xl font-black mb-2">全流程视频</div>
            <div className="font-body text-xl text-ink/75">鉴定到包装全程上链可追溯</div>
          </div>
          <div className="bg-boomer-red text-paper-cream p-8 vintage-border rotate-[0.5deg]">
            <Sparkles className="w-14 h-14 mb-3" strokeWidth={2.5} />
            <div className="font-display text-3xl font-black mb-2">行业开创性</div>
            <div className="font-body text-xl text-paper-cream/90">消除来源与品质疑虑</div>
          </div>
        </div>
      </div>
    </SlideShell>
  );
}

/* ============================================================
 * 第 21 页 — AESTHETICA 6 级品相评级
 * ============================================================ */
export function Slide21Aesthetica({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  const grades = [
    { g: "N", name: "New / Unused", desc: "全新未使用", color: "bg-boomer-red text-paper-cream" },
    { g: "S", name: "Mint Condition", desc: "极品微痕", color: "bg-vintage-gold" },
    { g: "A", name: "Excellent", desc: "优良品相", color: "bg-vintage-coral text-paper-cream" },
    { g: "B", name: "Good", desc: "良好品相", color: "bg-paper-cream" },
    { g: "C", name: "Fair", desc: "岁月痕迹", color: "bg-paper-warm" },
    { g: "J", name: "Junk / Parts", desc: "战损 / 配件", color: "bg-paper-sand" },
  ];
  return (
    <SlideShell pageNumber={pageNumber} totalPages={totalPages} variant="cream" chapter="05 · BOVAS 信任体系">
      <div className="absolute inset-0 px-28 pt-36 pb-24">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <span className="font-handwrite text-4xl text-boomer-red">BOVAS · Part 2</span>
            <h1 className="font-display text-6xl font-black mt-1">
              AESTHETICA <span className="text-boomer-red">6 级品相评级</span>
            </h1>
          </div>
          <div className="stamp-red text-3xl">开 发 中</div>
        </div>
        <p className="font-body text-2xl text-ink/70 mb-10">引入日本最严苛的评级体系 · 明码标价 · 一目了然</p>

        <div className="grid grid-cols-6 gap-4">
          {grades.map((g, i) => (
            <div
              key={g.g}
              className={`vintage-border ${g.color} p-6 flex flex-col items-center text-center ${i % 2 === 0 ? "rotate-[-1deg]" : "rotate-[1deg]"}`}
            >
              <div className="font-en text-[8rem] leading-none mb-3">{g.g}</div>
              <div className="font-condensed text-lg tracking-wider opacity-80 mb-1">{g.name}</div>
              <div className="font-display text-2xl font-bold">{g.desc}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-boomer-red text-paper-cream p-8 vintage-border">
          <p className="font-display text-3xl text-center">
            从源头到终端的全链路信任机制 — 解决中国消费者对二手商品的
            <span className="font-handwrite text-4xl text-vintage-gold">「信任痛点」</span>
          </p>
        </div>
      </div>
    </SlideShell>
  );
}

/* ============================================================
 * 第 22 页 — 四大核心价值
 * ============================================================ */
export function Slide22Value({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  const values = [
    { icon: Users, num: "01", title: "高粘性目的性消费客流", desc: "孤品属性 + 寻宝体验 = 高复购、高频次。10 万+ 累计客流持续验证。", color: "bg-paper-cream", rotate: "rotate-[-1deg]" },
    { icon: Zap, num: "02", title: "延长停留 · 带动连带消费", desc: "10,000+ SKU 高密度陈列 + 唱片 + Gameboy + DIY，停留 45-90 分钟。", color: "bg-vintage-gold", rotate: "rotate-[1deg]" },
    { icon: TrendingUp, num: "03", title: "社交媒体自发传播引擎", desc: "首店全网曝光 300 万+，大众点评 No.1，全部为零付费自发传播。", color: "bg-boomer-red text-paper-cream", rotate: "rotate-[1deg]" },
    { icon: Award, num: "04", title: "提升商圈调性与口碑", desc: "「招商终于有品位了」「商场终于有了有趣的店」— 真实用户评价。", color: "bg-vintage-coral text-paper-cream", rotate: "rotate-[-1deg]" },
  ];
  return (
    <SlideShell pageNumber={pageNumber} totalPages={totalPages} variant="paper" chapter="06 · BOOMER OFF 的核心价值">
      <div className="absolute inset-0 px-28 pt-36 pb-24">
        <span className="font-handwrite text-4xl text-boomer-red">Why BOOMER OFF</span>
        <h1 className="font-display text-7xl font-black mt-2 mb-10">
          BOOMER OFF 的<span className="text-boomer-red">四大核心价值</span>
        </h1>

        <div className="grid grid-cols-2 gap-6">
          {values.map((v) => (
            <div key={v.num} className={`vintage-border p-8 ${v.color} ${v.rotate}`}>
              <div className="flex items-start justify-between mb-4">
                <v.icon className="w-16 h-16" strokeWidth={2} />
                <div className="font-en text-8xl opacity-30 leading-none">{v.num}</div>
              </div>
              <div className="font-display text-4xl font-black mb-3 leading-tight">{v.title}</div>
              <div className="font-body text-xl leading-relaxed opacity-90">{v.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}

/* ============================================================
 * 第 23 页 — 数据见真章（去黑色）
 * ============================================================ */
export function Slide23Wall({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  return (
    <SlideShell pageNumber={pageNumber} totalPages={totalPages} variant="warm" chapter="06 · BOOMER OFF 的核心价值">
      <div className="absolute inset-0 px-28 pt-36 pb-24 flex flex-col">
        <span className="font-handwrite text-4xl text-boomer-red mb-2">Numbers Speak</span>
        <h1 className="font-display text-8xl font-black mb-10">
          数 据 见 <span className="text-boomer-red">真 章</span>
        </h1>

        <div className="flex-1 grid grid-cols-4 grid-rows-2 gap-5">
          <div className="col-span-2 row-span-2 bg-boomer-red text-paper-cream vintage-border p-12 flex flex-col justify-between rotate-[-0.5deg]">
            <div className="font-handwrite text-4xl">全网曝光</div>
            <div>
              <div className="mega-number text-[14rem] leading-none">300<span className="text-7xl">万+</span></div>
              <div className="font-display text-3xl mt-3">零付费 · 自然传播</div>
            </div>
          </div>
          <div className="bg-paper-cream vintage-border-red p-7 flex flex-col justify-between rotate-[1deg]">
            <div className="font-handwrite text-2xl text-boomer-red">累计客流</div>
            <div className="mega-number text-7xl text-boomer-red">10<span className="text-3xl">万+</span></div>
          </div>
          <div className="bg-vintage-gold vintage-border-red p-7 flex flex-col justify-between rotate-[-1deg]">
            <div className="font-handwrite text-2xl">单店 SKU</div>
            <div className="mega-number text-7xl">10K<span className="text-3xl">+</span></div>
          </div>
          <div className="bg-paper-cream vintage-border-red p-7 flex flex-col justify-between rotate-[-1deg]">
            <div className="font-handwrite text-2xl text-boomer-red">起售价</div>
            <div className="mega-number text-7xl text-boomer-red">¥6.9</div>
          </div>
          <div className="bg-vintage-coral text-paper-cream vintage-border-red p-7 flex flex-col justify-between rotate-[1deg]">
            <div className="font-handwrite text-2xl">月均打卡</div>
            <div className="mega-number text-7xl">1K<span className="text-3xl">+</span></div>
          </div>
        </div>
      </div>
    </SlideShell>
  );
}

/* ============================================================
 * 第 24 页 — 标准店合作条件
 * ============================================================ */
export function Slide24Cooperation({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  const conditions = [
    { label: "目标面积", value: "80 - 100 ㎡", icon: Store, color: "bg-paper-cream" },
    { label: "楼层要求", value: "B1 层 或 1F", icon: Building2, sub: "高人流量楼层", color: "bg-vintage-gold" },
    { label: "铺位条件", value: "需基础装修", icon: HomeIcon, sub: "暂不接受毛胚铺位", color: "bg-paper-cream" },
    { label: "工程条件", value: "常规商业用电+网络", icon: Zap, sub: "无特殊排烟/上下水", color: "bg-vintage-coral text-paper-cream" },
    { label: "合作模式", value: "销售额扣点", icon: BadgeCheck, sub: "按月销售额约定比例", color: "bg-boomer-red text-paper-cream" },
  ];
  return (
    <SlideShell pageNumber={pageNumber} totalPages={totalPages} variant="cream" chapter="07 · 门店模型与合作">
      <div className="absolute inset-0 px-28 pt-36 pb-24">
        <span className="font-handwrite text-4xl text-boomer-red">Partnership Conditions</span>
        <h1 className="font-display text-7xl font-black mt-2 mb-10 leading-tight">
          标准店 <span className="text-boomer-red">Vintage</span> · 合作条件
        </h1>

        <div className="grid grid-cols-5 gap-5 mb-8">
          {conditions.map((c, i) => (
            <div key={c.label} className={`vintage-border p-6 flex flex-col ${c.color} ${i % 2 === 0 ? "rotate-[-0.5deg]" : "rotate-[0.5deg]"}`}>
              <c.icon className="w-14 h-14 mb-4" strokeWidth={2.5} />
              <div className="font-handwrite text-2xl opacity-70 mb-1">{c.label}</div>
              <div className="font-display text-3xl font-black mb-2 leading-tight">{c.value}</div>
              {c.sub && <div className="font-body text-base opacity-75 mt-auto">{c.sub}</div>}
            </div>
          ))}
        </div>

        <div className="bg-boomer-red text-paper-cream p-10 vintage-border">
          <p className="font-display text-3xl leading-relaxed">
            <span className="font-black highlight-yellow text-ink">高频次 · 高粘性</span>的流量型业态，销售额扣点模式实现深度利益绑定 ——
            <span className="font-handwrite text-4xl text-vintage-gold ml-2">品牌销售越好，合作方收益越高</span>
            ，可<span className="font-black">快速入驻、快速开业</span>。
          </p>
        </div>
      </div>
    </SlideShell>
  );
}

/* ============================================================
 * 第 26 页 — 七大店型 (上)
 * ============================================================ */
export function Slide26Matrix1({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  const stores = [
    { name: "Vintage", icon: Store, area: "80-100㎡", tag: "标准商场店", desc: "全品类中古杂货铺，已验证流量模型，快速复制核心店型", main: true },
    { name: "Home", icon: HomeIcon, area: "80-150㎡", tag: "家居垂直", desc: "瓷器、毛巾、丝巾、摆件、家具、线香等家居二手商品" },
    { name: "Hobby", icon: Gamepad2, area: "80-150㎡", tag: "兴趣爱好", desc: "玩具、卡牌、手办、二次元、黑胶、CD、磁带、书籍" },
    { name: "Collection", icon: ShoppingBag, area: "80-200㎡", tag: "高端二奢", desc: "一线高端商场，时尚箱包/服饰/收藏品，数千至十几万元" },
  ];
  return (
    <SlideShell pageNumber={pageNumber} totalPages={totalPages} variant="paper" chapter="08 · 品牌矩阵与未来">
      <div className="absolute inset-0 px-28 pt-36 pb-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="font-handwrite text-4xl text-boomer-red">Brand Matrix · 1/2</span>
            <h1 className="font-display text-6xl font-black mt-1">七大店型布局 <span className="text-boomer-red">[ 上 ]</span></h1>
          </div>
          <div className="font-handwrite text-4xl text-ink/55 rotate-[-2deg]">不止一家店</div>
        </div>

        <div className="grid grid-cols-4 gap-5">
          {stores.map((s, i) => (
            <div key={s.name} className={`vintage-border p-7 ${s.main ? "bg-boomer-red text-paper-cream" : "bg-paper-cream"} flex flex-col ${i % 2 === 0 ? "rotate-[-0.5deg]" : "rotate-[0.5deg]"}`}>
              <s.icon className={`w-14 h-14 ${s.main ? "text-paper-cream" : "text-boomer-red"} mb-4`} strokeWidth={2.5} />
              <div className={`font-condensed text-base tracking-widest mb-1 ${s.main ? "text-paper-cream/85" : "text-ink/55"}`}>BOOMER OFF</div>
              <div className="font-en text-6xl mb-2 leading-none">{s.name}</div>
              <div className={`font-display text-2xl font-bold mb-2 ${s.main ? "text-paper-cream" : "text-boomer-red"}`}>{s.tag}</div>
              <div className={`font-body text-lg mb-3 font-bold ${s.main ? "text-paper-cream/90" : "text-ink/75"}`}>面积 · {s.area}</div>
              <div className={`font-body text-base leading-snug ${s.main ? "text-paper-cream/85" : "text-ink/70"} flex-1`}>{s.desc}</div>
              {s.main && (
                <div className="mt-4 inline-block bg-vintage-gold text-ink px-3 py-1 font-display text-base font-black w-fit">★ 核心店型</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}

/* ============================================================
 * 第 27 页 — 七大店型 (下)
 * ============================================================ */
export function Slide27Matrix2({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  const stores = [
    { name: "Digital", icon: Smartphone, area: "80-150㎡", tag: "数码家电", desc: "中古数码、二手家电、手机设备、3C 配件等全品类数码家电产品", color: "bg-vintage-gold" },
    { name: "NB", icon: Coffee, area: "30-60㎡", tag: "Neighborhood 社区店", desc: "辐射社区，标准化二手交换/寄售 + 自营中古品，社区二手循环站", color: "bg-paper-cream" },
    { name: "Plus", icon: Warehouse, area: "1,000㎡+", tag: "大型特卖", desc: "选址郊区，承接所有连锁店滞销商品的最终清仓出口", color: "bg-vintage-coral text-paper-cream" },
  ];
  return (
    <SlideShell pageNumber={pageNumber} totalPages={totalPages} variant="paper" chapter="08 · 品牌矩阵与未来">
      <div className="absolute inset-0 px-28 pt-36 pb-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="font-handwrite text-4xl text-boomer-red">Brand Matrix · 2/2</span>
            <h1 className="font-display text-6xl font-black mt-1">七大店型布局 <span className="text-boomer-red">[ 下 ]</span></h1>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-10">
          {stores.map((s, i) => (
            <div key={s.name} className={`vintage-border p-8 ${s.color} flex flex-col ${i % 2 === 0 ? "rotate-[-0.5deg]" : "rotate-[0.5deg]"}`}>
              <s.icon className="w-14 h-14 mb-4" strokeWidth={2.5} />
              <div className="font-condensed text-base tracking-widest opacity-60 mb-1">BOOMER OFF</div>
              <div className="font-en text-6xl mb-2 leading-none">{s.name}</div>
              <div className="font-display text-2xl font-bold mb-2 opacity-85">{s.tag}</div>
              <div className="font-body text-lg mb-3 font-bold opacity-80">面积 · {s.area}</div>
              <div className="font-body text-lg leading-snug opacity-80 flex-1">{s.desc}</div>
            </div>
          ))}
        </div>

        <div className="bg-boomer-red text-paper-cream p-8 vintage-border">
          <p className="font-display text-2xl leading-relaxed text-center">
            构建<span className="font-handwrite text-3xl text-vintage-gold">「核心商场 → 高端精品 → 垂直深耕 → 数码 → 社区 → 郊区」</span>完整布局
          </p>
        </div>
      </div>
    </SlideShell>
  );
}

/* ============================================================
 * 第 28 页 — 增长飞轮
 * ============================================================ */
export function Slide28Flywheel({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  const stages = [
    { stage: "核心商场", store: "Vintage", color: "bg-boomer-red text-paper-cream" },
    { stage: "高端精品", store: "Collection", color: "bg-vintage-gold" },
    { stage: "垂直品类", store: "Home / Hobby", color: "bg-vintage-coral text-paper-cream" },
    { stage: "数码专营", store: "Digital", color: "bg-paper-cream" },
    { stage: "社区渗透", store: "NB", color: "bg-vintage-gold" },
    { stage: "郊区特卖", store: "Plus", color: "bg-boomer-red text-paper-cream" },
  ];
  return (
    <SlideShell pageNumber={pageNumber} totalPages={totalPages} variant="cream" chapter="08 · 品牌矩阵与未来">
      <div className="absolute inset-0 px-28 pt-36 pb-24 flex flex-col">
        <span className="font-handwrite text-4xl text-boomer-red">Growth Flywheel</span>
        <h1 className="font-display text-7xl font-black mt-1 mb-10">
          BOOMER OFF <span className="text-boomer-red">长期增长飞轮</span>
        </h1>

        <div className="flex-1 flex items-center">
          <div className="w-full">
            <div className="flex items-stretch gap-3">
              {stages.map((s, i) => (
                <div key={s.stage} className="flex-1 flex items-center">
                  <div className={`flex-1 ${s.color} vintage-border p-6 text-center ${i % 2 === 0 ? "rotate-[-1deg]" : "rotate-[1deg]"}`}>
                    <div className="font-en text-5xl mb-2">{String(i + 1).padStart(2, "0")}</div>
                    <div className="font-display text-2xl font-black mb-1">{s.stage}</div>
                    <div className="font-body text-base opacity-80 font-bold">{s.store}</div>
                  </div>
                  {i < stages.length - 1 && (
                    <ChevronRight className="w-10 h-10 text-boomer-red mx-1 flex-shrink-0" strokeWidth={3} />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-12 grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="mega-number text-7xl text-boomer-red mb-2">7</div>
                <div className="font-display text-2xl font-bold">店型矩阵</div>
              </div>
              <div className="text-center">
                <div className="mega-number text-7xl text-boomer-red mb-2">∞</div>
                <div className="font-display text-2xl font-bold">城市覆盖</div>
              </div>
              <div className="text-center">
                <div className="mega-number text-7xl text-boomer-red mb-2">100%</div>
                <div className="font-display text-2xl font-bold">人群覆盖</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SlideShell>
  );
}

/* ============================================================
 * 第 29 页 — 联系我们（去黑色，改红+米黄）
 * ============================================================ */
export function Slide29Contact({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  return (
    <SlideShell pageNumber={pageNumber} totalPages={totalPages} variant="paper" chapter="09 · 联系我们">
      <div className="absolute inset-0 px-28 pt-36 pb-24">
        <div className="mb-10">
          <span className="font-handwrite text-4xl text-boomer-red">Get in Touch</span>
          <h1 className="font-display text-7xl font-black mt-1 leading-tight">
            期待与您<span className="text-boomer-red">携手同行</span>
          </h1>
          <p className="font-body text-3xl text-ink/70 mt-3">将关于时间、记忆与惊喜的体验，带给更多城市</p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="bg-vintage-gold vintage-border p-10 rotate-[-1deg]">
            <div className="font-handwrite text-4xl text-boomer-red mb-6">— Company —</div>
            <div className="space-y-6">
              <div>
                <div className="font-condensed text-xl tracking-[0.3em] text-ink/65 mb-2">公司名称</div>
                <div className="font-display text-3xl font-bold leading-snug">宝暮（上海）品牌管理有限公司</div>
              </div>
              <div>
                <div className="font-condensed text-xl tracking-[0.3em] text-ink/65 mb-2">加盟体验中心</div>
                <div className="font-display text-2xl font-bold leading-snug">上海市闵行区光华路 728 号<br/>728Space C5 栋 3 楼</div>
              </div>
            </div>
          </div>

          <div className="bg-boomer-red text-paper-cream vintage-border p-10 rotate-[1deg]">
            <div className="font-handwrite text-4xl text-paper-cream mb-6">— Contact —</div>
            <div className="space-y-6">
              <div>
                <div className="font-condensed text-xl tracking-[0.3em] text-paper-cream/85 mb-2">联系人</div>
                <div className="font-display text-5xl font-black">潘 瞻 远</div>
              </div>
              <div>
                <div className="font-condensed text-xl tracking-[0.3em] text-paper-cream/85 mb-2">联系电话</div>
                <div className="font-en text-6xl flex items-center gap-3">
                  <Phone className="w-12 h-12" strokeWidth={2.5} />
                  186 5743 3310
                </div>
              </div>
              <div className="pt-4 border-t-2 border-paper-cream/40">
                <div className="font-handwrite text-3xl">欢迎招商 · 加盟 · 品牌合作</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SlideShell>
  );
}

/* ============================================================
 * 第 30 页 — 门店地址（去黑色）
 * ============================================================ */
export function Slide30Stores({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  return (
    <SlideShell pageNumber={pageNumber} totalPages={totalPages} variant="cream" chapter="09 · 联系我们">
      <div className="absolute inset-0 px-28 pt-36 pb-24">
        <span className="font-handwrite text-4xl text-boomer-red">Our Stores</span>
        <h1 className="font-display text-7xl font-black mt-1 mb-10">门 店 地 址</h1>

        <div className="space-y-6">
          <div className="bg-paper-cream vintage-border p-10 flex items-center gap-10 rotate-[-0.5deg]">
            <MapPin className="w-24 h-24 text-boomer-red flex-shrink-0" strokeWidth={2} />
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3 flex-wrap">
                <div className="font-display text-4xl font-black">BOOMER OFF · 中信泰富店</div>
                <span className="bg-boomer-red text-paper-cream px-5 py-2 font-display text-2xl font-bold">营 业 中</span>
              </div>
              <div className="font-body text-2xl text-ink/80 font-bold">上海市静安区南京西路 1168 号 · 中信泰富广场 B1 层</div>
              <div className="mt-3 flex gap-6 font-handwrite text-3xl text-boomer-red flex-wrap">
                <span>★ 南京西路商圈 No.1</span>
                <span>★ 静安区 No.1</span>
                <span>★ 全上海 No.5</span>
              </div>
            </div>
          </div>

          <div className="bg-vintage-gold vintage-border-red p-10 flex items-center gap-10 rotate-[0.5deg]">
            <MapPin className="w-24 h-24 text-boomer-red flex-shrink-0" strokeWidth={2} />
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3 flex-wrap">
                <div className="font-display text-4xl font-black">更 多 门 店</div>
                <span className="bg-boomer-red text-paper-cream px-5 py-2 font-display text-2xl font-bold">筹 备 中</span>
              </div>
              <div className="font-body text-2xl text-ink/80 font-bold">敬请期待 · 期待与您共同将首店成功复制到更多城市</div>
            </div>
          </div>
        </div>

        <div className="mt-10 bg-boomer-red text-paper-cream p-8 vintage-border text-center">
          <p className="font-display text-3xl">
            正在寻找<span className="font-handwrite text-4xl text-vintage-gold mx-2">志同道合</span>的合作伙伴
            — 商业地产 · 投资机构 · 加盟商
          </p>
        </div>
      </div>
    </SlideShell>
  );
}

/* ============================================================
 * 第 31 页 — 金句
 * ============================================================ */
export function Slide31Slogan({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  return (
    <SlideShell pageNumber={pageNumber} totalPages={totalPages} variant="red">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[900px] h-[900px] dots-pattern-cream opacity-20" />
        <div className="absolute bottom-0 left-0 w-full h-1/3 lines-pattern opacity-30" />
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-32">
        <img src={logo} alt="BOOMER OFF" className="w-[760px] mb-14 brightness-0 invert" />
        <div className="border-y-[6px] border-paper-cream py-12 px-24">
          <div className="font-display text-[10rem] font-black text-paper-cream text-center leading-none">
            虽 古 但 新
          </div>
          <div className="font-display text-[10rem] font-black text-paper-cream text-center leading-none mt-6">
            信 任 可 见
          </div>
        </div>
        <div className="font-handwrite text-5xl text-paper-cream/85 mt-12">
          — Vintage but Brand New, Trust Made Visible —
        </div>
      </div>
    </SlideShell>
  );
}

/* ============================================================
 * 第 32 页 — 致谢
 * ============================================================ */
export function Slide32Thanks({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  return (
    <SlideShell pageNumber={pageNumber} totalPages={totalPages} variant="cream" noFooter>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-[700px] h-[700px] dots-pattern-red opacity-40" />
        <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] dots-pattern opacity-30" />
      </div>

      <div className="absolute inset-0 grid grid-cols-12 gap-10 px-24 py-24 items-center">
        {/* 左侧：致谢 + 联系信息 */}
        <div className="col-span-7 flex flex-col items-start">
          <div className="font-en text-[14rem] text-boomer-red leading-none">THANK</div>
          <div className="font-en text-[14rem] text-ink leading-none mb-10">YOU</div>

          <div className="font-display text-4xl text-ink/85 mb-2">欢 迎 招 商 · 加 盟 · 品 牌 合 作</div>
          <div className="font-handwrite text-3xl text-boomer-red mb-10">we look forward to hearing from you</div>

          <div className="space-y-4">
            <div>
              <div className="font-handwrite text-2xl text-ink/65">Contact · 联系人</div>
              <div className="font-display text-4xl font-black">潘瞻远 · 18657433310</div>
            </div>
            <div>
              <div className="font-handwrite text-2xl text-ink/65">Brand</div>
              <div className="font-display text-3xl font-black">BOOMER OFF Vintage</div>
            </div>
          </div>

          <img src={logo} alt="BOOMER OFF" className="w-[260px] mt-10 opacity-85" />
        </div>

        {/* 右侧：红色二维码卡片 */}
        <div className="col-span-5 flex items-center justify-center">
          <div className="bg-boomer-red text-paper-cream vintage-border p-8 rotate-[2deg] relative">
            <div className="absolute -top-4 -right-4 stamp-red bg-paper-cream text-2xl">SCAN ME</div>
            <div className="font-handwrite text-4xl text-paper-cream mb-2 text-center">— Scan to Connect —</div>
            <div className="font-display text-3xl font-black text-center mb-6">扫 码 添 加 微 信</div>

            <div className="bg-boomer-red p-4">
              <img
                src={wechatQR}
                alt="微信二维码"
                className="w-[420px] h-[420px] block"
                style={{ filter: "invert(1) hue-rotate(180deg)" }}
              />
            </div>

            <div className="text-center mt-6">
              <div className="font-display text-2xl font-bold">微信咨询 · 招商加盟</div>
              <div className="font-handwrite text-2xl text-paper-cream/85 mt-1">WeChat · 7×24h</div>
            </div>
          </div>
        </div>
      </div>
    </SlideShell>
  );
}
