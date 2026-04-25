import { ScaledSlide } from "./ScaledSlide";
import {
  Slide01Cover, Slide02TOC, Slide03Executive, SlideChapter,
  Slide05Traffic, Slide06Media, Slide07Keywords, Slide08Engine,
  Slide10Problem, Slide11Story, Slide12Persona,
  Slide13Market, Slide14Japan,
  Slide16Space, Slide17Experience, Slide18Categories, Slide19FlipperFun,
  Slide20Veritas, Slide21Aesthetica,
  Slide22Value, Slide23Wall,
  Slide24Cooperation,
  Slide26Matrix1, Slide27Matrix2, Slide28Flywheel,
  Slide29Contact, Slide30Stores, Slide31Slogan, Slide32Thanks,
} from "./AllSlides";

export interface SlideMeta {
  id: string;
  title: string;
  chapter: string;
  render: (props: { pageNumber: number; totalPages: number }) => JSX.Element;
}

export const SLIDES: SlideMeta[] = [
  { id: "cover", title: "封面", chapter: "00", render: () => <Slide01Cover /> },
  { id: "toc", title: "目录", chapter: "00", render: (p) => <Slide02TOC {...p} /> },
  { id: "exec", title: "核心摘要", chapter: "00", render: (p) => <Slide03Executive {...p} /> },

  { id: "ch1", title: "第一章 · 市场表现", chapter: "01", render: (p) => (
    <SlideChapter {...p} num="01" en="MARKET PROOF" title="已验证的市场表现"
      desc="中信泰富首店实绩 · 零投放的自然流量奇迹 · 媒体背书 · 用户口碑" />
  )},
  { id: "traffic", title: "自然流量奇迹", chapter: "01", render: (p) => <Slide05Traffic {...p} /> },
  { id: "media", title: "SmartShanghai 报道", chapter: "01", render: (p) => <Slide06Media {...p} /> },
  { id: "keywords", title: "用户评价关键词", chapter: "01", render: (p) => <Slide07Keywords {...p} /> },
  { id: "engine", title: "内容生产机器", chapter: "01", render: (p) => <Slide08Engine {...p} /> },

  { id: "ch2", title: "第二章 · 品牌定位", chapter: "02", render: (p) => (
    <SlideChapter {...p} num="02" en="WHO WE ARE" title="品牌定位与愿景"
      desc="解决两种中古店模式的痛点 · 品牌故事 · 全年龄段用户画像" />
  )},
  { id: "problem", title: "解决的问题", chapter: "02", render: (p) => <Slide10Problem {...p} /> },
  { id: "story", title: "品牌故事", chapter: "02", render: (p) => <Slide11Story {...p} /> },
  { id: "persona", title: "用户画像", chapter: "02", render: (p) => <Slide12Persona {...p} /> },

  { id: "ch3", title: "第三章 · 市场机遇", chapter: "03", render: (p) => (
    <SlideChapter {...p} num="03" en="MARKET OPPORTUNITY" title="市场机遇与赛道分析"
      desc="万亿级蓝海赛道 · 对标日本 3.5 万亿日元 Reuse 市场" />
  )},
  { id: "market", title: "蓝海赛道", chapter: "03", render: (p) => <Slide13Market {...p} /> },
  { id: "japan", title: "对标日本", chapter: "03", render: (p) => <Slide14Japan {...p} /> },

  { id: "ch4", title: "第四章 · 商业模式", chapter: "04", render: (p) => (
    <SlideChapter {...p} num="04" en="BUSINESS MODEL" title="核心商业模式与空间规划"
      desc="超高密度陈列 · 沉浸式体验设计 · 四大核心品类 · 翻筐乐杀手锏" />
  )},
  { id: "space", title: "空间概念", chapter: "04", render: (p) => <Slide16Space {...p} /> },
  { id: "experience", title: "空间体验设计", chapter: "04", render: (p) => <Slide17Experience {...p} /> },
  { id: "categories", title: "四大核心品类", chapter: "04", render: (p) => <Slide18Categories {...p} /> },
  { id: "flipper", title: "翻筐乐", chapter: "04", render: (p) => <Slide19FlipperFun {...p} /> },

  { id: "ch5", title: "第五章 · BOVAS 体系", chapter: "05", render: (p) => (
    <SlideChapter {...p} num="05" en="TRUST SYSTEM" title="核心壁垒：BOVAS 信任体系"
      desc="VERITAS-CHAIN 区块链溯源 · AESTHETICA 6 级品相评级（开发中）" />
  )},
  { id: "veritas", title: "区块链溯源", chapter: "05", render: (p) => <Slide20Veritas {...p} /> },
  { id: "aesthetica", title: "6 级品相评级", chapter: "05", render: (p) => <Slide21Aesthetica {...p} /> },

  { id: "ch6", title: "第六章 · 核心价值", chapter: "06", render: (p) => (
    <SlideChapter {...p} num="06" en="CORE VALUES" title="BOOMER OFF 的核心价值"
      desc="高粘性客流 · 延长停留 · 自发传播 · 提升商圈调性" />
  )},
  { id: "value", title: "四大核心价值", chapter: "06", render: (p) => <Slide22Value {...p} /> },
  { id: "wall", title: "数据见真章", chapter: "06", render: (p) => <Slide23Wall {...p} /> },

  { id: "coop", title: "合作条件", chapter: "07", render: (p) => <Slide24Cooperation {...p} /> },

  { id: "ch8", title: "第八章 · 品牌矩阵", chapter: "08", render: (p) => (
    <SlideChapter {...p} num="08" en="BRAND MATRIX" title="品牌矩阵与未来规划"
      desc="七大店型 · 完整布局 · 长期增长飞轮" />
  )},
  { id: "matrix1", title: "七大店型 [上]", chapter: "08", render: (p) => <Slide26Matrix1 {...p} /> },
  { id: "matrix2", title: "七大店型 [下]", chapter: "08", render: (p) => <Slide27Matrix2 {...p} /> },
  { id: "flywheel", title: "增长飞轮", chapter: "08", render: (p) => <Slide28Flywheel {...p} /> },

  { id: "stores", title: "门店地址", chapter: "09", render: (p) => <Slide30Stores {...p} /> },
  { id: "contact", title: "联系我们", chapter: "09", render: (p) => <Slide29Contact {...p} /> },
];

export function SlideRenderer({ index }: { index: number }) {
  const slide = SLIDES[index];
  if (!slide) return null;
  return (
    <ScaledSlide>
      {slide.render({ pageNumber: index + 1, totalPages: SLIDES.length })}
    </ScaledSlide>
  );
}

export function SlideStaticRenderer({ index }: { index: number }) {
  // 不带 ScaledSlide，用于导出 PDF/PPTX 时直接渲染 1920x1080
  const slide = SLIDES[index];
  if (!slide) return null;
  return slide.render({ pageNumber: index + 1, totalPages: SLIDES.length });
}
