import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import { AdSlot } from "@/components/ui";
import { allAccidents } from "@/lib/accidents";
import NewsList from "../news/NewsList";

export const metadata: Metadata = {
  title: "사고속보 · 산업현장 추락·끼임·화재·누출 사고 보도 모음",
  description: "건설현장 추락, 공장 끼임, 화재·폭발, 화학물질 누출 등 산업현장 사고 보도를 매일 모아 분야별로 보여 줍니다. 제목을 누르면 언론 원문으로 이동합니다.",
  alternates: { canonical: "/accidents/" },
};

export default function Page() {
  return (
    <SiteShell
      active="accidents"
      title="사고속보"
      desc="산업현장에서 일어난 사고를 언론 보도로 모았습니다. 같은 사고는 한 건만 보여 주고, 제목을 누르면 원문 기사로 이동합니다."
    >
      <NewsList items={allAccidents()} variant="accidents" />
      <p className="m-0 text-[14px] leading-relaxed text-muted">
        언론에 보도된 제목·언론사·날짜만 싣고, 보도에 없는 내용(신원, 원인 등)은 덧붙이지 않습니다. 기사 저작권은 각 언론사에 있습니다. 하루 세 번(06:23·12:23·18:23) 새 보도를 받아 옵니다.
      </p>
      <AdSlot slot="post_bottom" />
    </SiteShell>
  );
}
