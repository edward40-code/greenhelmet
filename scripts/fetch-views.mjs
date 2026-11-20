// GA4에서 페이지별 조회수와 자료 파일별 내려받기 수를 받아 content/views.json 에 적는다.
// 필요한 것: 저장소 Secret GA_SA_KEY (서비스 계정 JSON 키), content/site.json analytics.gaProperty (숫자 속성 ID)
// 둘 중 하나라도 없거나 실패하면 기존 views.json 을 그대로 두고 빌드를 계속한다.
import { readFileSync, writeFileSync } from "node:fs";
import { createSign } from "node:crypto";
import path from "node:path";

const OUT = "content/views.json";
const site = JSON.parse(readFileSync("content/site.json", "utf8"));
const lib = JSON.parse(readFileSync("content/library.json", "utf8"));
const key = process.env.GA_SA_KEY;
const prop = site.analytics?.gaProperty;
const since = site.analytics?.since ?? "2026-11-20";

if (!key || !prop) {
  console.log("조회수: GA 설정이 없어 건너뜀");
  process.exit(0);
}

const b64 = (o) => Buffer.from(typeof o === "string" ? o : JSON.stringify(o)).toString("base64url");

async function token(sa) {
  const now = Math.floor(Date.now() / 1000);
  const head = b64({ alg: "RS256", typ: "JWT" });
  const claim = b64({
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/analytics.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  });
  const sig = createSign("RSA-SHA256").update(`${head}.${claim}`).sign(sa.private_key).toString("base64url");
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${head}.${claim}.${sig}` }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(`토큰 발급 실패: ${j.error_description ?? j.error ?? r.status}`);
  return j.access_token;
}

async function report(tok, body) {
  const r = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${prop}:runReport`, {
    method: "POST",
    headers: { authorization: `Bearer ${tok}`, "content-type": "application/json" },
    body: JSON.stringify({ dateRanges: [{ startDate: since, endDate: "today" }], limit: 100000, ...body }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(`보고서 실패: ${j.error?.message ?? r.status}`);
  return j.rows ?? [];
}

/** "/library/x?utm=1" → "/library/x/" (파일 주소는 그대로) */
function normPath(p) {
  let s = p.split(/[?#]/)[0] || "/";
  try {
    s = decodeURI(s);
  } catch {}
  if (!s.startsWith("/")) s = "/" + s;
  if (!s.endsWith("/") && !path.extname(s)) s += "/";
  return s;
}

try {
  const tok = await token(JSON.parse(key));

  const pages = {};
  for (const row of await report(tok, { dimensions: [{ name: "pagePath" }], metrics: [{ name: "screenPageViews" }] })) {
    const p = normPath(row.dimensionValues[0].value);
    pages[p] = (pages[p] ?? 0) + Number(row.metricValues[0].value);
  }

  // 파일 이름 → 자료 id
  const byFile = Object.fromEntries(lib.filter((x) => x.file).map((x) => [x.file, x.id]));
  const downloads = {};
  const rows = await report(tok, {
    dimensions: [{ name: "linkUrl" }],
    metrics: [{ name: "eventCount" }],
    dimensionFilter: { filter: { fieldName: "eventName", stringFilter: { value: "file_download" } } },
  });
  for (const row of rows) {
    let name = "";
    try {
      name = decodeURIComponent(new URL(row.dimensionValues[0].value, "https://x").pathname.split("/").pop());
    } catch {}
    const id = byFile[name];
    if (id) downloads[id] = (downloads[id] ?? 0) + Number(row.metricValues[0].value);
  }

  const old = JSON.parse(readFileSync(OUT, "utf8"));
  const same = old.updated && JSON.stringify(old.pages) === JSON.stringify(pages) && JSON.stringify(old.downloads) === JSON.stringify(downloads);
  if (same) {
    console.log("조회수: 바뀐 것 없음");
  } else {
    writeFileSync(OUT, JSON.stringify({ updated: new Date().toISOString(), pages, downloads }, null, 2) + "\n");
    console.log(`조회수: 페이지 ${Object.keys(pages).length}개, 내려받기 자료 ${Object.keys(downloads).length}개`);
  }
} catch (e) {
  console.log("조회수 수집 실패, 기존 값 유지:", e.message);
}
