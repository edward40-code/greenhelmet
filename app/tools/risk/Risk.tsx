"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import data from "@/content/risk-templates.json";
import { buildXlsx, downloadBlob, XS, type XRow } from "@/lib/xlsx";
import type { RiskCase } from "@/lib/riskCases";
import { COMPARE, COMPARE_HEAD, GUIDE_NOTE, GUIDE_STEPS, SCALE } from "@/lib/riskGuide";

type MT = "e" | "g" | "a" | "p";
type Work = { id: string; name: string; hazards: { h: string; k: string; s: number; m: [MT, string, string][] }[] };
type Measure = { t: MT; x: string; b: string; on: boolean };
type L3 = "" | "하" | "중" | "상";
type Row = {
  id: string;
  work: string;
  h: string;
  k: string;
  on: boolean;
  custom: boolean;
  p: number;
  s: number;
  l: L3;
  ms: Measure[];
  extra: string;
  who: string;
  due: string;
  p2: number;
  s2: number;
  l2: L3;
};
type Person = { name: string; role: string; st: boolean[] };
type Info = { site: string; proc: string; date: string; kind: string; method: "fs" | "l3"; lead: string };
type Saved = { info: Info; works: string[]; rows: Row[]; people: Person[]; share: string[]; shareDate: string };

const WORKS = (data as unknown as { works: Work[] }).works;
const TYPES = (data as { types: Record<MT, string> }).types;
const KEY = "gh-risk-v1";
const KINDS = ["최초", "정기", "수시", "상시"];
const ROLES = ["근로자", "근로자대표", "관리감독자", "안전·보건관리자", "기타"];
const STAGES = ["요인 파악", "위험성 결정", "대책 수립", "개선 후 확인"];
const SHARE = ["안전보건교육", "설명회", "게시", "문서 전달", "TBM 등 정기 회의", "전자적 방법", "그 밖의 방법"];
const blankPerson = (): Person => ({ name: "", role: "근로자", st: [false, false, false, false] });
const EMPTY: Saved = {
  info: { site: "", proc: "", date: "", kind: "정기", method: "fs", lead: "" },
  works: [],
  rows: [],
  people: [blankPerson(), blankPerson(), blankPerson()],
  share: [],
  shareDate: "",
};

let seq = 0;
const uid = () => `r${Date.now().toString(36)}${(seq++).toString(36)}`;

function fromTemplate(w: Work): Row[] {
  return w.hazards.map((z) => ({
    id: uid(),
    work: w.id,
    h: z.h,
    k: z.k,
    on: true,
    custom: false,
    p: 0,
    s: z.s,
    l: "",
    ms: z.m.map(([t, x, b]) => ({ t, x, b, on: true })),
    extra: "",
    who: "",
    due: "",
    p2: 0,
    s2: 0,
    l2: "",
  }));
}
const customRow = (work: string, k = ""): Row => ({
  id: uid(), work, h: "", k, on: true, custom: true, p: 0, s: 0, l: "", ms: [], extra: "", who: "", due: "", p2: 0, s2: 0, l2: "",
});

type Level = { label: string; score: string; rank: number };
function level(method: Info["method"], p: number, s: number, l: L3): Level | null {
  if (method === "l3") {
    if (!l) return null;
    const m = { 하: ["낮음", 1], 중: ["보통", 2], 상: ["높음", 3] } as const;
    return { label: m[l][0], score: l, rank: m[l][1] };
  }
  if (!p || !s) return null;
  const v = p * s;
  return v <= 2 ? { label: "낮음", score: String(v), rank: 1 } : v <= 4 ? { label: "보통", score: String(v), rank: 2 } : { label: "높음", score: String(v), rank: 3 };
}
const lvCls = (r?: number) => (r === 3 ? "font-extrabold text-danger" : r === 2 ? "font-bold text-ink" : "text-muted");

const pill = (on: boolean) =>
  `inline-flex min-h-[38px] min-w-[38px] shrink-0 cursor-pointer items-center justify-center rounded-md border px-2.5 text-[14px] ${
    on ? "border-accent bg-accent font-bold text-white" : "border-line bg-white text-ink hover:border-ink"
  }`;

function Pick({ label, v, set, opts }: { label: string; v: number | string; set: (v: never) => void; opts: (number | string)[] }) {
  return (
    <span className="flex items-center gap-1.5" role="group" aria-label={label}>
      <span className="w-[44px] shrink-0 text-[13px] font-bold text-muted">{label}</span>
      {opts.map((o) => (
        <button key={o} type="button" aria-pressed={v === o} onClick={() => (set as (x: number | string) => void)(v === o ? (typeof o === "number" ? 0 : "") : o)} className={pill(v === o)}>
          {o}
        </button>
      ))}
    </span>
  );
}

function Grade({ method, p, s, l, setP, setS, setL }: { method: Info["method"]; p: number; s: number; l: L3; setP: (v: number) => void; setS: (v: number) => void; setL: (v: L3) => void }) {
  const lv = level(method, p, s, l);
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      {method === "fs" ? (
        <>
          <Pick label="가능성" v={p} set={setP as (v: never) => void} opts={[1, 2, 3]} />
          <Pick label="중대성" v={s} set={setS as (v: never) => void} opts={[1, 2, 3]} />
        </>
      ) : (
        <Pick label="수준" v={l} set={setL as (v: never) => void} opts={["하", "중", "상"]} />
      )}
      <span className={`min-w-[64px] text-[15px] ${lvCls(lv?.rank)}`}>{lv ? (method === "fs" ? `${lv.score} · ${lv.label}` : lv.label) : "—"}</span>
    </div>
  );
}

export default function Risk({ cases }: { cases: Record<string, RiskCase[]> }) {
  const [d, setD] = useState<Saved>(EMPTY);
  const [ready, setReady] = useState(false);
  const [wipe, setWipe] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) setD({ ...EMPTY, ...JSON.parse(raw) });
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      sessionStorage.setItem(KEY, JSON.stringify(d));
    } catch {}
  }, [d, ready]);

  const info = d.info;
  const setInfo = (p: Partial<Info>) => setD((o) => ({ ...o, info: { ...o.info, ...p } }));
  const upRow = (id: string, p: Partial<Row>) => setD((o) => ({ ...o, rows: o.rows.map((r) => (r.id === id ? { ...r, ...p } : r)) }));
  const delRow = (id: string) => setD((o) => ({ ...o, rows: o.rows.filter((r) => r.id !== id) }));
  const addRow = (work: string, k = "") => setD((o) => ({ ...o, rows: [...o.rows, customRow(work, k)] }));

  const toggleWork = (w: Work) =>
    setD((o) =>
      o.works.includes(w.id)
        ? { ...o, works: o.works.filter((x) => x !== w.id), rows: o.rows.filter((r) => r.work !== w.id) }
        : { ...o, works: [...o.works, w.id], rows: [...o.rows, ...fromTemplate(w)] },
    );

  const groups = useMemo(() => {
    const g: { id: string; name: string; rows: Row[] }[] = d.works.map((id) => ({ id, name: WORKS.find((w) => w.id === id)?.name ?? id, rows: [] }));
    g.push({ id: "etc", name: "기타·아차사고", rows: [] });
    d.rows.forEach((r) => (g.find((x) => x.id === r.work) ?? g[g.length - 1]).rows.push(r));
    return g;
  }, [d.works, d.rows]);

  const used = d.rows.filter((r) => r.on && r.h.trim());
  const counts = [3, 2, 1].map((rank) => used.filter((r) => level(info.method, r.p, r.s, r.l)?.rank === rank).length);
  const ungraded = used.filter((r) => !level(info.method, r.p, r.s, r.l)).length;

  const measureText = (r: Row) =>
    [...r.ms.filter((m) => m.on).map((m) => `[${TYPES[m.t]}] ${m.x}`), ...(r.extra.trim() ? r.extra.trim().split("\n").filter(Boolean) : [])].join("\n");
  const basisText = (r: Row) => Array.from(new Set(r.ms.filter((m) => m.on).map((m) => m.b))).join("\n");
  const workName = (r: Row) => (r.work === "etc" ? r.k === "아차사고" ? "아차사고" : "기타" : WORKS.find((w) => w.id === r.work)?.name ?? "");

  function exportXlsx() {
    const fs = info.method === "fs";
    const kindLine = KINDS.map((k) => `${info.kind === k ? "■" : "□"} ${k}`).join("  ");
    const head = ["번호", "작업", "유해·위험요인", "재해 유형", fs ? "가능성" : "-", fs ? "중대성" : "-", "위험성", "개선대책", "근거", "담당", "완료 예정", fs ? "개선 후\n가능성" : "-", fs ? "개선 후\n중대성" : "-", "개선 후\n위험성", "근로자\n확인"];
    const rows: XRow[] = [
      { cells: [{ v: "위험성평가표", s: XS.title }], h: 26 },
      { cells: [] },
      { cells: ["사업장", info.site, null, "공정·작업", info.proc, null, null, "평가일", info.date, "구분", kindLine, null, null, null, null], s: XS.box, h: 22 },
      { cells: ["평가 방법", fs ? "빈도·강도법 (3×3)" : "위험성 수준 3단계 판단법", null, "총괄 책임자", info.lead, null, null, "위험성", `높음 ${counts[0]} · 보통 ${counts[1]} · 낮음 ${counts[2]}`, null, null, null, null, null, null], s: XS.box, h: 22 },
      { cells: [] },
      { cells: head, s: XS.head, h: 32 },
    ];
    used.forEach((r, i) => {
      const a = level(info.method, r.p, r.s, r.l);
      const b = level(info.method, r.p2, r.s2, r.l2);
      const mt = measureText(r);
      const lines = Math.max(mt.split("\n").length, basisText(r).split("\n").length, Math.ceil(r.h.length / 14), 1);
      rows.push({
        cells: [
          { v: i + 1, s: XS.center },
          { v: workName(r), s: XS.center },
          r.h,
          { v: r.k, s: XS.center },
          { v: fs ? r.p || null : null, s: XS.center },
          { v: fs ? r.s || null : null, s: XS.center },
          { v: a ? (fs ? `${a.score} ${a.label}` : `${r.l} ${a.label}`) : null, s: XS.center },
          mt,
          basisText(r),
          { v: r.who, s: XS.center },
          { v: r.due, s: XS.center },
          { v: fs ? r.p2 || null : null, s: XS.center },
          { v: fs ? r.s2 || null : null, s: XS.center },
          { v: b ? (fs ? `${b.score} ${b.label}` : `${r.l2} ${b.label}`) : null, s: XS.center },
          { v: null, s: XS.center },
        ],
        s: XS.box,
        h: Math.max(30, lines * 14 + 6),
      });
    });
    const n = rows.length;
    rows.push({ cells: [] });
    rows.push({
      cells: [
        {
          v: fs
            ? "판단 기준 (현장 권장): 가능성 1 낮음 · 2 보통 · 3 높음 / 중대성 1 경미(치료 불필요) · 2 중간(휴업 재해) · 3 중대(사망·영구장해) / 위험성 = 가능성 × 중대성, 1~2 허용 · 3~4 개선 · 6~9 즉시 개선. 위험성은 사업장이 정한 기준으로 결정합니다 (사업장 위험성평가에 관한 지침 제11조)."
            : "판단 기준 (현장 권장): 하 허용 · 중 개선 · 상 즉시 개선. 위험성은 사업장이 정한 기준으로 결정합니다 (사업장 위험성평가에 관한 지침 제11조).",
          s: XS.note,
        },
      ],
      h: 30,
    });
    rows.push({
      cells: [{ v: "대책은 ① 제거·대체 ② 공학적 ③ 관리적 ④ 보호구 순서로 검토합니다 (지침 제12조제1항). '근로자 확인'은 개선 후 위험성이 허용 가능한 수준인지 근로자가 함께 확인한 표시입니다 (지침 제6조제1항제4호). 그린헬멧기사 greenhelmet.co.kr", s: XS.note }],
      h: 30,
    });
    const merges = ["A1:O1", "B3:C3", "E3:G3", "K3:O3", "B4:C4", "E4:G4", "I4:O4", `A${n + 2}:O${n + 2}`, `A${n + 3}:O${n + 3}`];

    const p: XRow[] = [
      { cells: [{ v: "위험성평가 참여·공유 기록", s: XS.title }], h: 26 },
      { cells: [] },
      { cells: ["번호", "성명", "구분", ...STAGES, "서명"], s: XS.head, h: 28 },
      ...d.people
        .filter((x) => x.name.trim())
        .concat(Array.from({ length: Math.max(0, 6 - d.people.filter((x) => x.name.trim()).length) }, blankPerson).map((x) => ({ ...x, role: "" })))
        .map((x, i) => ({
          cells: [{ v: i + 1, s: XS.center }, x.name, { v: x.role, s: XS.center }, ...x.st.map((v) => ({ v: v ? "○" : null, s: XS.center })), null],
          s: XS.box,
          h: 24,
        })),
    ];
    const pn = p.length;
    p.push({ cells: [] });
    p.push({ cells: ["결과 공유", null, null, null, null, null, null, null], s: XS.head, h: 22 });
    p.push({ cells: ["공유일", d.shareDate, "방법", SHARE.map((x) => `${d.share.includes(x) ? "■" : "□"} ${x}`).join("  "), null, null, null, null], s: XS.box, h: 36 });
    p.push({ cells: [] });
    p.push({
      cells: [{ v: "참여 단계는 지침 제6조제1항 각 호입니다. 근로자대표가 요구하면 참여시켜야 합니다 (지침 제7조). 결과는 근로자에게 알리고 (시행규칙 제37조의3, 지침 제17조), 기록은 개선대책 수립을 마친 다음 날부터 3년간 보존합니다 (시행규칙 제37조의4, 지침 제21조).", s: XS.note }],
      h: 40,
    });
    const pm = [`A1:H1`, `A${pn + 2}:H${pn + 2}`, `D${pn + 3}:H${pn + 3}`, `A${pn + 5}:H${pn + 5}`];

    const g: XRow[] = [
      { cells: [{ v: "위험성평가 작성 방법", s: XS.title }], h: 26 },
      { cells: [] },
      { cells: [{ v: "판단 방법 비교", s: XS.title }], h: 22 },
      { cells: COMPARE_HEAD, s: XS.head, h: 22 },
      ...COMPARE.map((r) => ({ cells: [{ v: r[0], s: XS.head }, r[1], r[2]], s: XS.box, h: 44 })),
      { cells: [{ v: GUIDE_NOTE, s: XS.note }], h: 28 },
      { cells: [] },
      { cells: [{ v: "판단 기준 예시 (현장 권장)", s: XS.title }], h: 22 },
      ...SCALE.map(([k, v]) => ({ cells: [{ v: k, s: XS.head }, v, null], s: XS.box, h: 36 })),
      { cells: [] },
      { cells: [{ v: "작성 순서", s: XS.title }], h: 22 },
      ...GUIDE_STEPS.map((st, i) => ({
        cells: [{ v: `${i + 1}. ${st.title}`, s: XS.head }, st.items.map((t) => `· ${t}`).join("\n"), null],
        s: XS.box,
        h: Math.max(30, st.items.reduce((a, t) => a + Math.ceil(t.length / 62), 0) * 14 + 8),
      })),
    ];
    const gm: string[] = ["A1:C1", "A3:C3", `A${5 + COMPARE.length}:C${5 + COMPARE.length}`, `A${7 + COMPARE.length}:C${7 + COMPARE.length}`, `A${8 + COMPARE.length + SCALE.length + 1}:C${8 + COMPARE.length + SCALE.length + 1}`];
    SCALE.forEach((_, i) => gm.push(`B${8 + COMPARE.length + i}:C${8 + COMPARE.length + i}`));
    GUIDE_STEPS.forEach((_, i) => gm.push(`B${10 + COMPARE.length + SCALE.length + i}:C${10 + COMPARE.length + SCALE.length + i}`));

    const blob = buildXlsx([
      { name: "위험성평가표", cols: [5, 12, 24, 9, 7, 7, 9, 38, 22, 9, 11, 7, 7, 9, 7], rows, merges, landscape: true },
      { name: "참여·공유", cols: [6, 14, 14, 11, 11, 11, 11, 14], rows: p, merges: pm },
      { name: "작성 방법", cols: [22, 52, 52], rows: g, merges: gm },
    ]);
    downloadBlob(blob, `위험성평가표_${info.date || new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  const fs = info.method === "fs";

  return (
    <>
      <style>{"@media print{@page{size:A4 landscape;margin:18mm 12mm 14mm}}"}</style>
      <section aria-label="기본 정보" className="card no-print flex flex-col gap-3.5 px-5 py-[18px]">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="m-0 text-[16px] font-extrabold">1. 기본 정보</h2>
          <a href="#guide" className="text-[14px] font-bold">작성 설명서</a>
        </div>
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(220px, 100%), 1fr))" }}>
          <label className="flex flex-col gap-1.5 text-[14px] font-bold">사업장<input className="field font-normal" value={info.site} onChange={(e) => setInfo({ site: e.target.value })} /></label>
          <label className="flex flex-col gap-1.5 text-[14px] font-bold">공정·작업<input className="field font-normal" placeholder="예: 2공장 출하" value={info.proc} onChange={(e) => setInfo({ proc: e.target.value })} /></label>
          <label className="flex flex-col gap-1.5 text-[14px] font-bold">평가일<input type="date" className="field font-normal" value={info.date} onChange={(e) => setInfo({ date: e.target.value })} /></label>
          <label className="flex flex-col gap-1.5 text-[14px] font-bold">총괄 책임자<input className="field font-normal" value={info.lead} onChange={(e) => setInfo({ lead: e.target.value })} /></label>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          <span className="flex flex-wrap items-center gap-1.5" role="group" aria-label="평가 구분">
            <span className="mr-1 text-[14px] font-bold">구분</span>
            {KINDS.map((k) => (
              <button key={k} type="button" aria-pressed={info.kind === k} onClick={() => setInfo({ kind: k })} className={pill(info.kind === k)}>{k}</button>
            ))}
          </span>
          <span className="flex flex-wrap items-center gap-1.5" role="group" aria-label="평가 방법">
            <span className="mr-1 text-[14px] font-bold">방법</span>
            <button type="button" aria-pressed={fs} onClick={() => setInfo({ method: "fs" })} className={pill(fs)}>빈도·강도법 3×3</button>
            <button type="button" aria-pressed={!fs} onClick={() => setInfo({ method: "l3" })} className={pill(!fs)}>3단계 판단법</button>
          </span>
        </div>
        <details className="text-[14px] text-muted">
          <summary className="cursor-pointer font-bold text-ink">판단 기준</summary>
          {fs ? (
            <table className="mt-2 border-collapse text-[14px]">
              <tbody>
                <tr><th className="border border-line px-2 py-1 text-left">가능성</th><td className="border border-line px-2 py-1">1 낮음 · 2 보통 · 3 높음</td></tr>
                <tr><th className="border border-line px-2 py-1 text-left">중대성</th><td className="border border-line px-2 py-1">1 경미(치료 불필요) · 2 중간(휴업 재해) · 3 중대(사망·영구장해)</td></tr>
                <tr><th className="border border-line px-2 py-1 text-left">위험성</th><td className="border border-line px-2 py-1">가능성 × 중대성: 1~2 낮음(허용) · 3~4 보통(개선) · 6~9 높음(즉시 개선)</td></tr>
              </tbody>
            </table>
          ) : (
            <p className="m-0 mt-2">하 낮음(허용) · 중 보통(개선) · 상 높음(즉시 개선)</p>
          )}
          <p className="m-0 mt-2">현장 권장 예시 · 사업장이 정한 기준 사용 (지침 제11조)</p>
        </details>
      </section>

      <section aria-label="작업 선택" className="card no-print flex flex-col gap-3 px-5 py-[18px]">
        <h2 className="m-0 text-[16px] font-extrabold">2. 작업 선택 <span className="text-[14px] font-normal text-muted">여러 개 선택</span></h2>
        <div className="flex flex-wrap gap-2">
          {WORKS.map((w) => {
            const on = d.works.includes(w.id);
            return (
              <button key={w.id} type="button" aria-pressed={on} onClick={() => toggleWork(w)} className={`min-h-[46px] cursor-pointer rounded-md px-4 text-[15px] ${on ? "border-2 border-accent bg-accent font-bold text-white" : "border border-field bg-white text-ink"}`}>
                {w.name}
              </button>
            );
          })}
        </div>
      </section>

      <section aria-label="위험요인과 개선대책" className="card no-print flex flex-col gap-4 px-5 py-[18px]">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="m-0 text-[16px] font-extrabold">3. 위험요인 · 위험성 · 개선대책</h2>
          <span className="text-[14px] text-muted">
            높음 <b className="text-danger">{counts[0]}</b> · 보통 <b className="text-ink">{counts[1]}</b> · 낮음 <b>{counts[2]}</b>{ungraded ? ` · 미결정 ${ungraded}` : ""}
          </span>
        </div>
        {groups.map((g) =>
          g.id === "etc" && g.rows.length === 0 ? null : (
            <div key={g.id} className="flex flex-col gap-2">
              <h3 className="m-0 border-b border-line pb-1.5 text-[15px] font-extrabold">{g.name}</h3>
              {(cases[g.id]?.length ?? 0) > 0 && (
                <div className="flex flex-col gap-1 rounded-md bg-[#f4f7f5] px-3.5 py-2.5">
                  <span className="text-[13px] font-bold text-muted">최근 보도된 사고</span>
                  {cases[g.id].map((c) => (
                    <Link key={c.slug} href={`/accidents/${c.slug}/`} target="_blank" className="flex gap-2 text-[14px] leading-snug text-ink hover:text-accent hover:no-underline">
                      <span className="shrink-0 tabular-nums text-muted">{c.date.slice(5).replace("-", ".")}</span>
                      {c.kind && <span className="shrink-0 font-bold">{c.kind}</span>}
                      <span className="min-w-0">{c.text}</span>
                    </Link>
                  ))}
                </div>
              )}
              {g.rows.map((r) => (
                <div key={r.id} className={`flex flex-col gap-2.5 rounded-md border border-line-soft px-3.5 py-3 ${r.on ? "" : "opacity-50"}`}>
                  <div className="flex flex-wrap items-start gap-2.5">
                    <input type="checkbox" aria-label="평가에 포함" checked={r.on} onChange={(e) => upRow(r.id, { on: e.target.checked })} className="mt-3 h-5 w-5 shrink-0 accent-[#1b6b3a]" />
                    <input className="field min-w-0 flex-[1_1_200px] font-bold" placeholder={r.k === "아차사고" ? "아차사고 내용" : "유해·위험요인"} value={r.h} onChange={(e) => upRow(r.id, { h: e.target.value })} />
                    <input className="field w-[96px] shrink-0 text-[14px]" placeholder="재해 유형" value={r.k} onChange={(e) => upRow(r.id, { k: e.target.value })} />
                    {r.custom && (
                      <button type="button" aria-label="삭제" onClick={() => delRow(r.id)} className="min-h-[44px] shrink-0 cursor-pointer rounded-md border border-line bg-white px-3 text-[14px] text-muted hover:border-ink">삭제</button>
                    )}
                  </div>
                  {r.on && (
                    <>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pl-0 sm:pl-[30px]">
                        <span className="w-[56px] text-[14px] font-bold">현재</span>
                        <Grade method={info.method} p={r.p} s={r.s} l={r.l} setP={(v) => upRow(r.id, { p: v })} setS={(v) => upRow(r.id, { s: v })} setL={(v) => upRow(r.id, { l: v })} />
                      </div>
                      <div className="flex flex-col gap-1.5 pl-0 sm:pl-[30px]">
                        <span className="text-[14px] font-bold">개선대책</span>
                        {r.ms.map((m, i) => (
                          <label key={i} className="flex items-start gap-2.5 text-[15px] leading-snug">
                            <input type="checkbox" checked={m.on} onChange={(e) => upRow(r.id, { ms: r.ms.map((x, j) => (j === i ? { ...x, on: e.target.checked } : x)) })} className="mt-0.5 h-5 w-5 shrink-0 accent-[#1b6b3a]" />
                            <span className="min-w-0">
                              <span className="mr-1.5 text-[13px] font-bold text-muted">{TYPES[m.t]}</span>
                              {m.x}
                              <span className="ml-1.5 text-[13px] text-muted">{m.b}</span>
                            </span>
                          </label>
                        ))}
                        <textarea className="field min-h-[60px] py-2 text-[15px]" placeholder="추가 대책 (줄마다 하나)" value={r.extra} onChange={(e) => upRow(r.id, { extra: e.target.value })} />
                        <div className="flex flex-wrap gap-2">
                          <input className="field w-auto flex-[1_1_140px] text-[15px]" placeholder="담당" value={r.who} onChange={(e) => upRow(r.id, { who: e.target.value })} />
                          <label className="flex flex-[1_1_180px] items-center gap-2 text-[14px] font-bold">완료 예정<input type="date" className="field flex-1 font-normal" value={r.due} onChange={(e) => upRow(r.id, { due: e.target.value })} /></label>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pl-0 sm:pl-[30px]">
                        <span className="w-[56px] text-[14px] font-bold">개선 후</span>
                        <Grade method={info.method} p={r.p2} s={r.s2} l={r.l2} setP={(v) => upRow(r.id, { p2: v })} setS={(v) => upRow(r.id, { s2: v })} setL={(v) => upRow(r.id, { l2: v })} />
                      </div>
                    </>
                  )}
                </div>
              ))}
              {g.id !== "etc" && (
                <button type="button" onClick={() => addRow(g.id)} className="min-h-[42px] cursor-pointer self-start rounded-md border border-dashed border-field bg-white px-4 text-[14px] text-ink hover:border-ink">+ 위험요인 추가</button>
              )}
            </div>
          ),
        )}
        <div className="flex flex-wrap gap-2 border-t border-line-soft pt-3">
          <button type="button" onClick={() => addRow("etc")} className="min-h-[42px] cursor-pointer rounded-md border border-dashed border-field bg-white px-4 text-[14px] text-ink hover:border-ink">+ 기타 위험요인</button>
          <button type="button" onClick={() => addRow("etc", "아차사고")} className="min-h-[42px] cursor-pointer rounded-md border border-dashed border-field bg-white px-4 text-[14px] text-ink hover:border-ink">+ 아차사고 (지침 제10조③)</button>
        </div>
      </section>

      <section aria-label="참여자" className="card no-print flex flex-col gap-3 px-5 py-[18px]">
        <h2 className="m-0 text-[16px] font-extrabold">4. 참여자 <span className="text-[14px] font-normal text-muted">지침 제6조·제7조</span></h2>
        {d.people.map((x, i) => (
          <div key={i} className="flex flex-wrap items-center gap-2 border-b border-line-soft pb-2.5">
            <input className="field w-auto flex-[1_1_120px] text-[15px]" placeholder="성명" value={x.name} onChange={(e) => setD((o) => ({ ...o, people: o.people.map((y, j) => (j === i ? { ...y, name: e.target.value } : y)) }))} />
            <select className="field w-auto flex-[0_1_150px] text-[15px]" value={x.role} onChange={(e) => setD((o) => ({ ...o, people: o.people.map((y, j) => (j === i ? { ...y, role: e.target.value } : y)) }))}>
              {ROLES.map((r) => <option key={r}>{r}</option>)}
            </select>
            <span className="flex flex-wrap gap-1.5">
              {STAGES.map((st, k) => (
                <button key={st} type="button" aria-pressed={x.st[k]} onClick={() => setD((o) => ({ ...o, people: o.people.map((y, j) => (j === i ? { ...y, st: y.st.map((v, q) => (q === k ? !v : v)) } : y)) }))} className={pill(x.st[k])}>
                  {st}
                </button>
              ))}
            </span>
          </div>
        ))}
        <button type="button" onClick={() => setD((o) => ({ ...o, people: [...o.people, blankPerson()] }))} className="min-h-[42px] cursor-pointer self-start rounded-md border border-dashed border-field bg-white px-4 text-[14px] text-ink hover:border-ink">+ 참여자 추가</button>
      </section>

      <section aria-label="결과 공유" className="card no-print flex flex-col gap-3 px-5 py-[18px]">
        <h2 className="m-0 text-[16px] font-extrabold">5. 결과 공유 <span className="text-[14px] font-normal text-muted">지침 제17조</span></h2>
        <div className="flex flex-wrap gap-1.5">
          {SHARE.map((x) => {
            const on = d.share.includes(x);
            return (
              <button key={x} type="button" aria-pressed={on} onClick={() => setD((o) => ({ ...o, share: on ? o.share.filter((y) => y !== x) : [...o.share, x] }))} className={pill(on)}>{x}</button>
            );
          })}
        </div>
        <label className="flex max-w-[320px] items-center gap-2 text-[14px] font-bold">공유일<input type="date" className="field flex-1 font-normal" value={d.shareDate} onChange={(e) => setD((o) => ({ ...o, shareDate: e.target.value }))} /></label>
      </section>

      <section aria-label="내려받기" className="card no-print flex flex-wrap items-center gap-2 px-5 py-[18px]">
        <button type="button" disabled={used.length === 0} onClick={exportXlsx} className="min-h-[46px] cursor-pointer rounded-md bg-accent px-5 text-[15px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">엑셀 내려받기</button>
        <button type="button" disabled={used.length === 0} onClick={() => window.print()} className="min-h-[46px] cursor-pointer rounded-md bg-ink px-5 text-[15px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">인쇄·PDF</button>
        <Link href="/tools/tbm/" className="inline-flex min-h-[46px] items-center rounded-md border border-line bg-white px-4 text-[15px] text-ink hover:border-ink hover:no-underline">TBM 생성기</Link>
        <span className="ml-auto flex items-center gap-2">
          {wipe ? (
            <>
              <span className="text-[14px] text-muted">입력한 내용을 모두 지울까요?</span>
              <button type="button" onClick={() => { setD(EMPTY); setWipe(false); }} className="min-h-[42px] cursor-pointer rounded-md border border-danger bg-white px-3 text-[14px] font-bold text-danger">지우기</button>
              <button type="button" onClick={() => setWipe(false)} className="min-h-[42px] cursor-pointer rounded-md border border-line bg-white px-3 text-[14px]">취소</button>
            </>
          ) : (
            <button type="button" onClick={() => setWipe(true)} className="min-h-[42px] cursor-pointer rounded-md border border-line bg-white px-3 text-[14px] text-muted hover:border-ink">처음부터</button>
          )}
        </span>
      </section>

      <article aria-label="위험성평가표 인쇄본" className="print-only text-[11px] leading-snug">
        <h2 className="m-0 mb-2 pt-1 text-[18px] font-extrabold">위험성평가표</h2>
        <p className="m-0 mb-2">
          사업장 {info.site || "　　"} · 공정·작업 {info.proc || "　　"} · 평가일 {info.date || "　　"} · 구분 {info.kind} · 방법 {fs ? "빈도·강도법 3×3" : "3단계 판단법"} · 총괄 책임자 {info.lead || "　　"}
        </p>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["번호", "작업", "유해·위험요인", "유형", "위험성", "개선대책", "근거", "담당", "완료 예정", "개선 후", "근로자 확인"].map((h) => (
                <th key={h} className="border border-ink px-1 py-1 text-center">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {used.map((r, i) => {
              const a = level(info.method, r.p, r.s, r.l);
              const b = level(info.method, r.p2, r.s2, r.l2);
              return (
                <tr key={r.id} className="break-inside-avoid">
                  <td className="border border-ink px-1 py-1 text-center align-top">{i + 1}</td>
                  <td className="border border-ink px-1 py-1 align-top">{workName(r)}</td>
                  <td className="border border-ink px-1 py-1 align-top">{r.h}</td>
                  <td className="border border-ink px-1 py-1 text-center align-top">{r.k}</td>
                  <td className="border border-ink px-1 py-1 text-center align-top">{a ? (fs ? `${r.p}×${r.s}=${a.score} ${a.label}` : `${r.l} ${a.label}`) : ""}</td>
                  <td className="whitespace-pre-line border border-ink px-1 py-1 align-top">{measureText(r)}</td>
                  <td className="whitespace-pre-line border border-ink px-1 py-1 align-top">{basisText(r)}</td>
                  <td className="border border-ink px-1 py-1 align-top">{r.who}</td>
                  <td className="border border-ink px-1 py-1 align-top">{r.due}</td>
                  <td className="border border-ink px-1 py-1 text-center align-top">{b ? (fs ? `${r.p2}×${r.s2}=${b.score} ${b.label}` : `${r.l2} ${b.label}`) : ""}</td>
                  <td className="border border-ink px-1 py-1 align-top"></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <h3 className="m-0 mb-1 mt-3 text-[13px] font-extrabold">참여자</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr>{["성명", "구분", ...STAGES, "서명"].map((h) => <th key={h} className="border border-ink px-1 py-1">{h}</th>)}</tr>
          </thead>
          <tbody>
            {d.people.filter((x) => x.name.trim()).map((x, i) => (
              <tr key={i}>
                <td className="border border-ink px-1 py-1">{x.name}</td>
                <td className="border border-ink px-1 py-1 text-center">{x.role}</td>
                {x.st.map((v, k) => <td key={k} className="border border-ink px-1 py-1 text-center">{v ? "○" : ""}</td>)}
                <td className="w-[90px] border border-ink px-1 py-1"></td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="m-0 mt-2">결과 공유: {d.share.join(", ") || "　　"} · 공유일 {d.shareDate || "　　"}</p>
        <p className="m-0 mt-1 text-[10px]">판단 기준은 현장 권장 예시이며 사업장이 정한 기준을 사용합니다 (사업장 위험성평가에 관한 지침 제11조) · 그린헬멧기사 greenhelmet.co.kr</p>
      </article>
    </>
  );
}
