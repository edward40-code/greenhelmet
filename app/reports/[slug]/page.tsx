import type { Metadata } from "next";
import { OG_IMAGES, SITE } from "@/lib/site";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AdSlot, Notice } from "@/components/ui";
import { allReports, getReport } from "@/lib/reports";
import { fieldName, fieldStyle, fmtDate, readMinutes } from "@/lib/fields";
import { allLibrary } from "@/lib/library";
import { FieldChip, FormatTile, ReportThumb } from "@/components/visual";
import { Icon } from "@/components/icons";
import ReadProgress from "@/components/ReadProgress";

export const dynamicParams = false;
export const generateStaticParams = () => allReports().map((r) => ({ slug: r.slug }));

type P = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const r = getReport((await params).slug);
  if (!r) return {};
  return {
    title: r.title,
    description: r.summary,
    alternates: { canonical: `/reports/${r.slug}/` },
    openGraph: { type: "article", title: r.title, description: r.summary, publishedTime: r.date, siteName: SITE.name, locale: "ko_KR", images: OG_IMAGES },
  };
}

export default async function Page({ params }: P) {
  const r = getReport((await params).slug);
  if (!r) notFound();
  const all = allReports();
  const idx = all.findIndex((x) => x.slug === r.slug);
  const others = all.filter((x) => x.slug !== r.slug).sort((a, b) => Number(b.field === r.field) - Number(a.field === r.field)).slice(0, 3);
  const files = allLibrary().filter((x) => x.type === "file");
  const related = [...files.filter((x) => x.field === r.field), ...files.filter((x) => x.field !== r.field)].slice(0, 3);
  const st = fieldStyle(r.field);
  const newer = idx > 0 ? all[idx - 1] : null;
  const older = idx < all.length - 1 ? all[idx + 1] : null;

  return (
    <>
      <ReadProgress color={st.a} />
      <Header active="reports" />
      <div className="relative overflow-hidden text-white" style={{ background: `linear-gradient(130deg, ${st.b} 0%, #16242b 100%)` }}>
        <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: "repeating-linear-gradient(45deg, #fff 0 2px, transparent 2px 16px)" }} aria-hidden="true" />
        <div className="absolute -right-8 -bottom-16 opacity-20" aria-hidden="true"><Icon name={r.field} size={260} stroke={1.2} /></div>
        <div className="relative mx-auto flex max-w-[820px] flex-col gap-3 px-4 pt-8 pb-16 sm:px-5 sm:pt-12">
          <div className="text-[14px] text-white/75">
            <Link href="/reports/" className="text-white/90 hover:text-white">이슈리포트</Link> › {fieldName(r.field)}
          </div>
          <h1 className="m-0 text-[27px] leading-[1.3] font-extrabold tracking-[-0.6px] sm:text-[36px]">{r.title}</h1>
          {r.summary && <p className="m-0 max-w-[680px] text-[16px] leading-relaxed text-white/85">{r.summary}</p>}
          <p className="m-0 flex flex-wrap items-center gap-3 text-[14px] text-white/80">
            <span className="rounded-full bg-white/15 px-2.5 py-0.5 font-bold text-white">{fieldName(r.field)}</span>
            <span>{fmtDate(r.date)}</span>
            <span className="inline-flex items-center gap-1"><Icon name="clock" size={14} />{readMinutes(r.html)}분 읽기</span>
            {r.reviewed && <span className="inline-flex items-center gap-1"><Icon name="check" size={14} />법령 원문 대조 완료</span>}
          </p>
        </div>
      </div>

      <div className="relative mx-auto -mt-10 flex max-w-[820px] flex-col gap-6 px-4 pb-12 sm:px-5">
        <article className="card p-5 sm:p-9">
          {!r.reviewed && (
            <div className="mb-4">
              <Notice><strong>검수 전</strong> 원고입니다. 운영자가 원문과 대조한 뒤 이 표시를 뗍니다.</Notice>
            </div>
          )}
          <div className="prose-doc" dangerouslySetInnerHTML={{ __html: r.html }} />
          {r.sources.length > 0 && (
            <div className="mt-8 rounded-xl bg-[#f4f7f5] p-4 text-[14px] leading-relaxed text-muted">
              <strong className="text-ink">출처</strong>
              <ul className="m-0 mt-1 list-disc pl-5">{r.sources.map((s) => <li key={s}>{s}</li>)}</ul>
            </div>
          )}
        </article>

        {related.length > 0 && (
          <section className="flex flex-col gap-3 rounded-2xl p-5 sm:p-6" style={{ background: st.soft }}>
            <h2 className="m-0 flex items-center gap-2 text-[18px] font-extrabold" style={{ color: st.c }}><Icon name="download" size={20} />이 글과 함께 받아 가면 좋은 서식</h2>
            <div className="grid gap-2.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(220px, 100%), 1fr))" }}>
              {related.map((x) => (
                <Link key={x.id} href={`/library/${x.id}/`} className="lift flex items-start gap-3 rounded-xl bg-white p-3.5 text-ink shadow-sm hover:text-ink hover:no-underline">
                  <FormatTile format={x.format} size={40} />
                  <span className="text-[14px] leading-snug font-bold">{x.title}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <AdSlot slot="post_bottom" />

        {(newer || older) && (
          <nav aria-label="이전·다음 리포트" className="grid gap-3 sm:grid-cols-2">
            {older ? (
              <Link href={`/reports/${older.slug}/`} className="card lift flex flex-col gap-1 p-4 text-ink hover:text-ink hover:no-underline">
                <span className="text-[13px] font-bold text-muted">← 이전 리포트</span>
                <span className="text-[15px] leading-snug font-bold">{older.title}</span>
              </Link>
            ) : <span />}
            {newer && (
              <Link href={`/reports/${newer.slug}/`} className="card lift flex flex-col gap-1 p-4 text-right text-ink hover:text-ink hover:no-underline">
                <span className="text-[13px] font-bold text-muted">다음 리포트 →</span>
                <span className="text-[15px] leading-snug font-bold">{newer.title}</span>
              </Link>
            )}
          </nav>
        )}

        {others.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="m-0 text-[19px] font-extrabold">이어서 읽어 보세요</h2>
            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(230px, 100%), 1fr))" }}>
              {others.map((o) => (
                <Link key={o.slug} href={`/reports/${o.slug}/`} className="card lift flex flex-col overflow-hidden text-ink hover:text-ink hover:no-underline">
                  <ReportThumb field={o.field} className="h-[90px]" />
                  <span className="flex flex-col gap-1.5 p-3.5">
                    <FieldChip field={o.field} />
                    <span className="text-[15px] leading-snug font-bold">{o.title}</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
      <Footer />
    </>
  );
}
