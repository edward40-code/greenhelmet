import Link from "next/link";
import catalog from "@/content/catalog.json";
import { Soon } from "./ui";
import { Icon } from "./icons";

const TOOL_ICON: Record<string, string> = { "/tools/tbm/": "people", "/tools/calc/": "calc", "/tools/career/": "clock", "/tools/test/": "spark", "/tools/msds/": "chem", "/law/": "doc", "/tools/diagnosis/": "check" };

const cardCls = "flex flex-col gap-1.5 rounded-xl border border-line-soft bg-white p-4 text-ink";

export function ToolGrid() {
  return (
    <>
      {catalog.toolGroups.map((g) => (
        <div key={g.name} className="flex flex-col gap-2">
          <h3 className="m-0 text-[14px] font-bold text-muted">{g.name}</h3>
          <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(200px, 100%), 1fr))" }}>
            {g.tools.map((t) =>
              t.open ? (
                <Link key={t.href} href={t.href} className={`${cardCls} lift hover:border-[#cbb8f0] hover:text-ink hover:no-underline`}>
                  <span className="mb-1 grid h-10 w-10 place-items-center rounded-xl bg-[#f0eafc] text-[#6d3fc4]"><Icon name={TOOL_ICON[t.href] ?? "tool"} size={20} /></span>
                  <span className="text-[16px] font-bold text-ink">{t.name}</span>
                  <span className="text-[14px] leading-normal text-muted">{t.desc}</span>
                </Link>
              ) : (
                <div key={t.href} className={`${cardCls} !bg-[#f7f9fa]`} aria-disabled="true">
                  <span className="mb-1 grid h-10 w-10 place-items-center rounded-xl bg-[#e9edef] text-[#8d9aa1]"><Icon name={TOOL_ICON[t.href] ?? "tool"} size={20} /></span>
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
