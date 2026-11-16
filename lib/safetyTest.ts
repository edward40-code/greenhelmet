export type TypeKey = "A" | "B" | "C" | "D";

export const QUESTIONS: { text: string; opts: [TypeKey, string][] }[] = [
  { text: "현장 순회 중 안전모를 안 쓴 작업자를 봤습니다.", opts: [["A", "바로 멈추게 하고 규정을 설명한다"], ["B", "일단 내 여분 안전모를 건넨다"], ["C", "이번 달 미착용 건수를 기록해 둔다"], ["D", "왜 안 썼는지 먼저 물어본다"]] },
  { text: "감독 점검이 다음 주로 잡혔습니다.", opts: [["A", "법정 서류부터 하나씩 대조한다"], ["B", "현장을 돌며 눈에 띄는 것부터 고친다"], ["C", "작년 지적사항 통계를 뽑아 본다"], ["D", "팀장들을 모아 역할을 나눈다"]] },
  { text: "신규 직원 안전교육을 맡았습니다.", opts: [["A", "교육 기준 시간을 정확히 채운다"], ["B", "현장에 데려가 직접 보여 준다"], ["C", "사고 사례 숫자로 경각심을 준다"], ["D", "질문을 많이 받으며 대화로 푼다"]] },
  { text: "아차사고 보고가 올라왔습니다.", opts: [["A", "보고 양식과 절차대로 처리한다"], ["B", "당장 그 자리에 가서 원인을 막는다"], ["C", "비슷한 보고가 몇 건이었는지 본다"], ["D", "보고한 사람을 칭찬하고 공유한다"]] },
  { text: "쉬는 날 가장 많이 하는 생각은", opts: [["A", "바뀐 법령을 놓친 게 없나"], ["B", "그 설비 내일 손봐야겠다"], ["C", "지표가 왜 이번 달 올랐을까"], ["D", "그 반장님 요즘 괜찮으신가"]] },
  { text: "동료가 나를 한 단어로 부른다면", opts: [["A", "원칙"], ["B", "해결사"], ["C", "엑셀"], ["D", "상담소"]] },
];

export type ResultType = { key: TypeKey; slug: string; name: string; desc: string; mate: string; cert: string };

export const TYPES: Record<TypeKey, ResultType> = {
  A: { key: "A", slug: "principle", name: "원칙파 감독관", desc: "규정과 절차가 가장 단단한 안전장치라고 믿습니다. 서류 하나 빠지지 않는 사업장은 대개 당신 덕분입니다.", mate: "현장파 해결사", cert: "산업안전지도사" },
  B: { key: "B", slug: "fixer", name: "현장파 해결사", desc: "문제는 책상이 아니라 현장에서 풀린다고 생각합니다. 위험을 보면 손이 먼저 나갑니다.", mate: "데이터파 분석가", cert: "건설안전기사" },
  C: { key: "C", slug: "analyst", name: "데이터파 분석가", desc: "숫자 속에서 다음 사고를 먼저 봅니다. 재해율이 오르기 전에 이미 표를 그리고 있습니다.", mate: "소통파 교육자", cert: "산업위생관리기사" },
  D: { key: "D", slug: "communicator", name: "소통파 교육자", desc: "사람이 바뀌어야 현장이 바뀐다고 믿습니다. 당신과 이야기한 작업자는 다음 날 안전모를 씁니다.", mate: "원칙파 감독관", cert: "산업안전기사" },
};

export const typeBySlug = (slug: string) => Object.values(TYPES).find((t) => t.slug === slug);

/** 동점이면 A→B→C→D 순으로 앞선 유형 (시안과 같음) */
export function bestType(score: Record<TypeKey, number>): TypeKey {
  return (Object.keys(score) as TypeKey[]).reduce((a, b) => (score[b] > score[a] ? b : a), "A");
}
