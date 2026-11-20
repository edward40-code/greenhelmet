import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Sapa from "./Sapa";

export const metadata: Metadata = {
  title: "중대재해처벌법 점검 (적용 여부, 경영책임자 의무 17가지 반기 점검)",
  description: "상시 근로자 수와 몇 가지 질문으로 중대재해처벌법 적용 여부와 전담 조직 의무를 확인하고, 시행령 제4조·제5조의 경영책임자 의무 17가지를 이행·미흡으로 점검합니다.",
  alternates: { canonical: "/tools/sapa/" },
};

export default function Page() {
  return (
    <ToolShell title="중대재해처벌법 점검" width={900} desc="적용 여부와 경영책임자 의무 17가지">
      <Sapa />
    </ToolShell>
  );
}
