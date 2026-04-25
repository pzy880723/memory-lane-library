import { ScaledSlide } from "./ScaledSlide";
import {
  P_Cover, P_TOC, P_Executive, P_Chapter,
  P_Traffic, P_Media, P_Keywords,
  P_Problem, P_Story, P_Persona,
  P_Market, P_Japan,
  P_Space, P_Experience, P_Categories, P_FlipperFun,
  P_Veritas, P_Aesthetica,
  P_Value, P_Wall,
  P_Cooperation,
  P_Matrix1, P_Matrix2, P_Flywheel,
  P_Stores, P_Contact,
} from "./AllSlidesPortrait";

export interface SlideMeta {
  id: string;
  title: string;
  chapter: string;
  render: (props: { pageNumber: number; totalPages: number }) => JSX.Element;
}

export const SLIDES_PORTRAIT: SlideMeta[] = [
  { id: "cover", title: "封面", chapter: "00", render: () => <P_Cover /> },
  { id: "toc", title: "目录", chapter: "00", render: (p) => <P_TOC {...p} /> },
  { id: "exec", title: "核心摘要", chapter: "00", render: (p) => <P_Executive {...p} /> },

  { id: "ch1", title: "第一章 · 市场表现", chapter: "01", render: (p) => (
    <P_Chapter {...p} num="01" en="MARKET PROOF" title="已验证的市场表现"
      desc="中信泰富首店实绩 · 零投放的自然流量奇迹 · 媒体背书 · 用户口碑" />
  )},
  { id: "traffic", title: "自然流量奇迹", chapter: "01", render: (p) => <P_Traffic {...p} /> },
  { id: "media", title: "SmartShanghai 报道", chapter: "01", render: (p) => <P_Media {...p} /> },
  { id: "keywords", title: "用户评价关键词", chapter: "01", render: (p) => <P_Keywords {...p} /> },

  { id: "ch2", title: "第二章 · 品牌定位", chapter: "02", render: (p) => (
    <P_Chapter {...p} num="02" en="WHO WE ARE" title="品牌定位与愿景"
      desc="解决两种中古店模式的痛点 · 品牌故事 · 全年龄段用户画像" />
  )},
  { id: "problem", title: "解决的问题", chapter: "02", render: (p) => <P_Problem {...p} /> },
  { id: "story", title: "品牌故事", chapter: "02", render: (p) => <P_Story {...p} /> },
  { id: "persona", title: "用户画像", chapter: "02", render: (p) => <P_Persona {...p} /> },

  { id: "ch3", title: "第三章 · 市场机遇", chapter: "03", render: (p) => (
    <P_Chapter {...p} num="03" en="MARKET OPPORTUNITY" title="市场机遇与赛道分析"
      desc="万亿级蓝海赛道 · 对标日本 3.5 万亿日元 Reuse 市场" />
  )},
  { id: "market", title: "蓝海赛道", chapter: "03", render: (p) => <P_Market {...p} /> },
  { id: "japan", title: "对标日本", chapter: "03", render: (p) => <P_Japan {...p} /> },

  { id: "ch4", title: "第四章 · 商业模式", chapter: "04", render: (p) => (
    <P_Chapter {...p} num="04" en="BUSINESS MODEL" title="核心商业模式与空间规划"
      desc="超高密度陈列 · 沉浸式体验设计 · 四大核心品类 · 翻筐乐杀手锏" />
  )},
  { id: "space", title: "空间概念", chapter: "04", render: (p) => <P_Space {...p} /> },
  { id: "experience", title: "空间体验设计", chapter: "04", render: (p) => <P_Experience {...p} /> },
  { id: "categories", title: "四大核心品类", chapter: "04", render: (p) => <P_Categories {...p} /> },
  { id: "flipper", title: "翻筐乐", chapter: "04", render: (p) => <P_FlipperFun {...p} /> },

  { id: "ch5", title: "第五章 · BOVAS 体系", chapter: "05", render: (p) => (
    <P_Chapter {...p} num="05" en="TRUST SYSTEM" title="核心壁垒：BOVAS 信任体系"
      desc="VERITAS-CHAIN 区块链溯源 · AESTHETICA 6 级品相评级（开发中）" />
  )},
  { id: "veritas", title: "区块链溯源", chapter: "05", render: (p) => <P_Veritas {...p} /> },
  { id: "aesthetica", title: "6 级品相评级", chapter: "05", render: (p) => <P_Aesthetica {...p} /> },

  { id: "ch6", title: "第六章 · 核心价值", chapter: "06", render: (p) => (
    <P_Chapter {...p} num="06" en="CORE VALUES" title="BOOMER OFF 的核心价值"
      desc="高粘性客流 · 延长停留 · 自发传播 · 提升商圈调性" />
  )},
  { id: "value", title: "四大核心价值", chapter: "06", render: (p) => <P_Value {...p} /> },
  { id: "wall", title: "数据见真章", chapter: "06", render: (p) => <P_Wall {...p} /> },

  { id: "coop", title: "合作条件", chapter: "07", render: (p) => <P_Cooperation {...p} /> },

  { id: "ch8", title: "第八章 · 品牌矩阵", chapter: "08", render: (p) => (
    <P_Chapter {...p} num="08" en="BRAND MATRIX" title="品牌矩阵与未来规划"
      desc="七大店型 · 完整布局 · 长期增长飞轮" />
  )},
  { id: "matrix1", title: "七大店型 [上]", chapter: "08", render: (p) => <P_Matrix1 {...p} /> },
  { id: "matrix2", title: "七大店型 [下]", chapter: "08", render: (p) => <P_Matrix2 {...p} /> },
  { id: "flywheel", title: "增长飞轮", chapter: "08", render: (p) => <P_Flywheel {...p} /> },

  { id: "stores", title: "门店地址", chapter: "09", render: (p) => <P_Stores {...p} /> },
  { id: "contact", title: "联系我们", chapter: "09", render: (p) => <P_Contact {...p} /> },
];

export function SlideRendererPortrait({ index }: { index: number }) {
  const slide = SLIDES_PORTRAIT[index];
  if (!slide) return null;
  return (
    <ScaledSlide orientation="portrait">
      {slide.render({ pageNumber: index + 1, totalPages: SLIDES_PORTRAIT.length })}
    </ScaledSlide>
  );
}

export function SlideStaticRendererPortrait({ index }: { index: number }) {
  const slide = SLIDES_PORTRAIT[index];
  if (!slide) return null;
  return slide.render({ pageNumber: index + 1, totalPages: SLIDES_PORTRAIT.length });
}
