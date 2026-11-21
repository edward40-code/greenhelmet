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

await mkdir(new URL("../content/feeds/", import.meta.url), { recursive: true });

if (ok === 0) {
  console.warn("[feeds] 고용노동부 피드 모두 실패. 기존 소식을 유지합니다.");
} else {
  const map = new Map(old.map((x) => [x.id, x]));
  for (const x of fresh) map.set(x.id, { ...map.get(x.id), ...x });
  const merged = [...map.values()].sort((a, b) => b.date.localeCompare(a.date)).slice(0, KEEP);
  await writeFile(OUT, JSON.stringify(merged, null, 2) + "\n", "utf8");
  console.log(`[feeds] 고용노동부 ${ok}/${FEEDS.length} 성공, 새로 받은 EHS 글 ${fresh.length}건, 저장 ${merged.length}건`);
}

// ─────────────────────────────────────────────
// 사고속보: 언론 보도 제목·언론사·날짜·링크만 싣는다(자체 요약·추정 없음).
// 구글 뉴스 검색 RSS에서 실제 사고 기사만 골라 content/feeds/accidents.json에 쌓는다.
// ─────────────────────────────────────────────
const ACC_OUT = new URL("../content/feeds/accidents.json", import.meta.url);
const ACC_KEEP = 400;
const ACC_QUERIES = [
  "근로자 숨져", "노동자 숨져", "작업 중 사망", "작업자 추락", "추락사 공사현장",
  "끼임 사고", "깔려 숨져 작업", "질식 사고 작업", "감전 사고 작업",
  "화학물질 누출 사고", "공장 폭발 사고", "공장 화재 부상",
];
const ACC_HIT = /숨져|숨진|사망|숨지|중상|부상|추락|끼임|끼여|깔려|깔린|질식|누출|폭발|매몰|감전|화상/;
const ACC_WORK = /근로자|노동자|작업|현장|공장|공사|직원|인부|하청|협력업체|건설|사업장|크레인|지게차|컨베이어|탱크|플랜트|산단|선박|조선소|창고|물류/;
const ACC_EXCL = /훈련|교육|캠페인|선언|예방|세미나|판결|무죄|유죄|선고|기소|구형|재판|통계|증가|감소|설명회|점검|협약|간담회|토론회|대책|법안|개정|국감|국정감사|칼럼|사설|기고|인터뷰|포토|추모|분석|기획|가운데|절반|년간|연속|공방|갈등|논란|처벌해야|책임|사과하라|재계약|피살|살해|교통사고|음주|송치|법원|인정|막는다|반복되는|예산|촉구|발견|이유|시험대|반년|줄었|늘어|어디에|%|\d+건|\[오늘|잇단|잇따|여전|제자리|불러|이달|올해|조류독감|조류인플루엔자/;
// 해외 사고: 국내 현장 속보만 싣는다
const ACC_FOREIGN = /미국|워싱턴주|캘리포니아|텍사스|뉴욕주|영국|독일|프랑스|호주|캐나다|해외/;
const ACC_SRC_EXCL = /코리안|미주|시애틀|애틀랜타|뉴욕|USA/i;
// 집(주택·자택)에서 난 사고는 일터 사고가 아니므로 뺀다. 주택 공사현장 사고는 남긴다
const ACC_HOME = /주택|자택|가정집|빌라|거주자/;
const ACC_HOME_WORK = /공사|현장|근로자|노동자|작업자|인부|하청/;
// 구글 뉴스가 언론사 이름 대신 주소를 줄 때 이름으로 바꾼다
const SRC_NAME = { "news.sbs.co.kr": "SBS", "news.kbs.co.kr": "KBS", "imnews.imbc.com": "MBC", "www.ytn.co.kr": "YTN", "news.jtbc.co.kr": "JTBC", "www.yna.co.kr": "연합뉴스", "www.chosun.com": "조선일보", "www.donga.com": "동아일보", "www.hani.co.kr": "한겨레", "www.khan.co.kr": "경향신문", "news.mt.co.kr": "머니투데이", "www.mk.co.kr": "매일경제", "www.hankyung.com": "한국경제" };
const srcName = (s) => SRC_NAME[s] ?? SRC_NAME["www." + s] ?? s;

// 같은 사고 판정용: 일반 단어를 뺀 핵심 낱말(지명·회사명·장비명 등)
const ACC_STOP = new Set("근로자 노동자 작업자 작업 작업중 현장 현장서 공사장서 공사현장서 공장서 사망 사망사고 숨져 숨진 숨지 사고 사고로 끼임 추락 추락사 추락해 부상 중상 이송 병원 1명 2명 3명 만에 나흘 이달 또 이번엔 사회 공사 공사장 하청 하청노동자 협력사 청년노동자 발생 치료 대표 노동자들".split(" "));
const keyTokens = (t) =>
  new Set(
    t
      .replace(/[^가-힣A-Za-z0-9~]/g, " ")
      .split(/\s+/)
      .map((w) => w.replace(/(에서|서|의|에|를|을|이|가|은|는|도|로)$/, ""))
      .filter((w) => w.length >= 2 && !ACC_STOP.has(w) && !/^\d+대$/.test(w) && !/^\d+m$/.test(w))
  );
const ACC_TYPES = { fall: /추락|떨어/, caught: /끼임|끼여|끼인|낀|협착/, struck: /깔려|깔린|맞아|부딪/, shock: /감전/, fire: /화재|폭발|불/, leak: /누출|유출|가스/, choke: /질식|중독/, bury: /매몰|붕괴/ };
const typesOf = (t) => new Set(Object.keys(ACC_TYPES).filter((k) => ACC_TYPES[k].test(t)));
const sameIncident = (a, b, ta, tb) => {
  let n = 0;
  for (const x of a) if (b.has(x)) n++;
  if (n >= 2) return true;
  if (n === 0) return false;
  // 핵심 낱말 하나만 겹치면, 사고 유형이 같거나 한쪽이 유형 미상일 때 같은 사고로 본다
  const A = typesOf(ta), B = typesOf(tb);
  if (A.size === 0 || B.size === 0) return true;
  for (const x of A) if (B.has(x)) return true;
  return false;
};
function accField(t) {
  if (/누출|화학|가스/.test(t)) return "chem";
  if (/화재|폭발/.test(t)) return "fire";
  if (/공사|건설|재건축|아파트|비계|고속도로|현장/.test(t)) return "const";
  return "safety";
}
const toDate = (pub) => {
  const d = new Date(pub);
  if (isNaN(+d)) return "";
  return new Date(+d + 9 * 3600 * 1000).toISOString().slice(0, 10); // 한국시간 날짜
};

let accOld = [];
try {
  accOld = JSON.parse(await readFile(ACC_OUT, "utf8"));
} catch {}

let accFresh = [];
let accOk = 0;
for (const q of ACC_QUERIES) {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}+when:${process.env.ACC_DAYS || 2}d&hl=ko&gl=KR&ceid=KR:ko`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (greenhelmet feed reader)" }, signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
      const b = m[1];
      const full = tag(b, "title");
      const source = tag(b, "source");
      const title = source && full.endsWith(" - " + source) ? full.slice(0, -(source.length + 3)).trim() : full.replace(/ - [^-]+$/, "").trim();
      const link = tag(b, "link");
      const date = toDate(tag(b, "pubDate"));
      if (!title || !link || !date) continue;
      if (!ACC_HIT.test(title) || !ACC_WORK.test(title) || ACC_EXCL.test(title) || ACC_FOREIGN.test(title) || ACC_SRC_EXCL.test(source)) continue;
      if (ACC_HOME.test(title) && !ACC_HOME_WORK.test(title)) continue;
      accFresh.push({ id: "acc-" + title.replace(/[^가-힣A-Za-z0-9]/g, "").slice(0, 40), title, url: link, source: srcName(source) || "언론 보도", date, kind: "사고속보", field: accField(title) });
    }
    accOk++;
  } catch (e) {
    console.warn("[feeds] 사고속보 검색 실패:", q, e.message);
  }
}

if (accOk === 0) {
  console.warn("[feeds] 사고속보 검색 모두 실패. 기존 사고속보를 유지합니다.");
} else {
  // 같은 사고를 여러 언론이 쓴 경우 먼저 들어온 기사 하나만 남긴다(사흘 안, 제목 유사도 기준)
  const kept = [...accOld];
  const grams = kept.map((x) => keyTokens(x.title));
  let added = 0;
  for (const x of accFresh.sort((a, b) => a.date.localeCompare(b.date))) {
    if (kept.some((k) => k.id === x.id)) continue;
    const g = keyTokens(x.title);
    const dup = kept.some((k, i) => Math.abs(new Date(k.date) - new Date(x.date)) <= 3 * 86400000 && sameIncident(g, grams[i], x.title, kept[i].title));
    if (dup) continue;
    kept.push(x);
    grams.push(g);
    added++;
  }
  const accMerged = kept.sort((a, b) => b.date.localeCompare(a.date)).slice(0, ACC_KEEP);
  await writeFile(ACC_OUT, JSON.stringify(accMerged, null, 2) + "\n", "utf8");
  console.log(`[feeds] 사고속보 검색 ${accOk}/${ACC_QUERIES.length} 성공, 새 사고 ${added}건, 저장 ${accMerged.length}건`);
}
