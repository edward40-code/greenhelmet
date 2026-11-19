import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import { Unverified } from "@/components/ui";
import { allReports } from "@/lib/reports";
import { fieldName, fmtDate } from "@/lib/fields";

export const metadata: Metadata = {
  title: "이슈리포트 · EHS 법령 개정·통계·업계 동향 해설",
  description: "산업안전·보건·환경 법령 개정, 사고·통계 발표, 업계 동향을 현직 EHS 컨설턴트가 실무 관점으로 풀어 씁니다.",
  alternates: { canonical: "/reports/" },
};

export default function Page() {
  const reports = allReports();
  return (
    <SiteShell active="reports" width={900} title="이슈리포트" desc="법령 개정, 통계·사고 발표, 업계 동향을 실무자 눈높이로 풀어 씁니다.">
      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {reports.map((r) => (
          <li key={r.slug}>
            <Link href={`/reports/${r.slug}/`} className="card flex flex-col gap-2 p-5 text-ink hover:border-accent hover:no-underline">
              <span className="flex flex-wrap items-center gap-2 text-[14px]">
                <span className="font-bold text-accent">{fieldName(r.field)}</span>
                <span className="text-muted">{fmtDate(r.date)}</span>
                {!r.reviewed && <Unverified label="검수 전" />}
              </span>
              <span className="text-[19px] leading-snug font-extrabold">{r.title}</span>
              <span className="text-[15px] leading-relaxed text-muted">{r.summary}</span>
            </Link>
          </li>
        ))}
      </ul>
    </SiteShell>
  );
}
