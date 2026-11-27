import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { OPEN_TABS, certSlugs } from "@/lib/certs";
import { TYPES } from "@/lib/safetyTest";
import { allReports } from "@/lib/reports";
import { allLibrary } from "@/lib/library";
import { allInventories } from "@/lib/inventory";

export const dynamic = "force-static";

/** lastmod는 실제로 바뀐 날만 적는다. 매 빌드 시각을 모든 주소에 넣으면 구글이 이 값을 믿지 않게 된다. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const day = (d?: string) => (d && /^\d{4}-\d{2}-\d{2}/.test(d) ? new Date(`${d.slice(0, 10)}T00:00:00+09:00`) : undefined);
  // 매일 새 보도가 쌓이는 목록 페이지
  const daily = ["/", "/news/", "/accidents/", "/accidents/week/"];
  const dated: [string, Date | undefined][] = [
    ...daily.map((p): [string, Date] => [p, now]),
    ["/reports/", day(allReports()[0]?.date)],
    ...allReports().map((r): [string, Date | undefined] => [`/reports/${r.slug}/`, day(r.date)]),
    ["/library/", day(allLibrary().map((x) => x.updated).sort().pop())],
    ...allLibrary().map((x): [string, Date | undefined] => [`/library/${x.id}/`, day(x.updated)]),
    ["/inventory/", day(allInventories().map((m) => m.checked).sort().pop())],
    ...allInventories().map((m): [string, Date | undefined] => [`/inventory/${m.slug}/`, day(m.checked)]),
  ];
  const plain = [
    ...certSlugs().flatMap((s) => [`/cert/${s}/`, ...OPEN_TABS.map((t) => `/cert/${s}/${t}/`)]),
    "/market/",
    "/tools/",
    "/tools/sapa/",
    "/tools/calc/",
    "/tools/career/",
    "/tools/tbm/",
    "/tools/risk/",
    "/tools/test/",
    ...Object.values(TYPES).map((t) => `/tools/test/result/${t.slug}/`),
    "/about/",
    "/terms/",
    "/privacy/",
  ];
  return [
    ...dated.map(([p, d]) => ({ url: `${SITE_URL}${p}`, ...(d ? { lastModified: d } : {}) })),
    ...plain.map((p) => ({ url: `${SITE_URL}${p}` })),
  ];
}
