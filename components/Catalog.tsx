import Link from "next/link";
import catalog from "@/content/catalog.json";
import { Soon } from "./ui";

const cardCls = "flex flex-col gap-1 rounded-md border border-line p-3.5 text-ink";

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
                  <span className="text-[14px] leading-normal text-muted">{t.desc}</span>
                </Link>
              ) : (
                <div key={t.href} className={`${cardCls} bg-[#f7f9fa]`} aria-disabled="true">
                  <span className="text-[16px] font-bold text-muted">{t.name}<Soon /></span>
                  <span className="text-[14px] leading-normal text-muted">{t.desc}</span>
                </div>
              )
            )}
          </div>
        </div>
      ))}
    </>
  );
}
