"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FilterLayout, Group, Opt, ResultHead } from "@/components/SideFilter";
import { FIELDS, fieldName } from "@/lib/fields";
import { FieldChip, FormatTile } from "@/components/visual";
import type { LibItem } from "@/lib/library";

export function FormatBadge({ format }: { format: string }) {
  const color: Record<string, string> = { XLSX: "#1d6f42", PDF: "#b3261e", PPTX: "#c4501b", HWP: "#1f5fa8", DOCX: "#2b579a", 링크: "#4a5a63" };
  return (
    <span className="inline-block rounded px-1.5 py-px text-[11px] font-bold text-white" style={{ background: color[format] ?? "#4a5a63" }}>
      {format}
    </span>
  );
}

export default function LibraryList({ items }: { items: LibItem[] }) {
  const [field, setField] = useState("all");
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    items.forEach((x) => (c[x.field] = (c[x.field] ?? 0) + 1));
    return c;
  }, [items]);
  const cats = useMemo(() => {
    const order = ["법정 점검표", "서식·양식", "교육자료", "공공자료"];
    const rank = (c: string) => (order.indexOf(c) < 0 ? order.length : order.indexOf(c));
    return [...new Set(items.map((x) => x.category))].sort((a, b) => rank(a) - rank(b));
  }, [items]);
  const kw = q.trim();
  const list = items.filter(
    (x) => (field === "all" || x.field === field) && (cat === "all" || x.category === cat) && (!kw || (x.title + x.desc + x.source).includes(kw))
  );

  const catCounts = useMemo(() => {
    const c: Record<string, number> = {};
    items.forEach((x) => (c[x.category] = (c[x.category] ?? 0) + 1));
    return c;
  }, [items]);
  const active = [field !== "all" && fieldName(field), cat !== "all" && cat, kw && `"${kw}"`].filter(Boolean) as string[];

  return (
    <FilterLayout
      side={
        <>
          <div className="flex flex-col gap-1.5">
            <label className="px-1 text-[12px] font-bold tracking-wide text-muted" htmlFor="libq">자료 찾기</label>
            <input id="libq" type="search" className="field" placeholder="예: 폐기물, 밀폐공간" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <Group title="분야">
            <Opt on={field === "all"} onClick={() => setField("all")} label="전체" n={items.length} tone="accent" />
            {FIELDS.map((f) => (
              <Opt key={f.key} on={field === f.key} dim={!counts[f.key]} onClick={() => setField(f.key)} label={f.name} n={counts[f.key] ?? 0} tone="accent" />
            ))}
          </Group>
          <Group title="종류">
            <Opt on={cat === "all"} onClick={() => setCat("all")} label="전체" tone="ink" />
            {cats.map((k) => (
              <Opt key={k} on={cat === k} onClick={() => setCat(k)} label={k} n={catCounts[k]} tone="ink" />
            ))}
          </Group>
        </>
      }
    >
      <ResultHead count={list.length} unit="개" active={active} />
      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))" }}>
        {list.length === 0 && <p className="card m-0 p-6 text-center text-muted">찾는 자료가 없습니다.</p>}
        {list.map((x) => (
          <Link key={x.id} href={`/library/${x.id}/`} className="card lift flex gap-4 p-4 text-ink hover:border-accent hover:text-ink hover:no-underline sm:p-5">
            <FormatTile format={x.format} size={52} />
            <span className="flex min-w-0 flex-1 flex-col gap-1.5">
              <span className="flex flex-wrap items-center gap-2 text-[13px]">
                <FieldChip field={x.field} />
                <span className="text-muted">{x.category}</span>
              </span>
              <span className="text-[16px] leading-snug font-bold">{x.title}</span>
              <span className="line-clamp-2 text-[14px] leading-relaxed text-muted">{x.desc}</span>
              <span className="mt-auto inline-flex items-center gap-1 pt-1 text-[14px] font-bold text-accent">
                {x.type === "file" ? "내려받기" : "자료 위치 보기 ↗"}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </FilterLayout>
  );
}
