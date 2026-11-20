import Link from "next/link";
import catalog from "@/content/catalog.json";
import { Icon } from "./icons";

const TOOL_ICON: Record<string, string> = { "/tools/tbm/": "people", "/tools/calc/": "calc", "/tools/career/": "clock", "/tools/test/": "spark", "/tools/msds/": "chem", "/inventory/": "search", "/tools/diagnosis/": "check" };

const cardCls = "flex flex-col gap-1.5 rounded-md border border-line-soft bg-white p-4 text-ink";

export function ToolGrid() {
  // 아직 열지 않은 도구(open: false)는 목록에서 숨긴다. content/catalog.json 에서 open 을 true 로 바꾸면 나온다
  const groups = catalog.toolGroups.map((g) => ({ ...g, tools: g.tools.filter((t) => t.open) })).filter((g) => g.tools.length > 0);
  // 묶음에 도구가 하나뿐이면 묶음 제목이 어색하므로, 그때는 제목 없이 한 목록으로 보여 준다 (도구가 많은 묶음부터)
  const flat = groups.some((g) => g.tools.length < 2);
  const shown = flat ? [{ name: "", tools: [...groups].sort((x, y) => y.tools.length - x.tools.length).flatMap((g) => g.tools) }] : groups;
  return (
    <>
      {shown.map((g) => (
        <div key={g.name} className="flex flex-col gap-2">
          {g.name && <h3 className="m-0 text-[14px] font-bold text-muted">{g.name}</h3>}
          <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(200px, 100%), 1fr))" }}>
            {g.tools.map((t) => (
              <Link key={t.href} href={t.href} className={`${cardCls} lift hover:border-[#cbb8f0] hover:text-ink hover:no-underline`}>
                <span className="mb-1 grid h-10 w-10 place-items-center rounded-md bg-[#f0eafc] text-[#6d3fc4]"><Icon name={TOOL_ICON[t.href] ?? "tool"} size={20} /></span>
                <span className="text-[16px] font-bold text-ink">{t.name}</span>
                <span className="text-[14px] leading-normal text-muted">{t.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
