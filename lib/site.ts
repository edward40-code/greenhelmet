import site from "@/content/site.json";

export const SITE = site as {
  name: string;
  description: string;
  operator: string | null;
  contactEmail: string | null;
  policyEffectiveDate: string;
};

/** GitHub Pages 하위 경로(예: /greenhelmet). 로컬에서는 빈 값 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** 배포 주소. 배포할 때 NEXT_PUBLIC_SITE_URL 환경변수로 정한다. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
