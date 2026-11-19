import data from "@/content/feeds/accidents.json";
import type { NewsItem } from "./news";

/** 언론에 보도된 산업현장 사고. 제목·언론사·날짜·원문 링크만 담는다. */
export const allAccidents = (): NewsItem[] => (data as NewsItem[]).slice().sort((a, b) => b.date.localeCompare(a.date));

/** 제목으로 사고 유형을 짐작해 아이콘·라벨을 붙인다 (보도 제목 그대로, 내용은 바꾸지 않음) */
const ACC_KIND: [RegExp, string, string][] = [
  [/추락|떨어져|낙하/, "fall", "추락"],
  [/끼임|끼여|협착|말려/, "caught", "끼임"],
  [/깔려|깔림|붕괴|무너/, "crush", "깔림·붕괴"],
  [/질식|가스|중독|밀폐/, "gas", "질식·중독"],
  [/감전|전기/, "shock", "감전"],
  [/폭발|터져/, "explosion", "폭발"],
  [/화재|불길|불이|불나|화염|불…|불\.\.\./, "fire", "화재"],
  [/누출|유출|새어/, "leak", "누출"],
];
export function accKind(title: string): { icon: string; label: string } {
  for (const [re, icon, label] of ACC_KIND) if (re.test(title)) return { icon, label };
  return { icon: "alert", label: "사고" };
}
