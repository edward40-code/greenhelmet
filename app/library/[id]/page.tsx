import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AdSlot } from "@/components/ui";
import { allLibrary, getLib } from "@/lib/library";
import { fieldName, fmtDate } from "@/lib/fields";
import { BASE_PATH } from "@/lib/site";
import { FormatBadge } from "../LibraryList";

export const dynamicParams = false;
export const generateStaticParams = () => allLibrary().map((x) => ({ id: x.id }));

type P = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const x = getLib((await params).id);
  if (!x) return {};
  const free = x.type === "file" ? " 무료 다운로드" : "";
  return {
    title: `${x.title}${free}`,
    description: x.desc,
    alternates: { canonical: `/library/${x.id}/` },
  };
}

export default async function Page({ params }: P) {
  const x = getLib((await params).id);
  if (!x) notFound();
  const related = allLibrary().filter((o) => o.id !== x.id && (o.field === x.field || o.category === x.category)).slice(0, 4);
  const btn = "inline-flex min-h-[52px] items-center justify-center gap-2 rounded-md bg-accent px-6 text-[17px] font-bold text-white hover:text-white hover:no-underline";

  return (
    <>
      <Header active="library" />
      <div className="mx-auto flex max-w-[860px] flex-col gap-4 px-4 pt-6 pb-12 sm:px-5">
        <div className="text-[14px] text-muted">
          <Link href="/library/">자료실</Link> › {x.category}
        </div>
        <article className="card flex flex-col gap-4 p-5 sm:p-7">
          <div className="flex flex-wrap items-center gap-2 text-[13px]">
            <FormatBadge format={x.format} />
            <span className="font-bold text-accent">{fieldName(x.field)}</span>
            <span className="text-muted">{x.category} · {x.source} · {fmtDate(x.updated)}</span>
          </div>
          <h1 className="m-0 text-[24px] leading-snug font-extrabold tracking-[-0.5px] sm:text-[28px]">{x.title}</h1>
          <p className="m-0 text-[16px] leading-[1.8]">{x.desc}</p>

          <div>
            {x.type === "file" ? (
              <a className={btn} href={`${BASE_PATH}/library/${x.file}`} download>
                무료 내려받기 <span className="text-[13px] font-normal opacity-90">{x.format}</span>
              </a>
            ) : (
              <a className={btn} href={x.url} target="_blank" rel="noopener">
                원본 자료 보러 가기 ↗
              </a>
            )}
          </div>

          {x.howto && x.howto.length > 0 && (
            <section className="rounded-md bg-accent-soft p-4">
              <h2 className="m-0 mb-1.5 text-[16px] font-extrabold text-accent-ink">이렇게 쓰세요</h2>
              <ul className="m-0 list-disc pl-5 text-[15px] leading-[1.8]">{x.howto.map((h) => <li key={h}>{h}</li>)}</ul>
            </section>
          )}
          {x.report && (
            <Link href={`/reports/${x.report}/`} className="text-[15px] font-bold">관련 이슈리포트 읽기 →</Link>
          )}
          <p className="m-0 text-[13px] leading-relaxed text-muted">
            {x.type === "file"
              ? "그린헬멧기사가 만든 기본 서식입니다. 현장 위험성평가 결과와 사내 규정에 맞게 고쳐 쓰세요."
              : `자료의 저작권은 ${x.source}에 있습니다. 그린헬멧기사는 원본 위치만 안내합니다.`}
          </p>
        </article>

        <AdSlot slot="edu_inline" />

        {related.length > 0 && (
          <section className="card flex flex-col p-5">
            <h2 className="m-0 mb-1 text-[17px] font-extrabold">함께 보는 자료</h2>
            {related.map((o) => (
              <Link key={o.id} href={`/library/${o.id}/`} className="flex items-center gap-2 border-t border-line-soft py-3 text-[15px] first:border-t-0">
                <FormatBadge format={o.format} /> {o.title}
              </Link>
            ))}
          </section>
        )}
      </div>
      <Footer />
    </>
  );
}
