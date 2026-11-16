import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Tbm from "./Tbm";

export const metadata: Metadata = {
  title: "TBM 생성기 (작업 전 안전회의 회의록 양식)",
  description: "고소작업, 화기작업, 밀폐공간, 중량물, 전기작업, 유해물질 취급 중 작업 종류를 고르면 위험요인·안전대책·점검표가 들어간 TBM 회의록을 만들고 A4로 인쇄합니다.",
  alternates: { canonical: "/tools/tbm/" },
};

export default function Page() {
  return (
    <ToolShell title="TBM 생성기" desc="작업 종류를 고르면 작업 전 안전회의 자료가 바로 만들어집니다. 인쇄해서 서명을 받으면 됩니다.">
      <Tbm />
    </ToolShell>
  );
}
