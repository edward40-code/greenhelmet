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

/** 한글이 섞인 id를 주소에 쓰기 좋은 짧은 영문 슬러그로 (FNV-1a 32bit, 36진수) */
export function slugOf(id: string): string {
  if (/^[A-Za-z0-9_-]+$/.test(id)) return id;
  let h = 0x811c9dc5;
  for (const ch of id) {
    h ^= ch.codePointAt(0)!;
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return (id.startsWith("acc-") ? "a" : "n") + h.toString(36);
}

export const getNews = (slug: string) => allNews().find((x) => slugOf(x.id) === slug);
