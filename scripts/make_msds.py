# 물질안전보건자료(MSDS) 관리 세트 xlsx 생성기
# 출처 (국가법령정보센터 2026-11-25 확인):
#   산업안전보건법 제110조, 제111조, 제114조, 제115조, 제175조 (법률 제22122호, 2026. 10. 27. 시행)
#   같은 법 시행규칙 제167조~제170조 (고용노동부령 제477호, 2026. 8. 1. 시행)
# 교육 내용 세부(시행규칙 별표 5)는 원문 파일로 확인하도록 적는다. 법 조문에 없는 항목은 '현장 권장'으로 적는다.
# 실행: python scripts/make_msds.py → public/library/msds-management-set.xlsx (그다음 plain_colors.py)
from make_checklists import OUT, HEAD, CENTER, WRAP, f, setup, cell, boxrange
from make_loto import title, note, section, heads, NOTE, FOOT
from make_risk_set import widths, label, blank, checks


def sheet_list(ws):
    setup(ws, landscape=True)
    names = ["번호", "제품명", "공급사", "사용 공정", "MSDS 받은 날", "MSDS 개정일", "게시·비치 위치",
             "경고표지", "관리요령 게시", "교육", "비고"]
    cols = list("ABCDEFGHIJK")
    widths(ws, cols, [5, 20, 16, 16, 11, 11, 18, 8, 12, 7, 14])
    title(ws, "K", "MSDS 보유 목록 (관리대장)",
          "취급하는 물질안전보건자료대상물질과 받은 MSDS를 한 줄씩 적고, 게시·표지·관리요령·교육 여부를 함께 확인합니다 (현장 권장).")
    r = 4
    label(ws, r, "A", "기준일"); blank(ws, f"B{r}:C{r}"); label(ws, r, "D", "작성자"); blank(ws, f"E{r}:K{r}")
    ws.row_dimensions[r].height = 24; r += 2
    for col, h in zip(cols, names):
        cell(ws, f"{col}{r}", h, f(9, True), HEAD, CENTER)
    ws.row_dimensions[r].height = 26; r += 1
    for i in range(1, 21):
        cell(ws, f"A{r}", i, align=CENTER)
        for col in cols[1:]:
            cell(ws, f"{col}{r}", None, f(9), align=CENTER)
        for col in "HIJ":
            cell(ws, f"{col}{r}", "[ ]", align=CENTER)
        ws.row_dimensions[r].height = 22; r += 1
    note(ws, r, "K",
         "물질을 양도·제공하는 자는 MSDS를 제공해야 하고, 변경된 MSDS도 제공해야 합니다 (산업안전보건법 제111조). 개정본을 받으면 MSDS 개정일을 고치고 게시본을 바꿉니다 (현장 권장). "
         "MSDS를 게시하거나 갖추어 두지 않으면 500만 원 이하 과태료입니다 (제175조제5항제3호). · " + FOOT,
         NOTE, 32)


def sheet_check(ws):
    setup(ws)
    widths(ws, "ABCDE", [6, 30, 30, 10, 16])
    title(ws, "E", "MSDS 게시·경고표지·교육 점검표",
          "물질안전보건자료대상물질을 취급하는 사업주의 의무를 조문 순서대로 확인합니다 (산업안전보건법 제114조·제115조).")
    r = 4
    label(ws, r, "A", "점검일"); blank(ws, f"B{r}:B{r}"); label(ws, r, "C", "점검자"); blank(ws, f"D{r}:E{r}")
    ws.row_dimensions[r].height = 24; r += 2
    section(ws, r, "E", "1. MSDS 게시·비치 (법 제114조제1항, 시행규칙 제167조)"); r += 1
    r = checks(ws, r, "E", [
        ("취급 작업공정이 있는 장소, 근로자가 가장 보기 쉬운 장소, 작업 중 쉽게 접근할 수 있는 전산장비 중 한 곳에 항상 게시·비치했다", "규칙 제167조①"),
        ("전산장비에 두었다면 고용노동부장관이 정하는 조치를 했다", "규칙 제167조① 단서"),
        ("건설공사·임시 작업·단시간 작업은 관리요령으로 대신할 수 있으나, 근로자가 요청하면 MSDS를 게시한다", "규칙 제167조②"),
    ], "E", h=34)
    r += 1
    section(ws, r, "E", "2. 작업공정별 관리요령 게시 (법 제114조제2항, 시행규칙 제168조)"); r += 1
    r = checks(ws, r, "E", [
        ("제품명", "규칙 제168조①1"),
        ("건강 및 환경에 대한 유해성, 물리적 위험성", "규칙 제168조①2"),
        ("안전 및 보건상의 취급주의 사항", "규칙 제168조①3"),
        ("적절한 보호구", "규칙 제168조①4"),
        ("응급조치 요령 및 사고 시 대처방법", "규칙 제168조①5"),
        ("MSDS 내용을 참고해 작성했다 (유해성·위험성이 비슷한 물질은 그룹별로 작성 가능)", "규칙 제168조②③"),
    ], "E", h=24)
    r += 1
    section(ws, r, "E", "3. 용기 경고표지 (법 제115조제2항, 시행규칙 제170조)"); r += 1
    r = checks(ws, r, "E", [
        ("사업장에서 쓰는 용기에 물질 단위로 경고표지를 붙이거나 인쇄했다", "규칙 제170조①"),
        ("명칭(제품명), 그림문자, 신호어(위험·경고), 유해·위험 문구, 예방조치 문구, 공급자 정보가 모두 있다", "규칙 제170조②"),
        ("소분 용기도 표시했다 (공급자가 이미 표시한 용기, 옮겨 담으려고 일시적으로 쓰는 용기는 제외)", "규칙 제170조④"),
    ], "E", h=30)
    r += 1
    section(ws, r, "E", "4. 근로자 교육 (법 제114조제3항, 시행규칙 제169조)"); r += 1
    r = checks(ws, r, "E", [
        ("물질을 제조·사용·운반·저장하는 작업에 근로자를 배치하게 된 경우 교육했다", "규칙 제169조①1"),
        ("새로운 물질이 도입된 경우 교육했다", "규칙 제169조①2"),
        ("유해성·위험성 정보가 변경된 경우 교육했다", "규칙 제169조①3"),
        ("교육 시간과 내용 등을 기록해 보존한다", "규칙 제169조③"),
    ], "E", h=24)
    note(ws, r, "E",
         "교육 내용은 MSDS에서 시행규칙 별표 5에 해당하는 내용이며 원문으로 확인합니다. 교육받은 시간만큼 법 제29조 안전보건교육을 한 것으로 봅니다 (제169조제1항). "
         "교육 미실시와 경고표시 미이행은 각각 300만 원 이하 과태료입니다 (법 제175조제6항제10호·제11호). · " + FOOT,
         NOTE, 40)


def sheet_guide(ws):
    setup(ws)
    widths(ws, "ABCD", [18, 26, 26, 26])
    title(ws, "D", "작업공정별 MSDS 관리요령",
          "공정마다 한 장씩 작성해 작업장에 게시합니다 (산업안전보건법 제114조제2항, 시행규칙 제168조).")
    r = 4
    for lb in ["작업공정", "작성일 / 작성자"]:
        label(ws, r, "A", lb); blank(ws, f"B{r}:D{r}")
        ws.row_dimensions[r].height = 26; r += 1
    r += 1
    heads(ws, r, "ABCD", ["항목", "제품 1", "제품 2", "제품 3"])
    ws.row_dimensions[r].height = 24; r += 1
    for item, h in [("제품명", 30), ("유해성·위험성\n(건강·환경·물리적)", 90), ("취급주의 사항", 90),
                    ("보호구", 60), ("응급조치 요령", 80), ("사고 시 대처방법\n(누출·화재)", 80)]:
        cell(ws, f"A{r}", item, f(9, True), HEAD, CENTER)
        for col in "BCD":
            cell(ws, f"{col}{r}", None, f(9))
        ws.row_dimensions[r].height = h; r += 1
    note(ws, r, "D",
         "내용은 각 제품 MSDS를 참고해 적습니다 (제168조제2항). 유해성·위험성이 비슷한 물질은 한 칸에 묶어 그룹별로 작성할 수 있습니다 (같은 조 제3항). · " + FOOT,
         NOTE, 30)


def sheet_edu(ws):
    setup(ws, landscape=True)
    names = ["번호", "교육일", "교육 사유", "대상 물질 (그룹)", "교육 내용", "시간", "교육자", "대상 인원", "참석 인원", "서명부"]
    cols = list("ABCDEFGHIJ")
    widths(ws, cols, [5, 11, 20, 22, 36, 7, 11, 9, 9, 8])
    title(ws, "J", "MSDS 교육 실시 기록",
          "배치, 신규 물질 도입, 유해성·위험성 정보 변경 때 교육하고 시간·내용 등을 기록해 보존합니다 (산업안전보건법 시행규칙 제169조).")
    r = 4
    for col, h in zip(cols, names):
        cell(ws, f"{col}{r}", h, f(9, True), HEAD, CENTER)
    ws.row_dimensions[r].height = 26; r += 1
    for i in range(1, 13):
        cell(ws, f"A{r}", i, align=CENTER)
        for col in cols[1:]:
            cell(ws, f"{col}{r}", None, f(9), align=CENTER)
        cell(ws, f"C{r}", "배치 · 신규 도입 · 정보 변경", f(8), align=CENTER)
        cell(ws, f"J{r}", "[ ]", align=CENTER)
        ws.row_dimensions[r].height = 26; r += 1
    note(ws, r, "J",
         "교육 내용 칸에는 시행규칙 별표 5에서 MSDS 교육에 해당하는 항목을 적습니다. 참석자 서명부는 따로 붙여 보관합니다 (현장 권장). · " + FOOT,
         NOTE, 28)


def main():
    from openpyxl import Workbook
    wb = Workbook()
    wb.remove(wb.active)
    sheet_list(wb.create_sheet("1 보유 목록"))
    sheet_check(wb.create_sheet("2 점검표"))
    sheet_guide(wb.create_sheet("3 공정별 관리요령"))
    sheet_edu(wb.create_sheet("4 교육 기록"))
    for ws in wb.worksheets:
        ws.page_setup.fitToHeight = 1
    wb.properties.creator = "그린헬멧기사"
    p = OUT / "msds-management-set.xlsx"
    wb.save(p)
    print("ok", p.name)


if __name__ == "__main__":
    main()
