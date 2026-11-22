import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import { AdSlot } from "@/components/ui";
import { FormatTile } from "@/components/visual";
import { ACC_LIBRARY, accKindOf, accTagCounts, weekAccidents } from "@/lib/accidents";
import { slugOf } from "@/lib/news";
import { getLib } from "@/lib/library";
import { fmtDate } from "@/lib/fields";

export const metadata: Metadata = {
  title: "이번 주 사고 · 최근 7일 산업현장 사고 보도 정리",
  description: "최근 7일 동안 보도된 산업현장 추락·끼임·깔림·화재 사고를 유형별 건수와 짧은 요약으로 정리합니다. 많이 난 사고 유형의 예방 점검표를 함께 봅니다.",
  alternates: { canonical: "/accidents/week/" },
};

const md = (d: string) => `${Number(d.slice(5, 7))}.${Number(d.slice(8, 10))}`;

export default function Page() {
  const { start, end, items, prevCount } = weekAccidents();

  const kinds: Record<string, { label: string; n: number }> = {};
  items.forEach((x) => {
    const k = accKindOf(x);
    const key = k.label ? k.icon : "alert";
    kinds[key] = { label: k.label || "기타·조사 중", n: (kinds[key]?.n ?? 0) + 1 };
  });
  const kindRows = Object.entries(kinds).sort((a, b) => b[1].n - a[1].n);
  const maxN = kindRows[0]?.[1].n ?? 1;
  const top = kindRows.find(([k]) => k !== "alert")?.[0];
  const libs = (ACC_LIBRARY[top ?? "alert"] ?? []).map(getLib).filter((v): v is NonNullable<typeof v> => !!v);
  const tags = accTagCounts(items).slice(0, 10);
  const diff = items.length - prevCount;

  return (
    <SiteShell
      active="accidents"
      title="이번 주 사고"
      desc={`${md(start)} – ${md(end)} · 보도 ${items.length}건`}
      width={960}
    >
      <section className="card flex flex-col gap-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-end gap-x-8 gap-y-3">
          <div className="flex flex-col">
            <span className="text-[14px] text-muted">최근 7일 사고 보도</span>
            <span className="text-[34px] leading-tight font-extrabold">{items.length}<span className="text-[18px]">건</span></span>
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] text-muted">그 전 7일</span>
            <span className="text-[22px] leading-tight font-bold">
              {prevCount}건
              {diff !== 0 && <span className="ml-1.5 text-[15px] font-bold text-danger">{diff > 0 ? `▲${diff}` : `▼${-diff}`}</span>}
            </span>
          </div>
        </div>

        {kindRows.length > 0 && (
          <div className="flex flex-col gap-2">
            <h2 className="m-0 text-[17px] font-extrabold">유형별</h2>
            <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
              {kindRows.map(([k, v]) => (
                <li key={k} className="grid grid-cols-[84px_1fr_36px] items-center gap-2 text-[15px]">
                  <span className="font-bold">{v.label}</span>
                  <span className="h-2.5 rounded-sm bg-line-soft">
                    <span className="block h-full rounded-sm bg-danger" style={{ width: `${(v.n / maxN) * 100}%` }} />
                  </span>
                  <span className="text-right font-bold">{v.n}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map(([t, n]) => (
              <Link key={t} href={`/accidents/?tag=${encodeURIComponent(t)}`} className="inline-flex min-h-[34px] items-center gap-1 rounded-full border border-line px-3 text-[14px] text-ink hover:border-danger hover:text-danger hover:no-underline">
                #{t} <b>{n}</b>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="card m-0 flex flex-col p-0">
        <h2 className="m-0 px-5 pt-5 pb-2 text-[17px] font-extrabold sm:px-6">사고 목록</h2>
        {items.length === 0 && <p className="m-0 px-5 pb-5 text-muted sm:px-6">최근 7일 보도 없음</p>}
        <ul className="m-0 list-none p-0">
          {items.map((x) => {
            const k = accKindOf(x);
            return (
              <li key={x.id} className="border-t border-line-soft first:border-t-0">
                <Link href={`/accidents/${slugOf(x.id)}/`} className="flex flex-col gap-1 px-5 py-4 text-ink hover:bg-[#fff7f6] hover:no-underline sm:px-6">
                  <span className="flex flex-wrap items-center gap-x-2 text-[13px] text-muted">
                    {k.label && <b className="text-danger">{k.label}</b>}
                    <span>{fmtDate(x.date).slice(5)} · {x.source}</span>
                  </span>
                  <span className="text-[17px] leading-[1.5] font-semibold">{x.title}</span>
                  {x.summary && <span className="text-[15px] leading-relaxed text-[#3c4a52]">{x.summary}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {libs.length > 0 && (
        <section className="flex flex-col gap-3 rounded-md border border-line-soft bg-white p-5 sm:p-6">
          <h2 className="m-0 text-[17px] font-extrabold">{top ? `${kinds[top].label} 예방 점검표` : "점검표"}</h2>
          <div className="grid gap-2.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(240px, 100%), 1fr))" }}>
            {libs.map((l) => (
              <Link key={l.id} href={`/library/${l.id}/`} className="lift flex items-start gap-3 rounded-md bg-white p-3.5 text-ink hover:text-ink hover:no-underline">
                <FormatTile format={l.format} size={42} />
                <span className="text-[15px] leading-snug font-bold">{l.title}</span>
              </Link>
            ))}
          </div>
          <Link href="/tools/tbm/" className="self-start text-[15px] font-bold">TBM 자료 만들기 →</Link>
        </section>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="m-0 text-[13px] text-muted">보도된 사실만 정리 · 실명 미게재 · 기사 저작권은 각 언론사</p>
        <Link href="/accidents/" className="text-[15px] font-bold">전체 사고속보 →</Link>
      </div>
      <AdSlot slot="post_bottom" />
    </SiteShell>
  );
}
