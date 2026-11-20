import data from "@/content/views.json";

/** 빌드 때 scripts/fetch-views.mjs 가 GA4에서 받아 둔 조회수·내려받기 수. 수집 전(updated=null)에는 표시하지 않는다 */
type Views = { updated: string | null; pages: Record<string, number>; downloads: Record<string, number> };
const v = data as Views;

const fmt = (n: number) => n.toLocaleString("ko-KR");

/** 페이지 조회수 문구. path는 "/library/x/" 꼴 */
export const viewsText = (path: string) => (v.updated ? `조회 ${fmt(v.pages[path] ?? 0)}` : null);

/** 자료 파일 내려받기 문구 */
export const downloadsText = (id: string) => (v.updated ? `내려받기 ${fmt(v.downloads[id] ?? 0)}` : null);
