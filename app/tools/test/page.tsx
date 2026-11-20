import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AdSlot } from "@/components/ui";
import SafetyTest from "./SafetyTest";

export const metadata: Metadata = {
  title: "안전 성향 테스트 · 나는 어떤 그린헬멧기사일까",
  description: "여섯 문항에 답하면 법대로 하는 사람, 현장부터 가는 사람, 숫자부터 보는 사람, 사람부터 챙기는 사람 중 나의 안전 성향 유형을 알려 줍니다. 1분이면 끝납니다.",
  alternates: { canonical: "/tools/test/" },
};

export default function Page() {
  return (
    <>
      <Header active="tools" />
      <div className="mx-auto flex max-w-[760px] flex-col gap-5 px-4 pt-8 pb-12 sm:px-5">
        <SafetyTest />
        <p className="m-0 text-center text-[14px] text-muted">재미로 보는 테스트</p>
        <AdSlot slot="tool_bottom" />
      </div>
      <Footer />
    </>
  );
}
