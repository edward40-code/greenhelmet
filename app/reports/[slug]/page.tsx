import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AdSlot, Notice } from "@/components/ui";
import { allReports, getReport } from "@/lib/reports";
import { fieldName, fmtDate } from "@/lib/fields";

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
    openGraph: { type: "article", title: r.title, description: r.summary, publishedTime: r.date },
  };
}

export default async function Page({ params }: P) {
  const r = getReport((await params).slug);
  if (!r) notFound();
  const others = allReports().filter((x) => x.slug !== r.slug).slice(0, 4);

  return (
    <>
      <Header active="reports" />
      <div className="mx-auto flex max-w-[820px] flex-col gap-4 px-4 pt-6 pb-12 sm:px-5">
        <div className="text-[14px] text-muted">
          <Link href="/reports/">이슈리포트</Link> › {fieldName(r.field)}
        </div>
        <article className="card p-5 sm:p-8">
          <h1 className="m-0 text-[24px] leading-snug font-extrabold tracking-[-0.5px] sm:text-[28px]">{r.title}</h1>
          <p className="mt-2 mb-0 text-[14px] text-muted">{fmtDate(r.date)} · {fieldName(r.field)}</p>
          {!r.reviewed && (
            <div className="mt-4">
              <Notice><strong>검수 전</strong> 원고입니다. 운영자가 원문과 대조한 뒤 이 표시를 뗍니다.</Notice>
            </div>
          )}
          <div className="prose-doc mt-2" dangerouslySetInnerHTML={{ __html: r.html }} />
          {r.sources.length > 0 && (
            <div className="mt-6 border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
              <strong>출처</strong>
              <ul className="m-0 mt-1 list-disc pl-5">{r.sources.map((s) => <li key={s}>{s}</li>)}</ul>
            </div>
          )}
        </article>
        <AdSlot slot="post_bottom" />
        {others.length > 0 && (
          <section className="card flex flex-col p-5">
            <h2 className="m-0 mb-1 text-[17px] font-extrabold">다른 이슈리포트</h2>
            {others.map((o) => (
              <Link key={o.slug} href={`/reports/${o.slug}/`} className="border-t border-line-soft py-3 text-[15px] first:border-t-0">{o.title}</Link>
            ))}
          </section>
        )}
      </div>
      <Footer />
    </>
  );
}
