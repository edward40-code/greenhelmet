import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CertHero from "@/components/CertHero";
import { AdSlot, Notice, SectionCard, Unverified } from "@/components/ui";
import { certSlugs, getCert } from "@/lib/certs";

export const dynamicParams = false;
export const generateStaticParams = () => certSlugs().map((slug) => ({ slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = getCert((await params).slug)?.cert;
  if (!c) return {};
  return {
    title: `${c.name} 시험 구조·과목·공부 순서`,
    description: `${c.name} 2027년 바뀐 필기 5과목(100문항) 구성과 실기 시험 구조, 합격기준, 합격률, 과목별 출제 유형과 추천 공부 순서를 정리했습니다. ${c.summary}`,
    alternates: { canonical: `/cert/${c.slug}/` },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const entry = getCert((await params).slug);
  if (!entry) notFound();
  const { cert, types } = entry;
  const base = `/cert/${cert.slug}`;

  return (
    <>
      <Header active="cert" />
      <CertHero cert={cert} tab="" />

      <div className="mx-auto flex max-w-[1240px] flex-wrap items-start gap-4 px-4 pt-5 pb-10 sm:px-5">
        <main className="flex min-w-0 flex-[999_1_600px] flex-col gap-4">
          <p className="m-0 text-[16px] leading-relaxed">{cert.summary}</p>
          {cert.changeNotice && <Notice><strong>2027년 출제기준 변경</strong> · {cert.changeNotice}</Notice>}

          <section className="flex flex-wrap gap-4">
            {[
              { h: "필기", d: cert.written },
              { h: "실기", d: cert.practical },
            ].map(({ h, d }) => (
              <div key={h} className="card flex min-w-0 flex-[1_1_280px] flex-col gap-2.5 p-5">
                <h2 className="m-0 text-[18px] font-extrabold">{h}{!d.verified && <Unverified />}</h2>
                <ul className="m-0 list-disc pl-5 text-[15px] leading-[1.8]">
                  {d.items.map((x) => <li key={x}>{x}</li>)}
                </ul>
              </div>
            ))}
          </section>
          <p className="-mt-1.5 mb-0 text-[14px] text-muted">{cert.sourceNote}</p>

          <SectionCard>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="m-0 text-[20px] font-extrabold tracking-[-0.3px]">필기 과목별 출제 유형{!cert.subjects.verified && <Unverified />}</h2>
              <Link href={`${base}/types/`} className="py-3 text-[14px]">전체 출제 유형</Link>
            </div>
            <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(240px, 100%), 1fr))" }}>
              {types.written.map((s) => (
                <Link key={s.no} href={`${base}/types/#s${s.no}`} className="flex flex-col gap-1.5 rounded-md border border-line p-4 text-ink hover:border-accent hover:bg-accent-soft hover:no-underline">
                  <span className="text-[14px] font-bold text-accent">{s.no}과목</span>
                  <span className="text-[16px] leading-snug font-bold">{s.subject}</span>
                  <span className="text-[14px] text-muted">유형 {s.units.length}개 정리</span>
                </Link>
              ))}
            </div>
          </SectionCard>

          <SectionCard>
            <h2 className="m-0 text-[20px] font-extrabold tracking-[-0.3px]">추천 공부 순서</h2>
            <ol className="m-0 grid list-none gap-2 p-0" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(180px, 100%), 1fr))" }}>
              {cert.studyOrder.map((s, i) => (
                <li key={s.title} className="flex flex-col gap-1 border-t-4 border-accent bg-[#f4f7f5] p-3.5">
                  <span className="text-[14px] font-bold text-accent">{i + 1}단계</span>
                  <span className="text-[15px] font-bold">{s.title}</span>
                  <span className="text-[14px] leading-normal text-muted">{s.desc}</span>
                </li>
              ))}
            </ol>
          </SectionCard>

          <SectionCard>
            <h2 className="m-0 text-[20px] font-extrabold tracking-[-0.3px]">실기 출제 유형</h2>
            <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(240px, 100%), 1fr))" }}>
              {types.practical.map((p) => (
                <Link key={p.section} href={`${base}/types/#practical`} className="flex flex-col gap-1.5 rounded-md border border-line p-4 text-ink hover:border-accent hover:bg-accent-soft hover:no-underline">
                  <span className="text-[16px] font-bold">{p.section}</span>
                  <span className="text-[14px] leading-normal text-muted">{p.intro}</span>
                </Link>
              ))}
            </div>
          </SectionCard>

          <div className="rounded-md border border-dashed border-accent bg-white px-5 py-4 text-[15px]">
            <strong className="text-accent">이 사이트는 시험문제를 싣지 않습니다.</strong> 문제는 문제집으로 풀고, 여기서는 유형과 공부 방향을 잡습니다.
          </div>
        </main>

        <aside className="flex min-w-0 flex-[1_1_280px] flex-col gap-4">
          {cert.passRates && (
            <SectionCard>
              <h2 className="m-0 text-[18px] font-extrabold">{cert.passRates.year}년 합격률</h2>
              <div className="flex justify-between border-t border-line-soft pt-2.5 text-[15px]"><span>필기</span><span><strong>{cert.passRates.written.rate}</strong> <span className="text-[14px] text-muted">({cert.passRates.written.applicants} 응시)</span></span></div>
              <div className="flex justify-between border-t border-line-soft pt-2.5 text-[15px]"><span>실기</span><span><strong>{cert.passRates.practical.rate}</strong> <span className="text-[14px] text-muted">({cert.passRates.practical.applicants} 응시)</span></span></div>
              {cert.fees && <div className="flex justify-between border-t border-line-soft pt-2.5 text-[15px]"><span>응시료</span><span>필기 {cert.fees.written} · 실기 {cert.fees.practical}</span></div>}
              <p className="m-0 text-[14px] text-muted">출처: {cert.passRates.source}</p>
            </SectionCard>
          )}
          <SectionCard>
            <h2 className="m-0 text-[18px] font-extrabold">공부에 쓰는 도구</h2>
            <ul className="m-0 flex list-none flex-col p-0 text-[15px]">
              <li className="border-t border-line-soft py-3"><Link href="/tools/calc/">재해율·도수율·강도율 계산</Link></li>
              <li className="border-t border-line-soft py-3"><Link href="/tools/calc/">소음 노출량·TWA 계산</Link></li>
              <li className="border-t border-line-soft py-3"><Link href="/tools/career/">응시자격 경력 계산</Link></li>
            </ul>
          </SectionCard>
          <AdSlot slot="side_main" />
        </aside>
      </div>

      <Footer />
    </>
  );
}
