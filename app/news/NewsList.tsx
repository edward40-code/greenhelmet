"use client";

import { useMemo, useState } from "react";
import FieldFilter from "@/components/FieldFilter";
import { fieldName, fmtDate } from "@/lib/fields";
import type { NewsItem } from "@/lib/news";

const PAGE = 30;

export default function NewsList({ items }: { items: NewsItem[] }) {
  const [field, setField] = useState("all");
  const [kind, setKind] = useState("all");
  const [shown, setShown] = useState(PAGE);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    items.forEach((x) => (c[x.field] = (c[x.field] ?? 0) + 1));
    return c;
  }, [items]);
  const kinds = useMemo(() => [...new Set(items.map((x) => x.kind))], [items]);
  const list = items.filter((x) => (field === "all" || x.field === field) && (kind === "all" || x.kind === kind));

  return (
    <div className="flex flex-col gap-4">
      <div className="card flex flex-col gap-3 p-4">
        <FieldFilter value={field} onChange={(v) => { setField(v); setShown(PAGE); }} counts={counts} />
        {kinds.length > 1 && (
          <div className="flex flex-wrap items-center gap-2 text-[14px]">
            <span className="text-muted">종류</span>
            {["all", ...kinds].map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={kind === k}
                onClick={() => { setKind(k); setShown(PAGE); }}
                className={`min-h-[36px] rounded-md px-2.5 cursor-pointer ${kind === k ? "bg-ink font-bold text-white" : "text-ink hover:bg-bg"}`}
              >
                {k === "all" ? "전체" : k}
              </button>
            ))}
          </div>
        )}
      </div>

      <ul className="card m-0 list-none p-0">
        {list.length === 0 && <li className="p-6 text-center text-muted">이 분야 소식은 아직 없습니다.</li>}
        {list.slice(0, shown).map((x) => (
          <li key={x.id} className="border-t border-line-soft first:border-t-0">
            <a href={x.url} target="_blank" rel="noopener" className="flex flex-col gap-1 px-4 py-3.5 text-ink hover:bg-[#f7f9fa] hover:no-underline sm:px-5">
              <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px]">
                <span className="font-bold text-accent">{fieldName(x.field)}</span>
                <span className="rounded bg-bg px-1.5 py-px text-muted">{x.kind}</span>
                <span className="text-muted">{x.source} · {fmtDate(x.date)}</span>
              </span>
              <span className="text-[16px] leading-snug font-medium">{x.title}<span className="ml-1 text-[12px] text-muted" aria-label="새 창">↗</span></span>
              {x.summary && <span className="text-[14px] leading-relaxed text-muted">{x.summary}</span>}
            </a>
          </li>
        ))}
      </ul>
      {list.length > shown && (
        <button type="button" onClick={() => setShown((s) => s + PAGE)} className="min-h-[44px] self-center rounded-md border border-line bg-white px-5 text-[15px] cursor-pointer">
          더 보기
        </button>
      )}
    </div>
  );
}
