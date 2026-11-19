import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import { AdSlot } from "@/components/ui";
import { allLibrary } from "@/lib/library";
import LibraryList from "./LibraryList";

export const metadata: Metadata = {
  title: "안전보건환경 자료실 · 법정 점검표, 환경 양식, 교육자료(PPT) 무료",
  description: "지게차·크레인·소화기 등 법령 원문 기반 점검표, TBM 일지·위험성평가표, 폐기물 관리·환경 인허가 관리 같은 환경 양식, 밀폐공간·끼임·폐기물 교육용 파워포인트를 무료로 내려받고, 고용노동부·안전보건공단 공공자료 위치를 한곳에서 찾습니다.",
  alternates: { canonical: "/library/" },
};

export default function Page() {
  return (
    <SiteShell active="library" title="자료실" desc="현장에서 바로 쓰는 점검표·양식·교육자료는 무료로 내려받고, 공공기관 자료는 어디에 있는지 정리해 두었습니다. 회원가입이 필요 없습니다.">
      <LibraryList items={allLibrary()} />
      <AdSlot slot="edu_inline" />
      <p className="m-0 text-[14px] leading-relaxed text-muted">
        그린헬멧기사가 만든 서식과 교육자료는 자유롭게 고쳐 쓸 수 있습니다. 공공기관 자료는 파일을 다시 올리지 않고 원본 위치로 연결합니다. 법령 기준은 현행 법령 원문으로 확인하세요.
      </p>
    </SiteShell>
  );
}
