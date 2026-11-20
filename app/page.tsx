import { existsSync } from "node:fs";
import path from "node:path";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AdSlot } from "@/components/ui";
import { FieldChip, FormatTile, SectionHead } from "@/components/visual";
import catalog from "@/content/catalog.json";
import { allNews, slugOf } from "@/lib/news";
import { accKindOf, allAccidents, shortSummary } from "@/lib/accidents";
import { allReports } from "@/lib/reports";
import { allLibrary } from "@/lib/library";
import { FIELDS, fmtDate } from "@/lib/fields";
import { BASE_PATH, SITE } from "@/lib/site";

/** 빌드 시각(한국 시간). 사이트는 하루 여러 번 다시 만들어진다 */
function kstNow() {
  const d = new Date(Date.now() + 9 * 3600 * 1000).toISOString();
  return { date: d.slice(0, 10), time: d.slice(11, 16) };
}
const WEEK = ["일", "월", "화", "수", "목", "금", "토"];

const QUICK: [string, string][] = [
  ["/library/checklist-forklift/", "지게차 점검표"],
  ["/library/checklist-confined-space/", "밀폐공간 점검표"],
  ["/library/checklist-fire-extinguisher/", "소화기 점검표"],
  ["/tools/tbm/", "TBM 자료 만들기"],
  ["/tools/calc/", "재해율 계산"],
];

/** 자료 미리보기 그림 (scripts/make_thumbs.py 로 만든 public/library/thumbs/{id}.png) */
const thumbOf = (id: string) => (existsSync(path.join(process.cwd(), "public", "library", "thumbs", `${id}.png`)) ? `${BASE_PATH}/library/thumbs/${id}.png` : null);

export default function Home() {
  const now = kstNow();
  const wd = WEEK[new Date(now.date).getUTCDay()];
  const news = allNews();
  const accidents = allAccidents();
  const reports = allReports().slice(0, 4);
  const files = allLibrary().filter((x) => x.type === "file");
  const picks = [...files.filter((x) => x.category === "법정 점검표").slice(0, 4), ...files.filter((x) => x.category !== "법정 점검표").slice(0, 4)];
  const fieldCount: Record<string, number> = {};
  news.forEach((x) => (fieldCount[x.field] = (fieldCount[x.field] ?? 0) + 1));
  const tools = catalog.toolGroups.flatMap((g) => g.tools).filter((t) => t.open && t.href !== "/library/");

  return (
    <>
      <Header />
      <AdSlot slot="top_banner" />
      <h1 className="sr-only">{SITE.name} · {SITE.tagline}</h1>

      <div className="mx-auto flex max-w-[1240px] flex-col gap-10 px-4 pt-6 pb-6 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <p className="m-0 text-[14px] text-muted">
            {fmtDate(now.date)} ({wd}) {now.time} 갱신
          </p>
          <nav aria-label="바로가기" className="flex flex-wrap gap-1.5">
            {QUICK.map(([href, label]) => (
              <Link key={href} href={href} className="inline-flex min-h-[36px] items-center rounded-md border border-line bg-white px-3 text-[14px] font-semibold text-ink hover:border-accent hover:text-accent hover:no-underline">
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* 사고속보 + 최신 소식 */}
        <div className="grid gap-x-8 gap-y-10 lg:grid-cols-[1.15fr_1fr]">
          <section className="flex min-w-0 flex-col gap-3">
            <SectionHead title={<span className="text-danger">사고속보</span>} href="/accidents/" more="전체 사고속보" />
            <ul className="m-0 flex list-none flex-col p-0">
              {accidents.slice(0, 6).map((x) => {
                const k = accKindOf(x);
                const sum = shortSummary(x.summary);
                return (
                  <li key={x.id} className="border-b border-line-soft">
                    <Link href={`/accidents/${slugOf(x.id)}/`} className="flex flex-col gap-1 py-3 text-ink hover:no-underline [&:hover_.t]:underline">
                      <span className="t text-[16px] leading-[1.45] font-semibold">{x.title}</span>
                      {sum && <span className="line-clamp-1 text-[14px] text-muted">{sum}</span>}
                      <span className="text-[13px] text-muted">
                        {k.label && <b className="mr-1.5 text-danger">{k.label}</b>}
                        {fmtDate(x.date).slice(5)} {x.source}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="flex min-w-0 flex-col gap-3">
            <SectionHead title="최신 소식" href="/news/" more="전체 소식" />
            <ul className="m-0 flex list-none flex-col p-0">
              {news.slice(0, 7).map((x) => (
                <li key={x.id} className="border-b border-line-soft">
                  <Link href={`/news/${slugOf(x.id)}/`} className="flex flex-col gap-1 py-3 text-ink hover:no-underline [&:hover_.t]:underline">
                    <span className="t text-[16px] leading-[1.45] font-semibold">{x.title}</span>
                    <span className="flex flex-wrap items-center gap-2 text-[13px] text-muted">
                      <FieldChip field={x.field} />
                      {x.kind} {fmtDate(x.date)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="m-0 flex flex-wrap gap-x-3 gap-y-1 text-[14px]">
              <span className="font-bold text-muted">분야</span>
              {FIELDS.filter((f) => (fieldCount[f.key] ?? 0) > 0).map((f) => (
                <Link key={f.key} href={`/news/?field=${f.key}`}>
                  {f.name} {fieldCount[f.key]}
                </Link>
              ))}
            </p>
          </section>
        </div>

        {/* 자료실 */}
        <section className="flex flex-col gap-4">
          <SectionHead title="자료실" href="/library/" more={`자료 ${files.length}개 전체`} />
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))" }}>
            {picks.map((x) => {
              const th = thumbOf(x.id);
              return (
                <Link key={x.id} href={`/library/${x.id}/`} className="card lift flex flex-col overflow-hidden text-ink hover:text-ink hover:no-underline">
                  {th ? (
                    <span className="relative block h-[132px] overflow-hidden border-b border-line-soft bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={th} alt="" loading="lazy" className="block w-full object-cover object-top" />
                      <span className="absolute top-2 right-2"><FormatTile format={x.format} size={40} /></span>
                    </span>
                  ) : (
                    <span className="flex h-[52px] items-center border-b border-line-soft bg-bg px-4"><FormatTile format={x.format} size={40} /></span>
                  )}
                  <span className="flex flex-col gap-1 p-4">
                    <span className="text-[16px] leading-snug font-bold">{x.title}</span>
                    <span className="line-clamp-2 text-[14px] leading-relaxed text-muted">{x.desc}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 도구 · 이슈리포트 · 자격증 */}
        <div className="grid gap-x-8 gap-y-10 md:grid-cols-3">
          <section className="flex flex-col gap-2">
            <SectionHead title="도구" href="/tools/" more="전체" />
            <ul className="m-0 flex list-none flex-col p-0">
              {tools.map((t) => (
                <li key={t.href} className="border-b border-line-soft">
                  <Link href={t.href} className="block py-2.5 text-[15px] font-semibold">{t.name}</Link>
                </li>
              ))}
            </ul>
          </section>
          <section className="flex flex-col gap-2">
            <SectionHead title="이슈리포트" href="/reports/" more="전체" />
            <ul className="m-0 flex list-none flex-col p-0">
              {reports.map((r) => (
                <li key={r.slug} className="border-b border-line-soft">
                  <Link href={`/reports/${r.slug}/`} className="flex flex-col py-2.5 text-ink hover:no-underline [&:hover_.t]:underline">
                    {r.series && <span className="text-[12px] font-bold text-muted">{r.series}</span>}
                    <span className="t text-[15px] leading-snug font-semibold">{r.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          <section className="flex flex-col gap-2">
            <SectionHead title="자격증" href="/cert/industrial-safety-engineer/" more="전체" />
            <ul className="m-0 flex list-none flex-col p-0">
              <li className="border-b border-line-soft">
                <Link href="/cert/industrial-safety-engineer/" className="flex flex-col py-2.5 text-ink hover:no-underline [&:hover_.t]:underline">
                  <span className="t text-[15px] font-semibold">산업안전기사</span>
                  <span className="text-[13px] text-muted">2027년부터 5과목, 과목별 출제 유형</span>
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
}
