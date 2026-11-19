import type { ReactNode } from "react";
import { Icon } from "./icons";

const THEME: Record<string, { icon: string; a: string; b: string; eyebrow: string }> = {
  news: { icon: "news", a: "#1b6b3a", b: "#0f3d24", eyebrow: "NEWS" },
  accidents: { icon: "alert", a: "#b42318", b: "#5c1209", eyebrow: "ACCIDENT" },
  reports: { icon: "doc", a: "#1f4f7a", b: "#122c45", eyebrow: "ISSUE REPORT" },
  library: { icon: "download", a: "#1d6f42", b: "#0e3b23", eyebrow: "FREE LIBRARY" },
  tools: { icon: "tool", a: "#6d3fc4", b: "#33196b", eyebrow: "TOOLS" },
  cert: { icon: "cap", a: "#a15c07", b: "#5a3204", eyebrow: "CERTIFICATE" },
  about: { icon: "safety", a: "#34505e", b: "#16242b", eyebrow: "ABOUT" },
};

/** 목록 페이지 맨 위 색 띠: 메뉴마다 색과 아이콘이 다르다 */
export default function PageHero({ theme, title, desc, children }: { theme: string; title: string; desc?: ReactNode; children?: ReactNode }) {
  const t = THEME[theme] ?? THEME.about;
  return (
    <div className="no-print relative overflow-hidden text-white" style={{ background: `linear-gradient(120deg, ${t.a} 0%, ${t.b} 100%)` }}>
      <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "18px 18px" }} aria-hidden="true" />
      <div className="absolute -top-10 right-[-30px] opacity-15 sm:right-[6%]" aria-hidden="true"><Icon name={t.icon} size={220} stroke={1.2} color="#fff" /></div>
      <div className="relative mx-auto flex max-w-[1240px] flex-col gap-2 px-4 pt-9 pb-8 sm:px-5 sm:pt-12 sm:pb-10">
        <span className="text-[12px] font-extrabold tracking-[0.18em] text-white/70">{t.eyebrow}</span>
        <h1 className="m-0 text-[28px] leading-tight font-extrabold tracking-[-0.6px] sm:text-[36px]">{title}</h1>
        {desc && <p className="m-0 max-w-[640px] text-[16px] leading-relaxed text-white/85">{desc}</p>}
        {children}
      </div>
    </div>
  );
}
