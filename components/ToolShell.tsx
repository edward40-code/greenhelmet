import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { AdSlot, PageTitle } from "./ui";

export default function ToolShell({ title, desc, width = 1240, children }: { title: string; desc: ReactNode; width?: number; children: ReactNode }) {
  return (
    <>
      <Header active="tools" />
      <div className="mx-auto flex flex-col gap-4 px-4 pt-6 pb-10 sm:px-5" style={{ maxWidth: width }}>
        <div className="no-print">
          <PageTitle title={title} desc={desc} />
        </div>
        {children}
        <AdSlot slot="tool_bottom" />
      </div>
      <Footer />
    </>
  );
}
