"use client";

import { useState } from "react";
import { QUESTIONS, TYPES, bestType, type TypeKey } from "@/lib/safetyTest";
import ResultCard from "./ResultCard";

const ZERO: Record<TypeKey, number> = { A: 0, B: 0, C: 0, D: 0 };

export default function SafetyTest() {
  const [i, setI] = useState(0);
  const [score, setScore] = useState(ZERO);
  const total = QUESTIONS.length;
  const playing = i < total;
  const cur = QUESTIONS[Math.min(i, total - 1)];

  if (!playing) {
    return <ResultCard result={TYPES[bestType(score)]} onRestart={() => { setI(0); setScore(ZERO); }} />;
  }

  return (
    <>
      <div className="flex flex-col gap-1.5 text-center">
        <h1 className="m-0 text-[26px] font-extrabold tracking-[-0.5px] sm:text-[28px]">나는 어떤 그린헬멧기사일까</h1>
        <p className="m-0 text-[16px] text-muted">여섯 문항, 1분이면 끝납니다.</p>
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-[14px] text-muted">{i + 1} / {total}</div>
        <div className="h-2 overflow-hidden rounded bg-line" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={i}>
          <div className="h-2 bg-accent transition-[width]" style={{ width: `${Math.round((i / total) * 100)}%` }} />
        </div>
      </div>
      <section className="flex flex-col gap-4 rounded-[10px] border border-line bg-white p-5 sm:p-7">
        <h2 className="m-0 text-[20px] leading-[1.45] font-extrabold sm:text-[22px]">{cur.text}</h2>
        <div className="flex flex-col gap-2.5">
          {cur.opts.map(([k, t]) => (
            <button
              key={t}
              type="button"
              onClick={() => { setScore((p) => ({ ...p, [k]: p[k] + 1 })); setI((p) => p + 1); }}
              className="min-h-[56px] rounded-lg border border-field bg-white px-[18px] py-3 text-left text-[16px] leading-normal text-ink cursor-pointer hover:border-accent hover:bg-accent-soft"
            >
              {t}
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
