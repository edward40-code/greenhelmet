import notes from "@/content/accident-notes.json";
import data from "@/content/feeds/accidents.json";
import { slugOf, type NewsItem } from "./news";
import { accKindOf, type AccItem } from "./accKind";

export * from "./accKind";

/** 언론에 보도된 산업현장 사고 + 운영자가 원문 기사를 읽고 쓴 요약·태그 (보도된 사실만, 실명 제외) */
type Note = { summary: string; checked: string; url?: string; tags?: string[]; kind?: string };
const NOTES = notes as Record<string, Note>;

export const allAccidents = (): AccItem[] =>
  (data as NewsItem[])
    .map((x): AccItem => {
      const n = NOTES[x.id];
      return n ? { ...x, summary: n.summary, srcUrl: n.url, tags: n.tags, accType: n.kind } : x;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

/** 원문 링크: 언론사 기사 주소를 알면 그 주소, 모르면 수집한 주소 */
export const sourceUrl = (x: AccItem) => x.srcUrl ?? x.url;

export const getAccident = (slug: string) => allAccidents().find((x) => slugOf(x.id) === slug);

/** 사고 유형별로 함께 보여 줄 자료실 서식 id (예방 점검에 쓰는 서식) */
export const ACC_LIBRARY: Record<string, string[]> = {
  fall: ["checklist-aerial-work-platform", "checklist-work-start-all", "daily-safety-checklist"],
  caught: ["checklist-conveyor", "checklist-press", "checklist-work-start-all"],
  crush: ["checklist-crane", "checklist-mobile-crane", "checklist-forklift"],
  gas: ["checklist-confined-space", "confined-space-program", "risk-assessment-form"],
  shock: ["daily-safety-checklist", "risk-assessment-form", "tbm-log"],
  explosion: ["checklist-hot-work", "checklist-fire-extinguisher", "risk-assessment-form"],
  fire: ["checklist-hot-work", "checklist-fire-extinguisher", "checklist-fire-monthly"],
  leak: ["risk-assessment-form", "checklist-confined-space", "daily-safety-checklist"],
  struck: ["checklist-crane", "checklist-mobile-crane", "daily-safety-checklist"],
  vehicle: ["checklist-truck", "checklist-work-start-all", "tbm-log"],
  alert: ["daily-safety-checklist", "risk-assessment-form", "tbm-log"],
};

/** 세부 태그에 딱 맞는 서식이 있으면 맨 앞에 둔다 */
export const TAG_LIBRARY: Record<string, string> = {
  지게차: "checklist-forklift",
  크레인: "checklist-crane",
  밀폐공간: "checklist-confined-space",
  "차량 적재함": "checklist-truck",
  차량: "checklist-truck",
  건설기계: "checklist-work-start-all",
  "기계 말림": "checklist-conveyor",
  화학물질: "risk-assessment-form",
  "설비 폭발": "checklist-hot-work",
};

/** 사고에 맞는 서식 id 목록 (태그 우선, 그다음 유형별, 중복 제거, 3개) */
export function accLibraryIds(x: AccItem): string[] {
  const k = accKindOf(x).icon;
  const ids = [...(x.tags ?? []).map((t) => TAG_LIBRARY[t]).filter(Boolean), ...(ACC_LIBRARY[k] ?? ACC_LIBRARY.alert)];
  return [...new Set(ids)].slice(0, 3);
}

