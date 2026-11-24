import { existsSync } from "node:fs";
import path from "node:path";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AdSlot } from "@/components/ui";
import AlertBox from "@/components/AlertBox";
import { FieldChip, FormatTile, SectionHead } from "@/components/visual";
import catalog from "@/content/catalog.json";
import { allNews, slugOf } from "@/lib/news";
import { accKindOf, allAccidents, shortSummary } from "@/lib/accidents";
import { allReports } from "@/lib/reports";
import { allLibrary } from "@/lib/library";
import { FIELDS, fmtDate } from "@/lib/fields";
import { BASE_PATH, SITE } from "@/lib/site";
import { market, marketCount } from "@/lib/market";

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
  const feat = files[0]; // 가장 최근에 올린 자료
  const featThumb = feat ? thumbOf(feat.id) : null;
  const rest = files.filter((x) => x.id !== feat?.id);
  const picks = [...rest.filter((x) => x.category === "법정 점검표").slice(0, 4), ...rest.filter((x) => x.category !== "법정 점검표").slice(0, 4)];
  const fieldCount: Record<string, number> = {};
  news.forEach((x) => (fieldCount[x.field] = (fieldCount[x.field] ?? 0) + 1));
  const tools = catalog.toolGroups.flatMap((g) => g.tools).filter((t) => t.open && t.href !== "/library/");

  return (
    <>
      <Header />
      <AdSlot slot="top_banner" />
      <h1 className="sr-only">{SITE.name} · {SITE.tagline}</h1>

      {/* 윗부분: 소식 + 사고속보 (메뉴 순서) */}
      <section className="bg-ink text-white">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-5 px-4 pt-7 pb-10 sm:px-5 sm:pt-9">
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <p className="m-0 text-[14px] text-[#9fb0b8]">
              {fmtDate(now.date)} ({wd}) {now.time} 갱신
            </p>
            <nav aria-label="바로가기" className="flex flex-wrap gap-1.5">
              {QUICK.map(([href, label]) => (
                <Link key={href} href={href} className="inline-flex min-h-[36px] items-center rounded-md border border-white/20 px-3 text-[14px] font-semibold text-white hover:border-[#f5c518] hover:text-[#f5c518] hover:no-underline">
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="grid items-start gap-5 lg:grid-cols-2">
            {/* 소식 */}
            <div className="flex min-w-0 flex-col overflow-hidden rounded-md bg-white text-ink">
              <div className="flex items-center justify-between gap-2 bg-accent px-5 py-3 text-white">
                <h2 className="m-0 text-[18px] font-extrabold">소식</h2>
                <Link href="/news/" className="text-[14px] font-bold text-white/90 hover:text-white">전체 보기 →</Link>
              </div>
              <ul className="m-0 flex list-none flex-col p-0">
                {news.slice(0, 5).map((x) => (
                  <li key={x.id} className="border-t border-line-soft first:border-t-0">
                    <Link href={`/news/${slugOf(x.id)}/`} className="flex flex-col gap-1 px-5 py-3.5 text-ink hover:bg-accent-soft hover:no-underline [&:hover_.t]:underline">
                      <span className="t text-[16px] leading-[1.45] font-semibold">{x.title}</span>
                      <span className="flex flex-wrap items-center gap-2 text-[13px] text-muted">
                        <FieldChip field={x.field} />
                        {x.kind} {fmtDate(x.date).slice(5)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="m-0 flex flex-wrap gap-x-3 gap-y-1 border-t border-line-soft px-5 py-3 text-[14px]">
                <span className="font-bold text-muted">분야</span>
                {FIELDS.filter((f) => (fieldCount[f.key] ?? 0) > 0).map((f) => (
                  <Link key={f.key} href={`/news/?field=${f.key}`}>
                    {f.name} {fieldCount[f.key]}
                  </Link>
                ))}
              </p>
            </div>

            {/* 사고속보 */}
            <div className="flex min-w-0 flex-col overflow-hidden rounded-md bg-white text-ink">
              <div className="flex items-center justify-between gap-2 bg-[#b42318] px-5 py-3 text-white">
                <h2 className="m-0 text-[18px] font-extrabold">사고속보</h2>
                <span className="flex gap-4">
                  <Link href="/accidents/week/" className="text-[14px] font-bold text-white/90 hover:text-white">이번 주</Link>
                  <Link href="/accidents/" className="text-[14px] font-bold text-white/90 hover:text-white">전체 보기 →</Link>
                </span>
              </div>
              <ul className="m-0 flex list-none flex-col p-0">
                {accidents.slice(0, 5).map((x) => {
                  const k = accKindOf(x);
                  const sum = shortSummary(x.summary);
                  return (
                    <li key={x.id} className="border-t border-line-soft first:border-t-0">
                      <Link href={`/accidents/${slugOf(x.id)}/`} className="flex gap-3 px-5 py-3.5 text-ink hover:bg-[#fff7f6] hover:no-underline [&:hover_.t]:underline">
                        <span className="w-[52px] shrink-0 pt-0.5 text-[13px] leading-tight font-bold text-danger">{k.label || "\u00a0"}</span>
                        <span className="flex min-w-0 flex-col gap-0.5">
                          <span className="t text-[16px] leading-[1.45] font-semibold">{x.title}</span>
                          {sum && <span className="line-clamp-1 text-[14px] text-muted">{sum}</span>}
                          <span className="text-[13px] text-muted">{fmtDate(x.date).slice(5)} {x.source}</span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-[1240px] flex-col gap-12 px-4 pt-10 pb-6 sm:px-5">
        {/* 이슈리포트 */}
        <section className="flex flex-col gap-3">
          <SectionHead title="이슈리포트" href="/reports/" more="전체 리포트" />
          <ul className="m-0 grid list-none gap-x-10 p-0 md:grid-cols-2">
            {reports.map((r) => (
              <li key={r.slug} className="border-b border-line-soft">
                <Link href={`/reports/${r.slug}/`} className="flex flex-col gap-0.5 py-3 text-ink hover:no-underline [&:hover_.t]:underline">
                  {r.series && <span className="text-[12px] font-bold text-accent">{r.series}</span>}
                  <span className="t text-[16px] leading-snug font-semibold">{r.title}</span>
                  <span className="line-clamp-1 text-[14px] text-muted">{r.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <AlertBox />

        {/* 자료실: 새 자료 + 고른 자료 */}
        <section className="flex flex-col gap-4">
          <SectionHead title="자료실" href="/library/" more={`자료 ${files.length}개 전체`} />
          {feat && (
            <Link href={`/library/${feat.id}/`} className="card lift group grid overflow-hidden text-ink hover:text-ink hover:no-underline md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
              {featThumb && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={featThumb} alt="" className="block aspect-[16/9] w-full border-b border-line-soft object-cover object-top md:border-r md:border-b-0" />
              )}
              <span className="flex flex-col justify-center gap-1.5 p-5 sm:p-6">
                <span className="flex items-center gap-3 text-[14px]">
                  <span className="font-extrabold text-accent">새 자료</span>
                  <span className="text-muted">{fmtDate(feat.updated)}</span>
                </span>
                <span className="text-[20px] leading-snug font-extrabold group-hover:underline">{feat.title}</span>
                <span className="text-[15px] leading-relaxed text-muted">{feat.desc}</span>
                <span className="mt-2 inline-flex min-h-[40px] items-center self-start rounded-md bg-[#f5c518] px-4 text-[15px] font-extrabold text-ink">{feat.format} 내려받기</span>
              </span>
            </Link>
          )}
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(270px, 100%), 1fr))" }}>
            {picks.map((x) => {
              const th = thumbOf(x.id);
              return (
                <Link key={x.id} href={`/library/${x.id}/`} className="card lift flex flex-col overflow-hidden text-ink hover:text-ink hover:no-underline">
                  <span className="relative block h-[140px] overflow-hidden border-b border-line-soft bg-white">
                    {th && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={th} alt="" loading="lazy" className="block w-full object-cover object-top" />
                    )}
                    <span className="absolute top-2 right-2"><FormatTile format={x.format} size={40} /></span>
                  </span>
                  <span className="flex flex-col gap-1 p-4">
                    <span className="text-[16px] leading-snug font-bold">{x.title}</span>
                    <span className="line-clamp-2 text-[14px] leading-relaxed text-muted">{x.desc}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 안전장터 */}
        <section className="flex flex-col gap-4">
          <SectionHead title="안전장터" href="/market/" more={`보호구·장비 ${marketCount()}종 전체`} />
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(220px, 100%), 1fr))" }}>
            {market().groups.map((g) => (
              <Link key={g.key} href={`/market/#${g.key}`} className="card lift flex flex-col gap-1 p-4 text-ink hover:text-ink hover:no-underline">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="text-[17px] font-extrabold">{g.name}</span>
                  <span className="text-[14px] text-muted">{g.items.length}종</span>
                </span>
                <span className="line-clamp-2 text-[14px] leading-relaxed text-muted">{g.items.map((it) => it.name).join(", ")}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 도구 */}
        <section className="flex flex-col gap-4">
          <SectionHead title="도구" href="/tools/" more="전체 도구" />
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(180px, 100%), 1fr))" }}>
            {tools.map((t) => (
              <Link key={t.href} href={t.href} className="card lift flex flex-col gap-1 p-4 text-ink hover:text-ink hover:no-underline">
                <span className="text-[17px] font-extrabold">{t.name}</span>
                <span className="text-[14px] leading-relaxed text-muted">{t.desc}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 자격증 */}
        <section className="flex flex-col gap-4">
          <SectionHead title="자격증" href="/cert/industrial-safety-engineer/" more="산업안전기사" />
          <Link href="/cert/industrial-safety-engineer/" className="card lift flex flex-col gap-1 p-5 text-ink hover:text-ink hover:no-underline sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <span className="text-[18px] font-extrabold">산업안전기사</span>
            <span className="text-[15px] leading-relaxed text-muted">2027년부터 5과목, 과목별 출제 유형</span>
          </Link>
        </section>
      </div>

      <Footer />
    </>
  );
}
