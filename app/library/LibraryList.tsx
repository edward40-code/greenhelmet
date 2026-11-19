"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import FieldFilter from "@/components/FieldFilter";
import { fieldName } from "@/lib/fields";
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
  const cats = useMemo(() => [...new Set(items.map((x) => x.category))], [items]);
  const kw = q.trim();
  const list = items.filter(
    (x) => (field === "all" || x.field === field) && (cat === "all" || x.category === cat) && (!kw || (x.title + x.desc + x.source).includes(kw))
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="card flex flex-col gap-3 p-4">
        <label className="sr-only" htmlFor="libq">자료 검색</label>
        <input id="libq" type="search" className="field" placeholder="자료 이름이나 내용으로 찾기 (예: TBM, 위험성평가, MSDS)" value={q} onChange={(e) => setQ(e.target.value)} />
        <FieldFilter value={field} onChange={setField} counts={counts} />
        <div className="flex flex-wrap items-center gap-2 text-[14px]">
          <span className="text-muted">종류</span>
          {["all", ...cats].map((k) => (
            <button key={k} type="button" aria-pressed={cat === k} onClick={() => setCat(k)} className={`min-h-[36px] rounded-md px-2.5 cursor-pointer ${cat === k ? "bg-ink font-bold text-white" : "text-ink hover:bg-bg"}`}>
              {k === "all" ? "전체" : k}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))" }}>
        {list.length === 0 && <p className="card m-0 p-6 text-center text-muted">찾는 자료가 없습니다.</p>}
        {list.map((x) => (
          <Link key={x.id} href={`/library/${x.id}/`} className="card flex flex-col gap-2 p-4 text-ink hover:border-accent hover:no-underline">
            <span className="flex flex-wrap items-center gap-2 text-[13px]">
              <FormatBadge format={x.format} />
              <span className="font-bold text-accent">{fieldName(x.field)}</span>
              <span className="text-muted">{x.category}</span>
            </span>
            <span className="text-[16px] leading-snug font-bold">{x.title}</span>
            <span className="line-clamp-2 text-[14px] leading-relaxed text-muted">{x.desc}</span>
            <span className="mt-auto text-[14px] font-bold text-accent">{x.type === "file" ? "무료 내려받기 →" : "자료 위치 보기 →"}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
