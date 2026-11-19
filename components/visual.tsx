import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "./icons";
import { fieldName, fieldStyle } from "@/lib/fields";

/** 분야 칩: 색 점 + 이름 */
export function FieldChip({ field, size = "sm" }: { field: string; size?: "sm" | "md" }) {
  const s = fieldStyle(field);
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-bold ${size === "md" ? "px-2.5 py-1 text-[14px]" : "px-2 py-0.5 text-[13px]"}`}
      style={{ background: s.soft, color: s.c }}
    >
      <Icon name={field} size={size === "md" ? 15 : 13} stroke={2.4} />
      {fieldName(field)}
    </span>
  );
}

/** 이슈리포트 썸네일: 분야색 그라데이션 + 큰 아이콘 + 줄무늬 패턴 (사진 없이도 글마다 다르게 보이게) */
export function ReportThumb({ field, label, className = "", big = false }: { field: string; label?: string; className?: string; big?: boolean }) {
  const s = fieldStyle(field);
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, ${s.a} 0%, ${s.b} 100%)` }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 opacity-[0.13]"
        style={{ backgroundImage: "repeating-linear-gradient(45deg, #fff 0 2px, transparent 2px 14px)" }}
      />
      <div className="absolute -right-6 -bottom-8 text-white opacity-25">
        <Icon name={field} size={big ? 190 : 120} stroke={1.4} />
      </div>
      <div className="relative flex h-full flex-col justify-between p-4 text-white">
        <span className="self-start rounded bg-black/20 px-2 py-0.5 text-[12px] font-bold tracking-wide backdrop-blur-sm">{label ?? "ISSUE REPORT"}</span>
        <Icon name={field} size={big ? 44 : 32} stroke={1.8} />
      </div>
    </div>
  );
}

/** 섹션 머리: 아이콘 + 제목 + 설명 + 더보기 */
export function SectionHead({ icon, title, desc, href, more, tone = "#1b6b3a" }: { icon: string; title: ReactNode; desc?: string; href?: string; more?: string; tone?: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
      <div className="flex items-center gap-2.5">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white shadow-sm" style={{ background: tone }}>
          <Icon name={icon} size={21} />
        </span>
        <div className="flex flex-col">
          <h2 className="m-0 text-[21px] leading-tight font-extrabold tracking-[-0.4px]">{title}</h2>
          {desc && <p className="m-0 text-[14px] text-muted">{desc}</p>}
        </div>
      </div>
      {href && (
        <Link href={href} className="group inline-flex items-center gap-1 py-1.5 text-[14px] font-bold whitespace-nowrap">
          {more ?? "더 보기"}
          <Icon name="arrow" size={15} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

/** 파일 형식 타일 (자료실 카드 왼쪽) */
export function FormatTile({ format, size = 48 }: { format: string; size?: number }) {
  const map: Record<string, [string, string]> = {
    XLSX: ["#1d6f42", "sheet"],
    DOCX: ["#2b579a", "doc"],
    PDF: ["#b3261e", "doc"],
    HWP: ["#1f5fa8", "doc"],
    PPTX: ["#c4501b", "doc"],
    링크: ["#4a5a63", "link"],
  };
  const [bg, icon] = map[format] ?? map["링크"];
  return (
    <span className="relative grid shrink-0 place-items-center rounded-lg text-white" style={{ background: bg, width: size, height: size }}>
      <Icon name={icon} size={Math.round(size * 0.46)} />
      <span className="absolute -bottom-1.5 rounded bg-white px-1 text-[10px] leading-[14px] font-extrabold shadow-sm" style={{ color: bg }}>{format}</span>
    </span>
  );
}
