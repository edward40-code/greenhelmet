"use client";

import { useEffect, useState } from "react";
import templates from "@/content/tbm-templates.json";
import { TBM_FROM_RISK, type TbmFromRisk } from "@/lib/riskToTbm";

type Tpl = { id: string; name: string; sort: number; hazards: string[]; measures: string[]; checks: string[]; word: string };
const DATA = (templates as Tpl[]).slice().sort((a, b) => a.sort - b.sort);

const inputCls = "field text-[15px]";
const RISK = "risk";
const RISK_CHECKS = [
  "위험성 높음 요인의 개선대책 이행 상태",
  "오늘 작업자 전원에게 위험성평가 결과 공유 (지침 제17조제1항)",
  "새로 투입되거나 작업이 바뀐 근로자에게 작업 전 설명 (지침 제17조제2항)",
  "보호구 지급과 착용 상태",
];
const RISK_WORD = "위험성 '높음'인 요인은 대책을 확인하기 전에는 작업을 시작하지 않습니다.";
const pad = (n: number) => String(n).padStart(2, "0");

export default function Tbm() {
  const [sel, setSel] = useState(DATA[0].id);
  const [meta, setMeta] = useState({ date: "", place: "", content: "", leader: "" });
  const [risk, setRisk] = useState<TbmFromRisk | null>(null);
  const [pick, setPick] = useState<boolean[]>([]);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(TBM_FROM_RISK);
      if (!raw) return;
      const v = JSON.parse(raw) as TbmFromRisk;
      if (!v.hazards?.length) return;
      const top = v.hazards.map((h) => h.rank >= 2);
      setPick(top.some(Boolean) ? top : v.hazards.map((_, i) => i < 5));
      setRisk(v);
      setSel(RISK);
      const t = new Date();
      setMeta((m) => ({ ...m, date: m.date || `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`, place: m.place || v.site, content: m.content || v.proc }));
    } catch {}
  }, []);

  const isRisk = sel === RISK && risk !== null;
  const picked = isRisk ? risk.hazards.filter((_, i) => pick[i]) : [];
  const tpl = DATA.find((d) => d.id === sel) || DATA[0];
  const cur = isRisk
    ? {
        id: RISK,
        name: "위험성평가 결과",
        hazards: picked.map((h) => (h.lv ? `${h.h} (${h.lv})` : h.h)),
        measures: Array.from(new Set(picked.flatMap((h) => h.ms))),
        checks: RISK_CHECKS,
        word: RISK_WORD,
      }
    : tpl;
  const set = (k: keyof typeof meta) => (e: React.ChangeEvent<HTMLInputElement>) => setMeta((p) => ({ ...p, [k]: e.target.value }));

  const metaRows: [string, string][] = [
    ["일시", meta.date],
    ["작업 장소", meta.place],
    ["작업 내용", meta.content],
    ["진행자", meta.leader],
  ];

  return (
    <>
      <section aria-label="작업 종류 선택" className="card no-print flex flex-col gap-3 px-5 py-[18px]">
        <h2 className="m-0 text-[16px] font-extrabold">1. 작업 종류</h2>
        <div className="flex flex-wrap gap-2">
          {[...(risk ? [{ id: RISK, name: "위험성평가 결과" }] : []), ...DATA].map((d) => {
            const on = d.id === sel;
            return (
              <button
                key={d.id}
                type="button"
                aria-pressed={on}
                onClick={() => setSel(d.id)}
                className={`min-h-[46px] rounded-[23px] px-[18px] text-[15px] cursor-pointer ${on ? "border-2 border-accent bg-accent font-bold text-white" : "border border-field bg-white text-ink"}`}
              >
                {d.name}
              </button>
            );
          })}
        </div>
      </section>

      {isRisk && (
        <section aria-label="위험성평가에서 가져온 위험요인" className="card no-print flex flex-col gap-2 px-5 py-[18px]">
          <h2 className="m-0 text-[16px] font-extrabold">
            오늘 다룰 위험요인 <span className="text-[14px] font-normal text-muted">{picked.length} / {risk.hazards.length}</span>
          </h2>
          <ul className="m-0 flex list-none flex-col p-0">
            {risk.hazards.map((h, i) => (
              <li key={i} className="border-t border-line-soft first:border-t-0">
                <label className="flex min-h-[44px] cursor-pointer items-center gap-2.5 py-1.5 text-[15px]">
                  <input type="checkbox" className="h-5 w-5 shrink-0 accent-[#1b6b3a]" checked={!!pick[i]} onChange={() => setPick((p) => p.map((x, j) => (j === i ? !x : x)))} />
                  <span className={`w-[44px] shrink-0 text-[14px] ${h.rank === 3 ? "font-extrabold text-danger" : h.rank === 2 ? "font-bold" : "text-muted"}`}>{h.lv || "—"}</span>
                  <span className="min-w-0">{h.h}</span>
                </label>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="flex flex-wrap items-start gap-4">
        <form className="card no-print flex min-w-0 flex-[1_1_280px] flex-col gap-3.5 px-5 py-[18px]" onSubmit={(e) => e.preventDefault()}>
          <h2 className="m-0 text-[16px] font-extrabold">2. 기본 정보</h2>
          <div className="flex flex-col gap-1.5"><label htmlFor="td" className="text-[14px] font-bold">일시</label><input id="td" type="date" className={inputCls} value={meta.date} onChange={set("date")} /></div>
          <div className="flex flex-col gap-1.5"><label htmlFor="tp" className="text-[14px] font-bold">작업 장소</label><input id="tp" type="text" placeholder="예: 2공장 지붕" className={inputCls} value={meta.place} onChange={set("place")} /></div>
          <div className="flex flex-col gap-1.5"><label htmlFor="tc" className="text-[14px] font-bold">작업 내용</label><input id="tc" type="text" placeholder="예: 채광창 교체" className={inputCls} value={meta.content} onChange={set("content")} /></div>
          <div className="flex flex-col gap-1.5"><label htmlFor="tl" className="text-[14px] font-bold">진행자</label><input id="tl" type="text" placeholder="관리감독자 이름" className={inputCls} value={meta.leader} onChange={set("leader")} /></div>
        </form>

        <article aria-label="TBM 회의록" className="print-only-area flex min-w-0 flex-[999_1_560px] flex-col gap-[18px] rounded-md border-2 border-ink bg-white p-5 sm:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-ink pb-3">
            <h2 className="m-0 text-[22px] font-extrabold">TBM 회의록 · {cur.name}</h2>
            <button type="button" onClick={() => window.print()} className="no-print min-h-[44px] rounded-md bg-ink px-[18px] text-[15px] font-bold text-white cursor-pointer">
              인쇄·PDF
            </button>
          </div>

          <dl className="m-0 grid grid-cols-1 gap-x-4 gap-y-1 text-[15px] sm:grid-cols-2">
            {metaRows.map(([k, v]) => (
              <div key={k} className="flex gap-3 border-b border-dashed border-line py-1.5">
                <dt className="w-[72px] shrink-0 font-bold text-muted">{k}</dt>
                <dd className="m-0 min-w-0 break-words">{v || " "}</dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-wrap gap-4">
            <section className="flex min-w-0 flex-[1_1_240px] flex-col gap-2">
              <h3 className="m-0 text-[16px] font-extrabold text-danger">오늘의 위험요인</h3>
              <ul className="m-0 list-disc pl-5 text-[15px] leading-[1.8]">{cur.hazards.map((h, i) => <li key={i}>{h}</li>)}</ul>
            </section>
            <section className="flex min-w-0 flex-[1_1_240px] flex-col gap-2">
              <h3 className="m-0 text-[16px] font-extrabold text-accent">안전대책</h3>
              <ul className="m-0 list-disc pl-5 text-[15px] leading-[1.8]">{cur.measures.map((m, i) => <li key={i}>{m}</li>)}</ul>
            </section>
          </div>

          <section className="flex flex-col gap-1.5">
            <h3 className="m-0 text-[16px] font-extrabold">작업 전 확인</h3>
            {cur.checks.map((c) => (
              <label key={cur.id + c} className="flex min-h-[40px] items-center gap-2.5 border-b border-dashed border-line text-[15px]">
                <input type="checkbox" className="h-5 w-5 accent-[#1b6b3a]" />
                {c}
              </label>
            ))}
          </section>

          <section className="flex flex-col gap-2">
            <h3 className="m-0 text-[16px] font-extrabold">오늘의 한마디</h3>
            <p className="m-0 rounded-md bg-[#f4f7f5] px-3.5 py-3 text-[16px] leading-[1.7]">{cur.word}</p>
          </section>

          <section className="flex flex-col gap-2">
            <h3 className="m-0 text-[16px] font-extrabold">참석자 서명</h3>
            <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-[52px] rounded border border-field" />
              ))}
            </div>
          </section>
          <p className="m-0 text-[14px] text-muted">{isRisk ? `위험성평가${risk.date ? ` (${risk.date})` : ""} 결과에서 가져옴` : "기본 문구 · 현장 위험성평가 결과에 맞게 수정"}</p>
        </article>
      </div>
    </>
  );
}
