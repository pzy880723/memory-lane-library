import { ASSETS } from "@/lib/preloadImages";
import { SlideShell } from "./SlideShell";

interface SlideProps {
  pageNumber: number;
  totalPages: number;
}

export const STORE_PROFILES = [
  {
    id: "citic", city: "上海", en: "SHANGHAI", name: "中信泰富店",
    address: "上海市静安区南京西路 1168 号", location: "中信泰富广场 B1 层",
    summary: "南京西路 1168 号 · 中信泰富广场 B1",
    photo: ASSETS.citicExterior, detail: ASSETS.photoCeramics,
    photoCaption: "中信泰富店 · 门店实景", detailCaption: "中信泰富店 · 瓷器陈列",
  },
  {
    id: "xintiandi", city: "上海", en: "SHANGHAI", name: "新天地店",
    address: "上海 · 新天地东台里 D 栋", location: "LG2 层 · LG271 店铺",
    summary: "东台里 D 栋 · LG2 层 · LG271",
    photo: ASSETS.citicExterior, detail: ASSETS.photoUltraman,
    photoCaption: "品牌空间参考 · 中信泰富店实景", detailCaption: "品牌陈列参考 · 中信泰富店实景",
  },
  {
    id: "metro-city", city: "上海", en: "SHANGHAI", name: "美罗城店",
    address: "上海 · 美罗城", location: "4 楼 · 欧风街 4-7",
    summary: "美罗城 4 楼 · 欧风街 4-7",
    photo: ASSETS.citicExterior, detail: ASSETS.photoCups,
    photoCaption: "品牌空间参考 · 中信泰富店实景", detailCaption: "品牌陈列参考 · 中信泰富店实景",
  },
  {
    id: "wenzhou", city: "温州", en: "WENZHOU", name: "朔门古港店",
    address: "温州市鹿城区朔门古港遗址公园", location: "望江路 WJ-8 号店铺",
    summary: "鹿城区 · 望江路 WJ-8 号店铺",
    photo: ASSETS.wenzhouExterior, detail: ASSETS.wenzhouInterior,
    photoCaption: "温州朔门古港店 · 门店实景", detailCaption: "温州店 · 店内陈列",
  },
] as const;

type StoreProfile = (typeof STORE_PROFILES)[number];

export function SlideStoreOverview({ pageNumber, totalPages }: SlideProps) {
  return (
    <SlideShell {...{ pageNumber, totalPages }} variant="cream" chapter="09 · 门店介绍">
      <div className="absolute left-24 top-40 w-[1050px]">
        <p className="font-condensed text-3xl text-boomer-red">Our Stores</p>
        <h1 className="font-display text-[76px] font-bold mt-2">门店一览</h1>
        <div className="mt-10 space-y-8">
          {STORE_PROFILES.map((store, index) => (
            <div key={store.id} className="flex items-start gap-8">
              <span className="w-16 shrink-0 font-condensed text-[44px] leading-tight text-boomer-red">{String(index + 1).padStart(2, "0")}</span>
              <div className="space-y-2">
                <h2 className="font-body text-[40px] font-bold leading-tight">{store.city} · {store.name}</h2>
                <p className="font-body text-[26px] text-ink/65">{store.summary}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute left-[1228px] top-[195px] w-[596px] space-y-10">
        <figure>
          <img src={ASSETS.citicExterior} data-edit-id="stores-overview-citic" alt="中信泰富店门店实景" className="w-full h-[350px] object-cover" decoding="async" />
          <figcaption className="font-body text-[23px] text-ink/65 mt-3">SHANGHAI · 中信泰富店</figcaption>
        </figure>
        <figure>
          <img src={ASSETS.wenzhouSide} data-edit-id="stores-overview-wenzhou" alt="温州朔门古港店外观实景" className="w-full h-[305px] object-cover" decoding="async" />
          <figcaption className="font-body text-[23px] text-ink/65 mt-3">WENZHOU · 朔门古港店</figcaption>
        </figure>
      </div>
    </SlideShell>
  );
}

export function SlideStoreProfile({ store, pageNumber, totalPages }: SlideProps & { store: StoreProfile }) {
  return (
    <SlideShell {...{ pageNumber, totalPages }} variant="cream" chapter="09 · 门店介绍">
      <figure className="absolute left-24 top-[193px] w-[580px]">
        <img src={store.photo} data-edit-id={`store-${store.id}-exterior`} alt={`${store.city}${store.name}介绍主图`} className="w-full h-[733px] object-cover" decoding="async" />
        <figcaption className="font-body text-[22px] text-ink/65 mt-3">{store.photoCaption}</figcaption>
      </figure>
      <div className="absolute left-[760px] top-[195px] w-[1064px]">
        <p className="font-condensed text-3xl text-boomer-red">{store.en} / {String(STORE_PROFILES.indexOf(store) + 1).padStart(2, "0")}</p>
        <h1 className="font-display text-[76px] font-bold leading-[1.4] mt-5">
          <span className="block">{store.city}</span>
          <span className="block">{store.name}</span>
        </h1>
        <div className="font-body text-[31px] text-ink/65 leading-relaxed mt-6">
          <p>{store.address}</p>
          <p>{store.location}</p>
        </div>
      </div>
      <figure className="absolute left-[760px] top-[650px] w-[1064px]">
        <img src={store.detail} data-edit-id={`store-${store.id}-interior`} alt={`${store.city}${store.name}介绍陈列图`} className="w-full h-[278px] object-cover" decoding="async" />
        <figcaption className="font-body text-[23px] text-ink/65 mt-3">{store.detailCaption}</figcaption>
      </figure>
    </SlideShell>
  );
}
