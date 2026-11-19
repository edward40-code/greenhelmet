import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AdSlot } from "@/components/ui";
import { Icon } from "@/components/icons";
import { FieldChip, FormatTile, SectionHead } from "@/components/visual";
import catalog from "@/content/catalog.json";
import { allNews, slugOf } from "@/lib/news";
import { accKindOf, allAccidents } from "@/lib/accidents";
import { allReports } from "@/lib/reports";
import { allLibrary } from "@/lib/library";
import { FIELDS, fieldStyle, fmtDate } from "@/lib/fields";
import { SITE } from "@/lib/site";

/** 빌드 시각 기준 한국 날짜 (사이트는 하루 여러 번 다시 만들어진다) */
function kstToday() {
  const d = new Date(Date.now() + 9 * 3600 * 1000);
  return d.toISOString().slice(0, 10);
}
const daysAgo = (today: string, n: number) => new Date(new Date(today).getTime() - n * 86400000).toISOString().slice(0, 10);
const WEEK = ["일", "월", "화", "수", "목", "금", "토"];

const QUICK: [string, string, string][] = [
  ["/library/checklist-forklift/", "지게차 점검표", "sheet"],
  ["/library/checklist-confined-space/", "밀폐공간 점검표", "gas"],
  ["/library/checklist-fire-extinguisher/", "소화기 점검표", "fire"],
  ["/tools/tbm/", "TBM 자료 만들기", "people"],
  ["/tools/calc/", "재해율·단위 계산", "calc"],
];

const TOOL_ICON: Record<string, string> = { "/tools/tbm/": "people", "/tools/calc/": "calc", "/tools/career/": "clock", "/tools/test/": "spark", "/tools/msds/": "chem", "/inventory/": "search", "/tools/diagnosis/": "check" };

export default function Home() {
  const today = kstToday();
  const wd = WEEK[new Date(today).getUTCDay()];
  const news = allNews();
  const accidents = allAccidents();
  const reports = allReports();
  const lib = allLibrary();
  const moreReports = reports.slice(0, 3);
  const files = lib.filter((x) => x.type === "file");
  const checklists = files.filter((x) => x.category === "법정 점검표").slice(0, 6);
  const forms = files.filter((x) => x.category !== "법정 점검표").slice(0, 4);
  const accWeek = accidents.filter((x) => x.date >= daysAgo(today, 6)).length;
  const newsWeek = news.filter((x) => x.date >= daysAgo(today, 6)).length;
  const fieldCount: Record<string, number> = {};
  news.forEach((x) => (fieldCount[x.field] = (fieldCount[x.field] ?? 0) + 1));
  const tools = catalog.toolGroups.flatMap((g) => g.tools).filter((t) => t.open && t.href.startsWith("/tools/"));

  return (
    <>
      <Header />
      <AdSlot slot="top_banner" />
      <h1 className="sr-only">{SITE.name} · 산업안전·보건·환경 소식과 무료 자료실</h1>

      {/* ── 히어로 ── */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "20px 20px" }} aria-hidden="true" />
        <div className="absolute top-0 left-0 h-1.5 w-full" style={{ background: "repeating-linear-gradient(-45deg, #f5c518 0 14px, #16242b 14px 28px)" }} aria-hidden="true" />
        <div className="relative mx-auto flex max-w-[1240px] flex-wrap items-stretch gap-8 px-4 pt-10 pb-12 sm:px-5 sm:pt-14">
          <div className="flex min-w-0 flex-[1_1_440px] flex-col justify-center gap-5">
            <span className="inline-flex items-center gap-2 self-start rounded-full bg-white/10 px-3 py-1 text-[13px] font-bold text-[#cfe9d8]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-logo" />
              {fmtDate(today)} ({wd}) 오늘의 현장 브리핑
            </span>
            <p className="m-0 text-[30px] leading-[1.25] font-extrabold tracking-[-0.8px] sm:text-[42px]">
              오늘 현장에서 꼭 볼<br />
              <span className="text-logo">안전·보건·환경</span> 소식
            </p>
            <p className="m-0 max-w-[520px] text-[16px] leading-relaxed text-[#c3cfd4]">사고속보와 정책 소식은 하루 세 번 모으고, 법정 점검표와 서식은 법령 원문으로 확인해 무료로 드립니다.</p>
            <div className="grid max-w-[560px] grid-cols-3 gap-2">
              {[
                ["/accidents/", accWeek, "이번 주 사고속보", "#ff8a7a"],
                ["/news/", newsWeek, "이번 주 새 소식", "#7fd8a0"],
                ["/library/", files.length, "무료 서식·점검표", "#f5c518"],
              ].map(([href, n, label, c]) => (
                <Link key={label as string} href={href as string} className="lift flex flex-col gap-0.5 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-white hover:border-white/25 hover:text-white hover:no-underline sm:px-4">
                  <span className="text-[28px] leading-none font-extrabold sm:text-[34px]" style={{ color: c as string }}>{n as number}</span>
                  <span className="text-[13px] leading-snug text-[#c3cfd4]">{label}</span>
                </Link>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK.map(([href, label, icon]) => (
                <Link key={href} href={href} className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-white px-3.5 text-[14px] font-bold text-ink hover:bg-[#e6f4ea] hover:text-ink hover:no-underline">
                  <Icon name={icon} size={16} className="text-accent" />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {accidents.length > 0 && (
            <div className="flex min-w-0 flex-[1_1_380px] flex-col overflow-hidden rounded-2xl bg-white text-ink shadow-2xl">
              <div className="flex items-center justify-between gap-2 bg-[#b42318] px-5 py-3.5 text-white">
                <span className="flex items-center gap-2 text-[17px] font-extrabold">
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white" />
                  사고속보
                </span>
                <Link href="/accidents/" className="inline-flex items-center gap-1 text-[14px] font-bold text-white/90 hover:text-white">전체 보기 <Icon name="arrow" size={15} /></Link>
              </div>
              <ul className="m-0 flex list-none flex-col p-0">
                {accidents.slice(0, 5).map((x) => {
                  const k = accKindOf(x);
                  return (
                    <li key={x.id} className="border-t border-line-soft first:border-t-0">
                      <Link href={`/accidents/${slugOf(x.id)}/`} className="flex items-start gap-3 px-5 py-3.5 text-ink hover:bg-[#fff7f6] hover:no-underline">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#fdecec] text-danger"><Icon name={k.icon} size={18} /></span>
                        <span className="flex min-w-0 flex-col gap-0.5">
                          <span className="text-[15px] leading-[1.45] font-semibold">{x.title}</span>
                          {x.summary && <span className="line-clamp-1 text-[13px] text-muted">{x.summary}</span>}
                          <span className="text-[13px] text-muted"><b className="text-danger">{k.label}</b> · {fmtDate(x.date).slice(5)} · {x.source}</span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <p className="m-0 mt-auto border-t border-line-soft px-5 py-2.5 text-[12px] text-muted">언론 보도를 읽고 사실만 간단히 정리했습니다.</p>
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto flex max-w-[1240px] flex-col gap-12 px-4 pt-10 pb-6 sm:px-5">
        {/* ── 법정 점검표 ── */}
        <section className="relative overflow-hidden rounded-3xl bg-[#eaf5ee] p-5 sm:p-8">
          <div className="absolute -top-6 -right-6 text-accent opacity-10" aria-hidden="true"><Icon name="check" size={200} stroke={1.3} /></div>
          <div className="relative flex flex-col gap-5">
            <SectionHead icon="download" title="법정 점검표, 무료로 받아 가세요" desc="법령 원문의 점검 항목을 그대로 옮긴 엑셀·워드 서식입니다. 회원가입 없이 내려받습니다." href="/library/" more="자료실 전체" />
            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(270px, 100%), 1fr))" }}>
              {checklists.map((x) => (
                <Link key={x.id} href={`/library/${x.id}/`} className="lift flex items-start gap-3.5 rounded-2xl border border-white bg-white p-4 text-ink shadow-sm hover:border-accent hover:text-ink hover:no-underline">
                  <FormatTile format={x.format} />
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="text-[16px] leading-snug font-bold">{x.title}</span>
                    <span className="line-clamp-2 text-[13px] leading-relaxed text-muted">{x.desc}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── 최신 소식 + 분야별 ── */}
        <section className="flex flex-wrap items-start gap-6">
          <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-4">
            <SectionHead icon="news" title="최신 소식" desc="고용노동부·환경부 등 정책·공지 가운데 EHS 관련만 골랐습니다" href="/news/" more="전체 소식" />
            <ul className="card m-0 list-none p-0">
              {news.slice(0, 7).map((x) => (
                <li key={x.id} className="border-t border-line-soft first:border-t-0">
                  <Link href={`/news/${slugOf(x.id)}/`} className="flex items-start gap-3 px-4 py-3.5 text-ink hover:bg-[#f7faf8] hover:no-underline sm:px-5">
                    <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: fieldStyle(x.field).a }} />
                    <span className="flex min-w-0 flex-col gap-1">
                      <span className="text-[16px] leading-[1.5] font-semibold hover:underline">{x.title}</span>
                      <span className="flex flex-wrap items-center gap-2 text-[13px] text-muted"><FieldChip field={x.field} />{x.kind} · {fmtDate(x.date)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <aside className="flex min-w-0 flex-[1_1_280px] flex-col gap-4">
            <h2 className="m-0 text-[17px] font-extrabold">분야별로 보기</h2>
            <div className="grid grid-cols-2 gap-2">
              {FIELDS.map((f) => {
                const s = fieldStyle(f.key);
                return (
                  <Link key={f.key} href={`/news/?field=${f.key}`} className="lift flex items-center gap-2.5 rounded-xl border p-3 hover:no-underline" style={{ background: s.soft, borderColor: s.soft, color: s.c }}>
                    <Icon name={f.key} size={22} />
                    <span className="flex flex-col leading-tight">
                      <span className="text-[14px] font-extrabold">{f.name}</span>
                      {(fieldCount[f.key] ?? 0) > 0 && <span className="text-[12px] opacity-80">소식 {fieldCount[f.key]}건</span>}
                    </span>
                  </Link>
                );
              })}
            </div>
            <Link href="/cert/industrial-safety-engineer/" className="lift relative flex flex-col gap-1 overflow-hidden rounded-2xl p-5 text-white hover:text-white hover:no-underline" style={{ background: "linear-gradient(135deg,#c2780a,#7a4304)" }}>
              <span className="absolute -right-4 -bottom-6 opacity-20" aria-hidden="true"><Icon name="cap" size={120} stroke={1.4} /></span>
              <span className="text-[12px] font-extrabold tracking-widest text-white/75">자격증</span>
              <span className="text-[19px] font-extrabold">산업안전기사</span>
              <span className="text-[14px] text-white/85">2027년 바뀐 5과목 시험 구조와 과목별 출제 유형</span>
            </Link>
            {moreReports.length > 0 && (
              <div className="flex flex-col">
                <div className="flex items-baseline justify-between">
                  <h2 className="m-0 text-[15px] font-bold text-muted">이슈리포트</h2>
                  <Link href="/reports/" className="text-[13px]">전체</Link>
                </div>
                {moreReports.map((r) => (
                  <Link key={r.slug} href={`/reports/${r.slug}/`} className="border-b border-line-soft py-2.5 text-[14px] leading-snug text-ink hover:text-accent">{r.title}</Link>
                ))}
              </div>
            )}
          </aside>
        </section>

        {/* ── 테스트 배너 ── */}
        <Link href="/tools/test/" className="lift relative flex flex-wrap items-center justify-between gap-4 overflow-hidden rounded-3xl p-6 text-white hover:text-white hover:no-underline sm:p-8" style={{ background: "linear-gradient(110deg,#5b2bb5 0%,#2d5fd6 55%,#1b9e8a 100%)" }}>
          <span className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#fff 1.5px, transparent 1.5px)", backgroundSize: "22px 22px" }} aria-hidden="true" />
          <span className="relative flex flex-col gap-1.5">
            <span className="text-[13px] font-extrabold tracking-widest text-white/75">1분 테스트</span>
            <span className="text-[24px] leading-tight font-extrabold tracking-[-0.5px] sm:text-[30px]">나는 어떤 안전관리자일까?</span>
            <span className="text-[15px] text-white/85">원칙파 감독관 · 현장파 해결사 · 데이터파 분석가 · 소통파 교육자</span>
          </span>
          <span className="relative inline-flex min-h-[48px] items-center gap-2 rounded-full bg-white px-6 text-[16px] font-extrabold text-[#3b2a8f]">
            테스트 시작 <Icon name="arrow" size={18} />
          </span>
        </Link>

        {/* ── 도구 + 서식 ── */}
        <section className="flex flex-col gap-4" id="tools">
          <SectionHead icon="tool" tone="#6d3fc4" title="바로 쓰는 도구" desc="회원가입 없이 브라우저에서 계산하고 만듭니다" href="/tools/" more="전체 도구" />
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(250px, 100%), 1fr))" }}>
            {tools.map((t) => (
              <Link key={t.href} href={t.href} className="card lift flex flex-col gap-2 p-5 text-ink hover:border-[#cbb8f0] hover:text-ink hover:no-underline">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#f0eafc] text-[#6d3fc4]"><Icon name={TOOL_ICON[t.href] ?? "tool"} size={22} /></span>
                <span className="text-[17px] font-extrabold">{t.name}</span>
                <span className="text-[14px] leading-relaxed text-muted">{t.desc}</span>
              </Link>
            ))}
            {forms.map((x) => (
              <Link key={x.id} href={`/library/${x.id}/`} className="card lift flex flex-col gap-2 p-5 text-ink hover:border-accent hover:text-ink hover:no-underline">
                <FormatTile format={x.format} size={44} />
                <span className="mt-1 text-[17px] font-extrabold">{x.title}</span>
                <span className="line-clamp-2 text-[14px] leading-relaxed text-muted">{x.desc}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
