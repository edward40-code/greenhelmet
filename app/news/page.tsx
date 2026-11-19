import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import { AdSlot } from "@/components/ui";
import { allNews } from "@/lib/news";
import NewsList from "./NewsList";

export const metadata: Metadata = {
  title: "EHS 소식 · 산업안전·보건·환경 입법예고와 정책자료",
  description: "산업안전보건법 입법예고, 고용노동부 정책자료, 환경·화학물질·소방 분야 소식을 분야별로 모아 봅니다. 매일 아침 새 소식을 받아 옵니다.",
  alternates: { canonical: "/news/" },
};

export default function Page() {
  return (
    <SiteShell
      active="news"
      title="소식"
      desc="산업안전·보건·환경 분야 정책자료와 입법·행정예고를 분야별로 모았습니다. 제목을 누르면 요약과 관련 서식을 보고 원문으로 갈 수 있습니다."
    >
      <NewsList items={allNews()} />
      <p className="m-0 text-[14px] leading-relaxed text-muted">
        고용노동부 정책자료·입법·행정예고·공지는 매일 아침 자동으로 받아 오고, 그 밖의 소식은 운영자가 직접 골라 올립니다. 소식의 저작권은 각 출처에 있습니다.
      </p>
      <AdSlot slot="post_bottom" />
    </SiteShell>
  );
}
