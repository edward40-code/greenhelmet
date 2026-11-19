"use client";

import { useState } from "react";
import { Unverified } from "@/components/ui";

const num = (v: string) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : NaN;
};
const fmt = (n: number, d: number) =>
  Number.isFinite(n) ? n.toLocaleString("ko-KR", { maximumFractionDigits: d, minimumFractionDigits: d }) : "-";

const MOLAR_VOLUME = 24.45; // 25℃, 1기압. 지시서 10장 검증 필요 항목

function Field({ id, label, value, onChange, className = "" }: { id: string; label: string; value: string; onChange: (v: string) => void; className?: string }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-[14px] font-bold">{label}</label>
      <input id={id} type="number" inputMode="decimal" className="field" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Result({ label, value, size = 28 }: { label: string; value: string; size?: number }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <span className="text-[14px] text-accent-ink">{label}</span>
      <span className="font-extrabold break-all text-accent-dark" style={{ fontSize: size }}>{value}</span>
    </div>
  );
}

export default function Calc() {
  const [mode, setMode] = useState<"toMg" | "toPpm">("toMg");
  const [ppm, setPpm] = useState("50");
  const [mgIn, setMgIn] = useState("188.4");
  const [mw, setMw] = useState("92.14");
  const [rows, setRows] = useState([
    { db: "92", h: "4" },
    { db: "85", h: "4" },
    { db: "", h: "" },
  ]);
  const [wk, setWk] = useState("200");
  const [vc, setVc] = useState("3");
  const [cs, setCs] = useState("3");
  const [hr, setHr] = useState("480000");
  const [ls, setLs] = useState("45");

  // 농도 환산
  const mg = (num(ppm) * num(mw)) / MOLAR_VOLUME;
  const ppmOut = (num(mgIn) * MOLAR_VOLUME) / num(mw);

  // 소음 노출량
  let D = 0;
  let any = false;
  rows.forEach((r) => {
    const L = num(r.db);
    const h = num(r.h);
    if (Number.isFinite(L) && Number.isFinite(h) && h > 0) {
      any = true;
      D += h / (8 / Math.pow(2, (L - 90) / 5));
    }
  });
  const dose = any ? D * 100 : NaN;
  const twa = any && D > 0 ? 16.61 * Math.log10(D) + 90 : NaN;
  let noiseNote = "값을 넣으면 판정이 나옵니다.";
  if (Number.isFinite(twa)) {
    if (twa >= 90) noiseNote = "노출기준(90dB) 초과: 개선 조치가 필요합니다.";
    else if (twa >= 85) noiseNote = "85dB 이상: 소음작업에 해당합니다. 청력보존 대책을 확인하세요.";
    else noiseNote = "85dB 미만입니다.";
  }
  const setRow = (i: number, k: "db" | "h", v: string) => setRows((p) => p.map((x, j) => (j === i ? { ...x, [k]: v } : x)));

  // 재해 통계
  const rate = (num(vc) / num(wk)) * 100;
  const freq = (num(cs) / num(hr)) * 1000000;
  const sev = (num(ls) / num(hr)) * 1000;

  const tab = (on: boolean) =>
    `min-h-[44px] flex-1 rounded-md px-3 text-[15px] font-bold cursor-pointer border ${on ? "border-accent bg-accent text-white" : "border-field bg-white text-ink"}`;

  return (
    <div className="grid items-start gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(340px, 100%), 1fr))" }}>
      <section className="card flex flex-col gap-3.5 p-5">
        <div className="flex flex-col gap-1">
          <h2 className="m-0 text-[20px] font-extrabold">가스·증기 농도 환산<Unverified /></h2>
          <p className="m-0 text-[14px] leading-relaxed text-muted">공기 중 가스·증기 농도의 단위를 ppm과 mg/m³ 사이에서 바꿉니다.</p>
        </div>
        <div className="flex gap-2" role="group" aria-label="환산 방향">
          <button type="button" aria-pressed={mode === "toMg"} className={tab(mode === "toMg")} onClick={() => setMode("toMg")}>ppm → mg/m³</button>
          <button type="button" aria-pressed={mode === "toPpm"} className={tab(mode === "toPpm")} onClick={() => setMode("toPpm")}>mg/m³ → ppm</button>
        </div>
        {mode === "toMg" ? (
          <Field id="ppm" label="가스·증기 농도 (ppm)" value={ppm} onChange={setPpm} />
        ) : (
          <Field id="mgin" label="가스·증기 농도 (mg/m³)" value={mgIn} onChange={setMgIn} />
        )}
        <Field id="mw" label="분자량 (g/mol)" value={mw} onChange={setMw} />
        <div className="rounded-md bg-accent-soft p-4">
          <span className="block text-[14px] text-accent-ink">25℃, 1기압 기준</span>
          {mode === "toMg" ? (
            <span className="block text-[28px] font-extrabold text-accent-dark">{fmt(mg, 1)} mg/m³</span>
          ) : (
            <span className="block text-[28px] font-extrabold text-accent-dark">{fmt(ppmOut, 2)} ppm</span>
          )}
        </div>
        <p className="m-0 text-[14px] leading-relaxed text-muted">
          mg/m³ = ppm × 분자량 ÷ 24.45, ppm = mg/m³ × 24.45 ÷ 분자량. 처음 값은 톨루엔(분자량 92.14) 50ppm으로 넣은 계산 예시이며, 노출기준 값이 아닙니다.
        </p>
        <p className="m-0 rounded-md border border-warn-line bg-warn-bg px-3.5 py-2.5 text-[14px] leading-relaxed text-warn-ink">
          <strong>가스·증기에만 씁니다.</strong> 분진·흄·미스트 같은 입자상 물질은 mg/m³로만 측정하므로 ppm으로 바꾸지 않습니다.
        </p>
      </section>

      <section className="card flex flex-col gap-3.5 p-5">
        <h2 className="m-0 text-[20px] font-extrabold">소음 노출량<Unverified /></h2>
        <div className="grid grid-cols-2 gap-2 text-[14px] font-bold">
          <span>소음 수준 (dB)</span>
          <span>노출 시간 (h)</span>
        </div>
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-2 gap-2">
            <input type="number" inputMode="decimal" className="field" aria-label={`소음 수준 ${i + 1}`} value={r.db} onChange={(e) => setRow(i, "db", e.target.value)} />
            <input type="number" inputMode="decimal" className="field" aria-label={`노출 시간 ${i + 1}`} value={r.h} onChange={(e) => setRow(i, "h", e.target.value)} />
          </div>
        ))}
        <button
          type="button"
          onClick={() => setRows((p) => [...p, { db: "", h: "" }])}
          className="min-h-[44px] self-start rounded-md border border-dashed border-accent bg-white px-4 text-[15px] font-bold text-accent cursor-pointer"
        >
          행 추가
        </button>
        <div className="flex flex-wrap gap-x-6 gap-y-2 rounded-md bg-accent-soft p-4">
          <Result label="노출량" value={`${fmt(dose, 1)}%`} />
          <Result label="8시간 시간가중평균" value={`${fmt(twa, 1)} dB`} />
        </div>
        <p className="m-0 text-[15px] font-bold">{noiseNote}</p>
        <p className="m-0 text-[14px] leading-relaxed text-muted">
          90dB에 8시간, 5dB 오를 때마다 허용 시간 절반. 허용시간 T = 8 ÷ 2^((L − 90) ÷ 5), 노출량 D = Σ(노출시간 ÷ T) × 100, TWA = 16.61 × log(노출량 ÷ 100) + 90.
        </p>
      </section>

      <section className="card flex flex-col gap-3.5 p-5">
        <h2 className="m-0 text-[20px] font-extrabold">재해 통계</h2>
        <div className="grid grid-cols-2 gap-2.5">
          <Field id="wk" label="근로자 수" value={wk} onChange={setWk} />
          <Field id="vc" label="재해자 수" value={vc} onChange={setVc} />
          <Field id="cs" label="재해 건수" value={cs} onChange={setCs} />
          <Field id="hr" label="연 근로시간" value={hr} onChange={setHr} />
          <Field id="ls" label="근로손실일수" value={ls} onChange={setLs} className="col-span-2" />
        </div>
        <div className="grid grid-cols-3 gap-2 rounded-md bg-accent-soft p-4">
          <Result label="재해율" value={`${fmt(rate, 2)}%`} size={22} />
          <Result label="도수율" value={fmt(freq, 2)} size={22} />
          <Result label="강도율" value={fmt(sev, 2)} size={22} />
        </div>
        <p className="m-0 text-[14px] leading-relaxed text-muted">
          재해율 = 재해자 수 ÷ 근로자 수 × 100. 도수율 = 재해 건수 ÷ 연 근로시간 × 1,000,000. 강도율 = 근로손실일수 ÷ 연 근로시간 × 1,000.
        </p>
      </section>
    </div>
  );
}
