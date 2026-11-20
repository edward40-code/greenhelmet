import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import { getLib } from "@/lib/library";
import { fmtDate } from "@/lib/fields";
import { market, marketCount } from "@/lib/market";

export const metadata: Metadata = {
  title: "안전장터 · 작업별 보호구와 안전장비 (안전인증 대상 표시)",
  description: "밀폐공간, 추락, 끼임, 화학물질, 소음, 용접 작업에 쓰는 보호구와 장비를 작업별로 모았습니다. 품목마다 산업안전보건법 안전인증 대상인지와 고를 때 볼 것을 적었습니다.",
  alternates: { canonical: "/market/" },
};

const CERT_CLS: Record<string, string> = {
  kcs: "border-danger text-danger",
  self: "border-ink text-ink",
  none: "border-line text-muted",
};

export default function Page() {
  const m = market();
  return (
    <SiteShell active="market" width={980} title="안전장터" desc={`작업별 보호구와 장비 ${marketCount()}종`}>
      <p className="m-0 rounded-md border border-line bg-white px-4 py-3 text-[14px]">{m.disclosure}</p>

      <nav aria-label="작업 고르기" className="flex flex-wrap gap-1.5">
        {m.groups.map((g) => (
          <a key={g.key} href={`#${g.key}`} className="inline-flex min-h-[38px] items-center gap-1.5 rounded-md border border-line bg-white px-3.5 text-[14px] font-semibold text-ink hover:border-accent hover:text-accent hover:no-underline">
            {g.name} <span className="text-muted">{g.items.length}</span>
          </a>
        ))}
      </nav>

      {m.groups.map((g) => {
        const libs = g.library.map((id) => getLib(id)).filter(Boolean);
        return (
          <section key={g.key} id={g.key} className="card flex scroll-mt-20 flex-col gap-1 p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b-2 border-ink pb-2">
              <h2 className="m-0 text-[20px] font-extrabold">{g.name}</h2>
              {libs.length > 0 && (
                <span className="flex flex-wrap gap-x-3 text-[14px]">
                  {libs.map((x) => (
                    <Link key={x!.id} href={`/library/${x!.id}/`}>{x!.title}</Link>
                  ))}
                </span>
              )}
            </div>
            <ul className="m-0 flex list-none flex-col p-0">
              {g.items.map((it) => {
                const c = m.certs[it.cert];
                return (
                  <li key={it.id} className="flex flex-col gap-2 border-t border-line-soft py-4 first:border-t-0 sm:flex-row sm:gap-6">
                    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                      <h3 className="m-0 text-[17px] leading-snug font-bold">{it.name}</h3>
                      <p className="m-0 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px]">
                        <span className={`rounded-full border px-2 py-px font-bold ${CERT_CLS[it.cert]}`}>{c.label}</span>
                        <span className="text-muted">{it.certSub ?? c.basis}</span>
                      </p>
                      {it.certNote && <p className="m-0 text-[13px] text-muted">{it.certNote}</p>}
                      <ul className="m-0 list-disc pl-5 text-[14px] leading-relaxed">
                        {it.check.map((t) => <li key={t}>{t}</li>)}
                      </ul>
                      {it.law && <p className="m-0 text-[13px] text-muted">{it.law}</p>}
                    </div>
                    {it.products.length > 0 && (
                      <div className="flex shrink-0 flex-col gap-1.5 sm:w-[240px]">
                        {it.products.map((p) => (
                          <a key={p.url} href={p.url} target="_blank" rel="sponsored nofollow noopener" className="inline-flex min-h-[44px] items-center justify-between gap-2 rounded-md bg-ink px-4 text-[14px] font-bold text-white hover:text-white hover:no-underline">
                            <span className="min-w-0 truncate">{p.name}</span>
                            <span className="shrink-0">↗</span>
                          </a>
                        ))}
                        <span className="text-[12px] text-muted">제휴 링크</span>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      <p className="m-0 text-[13px] text-muted">
        안전인증 대상은 인증을 받지 않으면 판매·사용할 수 없음 (산업안전보건법 제87조) · 인증 대상 구분 {fmtDate(m.checked)} 확인
      </p>
    </SiteShell>
  );
}
