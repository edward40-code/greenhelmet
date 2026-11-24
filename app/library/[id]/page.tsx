import { existsSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AdSlot } from "@/components/ui";
import { allLibrary, getLib } from "@/lib/library";
import { inventoryOfLibrary } from "@/lib/inventory";
import { marketOfLibrary } from "@/lib/market";
import { fmtDate } from "@/lib/fields";
import { BASE_PATH } from "@/lib/site";
import { downloadsText, viewsText } from "@/lib/views";
import { FormatBadge } from "../LibraryList";
import { FieldChip, FormatTile } from "@/components/visual";

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
  const inv = inventoryOfLibrary(x.id);
  const mk = marketOfLibrary(x.id);
  const thumb = existsSync(path.join(process.cwd(), "public", "library", "thumbs", `${x.id}.png`)) ? `${BASE_PATH}/library/thumbs/${x.id}.png` : null;
  const GENERIC = new Set(["checklist", "edu", "set", "log", "record", "form", "daily", "safety", "work", "all", "start", "moel", "kosha"]);
  const topics = (id: string) => id.split("-").filter((t) => !GENERIC.has(t));
  const mine = new Set(topics(x.id));
  const score = (o: typeof x) =>
    (x.related?.includes(o.id) || o.related?.includes(x.id) ? 100 : 0) +
    topics(o.id).filter((t) => mine.has(t)).length * 10 + (o.field === x.field ? 2 : 0) + (o.category === x.category ? 1 : 0);
  const related = allLibrary()
    .filter((o) => o.id !== x.id)
    .map((o) => ({ o, s: score(o) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 4)
    .map((r) => r.o);
  const stat = [viewsText(`/library/${x.id}/`), x.type === "file" ? downloadsText(x.id) : null].filter(Boolean).join(" · ");
  const btn = "inline-flex min-h-[52px] items-center justify-center gap-2 rounded-md bg-accent px-6 text-[17px] font-bold text-white hover:text-white hover:no-underline";

  return (
    <>
      <Header active="library" />
      <div className="mx-auto flex max-w-[860px] flex-col gap-4 px-4 pt-6 pb-12 sm:px-5">
        <div className="text-[14px] text-muted">
          <Link href="/library/">자료실</Link> › {x.category}
        </div>
        <article className="card flex flex-col gap-4 p-5 sm:p-7">
          <div className="flex items-start gap-4">
            <FormatTile format={x.format} size={64} />
            <div className="flex min-w-0 flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2 text-[13px]">
                <FieldChip field={x.field} />
                <span className="text-muted">{x.category} · {x.source} · {fmtDate(x.updated)}{stat && ` · ${stat}`}</span>
              </div>
              <h1 className="m-0 text-[24px] leading-snug font-extrabold tracking-[-0.5px] sm:text-[28px]">{x.title}</h1>
            </div>
          </div>
          <p className="m-0 text-[16px] leading-[1.8]">{x.desc}</p>

          <div>
            {x.type === "file" ? (
              <a className={btn} href={`${BASE_PATH}/library/${x.file}`} download>
                내려받기 <span className="text-[14px] font-normal opacity-90">{x.format}</span>
              </a>
            ) : (
              <a className={btn} href={x.url} target="_blank" rel="noopener">
                원본 자료 보러 가기 ↗
              </a>
            )}
          </div>

          {thumb && (
            <figure className="m-0 overflow-hidden rounded-md border border-line-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={thumb} alt={`${x.title} 첫 장`} loading="lazy" className="block w-full" />
            </figure>
          )}
          {x.basis && (
            <p className="m-0 rounded-md border border-line px-4 py-3 text-[14px] leading-relaxed"><strong>법적 근거</strong> · {x.basis}</p>
          )}
          {x.items && x.items.length > 0 && (
            <section>
              <h2 className="m-0 mb-1.5 text-[16px] font-extrabold">{x.itemsTitle ?? `들어 있는 점검 항목 (${x.items.length}개)`}</h2>
              <ol className="m-0 pl-5 text-[15px] leading-[1.8]">{x.items.map((h) => <li key={h}>{h}</li>)}</ol>
            </section>
          )}
          {x.howto && x.howto.length > 0 && (
            <section className="rounded-md bg-accent-soft p-4">
              <h2 className="m-0 mb-1.5 text-[16px] font-extrabold text-accent-ink">참고</h2>
              <ul className="m-0 list-disc pl-5 text-[15px] leading-[1.8]">{x.howto.map((h) => <li key={h}>{h}</li>)}</ul>
            </section>
          )}
          {inv && (
            <Link href={`/inventory/${inv.slug}/`} className="text-[15px] font-bold">{`${inv.title} 지침 인벤토리 →`}</Link>
          )}
          {mk && (
            <Link href={`/market/#${mk.key}`} className="text-[15px] font-bold">{`안전장터: ${mk.name} 보호구·장비 →`}</Link>
          )}
          {x.report && (
            <Link href={`/reports/${x.report}/`} className="text-[15px] font-bold">관련 이슈리포트 읽기 →</Link>
          )}
          {x.type !== "file" && <p className="m-0 text-[13px] text-muted">저작권 {x.source}</p>}
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
