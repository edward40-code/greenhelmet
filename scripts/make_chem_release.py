# 화학물질 배출량조사 준비표 xlsx 생성기
# 출처 (국가법령정보센터 2026-11-25 확인):
#   화학물질관리법 제11조, 제11조의2, 제64조 (법률 제21531호, 2026. 10. 8. 시행)
#   같은 법 시행령 제6조 (대통령령 제36744호, 2026. 10. 8. 시행)
#   같은 법 시행규칙 제5조, 제5조의2 (기후에너지환경부령 제1호, 2025. 10. 1. 시행)
# 조사표 제출 기한은 매년 고시되는 조사계획에 따르므로 날짜를 적지 않는다.
# 법 조문에 없는 항목은 '현장 권장'으로 따로 적는다.
# 실행: python scripts/make_chem_release.py → public/library/chem-release-survey.xlsx (그다음 plain_colors.py)
from openpyxl.utils import get_column_letter
from make_checklists import OUT, HEAD, CENTER, WRAP, f, setup, cell, boxrange
from make_loto import title, note, section, heads, NOTE, FOOT
from make_risk_set import widths, label, blank, checks


def sheet_target(ws):
    setup(ws)
    widths(ws, "ABCDEFG", [6, 14, 46, 21, 9, 7, 10])
    title(ws, "G", "화학물질 배출량조사 대상과 일정 확인",
          "기후에너지환경부장관은 매년 대통령령으로 정하는 화학물질을 취급하는 사업장의 배출 현황을 조사합니다 (화학물질관리법 제11조제1항).")
    r = 4
    label(ws, r, "A", "연도"); blank(ws, f"B{r}:B{r}"); label(ws, r, "C", "사업장"); blank(ws, f"D{r}:G{r}")
    ws.row_dimensions[r].height = 24; r += 2
    section(ws, r, "G", "1. 조사 대상 화학물질을 취급하는지 확인 (시행령 제6조)"); r += 1
    r = checks(ws, r, "G", [
        ("유해화학물질", "영 제6조1호"),
        ("대기환경보전법 제2조제1호의 대기오염물질 중 화학물질", "영 제6조2호"),
        ("대기환경보전법 제2조제10호의 휘발성유기화합물", "영 제6조3호"),
        ("물환경보전법 제2조제7호의 수질오염물질 중 화학물질", "영 제6조4호"),
        ("국제기구 등이 지정한 발암성·생식독성·유전독성 물질 중 장관이 인정한 화학물질", "영 제6조5호"),
        ("조사 대상 업종·규모·지역은 해당 연도 조사계획(고시)에서 확인했다", "규칙 제5조①②"),
    ], "F", h=26)
    r += 1
    section(ws, r, "G", "2. 일정"); r += 1
    heads(ws, r, "ABCDEFG", ["번호", "시기", "할 일", "근거", "담당", "완료", "완료일"])
    r += 1
    rows = [
        ("연초", "올해 조사계획 고시에서 대상 물질·업종·규모, 조사표 작성·제출 방법을 확인", "규칙 제5조①②"),
        ("연초", "전년도 1~12월 물질별 취급량·배출량·이동량 집계 (2·3번 시트)", "현장 권장"),
        ("명령을 받으면", "자료 제출 명령에 따라 기한 내 제출 (미제출·거짓 1천만 원 이하 과태료)", "법 제11조②, 제64조①3"),
        ("수시", "배출량 산정은 실측 또는 투입량·배출량 비율을 고려한 산정계수 등으로 하고, 산정기준·계수는 고시를 따름", "규칙 제5조⑤⑥"),
        ("2년째 5월 31일", "배출저감계획서 대상이면 1톤 이상 배출한 해의 1월 1일 기준 2년이 되는 해의 5월 31일까지 제출 (이후 5년마다)", "법 제11조의2①, 규칙 제5조의2③"),
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
    section(ws, r, "G", "3. 배출저감계획서 대상인지 확인 (두 가지 모두 해당하면 대상)"); r += 1
    r = checks(ws, r, "G", [
        ("화학물질안전원장이 고시하는 화학물질 중 하나를 연간 1톤 이상 배출한다", "규칙 제5조의2①1"),
        ("종업원이 30명 이상이다", "규칙 제5조의2①2"),
    ], "F", h=24)
    note(ws, r, "G",
         "배출저감계획서를 내지 않거나 거짓으로 내면 1천만 원 이하, 수정·보완 요청을 받고 내지 않으면 300만 원 이하 과태료입니다 (법 제64조제1항제3호의2, 제2항제1호). "
         "폐기물처리업자가 다른 사업장에서 처리를 위탁받은 화학물질의 배출저감계획서 기한은 9월 30일입니다 (규칙 제5조의2제3항). · " + FOOT,
         NOTE, 40)


def sheet_tally(ws):
    setup(ws, landscape=True)
    names = ["번호", "화학물질명", "CAS 번호", "대상 구분", "연간 취급량", "대기", "수계", "토양", "배출 합계",
             "폐수 이동", "폐기물 이동", "산정 방법", "근거 자료"]
    cols = [get_column_letter(i + 1) for i in range(len(names))]
    widths(ws, cols, [5, 18, 12, 19, 10, 8, 8, 8, 9, 9, 9, 21, 18])
    last = cols[-1]
    title(ws, last, "물질별 취급량·배출량·이동량 집계표 (단위: kg/년)",
          "대기·수계·토양 배출량을 적으면 배출 합계가 계산됩니다. 조사표에 옮기기 전에 물질별로 맞춥니다 (현장 권장).")
    r = 4
    for col, h in zip(cols, names):
        cell(ws, f"{col}{r}", h, f(9, True), HEAD, CENTER)
    ws.row_dimensions[r].height = 28; r += 1
    for i in range(1, 16):
        cell(ws, f"A{r}", i, align=CENTER)
        for col in cols[1:]:
            cell(ws, f"{col}{r}", None, f(9), align=CENTER)
        cell(ws, f"D{r}", "유해 · 대기 · VOC · 수질", f(8), align=CENTER)
        cell(ws, f"I{r}", f'=IF(COUNT(F{r}:H{r})=0,"",SUM(F{r}:H{r}))', f(9, True), align=CENTER)
        cell(ws, f"L{r}", "실측 · 산정계수 · 물질수지", f(8), align=CENTER)
        ws.row_dimensions[r].height = 24; r += 1
    note(ws, r, last,
         "대상 구분은 시행령 제6조 해당 호를 남기고 지웁니다. 산정 방법은 시행규칙 제5조제5항(실측 또는 산정계수 등)과 고시를 따릅니다. "
         "이동량은 사업장 밖으로 폐수·폐기물로 보낸 양이며, 구분과 단위는 해당 연도 조사표 양식에 맞춥니다 (현장 권장). · " + FOOT,
         NOTE, 32)


def sheet_source(ws):
    setup(ws, landscape=True)
    names = ["번호", "배출원 (시설·공정)", "배출 경로", "해당 물질", "방지시설", "산정 방법", "근거 자료", "자료 위치", "확인"]
    cols = list("ABCDEFGHI")
    widths(ws, cols, [5, 22, 21, 20, 16, 16, 26, 16, 7])
    title(ws, "I", "배출원별 근거 자료 목록",
          "배출원마다 어떤 자료로 배출량을 산정했는지 남겨 두면 다음 해 조사와 자료 제출 명령에 바로 대응할 수 있습니다 (현장 권장).")
    r = 4
    for col, h in zip(cols, names):
        cell(ws, f"{col}{r}", h, f(9, True), HEAD, CENTER)
    ws.row_dimensions[r].height = 26; r += 1
    for i in range(1, 13):
        cell(ws, f"A{r}", i, align=CENTER)
        for col in cols[1:]:
            cell(ws, f"{col}{r}", None, f(9), align=CENTER)
        cell(ws, f"C{r}", "굴뚝 · 비산 · 폐수 · 폐기물", f(8), align=CENTER)
        cell(ws, f"I{r}", "[ ]", align=CENTER)
        ws.row_dimensions[r].height = 26; r += 1
    note(ws, r, "I",
         "근거 자료 예: 자가측정 기록, 원료 구매·사용 대장, 제품 생산량, 폐수 처리 기록, 폐기물 인계서(올바로), MSDS의 함유량 (현장 권장). "
         "배출저감계획서를 쓰는 사업장은 배출원과 연간 배출량, 향후 5년 저감 목표를 계획서에 넣어야 합니다 (시행규칙 제5조의2제2항). · " + FOOT,
         NOTE, 32)


def main():
    from openpyxl import Workbook
    wb = Workbook()
    wb.remove(wb.active)
    sheet_target(wb.create_sheet("1 대상·일정"))
    sheet_tally(wb.create_sheet("2 물질별 집계"))
    sheet_source(wb.create_sheet("3 배출원 근거"))
    for ws in wb.worksheets:
        ws.page_setup.fitToHeight = 1
    wb.properties.creator = "그린헬멧기사"
    p = OUT / "chem-release-survey.xlsx"
    wb.save(p)
    print("ok", p.name)


if __name__ == "__main__":
    main()
