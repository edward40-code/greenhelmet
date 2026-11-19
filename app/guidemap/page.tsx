import type { Metadata } from "next";
import Link from "next/link";
import ToolShell from "@/components/ToolShell";
import { FieldChip } from "@/components/visual";
import { Icon } from "@/components/icons";
import { allMaps } from "@/lib/guidemaps";
import { fmtDate } from "@/lib/fields";

export const metadata: Metadata = {
  title: "지침 지도 · 법 조문·고시·기술지원규정(KOSHA GUIDE)이 어디에 있는지 한 장으로",
  description: "안전보건 주제 하나에 딸린 법 조문, 고용노동부 고시, 안전보건공단 기술지원규정(옛 KOSHA GUIDE), 교육 자료, 해석 사례가 어디에 있는지 한 장에 모았습니다. 원본은 옮기지 않고 위치만 안내합니다.",
  alternates: { canonical: "/guidemap/" },
};

const PLACES: [string, string, string][] = [
  ["법 조문과 고시", "국가법령정보센터", "지키지 않으면 법 위반인 기준. 고용노동부 고시·훈령도 여기 '행정규칙'에 있습니다."],
  ["기술지원규정", "안전보건공단 산업안전포털", "옛 KOSHA GUIDE. 현행 1,039건. 법적 구속력은 없지만 '어떻게' 할지를 알려 줍니다."],
  ["교육·홍보 자료", "안전보건공단 자료실", "OPS, 책자, 교안, 동영상 등 약 9,300건. 주제 하나에 수백 건이 나옵니다."],
  ["해석 사례", "국가법령정보센터 › 중앙부처 1차 해석", "고용노동부가 질의에 답한 사례. 산업안전보건법 관련 1,625건."],
];

export default function Page() {
  const maps = allMaps();
  return (
    <ToolShell width={980} title="지침 지도" desc="주제 하나에 딸린 법 조문·고시·기술지원규정·자료가 어디에 있는지 한 장으로 보여 줍니다. 원본은 옮기지 않고 위치만 안내합니다.">
      <section className="card flex flex-col gap-3 p-5">
        <h2 className="m-0 text-[18px] font-extrabold">주제 고르기</h2>
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))" }}>
          {maps.map((m) => (
            <Link key={m.slug} href={`/guidemap/${m.slug}/`} className="lift flex flex-col gap-2 rounded-xl border border-line-soft bg-white p-4 text-ink hover:border-accent hover:text-ink hover:no-underline">
              <span><FieldChip field={m.field} /></span>
              <span className="text-[19px] font-extrabold">{m.title}</span>
              <span className="text-[14px] leading-relaxed text-muted">법 조문 {m.steps[0].items.length} · 기술지원규정 {m.steps.find((s) => s.key === "kosha")?.items.length ?? 0} · 자료 {m.steps.find((s) => s.key === "material")?.items.length ?? 0} · 해석 사례 {m.steps.find((s) => s.key === "interp")?.items.length ?? 0}</span>
              <span className="mt-auto inline-flex items-center gap-1 pt-1 text-[14px] font-bold text-accent">지도 보기 <Icon name="arrow" size={15} /></span>
              <span className="text-[13px] text-muted">{fmtDate(m.checked)} 확인</span>
            </Link>
          ))}
        </div>
        <p className="m-0 text-[14px] leading-relaxed text-muted">주제는 차례로 늘립니다.</p>
      </section>

      <section className="card flex flex-col gap-3 p-5">
        <h2 className="m-0 text-[18px] font-extrabold">지침은 네 군데에 흩어져 있습니다</h2>
        <p className="m-0 text-[15px] leading-relaxed">조문을 찾는 것은 어렵지 않습니다. 어려운 것은 조문 하나에 딸린 지침과 자료가 여러 곳에 흩어져 있고, 어느 것이 지켜야 하는 기준이고 어느 것이 참고 자료인지 구분하는 일입니다.</p>
        <ol className="m-0 flex list-none flex-col gap-2 p-0">
          {PLACES.map(([what, where, desc], i) => (
            <li key={what} className="flex items-start gap-3 rounded-lg bg-bg px-4 py-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent text-[14px] font-bold text-white">{i + 1}</span>
              <span className="flex flex-col gap-0.5">
                <span className="text-[16px] font-bold">{what} <span className="text-[14px] font-normal text-muted">· {where}</span></span>
                <span className="text-[15px] leading-relaxed">{desc}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="m-0 text-[14px] leading-relaxed text-muted">건수는 2026년 11월 20일 각 사이트의 검색 화면에서 확인한 숫자입니다.</p>
      </section>
    </ToolShell>
  );
}
