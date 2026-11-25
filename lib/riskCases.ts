import data from "@/content/risk-templates.json";
import { allAccidents, accKindOf, shortSummary } from "./accidents";
import { slugOf } from "./news";

/** 위험성평가 도구에서 작업별로 보여 줄 최근 사고 (운영자 요약이 있는 보도만, 요약은 실명 제외) */
export type RiskCase = { slug: string; date: string; kind: string; text: string };
type Acc = { tags: string[]; kinds: string[]; re: string };
const cut = (s: string, n = 80) => (s.length > n ? s.slice(0, n).trimEnd() + "…" : s);

export function riskCases(limit = 3): Record<string, RiskCase[]> {
  const items = allAccidents().filter((x) => x.summary && x.tags && !/묶음 보도/.test(x.summary));
  const out: Record<string, RiskCase[]> = {};
  for (const w of (data as unknown as { works: { id: string; acc: Acc }[] }).works) {
    const re = w.acc.re ? new RegExp(w.acc.re) : null;
    const scored = items
      .map((x) => {
        const k = accKindOf(x);
        const tag = (x.tags ?? []).some((t) => w.acc.tags.includes(t));
        const text = `${x.title} ${x.summary}`;
        const hit = re ? re.test(text) : false;
        // 태그나 낱말이 맞아야 넣고, 사고 유형까지 같으면 앞에 둔다
        const score = tag || hit ? (tag ? 2 : 0) + (hit ? 1 : 0) + (w.acc.kinds.includes(k.icon) ? 1 : 0) : 0;
        return { x, k, score };
      })
      .filter((o) => o.score > 0)
      .sort((a, b) => b.score - a.score || b.x.date.localeCompare(a.x.date))
      .slice(0, limit);
    out[w.id] = scored.map(({ x, k }) => ({
      slug: slugOf(x.id),
      date: x.date,
      kind: k.label,
      text: cut((shortSummary(x.summary).match(/[^.!?]+[.!?]+/) ?? [shortSummary(x.summary)])[0].trim()),
    }));
  }
  return out;
}
