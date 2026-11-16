import type { ReactNode } from "react";
import Header, { type Active } from "./Header";
import Footer from "./Footer";
import { PageTitle } from "./ui";

export default function SiteShell({ active, title, desc, width = 1240, children }: { active: Active; title: string; desc?: ReactNode; width?: number; children: ReactNode }) {
  return (
    <>
      <Header active={active} />
      <div className="mx-auto flex flex-col gap-4 px-4 pt-6 pb-10 sm:px-5" style={{ maxWidth: width }}>
        <PageTitle title={title} desc={desc} />
        {children}
      </div>
      <Footer />
    </>
  );
}
