"use client";

import { useEffect, useMemo, useState } from "react";
import { FIELDS, fieldName, fmtDate, fieldStyle } from "@/lib/fields";
import { FieldChip } from "@/components/visual";
import { Icon } from "@/components/icons";
import { accKindOf, accTagCounts, type AccItem } from "@/lib/accKind";
import Link from "next/link";
import { slugOf, type NewsItem } from "@/lib/news";
import { FilterLayout, Group, Opt, ResultHead } from "@/components/SideFilter";

const PAGE = 30;
const INDUSTRY = new Set(["건설", "제조", "조선", "물류·유통", "농업·식품", "수산·어업", "청소·시설관리"]);

export default function NewsList({ items, variant = "news" }: { items: (NewsItem & Partial<AccItem>)[]; variant?: "news" | "accidents" }) {
  const [field, setField] = useState("all");
  const [kind, setKind] = useState("all");
  const [shown, setShown] = useState(PAGE);
  const [tag, setTag] = useState("all");
  // ?field=... (메인 '분야별로 보기'), ?tag=... (사고 상세의 #태그) 로 들어오면 그 조건을 먼저 건다
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const f = q.get("field");
    if (f) setField(f);
    const t = q.get("tag");
    if (t) setTag(t);
  }, []);
  const tags = useMemo(() => accTagCounts(items as AccItem[]), [items]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    items.forEach((x) => (c[x.field] = (c[x.field] ?? 0) + 1));
    return c;
  }, [items]);
  const kinds = useMemo(() => [...new Set(items.map((x) => x.kind))], [items]);
  const list = items.filter((x) => (field === "all" || x.field === field) && (kind === "all" || x.kind === kind) && (tag === "all" || (x.tags ?? []).includes(tag)));

  const industryTags = tags.filter(([t]) => INDUSTRY.has(t));
  const situationTags = tags.filter(([t]) => !INDUSTRY.has(t));
  const total = items.length;
  const active = [field !== "all" && fieldName(field), kind !== "all" && kind, tag !== "all" && `#${tag}`].filter(Boolean) as string[];

  return (
    <FilterLayout
      side={
        <>
        <Group title="분야">
          <Opt on={field === "all"} onClick={() => { setField("all"); setShown(PAGE); }} label="전체" n={total} tone="accent" />
          {FIELDS.map((f) => (
            <Opt key={f.key} on={field === f.key} dim={!counts[f.key]} onClick={() => { setField(f.key); setShown(PAGE); }} label={f.name} n={counts[f.key] ?? 0} dot={fieldStyle(f.key).c} tone="accent" />
          ))}
        </Group>
        {kinds.length > 1 && (
          <Group title="종류">
            {["all", ...kinds].map((k) => (
              <Opt key={k} on={kind === k} onClick={() => { setKind(k); setShown(PAGE); }} label={k === "all" ? "전체" : k} tone="ink" />
            ))}
          </Group>
        )}
        {situationTags.length > 0 && (
          <Group title="상황·기인물">
            <Opt on={tag === "all"} onClick={() => { setTag("all"); setShown(PAGE); }} label="전체" tone="danger" />
            {situationTags.map(([t, n]) => (
              <Opt key={t} on={tag === t} onClick={() => { setTag(t); setShown(PAGE); }} label={`#${t}`} n={n} tone="danger" />
            ))}
          </Group>
        )}
        {industryTags.length > 0 && (
          <Group title="업종">
            {industryTags.map(([t, n]) => (
              <Opt key={t} on={tag === t} onClick={() => { setTag(t); setShown(PAGE); }} label={`#${t}`} n={n} tone="danger" />
            ))}
          </Group>
        )}
        </>
      }
    >
      <ResultHead count={list.length} active={active} />
      <ul className="card m-0 list-none p-0">
        {list.length === 0 && <li className="p-6 text-center text-muted">조건에 맞는 항목이 아직 없습니다.</li>}
        {list.slice(0, shown).map((x) => {
          const acc = variant === "accidents" ? accKindOf(x) : null;
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
                    {acc && (x.tags ?? []).map((t) => <span key={t} className="text-[#8a5a50]">#{t}</span>)}
                    {!acc && <span className="rounded bg-bg px-1.5 py-px">{x.kind}</span>}
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
    </FilterLayout>
  );
}
