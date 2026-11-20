import type { ReactNode } from "react";

/** 목록 페이지 맨 위 제목 띠 */
export default function PageHero({ title, desc, children }: { theme?: string; title: string; desc?: ReactNode; children?: ReactNode }) {
  return (
    <div className="no-print border-b border-line-soft bg-white">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-1.5 px-4 pt-8 pb-6 sm:px-5 sm:pt-10">
        <h1 className="m-0 text-[26px] leading-tight font-extrabold tracking-[-0.6px] sm:text-[32px]">{title}</h1>
        {desc && <p className="m-0 max-w-[640px] text-[16px] leading-relaxed text-muted">{desc}</p>}
        {children}
      </div>
    </div>
  );
}
