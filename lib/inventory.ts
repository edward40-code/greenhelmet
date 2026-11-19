import data from "@/content/inventory.json";
import rules from "@/content/inventory-rules.json";

/** 지침 인벤토리: 주제 하나에 딸린 법 조문·고시·공단 기술지원규정·자료·해석 사례를 빠짐없이 모은 목록. 원본은 옮기지 않고 연결만 한다. */
export type InvItem = {
  name: string;
  meta: string; // 번호·종류·출처
  date?: string; // 공표·시행·회신일 (YYYY-MM-DD)
  why?: string; // 언제 보는지
  url?: string;
  pick?: boolean; // 먼저 볼 것
  gone?: boolean; // 폐지
};
export type InvGroup = {
  key: string;
  title: string;
  short: string;
  force: string; // 법적 의무, 권고 … (효력의 세기)
  where: string; // 어디에 있나
  count: string; // 건수 설명
  intro: string;
  items: InvItem[];
  note?: string;
  more?: { label: string; url: string };
};
export type Inventory = {
  slug: string;
  title: string;
  field: string;
  checked: string; // 확인한 날
  summary: string;
  groups: InvGroup[];
  library: string[]; // 자료실 id
  extra: { name: string; why: string; href: string }[];
};

/** 고용노동부 산업안전보건 행정규칙(고시·예규·훈령) 한 건 */
export type Rule = { name: string; type: string; no: string; date: string; kind: string; cat: string; url: string };

export const allInventories = () => data as Inventory[];
export const getInventory = (slug: string) => (data as Inventory[]).find((m) => m.slug === slug);
/** 자료실 자료가 속한 인벤토리 */
export const inventoryOfLibrary = (id: string) => (data as Inventory[]).find((m) => m.library.includes(id));
export const allRules = () => rules as Rule[];
export const totalOf = (m: Inventory) => m.groups.reduce((s, g) => s + g.items.length, 0) + m.library.length;
