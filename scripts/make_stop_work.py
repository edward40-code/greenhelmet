# 작업중지 기록부 xlsx 생성기
# 출처: 산업안전보건법 제51조(사업주의 작업중지 등), 제52조(근로자의 작업중지), 제169조제3호
#       (법률 제22122호, 2026. 10. 27. 개정, 2027. 4. 28. 시행), 근로기준법 제28조
#       국가법령정보센터 2026-11-23 확인
# 법 조문에 없는 항목은 '현장 권장'으로 따로 적는다.
# 실행: python scripts/make_stop_work.py → public/library/checklist-stop-work.xlsx (그다음 plain_colors.py)
from openpyxl.styles import Alignment

from make_checklists import OUT, HEAD, CENTER, WRAP, f, setup, cell, boxrange
from make_loto import title, note, section, heads, NOTE, FOOT

RIGHT = Alignment(horizontal="right", vertical="bottom")


def label(ws, r, col, text):
    cell(ws, f"{col}{r}", text, f(9, True), HEAD, CENTER)


def blank(ws, rng):
    a = rng.split(":")[0]
    if ":" in rng:
        ws.merge_cells(rng)
    cell(ws, a, None)
    boxrange(ws, rng)


def checks(ws, r, rng, items, h=24):
    a = rng.split(":")[0]
    ws.merge_cells(rng)
    cell(ws, a, "   ".join(f"[ ] {x}" for x in items), f(9))
    boxrange(ws, rng)
    ws.row_dimensions[r].height = h


def sheet_record(ws):
    """1. 작업중지·요구 기록 (건마다 한 장, A4 세로)"""
    setup(ws)
    for col, w in zip("ABCDEF", [16, 18, 14, 16, 14, 16]):
        ws.column_dimensions[col].width = w
    title(ws, "F", "작업중지·요구 기록",
          "작업을 멈추거나 멈춰 달라는 요구가 있을 때 한 건마다 한 장씩 적습니다 (산업안전보건법 제51조·제52조, 2027. 4. 28. 시행 조문 기준).")
    r = 4
    section(ws, r, "F", "1. 언제, 어디서"); r += 1
    label(ws, r, "A", "일시"); blank(ws, f"B{r}:C{r}"); label(ws, r, "D", "기록 번호"); blank(ws, f"E{r}:F{r}")
    ws.row_dimensions[r].height = 24; r += 1
    label(ws, r, "A", "장소·설비"); blank(ws, f"B{r}:F{r}"); ws.row_dimensions[r].height = 24; r += 1
    label(ws, r, "A", "작업 내용"); blank(ws, f"B{r}:F{r}"); ws.row_dimensions[r].height = 24; r += 2

    section(ws, r, "F", "2. 무엇이 있었나"); r += 1
    label(ws, r, "A", "구분")
    ws.merge_cells(f"B{r}:F{r}")
    cell(ws, f"B{r}",
         "[ ] 근로자가 작업을 멈추고 대피함 (제52조제1항)\n"
         "[ ] 근로자등이 사업주에게 작업중지를 요구함 (제51조제2항)\n"
         "[ ] 하청 근로자등이 원청(도급인)에게 요구함 (제51조제3항)\n"
         "[ ] 사업주가 작업을 멈추게 함 (제51조제1항)", f(9))
    boxrange(ws, f"B{r}:F{r}"); ws.row_dimensions[r].height = 62; r += 1
    label(ws, r, "A", "멈춘 사람\n(요구한 사람)"); label(ws, r, "B", "성명"); blank(ws, f"C{r}:C{r}"); label(ws, r, "D", "소속"); blank(ws, f"E{r}:F{r}")
    ws.row_dimensions[r].height = 30; r += 1
    label(ws, r, "A", "요구한 사람 자격")
    checks(ws, r, f"B{r}:F{r}", ["근로자", "근로자대표", "명예산업안전감독관", "해당없음"]); r += 1
    label(ws, r, "A", "소속 회사")
    checks(ws, r, f"B{r}:F{r}", ["원청 (도급인)", "하청 (관계수급인)", "기타 (            )"]); r += 1
    label(ws, r, "A", "위험의 정도")
    checks(ws, r, f"B{r}:F{r}", ["급박한 위험이 있음", "급박한 위험이 우려됨", "안전·보건조치를 하지 않아 중대한 위험이 생길 수 있음"], 30); r += 1
    label(ws, r, "A", "위험 내용\n(본 것 그대로)"); blank(ws, f"B{r}:F{r}"); ws.row_dimensions[r].height = 54; r += 2

    section(ws, r, "F", "3. 보고와 조치"); r += 1
    label(ws, r, "A", "보고 받은 사람"); blank(ws, f"B{r}:C{r}"); label(ws, r, "D", "보고 시각"); blank(ws, f"E{r}:F{r}")
    ws.row_dimensions[r].height = 24; r += 1
    label(ws, r, "A", "조치 내용"); blank(ws, f"B{r}:F{r}"); ws.row_dimensions[r].height = 54; r += 1
    label(ws, r, "A", "조치한 사람"); blank(ws, f"B{r}:C{r}"); label(ws, r, "D", "조치 완료 시각"); blank(ws, f"E{r}:F{r}")
    ws.row_dimensions[r].height = 24; r += 2

    section(ws, r, "F", "4. 다시 시작할 때"); r += 1
    heads(ws, r, "ABCDEF", ["번호", "확인 내용", "", "", "근거", "확인"])
    ws.merge_cells(f"B{r}:D{r}"); r += 1
    items = [
        ("조치를 마치기 전에는 그 작업을 시키지 않았다", "제51조제4항\n제52조제3항"),
        ("조치가 끝난 것을 현장에서 직접 확인했다", "현장 권장"),
        ("작업을 멈춘 사람(요구한 사람)에게 조치 결과를 알렸다", "현장 권장"),
        ("(하청이 원청에 요구한 경우) 원청과 하청 관리감독자가 함께 확인했다", "현장 권장"),
    ]
    for i, (text, basis) in enumerate(items, 1):
        cell(ws, f"A{r}", i, align=CENTER)
        ws.merge_cells(f"B{r}:D{r}"); cell(ws, f"B{r}", text); boxrange(ws, f"B{r}:D{r}")
        cell(ws, f"E{r}", basis, f(8), align=CENTER)
        cell(ws, f"F{r}", "[ ]", align=CENTER)
        ws.row_dimensions[r].height = 34 if len(text) > 30 else 28; r += 1
    label(ws, r, "A", "재개 허락한 사람"); blank(ws, f"B{r}:C{r}"); label(ws, r, "D", "재개 시각"); blank(ws, f"E{r}:F{r}")
    ws.row_dimensions[r].height = 24; r += 2

    label(ws, r, "A", "멈춘 사람")
    ws.merge_cells(f"B{r}:C{r}"); cell(ws, f"B{r}", "(서명)", f(9), align=RIGHT); boxrange(ws, f"B{r}:C{r}")
    label(ws, r, "D", "관리감독자")
    ws.merge_cells(f"E{r}:F{r}"); cell(ws, f"E{r}", "(서명)", f(9), align=RIGHT); boxrange(ws, f"E{r}:F{r}")
    ws.row_dimensions[r].height = 30; r += 1
    label(ws, r, "A", "원청 확인\n(하청일 때)")
    ws.merge_cells(f"B{r}:C{r}"); cell(ws, f"B{r}", "(서명)", f(9), align=RIGHT); boxrange(ws, f"B{r}:C{r}")
    label(ws, r, "D", "안전관리자")
    ws.merge_cells(f"E{r}:F{r}"); cell(ws, f"E{r}", "(서명)", f(9), align=RIGHT); boxrange(ws, f"E{r}:F{r}")
    ws.row_dimensions[r].height = 30; r += 1
    note(ws, r, "F",
         "작업을 멈추거나 요구한 사람에게 해고나 그 밖의 불리한 처우를 해서는 안 됩니다 (제51조제5항, 제52조제4항). "
         "위반하면 3년 이하의 징역 또는 3천만 원 이하의 벌금 (제169조제3호). 2027. 4. 28. 전에는 '급박한 위험이 있는 경우'만 제52조의 작업중지 사유입니다. · " + FOOT,
         NOTE, 42)


def sheet_ledger(ws):
    """2. 작업중지 관리대장 (가로, 한 건에 한 줄)"""
    setup(ws, landscape=True)
    names = ["번호", "일시", "장소·설비", "구분", "멈춘 사람 (소속)", "위험 내용", "보고 받은 사람", "조치 내용", "조치 완료", "재개 시각", "재개 허락"]
    widths = [6, 12, 16, 12, 16, 24, 12, 24, 10, 10, 11]
    last = "K"
    title(ws, last, "작업중지 관리대장",
          "작업중지·요구 기록을 한 줄씩 모읍니다. 같은 위험이 반복되면 위험성평가에 반영합니다 (현장 권장).")
    for i, (h, w) in enumerate(zip(names, widths)):
        col = chr(ord("A") + i)
        ws.column_dimensions[col].width = w
        cell(ws, f"{col}4", h, f(9, True), HEAD, CENTER)
    ws.row_dimensions[4].height = 28
    for r in range(5, 23):
        for i in range(len(names)):
            cell(ws, f"{chr(ord('A') + i)}{r}", None, align=CENTER if i in (0, 1, 3, 8, 9, 10) else WRAP)
        ws.row_dimensions[r].height = 26
    note(ws, 24, last, "구분: 중지 (근로자가 멈춤, 제52조) / 요구 (사업주에게 요구, 제51조제2항) / 원청 요구 (하청이 원청에 요구, 제51조제3항) / 사업주 중지 (제51조제1항) · " + FOOT, NOTE, 26)


def sheet_notice(ws):
    """3. 현장 게시문 (A4 세로, 작업장에 붙이기)"""
    setup(ws)
    for col, w in zip("ABCD", [26, 24, 22, 24]):
        ws.column_dimensions[col].width = w
    ws.merge_cells("A1:D1")
    cell(ws, "A1", "위험하거나 위험할 것 같으면 멈추세요", f(22, True), align=CENTER, border=False)
    ws.row_dimensions[1].height = 46
    ws.merge_cells("A2:D2")
    cell(ws, "A2", "산업재해가 발생할 급박한 위험이 있거나 우려되면 작업을 멈추고 대피할 수 있습니다 (산업안전보건법 제52조제1항, 2027. 4. 28. 시행).",
         f(10), align=CENTER, border=False)
    ws.row_dimensions[2].height = 32
    r = 4
    section(ws, r, "D", "이렇게 합니다"); r += 1
    steps = [
        ("1. 멈추고 피합니다", "작업을 멈추고 안전한 곳으로 피합니다."),
        ("2. 바로 알립니다", "아래 관리감독자에게 바로 알립니다 (제52조제2항)."),
        ("3. 기다립니다", "조치가 끝날 때까지 그 작업을 다시 하지 않습니다 (제51조제4항, 제52조제3항)."),
        ("4. 확인 후 시작합니다", "조치가 끝난 것을 확인하고, 재개 허락을 받은 뒤 시작합니다."),
    ]
    for h, d in steps:
        cell(ws, f"A{r}", h, f(12, True), align=CENTER)
        ws.merge_cells(f"B{r}:D{r}"); cell(ws, f"B{r}", d, f(11)); boxrange(ws, f"B{r}:D{r}")
        ws.row_dimensions[r].height = 36; r += 1
    r += 1
    section(ws, r, "D", "알릴 사람"); r += 1
    heads(ws, r, "ABCD", ["구분", "성명", "연락처", "비고"]); r += 1
    for who in ["우리 회사 관리감독자", "원청 관리감독자", "안전관리자", "근로자대표·명예산업안전감독관"]:
        cell(ws, f"A{r}", who, f(10, True), align=CENTER)
        for col in "BCD":
            cell(ws, f"{col}{r}", None)
        ws.row_dimensions[r].height = 32; r += 1
    r += 1
    ws.merge_cells(f"A{r}:D{r}")
    cell(ws, f"A{r}", "작업을 멈췄다는 이유로 해고나 불리한 처우를 받지 않습니다", f(14, True), align=CENTER)
    boxrange(ws, f"A{r}:D{r}")
    ws.row_dimensions[r].height = 40; r += 1
    note(ws, r, "D",
         "불리한 처우 금지 (제51조제5항, 제52조제4항), 위반하면 3년 이하의 징역 또는 3천만 원 이하의 벌금 (제169조제3호). "
         "불리한 처우를 받으면 그날부터 3개월 이내에 노동위원회에 구제를 신청할 수 있습니다 (제52조제5항, 근로기준법 제28조). "
         "하청 근로자는 원청에도 작업중지를 요구할 수 있습니다 (제51조제3항). · " + FOOT,
         NOTE, 54)


def main():
    from openpyxl import Workbook
    wb = Workbook()
    wb.remove(wb.active)
    sheet_record(wb.create_sheet("1 작업중지·요구 기록"))
    sheet_ledger(wb.create_sheet("2 작업중지 관리대장"))
    sheet_notice(wb.create_sheet("3 현장 게시문"))
    for ws in wb.worksheets:
        ws.page_setup.fitToHeight = 1  # 시트마다 A4 한 장
    wb.properties.creator = "그린헬멧기사"
    p = OUT / "checklist-stop-work.xlsx"
    wb.save(p)
    print("ok", p.name)


if __name__ == "__main__":
    main()
