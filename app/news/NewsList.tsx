"use client";

import { useEffect, useMemo, useState } from "react";
import FieldFilter from "@/components/FieldFilter";
import { fmtDate, fieldStyle } from "@/lib/fields";
import { FieldChip } from "@/components/visual";
import { Icon } from "@/components/icons";
import { accKind } from "@/lib/accidents";
import Link from "next/link";
import { slugOf, type NewsItem } from "@/lib/news";

const PAGE = 30;

export default function NewsList({ items, variant = "news" }: { items: NewsItem[]; variant?: "news" | "accidents" }) {
  const [field, setField] = useState("all");
  const [kind, setKind] = useState("all");
  const [shown, setShown] = useState(PAGE);
  // 메인의 '분야별로 보기'에서 ?field=... 로 들어오면 그 분야를 먼저 보여 준다
  useEffect(() => {
    const f = new URLSearchParams(window.location.search).get("field");
    if (f) setField(f);
  }, []);

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
        {list.slice(0, shown).map((x) => {
          const acc = variant === "accidents" ? accKind(x.title) : null;
          return (
            <li key={x.id} className="border-t border-line-soft first:border-t-0">
              <Link href={`/${variant}/${slugOf(x.id)}/`} className="flex items-start gap-3.5 px-4 py-4 text-ink hover:bg-[#f7faf8] hover:no-underline sm:px-5">
                {acc ? (
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#fdecec] text-danger"><Icon name={acc.icon} size={20} /></span>
                ) : (
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ background: fieldStyle(x.field).soft, color: fieldStyle(x.field).c }}><Icon name={x.field} size={20} /></span>
                )}
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="text-[17px] leading-[1.5] font-semibold">{x.title}</span>
                  {x.summary && <span className="line-clamp-2 text-[15px] leading-relaxed text-muted">{x.summary}</span>}
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-muted">
                    {acc ? <b className="text-danger">{acc.label}</b> : <FieldChip field={x.field} />}
                    <span className="rounded bg-bg px-1.5 py-px">{x.kind}</span>
                    <span>{x.source} · {fmtDate(x.date)}</span>
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      {list.length > shown && (
        <button type="button" onClick={() => setShown((s) => s + PAGE)} className="min-h-[44px] self-center rounded-md border border-line bg-white px-5 text-[15px] cursor-pointer">
          더 보기
        </button>
      )}
    </div>
  );
}
