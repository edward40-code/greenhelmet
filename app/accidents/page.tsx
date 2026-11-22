import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import { AdSlot } from "@/components/ui";
import Link from "next/link";
import { allAccidents, weekAccidents } from "@/lib/accidents";
import NewsList from "../news/NewsList";

export const metadata: Metadata = {
  title: "사고속보 · 산업현장 추락·끼임·화재·누출 사고 보도 모음",
  description: "건설현장 추락, 공장 끼임, 화재·폭발, 화학물질 누출 등 산업현장 사고 보도를 매일 모으고, 사고 유형별 예방 점검표를 함께 보여 줍니다.",
  alternates: { canonical: "/accidents/" },
};

export default function Page() {
  return (
    <SiteShell
      active="accidents"
      title="사고속보"
      desc="산업현장 사고 보도"
    >
      <Link href="/accidents/week/" className="card flex items-center justify-between gap-3 px-5 py-4 text-ink hover:border-danger hover:no-underline">
        <span className="flex flex-col">
          <b className="text-[17px]">이번 주 사고</b>
          <span className="text-[14px] text-muted">최근 7일 · 보도 {weekAccidents().items.length}건 · 유형별 건수</span>
        </span>
        <span className="text-[15px] font-bold text-danger">보기 →</span>
      </Link>
      <NewsList items={allAccidents()} variant="accidents" />
      <p className="m-0 text-[13px] text-muted">보도된 사실만 정리 · 실명 미게재 · 기사 저작권은 각 언론사</p>
      <AdSlot slot="post_bottom" />
    </SiteShell>
  );
}
