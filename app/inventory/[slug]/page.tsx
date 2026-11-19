import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ToolShell from "@/components/ToolShell";
import { FieldChip } from "@/components/visual";
import { allInventories, getInventory, totalOf, type InvGroup } from "@/lib/inventory";
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
  const ours: InvGroup = {
    key: "ours",
    title: "그린헬멧기사 자료",
    short: "우리 자료",
    force: "점검표·양식·교육자료",
    where: "자료실",
    items: [
      ...m.library.map((id) => getLib(id)).filter((x) => !!x).map((x) => ({ name: x!.title, meta: `${x!.category} · ${x!.format}`, href: `/library/${x!.id}/` })),
      ...m.extra.map((e) => ({ name: e.name, meta: "도구·사고속보", href: e.href })),
    ],
  };
  const groups = [...m.groups, ours];

  return (
    <ToolShell width={980} title={`${m.title} 지침 인벤토리`} desc={groups.map((g) => `${g.short} ${g.items.length}`).join(" · ")}>
      <InventoryView
        groups={groups}
        head={
          <div className="flex flex-wrap items-center gap-2 text-[13px] text-muted">
            <Link href="/inventory/">지침 인벤토리</Link> <span>›</span>
            <FieldChip field={m.field} />
            <span>{fmtDate(m.checked)} 확인</span>
          </div>
        }
      />
      <p className="m-0 text-[13px] text-muted">{fmtDate(m.checked)} 확인 · 원본의 저작권은 각 기관에 있습니다.</p>
    </ToolShell>
  );
}
