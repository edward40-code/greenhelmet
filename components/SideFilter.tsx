"use client";

import type { ReactNode } from "react";

/** 목록 화면 공통: PC(lg)는 왼쪽 세로 메뉴 + 오른쪽 목록, 휴대폰은 위에 가로 스크롤 필터 */
export function FilterLayout({ side, children }: { side: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[232px_minmax(0,1fr)] lg:items-start lg:gap-5">
      <aside aria-label="목록 거르기" className="card flex flex-col gap-4 p-4 lg:sticky lg:top-[72px] lg:max-h-[calc(100vh-88px)] lg:overflow-y-auto lg:p-3 [scrollbar-width:thin]">
        {side}
      </aside>
      <div className="flex min-w-0 flex-col gap-3">{children}</div>
    </div>
  );
}

/** 필터 묶음: 휴대폰은 가로로 밀어 보는 줄, PC는 세로 목록 */
export function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div role="group" aria-label={title} className="flex flex-col gap-1.5">
      <span className="px-1 text-[12px] font-bold tracking-wide text-muted">{title}</span>
      <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 lg:mx-0 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-0">{children}</div>
    </div>
  );
}

const TONE = {
  accent: "border-accent bg-accent text-white",
  danger: "border-danger bg-danger text-white",
  ink: "border-ink bg-ink text-white",
};

export function Opt({ on, dim, onClick, label, n, dot, tone }: { on: boolean; dim?: boolean; onClick: () => void; label: string; n?: number; dot?: string; tone: keyof typeof TONE }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`flex min-h-[38px] shrink-0 items-center gap-2 rounded-md border px-3.5 text-[14px] whitespace-nowrap cursor-pointer lg:w-full lg:rounded-lg lg:px-2.5 lg:text-left ${
        on ? `${TONE[tone]} font-bold` : dim ? "border-line bg-white text-[#9aa5ab] lg:border-transparent lg:bg-transparent" : "border-line bg-white text-ink hover:border-ink lg:border-transparent lg:bg-transparent lg:hover:bg-bg"
      }`}
    >
      {dot && <span aria-hidden="true" className="hidden h-2 w-2 shrink-0 rounded-full lg:inline-block" style={{ background: on ? "#fff" : dot }} />}
      <span className="lg:flex-1">{label}</span>
      {n !== undefined && <span className={`text-[12px] ${on ? "opacity-85" : "text-muted"}`}>{n}</span>}
    </button>
  );
}

/** 지금 보고 있는 조건과 건수. 흰 카드 위에 올려 배경색 띠 위에서도 읽히게 한다 */
export function ResultHead({ count, unit = "건", active }: { count: number; unit?: string; active: string[] }) {
  return (
    <div className="card flex flex-wrap items-center gap-2 px-4 py-3 text-[14px]" aria-live="polite">
      <span className="font-bold text-ink">현재 보기</span>
      {active.length === 0 ? (
        <span className="rounded-full bg-bg px-2.5 py-0.5 text-ink">전체</span>
      ) : (
        active.map((a) => (
          <span key={a} className="rounded-full bg-accent-soft px-2.5 py-0.5 font-semibold text-accent">{a}</span>
        ))
      )}
      <span className="ml-auto text-muted"><b className="text-[16px] text-ink">{count}</b>{unit}</span>
    </div>
  );
}
