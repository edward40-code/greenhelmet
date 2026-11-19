"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/icons";
import type { InvGroup } from "@/lib/inventory";

// 효력의 세기에 따라 색을 달리한다 (법적 의무일수록 진하게)
const FORCE: Record<string, string> = {
  law: "bg-[#fdecec] text-[#8a1f11]",
  notice: "bg-warn-bg text-warn-ink",
  kosha: "bg-[#eaf0f3] text-[#34505e]",
  material: "bg-bg text-muted",
  interp: "bg-[#f2ecfe] text-[#5b2bb5]",
};
const chip = (on: boolean) =>
  `inline-flex min-h-[38px] shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-[14px] whitespace-nowrap cursor-pointer ${on ? "border-accent bg-accent font-bold text-white" : "border-line bg-white text-ink hover:border-ink"}`;
const fmt = (d?: string) => (d ? d.replace(/-/g, ".") : "");

export default function InventoryView({ groups }: { groups: InvGroup[] }) {
  const [q, setQ] = useState("");
  const [only, setOnly] = useState("all");
  const [pick, setPick] = useState(false);
  const kw = q.trim().toLowerCase();

  const shown = useMemo(
    () =>
      groups
        .filter((g) => only === "all" || g.key === only)
        .map((g) => ({
          ...g,
          rows: g.items.filter((it) => (!pick || it.pick) && (!kw || `${it.name} ${it.meta} ${it.why ?? ""}`.toLowerCase().includes(kw))),
        })),
    [groups, only, pick, kw]
  );
  const count = shown.reduce((s, g) => s + g.rows.length, 0);
  const filtering = pick || !!kw;

  return (
    <>
      <section className="card z-10 flex flex-col gap-3 p-4 lg:sticky lg:top-[72px]">
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="invq" className="sr-only">목록에서 찾기</label>
          <input id="invq" type="search" className="field min-w-0 flex-1" placeholder="이름·번호로 찾기 (예: 측정, E-G-18, 정화조)" value={q} onChange={(e) => setQ(e.target.value)} />
          <button type="button" aria-pressed={pick} onClick={() => setPick(!pick)} className={chip(pick)}>
            ★ 먼저 볼 것만
          </button>
        </div>
        <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1" role="group" aria-label="종류로 거르기">
          <button type="button" aria-pressed={only === "all"} onClick={() => setOnly("all")} className={chip(only === "all")}>전체</button>
          {groups.map((g) => (
            <button key={g.key} type="button" aria-pressed={only === g.key} onClick={() => setOnly(g.key)} className={chip(only === g.key)}>
              {g.short} <span className={only === g.key ? "opacity-85" : "text-muted"}>{g.items.length}</span>
            </button>
          ))}
        </div>
        <p className="m-0 text-[14px] text-muted" aria-live="polite">
          <b className="text-[16px] text-ink">{count}</b>건 보는 중
        </p>
      </section>

      {shown.map((g) => {
        const i = groups.findIndex((x) => x.key === g.key);
        if (filtering && g.rows.length === 0) return null;
        return (
          <section key={g.key} id={g.key} className="card flex scroll-mt-20 lg:scroll-mt-52 flex-col gap-3 p-5">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-[15px] font-bold text-white">{i + 1}</span>
              <h2 className="m-0 text-[19px] font-extrabold">{g.title}</h2>
              <span className={`rounded-full px-2.5 py-0.5 text-[13px] font-bold ${FORCE[g.key] ?? FORCE.material}`}>{g.force}</span>
              <span className="text-[14px] text-muted">{g.rows.length === g.items.length ? `${g.items.length}건` : `${g.items.length}건 중 ${g.rows.length}건`}</span>
            </div>
            <p className="m-0 text-[13px] text-muted">있는 곳 · {g.where}</p>
            {!filtering && <p className="m-0 text-[15px] leading-[1.75]">{g.intro}</p>}
            <ul className="m-0 flex list-none flex-col p-0">
              {g.rows.map((it) => (
                <li key={it.name + it.meta} className={`flex items-start gap-2.5 border-t border-line-soft py-2.5 ${it.gone ? "opacity-70" : ""}`}>
                  <span aria-hidden="true" className={`mt-0.5 w-4 shrink-0 text-center text-[15px] ${it.pick ? "text-[#c98a00]" : "text-transparent"}`}>★</span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    {it.url ? (
                      <a href={encodeURI(it.url)} target="_blank" rel="noopener" className={`text-[15px] leading-snug ${it.pick ? "font-bold" : "font-semibold"}`}>
                        {it.name} <span className="inline-block align-[-2px]"><Icon name="link" size={14} /></span>
                      </a>
                    ) : (
                      <span className={`text-[15px] leading-snug ${it.pick ? "font-bold" : "font-semibold"} ${it.gone ? "line-through" : ""}`}>{it.name}</span>
                    )}
                    <span className="text-[13px] text-muted">
                      {it.pick && <span className="sr-only">먼저 볼 것 · </span>}
                      {it.meta}
                      {it.date && ` · ${fmt(it.date)}`}
                    </span>
                    {it.why && <span className="text-[14px] leading-relaxed">{it.why}</span>}
                  </span>
                </li>
              ))}
            </ul>
            {!filtering && g.note && <p className="m-0 rounded-md bg-bg px-4 py-3 text-[14px] leading-relaxed">{g.note}</p>}
            {g.more && (
              <a href={encodeURI(g.more.url)} target="_blank" rel="noopener" className="inline-flex min-h-[44px] items-center gap-1.5 self-start rounded-md border border-accent px-4 text-[15px] font-bold">
                {g.more.label} ↗
              </a>
            )}
          </section>
        );
      })}
      {count === 0 && <p className="card m-0 p-6 text-center text-muted">찾는 항목이 없습니다. 다른 말로 찾아보세요.</p>}
    </>
  );
}
