# 법정 점검표 xlsx 생성기
# 점검 항목은 법령 원문 그대로 옮긴다. 출처:
#  - 산업안전보건기준에 관한 규칙 [별표 3] 작업시작 전 점검사항(제35조제2항 관련)
#    (고용노동부령 제450호, 2026.3.2. 시행본에 붙은 별표, 국가법령정보센터 2026-11-19 확인)
#  - 소방시설 자체점검사항 등에 관한 고시 [별지 제6호서식] 소방시설등 외관점검표
#    (소방청고시 제2022-71호, 국가법령정보센터 2026-11-19 확인)
# 실행: python scripts/make_checklists.py  → public/library/*.xlsx
import json, sys
from pathlib import Path
from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.worksheet.page import PageMargins

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "library"
DATA = json.loads((Path(__file__).with_name("checklists.json")).read_text(encoding="utf-8"))

FONT = "맑은 고딕"
HEAD = PatternFill("solid", fgColor="E8F3EC")
thin = Side(style="thin", color="7A8A82")
BOX = Border(left=thin, right=thin, top=thin, bottom=thin)
WRAP = Alignment(wrap_text=True, vertical="center")
CENTER = Alignment(horizontal="center", vertical="center", wrap_text=True)


def f(sz=10, b=False, color="000000"):
    return Font(name=FONT, size=sz, bold=b, color=color)


def setup(ws, landscape=False):
    ws.page_setup.paperSize = ws.PAPERSIZE_A4
    ws.page_setup.orientation = "landscape" if landscape else "portrait"
    ws.page_setup.fitToWidth = 1
    ws.page_setup.fitToHeight = 0
    ws.sheet_properties.pageSetUpPr.fitToPage = True
    ws.page_margins = PageMargins(left=0.5, right=0.5, top=0.6, bottom=0.6)
    ws.print_options.horizontalCentered = True
    ws.sheet_view.showGridLines = False


def cell(ws, ref, v, font=None, fill=None, align=WRAP, border=True):
    c = ws[ref]
    c.value = v
    c.font = font or f()
    c.alignment = align
    if fill:
        c.fill = fill
    if border:
        c.border = BOX
    return c


def boxrange(ws, rng):
    for row in ws[rng]:
        for c in row:
            c.border = BOX


def work_sheet(ws, w):
    """작업시작 전 점검표 한 장 (A4 세로). 열: 번호 | 점검 내용 | 양호 | 불량 | 해당없음 | 조치 내용"""
    setup(ws)
    for col, width in zip("ABCDEF", [12, 42, 7, 7, 8, 22]):
        ws.column_dimensions[col].width = width
    ws.merge_cells("A1:F1")
    cell(ws, "A1", f"{w['title']} 작업시작 전 점검표", f(16, True), align=CENTER, border=False)
    ws.row_dimensions[1].height = 30
    ws.merge_cells("A2:F2")
    cell(ws, "A2", f"대상 작업: {w['work']}", f(9, color="4A5A63"), align=CENTER, border=False)
    ws.row_dimensions[2].height = 28

    r = 4
    for label in ["점검 일시", w.get("idLabel", "장비명·관리번호"), "작업 장소", "관리감독자"]:
        cell(ws, f"A{r}", label, f(10, True), HEAD, CENTER)
        ws.merge_cells(f"B{r}:F{r}")
        boxrange(ws, f"B{r}:F{r}")
        ws.row_dimensions[r].height = 28
        r += 1

    r += 1
    for col, h in zip("ABCDEF", ["번호", "점검 내용 (법정 항목)", "양호", "불량", "해당없음", "조치 내용"]):
        cell(ws, f"{col}{r}", h, f(10, True), HEAD, CENTER)
    ws.row_dimensions[r].height = 22
    r += 1
    for i, item in enumerate(w["items"], 1):
        cell(ws, f"A{r}", i, align=CENTER)
        cell(ws, f"B{r}", item)
        for col in "CDEF":
            cell(ws, f"{col}{r}", None, align=CENTER)
        ws.row_dimensions[r].height = max(26, 15 * (len(item) // 30 + 1) + 6)
        r += 1

    # 자율 추가 항목
    cell(ws, f"A{r}", "추가", f(10, True), HEAD, CENTER)
    ws.merge_cells(f"B{r}:F{r}")
    cell(ws, f"B{r}", "아래 칸은 법정 항목 외에 사업장이 스스로 정하는 점검 항목입니다 (제조사 취급설명서·위험성평가 결과 반영).", f(9, color="4A5A63"))
    boxrange(ws, f"B{r}:F{r}")
    r += 1
    for _ in range(4):
        cell(ws, f"A{r}", None, align=CENTER)
        for col in "BCDEF":
            cell(ws, f"{col}{r}", None, align=CENTER)
        ws.row_dimensions[r].height = 24
        r += 1

    r += 1
    ws.merge_cells(f"A{r}:F{r}")
    cell(ws, f"A{r}", "점검 결과 이상이 발견되면 즉시 수리하거나 그 밖에 필요한 조치를 해야 합니다 (산업안전보건기준에 관한 규칙 제35조제3항). 조치 전에는 사용하지 마세요.",
         f(9, True, "B3261E"), border=False)
    ws.row_dimensions[r].height = 30
    r += 2
    for label in ["점검자", "관리감독자 확인"]:
        cell(ws, f"A{r}", None, border=False)
        ws.merge_cells(f"C{r}:D{r}")
        cell(ws, f"C{r}", label, f(10, True), HEAD, CENTER)
        boxrange(ws, f"C{r}:D{r}")
        ws.merge_cells(f"E{r}:F{r}")
        cell(ws, f"E{r}", "(서명)", align=Alignment(horizontal="right", vertical="center"))
        boxrange(ws, f"E{r}:F{r}")
        ws.row_dimensions[r].height = 26
        r += 1
    r += 1
    ws.merge_cells(f"A{r}:F{r}")
    cell(ws, f"A{r}", f"근거: 산업안전보건기준에 관한 규칙 제35조제2항, [별표 3] 제{w['no']}호 ({w['part']}). 점검 내용은 별표 원문을 옮겼습니다. 법령이 바뀌면 국가법령정보센터 현행본을 확인하세요. · 서식 제공: 그린헬멧기사",
         f(8, color="4A5A63"), border=False)
    ws.row_dimensions[r].height = 36


def write_work(path, works, cover=None):
    wb = Workbook()
    wb.remove(wb.active)
    if cover:
        ws = wb.create_sheet("목차")
        setup(ws)
        ws.column_dimensions["A"].width = 11
        ws.column_dimensions["B"].width = 40
        ws.column_dimensions["C"].width = 34
        ws.merge_cells("A1:C1")
        cell(ws, "A1", cover, f(16, True), align=CENTER, border=False)
        ws.row_dimensions[1].height = 30
        ws.merge_cells("A2:C2")
        cell(ws, "A2", "산업안전보건기준에 관한 규칙 [별표 3] 작업시작 전 점검사항(제35조제2항 관련)의 작업별 점검표입니다. 시트 이름을 눌러 해당 점검표로 이동하세요.", f(9, color="4A5A63"), border=False)
        ws.row_dimensions[2].height = 30
        for col, h in zip("ABC", ["별표 3", "작업", "시트"]):
            cell(ws, f"{col}4", h, f(10, True), HEAD, CENTER)
        for i, w in enumerate(works, 5):
            cell(ws, f"A{i}", f"제{w['no']}호", align=CENTER)
            cell(ws, f"B{i}", w["title"])
            c = cell(ws, f"C{i}", w["sheet"], f(10, color="1F5FA8"))
            c.hyperlink = f"#'{w['sheet']}'!A1"
            ws.row_dimensions[i].height = 20
    for w in works:
        work_sheet(wb.create_sheet(w["sheet"]), w)
    wb.properties.creator = "그린헬멧기사"
    wb.save(path)


def fire_sheet(ws, sec, year_note=True):
    """소방시설등 외관점검표 한 섹션 (A4 가로). 열: 구분 | 점검 내용 | 1~12월"""
    setup(ws, landscape=True)
    ws.column_dimensions["A"].width = 18
    ws.column_dimensions["B"].width = 50
    months = [chr(ord("C") + i) for i in range(12)]
    for col in months:
        ws.column_dimensions[col].width = 5.2
    last = months[-1]
    ws.merge_cells(f"A1:{last}1")
    cell(ws, "A1", sec["title"], f(15, True), align=CENTER, border=False)
    ws.row_dimensions[1].height = 28
    ws.merge_cells(f"A2:{last}2")
    cell(ws, "A2", "대상물:                         점검자:                         확인자:                         (        년도)", f(10), align=Alignment(vertical="center"), border=False)
    ws.row_dimensions[2].height = 22
    cell(ws, "A4", "구분", f(10, True), HEAD, CENTER)
    cell(ws, "B4", "점검 내용", f(10, True), HEAD, CENTER)
    for i, col in enumerate(months, 1):
        cell(ws, f"{col}4", f"{i}월", f(9, True), HEAD, CENTER)
    r = 5
    for grp in sec["groups"]:
        start = r
        for item in grp["items"]:
            cell(ws, f"B{r}", item)
            for col in months:
                cell(ws, f"{col}{r}", None, align=CENTER)
            ws.row_dimensions[r].height = max(24, 15 * (len(item) // 34 + 1) + 6)
            r += 1
        cell(ws, f"A{start}", grp["name"], f(10, True), align=CENTER)
        if r - 1 > start:
            ws.merge_cells(f"A{start}:A{r-1}")
            boxrange(ws, f"A{start}:A{r-1}")
    r += 1
    ws.merge_cells(f"A{r}:{last}{r}")
    cell(ws, f"A{r}", "※ 점검결과란은 양호 \"○\", 불량 \"×\", 해당없는 항목은 \"/\"로 표시합니다.", f(9, True), border=False)
    r += 1
    ws.merge_cells(f"A{r}:{last}{r}")
    cell(ws, f"A{r}", "근거: 소방시설 자체점검사항 등에 관한 고시 [별지 제6호서식] 소방시설등 외관점검표의 점검 내용을 옮겼습니다. 공공기관은 외관점검 때 이 서식을 사용해야 합니다(같은 고시 제7조). · 서식 제공: 그린헬멧기사",
         f(8, color="4A5A63"), border=False)
    ws.row_dimensions[r].height = 30


def write_fire(path, secs, extra_ledger=False):
    wb = Workbook()
    wb.remove(wb.active)
    for s in secs:
        fire_sheet(wb.create_sheet(s["sheet"]), s)
    if extra_ledger:
        ws = wb.create_sheet("소화기 관리대장")
        setup(ws, landscape=True)
        heads = ["번호", "설치 위치(층·구역)", "종류", "용량·능력단위", "제조 연월", "내용연수 만료", "압력계", "비고"]
        widths = [6, 28, 14, 14, 12, 14, 10, 24]
        ws.merge_cells("A1:H1")
        cell(ws, "A1", "소화기 관리대장", f(15, True), align=CENTER, border=False)
        ws.row_dimensions[1].height = 28
        ws.merge_cells("A2:H2")
        cell(ws, "A2", "설치된 소화기를 한 줄에 하나씩 적습니다. 분말소화기 내용연수 10년은 외관점검표의 점검 항목(수동식 분말소화기 내용연수(10년) 적정 여부)에 따른 것입니다. 제조 연월은 소화기 몸통 표시를 보고 적으세요.",
             f(9, color="4A5A63"), border=False)
        ws.row_dimensions[2].height = 30
        for i, (h, w) in enumerate(zip(heads, widths)):
            col = chr(ord("A") + i)
            ws.column_dimensions[col].width = w
            cell(ws, f"{col}4", h, f(10, True), HEAD, CENTER)
        for r in range(5, 35):
            cell(ws, f"A{r}", r - 4, align=CENTER)
            for col in "BCDEFGH":
                cell(ws, f"{col}{r}", None, align=CENTER)
            ws.row_dimensions[r].height = 20
    wb.properties.creator = "그린헬멧기사"
    wb.save(path)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    works = DATA["work"]
    by = {w["key"]: w for w in works}
    for key in DATA["singleWork"]:
        w = by[key]
        write_work(OUT / f"checklist-{key}.xlsx", [w])
        print("ok", f"checklist-{key}.xlsx")
    write_work(OUT / "checklist-work-start-all.xlsx", works, cover="작업시작 전 점검표 모음")
    print("ok checklist-work-start-all.xlsx", len(works), "sheets")

    secs = DATA["fire"]
    write_fire(OUT / "checklist-fire-extinguisher.xlsx", [s for s in secs if s["key"] in ("extinguisher", "etc")], extra_ledger=True)
    print("ok checklist-fire-extinguisher.xlsx")
    write_fire(OUT / "checklist-fire-monthly.xlsx", secs)
    print("ok checklist-fire-monthly.xlsx", len(secs), "sheets")


if __name__ == "__main__":
    main()
