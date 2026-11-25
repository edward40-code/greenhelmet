import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Risk from "./Risk";
import { riskCases } from "@/lib/riskCases";

export const metadata: Metadata = {
  title: "위험성평가 작성 도구 (위험성평가표 엑셀 내려받기)",
  description:
    "고소작업, 화기작업, 밀폐공간, 지게차, 기계 정비, 전기작업 등 작업을 고르면 유해·위험요인과 안전보건규칙 근거가 달린 개선대책이 채워집니다. 빈도·강도법 또는 3단계 판단법으로 위험성을 정하고 근로자 참여·결과 공유까지 적어 엑셀로 내려받습니다.",
  alternates: { canonical: "/tools/risk/" },
};

export default function Page() {
  return (
    <ToolShell title="위험성평가 작성" desc="작업 선택 → 위험성 결정 → 개선대책 → 엑셀·인쇄 · 입력값은 이 브라우저 탭 안에만 보관">
      <Risk cases={riskCases()} />
    </ToolShell>
  );
}
