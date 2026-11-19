import type { ReactNode } from "react";

/** 광고 슬롯. 지시서 8장 키를 그대로 쓴다. 1차 오픈에서는 아무것도 그리지 않는다. */
export type AdSlotKey = "top_banner" | "side_main" | "side_msds" | "side_law" | "post_bottom" | "edu_inline" | "tool_bottom";
export function AdSlot({ slot }: { slot: AdSlotKey }) {
  void slot;
  return null;
}

/** 지시서 10장 검증 필요 항목에 붙이는 표시 */
export function Unverified({ label = "검증 전" }: { label?: string }) {
  return (
    <span className="ml-1.5 inline-block whitespace-nowrap rounded border border-warn-line bg-warn-bg px-1.5 py-px align-middle text-[13px] font-bold text-warn-ink">
      {label}
    </span>
  );
}

export function Soon() {
  return (
    <span className="ml-1 inline-block whitespace-nowrap rounded bg-[#e3e8eb] px-1.5 py-px align-middle text-[11px] font-bold text-muted">
      준비 중
    </span>
  );
}

export function Notice({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-md border border-warn-line bg-warn-bg px-4 py-3 text-[15px] leading-relaxed text-warn-ink">{children}</div>
  );
}

export function PageTitle({ title, desc }: { title: string; desc?: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <h1 className="m-0 text-[24px] font-extrabold tracking-[-0.5px] sm:text-[28px]">{title}</h1>
      {desc && <p className="m-0 text-[16px] text-muted">{desc}</p>}
    </div>
  );
}

export function SectionCard({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`card flex flex-col gap-3.5 p-[18px] sm:px-5 ${className}`}>
      {children}
    </section>
  );
}
