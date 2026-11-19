"use client";

import { useMemo, useState } from "react";
import type { Rule } from "@/lib/inventory";

const chip = (on: boolean) =>
  `inline-flex min-h-[38px] shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-[14px] whitespace-nowrap cursor-pointer ${on ? "border-accent bg-accent font-bold text-white" : "border-line bg-white text-ink hover:border-ink"}`;

/** 고용노동부 산업안전보건 고시·예규·훈령 전체 목록. 찾기 + 분류 + 최근 개정순 */
export default function RulesTable({ rules, recentFrom }: { rules: Rule[]; recentFrom: string }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [recent, setRecent] = useState(false);
  const cats = useMemo(() => {
    const c: Record<string, number> = {};
    rules.forEach((r) => (c[r.cat] = (c[r.cat] ?? 0) + 1));
    return Object.entries(c).sort((a, b) => b[1] - a[1]);
  }, [rules]);
  const kw = q.trim().toLowerCase();
  const list = rules
    .filter((r) => (cat === "all" || r.cat === cat) && (!recent || r.date >= recentFrom) && (!kw || `${r.name} ${r.no}`.toLowerCase().includes(kw)))
    .sort((a, b) => (recent ? b.date.localeCompare(a.date) : a.name.localeCompare(b.name, "ko")));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor="ruleq" className="sr-only">고시 이름으로 찾기</label>
        <input id="ruleq" type="search" className="field min-w-0 flex-1" placeholder="이름·번호로 찾기 (예: 지침, 석면, 안전인증)" value={q} onChange={(e) => setQ(e.target.value)} />
        <button type="button" aria-pressed={recent} onClick={() => setRecent(!recent)} className={chip(recent)}>
          2025년 이후 바뀐 것만
        </button>
      </div>
      <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1" role="group" aria-label="분류로 거르기">
        <button type="button" aria-pressed={cat === "all"} onClick={() => setCat("all")} className={chip(cat === "all")}>전체 <span className={cat === "all" ? "opacity-85" : "text-muted"}>{rules.length}</span></button>
        {cats.map(([c, n]) => (
          <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)} className={chip(cat === c)}>
            {c} <span className={cat === c ? "opacity-85" : "text-muted"}>{n}</span>
          </button>
        ))}
      </div>
      <p className="m-0 text-[14px] text-muted" aria-live="polite">
        <b className="text-[16px] text-ink">{list.length}</b>건
      </p>
      <ul className="m-0 flex list-none flex-col p-0">
        {list.length === 0 && <li className="py-6 text-center text-muted">찾는 고시가 없습니다.</li>}
        {list.map((r) => (
          <li key={r.name} className="flex flex-col gap-0.5 border-t border-line-soft py-2.5 sm:flex-row sm:items-baseline sm:gap-3">
            <a href={encodeURI(r.url)} target="_blank" rel="noopener" className="min-w-0 flex-1 text-[15px] leading-snug font-semibold">{r.name}</a>
            <span className="shrink-0 text-[13px] text-muted">
              {r.type} {r.no} · {r.date.replace(/-/g, ".")} {r.kind}
              {r.date >= recentFrom && <span className="ml-1.5 rounded bg-[#fff4d6] px-1.5 py-px font-bold text-[#8a5a00]">최근</span>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
