// 교육자료 PPTX 생성기 (자료실 '교육자료')
// 근거 조문은 국가법령정보센터 현행본을 2026-11-20에 확인했다.
//  - 산업안전보건기준에 관한 규칙 제87·89·92~95조, 제618~641조 (시행 2026.3.2.)
//  - 산업안전보건법 시행규칙 [별표 4]·[별표 5] 제1호라목 제34호 (시행 2026.8.1.)
//  - 폐기물관리법 제17·18·48조, 시행규칙 [별표 5] 제3호다목·제4호나목 (별표 개정 2026.3.26.)
// 실행: pptxgenjs를 아무 폴더에 설치(npm i pptxgenjs)한 뒤
//       NODE_PATH=<그 폴더>/node_modules node scripts/make_edu.cjs  → public/library/edu-*.pptx
const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");
const JSZip = require(require.resolve("jszip", { paths: [require.resolve("pptxgenjs")] }));

const OUT = path.join(__dirname, "..", "public", "library");
const FONT = "맑은 고딕";
const Y0 = 1.3; // 본문 시작
const Y1 = 4.65; // 본문 끝 (그 아래는 근거 줄과 바닥글)

function build(deck) {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9"; // 10 x 5.625 in
  pres.author = "그린헬멧기사";
  pres.company = "그린헬멧기사";
  pres.title = deck.title;
  pres.subject = "안전보건환경 교육자료";
  pres.theme = { headFontFace: FONT, bodyFontFace: FONT };
  const C = pres.SchemeColor;
  const INK = C.text1, MUTED = C.text2, WHITE = C.background1, TINT = C.background2;
  const ACC = C.accent1, ACC_SOFT = C.accent2, BAD = C.accent3, BAD_SOFT = C.accent4, MINT = C.accent5;
  let n = 0;
  const nm = (k) => `${k}-${++n}`;

  pres.defineSlideMaster({
    title: "COVER",
    background: { color: INK },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.7, y: 1.55, w: 6.3, h: 1.6, fontSize: 36, bold: true, color: WHITE, align: "left", valign: "bottom", margin: 0 }, text: "" } },
      { placeholder: { options: { name: "body", type: "body", x: 0.7, y: 3.35, w: 6.0, h: 0.9, fontSize: 18, color: MINT, align: "left", valign: "top", margin: 0 }, text: "" } },
    ],
  });
  pres.defineSlideMaster({
    title: "CONTENT",
    background: { color: WHITE },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.5, y: 0.35, w: 9.0, h: 0.75, fontSize: 28, bold: true, color: INK, align: "left", valign: "middle", margin: 0 }, text: "" } },
      { text: { text: `그린헬멧기사 교육자료 · ${deck.short}`, options: { x: 0.5, y: 5.18, w: 6.5, h: 0.28, fontSize: 10, color: MUTED, margin: 0 } } },
    ],
    slideNumber: { x: 9.0, y: 5.18, w: 0.5, h: 0.28, fontSize: 10, color: MUTED, align: "right" },
  });
  pres.defineSlideMaster({
    title: "DARK",
    background: { color: INK },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.4, w: 8.8, h: 0.75, fontSize: 28, bold: true, color: WHITE, align: "left", valign: "middle", margin: 0 }, text: "" } },
      { text: { text: `그린헬멧기사 교육자료 · ${deck.short}`, options: { x: 0.6, y: 5.18, w: 6.5, h: 0.28, fontSize: 10, color: TINT, margin: 0 } } },
    ],
  });

  const T = (s, text, o) => s.addText(text, { isTextBox: true, margin: 0, color: INK, fontSize: 14, valign: "top", objectName: nm("글"), ...o });
  const box = (s, x, y, w, h, fill, o = {}) =>
    s.addShape(pres.ShapeType.roundRect, { x, y, w, h, fill: { color: fill, ...(o.transparency ? { transparency: o.transparency } : {}) }, line: { type: "none" }, rectRadius: 0.08, objectName: nm("카드") });
  const badge = (s, x, y, d, text, fill, fs = 14) =>
    s.addText(String(text), { shape: pres.ShapeType.ellipse, x, y, w: d, h: d, fill: { color: fill }, line: { type: "none" }, color: WHITE, bold: true, fontSize: String(text).length > 1 ? Math.min(fs, 12) : fs, wrap: false, align: "center", valign: "middle", margin: 0, objectName: nm("번호") });
  const law = (s, text) => text && T(s, `근거 · ${text}`, { x: 0.5, y: 4.76, w: 9.0, h: 0.3, fontSize: 11, color: MUTED, valign: "middle" });

  const content = (sl) => {
    const s = pres.addSlide({ masterName: "CONTENT" });
    s.addText(sl.title, { placeholder: "title" });
    if (sl.notes) s.addNotes(sl.notes);
    return s;
  };

  const kinds = {
    cover(sl) {
      const s = pres.addSlide({ masterName: "COVER" });
      s.addShape(pres.ShapeType.ellipse, { x: 6.55, y: -0.9, w: 5.4, h: 5.4, fill: { color: ACC }, line: { type: "none" }, objectName: nm("원") });
      s.addShape(pres.ShapeType.ellipse, { x: 5.9, y: 3.5, w: 2.6, h: 2.6, fill: { color: MINT, transparency: 25 }, line: { type: "none" }, objectName: nm("원") });
      s.addText("그린헬멧기사 교육자료", { shape: pres.ShapeType.roundRect, rectRadius: 0.16, x: 0.7, y: 0.6, w: 2.35, h: 0.36, fill: { color: MUTED }, line: { type: "none" }, color: WHITE, fontSize: 11, bold: true, align: "center", valign: "middle", margin: 0, objectName: nm("꼬리표") });
      s.addText(sl.title, { placeholder: "title" });
      s.addText(sl.sub, { placeholder: "body" });
      T(s, sl.meta, { x: 0.7, y: 4.75, w: 5.5, h: 0.3, fontSize: 12, color: TINT });
      s.addNotes(sl.notes);
    },
    // 번호(또는 점)가 붙은 가로 줄
    rows(sl) {
      const s = content(sl);
      const k = sl.items.length, gap = 0.12, h = (Y1 - Y0 - gap * (k - 1)) / k;
      sl.items.forEach((it, i) => {
        const y = Y0 + i * (h + gap);
        box(s, 0.5, y, 9.0, h, TINT);
        const d = sl.numbered === false ? 0.2 : Math.min(0.46, h - 0.2);
        badge(s, 0.95 - d / 2, y + (h - d) / 2, d, sl.numbered === false ? "" : i + 1, ACC);
        T(s, it.h, { x: 1.4, y, w: 2.85, h, fontSize: 16, bold: true, valign: "middle" });
        T(s, it.d, { x: 4.35, y, w: 4.95, h, fontSize: 14, valign: "middle" });
      });
      law(s, sl.law);
    },
    // 카드 격자. big: 위에 큰 번호 원
    cards(sl) {
      const s = content(sl);
      const cols = sl.cols, k = sl.items.length, rws = Math.ceil(k / cols), gap = 0.25;
      const y1 = sl.callout ? Y1 - 0.62 : Y1;
      const w = (9.0 - gap * (cols - 1)) / cols, h = (y1 - Y0 - gap * (rws - 1)) / rws;
      sl.items.forEach((it, i) => {
        const x = 0.5 + (i % cols) * (w + gap), y = Y0 + Math.floor(i / cols) * (h + gap);
        box(s, x, y, w, h, TINT);
        if (sl.big) {
          badge(s, x + 0.28, y + 0.28, 0.6, it.mark ?? i + 1, ACC, 18);
          T(s, it.h, { x: x + 0.28, y: y + 1.05, w: w - 0.56, h: 0.4, fontSize: 18, bold: true, valign: "middle" });
          T(s, it.d, { x: x + 0.28, y: y + 1.55, w: w - 0.56, h: h - 1.75, fontSize: 15 });
        } else {
          T(s, it.h, { x: x + 0.25, y: y + 0.18, w: w - 0.5, h: 0.4, fontSize: 16, bold: true, color: ACC, valign: "middle" });
          T(s, it.d, { x: x + 0.25, y: y + 0.64, w: w - 0.5, h: h - 0.8, fontSize: cols === 2 && rws === 1 ? 16 : 14 });
        }
      });
      if (sl.callout) {
        box(s, 0.5, Y1 - 0.5, 9.0, 0.5, ACC_SOFT);
        T(s, sl.callout, { x: 0.75, y: Y1 - 0.5, w: 8.5, h: 0.5, fontSize: 14, bold: true, color: ACC, valign: "middle" });
      }
      law(s, sl.law);
    },
    // 큰 숫자
    stats(sl) {
      const s = content(sl);
      const k = sl.items.length, gap = 0.25;
      if (k === 4) {
        const w = (9.0 - gap) / 2, h = (Y1 - Y0 - gap) / 2;
        sl.items.forEach((it, i) => {
          const x = 0.5 + (i % 2) * (w + gap), y = Y0 + Math.floor(i / 2) * (h + gap);
          box(s, x, y, w, h, TINT);
          T(s, it.label, { x: x + 0.3, y: y + 0.3, w: 1.9, h: 0.4, fontSize: 16, bold: true, valign: "middle" });
          T(s, it.d, { x: x + 0.3, y: y + 0.78, w: 1.9, h: 0.5, fontSize: 14, color: MUTED });
          T(s, it.big, { x: x + 2.4, y, w: w - 2.65, h, fontSize: 26, bold: true, color: ACC, align: "right", valign: "middle" });
        });
      } else {
        const w = (9.0 - gap * (k - 1)) / k, h = Y1 - Y0;
        sl.items.forEach((it, i) => {
          const x = 0.5 + i * (w + gap);
          box(s, x, Y0, w, h, TINT);
          T(s, it.big, { x: x + 0.28, y: Y0 + 0.25, w: w - 0.56, h: 0.9, fontSize: 44, bold: true, color: ACC, valign: "middle" });
          T(s, it.label, { x: x + 0.28, y: Y0 + 1.25, w: w - 0.56, h: 0.4, fontSize: 16, bold: true, valign: "middle" });
          T(s, it.d, { x: x + 0.28, y: Y0 + 1.75, w: w - 0.56, h: h - 1.95, fontSize: 12, color: MUTED });
        });
      }
      law(s, sl.law);
    },
    // 왼쪽 어두운 카드의 한 문장 + 오른쪽 설명
    split(sl) {
      const s = content(sl);
      box(s, 0.5, Y0, 3.4, Y1 - Y0, INK);
      T(s, sl.big, { x: 0.8, y: Y0, w: 2.8, h: Y1 - Y0, fontSize: 22, bold: true, color: WHITE, valign: "middle" });
      rightRows(s, sl.items, 4.2, 5.3);
      law(s, sl.law);
    },
    // 지정폐기물 보관표지 본보기 + 오른쪽 설명
    sign(sl) {
      const s = content(sl);
      s.addShape(pres.ShapeType.rect, { x: 0.5, y: Y0, w: 3.9, h: Y1 - Y0, fill: { color: C.accent6 }, line: { color: INK, width: 2 }, objectName: nm("표지") });
      T(s, "지정폐기물 보관표지", { x: 0.5, y: Y0 + 0.12, w: 3.9, h: 0.5, fontSize: 18, bold: true, align: "center", valign: "middle" });
      s.addShape(pres.ShapeType.line, { x: 0.5, y: Y0 + 0.7, w: 3.9, h: 0, line: { color: INK, width: 1.5 }, objectName: nm("선") });
      const lines = ["① 폐기물의 종류", "② 보관가능용량            톤", "③ 관리책임자", "④ 보관기간      ～      (   일간)", "⑤ 취급 시 주의사항 (보관·운반·처리)", "⑥ 운반(처리)예정장소"];
      const lh = (Y1 - Y0 - 0.85) / lines.length;
      lines.forEach((t, i) => T(s, t, { x: 0.72, y: Y0 + 0.78 + i * lh, w: 3.5, h: lh, fontSize: 12, bold: true, valign: "middle" }));
      rightRows(s, sl.items, 4.7, 4.8);
      law(s, sl.law);
    },
    // 하지 않을 일 / 할 일
    twoCol(sl) {
      const s = content(sl);
      const w = 4.375, h = (sl.callout ? Y1 - 0.62 : Y1) - Y0;
      const fs = Math.max(sl.bad.items.length, sl.good.items.length) > 4 ? 15 : 16;
      [[sl.bad, 0.5, BAD_SOFT, BAD, "×"], [sl.good, 5.125, ACC_SOFT, ACC, "○"]].forEach(([col, x, soft, strong, mark]) => {
        box(s, x, Y0, w, h, soft);
        badge(s, x + 0.28, Y0 + 0.25, 0.46, mark, strong, 16);
        T(s, col.h, { x: x + 0.9, y: Y0 + 0.25, w: w - 1.15, h: 0.46, fontSize: 16, bold: true, color: strong, valign: "middle" });
        T(s, col.items.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i < col.items.length - 1 } })),
          { x: x + 0.3, y: Y0 + 0.92, w: w - 0.6, h: h - 1.1, fontSize: fs, paraSpaceAfter: 8 });
      });
      if (sl.callout) {
        box(s, 0.5, Y1 - 0.5, 9.0, 0.5, ACC_SOFT);
        T(s, sl.callout, { x: 0.75, y: Y1 - 0.5, w: 8.5, h: 0.5, fontSize: 14, bold: true, color: ACC, valign: "middle" });
      }
      law(s, sl.law);
    },
    // 마무리: 약속 + 함께 확인하기
    closing(sl) {
      const s = pres.addSlide({ masterName: "DARK" });
      s.addText(sl.title, { placeholder: "title" });
      sl.promises.forEach((p, i) => {
        const y = 1.45 + i * 1.05;
        badge(s, 0.6, y + 0.12, 0.56, i + 1, ACC, 18);
        T(s, p, { x: 1.4, y, w: 3.6, h: 0.8, fontSize: 18, bold: true, color: WHITE, valign: "middle" });
      });
      box(s, 5.3, 1.4, 4.2, 3.4, MUTED, { transparency: 45 });
      T(s, "함께 확인하기", { x: 5.6, y: 1.58, w: 3.6, h: 0.36, fontSize: 14, bold: true, color: MINT, valign: "middle" });
      T(s, sl.questions.map((q, i) => ({ text: q, options: { bullet: true, breakLine: i < sl.questions.length - 1 } })),
        { x: 5.6, y: 2.1, w: 3.6, h: 2.55, fontSize: 16, color: WHITE, paraSpaceAfter: 14 });
      s.addNotes(sl.notes);
    },
    // 근거와 함께 쓰는 자료
    refs(sl) {
      const s = content(sl);
      const w = 4.375, h = 2.5;
      [["근거 법령", sl.laws, 0.5], ["그린헬멧기사 자료실에서 함께 쓰는 자료", sl.files, 5.125]].forEach(([head, items, x]) => {
        box(s, x, Y0, w, h, TINT);
        T(s, head, { x: x + 0.28, y: Y0 + 0.18, w: w - 0.56, h: 0.36, fontSize: 14, bold: true, color: ACC, valign: "middle" });
        T(s, items.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i < items.length - 1 } })),
          { x: x + 0.28, y: Y0 + 0.64, w: w - 0.56, h: h - 0.8, fontSize: 12, paraSpaceAfter: 6 });
      });
      box(s, 0.5, Y0 + h + 0.2, 9.0, Y1 + 0.38 - (Y0 + h + 0.2), ACC_SOFT);
      T(s, sl.note, { x: 0.75, y: Y0 + h + 0.2, w: 8.5, h: Y1 + 0.38 - (Y0 + h + 0.2), fontSize: 12, valign: "middle" });
    },
  };

  function rightRows(s, items, x, w) {
    const k = items.length, h = (Y1 - Y0) / k;
    items.forEach((it, i) => {
      const y = Y0 + i * h;
      T(s, it.h, { x, y: y + 0.04, w, h: 0.36, fontSize: 16, bold: true, color: ACC, valign: "middle" });
      T(s, it.d, { x, y: y + 0.44, w, h: h - 0.5, fontSize: 14 });
    });
  }

  deck.slides.forEach((sl) => kinds[sl.kind](sl));
  return pres;
}

async function applyTheme(file, theme) {
  const zip = await JSZip.loadAsync(fs.readFileSync(file));
  const part = "ppt/theme/theme1.xml";
  const slots = ["dk1", "lt1", "dk2", "lt2", "accent1", "accent2", "accent3", "accent4", "accent5", "accent6", "hlink", "folHlink"];
  const scheme = `<a:clrScheme name="${theme.name}">` + slots.map((k) => `<a:${k}><a:srgbClr val="${theme.colors[k]}"/></a:${k}>`).join("") + "</a:clrScheme>";
  let xml = await zip.file(part).async("string");
  if (!/<a:clrScheme\b[\s\S]*?<\/a:clrScheme>/.test(xml)) throw new Error("테마 색 정의를 찾지 못했습니다");
  xml = xml
    .replace(/<a:clrScheme\b[\s\S]*?<\/a:clrScheme>/, () => scheme)
    .replace(/(<a:(?:theme|fontScheme)\b[^>]*?\bname=")[^"]*"/g, (_, head) => `${head}${theme.name}"`)
    .replace(/<a:ea typeface=""\s*\/>/g, `<a:ea typeface="${FONT}"/>`);
  zip.file(part, xml);
  // pptxgenjs는 글자 언어를 영어로 적는데, 그러면 파워포인트가 한글을 낱말 중간에서 줄바꿈한다 → 한국어로 바꾼다
  for (const k of Object.keys(zip.files)) {
    if (!/^ppt\/(slides|slideLayouts|slideMasters|notesSlides)\/[^/]+\.xml$/.test(k)) continue;
    zip.file(k, (await zip.file(k).async("string")).replace(/lang="en-US"/g, 'lang="ko-KR"'));
  }
  // 폴더 항목이 들어 있으면 일부 클라우드 서비스에서 파일이 안 열리는 일이 있어 뺀다
  Object.keys(zip.files).filter((k) => zip.files[k].dir).forEach((k) => delete zip.files[k]);
  fs.writeFileSync(file, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
}

const BASE = { dk1: "16242B", lt1: "FFFFFF", dk2: "4A5A63", lt2: "F1F5F4", accent3: "B3261E", accent4: "FDECEC", accent5: "6FD08C", accent6: "FFD400", hlink: "1F5FA8", folHlink: "4A5A63" };

// ───────────────────────── 1. 밀폐공간 질식재해 예방 ─────────────────────────
const CONFINED = {
  file: "edu-confined-space.pptx",
  title: "밀폐공간 질식재해 예방",
  short: "밀폐공간 질식재해 예방",
  theme: { name: "그린헬멧 보건", colors: { ...BASE, accent1: "0F766E", accent2: "E6F6F4" } },
  slides: [
    { kind: "cover", title: "밀폐공간 질식재해 예방", sub: "들어가기 전에 측정하고, 환기하고, 감시인을 세웁니다", meta: "밀폐공간 작업 교육자료 · 약 20분",
      notes: "[교육 안내] 밀폐공간 작업 전에 작업자와 감시인에게 하는 교육용 자료입니다. 슬라이드마다 아래 설명을 읽으며 진행하면 20분쯤 걸립니다. 우리 사업장의 밀폐공간 위치, 측정기와 공기호흡기 보관 장소를 미리 확인해 두고 중간중간 실제 장소를 예로 들어 주세요." },
    { kind: "cards", cols: 3, title: "이런 곳이 밀폐공간입니다", law: "산업안전보건기준에 관한 규칙 제618조제1호, [별표 18] (18개 유형)",
      items: [
        { h: "맨홀·관로", d: "오수·빗물·통신 맨홀과 그 안의 관" },
        { h: "정화조·집수조", d: "오수와 찌꺼기가 썩으며 가스가 생기는 곳" },
        { h: "탱크·반응기", d: "안에 들어가 청소·점검·도장하는 설비" },
        { h: "저장조·사일로", d: "곡물·사료·발효 원료를 담아 두는 곳" },
        { h: "지하 피트·암거", d: "바람이 통하지 않는 낮고 좁은 곳" },
        { h: "불활성가스 설비", d: "질소·아르곤 등이 들어 있던 탱크와 배관" },
      ],
      notes: "밀폐공간은 산소결핍이나 유해가스로 질식·화재·폭발 위험이 있는 장소로, 규칙 별표 18에 18가지 유형이 정해져 있습니다. 화면의 여섯 가지는 대표적인 예입니다. 여기서 우리 사업장의 밀폐공간이 어디인지 구체적으로 짚어 주세요. 평소 문제없이 드나들던 곳도 날씨, 내용물, 작업 내용에 따라 위험해질 수 있다는 점을 강조합니다." },
    { kind: "split", title: "보이지 않고, 냄새로도 알 수 없습니다", big: "산소가 모자란 공기는 색도 냄새도 없습니다", law: "산업안전보건기준에 관한 규칙 제618조",
      items: [
        { h: "산소결핍", d: "공기 중 산소 농도가 18% 미만인 상태입니다. 몸으로는 미리 알아챌 수 없습니다." },
        { h: "유해가스", d: "황화수소·일산화탄소·이산화탄소 같은 가스가 낮은 곳에 고여 있을 수 있습니다." },
        { h: "연쇄 사고", d: "쓰러진 동료를 구하러 들어간 사람이 함께 쓰러지는 일이 많습니다." },
      ],
      notes: "밀폐공간 사고가 무서운 이유는 위험을 감각으로 알 수 없기 때문입니다. '냄새가 안 나니 괜찮다', '방금 전까지 괜찮았다'는 판단은 통하지 않습니다. 그래서 측정기로 재는 것 말고는 확인할 방법이 없습니다. 구조하러 들어간 사람이 함께 쓰러지는 연쇄 사고가 많다는 점을 꼭 말해 주세요." },
    { kind: "stats", title: "적정공기, 이 숫자 안에서만 일합니다", law: "산업안전보건기준에 관한 규칙 제618조제3호",
      items: [
        { label: "산소 (O₂)", d: "18% 이상 23.5% 미만", big: "18~23.5%" },
        { label: "이산화탄소 (CO₂)", d: "1.5% 미만", big: "1.5%" },
        { label: "일산화탄소 (CO)", d: "30ppm 미만", big: "30ppm" },
        { label: "황화수소 (H₂S)", d: "10ppm 미만", big: "10ppm" },
      ],
      notes: "법이 정한 적정공기 기준입니다. 네 가지가 모두 기준 안에 있어야 적정공기입니다. 산소는 모자라도 안 되지만 23.5% 이상으로 많아도 안 됩니다. 측정값이 하나라도 기준을 벗어나면 환기하고 다시 측정합니다. 환기로 해결되지 않으면 공기호흡기나 송기마스크를 착용해야 합니다." },
    { kind: "rows", title: "들어가기 전 다섯 가지", law: "산업안전보건기준에 관한 규칙 제619조, 제619조의2, 제620조~제623조",
      items: [
        { h: "확인서를 쓰고 붙인다", d: "작업 정보, 측정 결과, 보호구, 비상연락을 적어 출입구에 게시" },
        { h: "농도를 잰다", d: "산소와 유해가스를 측정해 적정공기인지 평가" },
        { h: "환기한다", d: "작업을 시작하기 전과 작업하는 동안 계속" },
        { h: "감시인을 세운다", d: "밀폐공간 밖에 배치하고 언제든 연락할 수 있게" },
        { h: "인원을 센다", d: "들어갈 때와 나올 때마다 확인, 관계자 외 출입금지" },
      ],
      notes: "작업 전에 반드시 거치는 다섯 가지입니다. 하나라도 빠지면 들어가지 않습니다. 작업 전 확인서는 작업이 끝날 때까지 출입구에 붙여 둡니다. 자료실의 '밀폐공간 작업 점검표 세트'에 확인서, 측정 기록부, 인원 점검표가 들어 있으니 실제 양식을 보여 주며 설명하면 좋습니다." },
    { kind: "cards", cols: 3, big: true, title: "측정은 이렇게 합니다", law: "산업안전보건기준에 관한 규칙 제619조의2",
      items: [
        { mark: "누가", h: "지정된 측정자", d: "측정 지식과 실무 경험이 있는 사람을 측정자로 정하고 측정 장비를 지급합니다." },
        { mark: "언제", h: "시작 전, 재개 전", d: "작업을 시작하기 전에, 그리고 멈췄다가 다시 시작하기 전마다 잽니다." },
        { mark: "기록", h: "3년 보존", d: "측정자 이름, 일시와 장소, 결과를 적어 3년간 보존합니다." },
      ],
      notes: "측정은 아무나 하는 것이 아니라 지정된 측정자가 합니다. 점심을 먹고 돌아와 다시 들어갈 때도 측정해야 합니다. 쉬는 동안 공기 상태가 바뀔 수 있기 때문입니다. 공간이 깊거나 넓으면 위·가운데·아래와 여러 지점을 잽니다. 측정 기록은 3년간 보존해야 하며 2025년 12월 개정으로 명확해진 내용입니다." },
    { kind: "twoCol", title: "마스크가 아니라 공기를 가져갑니다", callout: "적정공기가 아니거나 환기가 어려우면 공기호흡기나 송기마스크를 착용합니다", law: "산업안전보건기준에 관한 규칙 제620조, 제624조, 제625조",
      bad: { h: "산소결핍에는 소용없습니다", items: ["방진마스크", "방독마스크", "일반 마스크, 젖은 수건"] },
      good: { h: "공기를 공급하는 보호구", items: ["공기호흡기", "송기마스크", "추락 우려가 있으면 안전대와 구명밧줄"] },
      notes: "가장 흔한 오해입니다. 방진마스크와 방독마스크는 먼지나 가스를 걸러 줄 뿐 산소를 만들어 주지 않습니다. 산소가 모자란 곳에서는 아무 효과가 없습니다. 환기가 어렵거나 적정공기가 아니면 공기를 직접 공급하는 공기호흡기나 송기마스크를 써야 합니다. 대피용 기구로 공기호흡기 또는 송기마스크, 사다리, 섬유로프도 갖춰 둡니다. 우리 사업장의 보관 위치를 알려 주세요." },
    { kind: "rows", numbered: false, title: "감시인은 밖에서 지킵니다", law: "산업안전보건기준에 관한 규칙 제623조",
      items: [
        { h: "자리를 지킨다", d: "작업이 끝날 때까지 밀폐공간 밖에서 작업 상황을 살핍니다" },
        { h: "연락을 유지한다", d: "안에 있는 작업자와 항상 연락할 수 있어야 합니다" },
        { h: "먼저 신고한다", d: "이상이 생기면 지체 없이 119에 신고하고 관리감독자에게 알립니다" },
        { h: "들어가지 않는다", d: "맨몸으로 구하러 들어가면 함께 쓰러집니다" },
      ],
      notes: "감시인은 '옆에 서 있는 사람'이 아니라 사고를 막는 마지막 장치입니다. 감시인이 자리를 비우면 작업도 멈춥니다. 이상이 생기면 직접 들어가지 말고 먼저 119에 신고합니다. 오늘 작업의 감시인이 누구인지, 연락 수단(무전기 등)이 무엇인지 이 자리에서 정해 주세요." },
    { kind: "rows", title: "사고가 났을 때", law: "산업안전보건기준에 관한 규칙 제639조, 제640조 (긴급 구조훈련은 6개월에 1회 이상)",
      items: [
        { h: "멈추고 나온다", d: "질식·화재·폭발 우려가 있으면 즉시 작업을 멈추고 대피" },
        { h: "119에 신고한다", d: "감시인이 먼저 신고하고 주변에 알립니다" },
        { h: "맨몸으로 들어가지 않는다", d: "공기호흡기나 송기마스크를 쓴 사람만 구조합니다" },
        { h: "다시 들어가기 전에", d: "적정공기가 확인될 때까지 출입을 막습니다" },
      ],
      notes: "사고가 나면 순서가 중요합니다. 대피, 신고, 그다음이 구조입니다. 동료가 쓰러진 것을 보면 본능적으로 뛰어들게 되는데, 그 순간이 두 번째 사고입니다. 그래서 평소에 구조훈련을 합니다. 법은 밀폐공간 작업 근로자에게 6개월에 1회 이상 비상연락체계 운영, 구조용 장비 사용, 공기호흡기·송기마스크 착용, 응급처치를 훈련하고 기록하도록 정하고 있습니다." },
    { kind: "twoCol", title: "하지 않을 일, 꼭 할 일",
      bad: { h: "하지 않습니다", items: ["\"잠깐이니까\" 하며 측정 없이 들어가기", "환기 장치를 끄고 작업하기", "감시인 없이 혼자 작업하기", "쓰러진 동료를 보고 바로 뛰어들기"] },
      good: { h: "꼭 합니다", items: ["들어가기 전에 농도 측정", "작업하는 동안 계속 환기", "감시인과 연락 유지", "이상하면 바로 나오기"] },
      notes: "지금까지의 내용을 행동으로 정리한 장입니다. 왼쪽 네 가지는 실제 사고에서 반복되는 모습입니다. 특히 '잠깐이니까', '늘 하던 일이니까'가 가장 위험합니다. 몸이 이상하거나 냄새가 나거나 측정기 경보가 울리면 이유를 따지지 말고 먼저 나오라고 말해 주세요." },
    { kind: "closing", title: "오늘의 약속",
      promises: ["측정하기 전에는 들어가지 않습니다", "감시인 없이는 들어가지 않습니다", "구하러 맨몸으로 들어가지 않습니다"],
      questions: ["우리 사업장의 밀폐공간은 어디입니까?", "가스 측정기와 공기호흡기는 어디에 있습니까?", "오늘 작업의 감시인은 누구입니까?"],
      notes: "세 가지 약속을 함께 소리 내어 읽고 마칩니다. 오른쪽 질문은 시험이 아니라 현장 확인용입니다. 참석자가 직접 답하게 하고, 답이 막히는 질문이 있으면 그 자리에서 알려 주세요. 교육이 끝나면 '안전보건교육 실시 기록 양식'에 참석자 서명을 받아 둡니다." },
    { kind: "refs", title: "근거와 함께 쓰는 자료",
      laws: ["산업안전보건기준에 관한 규칙 제618조~제641조, [별표 18] 밀폐공간", "산업안전보건법 시행규칙 [별표 5] 제1호 라목 제34호 (밀폐공간 작업 특별교육 내용)", "같은 규칙 [별표 4] (특별교육 시간)"],
      files: ["밀폐공간 작업 점검표 세트 (작업 전 확인서, 가스 측정 기록부 등 6종)", "밀폐공간 작업 프로그램 양식·예문", "안전보건교육 실시 기록 양식"],
      note: "밀폐공간에서의 작업은 특별교육 대상입니다. 교육시간(16시간 이상, 단기간·간헐적 작업은 2시간 이상 등)은 이 자료만으로 채워지지 않으며 사업장 교육계획에 따라 실시해야 합니다. 법령은 2026년 11월 20일 국가법령정보센터 현행본으로 확인했습니다.",
      notes: "교육 담당자용 참고 장입니다. 법정 특별교육 내용은 산소농도 측정 및 작업환경, 사고 시 응급처치와 비상 시 구출, 보호구 착용과 보호 장비 사용, 작업내용·안전작업방법 및 절차, 장비·설비 및 시설의 안전점검, 그 밖의 안전·보건관리 사항입니다. 이 자료는 그 내용을 설명하는 보조자료이며, 법정 교육시간은 사업장 계획에 따라 따로 채워야 합니다." },
  ],
};

// ───────────────────────── 2. 끼임 사고 예방 ─────────────────────────
const CAUGHT = {
  file: "edu-caught-in.pptx",
  title: "끼임 사고 예방 — 정비·청소 전 전원 차단",
  short: "끼임 사고 예방",
  theme: { name: "그린헬멧 안전", colors: { ...BASE, accent1: "B45309", accent2: "FFF4E5" } },
  slides: [
    { kind: "cover", title: "끼임 사고 예방", sub: "멈추고, 잠그고, 표시한 다음에 손을 넣습니다", meta: "기계 정비·청소 작업 교육자료 · 약 15분",
      notes: "[교육 안내] 컨베이어, 프레스, 혼합기, 포장기처럼 동력으로 움직이는 기계를 다루는 작업자 교육용입니다. 15분쯤 걸립니다. 우리 사업장 기계의 전원 차단 위치와 잠금장치 보관 장소를 미리 확인해 두고, 실제 기계를 예로 들어 설명해 주세요." },
    { kind: "cards", cols: 3, title: "끼임은 이런 작업에서 일어납니다", law: "산업안전보건기준에 관한 규칙 제92조제1항 (정비·청소·급유·검사·수리·교체·조정)",
      items: [
        { h: "정비·수리", d: "고장 난 곳을 고치려고 손을 넣을 때" },
        { h: "청소", d: "롤러나 벨트에 낀 이물질을 뗄 때" },
        { h: "급유·조정", d: "돌아가는 채로 기름을 치거나 맞출 때" },
        { h: "검사·점검", d: "덮개를 열고 안을 들여다볼 때" },
        { h: "부품 교체", d: "날, 금형, 벨트를 바꿀 때" },
        { h: "걸림 해소", d: "\"잠깐이면 된다\"며 걸린 물건을 뺄 때" },
      ],
      notes: "끼임 사고는 기계가 정상적으로 돌아가는 생산 중보다 정비, 청소, 걸림 해소처럼 평소와 다른 작업을 할 때 많이 일어납니다. 법도 이 일곱 가지 작업(정비·청소·급유·검사·수리·교체·조정)을 콕 집어 운전 정지를 요구합니다. 우리 현장에서 기계를 켠 채로 하는 작업이 무엇인지 참석자에게 물어보세요." },
    { kind: "split", title: "원칙은 하나입니다", big: "위험할 수 있으면 기계를 멈춥니다", law: "산업안전보건기준에 관한 규칙 제92조",
      items: [
        { h: "멈춘다", d: "정비·청소·급유·검사·수리·교체·조정을 할 때 위험해질 우려가 있으면 운전을 정지합니다." },
        { h: "못 켜게 한다", d: "다른 사람이 켜지 못하게 기동장치를 잠그고 열쇠를 따로 관리하거나 표지판을 답니다." },
        { h: "남은 힘을 뺀다", d: "압축된 공기나 유압이 남아 있으면 미리 빼냅니다." },
      ],
      notes: "규칙 제92조의 내용입니다. 제1항은 운전 정지, 제2항은 다른 사람이 기계를 켜지 못하게 하는 잠금장치와 표지판, 제4항은 기계 안에 남은 압축 기체·액체를 미리 방출하는 것입니다. 멈추기만 해서는 부족합니다. 내가 안에 손을 넣고 있는 줄 모르는 동료가 기계를 켜는 사고가 반복되기 때문입니다." },
    { kind: "rows", title: "손을 넣기 전 다섯 단계", law: "산업안전보건기준에 관한 규칙 제92조제1항·제2항·제4항 (5단계 확인은 현장 권장)",
      items: [
        { h: "멈춘다", d: "운전을 정지하고 완전히 설 때까지 기다립니다" },
        { h: "잠근다", d: "기동장치에 잠금장치를 하고 열쇠는 따로 관리합니다" },
        { h: "표시한다", d: "\"정비 중 — 조작 금지\" 표지판을 답니다" },
        { h: "남은 힘을 뺀다", d: "압축 공기와 유압처럼 남아 있는 힘을 미리 풉니다" },
        { h: "확인한다", d: "기동 버튼을 눌러 움직이지 않는지 봅니다" },
      ],
      notes: "현장에서 '잠금·표지(LOTO)'라고 부르는 절차입니다. 1~4단계는 법 조문에 있는 내용이고, 5단계의 기동 버튼 확인은 법 조문은 아니지만 잠금이 제대로 됐는지 보는 현장 권장 절차입니다. 관성으로 도는 부분이 완전히 멈출 때까지 기다리는 것도 중요합니다. 우리 기계의 차단 위치를 한 대씩 짚어 주세요." },
    { kind: "cards", cols: 3, big: true, title: "잠금과 표지, 이렇게 합니다", law: "산업안전보건기준에 관한 규칙 제92조제2항 (아래 세 가지는 현장 권장 방법)",
      items: [
        { h: "열쇠는 작업자가", d: "잠근 사람이 열쇠를 갖고 있어야 다른 사람이 켤 수 없습니다." },
        { h: "여럿이면 각자", d: "함께 작업하면 사람마다 자물쇠를 하나씩 겁니다." },
        { h: "푸는 것도 본인이", d: "작업이 끝나면 잠근 사람이 직접 풉니다." },
      ],
      notes: "법은 잠금장치를 하고 열쇠를 별도 관리하거나 표지판을 설치하는 등 필요한 방호 조치를 하라고 정합니다. 화면의 세 가지는 그것을 현장에서 지키는 방법입니다. 핵심은 '내 안전은 내 자물쇠로 지킨다'입니다. 교대 시간에 작업이 이어지면 다음 작업자가 자기 자물쇠를 건 뒤에 앞사람이 풉니다." },
    { kind: "split", title: "덮개와 방호장치는 떼지 않습니다", big: "덮개가 없으면 돌리지 않습니다", law: "산업안전보건기준에 관한 규칙 제87조, 제93조",
      items: [
        { h: "덮개와 울", d: "회전축, 기어, 풀리, 벨트, 체인처럼 말려들 수 있는 곳에는 덮개나 울을 설치합니다." },
        { h: "방호장치", d: "설치된 방호장치를 떼어 내거나 꺼 두지 않습니다." },
        { h: "수리한 뒤", d: "수리·조정하느라 뗐다면 끝나자마자 제자리에 달아 제 기능을 하게 합니다." },
      ],
      notes: "덮개와 방호장치는 사람이 실수해도 다치지 않게 하는 장치입니다. '작업이 불편해서', '자꾸 멈춰서' 떼어 두거나 센서를 가려 두는 일이 사고로 이어집니다. 방호장치는 수리·조정·교체 때만 뗄 수 있고, 끝나면 즉시 정상 기능을 하도록 해야 합니다. 덮개가 없거나 망가진 기계를 보면 바로 알려 달라고 말해 주세요." },
    { kind: "rows", title: "다시 켜기 전에", law: "산업안전보건기준에 관한 규칙 제89조 (운전 시작 전 조치)",
      items: [
        { h: "사람을 확인한다", d: "기계 안과 주변에 사람이 없는지 봅니다" },
        { h: "덮개를 닫는다", d: "뗐던 덮개와 방호장치를 제자리에 답니다" },
        { h: "신호한다", d: "정해 둔 신호 방법으로, 정해진 사람이 신호합니다" },
        { h: "본인이 푼다", d: "잠금장치와 표지판은 건 사람이 직접 풉니다" },
      ],
      notes: "작업을 마치고 기계를 다시 켜는 순간도 위험합니다. 법은 운전을 시작할 때 일정한 신호 방법과 신호할 사람을 정해 그 방법대로 신호하도록 합니다. 큰 설비나 긴 컨베이어처럼 반대편이 보이지 않는 기계는 특히 그렇습니다. 우리 현장의 신호 방법(호각, 경광등, 무전 등)을 확인해 주세요." },
    { kind: "cards", cols: 3, big: true, title: "옷차림도 방호입니다", law: "산업안전보건기준에 관한 규칙 제94조, 제95조 (세 번째는 현장 권장)",
      items: [
        { h: "작업모와 작업복", d: "머리카락이나 옷이 말려들 수 있으면 작업에 알맞은 작업모와 작업복을 착용합니다." },
        { h: "손에 맞는 장갑", d: "날·공작물·축이 회전하는 기계에서는 손에 밀착돼 말려들 위험이 없는 장갑을 씁니다." },
        { h: "늘어진 것 정리", d: "풀린 소매, 끈, 목걸이처럼 늘어진 것은 정리하고 작업합니다." },
      ],
      notes: "회전체는 헐렁한 옷, 긴 머리카락, 늘어진 끈을 순식간에 감아 들입니다. 법은 말려들 우려가 있으면 알맞은 작업모와 작업복을 착용하게 하고, 날·공작물·축이 회전하는 기계에서는 손에 밀착이 잘되는 장갑처럼 말려들 위험이 없는 장갑을 쓰게 합니다. 헐렁한 면장갑이 왜 위험한지 설명해 주세요." },
    { kind: "twoCol", title: "하지 않을 일, 꼭 할 일",
      bad: { h: "하지 않습니다", items: ["돌아가는 기계에 손 넣기", "덮개를 떼어 낸 채 가동하기", "남이 건 자물쇠와 표지 풀기", "확인 없이 기동 버튼 누르기"] },
      good: { h: "꼭 합니다", items: ["멈추고, 잠그고, 표시하기", "남은 압력 빼기", "켜기 전에 사람 확인과 신호", "이상하면 관리감독자에게 알리기"] },
      notes: "행동으로 정리한 장입니다. '금방 끝나니까 안 꺼도 된다'는 생각이 가장 위험합니다. 기계를 멈추면 생산이 늦어진다는 압박을 작업자 혼자 지지 않도록, 걸림이 자주 생기는 설비는 관리감독자에게 알려 근본 원인을 고치게 해 달라고 말해 주세요." },
    { kind: "closing", title: "오늘의 약속",
      promises: ["돌아가는 기계에는 손을 넣지 않습니다", "내 자물쇠는 내가 걸고 내가 풉니다", "덮개가 없으면 돌리지 않습니다"],
      questions: ["내가 쓰는 기계의 전원 차단 위치는 어디입니까?", "잠금장치와 표지판은 어디에 있습니까?", "압축 공기나 유압이 남는 설비는 어느 것입니까?"],
      notes: "세 가지 약속을 함께 읽고 마칩니다. 오른쪽 질문은 시험이 아니라 현장 확인용입니다. 참석자가 자기 기계를 기준으로 직접 답하게 하고, 모르는 것이 있으면 교육 뒤에 현장에서 같이 확인합니다. 교육이 끝나면 '안전보건교육 실시 기록 양식'에 참석자 서명을 받아 둡니다." },
    { kind: "refs", title: "근거와 함께 쓰는 자료",
      laws: ["산업안전보건기준에 관한 규칙 제87조 (원동기·회전축 등의 위험 방지)", "제89조 (운전 시작 전 조치), 제92조 (정비 등의 작업 시의 운전정지 등)", "제93조 (방호장치의 해체 금지), 제94조 (작업모 등의 착용), 제95조 (장갑의 사용 금지)"],
      files: ["컨베이어 작업시작 전 점검표", "프레스·전단기 작업시작 전 점검표", "TBM 일지 양식, 안전보건교육 실시 기록 양식"],
      note: "'현장 권장'이라고 적은 내용은 법 조문이 아니라 현장에서 널리 쓰는 잠금·표지 절차입니다. 사업장 작업 표준이 있으면 그 절차를 따릅니다. 법령은 2026년 11월 20일 국가법령정보센터 현행본(2026.3.2. 시행)으로 확인했습니다.",
      notes: "교육 담당자용 참고 장입니다. 기계별 전원 차단 위치, 잔류 압력 해소 방법, 잠금장치 종류를 정리한 설비별 절차서를 만들어 두면 이 교육과 함께 쓰기 좋습니다." },
  ],
};

// ───────────────────────── 3. 사업장 폐기물 분리·보관·배출 ─────────────────────────
const WASTE = {
  file: "edu-waste-handling.pptx",
  title: "사업장 폐기물 분리·보관·배출",
  short: "사업장 폐기물 분리·보관·배출",
  theme: { name: "그린헬멧 환경", colors: { ...BASE, accent1: "15803D", accent2: "E9F7EE" } },
  slides: [
    { kind: "cover", title: "사업장 폐기물 분리·보관·배출", sub: "구분해 담고, 표지를 붙이고, 기한 안에 내보냅니다", meta: "현장 작업자 환경 교육자료 · 약 15분",
      notes: "[교육 안내] 폐기물을 직접 담고 옮기는 현장 작업자 교육용입니다. 15분쯤 걸립니다. 우리 공정에서 나오는 폐기물 종류, 보관장 위치, 환경 담당자 연락처를 미리 정리해 두고 설명에 넣어 주세요." },
    { kind: "split", title: "폐기물은 내보낸 뒤에도 우리 책임입니다", big: "업체에 맡겼다고 끝이 아닙니다", law: "폐기물관리법 제17조제1항, 제48조제1항제3호",
      items: [
        { h: "배출자의 의무", d: "사업장에서 나오는 모든 폐기물을 법이 정한 기준과 방법에 맞게 처리해야 합니다." },
        { h: "위탁해도 남는 책임", d: "위탁 절차를 지키지 않았거나 귀책사유가 있으면 조치명령 대상이 될 수 있습니다." },
        { h: "시작은 현장", d: "제대로 구분해 담는 것이 신고, 계약, 전산 기록의 출발점입니다." },
      ],
      notes: "폐기물은 처리업체 트럭에 실려 나간다고 책임이 끝나지 않습니다. 맡긴 폐기물이 잘못 처리되면 배출한 사업장도 조치명령을 받을 수 있습니다. 그리고 그 모든 서류의 시작은 현장에서 무엇을 어떤 통에 담았느냐입니다. 섞여 담긴 폐기물은 서류를 아무리 잘 만들어도 맞출 수 없습니다." },
    { kind: "cards", cols: 2, title: "먼저 둘로 나눕니다", callout: "어느 쪽인지 모르겠으면 담기 전에 환경 담당자에게 물어봅니다", law: "폐기물관리법 시행규칙 [별표 5] 제4호나목1)",
      items: [
        { h: "지정폐기물", d: "폐유, 폐산, 폐알칼리, 폐유기용제처럼 환경을 오염시키거나 사람에게 해로울 수 있어 법으로 따로 정한 폐기물입니다. 다른 폐기물과 구분해 보관합니다." },
        { h: "사업장일반폐기물", d: "그 밖에 사업장에서 나오는 폐기물입니다. 종류별로 나눠 담고, 정해진 보관 장소에 둡니다." },
      ],
      notes: "사업장 폐기물은 크게 지정폐기물과 사업장일반폐기물로 나뉩니다. 지정폐기물은 지정폐기물 외의 폐기물과 구분해 보관해야 합니다. 여기서 우리 공정의 폐기물을 하나씩 짚으며 어느 쪽인지, 어느 통에 담는지 알려 주세요. 겉보기에 비슷해도 성분에 따라 지정폐기물이 될 수 있으니 모르면 먼저 묻는 것이 원칙입니다." },
    { kind: "stats", title: "보관할 수 있는 날은 정해져 있습니다", law: "폐기물관리법 시행규칙 [별표 5] 제3호다목3), 제4호나목6)",
      items: [
        { big: "45일", label: "지정폐기물 (일부)", d: "폐산, 폐알칼리, 폐유, 폐유기용제, 폐촉매, 폐흡착제, 폐흡수제, 폐농약, PCB 함유폐기물, 유기성 폐수처리 오니" },
        { big: "60일", label: "그 밖의 지정폐기물", d: "보관이 시작된 날부터 60일을 넘길 수 없습니다" },
        { big: "90일", label: "사업장일반폐기물", d: "중간가공 폐기물은 120일. 보관량이 5톤 미만인 경우 등은 제외됩니다" },
      ],
      notes: "폐기물은 보관을 시작한 날부터 정해진 기간 안에 내보내야 합니다. 그래서 통을 새로 쓰기 시작할 때 보관 시작일을 적는 것이 중요합니다. 1년간 배출하는 지정폐기물 총량이 3톤 미만인 사업장은 1년 안에서 보관할 수 있는 등 예외가 있으니, 우리 사업장에 적용되는 기한은 환경 담당자가 정리해 알려 주세요. 자료실의 '폐기물 관리 세트'에 만료일이 자동 계산되는 보관 현황표가 있습니다." },
    { kind: "cards", cols: 2, title: "이렇게 보관합니다", law: "폐기물관리법 시행규칙 [별표 5] 제4호나목2)·4)·5)",
      items: [
        { h: "맞는 용기에", d: "담는 폐기물에 부식되거나 깨지지 않는 재질의 용기를 씁니다." },
        { h: "뚜껑은 닫아서", d: "폐유기용제는 날아가지 않게 밀폐된 용기에 보관합니다." },
        { h: "바닥, 지붕, 벽", d: "바닥을 포장하고 지붕과 벽이 있는 보관창고에 둡니다." },
        { h: "새도 나가지 않게", d: "드럼이나 탱크에 보관할 때는 방류턱이나 방류벽 안에 둡니다." },
      ],
      notes: "지정폐기물 보관 기준의 핵심 네 가지입니다. 용기 재질, 밀폐, 보관창고의 바닥·지붕·벽, 그리고 새더라도 밖으로 흘러가지 않게 하는 방류턱입니다. 통 바깥에 폐기물이 묻어 있지 않게 하는 것도 기준에 들어 있습니다. 우리 보관장 사진을 보여 주며 잘된 점과 고칠 점을 이야기하면 좋습니다." },
    { kind: "sign", title: "보관표지를 붙입니다", law: "폐기물관리법 시행규칙 [별표 5] 제4호나목9)",
      items: [
        { h: "색", d: "노란색 바탕에 검은색 선과 검은색 글자" },
        { h: "크기", d: "보관창고는 가로 60cm × 세로 40cm 이상, 드럼 같은 용기는 가로 15cm × 세로 10cm 이상" },
        { h: "용기마다", d: "폐기물의 종류, 양, 배출업소를 알 수 있게 적습니다" },
      ],
      notes: "지정폐기물 보관창고에는 폐기물의 종류, 보관가능 용량, 관리책임자, 보관기간, 취급 시 주의사항, 운반(처리)예정장소를 적은 표지판을 사람이 쉽게 볼 수 있는 곳에 설치해야 합니다. 드럼 같은 용기에 보관할 때는 용기별로 종류·양·배출업소를 알 수 있게 적습니다. 표지 없는 통은 다음 사람이 내용물을 알 수 없어 섞임과 사고의 원인이 됩니다. 자료실의 '폐기물 관리 세트'에 표지 본이 들어 있습니다." },
    { kind: "rows", numbered: false, title: "섞지 않습니다", law: "폐기물관리법 시행규칙 [별표 5] 제4호나목1)·10), 폐기물관리법 제17조제1항제1호",
      items: [
        { h: "지정과 일반", d: "지정폐기물은 다른 폐기물과 구분해 보관합니다" },
        { h: "서로 반응하는 것", d: "종류가 다른 폐유독물질은 반응성을 따져 칸막이나 구획선으로 나눕니다" },
        { h: "처음 보는 폐기물", d: "원료나 공정이 바뀌어 새 폐기물이 나오면 먼저 환경 담당자에게 알립니다" },
      ],
      notes: "섞는 순간 문제가 커집니다. 일반폐기물에 지정폐기물이 섞이면 전체를 지정폐기물로 다뤄야 할 수 있고, 서로 반응하는 물질이 섞이면 열이나 가스가 생길 수 있습니다. 원료나 공정이 바뀌어 새로운 폐기물이 나오면 지정폐기물에 해당하는지 미리 확인해야 하므로, 현장에서 처음 보는 폐기물을 발견하면 임의로 기존 통에 담지 말고 먼저 알려야 합니다." },
    { kind: "rows", title: "내보낼 때", law: "폐기물관리법 제18조제3항, 같은 법 시행규칙 제16조의13",
      items: [
        { h: "업체와 품목 확인", d: "계약한 업체가, 계약한 폐기물을 가져가는지 봅니다" },
        { h: "무게를 잰다", d: "계근표를 받아 둡니다" },
        { h: "전산에 입력한다", d: "인계·인수 내용을 올바로 시스템에 입력합니다" },
        { h: "기록을 맞춘다", d: "올바로에 넣은 수량과 계근표가 같은지 확인합니다" },
      ],
      notes: "반출할 때의 순서입니다. 폐기물 위탁은 서면 계약을 맺은 업체에만 할 수 있고, 배출할 때마다 인계·인수 내용을 전자정보처리프로그램(올바로)에 입력해야 합니다. 현장 작업자는 '오늘 온 차량이 계약 업체가 맞는지', '실은 폐기물이 계약 품목이 맞는지'를 확인하는 첫 번째 사람입니다. 이상하면 싣기 전에 환경 담당자에게 연락합니다." },
    { kind: "twoCol", title: "현장에서 자주 보는 모습",
      bad: { h: "이렇게 두지 않습니다", items: ["표지 없는 드럼", "뚜껑이 열린 용기", "보관장 밖에 내놓은 폐기물", "기한을 넘긴 폐기물", "한 통에 섞어 담기"] },
      good: { h: "이렇게 둡니다", items: ["통마다 표지", "뚜껑은 닫고 방류턱 안에", "보관장 안, 정해진 자리에", "보관 시작일 적어 두기", "종류별로 따로"] },
      notes: "점검이나 감사에서 가장 자주 지적되는 모습과 올바른 모습을 나란히 놓았습니다. 왼쪽 다섯 가지는 대부분 '잠깐 두었다가 치우려던 것'에서 시작합니다. 교육 뒤에 참석자와 함께 보관장을 한 바퀴 돌며 이 다섯 가지를 찾아보면 효과가 좋습니다." },
    { kind: "rows", title: "샜을 때는 이렇게", law: "사업장 비상조치 절차가 있으면 그 절차를 따릅니다 (아래는 현장 권장 순서)",
      items: [
        { h: "사람부터", d: "가까이 가지 말고 주변 사람에게 알립니다" },
        { h: "퍼지지 않게", d: "흡착재나 모래로 둘러막습니다" },
        { h: "배수로를 막는다", d: "빗물 배수로로 흘러가지 않게 합니다" },
        { h: "알린다", d: "환경 담당자에게 바로 연락합니다" },
      ],
      notes: "폐유나 폐액이 샜을 때의 기본 순서입니다. 무엇이 샜는지 모르면 가까이 가지 않는 것이 먼저입니다. 빗물 배수로로 들어가면 사업장 밖으로 나가 큰 환경 사고가 되므로 배수로를 막는 것이 중요합니다. 흡착재와 방제 물품이 어디에 있는지, 누구에게 연락하는지 이 자리에서 알려 주세요. 닦아 낸 흡착재도 폐기물이므로 정해진 통에 담습니다." },
    { kind: "closing", title: "오늘의 약속",
      promises: ["표지 없는 통은 만들지 않습니다", "섞어 담지 않습니다", "모르는 폐기물은 먼저 묻습니다"],
      questions: ["우리 공정에서 나오는 지정폐기물은 무엇입니까?", "폐기물 보관장은 어디이고 표지는 붙어 있습니까?", "폐기물이 샜을 때 누구에게 연락합니까?"],
      notes: "세 가지 약속을 함께 읽고 마칩니다. 오른쪽 질문은 시험이 아니라 현장 확인용입니다. 참석자가 직접 답하게 하고, 답이 막히면 그 자리에서 알려 주세요. 교육 일시와 참석자를 기록해 두면 점검 때 증빙으로 쓸 수 있습니다." },
    { kind: "refs", title: "근거와 함께 쓰는 자료",
      laws: ["폐기물관리법 제17조 (사업장폐기물배출자의 의무 등), 제18조제3항, 제48조제1항제3호", "같은 법 시행규칙 제16조의13 (위탁·수탁의 기준 및 절차)", "같은 규칙 [별표 5] 제3호다목, 제4호나목 (2026.3.26. 개정)"],
      files: ["폐기물 관리 세트 (보관 현황표, 위탁 서류 대조표, 수탁업체 확인표, 보관표지)", "환경 일일 순찰 점검표", "이슈리포트 [감사관의 눈 ③] 폐기물 위탁"],
      note: "의료폐기물 등은 기준이 따로 있고, 1년간 배출하는 지정폐기물이 3톤 미만인 사업장의 보관 기간 등 예외가 있습니다. 우리 사업장에 적용되는 기준은 환경 담당자가 [별표 5] 원문으로 확인해 주세요. 법령은 2026년 11월 20일 국가법령정보센터 현행본으로 확인했습니다.",
      notes: "교육 담당자용 참고 장입니다. 이 자료는 지정폐기물과 사업장일반폐기물의 보관 기준 가운데 현장 작업자가 알아야 할 부분만 추렸습니다. 수집·운반, 처리 기준과 의료폐기물 기준은 다루지 않았습니다." },
  ],
};

(async () => {
  for (const deck of [CONFINED, CAUGHT, WASTE]) {
    const pres = build(deck);
    const file = path.join(OUT, deck.file);
    await pres.writeFile({ fileName: file });
    await applyTheme(file, deck.theme);
    console.log("ok", deck.file, deck.slides.length, "장");
  }
})();
