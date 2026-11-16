import Link from "next/link";
import catalog from "@/content/catalog.json";
import { Soon } from "./ui";

const cardCls = "flex flex-col gap-1 rounded-md border border-line p-3.5 text-ink";

export function CertGrid() {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(160px, 100%), 1fr))" }}>
      {catalog.certs.map((c) =>
        c.open ? (
          <Link key={c.slug} href={`/cert/${c.slug}/`} className={`${cardCls} border-accent hover:bg-accent-soft hover:no-underline`}>
            <span className="text-[16px] font-bold text-ink">{c.name}</span>
            <span className="text-[13px] text-muted">{c.sub}</span>
          </Link>
        ) : (
          <div key={c.slug} className={`${cardCls} bg-[#f7f9fa]`} aria-disabled="true">
            <span className="text-[16px] font-bold text-muted">{c.name}<Soon /></span>
            <span className="text-[13px] text-muted">{c.sub}</span>
          </div>
        )
      )}
    </div>
  );
}

export function ToolGrid() {
  return (
    <>
      {catalog.toolGroups.map((g) => (
        <div key={g.name} className="flex flex-col gap-2">
          <h3 className="m-0 text-[14px] font-bold text-muted">{g.name}</h3>
          <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(200px, 100%), 1fr))" }}>
            {g.tools.map((t) =>
              t.open ? (
                <Link key={t.href} href={t.href} className={`${cardCls} hover:border-accent hover:bg-accent-soft hover:no-underline`}>
                  <span className="text-[16px] font-bold text-ink">{t.name}</span>
                  <span className="text-[13px] leading-normal text-muted">{t.desc}</span>
                </Link>
              ) : (
                <div key={t.href} className={`${cardCls} bg-[#f7f9fa]`} aria-disabled="true">
                  <span className="text-[16px] font-bold text-muted">{t.name}<Soon /></span>
                  <span className="text-[13px] leading-normal text-muted">{t.desc}</span>
                </div>
              )
            )}
          </div>
        </div>
      ))}
    </>
  );
}

export function HallTabs() {
  return (
    <nav aria-label="관 선택" className="bg-accent">
      <div className="mx-auto flex max-w-[1240px] flex-wrap gap-x-1 px-4 sm:px-5">
        {catalog.halls.map((h) =>
          h.open ? (
            <span key={h.key} aria-current="page" className="flex min-h-[48px] items-center bg-white px-[18px] text-[16px] font-extrabold text-ink">
              {h.name}
            </span>
          ) : (
            <span key={h.key} className="flex min-h-[48px] items-center px-3 text-[15px] font-medium text-[#cfe6d6] sm:px-[18px]" title="준비 중입니다">
              {h.name}
              <span className="ml-1 text-[11px] text-[#a9d8b8]">준비 중</span>
            </span>
          )
        )}
        <Link href="/tools/" className="ml-auto flex min-h-[48px] items-center px-[18px] text-[16px] font-medium text-white hover:text-white">
          도구
        </Link>
      </div>
    </nav>
  );
}
