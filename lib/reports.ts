import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { marked } from "marked";
import { BASE_PATH } from "./site";

export type Report = {
  slug: string;
  title: string;
  series?: string; // 연재명 (예: 감사관의 눈 1)
  date: string;
  field: string;
  summary: string;
  sources: string[];
  reviewed: boolean;
  html: string;
};

const DIR = path.join(process.cwd(), "content", "reports");

/** 맨 위 --- 사이의 "키: 값" 줄을 읽는다. sources는 " | "로 나눈다. */
function parse(file: string): Report {
  const raw = readFileSync(path.join(DIR, file), "utf8").replace(/\r\n/g, "\n");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`${file}: 머리말(---)이 없습니다`);
  const meta: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return {
    slug: file.replace(/\.md$/, ""),
    title: meta.title ?? file,
    series: meta.series || undefined,
    date: meta.date ?? "",
    field: meta.field ?? "common",
    summary: meta.summary ?? "",
    sources: meta.sources ? meta.sources.split(" | ") : [],
    reviewed: meta.reviewed === "true",
    html: (marked.parse(m[2], { async: false }) as string)
      // 사이트 안 링크(/tools/...)에 배포 하위 경로를 붙이고, 바깥 링크는 새 창으로
      .replace(/href="\/(?!\/)/g, `href="${BASE_PATH}/`)
      .replace(/<a href="(https?:\/\/)/g, '<a target="_blank" rel="noopener" href="$1'),
  };
}

export function allReports(): Report[] {
  let files: string[] = [];
  try {
    files = readdirSync(DIR).filter((f) => f.endsWith(".md") && !f.startsWith("_"));
  } catch {}
  return files.map(parse).sort((a, b) => b.date.localeCompare(a.date));
}

export const getReport = (slug: string) => allReports().find((r) => r.slug === slug);
