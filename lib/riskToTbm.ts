/** 위험성평가 도구 → TBM 생성기로 넘기는 값 (같은 탭 sessionStorage) */
export const TBM_FROM_RISK = "gh-tbm-from-risk";

export type TbmHazard = { h: string; k: string; lv: string; rank: number; ms: string[] };
export type TbmFromRisk = { site: string; proc: string; date: string; hazards: TbmHazard[] };
