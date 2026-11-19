import type { Metadata } from "next";
import Link from "next/link";
import ToolShell from "@/components/ToolShell";
import { FieldChip } from "@/components/visual";
import { Icon } from "@/components/icons";
import { allInventories, allRules, totalOf } from "@/lib/inventory";
import RulesTable from "./RulesTable";

export const metadata: Metadata = {
  title: "지침 인벤토리 · 산업안전보건 고시·지침·기술지원규정(KOSHA GUIDE) 목록",
  description: "고용노동부 산업안전보건 고시·예규·훈령 전체 목록과, 주제별로 법 조문·고시·안전보건공단 기술지원규정(옛 KOSHA GUIDE)·교육 자료·해석 사례를 빠짐없이 모은 인벤토리입니다. 원본은 옮기지 않고 위치만 안내합니다.",
  alternates: { canonical: "/inventory/" },
};

const RECENT_FROM = "2025-01-01";

export default function Page() {
  const invs = allInventories();
  const rules = allRules();
  const guides = rules.filter((r) => r.cat === "작업·기술 지침").length;
  const recent = rules.filter((r) => r.date >= RECENT_FROM).length;
  const stale = rules.filter((r) => r.date.startsWith("2020-01")).length;
  const SCALE: [string, string, string, string][] = [
    [String(rules.length), "고용노동부 고시·예규·훈령", "국가법령정보센터 › 행정규칙", `'지침' 고시 ${guides}`],
    ["1,039", "기술지원규정 (옛 KOSHA GUIDE)", "안전보건공단 산업안전포털", "현행 · 법적 구속력 없음"],
    ["약 9,300", "교육·홍보 자료", "안전보건공단 자료실", "OPS 3,766 · 책자 1,175 · 동영상 813 · 교안 561"],
    ["1,625", "해석 사례 (질의회시)", "국가법령정보센터 › 중앙부처 1차 해석", "'산업안전보건법' 검색"],
  ];

  return (
    <ToolShell width={980} title="지침 인벤토리" desc="산업안전보건 고시·지침·기술지원규정·자료 목록">
      <section className="card flex flex-col gap-3 p-5">
        <h2 className="m-0 text-[18px] font-extrabold">어디에 몇 건</h2>
        <div className="grid gap-2.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(210px, 100%), 1fr))" }}>
          {SCALE.map(([n, what, where, note]) => (
            <div key={what} className="flex flex-col gap-1 rounded-xl bg-bg p-4">
              <span className="text-[26px] leading-tight font-extrabold text-accent">{n}<span className="text-[15px]">건</span></span>
              <span className="text-[15px] leading-snug font-bold">{what}</span>
              <span className="text-[13px] text-muted">{where}</span>
              <span className="text-[13px] leading-relaxed text-muted">{note}</span>
            </div>
          ))}
        </div>
        <p className="m-0 text-[13px] text-muted">2026.11.20 기준</p>
      </section>

      <section className="card flex flex-col gap-3 p-5">
        <h2 className="m-0 text-[18px] font-extrabold">주제별</h2>
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))" }}>
          {invs.map((m) => (
            <Link key={m.slug} href={`/inventory/${m.slug}/`} className="lift flex flex-col gap-2 rounded-xl border border-line-soft bg-white p-4 text-ink hover:border-accent hover:text-ink hover:no-underline">
              <span><FieldChip field={m.field} /></span>
              <span className="text-[19px] font-extrabold">{m.title} <span className="text-accent">{totalOf(m)}건</span></span>
              <span className="text-[14px] leading-relaxed text-muted">{m.groups.map((g) => `${g.short} ${g.items.length}`).join(" · ")}</span>
              <span className="mt-auto inline-flex items-center gap-1 pt-1 text-[14px] font-bold text-accent">목록 보기 <Icon name="arrow" size={15} /></span>
            </Link>
          ))}
        </div>
      </section>

      <section id="rules" className="card flex scroll-mt-20 flex-col gap-3 p-5">
        <h2 className="m-0 text-[18px] font-extrabold">고용노동부 산업안전보건 고시·예규·훈령 전체 ({rules.length}건)</h2>
        <p className="m-0 text-[14px] text-muted">2025년 이후 개정 <b className="text-ink">{recent}</b> · 2020년 1월 이후 그대로 <b className="text-ink">{stale}</b></p>
        <RulesTable rules={rules} recentFrom={RECENT_FROM} />
        <p className="m-0 text-[13px] text-muted">국가법령정보센터 고용노동부 행정규칙 442건 중 산업안전보건 관련 · 날짜는 발령일 · 2026.11.20 기준</p>
      </section>
    </ToolShell>
  );
}
