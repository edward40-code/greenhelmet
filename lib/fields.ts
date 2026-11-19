/** 분야 구분. 소식·자료실·이슈리포트에 공통으로 붙는다. */
export const FIELDS = [
  { key: "safety", name: "산업안전" },
  { key: "health", name: "보건" },
  { key: "env", name: "환경" },
  { key: "chem", name: "화학물질" },
  { key: "fire", name: "소방·위험물" },
  { key: "const", name: "건설안전" },
  { key: "common", name: "공통" },
] as const;

export type FieldKey = (typeof FIELDS)[number]["key"];

export const fieldName = (k: string) => FIELDS.find((f) => f.key === k)?.name ?? "공통";

/** 2026-11-16 → 2026.11.16 */
export const fmtDate = (d: string) => d.slice(0, 10).replace(/-/g, ".");

/** 분야별 색. c=진한 글자색, soft=옅은 배경, a/b=썸네일 그라데이션 */
export const FIELD_STYLE: Record<string, { c: string; soft: string; a: string; b: string }> = {
  safety: { c: "#b45309", soft: "#fff4e5", a: "#f59e0b", b: "#c2410c" },
  health: { c: "#0f766e", soft: "#e6f6f4", a: "#2dd4bf", b: "#0f766e" },
  env: { c: "#15803d", soft: "#e9f7ee", a: "#4ade80", b: "#166534" },
  chem: { c: "#7c3aed", soft: "#f2ecfe", a: "#a78bfa", b: "#6d28d9" },
  fire: { c: "#b91c1c", soft: "#fdecec", a: "#f87171", b: "#b91c1c" },
  const: { c: "#a16207", soft: "#fdf6dd", a: "#facc15", b: "#a16207" },
  common: { c: "#3f5662", soft: "#eaf0f3", a: "#7fa3b5", b: "#34505e" },
};
export const fieldStyle = (k: string) => FIELD_STYLE[k] ?? FIELD_STYLE.common;

/** 읽는 시간(분). 한글 기준 분당 약 500자 */
export const readMinutes = (html: string) => Math.max(1, Math.round(html.replace(/<[^>]+>/g, "").replace(/\s+/g, "").length / 500));
