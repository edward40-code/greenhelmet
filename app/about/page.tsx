import type { Metadata } from "next";
import Link from "next/link";
import DocShell from "@/components/DocShell";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "소개",
  description: `${SITE.name}는 EHS(환경·안전·보건) 자격증 수험생과 실무자를 위한 커뮤니티입니다. 무엇을 하고 무엇을 하지 않는지 소개합니다.`,
  alternates: { canonical: "/about/" },
};

export default function Page() {
  return (
    <DocShell title={`${SITE.name} 소개`} active="about">
      <p>
        {SITE.name}는 환경·안전·보건 분야 자격증을 준비하는 수험생과 현장 실무자가 정보를 나누는 곳입니다. 게임 커뮤니티처럼 종목별 ‘관’을 두고, 공략과 도구를 한곳에 모읍니다.
      </p>

      <p>‘{SITE.name}’는 사이트 이름이며 국가자격이 아닙니다.</p>

      <h2>지금 쓸 수 있는 것</h2>
      <ul>
        <li><Link href="/cert/industrial-safety-engineer/">산업안전기사</Link> 시험 구조와 <Link href="/cert/industrial-safety-engineer/types/">출제 유형 정리</Link></li>
        <li><Link href="/tools/calc/">단위환산·안전계산</Link> — ppm↔mg/m³, 소음 노출량, 재해율·도수율·강도율</li>
        <li><Link href="/tools/career/">경력 계산</Link> — 근무 기간을 연·월·일로 합산</li>
        <li><Link href="/tools/tbm/">TBM 생성기</Link> — 작업 전 안전회의 자료를 만들어 인쇄</li>
        <li><Link href="/tools/test/">안전 성향 테스트</Link></li>
      </ul>
      <p>도구는 회원가입 없이 씁니다. 입력한 값은 이용자의 브라우저 안에서만 계산하고 서버로 보내지 않습니다.</p>

      <h2>앞으로 열 것</h2>
      <p>공략 게시판, 합격 후기, 익명 수다방 같은 커뮤니티 기능과 MSDS 분석기, 법령 DB, 법령 적용 진단, 안전교육 자료실을 차례로 엽니다. 자격증 종목도 건설안전기사, 산업위생관리기사, 환경 분야 기사 순으로 늘립니다.</p>

      <h2>하지 않는 것</h2>
      <ul>
        <li>시험문제 원문, 복원 문제, 자체 제작 문제를 싣지 않습니다. 출제 유형과 공부 방향만 다룹니다.</li>
        <li>구인·구직, 업체 홍보, 장비 거래, 견적 중개를 하지 않습니다.</li>
      </ul>

      <h2>정보의 정확성</h2>
      <p>
        시험 구조, 법령 기준, 계산식처럼 확인이 필요한 값에는 <strong>검증 전</strong> 표시를 붙이고, EHS 전문가인 운영자가 원문과 대조한 뒤 표시를 뗍니다. 이 사이트의 내용은 참고용이며, 시험은 한국산업인력공단 공고를, 법령은 현행 법령 원문을 최종 기준으로 삼아 주세요.
      </p>

      {SITE.contactEmail && (
        <>
          <h2>문의</h2>
          <p><a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a></p>
        </>
      )}
    </DocShell>
  );
}
