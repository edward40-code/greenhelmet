# 위험물 제조소등 정기점검 관리 세트 xlsx 생성기
# 출처 (국가법령정보센터 2026-11-25 확인):
#   위험물안전관리법 제15조, 제17조, 제18조, 제39조 (법률 제20231호, 2025. 8. 7. 시행)
#   같은 법 시행령 제15조~제17조 (대통령령 제36432호, 2026. 7. 1. 시행)
#   같은 법 시행규칙 제55조, 제64조~제68조 (행정안전부령 제628호, 2026. 7. 1. 시행)
# 점검 내용·방법의 기술기준은 소방청 고시(시행규칙 제66조)를 따르도록 적는다.
# 실행: python scripts/make_hazmat.py → public/library/hazmat-periodic-check.xlsx (그다음 plain_colors.py)
from make_checklists import OUT, HEAD, CENTER, WRAP, f, setup, cell, boxrange
from make_loto import title, note, section, heads, NOTE, FOOT
from make_risk_set import widths, label, blank, checks


def sheet_target(ws):
    setup(ws)
    widths(ws, "ABCDEFG", [6, 17, 44, 18, 9, 7, 10])
    title(ws, "G", "위험물 정기점검 대상과 일정 확인",
          "대통령령으로 정하는 제조소등의 관계인은 기술기준에 맞는지 정기적으로 점검하고 결과를 기록·보존합니다 (위험물안전관리법 제18조제1항).")
    r = 4
    label(ws, r, "A", "연도"); blank(ws, f"B{r}:B{r}"); label(ws, r, "C", "사업장"); blank(ws, f"D{r}:G{r}")
    ws.row_dimensions[r].height = 24; r += 2
    section(ws, r, "G", "1. 정기점검 대상인지 확인 (시행령 제16조)"); r += 1
    r = checks(ws, r, "G", [
        ("지정수량 10배 이상 취급 제조소", "영 제15조①1"),
        ("지정수량 100배 이상 저장 옥외저장소", "영 제15조①2"),
        ("지정수량 150배 이상 저장 옥내저장소", "영 제15조①3"),
        ("지정수량 200배 이상 저장 옥외탱크저장소", "영 제15조①4"),
        ("암반탱크저장소, 이송취급소", "영 제15조①5·6"),
        ("지정수량 10배 이상 취급 일반취급소 (영 제15조제1항제7호 단서의 일반취급소는 제외)", "영 제15조①7"),
        ("지하탱크저장소, 이동탱크저장소", "영 제16조2·3"),
        ("지하에 매설된 탱크가 있는 제조소·주유취급소·일반취급소", "영 제16조4"),
        ("(정기검사) 액체위험물 50만 리터 이상 옥외탱크저장소", "영 제17조"),
    ], "F", h=24)
    r += 1
    section(ws, r, "G", "2. 일정"); r += 1
    heads(ws, r, "ABCDEFG", ["번호", "주기·기한", "할 일", "근거", "담당", "완료", "완료일"])
    r += 1
    rows = [
        ("연 1회 이상", "제조소등마다 정기점검 실시 (안전관리자, 이동탱크는 위험물운송자, 또는 대행기관·탱크시험자에 의뢰)", "규칙 제64조, 제67조"),
        ("점검일부터 30일", "점검결과를 시·도지사에게 제출", "법 제18조②"),
        ("점검 후", "명칭, 점검 방법·결과, 점검연월일, 점검자(참관 안전관리자) 성명을 기록하고 3년 보존", "규칙 제68조"),
        ("12년·11년·13년 이내", "50만 리터 이상 옥외탱크저장소 구조안전점검 (기록 25년, 연장 시 30년 보존)", "규칙 제65조①, 제68조②1"),
        ("해임·퇴직 후 30일", "안전관리자 다시 선임, 선임한 날부터 14일 이내 소방서에 신고", "법 제15조②③"),
        ("수시", "안전관리자 부재 시 대리자 지정 (대행 기간 30일 이내)", "법 제15조⑤"),
        ("변경 시", "예방규정 대상이면 예방규정을 바꿀 때 시·도지사에게 다시 제출", "법 제17조①"),
    ]
    for i, (due, todo, basis) in enumerate(rows, 1):
        cell(ws, f"A{r}", i, align=CENTER)
        cell(ws, f"B{r}", due, f(9, True), align=CENTER)
        cell(ws, f"C{r}", todo, f(9))
        cell(ws, f"D{r}", basis, f(8), align=CENTER)
        cell(ws, f"E{r}", None, align=CENTER)
        cell(ws, f"F{r}", "[ ]", align=CENTER)
        cell(ws, f"G{r}", None, align=CENTER)
        ws.row_dimensions[r].height = 36; r += 1
    note(ws, r, "G",
         "점검결과를 기록·보존하지 않거나 기간 내 제출하지 않으면 500만 원 이하 과태료입니다 (법 제39조제1항제7호·제7호의2). 안전관리자 선임신고 지연·허위도 500만 원 이하입니다 (같은 항 제5호). · " + FOOT,
         NOTE, 36)


def sheet_ledger(ws):
    setup(ws, landscape=True)
    names = ["번호", "제조소등 명칭", "구분", "허가번호", "지정수량\n배수", "점검 실시자", "점검일", "결과 제출일\n(30일 이내)",
             "다음 점검 예정", "정기검사\n대상", "안전관리자"]
    cols = list("ABCDEFGHIJK")
    widths(ws, cols, [5, 20, 16, 13, 12, 27, 11, 12, 12, 10, 11])
    title(ws, "K", "제조소등 목록·정기점검 관리대장",
          "제조소등마다 한 줄씩 적어 연 1회 이상 점검과 30일 이내 결과 제출을 관리합니다 (위험물안전관리법 제18조, 시행규칙 제64조).")
    r = 4
    for col, h in zip(cols, names):
        cell(ws, f"{col}{r}", h, f(9, True), HEAD, CENTER)
    ws.row_dimensions[r].height = 30; r += 1
    for i in range(1, 13):
        cell(ws, f"A{r}", i, align=CENTER)
        for col in cols[1:]:
            cell(ws, f"{col}{r}", None, f(9), align=CENTER)
        cell(ws, f"C{r}", "제조소 · 저장소 · 취급소", f(8), align=CENTER)
        cell(ws, f"F{r}", "안전관리자 · 대행기관 · 탱크시험자", f(8), align=CENTER)
        cell(ws, f"H{r}", f'=IF(G{r}="","",G{r}+30)', f(9), align=CENTER)
        ws[f"H{r}"].number_format = "yyyy-mm-dd"
        cell(ws, f"J{r}", "[ ]", align=CENTER)
        ws.row_dimensions[r].height = 26; r += 1
    note(ws, r, "K",
         "점검일을 넣으면 결과 제출 기한(점검일 + 30일)이 계산됩니다. 대행기관이나 탱크시험자가 점검하면 안전관리자가 현장에 참관해야 합니다 (시행규칙 제67조제2항). · " + FOOT,
         NOTE, 28)


def sheet_record(ws):
    setup(ws)
    widths(ws, "ABCDEF", [18, 18, 18, 18, 14, 14])
    title(ws, "F", "위험물 제조소등 정기점검 기록",
          "정기점검 후 시행규칙 제68조제1항의 사항을 기록하고 3년간 보존합니다.")
    r = 4
    for lb in ["제조소등 명칭", "점검연월일", "점검 방법", "점검자 성명 (안전관리자 또는 탱크시험자)", "참관한 안전관리자 성명"]:
        ws.merge_cells(f"A{r}:B{r}")
        cell(ws, f"A{r}", lb, f(9, True), HEAD, CENTER); boxrange(ws, f"A{r}:B{r}")
        blank(ws, f"C{r}:F{r}")
        ws.row_dimensions[r].height = 26; r += 1
    r += 1
    section(ws, r, "F", "점검 결과"); r += 1
    heads(ws, r, "ABCDEF", ["점검 부위", "점검 내용", "결과", "부적합 내용", "조치 내용", "조치일"])
    r += 1
    for part in ["위치 (안전거리·보유공지)", "구조 (건축물·탱크)", "설비 (배관·밸브·계측)", "안전장치·제어장치",
                 "소화설비·경보설비", "표지·게시판", "", "", ""]:
        cell(ws, f"A{r}", part or None, f(9, True))
        cell(ws, f"B{r}", None, f(9))
        cell(ws, f"C{r}", "적합 · 부적합", f(8), align=CENTER)
        for col in "DEF":
            cell(ws, f"{col}{r}", None, f(9))
        ws.row_dimensions[r].height = 30; r += 1
    note(ws, r, "F",
         "점검 부위는 예시입니다. 점검 내용·방법의 기술상 기준은 소방청장이 고시한 정기점검표를 따릅니다 (시행규칙 제66조). "
         "구조나 설비의 이상을 발견하면 관계자에게 연락하고 응급조치를 하는 것은 안전관리자의 책무입니다 (제55조제3호나목). · " + FOOT,
         NOTE, 36)


def main():
    from openpyxl import Workbook
    wb = Workbook()
    wb.remove(wb.active)
    sheet_target(wb.create_sheet("1 대상·일정"))
    sheet_ledger(wb.create_sheet("2 관리대장"))
    sheet_record(wb.create_sheet("3 점검 기록"))
    for ws in wb.worksheets:
        ws.page_setup.fitToHeight = 1
    wb.properties.creator = "그린헬멧기사"
    p = OUT / "hazmat-periodic-check.xlsx"
    wb.save(p)
    print("ok", p.name)


if __name__ == "__main__":
    main()
