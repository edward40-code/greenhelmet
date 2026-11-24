import { SITE } from "@/lib/site";

export default function AlertBox() {
  if (!SITE.kakaoChannel) return null;
  return (
    <section className="flex flex-col gap-3 rounded-md border border-line bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div className="flex flex-col gap-1">
        <h2 className="m-0 text-[18px] font-extrabold">법 개정 알림 받기</h2>
        <p className="m-0 text-[15px] leading-relaxed text-muted">산업안전보건법, 중대재해처벌법, 환경 법령의 바뀐 조문과 시행일을 카카오톡으로 보내 드립니다.</p>
      </div>
      <a
        href={`${SITE.kakaoChannel}/friend`}
        target="_blank"
        rel="noopener"
        className="inline-flex min-h-[48px] shrink-0 items-center justify-center rounded-md bg-[#FEE500] px-5 text-[16px] font-bold text-[#191919] hover:text-[#191919] hover:no-underline"
      >
        카카오톡 채널 추가
      </a>
    </section>
  );
}
