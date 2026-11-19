import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AdSlot } from "@/components/ui";
import { Icon } from "@/components/icons";
import { FieldChip, FormatTile } from "@/components/visual";
import { allNews, getNews, slugOf } from "@/lib/news";
import { allLibrary } from "@/lib/library";
import { allReports } from "@/lib/reports";
import { fieldName, fieldStyle, fmtDate } from "@/lib/fields";

export const dynamicParams = false;
export const generateStaticParams = () => allNews().map((x) => ({ slug: slugOf(x.id) }));

type P = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const x = getNews((await params).slug);
  if (!x) return {};
  return {
    title: `${x.title} · ${x.kind}`,
    description: x.summary ?? `${x.source} ${x.kind} (${fmtDate(x.date)}). ${fieldName(x.field)} 분야 관련 자료와 함께 봅니다.`,
    robots: { index: false, follow: true },
  };
}

export default async function Page({ params }: P) {
  const x = getNews((await params).slug);
  if (!x) notFound();
  const st = fieldStyle(x.field);
  const all = allNews();
  const sameField = all.filter((o) => o.id !== x.id && o.field === x.field).slice(0, 5);
  const recent = all.filter((o) => o.id !== x.id && !sameField.includes(o)).slice(0, 5);
  const files = allLibrary().filter((l) => l.type === "file");
  const libs = [...files.filter((l) => l.field === x.field), ...files.filter((l) => l.field !== x.field)].slice(0, 3);
  const reports = allReports().filter((r) => r.field === x.field).slice(0, 2);

  return (
    <>
      <Header active="news" />
      <div className="relative overflow-hidden text-white" style={{ background: `linear-gradient(120deg, ${st.b} 0%, #16242b 100%)` }}>
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "18px 18px" }} aria-hidden="true" />
        <div className="absolute -right-6 -bottom-10 opacity-15" aria-hidden="true"><Icon name={x.field} size={220} stroke={1.2} /></div>
        <div className="relative mx-auto flex max-w-[860px] flex-col gap-3 px-4 pt-8 pb-14 sm:px-5 sm:pt-10">
          <div className="text-[14px] text-white/75"><Link href="/news/" className="text-white/90 hover:text-white">소식</Link> › {fieldName(x.field)}</div>
          <span className="flex flex-wrap items-center gap-2 text-[14px]">
            <span className="rounded-full bg-white/15 px-3 py-1 font-bold">{fieldName(x.field)}</span>
            <span className="rounded-full bg-white/15 px-3 py-1">{x.kind}</span>
          </span>
          <h1 className="m-0 text-[25px] leading-[1.35] font-extrabold tracking-[-0.5px] sm:text-[32px]">{x.title}</h1>
          <p className="m-0 text-[15px] text-white/85">{x.source} · {fmtDate(x.date)}</p>
        </div>
      </div>

      <div className="relative mx-auto -mt-8 flex max-w-[860px] flex-col gap-6 px-4 pb-12 sm:px-5">
        <section className="card flex flex-col gap-4 p-5 sm:p-7">
          {x.summary && <p className="m-0 text-[17px] leading-relaxed">{x.summary}</p>}
          <div className="flex flex-wrap items-center gap-3">
            <a href={x.url} target="_blank" rel="noopener" className="inline-flex min-h-[48px] items-center gap-2 rounded-lg bg-ink px-5 text-[16px] font-bold text-white hover:text-white hover:no-underline">
              원문 보기 <span className="text-[13px] font-normal opacity-80">{x.source} ↗</span>
            </a>
            <span className="text-[14px] text-muted">저작권 {x.source}</span>
          </div>
        </section>

        {libs.length > 0 && (
          <section className="flex flex-col gap-3 rounded-2xl p-5 sm:p-6" style={{ background: st.soft }}>
            <h2 className="m-0 flex items-center gap-2 text-[19px] font-extrabold" style={{ color: st.c }}><Icon name="download" size={21} />{fieldName(x.field)} 실무에 쓰는 무료 서식</h2>
            <div className="grid gap-2.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(240px, 100%), 1fr))" }}>
              {libs.map((l) => (
                <Link key={l.id} href={`/library/${l.id}/`} className="lift flex items-start gap-3 rounded-xl bg-white p-3.5 text-ink shadow-sm hover:text-ink hover:no-underline">
                  <FormatTile format={l.format} size={42} />
                  <span className="text-[15px] leading-snug font-bold">{l.title}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <AdSlot slot="post_bottom" />

        <div className="grid gap-4 sm:grid-cols-2">
          {sameField.length > 0 && (
            <section className="card flex flex-col p-5">
              <h2 className="m-0 mb-1 flex items-center gap-2 text-[17px] font-extrabold"><Icon name={x.field} size={18} color={st.c} />{fieldName(x.field)} 소식 더 보기</h2>
              {sameField.map((o) => (
                <Link key={o.id} href={`/news/${slugOf(o.id)}/`} className="flex flex-col gap-0.5 border-t border-line-soft py-3 text-ink first:border-t-0 hover:text-accent hover:no-underline">
                  <span className="text-[15px] leading-snug font-semibold">{o.title}</span>
                  <span className="text-[13px] text-muted">{o.kind} · {fmtDate(o.date)}</span>
                </Link>
              ))}
            </section>
          )}
          {recent.length > 0 && (
            <section className="card flex flex-col p-5">
              <h2 className="m-0 mb-1 text-[17px] font-extrabold">최근 소식</h2>
              {recent.map((o) => (
                <Link key={o.id} href={`/news/${slugOf(o.id)}/`} className="flex flex-col gap-1 border-t border-line-soft py-3 text-ink first:border-t-0 hover:text-accent hover:no-underline">
                  <span className="text-[15px] leading-snug font-semibold">{o.title}</span>
                  <span className="flex items-center gap-2 text-[13px] text-muted"><FieldChip field={o.field} />{fmtDate(o.date)}</span>
                </Link>
              ))}
              <Link href="/news/" className="pt-2 text-[14px] font-bold">전체 소식 →</Link>
            </section>
          )}
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
