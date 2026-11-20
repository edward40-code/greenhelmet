import type { NewsItem } from "./news";

/** 사고 유형·태그 계산 (데이터 파일을 읽지 않아 브라우저 쪽에서도 쓴다) */
export type AccItem = NewsItem & { srcUrl?: string; tags?: string[]; accType?: string };

/** 제목으로 사고 유형을 짐작해 아이콘·라벨을 붙인다 (보도 제목 그대로, 내용은 바꾸지 않음) */
const ACC_KIND: [RegExp, string, string][] = [
  [/추락|떨어져|낙하/, "fall", "추락"],
  [/끼임|끼여|끼어|낀 |협착|말려/, "caught", "끼임"],
  [/깔려|깔림|깔린|붕괴|무너/, "crush", "깔림·붕괴"],
  [/질식|가스|중독|밀폐/, "gas", "질식·중독"],
  [/감전|전기/, "shock", "감전"],
  [/폭발|터져/, "explosion", "폭발"],
  [/화재|불길|불이|불나|화염|불…|불\.\.\./, "fire", "화재"],
  [/누출|유출|새어/, "leak", "누출"],
];
const KIND_LABEL: Record<string, string> = {
  fall: "추락", caught: "끼임", crush: "깔림·붕괴", gas: "질식·중독", shock: "감전", explosion: "폭발", fire: "화재", leak: "누출",
  struck: "맞음", vehicle: "차량 충돌", alert: "",
};
/** 운영자가 정한 유형(accType)이 있으면 그것을, 없으면 제목으로 짐작한 유형 */
export function accKindOf(x: { title: string; accType?: string }): { icon: string; label: string } {
  if (x.accType && KIND_LABEL[x.accType]) return { icon: x.accType, label: KIND_LABEL[x.accType] };
  return accKind(x.title);
}
export function accKind(title: string): { icon: string; label: string } {
  for (const [re, icon, label] of ACC_KIND) if (re.test(title)) return { icon, label };
  return { icon: "alert", label: "" }; // 유형을 정할 수 없으면 태그를 달지 않는다
}

/** 수집된 사고에 붙은 태그와 건수 (많은 순) */
export function accTagCounts(items: AccItem[]): [string, number][] {
  const c: Record<string, number> = {};
  items.forEach((x) => (x.tags ?? []).forEach((t) => (c[t] = (c[t] ?? 0) + 1)));
  return Object.entries(c).sort((a, b) => b[1] - a[1]);
}

/** 목록에 보여 줄 요약: 앞의 두 문장까지 */
export const shortSummary = (s?: string) => (s ? (s.match(/[^.!?]+[.!?]+/g) ?? [s]).slice(0, 2).join("").trim() : "");
