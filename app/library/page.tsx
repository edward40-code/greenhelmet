import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import { AdSlot } from "@/components/ui";
import { allLibrary } from "@/lib/library";
import LibraryList from "./LibraryList";

export const metadata: Metadata = {
  title: "안전보건 자료실 · TBM 일지·위험성평가표·점검표 무료 양식",
  description: "TBM 일지, 안전보건교육 기록, 일일 안전점검표, 위험성평가표 엑셀 양식을 무료로 내려받고, 고용노동부·안전보건공단 공공자료 위치를 한곳에서 찾습니다.",
  alternates: { canonical: "/library/" },
};

export default function Page() {
  return (
    <SiteShell active="library" title="자료실" desc="현장에서 바로 쓰는 서식은 무료로 내려받고, 공공기관 자료는 어디에 있는지 정리해 두었습니다. 회원가입이 필요 없습니다.">
      <LibraryList items={allLibrary()} />
      <AdSlot slot="edu_inline" />
      <p className="m-0 text-[13px] leading-relaxed text-muted">
        그린헬멧기사가 만든 서식은 자유롭게 고쳐 쓸 수 있습니다. 공공기관 자료는 파일을 다시 올리지 않고 원본 위치로 연결합니다. 법령 기준은 현행 법령 원문으로 확인하세요.
      </p>
    </SiteShell>
  );
}
