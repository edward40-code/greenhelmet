import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import { ToolGrid } from "@/components/Catalog";

export const metadata: Metadata = {
  title: "EHS 실무 도구 모음",
  description: "단위환산·안전계산, 경력 계산, TBM 생성기, 안전 성향 테스트 등 환경·안전·보건 실무자와 수험생이 브라우저에서 바로 쓰는 무료 도구 모음입니다.",
  alternates: { canonical: "/tools/" },
};

export default function Page() {
  return (
    <ToolShell title="도구" desc="회원가입 없이 사용 · 입력값은 이 브라우저 안에서만 계산">
      <section className="card flex flex-col gap-4 p-[18px] sm:px-5">
        <ToolGrid />
      </section>
    </ToolShell>
  );
}
