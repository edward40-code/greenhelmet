import data from "@/content/market.json";

/** 안전장터: 작업별 보호구·장비. 상품 링크(products)는 운영자가 고른 쿠팡 파트너스 링크만 넣는다 */
export type MarketProduct = { name: string; url: string };
export type MarketItem = {
  id: string;
  name: string;
  cert: "kcs" | "self" | "none";
  certSub?: string;
  certNote?: string;
  law?: string;
  check: string[];
  products: MarketProduct[];
};
export type MarketGroup = { key: string; name: string; library: string[]; items: MarketItem[] };
export type Market = {
  checked: string;
  disclosure: string;
  certs: Record<string, { label: string; basis: string }>;
  groups: MarketGroup[];
};

export const market = () => data as Market;
export const marketCount = () => market().groups.reduce((s, g) => s + g.items.length, 0);

/** 자료실 자료와 이어지는 장터 묶음 */
export const marketOfLibrary = (id: string) => market().groups.find((g) => g.library.includes(id));
