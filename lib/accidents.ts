import data from "@/content/feeds/accidents.json";
import type { NewsItem } from "./news";

/** 언론에 보도된 산업현장 사고. 제목·언론사·날짜·원문 링크만 담는다. */
export const allAccidents = (): NewsItem[] => (data as NewsItem[]).slice().sort((a, b) => b.date.localeCompare(a.date));
