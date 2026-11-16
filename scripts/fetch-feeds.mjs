// 고용노동부 RSS를 받아 EHS 관련 글만 content/feeds/moel.json에 쌓는다.
// 실패하면 기존 파일을 그대로 두고 정상 종료한다(사이트 빌드는 계속된다).
// 실행: node scripts/fetch-feeds.mjs

import { readFile, writeFile, mkdir } from "node:fs/promises";

const OUT = new URL("../content/feeds/moel.json", import.meta.url);
const KEEP = 300;

const FEEDS = [
  { url: "https://www.moel.go.kr/rss/policy.do", kind: "정책자료" },
  { url: "https://www.moel.go.kr/rss/lawinfo.do", kind: "입법·행정예고" },
  { url: "https://www.moel.go.kr/rss/notice.do", kind: "공지" },
];

const INCLUDE = /안전|보건|산업재해|산재|중대재해|재해|위험성평가|화학|유해|질환|근골격|밀폐|추락|질식|폭발|화재|건설현장|작업환경|건강진단|석면|한랭|폭염|온열|소음|분진|직업병|보호구|공정안전|PSM|크레인|지게차|끼임|감정노동|휴게시설/;
const EXCLUDE = /채용|입찰|공무원|모집|합격자|인사발령|계약/;

function classify(title) {
  const t = title.replace(/산업안전보건/g, "산업안전"); // 법령 이름의 '보건'은 분야 판단에서 뺀다
  if (/건설|타워크레인|비계|굴착/.test(t)) return "const";
  if (/화학|유해물질|PSM|공정안전|MSDS|누출/.test(t)) return "chem";
  if (/화재|폭발|위험물|소방/.test(t)) return "fire";
  if (/질환|건강|보건|석면|소음|분진|한랭|폭염|온열|근골격|직업병|감정노동|휴게/.test(t)) return "health";
  if (/환경|대기|수질|폐기물|토양/.test(t)) return "env";
  return "safety";
}

const text = (s) =>
  (s || "")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
const tag = (block, name) => {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return m ? text(m[1]) : "";
};

async function fetchFeed({ url, kind }) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (greenhelmet feed reader)" }, signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  const xml = await res.text();
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);
  return items
    .map((b) => {
      const title = tag(b, "title");
      const link = tag(b, "link");
      const date = (tag(b, "dc:date") || tag(b, "pubDate")).slice(0, 10);
      const seq = (link.match(/bbs_seq=(\d+)/) || [])[1];
      return { id: `moel-${seq || link}`, title, url: link, source: "고용노동부", date, kind, field: classify(title) };
    })
    .filter((x) => x.title.length > 6 && x.url && /^\d{4}-\d{2}-\d{2}$/.test(x.date) && INCLUDE.test(x.title) && !EXCLUDE.test(x.title));
}

let old = [];
try {
  old = JSON.parse(await readFile(OUT, "utf8"));
} catch {}

let fresh = [];
let ok = 0;
for (const f of FEEDS) {
  try {
    fresh.push(...(await fetchFeed(f)));
    ok++;
  } catch (e) {
    console.warn("[feeds] 실패:", e.message);
  }
}

if (ok === 0) {
  console.warn("[feeds] 모든 피드 실패. 기존 소식을 유지합니다.");
  process.exit(0);
}

const map = new Map(old.map((x) => [x.id, x]));
for (const x of fresh) map.set(x.id, { ...map.get(x.id), ...x });
const merged = [...map.values()].sort((a, b) => b.date.localeCompare(a.date)).slice(0, KEEP);

await mkdir(new URL("../content/feeds/", import.meta.url), { recursive: true });
await writeFile(OUT, JSON.stringify(merged, null, 2) + "\n", "utf8");
console.log(`[feeds] 피드 ${ok}/${FEEDS.length} 성공, 새로 받은 EHS 글 ${fresh.length}건, 저장 ${merged.length}건`);
