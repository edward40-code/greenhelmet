"use client";

import { FIELDS } from "@/lib/fields";

/** 분야 필터 칩. counts가 0인 분야는 흐리게 */
export default function FieldFilter({ value, onChange, counts }: { value: string; onChange: (v: string) => void; counts: Record<string, number> }) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const chip = (on: boolean, dim: boolean) =>
    `inline-flex min-h-[40px] items-center rounded-full border px-3.5 text-[14px] cursor-pointer ${
      on ? "border-accent bg-accent font-bold text-white" : dim ? "border-line bg-white text-[#8d9aa1]" : "border-line bg-white text-ink hover:border-accent"
    }`;
  return (
    <div role="group" aria-label="분야" className="flex flex-wrap gap-2">
      <button type="button" aria-pressed={value === "all"} className={chip(value === "all", false)} onClick={() => onChange("all")}>
        전체 <span className="ml-1 text-[12px] opacity-80">{total}</span>
      </button>
      {FIELDS.map((f) => (
        <button key={f.key} type="button" aria-pressed={value === f.key} className={chip(value === f.key, !counts[f.key])} onClick={() => onChange(f.key)}>
          {f.name} <span className="ml-1 text-[12px] opacity-80">{counts[f.key] ?? 0}</span>
        </button>
      ))}
    </div>
  );
}
