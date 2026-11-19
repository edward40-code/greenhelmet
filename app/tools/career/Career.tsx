"use client";

import { useState } from "react";

type Row = { name: string; s: string; e: string };

function ymd(s: string, e: string) {
  if (!s || !e) return null;
  const a = new Date(s + "T00:00:00");
  const b = new Date(e + "T00:00:00");
  if (isNaN(+a) || isNaN(+b) || b < a) return null;
  b.setDate(b.getDate() + 1); // 퇴사일 포함
  let y = b.getFullYear() - a.getFullYear();
  let m = b.getMonth() - a.getMonth();
  let d = b.getDate() - a.getDate();
  if (d < 0) {
    m -= 1;
    d += new Date(b.getFullYear(), b.getMonth(), 0).getDate();
  }
  if (m < 0) {
    y -= 1;
    m += 12;
  }
  return { y, m, d, days: Math.round((+b - +a) / 86400000), a: +a, b: +b };
}

const txt = (p: { y: number; m: number; d: number }) => `${p.y}년 ${p.m}개월 ${p.d}일`;
const COLS = "minmax(0,2fr) minmax(0,1.4fr) minmax(0,1.4fr) minmax(0,1.4fr) 44px";

export default function Career() {
  const [rows, setRows] = useState<Row[]>([
    { name: "", s: "2019-03-04", e: "2021-08-31" },
    { name: "", s: "2021-09-13", e: "2024-12-31" },
    { name: "", s: "", e: "" },
  ]);

  let Y = 0, M = 0, D = 0, days = 0;
  const spans: [number, number][] = [];
  const view = rows.map((r) => {
    const p = ymd(r.s, r.e);
    if (p) {
      Y += p.y; M += p.m; D += p.d; days += p.days;
      spans.push([p.a, p.b]);
    }
    return p ? txt(p) : "-";
  });
  M += Math.floor(D / 30); D = D % 30;
  Y += Math.floor(M / 12); M = M % 12;
  let overlap = false;
  for (let i = 0; i < spans.length; i++)
    for (let j = i + 1; j < spans.length; j++)
      if (spans[i][0] < spans[j][1] && spans[j][0] < spans[i][1]) overlap = true;

  const upd = (i: number, k: keyof Row, v: string) => setRows((p) => p.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
  const del = (i: number) => setRows((p) => (p.length > 1 ? p.filter((_, j) => j !== i) : [{ name: "", s: "", e: "" }]));

  return (
    <>
      <section className="card flex flex-col gap-3 p-4 sm:p-5">
        <div className="hidden gap-2 text-[14px] font-bold text-muted sm:grid" style={{ gridTemplateColumns: COLS }}>
          <span>근무처</span><span>입사일</span><span>퇴사일</span><span>기간</span><span />
        </div>
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-2 items-center gap-2 border-b border-line-soft pb-3 sm:border-0 sm:pb-0 sm:[grid-template-columns:var(--cols)]" style={{ ["--cols" as string]: COLS }}>
            <input type="text" className="field col-span-2 sm:col-span-1" aria-label={`근무처 ${i + 1}`} placeholder={`근무처 ${i + 1}`} value={r.name} onChange={(e) => upd(i, "name", e.target.value)} />
            <input type="date" className="field" aria-label={`입사일 ${i + 1}`} value={r.s} onChange={(e) => upd(i, "s", e.target.value)} />
            <input type="date" className="field" aria-label={`퇴사일 ${i + 1}`} value={r.e} onChange={(e) => upd(i, "e", e.target.value)} />
            <span className="text-[15px] font-bold">{view[i]}</span>
            <button type="button" onClick={() => del(i)} aria-label={`근무처 ${i + 1} 삭제`} className="h-[44px] w-[44px] justify-self-end rounded-md border border-field bg-white text-[18px] text-muted cursor-pointer">×</button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setRows((p) => [...p, { name: "", s: "", e: "" }])}
          className="min-h-[44px] self-start rounded-md border border-dashed border-accent bg-white px-4 text-[15px] font-bold text-accent cursor-pointer"
        >
          근무처 추가
        </button>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-md bg-accent p-6 text-white" aria-live="polite">
        <div className="flex flex-col gap-1">
          <span className="text-[15px] text-[#dff0e4]">총 경력</span>
          <span className="text-[30px] font-extrabold tracking-[-0.5px] sm:text-[36px]">{`${Y}년 ${M}개월 ${D}일`}</span>
        </div>
        <span className="text-[16px] text-[#dff0e4]">일수 합계 {days.toLocaleString("ko-KR")}일</span>
      </section>

      {overlap && (
        <div className="rounded-md border border-warn-line bg-warn-bg px-4 py-3 text-[15px] leading-relaxed text-warn-ink">
          겹치는 기간이 있습니다.
        </div>
      )}

      <p className="m-0 text-[14px] leading-[1.7] text-muted">
        입사일·퇴사일 포함 · 30일 = 1개월, 12개월 = 1년
      </p>
    </>
  );
}
