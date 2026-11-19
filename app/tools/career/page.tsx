import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Career from "./Career";

export const metadata: Metadata = {
  title: "경력 계산기 (입사·퇴사일로 총 경력 연·월·일 합산)",
  description: "근무처별 입사일과 퇴사일을 넣으면 총 경력을 연·월·일로 합산하고 겹치는 기간을 알려 줍니다. 자격증 응시자격, 선임 자격 증빙 전에 확인하세요.",
  alternates: { canonical: "/tools/career/" },
};

export default function Page() {
  return (
    <ToolShell title="경력 계산" width={1000} desc="근무 기간을 연·월·일로 합산">
      <Career />
    </ToolShell>
  );
}
