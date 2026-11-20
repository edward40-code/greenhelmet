import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import { AdSlot } from "@/components/ui";
import { allLibrary } from "@/lib/library";
import { downloadsText, viewsText } from "@/lib/views";
import LibraryList from "./LibraryList";

export const metadata: Metadata = {
  title: "안전보건환경 자료실 · 법정 점검표, 환경 양식, 교육자료(PPT) 무료",
  description: "지게차·크레인·소화기 등 법령 원문 기반 점검표, TBM 일지·위험성평가표, 폐기물 관리·환경 인허가 관리 같은 환경 양식, 밀폐공간·끼임·폐기물 교육용 파워포인트를 무료로 내려받고, 고용노동부·안전보건공단 공공자료 위치를 한곳에서 찾습니다.",
  alternates: { canonical: "/library/" },
};

export default function Page() {
  return (
    <SiteShell active="library" title="자료실" desc="점검표 · 양식 · 교육자료 · 공공자료">
      <LibraryList
        items={allLibrary()}
        stats={Object.fromEntries(
          allLibrary().map((x) => [x.id, [viewsText(`/library/${x.id}/`), x.type === "file" ? downloadsText(x.id) : null].filter(Boolean).join(" · ")])
        )}
      />
      <AdSlot slot="edu_inline" />
    </SiteShell>
  );
}
