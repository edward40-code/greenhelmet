"use client";

import Link from "next/link";
import { useMemo, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/icons";
import type { InvGroup } from "@/lib/inventory";

const FORCE: Record<string, string> = {
  law: "bg-[#fdecec] text-[#8a1f11]",
  notice: "bg-warn-bg text-warn-ink",
  kosha: "bg-[#eaf0f3] text-[#34505e]",
  material: "bg-bg text-muted",
  interp: "bg-[#f2ecfe] text-[#5b2bb5]",
  ours: "bg-accent-soft text-accent",
};
const fmt = (d?: string) => (d ? d.replace(/-/g, ".") : "");

export default function InventoryView({ groups, head }: { groups: InvGroup[]; head: ReactNode }) {
  const [q, setQ] = useState("");
  const [only, setOnly] = useState("all");
  const [pick, setPick] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const kw = q.trim().toLowerCase();
  const total = groups.reduce((s, g) => s + g.items.length, 0);

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

  // 건수 칸을 누르면 그 종류만 보여 주고 목록 위치로 내려간다
  const choose = (key: string) => {
    setOnly(key);
    setQ("");
    setPick(false);
    requestAnimationFrame(() => listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };
  const tile = (on: boolean) =>
    `flex cursor-pointer flex-col gap-0.5 rounded-md border p-3.5 text-left ${on ? "border-accent bg-accent text-white" : "border-transparent bg-bg text-ink hover:border-accent"}`;

  return (
    <>
      <section className="card flex flex-col gap-3 p-5">
        {head}
        <div className="grid gap-2.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(118px, 100%), 1fr))" }} role="group" aria-label="종류 고르기">
          <button type="button" aria-pressed={only === "all"} onClick={() => choose("all")} className={tile(only === "all")}>
            <span className={`text-[13px] font-bold ${only === "all" ? "opacity-90" : "text-muted"}`}>전체</span>
            <span className={`text-[24px] leading-tight font-extrabold ${only === "all" ? "" : "text-accent"}`}>{total}</span>
          </button>
          {groups.map((g, i) => (
            <button key={g.key} type="button" aria-pressed={only === g.key} onClick={() => choose(g.key)} className={tile(only === g.key)}>
              <span className={`text-[13px] font-bold ${only === g.key ? "opacity-90" : "text-muted"}`}>{i + 1}. {g.short}</span>
              <span className={`text-[24px] leading-tight font-extrabold ${only === g.key ? "" : "text-accent"}`}>{g.items.length}</span>
            </button>
          ))}
        </div>
      </section>

      <div ref={listRef} className="flex scroll-mt-20 flex-col gap-4">
        <section className="card flex flex-wrap items-center gap-2 p-4">
          <label htmlFor="invq" className="sr-only">목록에서 찾기</label>
          <input id="invq" type="search" className="field min-w-0 flex-1" placeholder="이름·번호로 찾기" value={q} onChange={(e) => setQ(e.target.value)} />
          <button
            type="button"
            aria-pressed={pick}
            onClick={() => setPick(!pick)}
            className={`inline-flex min-h-[40px] shrink-0 cursor-pointer items-center gap-1.5 rounded-md border px-3.5 text-[14px] whitespace-nowrap ${pick ? "border-accent bg-accent font-bold text-white" : "border-line bg-white text-ink hover:border-ink"}`}
          >
            ★ 먼저 볼 것
          </button>
          <span className="shrink-0 text-[14px] text-muted" aria-live="polite">
            <b className="text-[16px] text-ink">{count}</b>건
          </span>
        </section>

        {shown.map((g) => {
          const i = groups.findIndex((x) => x.key === g.key);
          if (g.rows.length === 0) return null;
          return (
            <section key={g.key} className="card flex flex-col gap-2 p-5">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-[15px] font-bold text-white">{i + 1}</span>
                <h2 className="m-0 text-[19px] font-extrabold">{g.title}</h2>
                <span className={`rounded-full px-2.5 py-0.5 text-[13px] font-bold ${FORCE[g.key] ?? FORCE.material}`}>{g.force}</span>
                <span className="text-[14px] text-muted">{filtering ? `${g.rows.length} / ${g.items.length}` : g.items.length}</span>
                <span className="text-[13px] text-muted sm:ml-auto">{g.where}</span>
              </div>
              <ul className="m-0 flex list-none flex-col p-0">
                {g.rows.map((it) => {
                  const cls = `text-[15px] leading-snug ${it.pick ? "font-bold" : "font-semibold"}`;
                  return (
                    <li key={it.name + it.meta} className={`flex items-start gap-2.5 border-t border-line-soft py-2.5 ${it.gone ? "opacity-70" : ""}`}>
                      <span aria-hidden="true" className={`mt-0.5 w-4 shrink-0 text-center text-[15px] ${it.pick ? "text-[#c98a00]" : "text-transparent"}`}>★</span>
                      <span className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
                        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                          {it.href ? (
                            <Link href={it.href} className={cls}>{it.name}</Link>
                          ) : it.url ? (
                            <a href={encodeURI(it.url)} target="_blank" rel="noopener" className={cls}>
                              {it.name} <span className="inline-block align-[-2px]"><Icon name="link" size={14} /></span>
                            </a>
                          ) : (
                            <span className={`${cls} ${it.gone ? "line-through" : ""}`}>{it.name}</span>
                          )}
                          {it.why && <span className="text-[14px] leading-relaxed text-muted">{it.why}</span>}
                        </span>
                        <span className="shrink-0 text-[13px] text-muted">
                          {it.pick && <span className="sr-only">먼저 볼 것 · </span>}
                          {it.meta}
                          {it.date && ` · ${fmt(it.date)}`}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
              {g.more && (
                <a href={encodeURI(g.more.url)} target="_blank" rel="noopener" className="inline-flex min-h-[40px] items-center gap-1.5 self-start rounded-md border border-line px-3.5 text-[14px] font-bold">
                  {g.more.label} ↗
                </a>
              )}
            </section>
          );
        })}
        {count === 0 && <p className="card m-0 p-6 text-center text-muted">찾는 항목이 없습니다.</p>}
      </div>
    </>
  );
}
