import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ToolShell from "@/components/ToolShell";
import { FieldChip, FormatTile } from "@/components/visual";
import { allInventories, getInventory, totalOf } from "@/lib/inventory";
import { getLib } from "@/lib/library";
import { fmtDate } from "@/lib/fields";
import InventoryView from "../InventoryView";

export const dynamicParams = false;
export const generateStaticParams = () => allInventories().map((m) => ({ slug: m.slug }));

type P = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const m = getInventory((await params).slug);
  if (!m) return {};
  return {
    title: `${m.title} 지침 인벤토리 · 법 조문·고시·기술지원규정(KOSHA GUIDE)·자료 ${totalOf(m)}건 목록`,
    description: m.summary,
    alternates: { canonical: `/inventory/${m.slug}/` },
  };
}

export default async function Page({ params }: P) {
  const m = getInventory((await params).slug);
  if (!m) notFound();
  const libs = m.library.map((id) => getLib(id)).filter((x) => !!x);
  const picks = m.groups.flatMap((g) => g.items.filter((it) => it.pick).map((it) => ({ ...it, group: g.short, key: g.key })));

  return (
    <ToolShell width={980} title={`${m.title} 지침 인벤토리`} desc={m.summary}>
      <section className="card flex flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2 text-[13px] text-muted">
          <Link href="/inventory/">지침 인벤토리</Link> <span>›</span>
          <FieldChip field={m.field} />
          <span>{fmtDate(m.checked)} 확인</span>
        </div>
        <h2 className="m-0 text-[18px] font-extrabold">
          모두 <span className="text-accent">{totalOf(m)}건</span>
        </h2>
        <div className="grid gap-2.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(150px, 100%), 1fr))" }}>
          {m.groups.map((g, i) => (
            <a key={g.key} href={`#${g.key}`} className="flex flex-col gap-0.5 rounded-xl bg-bg p-3.5 text-ink hover:text-ink hover:no-underline hover:outline hover:outline-1 hover:outline-accent">
              <span className="text-[13px] font-bold text-muted">{i + 1}. {g.short}</span>
              <span className="text-[24px] leading-tight font-extrabold text-accent">{g.items.length}</span>
              <span className="text-[12px] leading-snug text-muted">{g.count}</span>
            </a>
          ))}
          <a href="#ours" className="flex flex-col gap-0.5 rounded-xl bg-accent-soft p-3.5 text-ink hover:text-ink hover:no-underline hover:outline hover:outline-1 hover:outline-accent">
            <span className="text-[13px] font-bold text-muted">{m.groups.length + 1}. 우리 자료</span>
            <span className="text-[24px] leading-tight font-extrabold text-accent">{libs.length}</span>
            <span className="text-[12px] leading-snug text-muted">점검표·양식·교육자료</span>
          </a>
        </div>
        <p className="m-0 text-[15px] leading-relaxed">번호가 커질수록 <strong>강제력은 약해지고 내용은 구체적</strong>이 됩니다. 1번은 지키지 않으면 법 위반이고, 3번과 4번은 방법을 알려 주는 참고 자료입니다.</p>
      </section>

      <section className="card flex flex-col gap-2 p-5">
        <h2 className="m-0 text-[18px] font-extrabold"><span className="text-[#c98a00]">★</span> 처음이라면 이것부터 ({picks.length}건)</h2>
        <p className="m-0 text-[14px] text-muted">전체를 다 볼 필요는 없습니다. 아래 목록에서 ★가 붙은 것만 먼저 보세요.</p>
        <ol className="m-0 flex list-none flex-col p-0">
          {picks.map((it) => (
            <li key={it.name + it.meta} className="flex flex-col gap-0.5 border-t border-line-soft py-2.5 first:border-t-0 sm:flex-row sm:items-baseline sm:gap-3">
              <span className="w-[92px] shrink-0 text-[13px] font-bold text-muted">{it.group}</span>
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="text-[15px] leading-snug font-bold">{it.name}</span>
                {it.why && <span className="text-[14px] leading-relaxed text-muted">{it.why}</span>}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <InventoryView groups={m.groups} />

      <section id="ours" className="card flex scroll-mt-20 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-[15px] font-bold text-white">{m.groups.length + 1}</span>
          <h2 className="m-0 text-[19px] font-extrabold">그린헬멧기사 자료</h2>
          <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-[13px] font-bold text-accent">바로 쓰는 서식</span>
          <span className="text-[14px] text-muted">{libs.length}건</span>
        </div>
        <p className="m-0 text-[15px] leading-[1.75]">1번의 법 조문을 원문으로 확인해 만든 점검표·양식·교육자료입니다. 무료로 내려받아 고쳐 쓸 수 있습니다.</p>
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
        {fmtDate(m.checked)}에 각 사이트의 검색 화면과 법령 원문으로 확인한 목록입니다. 법령과 지침은 바뀌고, 안전보건공단은 기술지원규정의 이름과 번호를 고치는 중이므로 쓰기 전에 원본에서 현행 여부를 확인하세요. 자료의 저작권은 각 기관에 있으며 그린헬멧기사는 위치만 안내합니다. 일반 정보이며 법률 자문이 아닙니다.
      </p>
    </ToolShell>
  );
}
