import data from "@/content/library.json";

export type LibItem = {
  id: string;
  title: string;
  category: string; // 서식·양식, 교육자료, 공공자료 …
  field: string;
  format: string; // XLSX, PDF, PPTX, HWP, 링크 …
  type: "file" | "link";
  file?: string; // public/library/ 아래 파일 이름
  url?: string;
  source: string;
  updated: string;
  desc: string;
  howto?: string[];
  report?: string; // 관련 이슈리포트 slug
};

export const allLibrary = () =>
  (data as LibItem[]).slice().sort((a, b) => (a.type === b.type ? b.updated.localeCompare(a.updated) : a.type === "file" ? -1 : 1));

export const getLib = (id: string) => (data as LibItem[]).find((x) => x.id === id);
