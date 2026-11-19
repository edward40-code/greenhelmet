import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ToolShell from "@/components/ToolShell";
import { Icon } from "@/components/icons";
import { FieldChip, FormatTile } from "@/components/visual";
import { allMaps, getMap } from "@/lib/guidemaps";
import { getLib } from "@/lib/library";
import { fmtDate } from "@/lib/fields";

export const dynamicParams = false;
export const generateStaticParams = () => allMaps().map((m) => ({ slug: m.slug }));

type P = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const m = getMap((await params).slug);
  if (!m) return {};
  return {
    title: `${m.title} 지침 지도 · 법 조문·고시·기술지원규정(KOSHA GUIDE)·자료 한 장 정리`,
    description: m.summary,
    alternates: { canonical: `/guidemap/${m.slug}/` },
  };
}

// 효력의 세기에 따라 색을 달리한다 (법적 의무일수록 진하게)
const FORCE: Record<string, string> = {
  law: "bg-[#fdecec] text-[#8a1f11]",
  notice: "bg-warn-bg text-warn-ink",
  kosha: "bg-[#eaf0f3] text-[#34505e]",
  material: "bg-bg text-muted",
  interp: "bg-[#f2ecfe] text-[#5b2bb5]",
};

export default async function Page({ params }: P) {
  const m = getMap((await params).slug);
  if (!m) notFound();
  const libs = m.library.map((id) => getLib(id)).filter((x) => !!x);

  return (
    <ToolShell width={980} title={`${m.title} 지침 지도`} desc={m.summary}>
      <section className="card flex flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2 text-[13px] text-muted">
          <Link href="/guidemap/">지침 지도</Link> <span>›</span>
          <FieldChip field={m.field} />
          <span>{fmtDate(m.checked)} 확인</span>
        </div>
        <h2 className="m-0 text-[18px] font-extrabold">한눈에</h2>
        <div className="grid gap-2.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(210px, 100%), 1fr))" }}>
          {m.glance.map((g) => (
            <div key={g.label} className="flex flex-col gap-1 rounded-xl bg-bg p-4">
              <span className="text-[13px] font-bold text-muted">{g.label}</span>
              <span className="text-[19px] leading-snug font-extrabold text-accent">{g.value}</span>
              <span className="text-[13px] leading-relaxed text-muted">{g.note}</span>
            </div>
          ))}
        </div>
        <p className="m-0 text-[15px] leading-relaxed">아래로 내려갈수록 <strong>강제력은 약해지고 내용은 구체적</strong>이 됩니다. 먼저 ①에서 지켜야 할 기준을 확인하고, 방법이 궁금하면 ③과 ④를 보세요.</p>
        <nav aria-label="이 지도의 차례" className="flex flex-wrap gap-2">
          {m.steps.map((s, i) => (
            <a key={s.key} href={`#${s.key}`} className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-line bg-white px-3 text-[14px] text-ink hover:border-accent hover:no-underline">
              <b className="text-accent">{i + 1}</b> {s.title.replace(/ \(.*\)$/, "")}
            </a>
          ))}
          <a href="#ours" className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-line bg-white px-3 text-[14px] text-ink hover:border-accent hover:no-underline">
            <b className="text-accent">{m.steps.length + 1}</b> 그린헬멧기사 자료
          </a>
        </nav>
      </section>

      {m.steps.map((s, i) => (
        <section key={s.key} id={s.key} className="card flex scroll-mt-20 flex-col gap-3 p-5">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-[15px] font-bold text-white">{i + 1}</span>
            <h2 className="m-0 text-[19px] font-extrabold">{s.title}</h2>
            <span className={`rounded-full px-2.5 py-0.5 text-[13px] font-bold ${FORCE[s.key] ?? FORCE.material}`}>{s.force}</span>
          </div>
          <p className="m-0 text-[13px] text-muted">있는 곳 · {s.where}</p>
          <p className="m-0 text-[15px] leading-[1.75]">{s.intro}</p>
          <ul className="m-0 flex list-none flex-col p-0">
            {s.items.map((it) => (
              <li key={it.name} className="flex flex-col gap-0.5 border-t border-line-soft py-3 first:border-t-0">
                {it.url ? (
                  <a href={encodeURI(it.url)} target="_blank" rel="noopener" className="inline-flex items-start gap-1.5 text-[16px] leading-snug font-bold">
                    {it.name} <span className="mt-0.5 shrink-0"><Icon name="link" size={15} /></span>
                  </a>
                ) : (
                  <span className="text-[16px] leading-snug font-bold">{it.name}</span>
                )}
                <span className="text-[13px] text-muted">{it.meta}</span>
                <span className="text-[15px] leading-relaxed">{it.why}</span>
              </li>
            ))}
          </ul>
          {s.note && <p className="m-0 rounded-md bg-bg px-4 py-3 text-[14px] leading-relaxed">{s.note}</p>}
          {s.more && (
            <a href={encodeURI(s.more.url)} target="_blank" rel="noopener" className="inline-flex min-h-[44px] items-center gap-1.5 self-start rounded-md border border-accent px-4 text-[15px] font-bold">
              {s.more.label} ↗
            </a>
          )}
        </section>
      ))}

      <section id="ours" className="card flex scroll-mt-20 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-[15px] font-bold text-white">{m.steps.length + 1}</span>
          <h2 className="m-0 text-[19px] font-extrabold">그린헬멧기사 자료</h2>
          <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-[13px] font-bold text-accent">바로 쓰는 서식</span>
        </div>
        <p className="m-0 text-[15px] leading-[1.75]">①의 법 조문을 원문으로 확인해 만든 점검표·양식·교육자료입니다. 무료로 내려받아 고쳐 쓸 수 있습니다.</p>
        <div className="grid gap-2.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))" }}>
          {libs.map((x) => (
            <Link key={x!.id} href={`/library/${x!.id}/`} className="lift flex items-start gap-3 rounded-xl border border-line-soft bg-white p-4 text-ink hover:border-accent hover:text-ink hover:no-underline">
              <FormatTile format={x!.format} size={44} />
              <span className="flex min-w-0 flex-col gap-1">
                <span className="text-[13px] text-muted">{x!.category}</span>
                <span className="text-[15px] leading-snug font-bold">{x!.title}</span>
              </span>
            </Link>
          ))}
        </div>
        <ul className="m-0 flex list-none flex-col p-0">
          {m.extra.map((e) => (
            <li key={e.href} className="border-t border-line-soft py-3 text-[15px]">
              <Link href={e.href} className="font-bold">{e.name} →</Link> <span className="text-muted">{e.why}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="m-0 text-[14px] leading-relaxed text-muted">
        {fmtDate(m.checked)}에 각 사이트의 검색 화면과 법령 원문으로 확인한 내용입니다. 법령과 지침은 바뀌고, 안전보건공단은 기술지원규정의 이름과 번호를 고치는 중이므로 쓰기 전에 원본에서 현행 여부를 확인하세요. 자료의 저작권은 각 기관에 있으며 그린헬멧기사는 위치만 안내합니다. 일반 정보이며 법률 자문이 아닙니다.
      </p>
    </ToolShell>
  );
}
