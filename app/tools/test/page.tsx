import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AdSlot } from "@/components/ui";
import SafetyTest from "./SafetyTest";

export const metadata: Metadata = {
  title: "안전 성향 테스트 · 나는 어떤 그린헬멧기사일까",
  description: "여섯 문항에 답하면 원칙파 감독관, 현장파 해결사, 데이터파 분석가, 소통파 교육자 중 나의 안전 성향 유형을 알려 줍니다. 1분이면 끝납니다.",
  alternates: { canonical: "/tools/test/" },
};

export default function Page() {
  return (
    <>
      <Header active="tools" />
      <div className="mx-auto flex max-w-[760px] flex-col gap-5 px-4 pt-8 pb-12 sm:px-5">
        <SafetyTest />
        <p className="m-0 text-center text-[13px] text-muted">재미로 보는 테스트입니다. 심리검사가 아닙니다.</p>
        <AdSlot slot="tool_bottom" />
      </div>
      <Footer />
    </>
  );
}
