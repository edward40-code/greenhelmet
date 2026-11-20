import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Calc from "./Calc";

export const metadata: Metadata = {
  title: "단위환산, 안전계산 (가스 농도 ppm↔mg/m³, 소음 노출량, 재해율)",
  description: "가스·증기 농도 ppm↔mg/m³ 환산, 소음 노출량과 8시간 TWA, 재해율·도수율·강도율을 브라우저에서 바로 계산합니다. 식을 함께 보여 줍니다.",
  alternates: { canonical: "/tools/calc/" },
};

export default function Page() {
  return (
    <ToolShell title="단위환산, 안전계산" desc="가스 농도 환산, 소음 노출량, 재해율">
      <Calc />
    </ToolShell>
  );
}
