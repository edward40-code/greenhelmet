"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DUTIES } from "./data";

type YN = "" | "y" | "n";
type St = "" | "ok" | "no" | "unk";
type Saved = { n: string; staff: YN; top: YN; contract: YN; cs: YN; st: Record<string, St> };

const KEY = "gh-sapa-v1";
const EMPTY: Saved = { n: "", staff: "", top: "", contract: "", cs: "", st: {} };

const btn = (on: boolean, tone: "ink" | "ok" | "no" | "unk" = "ink") =>
  `inline-flex min-h-[38px] shrink-0 cursor-pointer items-center justify-center rounded-md border px-3 text-[14px] whitespace-nowrap ${
    on
      ? tone === "no"
        ? "border-danger bg-danger font-bold text-white"
        : tone === "unk"
          ? "border-muted bg-muted font-bold text-white"
          : "border-accent bg-accent font-bold text-white"
      : "border-line bg-white text-ink hover:border-ink"
  }`;

function Ask({ q, v, set }: { q: string; v: YN; set: (v: YN) => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-line-soft py-3 first:border-t-0">
      <span className="min-w-0 flex-1 text-[15px] leading-snug">{q}</span>
      <span className="flex gap-1.5" role="group" aria-label={q}>
        <button type="button" aria-pressed={v === "y"} onClick={() => set(v === "y" ? "" : "y")} className={btn(v === "y")}>예</button>
        <button type="button" aria-pressed={v === "n"} onClick={() => set(v === "n" ? "" : "n")} className={btn(v === "n")}>아니오</button>
      </span>
    </div>
  );
}

export default function Sapa() {
  const [s, setS] = useState<Saved>(EMPTY);
  const [ready, setReady] = useState(false);

  // 창(탭)을 닫으면 지워지도록 sessionStorage에 둔다. 예전 판의 localStorage 값은 지운다
  useEffect(() => {
    try {
      localStorage.removeItem(KEY);
    } catch {}
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) setS({ ...EMPTY, ...JSON.parse(raw) });
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      sessionStorage.setItem(KEY, JSON.stringify(s));
    } catch {}
  }, [s, ready]);

  const up = (p: Partial<Saved>) => setS((o) => ({ ...o, ...p }));
  const n = Number(s.n);
  const known = s.n.trim() !== "" && Number.isFinite(n) && n >= 0;
  const applies = known && n >= 5;
  const org = s.staff === "y" && (n >= 500 || s.top === "y");

  const list = DUTIES.filter((d) => (d.cond === "org" ? org : d.cond === "contract" ? s.contract !== "n" : true));
  const st = (id: string) => s.st[id] ?? "";
  const cnt = { ok: 0, no: 0, unk: 0, left: 0 };
  list.forEach((d) => {
    const v = st(d.id);
    if (v === "ok") cnt.ok++;
    else if (v === "no") cnt.no++;
    else if (v === "unk") cnt.unk++;
    else cnt.left++;
  });
  const gaps = list.filter((d) => st(d.id) === "no" || st(d.id) === "unk");
  const setSt = (id: string, v: St) => up({ st: { ...s.st, [id]: st(id) === v ? "" : v } });

  return (
    <>
      <section className="card no-print flex flex-col gap-1 p-5">
        <h2 className="m-0 mb-2 text-[18px] font-extrabold">1. 적용 확인</h2>
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3">
          <label htmlFor="n" className="min-w-0 flex-1 text-[15px]">상시 근로자 수</label>
          <span className="flex items-center gap-2">
            <input id="n" type="number" inputMode="numeric" min={0} className="field w-[120px] text-right" value={s.n} onChange={(e) => up({ n: e.target.value })} />
            <span className="text-[15px]">명</span>
          </span>
        </div>
        <Ask q="산업안전보건법상 두어야 하는 안전관리자·보건관리자·안전보건관리담당자·산업보건의가 합쳐 3명 이상" v={s.staff} set={(v) => up({ staff: v })} />
        <Ask q="토목건축공사업 시공능력 순위 상위 200위 이내 건설사업자" v={s.top} set={(v) => up({ top: v })} />
        <Ask q="도급·용역·위탁을 준다" v={s.contract} set={(v) => up({ contract: v })} />
        <Ask q="건설업 또는 조선업" v={s.cs} set={(v) => up({ cs: v })} />

        {known && (
        <div className={`mt-2 flex flex-col gap-1.5 rounded-md border-2 p-4 ${applies ? "border-accent" : "border-ink"}`} aria-live="polite">
          {applies ? (
            <>
              <p className="m-0 text-[18px] font-extrabold text-accent">중대산업재해 규정 적용</p>
              <p className="m-0 text-[14px] text-muted">법 제3조 · 상시 근로자 5명 이상 (50명 미만은 2024.1.27.부터)</p>
              <ul className="m-0 mt-1 flex list-none flex-col gap-1 p-0 text-[15px]">
                <li>점검할 의무 <b>{list.length}</b>가지 · 반기 1회 이상 <b>{list.filter((d) => d.half).length}</b>가지</li>
                <li>전담 조직 <b>{org ? "필요" : "의무 아님"}</b> <span className="text-[13px] text-muted">(영 제4조제2호)</span></li>
                {s.contract !== "n" && s.cs === "y" && <li>수급인 공사기간·건조기간 기준 <b>필요</b> <span className="text-[13px] text-muted">(영 제4조제9호다목)</span></li>}
              </ul>
            </>
          ) : (
            <>
              <p className="m-0 text-[18px] font-extrabold">중대산업재해 규정 적용 제외</p>
              <p className="m-0 text-[14px] text-muted">법 제3조 · 상시 근로자 5명 미만</p>
            </>
          )}
        </div>
        )}
      </section>

      {applies && (
        <section className="card print-only-area flex flex-col gap-3 p-5">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 className="m-0 text-[18px] font-extrabold">2. 이행 점검</h2>
            <p className="m-0 flex flex-wrap gap-x-3 text-[14px] text-muted" aria-live="polite">
              <span>이행 <b className="text-accent">{cnt.ok}</b></span>
              <span>미흡 <b className="text-danger">{cnt.no}</b></span>
              <span>모름 <b className="text-ink">{cnt.unk}</b></span>
              <span>남음 <b className="text-ink">{cnt.left}</b></span>
            </p>
          </div>
          <ol className="m-0 flex list-none flex-col p-0">
            {list.map((d, i) => {
              const v = st(d.id);
              return (
                <li key={d.id} className="flex flex-col gap-2 border-t border-line-soft py-3 sm:flex-row sm:items-center sm:gap-4">
                  <span className="flex min-w-0 flex-1 gap-3">
                    <span className="w-6 shrink-0 pt-0.5 text-right text-[14px] font-bold text-muted">{i + 1}</span>
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="text-[15px] leading-snug font-semibold">
                        {d.text}
                        {d.id === "d10" && s.cs === "y" && ", 공사·건조기간 기준"}
                      </span>
                      <span className="text-[13px] text-muted">
                        {d.law}
                        {d.half && <b className="ml-1.5 text-ink">반기 1회 이상</b>}
                      </span>
                    </span>
                  </span>
                  <span className="no-print flex gap-1.5 pl-9 sm:pl-0" role="group" aria-label={d.text}>
                    <button type="button" aria-pressed={v === "ok"} onClick={() => setSt(d.id, "ok")} className={btn(v === "ok", "ok")}>이행</button>
                    <button type="button" aria-pressed={v === "no"} onClick={() => setSt(d.id, "no")} className={btn(v === "no", "no")}>미흡</button>
                    <button type="button" aria-pressed={v === "unk"} onClick={() => setSt(d.id, "unk")} className={btn(v === "unk", "unk")}>모름</button>
                  </span>
                  <span className="hidden text-[14px] font-bold print:inline">{v === "ok" ? "이행" : v === "no" ? "미흡" : v === "unk" ? "모름" : "-"}</span>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {applies && (
        <section className="card flex flex-col gap-3 p-5">
          <h2 className="m-0 text-[18px] font-extrabold">3. 손볼 것 <span className="text-danger">{gaps.length}</span></h2>
          {gaps.length === 0 ? (
            <p className="m-0 text-[15px] text-muted">{cnt.left > 0 ? `남음 ${cnt.left}` : "미흡·모름 없음"}</p>
          ) : (
            <ul className="m-0 flex list-none flex-col p-0">
              {gaps.map((d) => (
                <li key={d.id} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-line-soft py-2.5 first:border-t-0">
                  <span className="min-w-0 flex-1 text-[15px]">
                    <b className={st(d.id) === "no" ? "mr-1.5 text-danger" : "mr-1.5 text-muted"}>{st(d.id) === "no" ? "미흡" : "모름"}</b>
                    {d.text} <span className="text-[13px] text-muted">{d.law}</span>
                  </span>
                  {d.form && <Link href={d.form.href} className="no-print shrink-0 text-[14px] font-bold">{d.form.label} 양식 →</Link>}
                </li>
              ))}
            </ul>
          )}
          <div className="no-print flex flex-wrap gap-2 pt-1">
            <button type="button" onClick={() => window.print()} className="min-h-[44px] cursor-pointer rounded-md bg-ink px-[18px] text-[15px] font-bold text-white">인쇄</button>
            <Link href="/library/sapa-half-year-set/" className="inline-flex min-h-[44px] items-center rounded-md border border-ink px-[18px] text-[15px] font-bold text-ink hover:no-underline">반기 점검 세트 내려받기</Link>
            <button type="button" onClick={() => setS(EMPTY)} className="min-h-[44px] cursor-pointer rounded-md border border-line bg-white px-[18px] text-[15px] text-ink">처음부터</button>
          </div>
        </section>
      )}

      <p className="m-0 text-[13px] text-muted">중대재해처벌법 시행령 2025.10.1. 시행본 기준 · 2026.11.20 확인 · 입력값은 창을 닫으면 삭제</p>
    </>
  );
}
