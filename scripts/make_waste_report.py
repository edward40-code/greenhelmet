# 폐기물 처리실적 보고 준비표 xlsx 생성기
# 출처 (국가법령정보센터 2026-11-25 확인):
#   폐기물관리법 제17조, 제36조, 제38조, 제68조 (법률 제21129호, 2026. 11. 12. 시행)
#   같은 법 시행규칙 제18조, 제60조 (기후에너지환경부령 제70호, 2026. 11. 12. 시행)
# 법 조문에 없는 항목은 '현장 권장'으로 따로 적는다.
# 실행: python scripts/make_waste_report.py → public/library/waste-annual-report.xlsx (그다음 plain_colors.py)
from openpyxl.utils import get_column_letter
from make_checklists import OUT, HEAD, CENTER, WRAP, f, setup, cell, boxrange
from make_loto import title, note, section, heads, NOTE, FOOT
from make_risk_set import widths, label, blank, checks


def sheet_schedule(ws):
    setup(ws)
    widths(ws, "ABCDEFG", [6, 14, 46, 17, 9, 7, 10])
    title(ws, "G", "폐기물 처리실적 보고 일정과 대상 확인",
          "사업장폐기물배출자 신고를 한 자와 지정폐기물 처리 전 확인을 받은 자는 전년도 폐기물의 발생·처리에 관한 보고서를 2월 말일까지 제출합니다 (폐기물관리법 제38조제1항).")
    r = 4
    label(ws, r, "A", "연도"); blank(ws, f"B{r}:B{r}"); label(ws, r, "C", "사업장"); blank(ws, f"D{r}:G{r}")
    ws.row_dimensions[r].height = 24; r += 2
    section(ws, r, "G", "1. 일정"); r += 1
    heads(ws, r, "ABCDEFG", ["번호", "기한", "할 일", "근거", "담당", "완료", "완료일"])
    r += 1
    rows = [
        ("1월 초", "전년도 1~12월 발생·처리량을 장부·올바로 인계서와 맞춰 집계 (2·3번 시트)", "현장 권장"),
        ("1월 15일", "보고서를 내야 하는 처리업자 등이 위탁한 배출자에게 작성 자료를 서면으로 요구할 수 있는 기한", "법 제38조④"),
        ("1월 31일", "자료 요구를 받았다면 서면으로 제출 (미제출·거짓 100만 원 이하 과태료)", "법 제38조④, 제68조③9"),
        ("2월 말일", "폐기물배출 및 처리 실적보고서(별지 제49호서식)를 전자정보처리프로그램(올바로)으로 제출", "법 제38조①, 규칙 제60조①2"),
        ("배출 종료 후 15일", "건설공사 등으로 5톤 이상 배출해 신고한 자는 배출이 끝난 날부터 15일 이내 보고 (2개 연도에 걸치면 매 연도분은 다음 연도 2월 말까지)", "규칙 제60조②"),
    ]
    for i, (due, todo, basis) in enumerate(rows, 1):
        cell(ws, f"A{r}", i, align=CENTER)
        cell(ws, f"B{r}", due, f(9, True), align=CENTER)
        cell(ws, f"C{r}", todo, f(9))
        cell(ws, f"D{r}", basis, f(8), align=CENTER)
        cell(ws, f"E{r}", None, align=CENTER)
        cell(ws, f"F{r}", "[ ]", align=CENTER)
        cell(ws, f"G{r}", None, align=CENTER)
        ws.row_dimensions[r].height = 40; r += 1
    r += 1
    section(ws, r, "G", "2. 보고 대상인지 확인"); r += 1
    r = checks(ws, r, "G", [
        ("법 제17조제2항에 따라 사업장폐기물배출자 신고를 했다 (건설공사 등 5톤 이상 배출자는 위 5번 일정)", "법 제38조①2"),
        ("지정폐기물을 처리하기 전에 법 제17조제5항에 따른 확인을 받았다", "법 제38조①3"),
        ("신고 대상 확인: 배출시설 설치·운영 + 1일 평균 100kg 이상 / 영 제2조제1호~제5호 시설 + 1일 평균 100kg 이상 / 1일 평균 300kg 이상 / 공사·작업 등으로 5톤 이상 / 공동처리 운영기구 대표자", "규칙 제18조①"),
        ("중간가공 폐기물을 배출한다 (보고 대상에 포함)", "규칙 제60조①2"),
    ], "F", h=40)
    note(ws, r, "G",
         "보고서를 기한까지 내지 않거나 거짓으로 내면 100만 원 이하 과태료, 지정폐기물 확인을 받은 자는 300만 원 이하 과태료입니다 (법 제68조제3항제8호, 제2항제9호의2). "
         "장부는 마지막 기록일부터 3년 보존하되 올바로를 이용하면 예외입니다 (법 제36조제1항). · " + FOOT,
         NOTE, 40)


def sheet_tally(ws):
    setup(ws, landscape=True)
    months = [f"{m}월" for m in range(1, 13)]
    names = ["번호", "폐기물 종류", "구분", "단위"] + months + ["합계", "처리 방법", "수탁업체", "올바로 합계", "차이"]
    cols = [get_column_letter(i + 1) for i in range(len(names))]
    widths(ws, cols, [5, 18, 8, 6] + [6] * 12 + [9, 10, 14, 10, 8])
    last = cols[-1]
    title(ws, last, "폐기물 종류별 연간 발생·처리 집계표",
          "월별 발생량을 적으면 합계와 올바로 인계량과의 차이가 계산됩니다. 보고서 작성 전에 차이를 먼저 찾아 맞춥니다 (현장 권장).")
    r = 4
    for col, h in zip(cols, names):
        cell(ws, f"{col}{r}", h, f(9, True), HEAD, CENTER)
    ws.row_dimensions[r].height = 26; r += 1
    m0, m1 = cols[4], cols[15]
    tot, ol, diff = cols[16], cols[19], cols[20]
    for i in range(1, 16):
        cell(ws, f"A{r}", i, align=CENTER)
        cell(ws, f"B{r}", None, f(9))
        cell(ws, f"C{r}", "일반 · 지정", f(8), align=CENTER)
        cell(ws, f"D{r}", "톤", f(8), align=CENTER)
        for col in cols[4:16]:
            cell(ws, f"{col}{r}", None, f(9), align=CENTER)
        cell(ws, f"{tot}{r}", f'=IF(COUNT({m0}{r}:{m1}{r})=0,"",SUM({m0}{r}:{m1}{r}))', f(9, True), align=CENTER)
        cell(ws, f"{cols[17]}{r}", "위탁 · 자가", f(8), align=CENTER)
        cell(ws, f"{cols[18]}{r}", None, f(9))
        cell(ws, f"{ol}{r}", None, f(9), align=CENTER)
        cell(ws, f"{diff}{r}", f'=IF(OR({tot}{r}="",{ol}{r}=""),"",{tot}{r}-{ol}{r})', f(9), align=CENTER)
        ws.row_dimensions[r].height = 22; r += 1
    note(ws, r, last,
         "구분은 사업장일반폐기물·지정폐기물 중 하나를 남기고 지웁니다. 차이가 0이 아니면 인계서 미확정, 단위 환산(kg·톤), 월 경계 배출을 먼저 확인합니다 (현장 권장). · " + FOOT,
         NOTE, 30)


def sheet_vendor(ws):
    setup(ws, landscape=True)
    names = ["번호", "수탁업체", "업종", "허가·신고번호", "계약 기간", "계약서 보관", "위탁 폐기물", "우리 장부(톤)", "올바로 확정(톤)", "업체 자료(톤)", "차이", "확인"]
    cols = [get_column_letter(i + 1) for i in range(len(names))]
    widths(ws, cols, [5, 16, 21, 14, 15, 9, 16, 11, 12, 11, 8, 7])
    last = cols[-1]
    title(ws, last, "수탁업체별 위탁량 대조표",
          "수탁업체별로 우리 장부, 올바로 확정량, 업체가 보낸 자료를 나란히 놓고 맞춥니다 (현장 권장).")
    r = 4
    for col, h in zip(cols, names):
        cell(ws, f"{col}{r}", h, f(9, True), HEAD, CENTER)
    ws.row_dimensions[r].height = 28; r += 1
    for i in range(1, 13):
        cell(ws, f"A{r}", i, align=CENTER)
        for col in cols[1:]:
            cell(ws, f"{col}{r}", None, f(9), align=CENTER)
        cell(ws, f"C{r}", "수집·운반 · 처분 · 재활용", f(8), align=CENTER)
        cell(ws, f"F{r}", "[ ]", align=CENTER)
        cell(ws, f"K{r}", f'=IF(OR(H{r}="",I{r}=""),"",H{r}-I{r})', f(9), align=CENTER)
        cell(ws, f"L{r}", "[ ]", align=CENTER)
        ws.row_dimensions[r].height = 24; r += 1
    note(ws, r, last,
         "업체 자료 칸은 수탁업체가 1월 15일까지 서면으로 요구한 자료를 1월 31일까지 주고받을 때 함께 적습니다 (법 제38조제4항). "
         "허가 범위와 처리 능력은 위탁 전에 확인하고, 업종이 수집·운반뿐인 업체만 있으면 최종 처리업체까지 따라가 봅니다 (현장 권장). · " + FOOT,
         NOTE, 32)


def main():
    from openpyxl import Workbook
    wb = Workbook()
    wb.remove(wb.active)
    sheet_schedule(wb.create_sheet("1 일정·대상"))
    sheet_tally(wb.create_sheet("2 연간 집계"))
    sheet_vendor(wb.create_sheet("3 수탁업체 대조"))
    for ws in wb.worksheets:
        ws.page_setup.fitToHeight = 1
    wb.properties.creator = "그린헬멧기사"
    p = OUT / "waste-annual-report.xlsx"
    wb.save(p)
    print("ok", p.name)


if __name__ == "__main__":
    main()
