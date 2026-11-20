import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import { Unverified } from "@/components/ui";
import { FieldChip } from "@/components/visual";
import { allReports } from "@/lib/reports";
import { fmtDate, readMinutes } from "@/lib/fields";

export const metadata: Metadata = {
  title: "이슈리포트 · EHS 법령 개정·통계·업계 동향 해설",
  description: "산업안전·보건·환경 법령 개정, 사고·통계 발표, 업계 동향을 현직 EHS 컨설턴트가 실무 관점으로 풀어 씁니다.",
  alternates: { canonical: "/reports/" },
};

export default function Page() {
  const reports = allReports();
  return (
    <SiteShell active="reports" title="이슈리포트" desc="법령 개정, 통계, 업계 동향">
      <ul className="m-0 grid list-none gap-4 p-0" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(320px, 100%), 1fr))" }}>
        {reports.map((r) => (
          <li key={r.slug}>
            <Link href={`/reports/${r.slug}/`} className="card lift flex h-full flex-col overflow-hidden text-ink hover:text-ink hover:no-underline">
              <span className="flex flex-1 flex-col gap-2 p-5">
                <span className="flex flex-wrap items-center gap-2 text-[13px] text-muted">
                  <FieldChip field={r.field} />
                  <span>{fmtDate(r.date)}</span>
                  <span>{readMinutes(r.html)}분</span>
                  {!r.reviewed && <Unverified label="검수 전" />}
                </span>
                {r.series && <span className="-mb-1 text-[13px] font-bold text-muted">{r.series}</span>}
                <span className="text-[18px] leading-snug font-extrabold tracking-[-0.3px]">{r.title}</span>
                <span className="line-clamp-3 text-[15px] leading-relaxed text-muted">{r.summary}</span>
                <span className="mt-auto pt-1 text-[14px] font-bold text-accent">읽기 →</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </SiteShell>
  );
}
