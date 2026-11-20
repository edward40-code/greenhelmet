import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { OPEN_TABS, certSlugs } from "@/lib/certs";
import { TYPES } from "@/lib/safetyTest";
import { allReports } from "@/lib/reports";
import { allLibrary } from "@/lib/library";
import { allInventories } from "@/lib/inventory";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/news/",
    "/accidents/",
    "/reports/",
    ...allReports().map((r) => `/reports/${r.slug}/`),
    "/library/",
    ...allLibrary().map((x) => `/library/${x.id}/`),
    ...certSlugs().flatMap((s) => [`/cert/${s}/`, ...OPEN_TABS.map((t) => `/cert/${s}/${t}/`)]),
    "/tools/",
    "/inventory/",
    ...allInventories().map((m) => `/inventory/${m.slug}/`),
    "/tools/sapa/",
    "/tools/calc/",
    "/tools/career/",
    "/tools/tbm/",
    "/tools/test/",
    ...Object.values(TYPES).map((t) => `/tools/test/result/${t.slug}/`),
    "/about/",
    "/terms/",
    "/privacy/",
  ];
  const now = new Date();
  return paths.map((p) => ({ url: `${SITE_URL}${p}`, lastModified: now }));
}
