/** 중대재해처벌법 경영책임자등의 조치 의무 (법 제4조, 시행령 제4조·제5조·제13조)
 *  국가법령정보센터 현행본 확인 2026-11-20: 법 2022.1.27. 시행, 시행령 2025.10.1. 시행 */
export type Duty = {
  id: string;
  law: string;
  text: string;
  half?: boolean; // 반기 1회 이상 점검
  cond?: "org" | "contract"; // org: 전담 조직 대상만, contract: 도급·용역·위탁을 줄 때만
  form?: { label: string; href: string };
};

const SET = "/library/sapa-half-year-set/";

export const DUTIES: Duty[] = [
  { id: "d1", law: "영 제4조제1호", text: "안전·보건 목표와 경영방침 설정", form: { label: "경영방침과 목표", href: SET } },
  { id: "d2", law: "영 제4조제2호", text: "안전·보건 업무를 총괄·관리하는 전담 조직", cond: "org" },
  { id: "d3", law: "영 제4조제3호", text: "유해·위험요인 확인·개선 절차 마련과 점검", half: true, form: { label: "위험성평가표", href: "/library/risk-assessment-form/" } },
  { id: "d4", law: "영 제4조제4호", text: "안전·보건 예산 편성, 용도대로 집행", form: { label: "예산 편성·집행 대장", href: SET } },
  { id: "d5", law: "영 제4조제5호가목", text: "안전보건관리책임자등에게 권한과 예산 부여" },
  { id: "d6", law: "영 제4조제5호나목", text: "안전보건관리책임자등 업무 평가기준 마련과 평가", half: true, form: { label: "책임자등 평가", href: SET } },
  { id: "d7", law: "영 제4조제6호", text: "안전관리자·보건관리자 등 배치, 겸직 시 업무 수행시간 보장" },
  { id: "d8", law: "영 제4조제7호", text: "종사자 의견 청취 절차와 개선방안 이행 점검", half: true, form: { label: "종사자 의견 기록", href: SET } },
  { id: "d9", law: "영 제4조제8호", text: "작업 중지·대피, 구호, 추가 피해방지 매뉴얼과 점검", half: true, form: { label: "대응 매뉴얼 점검", href: SET } },
  { id: "d10", law: "영 제4조제9호", text: "도급·용역·위탁 평가기준, 관리비용 기준과 점검", half: true, cond: "contract", form: { label: "수급인 평가표", href: SET } },
  { id: "d11", law: "영 제5조제2항제1호", text: "안전·보건 관계 법령 의무 이행 점검", half: true, form: { label: "관계 법령 점검", href: SET } },
  { id: "d12", law: "영 제5조제2항제2호", text: "미이행 의무에 인력 배치·예산 추가 편성" },
  { id: "d13", law: "영 제5조제2항제3호", text: "유해·위험 작업 법정 안전·보건교육 실시 점검", half: true, form: { label: "교육 실시 기록", href: "/library/safety-education-record/" } },
  { id: "d14", law: "영 제5조제2항제4호", text: "미실시 교육 이행 지시와 예산 확보" },
  { id: "d15", law: "법 제4조제1항제2호", text: "재해 발생 시 재발방지 대책 수립·이행", form: { label: "시정조치 계획서", href: "/library/corrective-action-plan/" } },
  { id: "d16", law: "법 제4조제1항제3호", text: "정부·지자체 개선·시정 명령 이행" },
  { id: "d17", law: "영 제13조", text: "이행 사항 서면 작성, 이행한 날부터 5년 보관" },
];
