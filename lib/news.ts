import moel from "@/content/feeds/moel.json";
import curated from "@/content/news.json";

export type NewsItem = {
  id: string;
  title: string;
  url: string;
  source: string;
  date: string; // YYYY-MM-DD
  kind: string;
  field: string;
  summary?: string;
};

/** 자동 수집 + 운영자 등록 소식을 날짜 내림차순으로 */
export function allNews(): NewsItem[] {
  const map = new Map<string, NewsItem>();
  for (const x of [...(moel as NewsItem[]), ...(curated as NewsItem[])]) map.set(x.id, x);
  return [...map.values()].sort((a, b) => b.date.localeCompare(a.date));
}
