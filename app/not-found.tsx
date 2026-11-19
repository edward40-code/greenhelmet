import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <div className="mx-auto flex max-w-[760px] flex-col items-center gap-4 px-4 py-20 text-center">
        <h1 className="m-0 text-[26px] font-extrabold">페이지를 찾을 수 없습니다</h1>
        <Link href="/" className="flex min-h-[48px] items-center rounded-md bg-accent px-5 font-bold text-white hover:text-white">처음으로</Link>
      </div>
      <Footer />
    </>
  );
}
