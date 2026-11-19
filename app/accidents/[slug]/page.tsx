import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AdSlot } from "@/components/ui";
import { Icon } from "@/components/icons";
import { FieldChip, FormatTile } from "@/components/visual";
import { accKindOf, accLibraryIds, allAccidents, getAccident, sourceUrl } from "@/lib/accidents";
import { slugOf } from "@/lib/news";
import { getLib } from "@/lib/library";
import { allReports } from "@/lib/reports";
import { fmtDate } from "@/lib/fields";

export const dynamicParams = false;
export const generateStaticParams = () => allAccidents().map((x) => ({ slug: slugOf(x.id) }));

type P = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const x = getAccident((await params).slug);
  if (!x) return {};
  return {
    title: `${x.title} · 사고속보`,
    description: x.summary ?? `${x.source} ${fmtDate(x.date)} 보도. 같은 유형 사고와 예방에 쓰는 점검표를 함께 봅니다.`,
    // 보도 제목만 담은 짧은 페이지라 검색 색인에서는 뺀다 (링크는 따라감)
    robots: { index: false, follow: true },
  };
}

export default async function Page({ params }: P) {
  const x = getAccident((await params).slug);
  if (!x) notFound();
  const k = accKindOf(x);
  const all = allAccidents();
  const same = all.filter((o) => o.id !== x.id && accKindOf(o).icon === k.icon).slice(0, 5);
  const recent = all.filter((o) => o.id !== x.id && !same.includes(o)).slice(0, 5);
  const libs = accLibraryIds(x).map(getLib).filter((v): v is NonNullable<typeof v> => !!v);
  const reports = allReports().filter((r) => r.field === x.field).slice(0, 2);
  const sameCount = all.filter((o) => accKindOf(o).icon === k.icon).length;
  // 유형을 가리지 못한 보도는 "사고 사고"처럼 겹치지 않게 문구를 따로 쓴다
  const generic = k.icon === "alert";
  const kindName = generic ? "산업재해 보도" : `${k.label} 사고`;

  return (
    <>
      <Header active="accidents" />
      <div className="relative overflow-hidden text-white" style={{ background: "linear-gradient(120deg,#b42318 0%,#5c1209 100%)" }}>
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "18px 18px" }} aria-hidden="true" />
        <div className="absolute -right-6 -bottom-10 opacity-15" aria-hidden="true"><Icon name={k.icon} size={220} stroke={1.2} /></div>
        <div className="relative mx-auto flex max-w-[860px] flex-col gap-3 px-4 pt-8 pb-14 sm:px-5 sm:pt-10">
          <div className="text-[14px] text-white/75"><Link href="/accidents/" className="text-white/90 hover:text-white">사고속보</Link> › {k.label}</div>
          <span className="inline-flex items-center gap-2 self-start rounded-full bg-white/15 px-3 py-1 text-[14px] font-bold"><Icon name={k.icon} size={16} />{kindName}</span>
          <h1 className="m-0 text-[25px] leading-[1.35] font-extrabold tracking-[-0.5px] sm:text-[32px]">{x.title}</h1>
          <p className="m-0 text-[15px] text-white/85">{x.source} · {fmtDate(x.date)} 보도</p>
          {x.tags && x.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {x.tags.map((t) => (
                <Link key={t} href={`/accidents/?tag=${encodeURIComponent(t)}`} className="inline-flex min-h-[32px] items-center rounded-full border border-white/30 px-3 text-[14px] text-white hover:bg-white/15 hover:text-white hover:no-underline">#{t}</Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="relative mx-auto -mt-8 flex max-w-[860px] flex-col gap-6 px-4 pb-12 sm:px-5">
        <section className="card flex flex-col gap-4 p-5 sm:p-7">
          <h2 className="m-0 flex items-center gap-2 text-[18px] font-extrabold"><Icon name="doc" size={19} className="text-danger" />사고 개요</h2>
          {x.summary ? (
            <p className="m-0 text-[17px] leading-[1.85]">{x.summary}</p>
          ) : (
            <p className="m-0 text-[16px] leading-relaxed text-muted">요약 준비 중</p>
          )}
          <p className="m-0 text-[13px] text-muted">{fmtDate(x.date)} {x.source} 보도 기준 · 실명 미게재</p>
          <div className="flex flex-wrap items-center gap-3">
            <a href={sourceUrl(x)} target="_blank" rel="noopener" className="inline-flex min-h-[48px] items-center gap-2 rounded-lg bg-ink px-5 text-[16px] font-bold text-white hover:text-white hover:no-underline">
              원문 기사 보기 <span className="text-[13px] font-normal opacity-80">{x.source} ↗</span>
            </a>
            {!generic && <span className="text-[14px] text-muted">최근 수집된 {k.label} 사고 보도 <b className="text-danger">{sameCount}건</b></span>}
          </div>
        </section>

        {libs.length > 0 && (
          <section className="flex flex-col gap-3 rounded-2xl bg-[#eaf5ee] p-5 sm:p-6">
            <h2 className="m-0 flex items-center gap-2 text-[19px] font-extrabold text-accent-dark"><Icon name="check" size={21} />관련 점검표</h2>
            <div className="grid gap-2.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(240px, 100%), 1fr))" }}>
              {libs.map((l) => (
                <Link key={l.id} href={`/library/${l.id}/`} className="lift flex items-start gap-3 rounded-xl bg-white p-3.5 text-ink shadow-sm hover:text-ink hover:no-underline">
                  <FormatTile format={l.format} size={42} />
                  <span className="text-[15px] leading-snug font-bold">{l.title}</span>
                </Link>
              ))}
            </div>
            <Link href="/tools/tbm/" className="inline-flex items-center gap-1.5 self-start text-[15px] font-bold">
              <Icon name="people" size={17} />오늘 작업 전 TBM 자료 만들기 →
            </Link>
          </section>
        )}

        <AdSlot slot="post_bottom" />

        <div className="grid gap-4 sm:grid-cols-2">
          {same.length > 0 && (
            <section className="card flex flex-col p-5">
              <h2 className="m-0 mb-1 flex items-center gap-2 text-[17px] font-extrabold"><Icon name={k.icon} size={18} className="text-danger" />{generic ? "그 밖의 산업재해 보도" : `같은 유형(${k.label}) 사고`}</h2>
              {same.map((o) => (
                <Link key={o.id} href={`/accidents/${slugOf(o.id)}/`} className="flex flex-col gap-0.5 border-t border-line-soft py-3 text-ink first:border-t-0 hover:text-accent hover:no-underline">
                  <span className="text-[15px] leading-snug font-semibold">{o.title}</span>
                  <span className="text-[13px] text-muted">{fmtDate(o.date).slice(5)} · {o.source}</span>
                </Link>
              ))}
            </section>
          )}
          <section className="card flex flex-col p-5">
            <h2 className="m-0 mb-1 text-[17px] font-extrabold">최근 사고속보</h2>
            {recent.map((o) => {
              const ok = accKindOf(o);
              return (
                <Link key={o.id} href={`/accidents/${slugOf(o.id)}/`} className="flex flex-col gap-0.5 border-t border-line-soft py-3 text-ink first:border-t-0 hover:text-accent hover:no-underline">
                  <span className="text-[15px] leading-snug font-semibold">{o.title}</span>
                  <span className="text-[13px] text-muted"><b className="text-danger">{ok.label}</b> · {fmtDate(o.date).slice(5)} · {o.source}</span>
                </Link>
              );
            })}
            <Link href="/accidents/" className="pt-2 text-[14px] font-bold">전체 사고속보 →</Link>
          </section>
        </div>

        {reports.length > 0 && (
          <section className="card flex flex-col gap-1 p-5">
            <h2 className="m-0 mb-1 text-[17px] font-extrabold">관련 이슈리포트</h2>
            {reports.map((r) => (
              <Link key={r.slug} href={`/reports/${r.slug}/`} className="flex flex-wrap items-center gap-2 border-t border-line-soft py-3 text-[15px] text-ink first:border-t-0 hover:text-accent hover:no-underline">
                <FieldChip field={r.field} />{r.title}
              </Link>
            ))}
          </section>
        )}
      </div>
      <Footer />
    </>
  );
}
