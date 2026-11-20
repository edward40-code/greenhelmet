import site from "@/content/site.json";

export const SITE = site as {
  name: string;
  tagline: string;
  description: string;
  operator: string | null;
  contactEmail: string | null;
  policyEffectiveDate: string;
};

/** GitHub Pages 하위 경로(예: /greenhelmet). 로컬에서는 빈 값 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** 배포 주소. 배포할 때 NEXT_PUBLIC_SITE_URL 환경변수로 정한다. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

/** 공유 썸네일(og:image). scripts/make_og.py 로 만든 public/og.png. 하위 경로 배포라 전체 주소로 적는다.
 *  페이지에서 openGraph를 따로 쓰면 상위 값이 통째로 바뀌므로 images: OG_IMAGES 를 함께 넣는다. */
export const OG_IMAGES = [{ url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: `${site.name}, ${site.tagline}` }];
