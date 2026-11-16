import ise from "@/content/certs/industrial-safety-engineer.json";
import iseTypes from "@/content/exam-types/industrial-safety-engineer.json";

export type Cert = typeof ise;
export type ExamTypes = typeof iseTypes;

/** 2차에서 certifications / exam_types 테이블로 옮긴다 */
const CERTS: Record<string, { cert: Cert; types: ExamTypes }> = {
  [ise.slug]: { cert: ise, types: iseTypes },
};

export const certSlugs = () => Object.keys(CERTS);
export const getCert = (slug: string) => CERTS[slug];

/** 1차에서 여는 종목 탭. 나머지(공략, 합격 후기, 질문·답변)는 준비 중 */
export const CERT_TABS = [
  { key: "", label: "개요", open: true },
  { key: "guide", label: "공략", open: false },
  { key: "types", label: "출제 유형", open: true },
  { key: "review", label: "합격 후기", open: false },
  { key: "qna", label: "질문·답변", open: false },
] as const;

export const OPEN_TABS = CERT_TABS.filter((t) => t.open && t.key).map((t) => t.key);
