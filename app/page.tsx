import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CertGrid, HallTabs, ToolGrid } from "@/components/Catalog";
import { AdSlot, Soon, SectionCard } from "@/components/ui";
import { SITE } from "@/lib/site";

const CERT = "/cert/industrial-safety-engineer";

export default function Home() {
  return (
    <>
      <Header />
      <HallTabs />

      <nav aria-label="자격증관 메뉴" className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-[1240px] flex-wrap gap-x-6 px-4 text-[15px] font-medium sm:px-5">
          <a href="#db" className="flex min-h-[46px] items-center text-ink">자격증 DB</a>
          <Link href={`${CERT}/types/`} className="flex min-h-[46px] items-center border-b-[3px] border-accent font-extrabold text-accent">출제 유형</Link>
          {["시험 뉴스", "공략", "합격 후기", "질문·답변", "익명 수다방"].map((m) => (
            <span key={m} className="flex min-h-[46px] items-center text-muted">{m}<Soon /></span>
          ))}
        </div>
      </nav>

      <AdSlot slot="top_banner" />

      <div className="mx-auto flex max-w-[1240px] flex-wrap items-start gap-4 px-4 pt-4 pb-10 sm:px-5">
        <main className="flex min-w-0 flex-[999_1_600px] flex-col gap-4">
          <SectionCard id="db">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h1 className="m-0 text-[20px] font-extrabold tracking-[-0.3px]">자격증 DB · 종목을 고르면 공략이 모입니다</h1>
            </div>
            <CertGrid />
            <p className="m-0 text-[13px] text-muted">산업안전기사부터 엽니다. 나머지 종목은 차례로 엽니다.</p>
          </SectionCard>

          <SectionCard id="tools">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="m-0 text-[20px] font-extrabold tracking-[-0.3px]">도구</h2>
              <Link href="/tools/" className="py-3 text-[14px]">전체 도구</Link>
            </div>
            <ToolGrid />
          </SectionCard>

          <SectionCard>
            <h2 className="m-0 text-[20px] font-extrabold tracking-[-0.3px]">산업안전기사 출제 유형</h2>
            <p className="m-0 text-[15px] leading-relaxed text-muted">
              이 사이트는 시험문제를 싣지 않습니다. 과목·단원마다 무엇을 어떤 형태로 묻는지, 어떻게 공부하면 되는지, 어디서 자주 틀리는지를 정리합니다.
            </p>
            <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(220px, 100%), 1fr))" }}>
              <Link href={`${CERT}/types/#written`} className="flex min-h-[64px] flex-col justify-center rounded-md border border-line p-3.5 text-ink hover:border-accent hover:bg-accent-soft hover:no-underline">
                <span className="text-[13px] font-bold text-accent">필기</span>
                <span className="text-[16px] font-bold">과목별 출제 유형</span>
              </Link>
              <Link href={`${CERT}/types/#practical`} className="flex min-h-[64px] flex-col justify-center rounded-md border border-line p-3.5 text-ink hover:border-accent hover:bg-accent-soft hover:no-underline">
                <span className="text-[13px] font-bold text-accent">실기</span>
                <span className="text-[16px] font-bold">필답형·작업형 유형</span>
              </Link>
              <Link href={`${CERT}/`} className="flex min-h-[64px] flex-col justify-center rounded-md border border-line p-3.5 text-ink hover:border-accent hover:bg-accent-soft hover:no-underline">
                <span className="text-[13px] font-bold text-accent">개요</span>
                <span className="text-[16px] font-bold">시험 구조와 공부 순서</span>
              </Link>
            </div>
          </SectionCard>

          <div className="rounded-md border border-dashed border-accent bg-white px-5 py-4 text-[15px] text-ink">
            <strong className="text-accent">커뮤니티는 곧 열립니다.</strong> 공략 게시판, 합격 후기, 익명 수다방은 회원 기능과 함께 문을 엽니다.
          </div>
        </main>

        <aside className="flex min-w-0 flex-[1_1_280px] flex-col gap-4">
          <SectionCard>
            <h2 className="m-0 text-[18px] font-extrabold">{SITE.name}은</h2>
            <ul className="m-0 flex list-disc flex-col gap-1.5 pl-5 text-[15px] leading-relaxed">
              <li>EHS 자격증 수험생과 안전·보건·환경 실무자가 모이는 곳입니다.</li>
              <li>시험문제 원문이나 복원 문제는 싣지 않습니다. 출제 유형과 공부 방향만 다룹니다.</li>
              <li>구인·구직, 업체 홍보, 장비 거래는 하지 않습니다.</li>
            </ul>
            <Link href="/about/" className="py-2 text-[14px]">사이트 소개</Link>
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
