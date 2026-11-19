import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CertHero from "@/components/CertHero";
import { AdSlot, Notice, Unverified } from "@/components/ui";
import { OPEN_TABS, certSlugs, getCert } from "@/lib/certs";

export const dynamicParams = false;
export const generateStaticParams = () => certSlugs().flatMap((slug) => OPEN_TABS.map((tab) => ({ slug, tab })));

type P = { params: Promise<{ slug: string; tab: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { slug, tab } = await params;
  const c = getCert(slug)?.cert;
  if (!c || tab !== "types") return {};
  return {
    title: `${c.name} 출제 유형 정리 (필기 과목별·실기 필답형·작업형)`,
    description: `${c.name} 2027년 출제기준에 맞춘 필기 5과목과 실기 필답형·작업형에서 무엇을 어떤 형태로 묻는지, 유형별 공부 방향과 자주 틀리는 지점을 정리했습니다. 시험문제 원문은 싣지 않습니다.`,
    alternates: { canonical: `/cert/${c.slug}/types/` },
  };
}

function TypeBlock({ title, sub, description, study_tip, pitfalls }: { title: string; sub?: string; description: string; study_tip: string; pitfalls: string }) {
  return (
    <article className="flex flex-col gap-2 border-t border-line-soft py-4 first:border-t-0 first:pt-1">
      <h4 className="m-0 text-[17px] font-extrabold">
        {sub && <span className="mr-2 text-[14px] font-bold text-accent">{sub}</span>}
        {title}
      </h4>
      <p className="m-0 text-[15px] leading-[1.75]">{description}</p>
      <dl className="m-0 grid gap-2 text-[15px] leading-[1.7]">
        <div className="rounded-md bg-accent-soft px-3.5 py-2.5">
          <dt className="text-[14px] font-bold text-accent-ink">공부 방향</dt>
          <dd className="m-0">{study_tip}</dd>
        </div>
        <div className="rounded-md bg-[#fbf3f1] px-3.5 py-2.5">
          <dt className="text-[14px] font-bold text-danger">자주 틀리는 지점</dt>
          <dd className="m-0">{pitfalls}</dd>
        </div>
      </dl>
      <p className="m-0 text-[14px] text-muted">출제 빈도: 집계 전</p>
    </article>
  );
}

export default async function Page({ params }: P) {
  const { slug, tab } = await params;
  const entry = getCert(slug);
  if (!entry || tab !== "types") notFound();
  const { cert, types } = entry;

  return (
    <>
      <Header active="cert" />
      <CertHero cert={cert} tab="types" />

      <div className="mx-auto flex max-w-[1240px] flex-wrap items-start gap-4 px-4 pt-5 pb-10 sm:px-5">
        <main className="flex min-w-0 flex-[999_1_600px] flex-col gap-4">
          {!types.reviewed && (
            <Notice>
              <strong>검수 전</strong> · {types.basis}
            </Notice>
          )}
          {types.reviewed && <p className="m-0 text-[14px] leading-relaxed text-muted">{types.basis}</p>}
          <p className="m-0 text-[15px] leading-relaxed text-muted">
            기출 원문과 복원 문제는 싣지 않습니다.
          </p>

          <nav aria-label="과목 바로가기" className="card flex flex-wrap gap-2 p-4">
            {types.written.map((s) => (
              <a key={s.no} href={`#s${s.no}`} className="inline-flex min-h-[44px] items-center rounded-full border border-line px-3.5 text-[14px]">
                {s.no}과목
              </a>
            ))}
            <a href="#practical" className="inline-flex min-h-[44px] items-center rounded-full border border-accent px-3.5 text-[14px] font-bold">실기</a>
          </nav>

          <h2 id="written" className="m-0 scroll-mt-4 text-[22px] font-extrabold tracking-[-0.3px]">
            필기 과목별 출제 유형{!cert.subjects.verified && <Unverified />}
          </h2>
          {types.written.map((s) => (
            <section key={s.no} id={`s${s.no}`} className="card scroll-mt-4 flex flex-col gap-1 p-5">
              <h3 className="m-0 mb-2 text-[19px] font-extrabold">
                <span className="mr-2 text-[14px] font-bold text-accent">{s.no}과목</span>
                {s.subject}
              </h3>
              {s.units.map((u) => (
                <TypeBlock key={u.unit} sub={u.unit} title={u.type_name} description={u.description} study_tip={u.study_tip} pitfalls={u.pitfalls} />
              ))}
            </section>
          ))}

          <h2 id="practical" className="m-0 mt-2 scroll-mt-4 text-[22px] font-extrabold tracking-[-0.3px]">
            실기 출제 유형{!cert.practical.verified && <Unverified />}
          </h2>
          {types.practical.map((p) => (
            <section key={p.section} className="card flex flex-col gap-1 p-5">
              <h3 className="m-0 text-[19px] font-extrabold">{p.section}</h3>
              <p className="m-0 mb-2 text-[15px] text-muted">{p.intro}</p>
              {p.items.map((it) => (
                <TypeBlock key={it.type_name} title={it.type_name} description={it.description} study_tip={it.study_tip} pitfalls={it.pitfalls} />
              ))}
            </section>
          ))}
        </main>

        <aside className="flex min-w-0 flex-[1_1_280px] flex-col gap-4 lg:sticky lg:top-4">
          <section className="card flex flex-col gap-1 p-5">
            <h2 className="m-0 mb-1 text-[18px] font-extrabold">함께 보기</h2>
            <Link href={`/cert/${cert.slug}/`} className="border-t border-line-soft py-3 text-[15px]">{cert.name} 시험 구조·공부 순서</Link>
            <Link href="/tools/calc/" className="border-t border-line-soft py-3 text-[15px]">재해 지표·소음 계산 도구</Link>
            <Link href="/tools/tbm/" className="border-t border-line-soft py-3 text-[15px]">TBM 생성기 (작업형 대비)</Link>
          </section>
          <AdSlot slot="side_main" />
        </aside>
      </div>

      <Footer />
    </>
  );
}
