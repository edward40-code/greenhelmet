import data from "@/content/guidemaps.json";

/** 지침 지도: 주제 하나에 딸린 법 조문·고시·공단 기술지원규정·자료·해석 사례의 위치를 한 장에 모은 것. 원본은 옮기지 않고 연결만 한다. */
export type MapItem = { name: string; meta: string; why: string; url?: string };
export type MapStep = {
  key: string;
  title: string;
  force: string; // 법적 의무, 권고 … (효력의 세기)
  where: string; // 어디에 있나
  intro: string;
  items: MapItem[];
  note?: string;
  more?: { label: string; url: string };
};
export type GuideMap = {
  slug: string;
  title: string;
  field: string;
  checked: string; // 확인한 날
  summary: string;
  glance: { label: string; value: string; note: string }[];
  steps: MapStep[];
  library: string[]; // 자료실 id
  extra: { name: string; why: string; href: string }[];
};

export const allMaps = () => data as GuideMap[];
export const getMap = (slug: string) => (data as GuideMap[]).find((m) => m.slug === slug);
/** 자료실 자료가 속한 지침 지도 */
export const mapOfLibrary = (id: string) => (data as GuideMap[]).find((m) => m.library.includes(id));
