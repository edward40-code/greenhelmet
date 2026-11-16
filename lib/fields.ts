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
