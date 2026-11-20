import type { Metadata } from "next";
import Link from "next/link";
import DocShell from "@/components/DocShell";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "소개",
  description: `${SITE.name}는 산업안전·보건·환경 실무자를 위한 소식·자료실 커뮤니티입니다. 무엇을 하고 무엇을 하지 않는지 소개합니다.`,
  alternates: { canonical: "/about/" },
};

export default function Page() {
  return (
    <DocShell title={`${SITE.name} 소개`} active="about">
      <p>
        {SITE.name}는 산업안전·보건·환경 실무자가 매일 들러 <strong>분야별 소식</strong>을 확인하고, <strong>바로 쓰는 자료</strong>를 무료로 받아 가는 곳입니다. 안전관리자, 보건관리자, 환경기술인, 그리고 EHS 자격증을 준비하는 분들을 위해 만듭니다.
      </p>

      <p>‘{SITE.name}’는 사이트 이름이며 국가자격이 아닙니다.</p>

      <h2>지금 쓸 수 있는 것</h2>
      <ul>
        <li><Link href="/news/">소식</Link>: 고용노동부 정책자료·입법·행정예고를 매일 받아 분야별로 정리</li>
        <li><Link href="/reports/">이슈리포트</Link>: 법령 개정, 통계·사고 발표, 업계 동향을 실무 관점으로 해설</li>
        <li><Link href="/library/">자료실</Link>: TBM 일지, 교육 기록, 점검표, 위험성평가표 무료 양식과 공공기관 자료 위치 안내</li>
        <li><Link href="/tools/">도구</Link>: 지침 인벤토리, 단위환산, 안전계산, 경력 계산, TBM 생성기, 안전 성향 테스트</li>
        <li><Link href="/cert/industrial-safety-engineer/">자격증</Link>: 산업안전기사 시험 구조와 출제 유형 정리</li>
      </ul>
      <p>서식과 도구는 회원가입 없이 씁니다. 도구에 입력한 값은 이용자의 브라우저 안에서만 계산하고 서버로 보내지 않습니다.</p>

      <h2>하지 않는 것</h2>
      <ul>
        <li>언론 기사 본문이나 다른 사이트 자료를 옮겨 싣지 않습니다. 제목·요약과 원문 링크로 안내합니다.</li>
        <li>시험문제 원문, 복원 문제, 자체 제작 문제를 싣지 않습니다.</li>
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
