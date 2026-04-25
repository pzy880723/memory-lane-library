import { SlideShellPortrait } from "./SlideShellPortrait";
import logo from "@/assets/boomer-off-logo.png";
import {
  TrendingUp, MapPin, Users, Sparkles, Gamepad2, Heart, Zap,
  Shield, Award, Recycle, Building2, Phone, Star, Quote, ChevronRight,
  Package, Coffee, Headphones, Gift, Store, Home as HomeIcon,
  ShoppingBag, Smartphone, Warehouse, MessageCircle, BadgeCheck, Disc3,
  Check, X, ChevronDown,
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

/* ============ 1. 封面 ============ */
export function P_Cover() {
  return (
    <SlideShellPortrait variant="paper" showHeader={false} noFooter>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[800px] h-[800px] rounded-full bg-boomer-red/15" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] dots-pattern-red opacity-60" />
      </div>

      <div className="absolute top-12 left-12 right-12 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-boomer-red" />
          <span className="font-condensed text-2xl tracking-[0.3em] text-ink/70">BRAND BOOK · 2026</span>
        </div>
        <span className="font-handwrite text-3xl text-boomer-red rotate-[-2deg]">Shanghai</span>
      </div>

      {/* 实拍照片 */}
      <img src={photoSatoDetail} alt="Sato" className="absolute top-44 right-8 w-[280px] h-[360px] object-cover photo-vintage rotate-[6deg] z-[3]" />
      <img src={photoVinyl} alt="Vinyl" className="absolute bottom-44 left-8 w-[260px] h-[340px] object-cover photo-vintage rotate-[-5deg] z-[3]" />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-12 z-[6]">
        <img src={logo} alt="BOOMER OFF Vintage" className="w-[820px] mb-10 drop-shadow-2xl" />
        <div className="vintage-border bg-paper-cream px-12 py-6 mb-8 rotate-[-1.5deg]">
          <p className="font-display text-5xl font-black tracking-wider">
            虽古但新 · <span className="text-boomer-red">信任可见</span>
          </p>
        </div>
        <p className="font-display text-3xl text-ink/85 tracking-wider text-center leading-relaxed">
          国 内 首 家<br/>标 准 化 中 古 连 锁 品 牌
        </p>
      </div>

      <div className="absolute bottom-12 left-12 right-12 text-center z-10">
        <p className="font-handwrite text-3xl text-ink/75">— SmartShanghai · 2026.03 —</p>
      </div>
    </SlideShellPortrait>
  );
}

/* ============ 2. 目录 ============ */
export function P_TOC({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  const items = [
    { num: "01", title: "已验证的市场表现" },
    { num: "02", title: "品牌定位与愿景" },
    { num: "03", title: "市场机遇与赛道" },
    { num: "04", title: "核心商业模式" },
    { num: "05", title: "BOVAS 信任体系" },
    { num: "06", title: "BOOMER OFF 的核心价值" },
    { num: "07", title: "门店模型与合作" },
    { num: "08", title: "品牌矩阵与未来" },
    { num: "09", title: "联系我们" },
  ];
  return (
    <SlideShellPortrait pageNumber={pageNumber} totalPages={totalPages} variant="cream">
      <div className="absolute inset-0 px-16 pt-44 pb-32">
        <div className="mb-10">
          <span className="font-en text-8xl text-boomer-red leading-none block">CONTENTS</span>
          <span className="font-display text-5xl mt-3 inline-block">目 录</span>
        </div>
        <div className="space-y-5">
          {items.map((it, i) => (
            <div key={it.num} className={`border-l-[6px] border-boomer-red pl-6 py-2 ${i % 2 === 0 ? "" : "rotate-[0.3deg]"}`}>
              <div className="flex items-baseline gap-5">
                <span className="font-en text-5xl text-ink/30">{it.num}</span>
                <span className="font-display text-3xl font-bold">{it.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideShellPortrait>
  );
}

/* ============ 3. 核心摘要 ============ */
export function P_Executive({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  return (
    <SlideShellPortrait pageNumber={pageNumber} totalPages={totalPages} variant="paper" chapter="EXECUTIVE">
      <div className="absolute inset-0 px-12 pt-36 pb-28 flex flex-col">
        <span className="font-handwrite text-3xl text-boomer-red">Executive Summary</span>
        <h1 className="font-display text-7xl font-black mt-2 leading-tight">
          一个<span className="text-boomer-red">现象级</span><br/>线下零售新物种
        </h1>

        <img src={photoCeramics} alt="店铺" className="w-full h-[440px] object-cover photo-vintage mt-6 rotate-[1deg]" />

        <p className="font-body text-2xl leading-relaxed text-ink/85 mt-6">
          首创<span className="highlight-red font-bold">「标准化 × 氛围感」双基因模式</span>，开业即成为现象级网红业态。
        </p>

        <div className="grid grid-cols-3 gap-4 mt-auto">
          <div className="bg-boomer-red text-paper-cream vintage-border p-5 text-center">
            <div className="mega-number text-6xl">300<span className="text-3xl">万+</span></div>
            <div className="font-display text-xl font-bold mt-2">全网曝光</div>
          </div>
          <div className="bg-vintage-gold vintage-border p-5 text-center">
            <div className="mega-number text-6xl text-ink">10<span className="text-3xl">万+</span></div>
            <div className="font-display text-xl font-bold mt-2">定向客流</div>
          </div>
          <div className="bg-paper-cream vintage-border p-5 text-center">
            <div className="mega-number text-6xl text-boomer-red">No.1</div>
            <div className="font-display text-xl font-bold mt-2">大众点评</div>
          </div>
        </div>
      </div>
    </SlideShellPortrait>
  );
}

/* ============ 章节扉页 ============ */
export function P_Chapter({
  num, title, en, desc, pageNumber, totalPages,
}: { num: string; title: string; en: string; desc: string; pageNumber: number; totalPages: number }) {
  return (
    <SlideShellPortrait pageNumber={pageNumber} totalPages={totalPages} variant="red" chapter={`CH ${num}`}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-0 w-1/2 h-1/2 lines-pattern opacity-20" />
      </div>
      <div className="absolute inset-0 flex flex-col justify-center px-14">
        <div className="font-handwrite text-4xl text-paper-cream/90 mb-4">— Chapter {num} —</div>
        <div className="font-en text-9xl leading-none text-paper-cream mb-6">{num}</div>
        <div className="font-en text-7xl leading-none text-paper-cream mb-8">{en}</div>
        <h1 className="font-display text-7xl font-black text-paper-cream mb-8 leading-tight">{title}</h1>
        <div className="w-32 h-2 bg-paper-cream mb-8" />
        <p className="font-body text-3xl text-paper-cream leading-relaxed font-medium">{desc}</p>
      </div>
    </SlideShellPortrait>
  );
}

/* ============ 5. 自然流量奇迹 ============ */
export function P_Traffic({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  const subData = [
    { label: "南京西路商圈", value: "No.1", icon: Star },
    { label: "静安区", value: "No.1", icon: Star },
    { label: "全上海", value: "No.5", icon: Award },
    { label: "小红书 AI 推荐", value: "杂货铺", icon: Sparkles },
    { label: "明星 / KOL", value: "自发打卡", icon: Heart },
    { label: "月均收藏", value: "1,000+", icon: BadgeCheck },
  ];
  return (
    <SlideShellPortrait pageNumber={pageNumber} totalPages={totalPages} variant="paper" chapter="01 · 首店实绩">
      <div className="absolute inset-0 px-12 pt-36 pb-28 flex flex-col">
        <h1 className="font-display text-6xl font-black leading-tight mb-2">
          零投放<br/><span className="text-boomer-red highlight-yellow">自然流量奇迹</span>
        </h1>
        <p className="font-body text-2xl text-ink/70 mb-6">未付费推广 · 现象级自然爆发</p>

        <div className="bg-boomer-red text-paper-cream vintage-border p-7 mb-4 rotate-[-0.5deg]">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-12 h-12" strokeWidth={2.5} />
            <div className="font-display text-3xl font-bold">全网曝光</div>
          </div>
          <div className="mega-number text-9xl leading-none">300<span className="text-5xl ml-2">万+</span></div>
        </div>

        <div className="bg-vintage-gold vintage-border p-7 mb-5 rotate-[0.5deg]">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-12 h-12" strokeWidth={2.5} />
            <div className="font-display text-3xl font-bold">定向客流</div>
          </div>
          <div className="mega-number text-9xl leading-none text-boomer-red">10<span className="text-5xl ml-2">万+</span></div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-auto">
          {subData.map((d, i) => (
            <div key={d.label} className={`vintage-border p-4 bg-paper-cream ${i % 2 === 0 ? "rotate-[-0.3deg]" : "rotate-[0.3deg]"}`}>
              <d.icon className="w-8 h-8 mb-2 text-boomer-red" strokeWidth={2.5} />
              <div className="font-body text-lg opacity-65">{d.label}</div>
              <div className="font-display text-2xl font-black">{d.value}</div>
            </div>
          ))}
        </div>
      </div>
    </SlideShellPortrait>
  );
}

/* ============ 6. SmartShanghai ============ */
export function P_Media({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  return (
    <SlideShellPortrait pageNumber={pageNumber} totalPages={totalPages} variant="cream" chapter="01 · 首店实绩">
      <div className="absolute inset-0 px-12 pt-36 pb-28 flex flex-col">
        <span className="font-handwrite text-3xl text-boomer-red mb-2">— Featured by —</span>
        <h1 className="font-display text-6xl font-black mb-5 leading-tight">
          SmartShanghai<br/><span className="text-boomer-red">专题报道</span>
        </h1>

        <div className="bg-boomer-red text-paper-cream px-7 py-5 vintage-border rotate-[-1.5deg] mb-5 self-start">
          <p className="font-en text-3xl tracking-wide">A Tiny Basement Shop</p>
          <p className="font-en text-3xl tracking-wide">Full of Old Toys</p>
        </div>

        <img src={photoDiatone} alt="Diatone" className="w-full h-[280px] object-cover photo-vintage mb-5" />

        <div className="bg-paper-cream vintage-border p-6 relative rotate-[1deg] mb-4">
          <Quote className="absolute -top-5 -left-5 w-12 h-12 text-boomer-red bg-paper-cream rounded-full p-2" />
          <p className="font-display text-2xl leading-relaxed mb-2">
            "It's not the kind of place you walk through in five minutes."
          </p>
          <p className="font-body text-lg text-ink/65">这不是五分钟就能逛完的店</p>
        </div>

        <div className="bg-vintage-gold vintage-border-red p-6 relative rotate-[-1deg]">
          <Quote className="absolute -top-5 -left-5 w-12 h-12 text-boomer-red bg-vintage-gold rounded-full p-2" />
          <p className="font-display text-2xl leading-relaxed mb-2">
            "Easy to stop by, easy to stay longer than planned."
          </p>
          <p className="font-body text-lg text-ink/75">很容易待得比计划久得多</p>
        </div>
      </div>
    </SlideShellPortrait>
  );
}

/* ============ 7. 用户评价关键词 ============ */
export function P_Keywords({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  const groups = [
    { cat: "稀缺性认知", quotes: ["上海少见的日本中古", "国内第一家"], color: "bg-boomer-red text-paper-cream" },
    { cat: "沉浸式体验", quotes: ["可以逛一下午", "翻筐停不下来"], color: "bg-paper-cream" },
    { cat: "情绪价值", quotes: ["治愈", "回忆杀", "有温度"], color: "bg-vintage-gold" },
    { cat: "性价比", quotes: ["几块钱淘到好东西", "比代购便宜"], color: "bg-paper-warm" },
    { cat: "社交传播", quotes: ["拍照超好看", "必须带闺蜜"], color: "bg-vintage-coral text-paper-cream" },
    { cat: "商业口碑", quotes: ["招商终于有品位", "终于有趣的店"], color: "bg-boomer-red text-paper-cream" },
  ];
  return (
    <SlideShellPortrait pageNumber={pageNumber} totalPages={totalPages} variant="paper" chapter="01 · 首店实绩">
      <div className="absolute inset-0 px-12 pt-36 pb-28 flex flex-col">
        <span className="font-handwrite text-3xl text-boomer-red">Voice of Customers</span>
        <h1 className="font-display text-6xl font-black mt-1 mb-2 leading-tight">
          用户评价<span className="text-boomer-red">高频关键词</span>
        </h1>
        <p className="font-body text-xl text-ink/65 mb-6">小红书 · 大众点评 · 抖音</p>

        <div className="grid grid-cols-2 gap-4 flex-1">
          {groups.map((g, i) => (
            <div key={g.cat} className={`vintage-border p-5 ${g.color} ${i % 2 === 0 ? "rotate-[-0.5deg]" : "rotate-[0.5deg]"}`}>
              <div className="font-display text-2xl font-black mb-3 flex items-center gap-2">
                <MessageCircle className="w-6 h-6" strokeWidth={2.5} />
                {g.cat}
              </div>
              <div className="space-y-1.5">
                {g.quotes.map((q) => (
                  <div key={q} className="font-body text-lg leading-snug">"{q}"</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideShellPortrait>
  );
}

/* ============ 10. 解决问题（三栏 → 三行） ============ */
export function P_Problem({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  return (
    <SlideShellPortrait pageNumber={pageNumber} totalPages={totalPages} variant="paper" chapter="02 · 品牌定位">
      <div className="absolute inset-0 px-12 pt-36 pb-28 flex flex-col">
        <div className="text-center mb-6">
          <span className="font-handwrite text-2xl text-boomer-red">ダブル DNA</span>
          <h1 className="font-display text-6xl font-black mt-1 leading-tight">
            标准化 <span className="text-boomer-red">×</span> 氛围感
          </h1>
          <p className="font-body text-xl text-ink/65 mt-2">双基因融合模式</p>
        </div>

        <div className="space-y-4 flex-1">
          <div className="vintage-border bg-paper-cream p-5 rotate-[-0.5deg]">
            <div className="font-condensed text-lg tracking-widest text-ink/55">如 BOOK OFF</div>
            <div className="font-display text-3xl font-black mb-3">日本标准化中古店</div>
            <div className="grid grid-cols-2 gap-2">
              {["明码标价", "标准陈列", "可复制"].map(t => (
                <div key={t} className="flex items-center gap-1.5 font-body text-xl"><Check className="w-5 h-5 text-boomer-red" strokeWidth={3} />{t}</div>
              ))}
              {["缺氛围", "情绪低"].map(t => (
                <div key={t} className="flex items-center gap-1.5 font-body text-xl text-ink/45"><X className="w-5 h-5" strokeWidth={3} />{t}</div>
              ))}
            </div>
          </div>

          <div className="vintage-border bg-boomer-red text-paper-cream p-6 shadow-2xl">
            <div className="font-condensed text-lg tracking-widest text-paper-cream/85 text-center">BOOMER OFF</div>
            <div className="font-display text-4xl font-black text-center mb-4">融合模式 ★</div>
            <div className="grid grid-cols-2 gap-2">
              {["标准化 + 层次感", "透明定价 + 评级", "沉浸声光 + IP", "6.9 元起", "可复制可加盟"].map(t => (
                <div key={t} className="flex items-center gap-1.5 font-body text-xl font-bold"><Check className="w-5 h-5" strokeWidth={3} />{t}</div>
              ))}
            </div>
          </div>

          <div className="vintage-border bg-paper-cream p-5 rotate-[0.5deg]">
            <div className="font-condensed text-lg tracking-widest text-ink/55">主理人审美</div>
            <div className="font-display text-3xl font-black mb-3">街边设计师店</div>
            <div className="grid grid-cols-2 gap-2">
              {["设计感强", "氛围出片"].map(t => (
                <div key={t} className="flex items-center gap-1.5 font-body text-xl"><Check className="w-5 h-5 text-boomer-red" strokeWidth={3} />{t}</div>
              ))}
              {["定价不透明", "依赖主理人"].map(t => (
                <div key={t} className="flex items-center gap-1.5 font-body text-xl text-ink/45"><X className="w-5 h-5" strokeWidth={3} />{t}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SlideShellPortrait>
  );
}

/* ============ 11. 品牌故事 ============ */
export function P_Story({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  return (
    <SlideShellPortrait pageNumber={pageNumber} totalPages={totalPages} variant="cream" chapter="02 · 品牌定位">
      <div className="absolute inset-0 flex flex-col">
        <div className="bg-boomer-red text-paper-cream p-12 pt-44 flex-1 relative overflow-hidden">
          <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] dots-pattern-cream opacity-25" />
          <span className="font-handwrite text-3xl text-paper-cream/90">Brand Story</span>
          <h1 className="font-display text-7xl font-black mt-3 leading-tight">
            一个<br/>
            <span className="font-handwrite text-8xl">时间</span><br/>
            收容所
          </h1>
          <p className="font-display text-2xl mt-6 leading-relaxed">
            让都市白领下班后<br/>
            可以「<span className="font-handwrite text-3xl text-vintage-gold">合法浪费时间</span>」<br/>
            的治愈系避风港
          </p>
        </div>

        <div className="bg-paper-cream p-12 pb-32">
          <p className="font-body text-2xl leading-relaxed text-ink/85 mb-4">
            <span className="font-display font-black text-boomer-red">BOOMER OFF</span> 诞生于这样一个洞察 ——
            我们需要的不是更多新商品，而是<span className="highlight-yellow font-bold">带有时间温度的「旧物」</span>。
          </p>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="border-l-[6px] border-boomer-red pl-4">
              <div className="font-handwrite text-2xl text-boomer-red">Slogan</div>
              <div className="font-display text-2xl font-black">虽古但新</div>
            </div>
            <div className="border-l-[6px] border-vintage-gold pl-4">
              <div className="font-handwrite text-2xl text-vintage-gold">Model</div>
              <div className="font-display text-2xl font-black">标准 × 氛围</div>
            </div>
          </div>
        </div>
      </div>
    </SlideShellPortrait>
  );
}

/* ============ 12. 用户画像 ============ */
export function P_Persona({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  const personas = [
    { age: "儿童", icon: "🧸", pref: "玩具 IP", case: "童年宝藏" },
    { age: "青少年", icon: "🎒", pref: "毛绒 · 二次元", case: "黑胶唱片" },
    { age: "都市白领", icon: "📷", pref: "CCD · 配饰", case: "瓷器收藏" },
    { age: "中年群体", icon: "🎵", pref: "黑胶 · 铁壶", case: "亲子同行" },
    { age: "老年群体", icon: "🍵", pref: "瓷器 · 线香", case: "毛绒玩具" },
  ];
  return (
    <SlideShellPortrait pageNumber={pageNumber} totalPages={totalPages} variant="paper" chapter="02 · 品牌定位">
      <div className="absolute inset-0 px-12 pt-36 pb-28 flex flex-col">
        <span className="font-handwrite text-3xl text-boomer-red">Target Audience</span>
        <h1 className="font-display text-5xl font-black mt-1 mb-2 leading-tight">
          覆盖<span className="text-boomer-red">全年龄段</span>
        </h1>
        <p className="font-body text-xl text-ink/65 mb-6">从 3 岁到 90 岁</p>

        <div className="grid grid-cols-2 gap-3 flex-1">
          {personas.map((p, i) => (
            <div key={p.age} className={`vintage-border p-4 bg-paper-cream flex flex-col ${i % 2 === 0 ? "rotate-[-0.5deg]" : "rotate-[0.5deg]"}`}>
              <div className="text-5xl mb-2 leading-none">{p.icon}</div>
              <div className="font-display text-3xl font-black text-boomer-red mb-1">{p.age}</div>
              <div className="font-body text-lg text-ink/85 mb-2">{p.pref}</div>
              <div className="border-t-2 border-dashed border-ink/25 pt-2 mt-auto">
                <div className="font-handwrite text-lg text-boomer-red">案例:</div>
                <div className="font-body text-base text-ink/75">{p.case}</div>
              </div>
            </div>
          ))}
          <div className="vintage-border p-4 bg-vintage-gold flex flex-col items-center justify-center text-center">
            <div className="text-5xl mb-2">👨‍👩‍👧</div>
            <div className="font-display text-2xl font-black">全 家 同 行</div>
            <div className="font-body text-base mt-2">每个人都能找到回忆</div>
          </div>
        </div>
      </div>
    </SlideShellPortrait>
  );
}

/* ============ 13. 蓝海赛道 ============ */
export function P_Market({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  return (
    <SlideShellPortrait pageNumber={pageNumber} totalPages={totalPages} variant="paper" chapter="03 · 市场机遇">
      <div className="absolute inset-0 px-12 pt-36 pb-28 flex flex-col">
        <span className="font-handwrite text-3xl text-boomer-red">Blue Ocean</span>
        <h1 className="font-display text-6xl font-black mt-1 mb-2 leading-tight">
          万亿级市场的<br/><span className="text-boomer-red">线下空白</span>
        </h1>
        <p className="font-body text-xl text-ink/75 mb-6 leading-relaxed">
          线上发展迅速，线下仍以非标店为主，<span className="highlight-red font-bold">缺乏标准化平价中古连锁</span>
        </p>

        <div className="bg-boomer-red text-paper-cream vintage-border p-8 mb-5 relative rotate-[-0.5deg]">
          <div className="font-handwrite text-2xl mb-2">2024 中国二手交易额</div>
          <div className="mega-number text-9xl leading-none">1.69<span className="text-4xl ml-2">万亿</span></div>
          <div className="font-display text-2xl mt-3">同比增长 +28%</div>
          <div className="absolute top-6 right-6 bg-vintage-gold text-ink px-4 py-2 font-display text-2xl font-black rotate-6">↑28%</div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-auto">
          <div className="bg-vintage-gold vintage-border p-5 rotate-[-1deg]">
            <div className="font-handwrite text-xl mb-1">主力人群</div>
            <div className="font-display text-3xl font-black">00 后<br/>+ 90 后</div>
          </div>
          <div className="bg-paper-cream vintage-border p-5 rotate-[1deg]">
            <div className="font-handwrite text-xl text-boomer-red mb-1">线下空白</div>
            <div className="font-display text-3xl font-black">标准化<br/>平价店</div>
          </div>
        </div>
      </div>
    </SlideShellPortrait>
  );
}

/* ============ 14. 对标日本 ============ */
export function P_Japan({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  return (
    <SlideShellPortrait pageNumber={pageNumber} totalPages={totalPages} variant="cream" chapter="03 · 市场机遇">
      <div className="absolute inset-0 px-12 pt-36 pb-28 flex flex-col">
        <span className="font-handwrite text-3xl text-boomer-red">Benchmark: Japan</span>
        <h1 className="font-display text-6xl font-black mt-1 mb-6 leading-tight">
          对标<span className="text-boomer-red">日本 Reuse</span>
        </h1>

        <div className="vintage-border bg-paper-cream p-7 mb-4 rotate-[-0.5deg] relative overflow-hidden">
          <div className="absolute -bottom-10 -right-10 w-72 h-72 dots-pattern-red opacity-25" />
          <Recycle className="w-14 h-14 text-boomer-red mb-2" strokeWidth={2.5} />
          <div className="font-handwrite text-2xl text-ink/65">市场规模</div>
          <div className="mega-number text-9xl text-boomer-red leading-none">3.5<span className="text-4xl ml-2">万亿</span></div>
          <div className="font-display text-2xl font-black mt-1">日 元</div>
          <div className="font-body text-lg text-ink/65 mt-1">≈ 1,700 亿人民币</div>
        </div>

        <div className="bg-vintage-gold vintage-border p-6 mb-4 flex items-center justify-between rotate-[1deg]">
          <div>
            <TrendingUp className="w-12 h-12 text-boomer-red mb-1" strokeWidth={2.5} />
            <div className="font-handwrite text-xl">增长态势</div>
            <div className="font-display text-3xl font-black">持续增长</div>
          </div>
          <div className="text-right">
            <div className="mega-number text-7xl text-boomer-red leading-none">15<span className="text-2xl">年</span></div>
          </div>
        </div>

        <div className="bg-boomer-red text-paper-cream vintage-border p-6 flex items-center justify-between rotate-[-1deg]">
          <div>
            <Users className="w-12 h-12 mb-1" strokeWidth={2.5} />
            <div className="font-handwrite text-xl">国民渗透</div>
            <div className="font-display text-3xl font-black">购买二手</div>
          </div>
          <div className="text-right">
            <div className="mega-number text-7xl leading-none">44.1<span className="text-2xl">%</span></div>
          </div>
        </div>
      </div>
    </SlideShellPortrait>
  );
}

/* ============ 16. 空间概念 ============ */
export function P_Space({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  return (
    <SlideShellPortrait pageNumber={pageNumber} totalPages={totalPages} variant="paper" chapter="04 · 商业模式">
      <div className="absolute inset-0 px-12 pt-36 pb-28 flex flex-col">
        <div className="flex items-end justify-between mb-4">
          <div>
            <span className="font-handwrite text-3xl text-boomer-red">Space Concept</span>
            <h1 className="font-display text-5xl font-black leading-tight">超高密度 × 寻宝</h1>
          </div>
          <div className="text-right">
            <div className="mega-number text-5xl text-boomer-red leading-none">10K+</div>
            <div className="font-body text-lg text-ink/65">SKU</div>
          </div>
        </div>

        <div className="vintage-border bg-paper-cream overflow-hidden mb-3">
          <div className="bg-boomer-red text-paper-cream p-5">
            <div className="font-handwrite text-2xl text-paper-cream/85">Upper Floor · 01</div>
            <div className="font-display text-4xl font-black">上层 · 精品区</div>
          </div>
          <img src={photoCeramics} alt="精品" className="w-full h-[280px] object-cover" />
          <div className="p-5">
            <div className="font-display text-2xl font-bold mb-2">高价值精选</div>
            <div className="flex flex-wrap gap-2">
              {["绝版手办", "复古相机", "品牌瓷器", "中古腕表", "黑胶机"].map(t => (
                <span key={t} className="px-3 py-1.5 bg-boomer-red text-paper-cream font-display text-lg font-bold">{t}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="relative h-3 my-1">
          <div className="absolute inset-0 dots-pattern-red opacity-60" />
        </div>

        <div className="vintage-border-red bg-vintage-gold p-5 flex-1">
          <div className="font-handwrite text-2xl text-ink/70">Lower Floor · 02</div>
          <div className="font-display text-4xl font-black">下层 · 翻筐乐</div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div>
              <div className="mega-number text-5xl text-boomer-red">100<span className="text-xl">+</span></div>
              <div className="font-body text-base text-ink/75">平价木筐</div>
            </div>
            <div>
              <div className="mega-number text-5xl text-boomer-red">¥6.9</div>
              <div className="font-body text-base text-ink/75">起售价</div>
            </div>
            <div>
              <div className="mega-number text-5xl text-boomer-red">∞</div>
              <div className="font-body text-base text-ink/75">寻宝乐趣</div>
            </div>
          </div>
          <p className="font-body text-lg text-ink/80 mt-3 leading-snug">
            "逛不完"驱动停留 <span className="font-bold text-boomer-red">45-90 分钟</span>
          </p>
        </div>
      </div>
    </SlideShellPortrait>
  );
}

/* ============ 17. 空间体验四元素 ============ */
export function P_Experience({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  const items = [
    { icon: Disc3, title: "Diatone 唱片机", desc: "昭和经典歌曲，视听共振穿越感", photo: photoVinyl, color: "bg-paper-cream" },
    { icon: Gamepad2, title: "巨型 Gameboy", desc: "可实操，跨年龄回忆杀打卡", photo: photoUltraman, color: "bg-vintage-gold" },
    { icon: Sparkles, title: "佐藤象店头", desc: "经典橘色，无声招牌合影点", photo: photoSato, color: "bg-boomer-red text-paper-cream" },
    { icon: Gift, title: "DIY 互动区", desc: "免费冰箱贴，月均 1K+ 收藏", photo: photoDIY, color: "bg-paper-warm" },
  ];
  return (
    <SlideShellPortrait pageNumber={pageNumber} totalPages={totalPages} variant="paper" chapter="04 · 商业模式">
      <div className="absolute inset-0 px-12 pt-36 pb-28 flex flex-col">
        <span className="font-handwrite text-3xl text-boomer-red">Experience Design</span>
        <h1 className="font-display text-5xl font-black mt-1 mb-5 leading-tight">
          四大<span className="text-boomer-red">沉浸体验</span>
        </h1>

        <div className="space-y-4 flex-1">
          {items.map((it, i) => (
            <div key={it.title} className={`vintage-border ${it.color} overflow-hidden flex ${i % 2 === 0 ? "rotate-[-0.5deg]" : "rotate-[0.5deg]"}`}>
              <img src={it.photo} alt={it.title} className="w-[200px] h-[180px] object-cover flex-shrink-0" />
              <div className="p-4 flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <it.icon className="w-8 h-8" strokeWidth={2.5} />
                  <div className="font-display text-2xl font-black">{it.title}</div>
                </div>
                <div className="font-body text-lg leading-snug opacity-90">{it.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideShellPortrait>
  );
}

/* ============ 18. 四大品类 ============ */
export function P_Categories({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  const cats = [
    { icon: Package, name: "玩具动漫", photo: photoUltraman, items: ["不二家", "三丽鸥", "奥特曼", "假面骑士"] },
    { icon: Coffee, name: "家居日用", photo: photoTeapot, items: ["日式餐具", "中古线香", "丝巾手帕", "玻璃器皿"] },
    { icon: Award, name: "首饰配饰", photo: photoPikachu, items: ["中古项链", "复古腕表", "经典徽章", "古着配饰"] },
    { icon: Headphones, name: "数码音像", photo: photoVinyl, items: ["黑胶唱片", "随身听", "CCD 相机", "复古游戏机"] },
  ];
  return (
    <SlideShellPortrait pageNumber={pageNumber} totalPages={totalPages} variant="cream" chapter="04 · 商业模式">
      <div className="absolute inset-0 px-12 pt-36 pb-28 flex flex-col">
        <span className="font-handwrite text-3xl text-boomer-red">Four Categories</span>
        <h1 className="font-display text-5xl font-black mt-1 mb-5 leading-tight">
          覆盖<span className="text-boomer-red">半个世纪</span>宝藏
        </h1>

        <div className="grid grid-cols-2 gap-3 flex-1">
          {cats.map((c, i) => (
            <div key={c.name} className={`vintage-border bg-paper-cream overflow-hidden flex flex-col ${i % 2 === 0 ? "rotate-[-0.5deg]" : "rotate-[0.5deg]"}`}>
              <div className="relative aspect-square">
                <img src={c.photo} alt={c.name} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute top-3 right-3 bg-boomer-red text-paper-cream w-12 h-12 rounded-full flex items-center justify-center">
                  <c.icon className="w-6 h-6" strokeWidth={2.5} />
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="font-display text-3xl font-black mb-2 text-boomer-red">{c.name}</div>
                <ul className="space-y-1">
                  {c.items.map((it) => (
                    <li key={it} className="font-body text-lg text-ink/85 flex items-start gap-1">
                      <ChevronRight className="w-4 h-4 text-boomer-red mt-1.5 flex-shrink-0" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideShellPortrait>
  );
}

/* ============ 19. 翻筐乐 ============ */
export function P_FlipperFun({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  return (
    <SlideShellPortrait pageNumber={pageNumber} totalPages={totalPages} variant="red" chapter="04 · 商业模式">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-32 dots-pattern-cream opacity-30" />
      </div>
      <div className="absolute inset-0 px-12 pt-36 pb-28 flex flex-col">
        <span className="font-handwrite text-3xl text-paper-cream/90">— Killer Sub-brand —</span>
        <h1 className="font-display text-8xl font-black text-paper-cream mt-2 leading-none">翻 筐 乐</h1>
        <div className="font-en text-4xl text-paper-cream/75 mb-6">FLIPPER FUN</div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-paper-cream text-ink vintage-border-soft p-4 text-center rotate-[-1deg]">
            <div className="font-handwrite text-lg text-boomer-red">起售</div>
            <div className="mega-number text-5xl text-boomer-red">¥6.9</div>
          </div>
          <div className="bg-vintage-gold text-ink vintage-border-soft p-4 text-center rotate-[1deg]">
            <div className="font-handwrite text-lg text-boomer-red">停留</div>
            <div className="mega-number text-5xl text-boomer-red">45<span className="text-2xl">'</span></div>
          </div>
          <div className="bg-paper-cream text-ink vintage-border-soft p-4 text-center rotate-[-1deg]">
            <div className="font-handwrite text-lg text-boomer-red">UGC</div>
            <div className="mega-number text-5xl text-boomer-red">∞</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 flex-1 mb-4">
          <img src={photoCups} alt="" className="w-full h-full object-cover photo-vintage rotate-[2deg]" />
          <img src={photoPikachu} alt="" className="w-full h-full object-cover photo-vintage rotate-[-2deg]" />
        </div>

        <div className="bg-paper-cream text-ink p-4 vintage-border-soft">
          <p className="font-display text-xl leading-snug">
            <Quote className="inline w-5 h-5 text-boomer-red mr-1" />
            统一低价 + 自由翻找，
            <span className="text-boomer-red font-black highlight-yellow">UGC 内容引爆</span>
          </p>
        </div>
      </div>
    </SlideShellPortrait>
  );
}

/* ============ 20. VERITAS-CHAIN ============ */
export function P_Veritas({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  const steps = ["收购", "鉴定", "清洗", "评级", "上链", "包装"];
  return (
    <SlideShellPortrait pageNumber={pageNumber} totalPages={totalPages} variant="paper" chapter="05 · BOVAS">
      <div className="absolute inset-0 px-12 pt-36 pb-28 flex flex-col">
        <div className="flex items-baseline justify-between mb-2">
          <div>
            <span className="font-handwrite text-3xl text-boomer-red">BOVAS · Part 1</span>
            <h1 className="font-display text-5xl font-black mt-1 leading-tight">VERITAS-CHAIN</h1>
            <p className="font-display text-3xl text-boomer-red mt-1">区块链溯源</p>
          </div>
          <div className="stamp-red text-2xl">开发中</div>
        </div>
        <p className="font-body text-xl text-ink/70 mb-5">每件高价商品配 NFC 红色吊牌</p>

        <div className="bg-paper-cream vintage-border p-5 mb-4">
          <div className="grid grid-cols-3 gap-3">
            {steps.map((s, i) => (
              <div key={s} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-boomer-red text-paper-cream flex items-center justify-center font-en text-2xl mb-1">{i+1}</div>
                <div className="font-display text-lg font-bold">{s}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 flex-1">
          <div className="bg-vintage-gold p-5 vintage-border rotate-[-0.5deg]">
            <Shield className="w-10 h-10 text-boomer-red mb-2" strokeWidth={2.5} />
            <div className="font-display text-2xl font-black">NFC 红色吊牌</div>
            <div className="font-body text-lg text-ink/80">扫码查看商品「前世今生」</div>
          </div>
          <div className="bg-paper-cream p-5 vintage-border">
            <BadgeCheck className="w-10 h-10 text-boomer-red mb-2" strokeWidth={2.5} />
            <div className="font-display text-2xl font-black">全流程视频</div>
            <div className="font-body text-lg text-ink/75">鉴定到包装上链可追溯</div>
          </div>
          <div className="bg-boomer-red text-paper-cream p-5 vintage-border rotate-[0.5deg]">
            <Sparkles className="w-10 h-10 mb-2" strokeWidth={2.5} />
            <div className="font-display text-2xl font-black">行业开创性</div>
            <div className="font-body text-lg text-paper-cream/90">消除来源与品质疑虑</div>
          </div>
        </div>
      </div>
    </SlideShellPortrait>
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
    { g: "J", name: "Junk", desc: "战损配件", color: "bg-paper-sand" },
  ];
  return (
    <SlideShellPortrait pageNumber={pageNumber} totalPages={totalPages} variant="cream" chapter="05 · BOVAS">
      <div className="absolute inset-0 px-12 pt-36 pb-28 flex flex-col">
        <div className="flex items-baseline justify-between mb-2">
          <div>
            <span className="font-handwrite text-3xl text-boomer-red">BOVAS · Part 2</span>
            <h1 className="font-display text-5xl font-black mt-1 leading-tight">AESTHETICA</h1>
            <p className="font-display text-3xl text-boomer-red mt-1">6 级品相评级</p>
          </div>
          <div className="stamp-red text-2xl">开发中</div>
        </div>
        <p className="font-body text-xl text-ink/70 mb-5">日本最严苛评级 · 明码标价</p>

        <div className="grid grid-cols-2 gap-3 flex-1">
          {grades.map((g, i) => (
            <div key={g.g} className={`vintage-border ${g.color} p-4 flex items-center gap-4 ${i % 2 === 0 ? "rotate-[-1deg]" : "rotate-[1deg]"}`}>
              <div className="font-en text-7xl leading-none">{g.g}</div>
              <div>
                <div className="font-condensed text-base tracking-wider opacity-80">{g.name}</div>
                <div className="font-display text-xl font-bold">{g.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 bg-boomer-red text-paper-cream p-5 vintage-border">
          <p className="font-display text-xl text-center leading-snug">
            从源头到终端的<span className="font-handwrite text-2xl text-vintage-gold">全链路信任机制</span>
          </p>
        </div>
      </div>
    </SlideShellPortrait>
  );
}

/* ============ 22. 四大核心价值 ============ */
export function P_Value({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  const values = [
    { icon: Users, num: "01", title: "高粘性目的客流", desc: "孤品 + 寻宝 = 高复购", color: "bg-paper-cream" },
    { icon: Zap, num: "02", title: "延长停留 · 连带消费", desc: "10K+ SKU + 互动，停留 45-90 分钟", color: "bg-vintage-gold" },
    { icon: TrendingUp, num: "03", title: "自发传播引擎", desc: "曝光 300 万+，零付费", color: "bg-boomer-red text-paper-cream" },
    { icon: Award, num: "04", title: "提升商圈调性", desc: "「招商终于有品位了」", color: "bg-vintage-coral text-paper-cream" },
  ];
  return (
    <SlideShellPortrait pageNumber={pageNumber} totalPages={totalPages} variant="paper" chapter="06 · 核心价值">
      <div className="absolute inset-0 px-12 pt-36 pb-28 flex flex-col">
        <span className="font-handwrite text-3xl text-boomer-red">Why BOOMER OFF</span>
        <h1 className="font-display text-6xl font-black mt-1 mb-6 leading-tight">
          四大<span className="text-boomer-red">核心价值</span>
        </h1>

        <div className="space-y-4 flex-1">
          {values.map((v, i) => (
            <div key={v.num} className={`vintage-border p-5 ${v.color} ${i % 2 === 0 ? "rotate-[-0.5deg]" : "rotate-[0.5deg]"} flex items-center gap-4`}>
              <v.icon className="w-12 h-12 flex-shrink-0" strokeWidth={2} />
              <div className="flex-1">
                <div className="font-display text-2xl font-black mb-1 leading-tight">{v.title}</div>
                <div className="font-body text-lg leading-snug opacity-85">{v.desc}</div>
              </div>
              <div className="font-en text-6xl opacity-30 leading-none">{v.num}</div>
            </div>
          ))}
        </div>
      </div>
    </SlideShellPortrait>
  );
}

/* ============ 23. 数据墙 ============ */
export function P_Wall({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  return (
    <SlideShellPortrait pageNumber={pageNumber} totalPages={totalPages} variant="warm" chapter="06 · 核心价值">
      <div className="absolute inset-0 px-12 pt-36 pb-28 flex flex-col">
        <span className="font-handwrite text-3xl text-boomer-red">Numbers Speak</span>
        <h1 className="font-display text-7xl font-black mt-1 mb-6 leading-tight">
          数 据 见 <span className="text-boomer-red">真 章</span>
        </h1>

        <div className="bg-boomer-red text-paper-cream vintage-border p-8 mb-4 rotate-[-0.5deg]">
          <div className="font-handwrite text-3xl">全网曝光</div>
          <div className="mega-number text-[10rem] leading-none">300<span className="text-5xl">万+</span></div>
          <div className="font-display text-2xl mt-2">零付费 · 自然传播</div>
        </div>

        <div className="grid grid-cols-2 gap-3 flex-1">
          <div className="bg-paper-cream vintage-border-red p-5 flex flex-col justify-between rotate-[1deg]">
            <div className="font-handwrite text-xl text-boomer-red">累计客流</div>
            <div className="mega-number text-6xl text-boomer-red">10<span className="text-2xl">万+</span></div>
          </div>
          <div className="bg-vintage-gold vintage-border-red p-5 flex flex-col justify-between rotate-[-1deg]">
            <div className="font-handwrite text-xl">单店 SKU</div>
            <div className="mega-number text-6xl">10K<span className="text-2xl">+</span></div>
          </div>
          <div className="bg-paper-cream vintage-border-red p-5 flex flex-col justify-between rotate-[-1deg]">
            <div className="font-handwrite text-xl text-boomer-red">起售价</div>
            <div className="mega-number text-6xl text-boomer-red">¥6.9</div>
          </div>
          <div className="bg-vintage-coral text-paper-cream vintage-border-red p-5 flex flex-col justify-between rotate-[1deg]">
            <div className="font-handwrite text-xl">月均打卡</div>
            <div className="mega-number text-6xl">1K<span className="text-2xl">+</span></div>
          </div>
        </div>
      </div>
    </SlideShellPortrait>
  );
}

/* ============ 24. 合作条件 ============ */
export function P_Cooperation({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  const conds = [
    { label: "目标面积", value: "80-100 ㎡", icon: Store, color: "bg-paper-cream" },
    { label: "楼层", value: "B1 / 1F", icon: Building2, sub: "高人流楼层", color: "bg-vintage-gold" },
    { label: "铺位", value: "需基础装修", icon: HomeIcon, sub: "暂不接受毛胚", color: "bg-paper-cream" },
    { label: "工程", value: "用电+网络", icon: Zap, sub: "无特殊上下水", color: "bg-vintage-coral text-paper-cream" },
    { label: "合作", value: "销售额扣点", icon: BadgeCheck, sub: "按月结算", color: "bg-boomer-red text-paper-cream" },
  ];
  return (
    <SlideShellPortrait pageNumber={pageNumber} totalPages={totalPages} variant="cream" chapter="07 · 合作">
      <div className="absolute inset-0 px-12 pt-36 pb-28 flex flex-col">
        <span className="font-handwrite text-3xl text-boomer-red">Partnership</span>
        <h1 className="font-display text-5xl font-black mt-1 mb-5 leading-tight">
          标准店 <span className="text-boomer-red">Vintage</span><br/>合作条件
        </h1>

        <div className="space-y-3 flex-1">
          {conds.map((c, i) => (
            <div key={c.label} className={`vintage-border p-4 ${c.color} flex items-center gap-4 ${i % 2 === 0 ? "rotate-[-0.5deg]" : "rotate-[0.5deg]"}`}>
              <c.icon className="w-12 h-12 flex-shrink-0" strokeWidth={2.5} />
              <div className="flex-1">
                <div className="font-handwrite text-xl opacity-70">{c.label}</div>
                <div className="font-display text-2xl font-black">{c.value}</div>
                {c.sub && <div className="font-body text-base opacity-75">{c.sub}</div>}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-boomer-red text-paper-cream p-5 vintage-border mt-4">
          <p className="font-display text-xl leading-snug">
            <span className="highlight-yellow text-ink font-black">高频次 · 高粘性</span>流量业态，
            <span className="font-handwrite text-2xl text-vintage-gold">销售越好收益越高</span>
          </p>
        </div>
      </div>
    </SlideShellPortrait>
  );
}

/* ============ 26. 七大店型 上 ============ */
export function P_Matrix1({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  const stores = [
    { name: "Vintage", icon: Store, area: "80-100㎡", tag: "标准商场店", desc: "全品类中古杂货铺，已验证流量模型", main: true },
    { name: "Home", icon: HomeIcon, area: "80-150㎡", tag: "家居垂直", desc: "瓷器、家具、线香等家居二手" },
    { name: "Hobby", icon: Gamepad2, area: "80-150㎡", tag: "兴趣爱好", desc: "玩具、手办、二次元、黑胶" },
    { name: "Collection", icon: ShoppingBag, area: "80-200㎡", tag: "高端二奢", desc: "一线高端商场，时尚收藏品" },
  ];
  return (
    <SlideShellPortrait pageNumber={pageNumber} totalPages={totalPages} variant="paper" chapter="08 · 矩阵">
      <div className="absolute inset-0 px-12 pt-36 pb-28 flex flex-col">
        <span className="font-handwrite text-3xl text-boomer-red">Brand Matrix · 1/2</span>
        <h1 className="font-display text-5xl font-black mt-1 mb-5 leading-tight">
          七大店型 <span className="text-boomer-red">[ 上 ]</span>
        </h1>

        <div className="grid grid-cols-2 gap-3 flex-1">
          {stores.map((s, i) => (
            <div key={s.name} className={`vintage-border p-5 ${s.main ? "bg-boomer-red text-paper-cream" : "bg-paper-cream"} flex flex-col ${i % 2 === 0 ? "rotate-[-0.5deg]" : "rotate-[0.5deg]"}`}>
              <s.icon className={`w-10 h-10 ${s.main ? "text-paper-cream" : "text-boomer-red"} mb-2`} strokeWidth={2.5} />
              <div className="font-en text-4xl leading-none">{s.name}</div>
              <div className={`font-display text-xl font-bold mt-2 ${s.main ? "text-paper-cream" : "text-boomer-red"}`}>{s.tag}</div>
              <div className={`font-body text-base mt-1 font-bold ${s.main ? "text-paper-cream/90" : "text-ink/75"}`}>{s.area}</div>
              <div className={`font-body text-sm leading-snug mt-2 ${s.main ? "text-paper-cream/85" : "text-ink/70"} flex-1`}>{s.desc}</div>
              {s.main && <div className="mt-2 inline-block bg-vintage-gold text-ink px-2 py-0.5 font-display text-sm font-black w-fit">★ 核心</div>}
            </div>
          ))}
        </div>
      </div>
    </SlideShellPortrait>
  );
}

/* ============ 27. 七大店型 下 ============ */
export function P_Matrix2({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  const stores = [
    { name: "Digital", icon: Smartphone, area: "80-150㎡", tag: "数码家电", desc: "中古数码、二手家电、3C 配件", color: "bg-vintage-gold" },
    { name: "NB", icon: Coffee, area: "30-60㎡", tag: "Neighborhood 社区店", desc: "标准化二手交换/寄售，社区循环站", color: "bg-paper-cream" },
    { name: "Plus", icon: Warehouse, area: "1,000㎡+", tag: "大型特卖", desc: "郊区清仓出口，淘宝薅羊毛好去处", color: "bg-vintage-coral text-paper-cream" },
  ];
  return (
    <SlideShellPortrait pageNumber={pageNumber} totalPages={totalPages} variant="paper" chapter="08 · 矩阵">
      <div className="absolute inset-0 px-12 pt-36 pb-28 flex flex-col">
        <span className="font-handwrite text-3xl text-boomer-red">Brand Matrix · 2/2</span>
        <h1 className="font-display text-5xl font-black mt-1 mb-5 leading-tight">
          七大店型 <span className="text-boomer-red">[ 下 ]</span>
        </h1>

        <div className="space-y-3 flex-1">
          {stores.map((s, i) => (
            <div key={s.name} className={`vintage-border p-5 ${s.color} ${i % 2 === 0 ? "rotate-[-0.5deg]" : "rotate-[0.5deg]"}`}>
              <div className="flex items-start gap-4">
                <s.icon className="w-12 h-12 flex-shrink-0" strokeWidth={2.5} />
                <div className="flex-1">
                  <div className="font-en text-4xl leading-none">{s.name}</div>
                  <div className="font-display text-2xl font-bold mt-1">{s.tag}</div>
                  <div className="font-body text-lg mt-1 font-bold opacity-80">{s.area}</div>
                  <div className="font-body text-base leading-snug mt-2 opacity-80">{s.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-boomer-red text-paper-cream p-5 vintage-border mt-4">
          <p className="font-display text-lg leading-snug text-center">
            <span className="font-handwrite text-2xl text-vintage-gold">「核心商场 → 高端 → 垂直 → 数码 → 社区 → 郊区」</span>
          </p>
        </div>
      </div>
    </SlideShellPortrait>
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
    { stage: "郊区特卖", store: "Plus", color: "bg-boomer-red text-paper-cream" },
  ];
  return (
    <SlideShellPortrait pageNumber={pageNumber} totalPages={totalPages} variant="cream" chapter="08 · 矩阵">
      <div className="absolute inset-0 px-12 pt-36 pb-28 flex flex-col">
        <span className="font-handwrite text-3xl text-boomer-red">Growth Flywheel</span>
        <h1 className="font-display text-5xl font-black mt-1 mb-5 leading-tight">
          长期<span className="text-boomer-red">增长飞轮</span>
        </h1>

        <div className="grid grid-cols-2 gap-3 flex-1">
          {stages.map((s, i) => (
            <div key={s.stage} className={`vintage-border ${s.color} p-4 text-center ${i % 2 === 0 ? "rotate-[-1deg]" : "rotate-[1deg]"} flex flex-col justify-center`}>
              <div className="font-en text-4xl mb-1">{String(i+1).padStart(2,"0")}</div>
              <div className="font-display text-2xl font-black mb-1">{s.stage}</div>
              <div className="font-body text-base opacity-80 font-bold">{s.store}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="text-center">
            <div className="mega-number text-5xl text-boomer-red">7</div>
            <div className="font-display text-base font-bold">店型</div>
          </div>
          <div className="text-center">
            <div className="mega-number text-5xl text-boomer-red">∞</div>
            <div className="font-display text-base font-bold">城市</div>
          </div>
          <div className="text-center">
            <div className="mega-number text-5xl text-boomer-red">100%</div>
            <div className="font-display text-base font-bold">人群</div>
          </div>
        </div>
      </div>
    </SlideShellPortrait>
  );
}

/* ============ 29. 联系我们 ============ */
export function P_Contact({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  return (
    <SlideShellPortrait pageNumber={pageNumber} totalPages={totalPages} variant="paper" chapter="09 · 联系">
      <div className="absolute inset-0 px-12 pt-36 pb-28 flex flex-col">
        <span className="font-handwrite text-3xl text-boomer-red">Get in Touch</span>
        <h1 className="font-display text-6xl font-black mt-1 mb-6 leading-tight">
          期待与您<span className="text-boomer-red">携手同行</span>
        </h1>

        <div className="bg-vintage-gold vintage-border p-6 mb-4 rotate-[-1deg]">
          <div className="font-handwrite text-3xl text-boomer-red mb-3">— Company —</div>
          <div className="space-y-3">
            <div>
              <div className="font-condensed text-lg tracking-[0.2em] text-ink/65">公司名称</div>
              <div className="font-display text-2xl font-bold leading-snug">宝暮（上海）品牌管理有限公司</div>
            </div>
            <div>
              <div className="font-condensed text-lg tracking-[0.2em] text-ink/65">加盟体验中心</div>
              <div className="font-display text-xl font-bold leading-snug">上海市闵行区光华路 728 号<br/>728Space C5 栋 3 楼</div>
            </div>
          </div>
        </div>

        <div className="bg-boomer-red text-paper-cream vintage-border p-6 flex-1 rotate-[1deg]">
          <div className="font-handwrite text-3xl mb-3">— Contact —</div>
          <div className="grid grid-cols-[1fr_auto] gap-4 items-center h-full">
            <div className="space-y-3">
              <div>
                <div className="font-condensed text-lg tracking-[0.2em] text-paper-cream/85">联系人</div>
                <div className="font-display text-4xl font-black">潘 瞻 远</div>
              </div>
              <div>
                <div className="font-condensed text-lg tracking-[0.2em] text-paper-cream/85">联系电话</div>
                <div className="font-en text-3xl flex items-center gap-2">
                  <Phone className="w-7 h-7" strokeWidth={2.5} />
                  186 5743 3310
                </div>
              </div>
              <div className="pt-2 border-t-2 border-paper-cream/40">
                <div className="font-handwrite text-2xl">欢迎招商 · 加盟</div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="bg-paper-cream/10 border-2 border-paper-cream/60 p-2">
                <img src={wechatQR} alt="WeChat" className="w-32 h-32 object-contain" />
              </div>
              <div className="font-handwrite text-base text-paper-cream/90">Scan</div>
            </div>
          </div>
        </div>
      </div>
    </SlideShellPortrait>
  );
}

/* ============ 30. 门店地址 ============ */
export function P_Stores({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  return (
    <SlideShellPortrait pageNumber={pageNumber} totalPages={totalPages} variant="cream" chapter="09 · 联系">
      <div className="absolute inset-0 px-12 pt-36 pb-28 flex flex-col">
        <span className="font-handwrite text-3xl text-boomer-red">Our Stores</span>
        <h1 className="font-display text-6xl font-black mt-1 mb-6 leading-tight">门 店 地 址</h1>

        <div className="bg-paper-cream vintage-border p-6 mb-4 rotate-[-0.5deg]">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <MapPin className="w-12 h-12 text-boomer-red" strokeWidth={2} />
            <span className="bg-boomer-red text-paper-cream px-3 py-1 font-display text-xl font-bold">营业中</span>
          </div>
          <div className="font-display text-3xl font-black mb-2">中信泰富店</div>
          <div className="font-body text-xl text-ink/80 font-bold mb-3">
            上海市静安区南京西路 1168 号<br/>中信泰富广场 B1 层
          </div>
          <div className="space-y-1 font-handwrite text-2xl text-boomer-red">
            <div>★ 南京西路商圈 No.1</div>
            <div>★ 静安区 No.1 · 全上海 No.5</div>
          </div>
        </div>

        <div className="bg-vintage-gold vintage-border-red p-6 mb-4 rotate-[0.5deg]">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-12 h-12 text-boomer-red" strokeWidth={2} />
            <span className="bg-boomer-red text-paper-cream px-3 py-1 font-display text-xl font-bold">筹备中</span>
          </div>
          <div className="font-display text-3xl font-black mb-2">更多门店</div>
          <div className="font-body text-xl text-ink/80 font-bold">敬请期待 · 与您共同复制成功</div>
        </div>

        <div className="bg-boomer-red text-paper-cream p-5 vintage-border text-center mt-auto">
          <p className="font-display text-xl">
            正在寻找<span className="font-handwrite text-2xl text-vintage-gold mx-1">志同道合</span>的合作伙伴
          </p>
        </div>
      </div>
    </SlideShellPortrait>
  );
}
