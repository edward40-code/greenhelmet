/** 선 아이콘 모음 (24x24, stroke). 외부 아이콘 라이브러리 없이 직접 그린다. */
type P = { size?: number; className?: string; color?: string; stroke?: number };

function Svg({ size = 24, className, color = "currentColor", stroke = 2, children }: P & { children: React.ReactNode }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" className={className}>
      {children}
    </svg>
  );
}

const PATHS: Record<string, React.ReactNode> = {
  // 분야
  safety: (<><path d="M4 16a8 8 0 0 1 16 0" /><path d="M2 16h20v2.5H2z" /><path d="M10 8.3V5h4v3.3" /></>),
  health: (<><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /><path d="M9 11h6M12 8v6" /></>),
  env: (<><path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14z" /><path d="M5 19l7-7" /></>),
  chem: (<><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3" /><path d="M7.5 15h9" /></>),
  fire: (<><path d="M12 21a6 6 0 0 0 6-6c0-4-3-6-4-10-2 2-3 4-3 6-1-1-2-2-2-3-2 2-3 4.5-3 7a6 6 0 0 0 6 6z" /></>),
  const: (<><path d="M3 21h18" /><path d="M6 21V9l6-5 6 5v12" /><path d="M10 21v-5h4v5" /></>),
  common: (<><path d="M4 5h16v14H4z" /><path d="M8 9h8M8 13h8M8 17h5" /></>),
  // 사고 유형
  fall: (<><path d="M12 3v11" /><path d="M8 10l4 4 4-4" /><path d="M4 21h16" /><path d="M7 18h10" /></>),
  caught: (<><circle cx="8" cy="12" r="4" /><circle cx="16" cy="12" r="4" /><path d="M12 4v4M12 16v4" /></>),
  crush: (<><path d="M4 4h16v5H4z" /><path d="M12 9v4" /><path d="M8 20l4-7 4 7z" /></>),
  gas: (<><path d="M4 8h10a3 3 0 1 0-3-3" /><path d="M4 12h15a3 3 0 1 1-3 3" /><path d="M4 16h7" /></>),
  shock: (<><path d="M13 2L5 14h6l-1 8 8-12h-6z" /></>),
  explosion: (<><path d="M12 2l2 5 5-2-2 5 5 2-5 2 2 5-5-2-2 5-2-5-5 2 2-5-5-2 5-2-2-5 5 2z" /></>),
  leak: (<><path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z" /></>),
  struck: (<><path d="M9 3h6v4H9z" /><path d="M12 7v5" /><path d="M8 14l4 4 4-4" /><path d="M4 21h16" /></>),
  vehicle: (<><path d="M3 16V8h11v8" /><path d="M14 11h4l3 3v2h-7" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></>),
  alert: (<><path d="M12 3l10 18H2z" /><path d="M12 10v5M12 18h.01" /></>),
  // 일반
  doc: (<><path d="M6 2h9l5 5v15H6z" /><path d="M14 2v6h6" /><path d="M9 13h7M9 17h7" /></>),
  sheet: (<><path d="M4 4h16v16H4z" /><path d="M4 10h16M4 15h16M10 4v16" /></>),
  link: (<><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></>),
  download: (<><path d="M12 3v12" /><path d="M7 10l5 5 5-5" /><path d="M4 21h16" /></>),
  arrow: (<><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></>),
  clock: (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  tool: (<><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-.5-.5-2.5z" /></>),
  calc: (<><path d="M5 2h14v20H5z" /><path d="M8 6h8M8 11h2M14 11h2M8 15h2M14 15h2M8 19h2M14 19h2" /></>),
  people: (<><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5" /></>),
  check: (<><path d="M9 11l3 3 8-8" /><path d="M20 12v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h11" /></>),
  cap: (<><path d="M2 9l10-5 10 5-10 5z" /><path d="M6 11v5c3 2.5 9 2.5 12 0v-5" /></>),
  news: (<><path d="M4 5h13v14H6a2 2 0 0 1-2-2z" /><path d="M17 9h3v8a2 2 0 0 1-2 2" /><path d="M8 9h5M8 13h5" /></>),
  spark: (<><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" /></>),
  search: (<><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></>),
};

export function Icon({ name, ...p }: P & { name: string }) {
  return <Svg {...p}>{PATHS[name] ?? PATHS.common}</Svg>;
}
