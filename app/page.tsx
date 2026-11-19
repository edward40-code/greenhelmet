import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToolGrid } from "@/components/Catalog";
import { AdSlot, SectionCard, Unverified } from "@/components/ui";
import { FormatBadge } from "./library/LibraryList";
import { allNews } from "@/lib/news";
import { allAccidents } from "@/lib/accidents";
import { allReports } from "@/lib/reports";
import { allLibrary } from "@/lib/library";
import { fieldName, fmtDate } from "@/lib/fields";
import { SITE } from "@/lib/site";

function More({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="py-2 text-[14px] whitespace-nowrap">{children} →</Link>;
}

export default function Home() {
  const news = allNews().slice(0, 8);
  const accidents = allAccidents().slice(0, 6);
  const reports = allReports();
  const lead = reports[0];
  const files = allLibrary().filter((x) => x.type === "file").slice(0, 4);
  const links = allLibrary().filter((x) => x.type === "link").slice(0, 4);

  return (
    <>
      <Header />
      <AdSlot slot="top_banner" />

      <div className="mx-auto flex max-w-[1240px] flex-wrap items-start gap-4 px-4 pt-5 pb-10 sm:px-5">
        <main className="flex min-w-0 flex-[999_1_600px] flex-col gap-4">
          <h1 className="sr-only">{SITE.name} · 산업안전·보건·환경 소식과 무료 자료실</h1>

          {lead && (
            <Link href={`/reports/${lead.slug}/`} className="card flex flex-col gap-2 border-l-[6px] border-l-accent p-5 text-ink hover:no-underline sm:p-6">
              <span className="flex flex-wrap items-center gap-2 text-[14px]">
                <span className="rounded bg-accent px-2 py-0.5 font-bold text-white">이슈리포트</span>
                <span className="font-bold text-accent">{fieldName(lead.field)}</span>
                <span className="text-muted">{fmtDate(lead.date)}</span>
                {!lead.reviewed && <Unverified label="검수 전" />}
              </span>
              <span className="text-[21px] leading-snug font-extrabold tracking-[-0.3px] sm:text-[24px]">{lead.title}</span>
              <span className="text-[15px] leading-relaxed text-muted">{lead.summary}</span>
            </Link>
          )}

          {accidents.length > 0 && (
            <SectionCard>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="m-0 text-[20px] font-extrabold tracking-[-0.3px]">
                  <span className="mr-2 rounded bg-danger px-2 py-0.5 align-middle text-[14px] font-bold text-white">속보</span>
                  사고속보
                </h2>
                <More href="/accidents/">전체 사고속보</More>
              </div>
              <ul className="m-0 list-none p-0">
                {accidents.map((x) => (
                  <li key={x.id} className="border-t border-line-soft first:border-t-0">
                    <a href={x.url} target="_blank" rel="noopener" className="flex flex-col gap-1 py-3.5 text-ink hover:no-underline">
                      <span className="text-[16px] leading-[1.5] font-semibold hover:underline">{x.title}</span>
                      <span className="text-[14px] text-muted"><span className="font-bold text-danger">{fmtDate(x.date).slice(5)}</span> · {x.source}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <p className="m-0 text-[13px] text-muted">언론 보도 제목을 그대로 싣고 원문으로 연결합니다.</p>
            </SectionCard>
          )}

          <SectionCard>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="m-0 text-[20px] font-extrabold tracking-[-0.3px]">최신 소식</h2>
              <More href="/news/">전체 소식</More>
            </div>
            <ul className="m-0 list-none p-0">
              {news.map((x) => (
                <li key={x.id} className="border-t border-line-soft first:border-t-0">
                  <a href={x.url} target="_blank" rel="noopener" className="flex flex-col gap-1 py-3.5 text-ink hover:no-underline">
                    <span className="text-[16px] leading-[1.5] font-semibold hover:underline">{x.title}</span>
                    <span className="text-[14px] text-muted"><span className="font-bold text-accent">{fieldName(x.field)}</span> · {x.kind} · {fmtDate(x.date)}</span>
                  </a>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="m-0 text-[20px] font-extrabold tracking-[-0.3px]">자료실 · 무료 서식</h2>
              <More href="/library/">자료실 전체</More>
            </div>
            <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(240px, 100%), 1fr))" }}>
              {files.map((x) => (
                <Link key={x.id} href={`/library/${x.id}/`} className="flex flex-col gap-1.5 rounded-md border border-line p-3.5 text-ink hover:border-accent hover:bg-accent-soft hover:no-underline">
                  <span className="flex items-center gap-2"><FormatBadge format={x.format} /><span className="text-[13px] text-muted">{x.category}</span></span>
                  <span className="text-[15px] leading-snug font-bold">{x.title}</span>
                </Link>
              ))}
            </div>
            <h3 className="m-0 text-[14px] font-bold text-muted">공공기관 자료 바로가기</h3>
            <div className="flex flex-wrap gap-2">
              {links.map((x) => (
                <Link key={x.id} href={`/library/${x.id}/`} className="inline-flex min-h-[40px] items-center rounded-full border border-line px-3.5 text-[14px] text-ink hover:border-accent hover:no-underline">
                  {x.title}
                </Link>
              ))}
            </div>
          </SectionCard>

          <SectionCard id="tools">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="m-0 text-[20px] font-extrabold tracking-[-0.3px]">도구</h2>
              <More href="/tools/">전체 도구</More>
            </div>
            <ToolGrid />
          </SectionCard>
        </main>

        <aside className="flex min-w-0 flex-[1_1_280px] flex-col gap-4">
          {reports.length > 1 && (
            <SectionCard>
              <h2 className="m-0 text-[18px] font-extrabold">이슈리포트</h2>
              {reports.slice(1, 6).map((r) => (
                <Link key={r.slug} href={`/reports/${r.slug}/`} className="border-t border-line-soft py-3 text-[15px] leading-[1.5] font-medium text-ink hover:text-accent">{r.title}</Link>
              ))}
            </SectionCard>
          )}
          <SectionCard>
            <h2 className="m-0 text-[18px] font-extrabold">자격증</h2>
            <Link href="/cert/industrial-safety-engineer/" className="flex flex-col gap-0.5 rounded-md border border-line p-3.5 text-ink hover:border-accent hover:no-underline">
              <span className="text-[16px] font-bold">산업안전기사</span>
              <span className="text-[14px] text-muted">시험 구조 · 과목별 출제 유형 정리</span>
            </Link>
            <p className="m-0 text-[14px] text-muted">다른 종목은 차례로 엽니다.</p>
          </SectionCard>
          <SectionCard>
            <h2 className="m-0 text-[18px] font-extrabold">{SITE.name}는</h2>
            <ul className="m-0 flex list-disc flex-col gap-1.5 pl-5 text-[15px] leading-relaxed">
              <li>안전·보건·환경 실무자가 매일 확인할 소식과 바로 쓰는 자료를 모읍니다.</li>
              <li>서식과 도구는 회원가입 없이 무료로 씁니다.</li>
              <li>커뮤니티 게시판은 회원 기능과 함께 곧 엽니다.</li>
            </ul>
            <Link href="/about/" className="py-1 text-[14px]">사이트 소개</Link>
          </SectionCard>
          <AdSlot slot="side_main" />
          <Link href="/tools/tbm/" className="flex min-h-[48px] items-center justify-center rounded-md bg-accent px-4 py-3.5 text-[16px] font-bold text-white hover:text-white">
            오늘 TBM 자료 만들기
          </Link>
        </aside>
      </div>

      <Footer />
    </>
  );
}
