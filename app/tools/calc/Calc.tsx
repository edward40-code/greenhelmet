"use client";

import { useState } from "react";

const num = (v: string) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : NaN;
};
const fmt = (n: number, d: number) =>
  Number.isFinite(n) ? n.toLocaleString("ko-KR", { maximumFractionDigits: d, minimumFractionDigits: d }) : "-";

const MOLAR_VOLUME = 24.45; // 25℃, 1기압 (작업환경측정 고시 제20조제2항 계산식 1)

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
  // 근거(2026-11-19 국가법령정보센터 원문 대조):
  //  - 기준 90dB·5dB 반감·80dB 미만 제외: 작업환경측정 및 정도관리 등에 관한 고시 제26조제4호
  //  - TWA = 16.61 log(D/100) + 90: 같은 고시 제36조제4항 계산식 6
  //  - 90dB 8시간 ~ 115dB 15분, 115dB 초과 금지: 화학물질 및 물리적 인자의 노출기준 별표 2-1
  //  - 소음작업(85dB)·강렬한 소음작업: 산업안전보건기준에 관한 규칙 제512조
  let D = 0;
  let any = false;
  let over115 = false;
  let below80 = false;
  const valid: { L: number; h: number }[] = [];
  rows.forEach((r) => {
    const L = num(r.db);
    const h = num(r.h);
    if (Number.isFinite(L) && Number.isFinite(h) && h > 0) {
      any = true;
      valid.push({ L, h });
      if (L > 115) over115 = true;
      if (L < 80) below80 = true; // 80dB 미만은 노출량에 넣지 않는다
      else D += h / (8 / Math.pow(2, (L - 90) / 5));
    }
  });
  const dose = any ? D * 100 : NaN;
  const twa = any && D > 0 ? 16.61 * Math.log10(D) + 90 : NaN;
  // 16.61은 근삿값이라 85dB 8시간이 84.9999로 나오지 않게 화면에 보이는 자리(소수 1자리)로 맞춰 판정한다
  const twaR = Math.round(twa * 10) / 10;
  const doseR = Math.round(dose * 10) / 10;
  let noiseNote = "값을 넣으면 판정이 나옵니다.";
  if (any && D === 0) noiseNote = "80dB 미만만 입력되어 노출량이 0%입니다.";
  else if (Number.isFinite(twa)) {
    if (doseR > 100) noiseNote = "노출기준 초과: 8시간 시간가중평균이 90dB을 넘습니다. 개선 조치가 필요합니다.";
    else if (twaR >= 85) noiseNote = "8시간 기준 85dB 이상: 소음작업에 해당합니다. 청력보호구 지급·착용, 소음 수준 알림, 청력보존 프로그램 대상입니다.";
    else noiseNote = "8시간 기준 85dB 미만입니다.";
  }
  // 강렬한 소음작업: 해당 수준 이상의 소음이 정해진 시간 이상 (규칙 제512조제2호)
  const INTENSE: [number, number][] = [[90, 8], [95, 4], [100, 2], [105, 1], [110, 0.5], [115, 0.25]];
  const intense = INTENSE.some(([lv, hr]) => valid.filter((v) => v.L >= lv).reduce((s, v) => s + v.h, 0) >= hr);
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
          <h2 className="m-0 text-[20px] font-extrabold">가스·증기 농도 환산</h2>
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
          <br />
          근거: 「작업환경측정 및 정도관리 등에 관한 고시」 제20조제2항 계산식 1 (25℃, 1기압 기준 24.45). 가스·증기 노출기준은 ppm으로 표시합니다(「화학물질 및 물리적 인자의 노출기준」 제11조제1항).
        </p>
        <p className="m-0 rounded-md border border-warn-line bg-warn-bg px-3.5 py-2.5 text-[14px] leading-relaxed text-warn-ink">
          <strong>가스·증기에만 씁니다.</strong> 분진·흄·미스트 같은 입자상 물질은 mg/m³로만 측정하므로 ppm으로 바꾸지 않습니다.
        </p>
      </section>

      <section className="card flex flex-col gap-3.5 p-5">
        <div className="flex flex-col gap-1">
          <h2 className="m-0 text-[20px] font-extrabold">소음 노출량</h2>
          <p className="m-0 text-[14px] leading-relaxed text-muted">소음 수준별 노출 시간을 넣으면 하루 노출량(%)과 8시간 시간가중평균을 계산합니다.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[14px] font-bold">
          <span>소음 수준 (dB(A))</span>
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
        {intense && (
          <p className="m-0 text-[14px] leading-relaxed">
            <strong>강렬한 소음작업</strong>에 해당하는 구간이 있습니다(90dB 8시간, 95dB 4시간, 100dB 2시간, 105dB 1시간, 110dB 30분, 115dB 15분 이상). 기계 대체, 밀폐·흡음·격리 같은 소음 감소 조치 대상입니다.
          </p>
        )}
        {over115 && (
          <p className="m-0 rounded-md border border-warn-line bg-warn-bg px-3.5 py-2.5 text-[14px] leading-relaxed text-warn-ink">
            <strong>115dB(A)를 넘는 값이 있습니다.</strong> 노출기준은 115dB(A)를 넘는 소음에는 노출되지 않도록 정하고 있습니다.
          </p>
        )}
        {below80 && <p className="m-0 text-[14px] leading-relaxed text-muted">80dB 미만으로 넣은 구간은 노출량 계산에서 뺐습니다.</p>}
        <p className="m-0 text-[14px] leading-relaxed text-muted">
          90dB에 8시간, 5dB 오를 때마다 허용 시간 절반. 허용시간 T = 8 ÷ 2^((L − 90) ÷ 5), 노출량 D = Σ(노출시간 ÷ T) × 100, TWA = 16.61 × log(노출량 ÷ 100) + 90. 하루 8시간을 넘겨 일해도 노출량 100%가 기준입니다.
          <br />
          근거: 「작업환경측정 및 정도관리 등에 관한 고시」 제26조제4호(기준 90dB, 5dB 반감, 80dB 미만 제외)와 제36조제4항 계산식 6, 「화학물질 및 물리적 인자의 노출기준」 별표 2-1(90dB 8시간~115dB 15분), 「산업안전보건기준에 관한 규칙」 제512조·제513조·제514조·제516조·제517조.
        </p>
        <p className="m-0 rounded-md border border-warn-line bg-warn-bg px-3.5 py-2.5 text-[14px] leading-relaxed text-warn-ink">
          <strong>연속 소음을 미리 가늠해 보는 계산입니다.</strong> 충격소음은 기준이 따로 있고, 법정 평가는 작업환경측정 결과로 합니다.
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
