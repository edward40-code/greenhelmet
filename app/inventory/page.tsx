import type { Metadata } from "next";
import Link from "next/link";
import ToolShell from "@/components/ToolShell";
import { FieldChip } from "@/components/visual";
import { Icon } from "@/components/icons";
import { allInventories, allRules, totalOf } from "@/lib/inventory";
import { fmtDate } from "@/lib/fields";
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
    [String(rules.length), "고용노동부 고시·예규·훈령", "국가법령정보센터 › 행정규칙", `산업안전보건 관련. 이름에 '지침'이 든 고시는 ${guides}개`],
    ["1,039", "기술지원규정 (옛 KOSHA GUIDE)", "안전보건공단 산업안전포털", "현행 기준. 법적 구속력은 없고, 2025~2026년에 이름과 번호가 바뀌는 중"],
    ["약 9,300", "교육·홍보 자료", "안전보건공단 자료실", "OPS 3,766 · 책자 1,175 · 동영상 813 · 교안 561 등"],
    ["1,625", "해석 사례 (질의회시)", "국가법령정보센터 › 중앙부처 1차 해석", "'산업안전보건법'으로 검색되는 건수"],
  ];

  return (
    <ToolShell width={980} title="지침 인벤토리" desc="산업안전보건 지침이 어디에 몇 건 있는지 세어 두고, 주제별로 빠짐없이 모았습니다. 원본은 옮기지 않고 위치만 안내합니다.">
      <section className="card flex flex-col gap-3 p-5">
        <h2 className="m-0 text-[18px] font-extrabold">지침은 네 군데에 흩어져 있습니다</h2>
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
        <p className="m-0 text-[15px] leading-relaxed">조문을 찾는 것은 어렵지 않습니다. 어려운 것은 조문 하나에 딸린 지침과 자료가 여러 곳에 흩어져 있고, 어느 것이 지켜야 하는 기준이고 어느 것이 참고 자료인지 가려내는 일입니다.</p>
        <p className="m-0 text-[13px] text-muted">건수는 2026년 11월 20일 각 사이트의 검색 화면에서 확인했습니다.</p>
      </section>

      <section className="card flex flex-col gap-3 p-5">
        <h2 className="m-0 text-[18px] font-extrabold">주제별 인벤토리</h2>
        <p className="m-0 text-[15px] leading-relaxed">주제 하나를 고르면 법 조문부터 해석 사례까지 한 목록으로 나옵니다.</p>
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))" }}>
          {invs.map((m) => (
            <Link key={m.slug} href={`/inventory/${m.slug}/`} className="lift flex flex-col gap-2 rounded-xl border border-line-soft bg-white p-4 text-ink hover:border-accent hover:text-ink hover:no-underline">
              <span><FieldChip field={m.field} /></span>
              <span className="text-[19px] font-extrabold">{m.title} <span className="text-accent">{totalOf(m)}건</span></span>
              <span className="text-[14px] leading-relaxed text-muted">{m.groups.map((g) => `${g.short} ${g.items.length}`).join(" · ")}</span>
              <span className="mt-auto inline-flex items-center gap-1 pt-1 text-[14px] font-bold text-accent">목록 보기 <Icon name="arrow" size={15} /></span>
              <span className="text-[13px] text-muted">{fmtDate(m.checked)} 확인</span>
            </Link>
          ))}
        </div>
        <p className="m-0 text-[14px] leading-relaxed text-muted">주제는 차례로 늘립니다.</p>
      </section>

      <section id="rules" className="card flex scroll-mt-20 flex-col gap-3 p-5">
        <h2 className="m-0 text-[18px] font-extrabold">고용노동부 산업안전보건 고시·예규·훈령 전체 ({rules.length}건)</h2>
        <p className="m-0 text-[15px] leading-relaxed">
          법적 효력이 있는 '지침'은 여기 있습니다. 2025년 이후 바뀐 것이 <strong>{recent}건</strong>, 2020년 1월 일괄 개정 뒤 그대로인 것이 <strong>{stale}건</strong>입니다. 이름을 누르면 국가법령정보센터 원문이 열립니다.
        </p>
        <RulesTable rules={rules} recentFrom={RECENT_FROM} />
        <p className="m-0 text-[13px] leading-relaxed text-muted">
          국가법령정보센터의 고용노동부 소관 행정규칙 442건에서 산업안전보건 관련을 제목으로 골랐습니다(2026년 11월 20일). 날짜는 발령일입니다. 산재보험·고용보험 관련, 부처 내부 운영 규정은 뺐습니다. 다른 부처와 함께 낸 고시는 그 부처 이름을 같이 적었습니다.
        </p>
      </section>
    </ToolShell>
  );
}
