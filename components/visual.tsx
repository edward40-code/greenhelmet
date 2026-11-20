import Link from "next/link";
import type { ReactNode } from "react";
import { fieldName } from "@/lib/fields";

/** 분야 태그 (사이트에서 둥근 알약 모양은 이 태그 한 종류만 쓴다) */
export function FieldChip({ field, size = "sm" }: { field: string; size?: "sm" | "md" }) {
  return (
    <span className={`inline-flex items-center rounded-full border border-line bg-white font-semibold text-muted ${size === "md" ? "px-2.5 py-0.5 text-[14px]" : "px-2 py-px text-[12px]"}`}>
      {fieldName(field)}
    </span>
  );
}

/** 이슈리포트 목록 칸 머리: 연재명 또는 분야 이름만 */
export function ReportThumb({ field, label, className = "" }: { field: string; label?: string; className?: string; big?: boolean }) {
  return (
    <div className={`flex items-end border-b border-line-soft bg-bg p-4 ${className}`} aria-hidden="true">
      <span className="text-[13px] font-bold text-muted">{label ?? fieldName(field)}</span>
    </div>
  );
}

/** 섹션 머리: 제목 + 더보기 */
export function SectionHead({ title, desc, href, more }: { icon?: string; title: ReactNode; desc?: string; href?: string; more?: string; tone?: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1 border-b border-ink pb-2">
      <div className="flex flex-col">
        <h2 className="m-0 text-[20px] leading-tight font-extrabold tracking-[-0.4px]">{title}</h2>
        {desc && <p className="m-0 text-[14px] text-muted">{desc}</p>}
      </div>
      {href && (
        <Link href={href} className="py-1 text-[14px] font-bold whitespace-nowrap">
          {more ?? "더 보기"} →
        </Link>
      )}
    </div>
  );
}

/** 파일 형식 표시 (XLSX·DOCX·PPTX…) */
export function FormatTile({ format, size = 48 }: { format: string; size?: number }) {
  const map: Record<string, string> = { XLSX: "#1d6f42", DOCX: "#2b579a", PDF: "#b3261e", HWP: "#1f5fa8", PPTX: "#c4501b", 링크: "#4a5a63" };
  const c = map[format] ?? map["링크"];
  return (
    <span
      className="grid shrink-0 place-items-center rounded border-2 bg-white font-extrabold"
      style={{ borderColor: c, color: c, width: size, height: Math.round(size * 0.62), fontSize: Math.max(11, Math.round(size * 0.24)) }}
    >
      {format}
    </span>
  );
}
