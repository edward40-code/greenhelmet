# 연간 안전보건계획 양식 xlsx 생성기
# 출처 (국가법령정보센터 2026-11-24 확인):
#   산업안전보건법 제14조 (법률 제22122호, 2026. 10. 27.), 제29조, 제175조제4항제2호
#   산업안전보건법 시행령 제13조 (대통령령 제36540호, 2026. 8. 1. 시행)
#   산업안전보건법 시행규칙 제29조, [별표 4] (개정 2025. 5. 30.)
#   중대재해 처벌 등에 관한 법률 시행령 제4조, 제5조 (2025. 10. 1. 시행본)
# 법 조문에 없는 항목은 '현장 권장'으로 따로 적는다.
# 실행: python scripts/make_annual_plan.py → public/library/annual-safety-plan.xlsx (그다음 plain_colors.py)
from openpyxl.styles import Alignment

from make_checklists import OUT, HEAD, CENTER, WRAP, f, setup, cell, boxrange
from make_loto import title, note, section, heads, NOTE, FOOT

RIGHT = Alignment(horizontal="right", vertical="bottom")
SAPA = "중대재해처벌법 시행령"


def label(ws, r, col, text):
    cell(ws, f"{col}{r}", text, f(9, True), HEAD, CENTER)


def blank(ws, rng):
    a = rng.split(":")[0]
    if ":" in rng:
        ws.merge_cells(rng)
    cell(ws, a, None)
    boxrange(ws, rng)


def widths(ws, cols, ws_):
    for col, w in zip(cols, ws_):
        ws.column_dimensions[col].width = w


def sheet_policy(ws):
    """1. 안전보건 경영방침·목표 (A4 세로)"""
    setup(ws)
    widths(ws, "ABCDEF", [8, 30, 22, 13, 12, 13])
    title(ws, "F", "안전보건 경영방침과 목표",
          "사업 또는 사업장의 안전·보건에 관한 목표와 경영방침을 정합니다 (중대재해처벌법 시행령 제4조제1호, 산업안전보건법 시행령 제13조제2항제1호).")
    r = 4
    label(ws, r, "A", "연도"); blank(ws, f"B{r}:B{r}"); label(ws, r, "C", "사업장"); blank(ws, f"D{r}:F{r}")
    ws.row_dimensions[r].height = 24; r += 2

    section(ws, r, "F", "1. 경영방침"); r += 1
    ws.merge_cells(f"A{r}:F{r}"); cell(ws, f"A{r}", None); boxrange(ws, f"A{r}:F{r}")
    ws.row_dimensions[r].height = 130; r += 1
    note(ws, r, "F",
         "예문 (사업장에 맞게 고쳐 쓰세요): 1. 안전과 보건을 생산보다 먼저 둡니다. 2. 위험성평가로 유해·위험요인을 찾고 개선합니다. "
         "3. 일하는 사람의 의견을 듣고 반영합니다. 4. 협력업체 근로자도 같은 기준으로 보호합니다. 5. 필요한 인력과 예산을 확보합니다.",
         NOTE, 40); r += 2

    section(ws, r, "F", "2. 안전보건 목표"); r += 1
    heads(ws, r, "ABCDEF", ["번호", "목표", "측정 방법 (지표)", "목표값", "담당", "반기 점검"]); r += 1
    for i in range(1, 7):
        cell(ws, f"A{r}", i, align=CENTER)
        for col in "BCDEF":
            cell(ws, f"{col}{r}", None, align=CENTER if col in "DEF" else WRAP)
        ws.row_dimensions[r].height = 34; r += 1
    note(ws, r, "F",
         "목표 예시 (현장 권장): 위험성평가 개선 조치 완료율, 정기교육 이수율, 아차사고 보고 건수, 협력업체 합동 점검 횟수처럼 셀 수 있는 것으로 정합니다. "
         "결과보다 '하는 일'을 목표로 두면 반기마다 점검하기 쉽습니다.",
         NOTE, 32); r += 2

    section(ws, r, "F", "3. 공표와 서명"); r += 1
    label(ws, r, "A", "공표일"); blank(ws, f"B{r}:B{r}"); label(ws, r, "C", "게시·공유 방법"); blank(ws, f"D{r}:F{r}")
    ws.row_dimensions[r].height = 26; r += 1
    label(ws, r, "A", "대표자")
    ws.merge_cells(f"B{r}:F{r}"); cell(ws, f"B{r}", "(서명)", f(9), align=RIGHT); boxrange(ws, f"B{r}:F{r}")
    ws.row_dimensions[r].height = 36; r += 1
    note(ws, r, "F",
         "게시·공유 방법(사내 게시판, 교육, 협력업체 전달 등)은 현장 권장입니다. 중대재해처벌법 조문은 상시근로자 5명 이상 사업 또는 사업장에 적용됩니다. · " + FOOT,
         NOTE, 30)


def sheet_org(ws):
    """2. 안전보건 조직과 역할 (A4 세로)"""
    setup(ws)
    widths(ws, "ABCDEF", [22, 13, 13, 8, 28, 18])
    title(ws, "F", "안전보건 조직과 역할",
          "안전·보건관리 조직의 구성·인원 및 역할을 정리합니다 (산업안전보건법 시행령 제13조제2항제2호).")
    r = 4
    section(ws, r, "F", "1. 법정 인력"); r += 1
    heads(ws, r, "ABCDEF", ["구분", "성명", "소속·직위", "인원", "역할", "근거"]); r += 1
    rows = [
        ("안전보건관리책임자", "산안법 제15조"),
        ("관리감독자", "산안법 제16조"),
        ("안전관리자", "산안법 제17조"),
        ("보건관리자", "산안법 제18조"),
        ("안전보건관리담당자", "산안법 제19조"),
        ("산업안전보건위원회", "산안법 제24조"),
        ("안전·보건 전담 조직 (해당 시)", f"{SAPA}\n제4조제2호"),
    ]
    for name, basis in rows:
        cell(ws, f"A{r}", name, f(9, True), align=CENTER)
        for col in "BCDE":
            cell(ws, f"{col}{r}", None, align=CENTER if col == "D" else WRAP)
        cell(ws, f"F{r}", basis, f(8), align=CENTER)
        ws.row_dimensions[r].height = 34; r += 1
    for _ in range(3):
        for col in "ABCDEF":
            cell(ws, f"{col}{r}", None)
        ws.row_dimensions[r].height = 30; r += 1
    note(ws, r, "F",
         "해당하지 않는 칸은 '해당 없음'으로 적습니다. 선임 대상과 인원은 업종과 상시근로자 수에 따라 다릅니다 (산업안전보건법 시행령 별표). "
         "전담 조직: 안전관리자·보건관리자 등 법정 인력이 총 3명 이상이고 상시근로자 500명 이상(또는 시공능력 상위 200위 이내 건설사업자)인 경우 (중대재해처벌법 시행령 제4조제2호).",
         NOTE, 44); r += 2

    section(ws, r, "F", "2. 권한과 평가"); r += 1
    heads(ws, r, "ABCDEF", ["확인 내용", "", "", "", "근거", "확인"])
    ws.merge_cells(f"A{r}:D{r}"); r += 1
    items = [
        ("안전보건관리책임자·관리감독자 등에게 업무에 필요한 권한과 예산을 주었다", f"{SAPA}\n제4조제5호가목"),
        ("위 사람들이 업무를 충실히 하는지 평가하는 기준을 정했다", f"{SAPA}\n제4조제5호나목"),
        ("그 기준으로 반기 1회 이상 평가·관리한다", f"{SAPA}\n제4조제5호나목"),
        ("겸직하는 안전관리자 등은 안전·보건 업무 시간을 보장한다", f"{SAPA}\n제4조제6호"),
    ]
    for text, basis in items:
        ws.merge_cells(f"A{r}:D{r}"); cell(ws, f"A{r}", text); boxrange(ws, f"A{r}:D{r}")
        cell(ws, f"E{r}", basis, f(8), align=CENTER)
        cell(ws, f"F{r}", "[ ]", align=CENTER)
        ws.row_dimensions[r].height = 32; r += 1
    note(ws, r, "F", FOOT, NOTE, 20)


PLAN_ROWS = [
    ("안전보건 경영방침·목표 설정", f"{SAPA} 제4조제1호"),
    ("안전보건계획 이사회 보고·승인 (해당 회사)", "산안법 제14조"),
    ("위험성평가", "산안법 제36조"),
    ("유해·위험요인 확인·개선 점검 (반기 1회 이상)", f"{SAPA} 제4조제3호"),
    ("안전·보건 예산 편성과 집행 확인", f"{SAPA} 제4조제4호"),
    ("안전보건관리책임자등 평가 (반기 1회 이상)", f"{SAPA} 제4조제5호"),
    ("종사자 의견 청취·개선 점검 (반기 1회 이상)", f"{SAPA} 제4조제7호"),
    ("중대산업재해 대비 매뉴얼 점검 (반기 1회 이상)", f"{SAPA} 제4조제8호"),
    ("도급·용역·위탁 기준 점검 (반기 1회 이상)", f"{SAPA} 제4조제9호"),
    ("안전·보건 관계 법령 의무이행 점검 (반기 1회 이상)", f"{SAPA} 제5조제2항제1호"),
    ("유해·위험 작업 교육 실시 점검 (반기 1회 이상)", f"{SAPA} 제5조제2항제3호"),
    ("근로자 정기교육 (매반기)", "산안법 제29조, 시행규칙 별표 4"),
    ("관리감독자 정기교육 (연간 16시간 이상)", "시행규칙 별표 4"),
    ("직무교육 (신규·보수 대상자)", "시행규칙 제29조"),
    ("산업안전보건위원회 (해당 사업장)", "산안법 제24조"),
    ("작업환경측정 (해당 사업장)", "산안법 제125조"),
    ("일반건강진단", "산안법 제129조"),
    ("특수건강진단 등 (해당 근로자)", "산안법 제130조"),
]


def sheet_plan(ws):
    """3. 연간 추진계획 (가로)"""
    setup(ws, landscape=True)
    months = [f"{m}월" for m in range(1, 13)]
    names = ["번호", "업무", "근거", "담당"] + months + ["전년도 실적"]
    cols = [chr(ord("A") + i) for i in range(len(names))]
    last = cols[-1]
    widths(ws, cols, [5, 42, 30, 9] + [4.2] * 12 + [16])
    title(ws, last, "연간 안전보건 추진계획",
          "할 달에 ○, 마친 달에 ●를 적습니다. 전년도 활동실적과 다음 연도 활동계획을 함께 정리합니다 (산업안전보건법 시행령 제13조제2항제4호).")
    r = 4
    for col, h in zip(cols, names):
        cell(ws, f"{col}{r}", h, f(9, True), HEAD, CENTER)
    ws.row_dimensions[r].height = 24; r += 1
    for i, (task, basis) in enumerate(PLAN_ROWS + [("", "")] * 4, 1):
        cell(ws, f"A{r}", i, align=CENTER)
        cell(ws, f"B{r}", task or None, f(9))
        cell(ws, f"C{r}", basis or None, f(8), align=CENTER)
        for col in cols[3:]:
            cell(ws, f"{col}{r}", None, align=CENTER)
        ws.row_dimensions[r].height = 22; r += 1
    note(ws, r, last,
         "'반기 1회 이상' 업무는 상반기와 하반기에 한 번 이상씩 표시합니다. 달은 사업장 사정에 맞게 정합니다. 빈 줄에는 소방훈련, 협력업체 합동 점검처럼 사업장 업무를 더합니다 (현장 권장). "
         "이사회 보고·승인은 상시근로자 500명 이상 회사 또는 시공능력 상위 1천위 이내 건설회사의 대표이사가 매년 합니다 (산업안전보건법 제14조, 시행령 제13조). 하지 않으면 1천만 원 이하 과태료 (제175조제4항제2호). · " + FOOT,
         NOTE, 44)


EDU_ROWS = [
    ("근로자 정기교육", "사무직 종사 근로자", "매반기 6시간 이상"),
    ("근로자 정기교육", "판매업무에 직접 종사하는 근로자", "매반기 6시간 이상"),
    ("근로자 정기교육", "그 밖의 근로자", "매반기 12시간 이상"),
    ("관리감독자 정기교육", "관리감독자", "연간 16시간 이상"),
    ("채용 시 교육", "일용근로자, 계약기간 1주일 이하 기간제", "1시간 이상"),
    ("채용 시 교육", "계약기간 1주일 초과 1개월 이하 기간제", "4시간 이상"),
    ("채용 시 교육", "그 밖의 근로자", "8시간 이상"),
    ("작업내용 변경 시 교육", "일용근로자, 계약기간 1주일 이하 기간제 / 그 밖의 근로자", "1시간 이상 / 2시간 이상"),
    ("특별교육", "별표 5 제1호라목 작업 종사 근로자 (일용·1주일 이하 기간제 제외)",
     "16시간 이상 (최초 작업 전 4시간 이상, 12시간은 3개월 이내 분할 가능), 단기간·간헐적 작업은 2시간 이상"),
    ("특별교육", "일용근로자, 계약기간 1주일 이하 기간제", "2시간 이상 (별표 5 제1호라목제39호 작업은 8시간 이상)"),
    ("직무교육", "안전보건관리책임자", "신규 6시간 이상, 보수 6시간 이상"),
    ("직무교육", "안전관리자, 보건관리자", "신규 34시간 이상, 보수 24시간 이상"),
    ("직무교육", "안전보건관리담당자", "보수 8시간 이상"),
]


def sheet_edu(ws):
    """4. 연간 교육계획 (가로)"""
    setup(ws, landscape=True)
    names = ["교육과정", "대상", "법정 시간", "대상 인원", "상반기 계획\n(월·시간)", "하반기 계획\n(월·시간)", "방법", "실적 확인"]
    cols = list("ABCDEFGH")
    widths(ws, cols, [16, 32, 44, 9, 13, 13, 12, 11])
    title(ws, "H", "연간 안전보건교육 계획",
          "교육과정별 법정 시간에 맞춰 연간 계획을 세웁니다 (산업안전보건법 제29조, 시행규칙 제26조·제29조, 별표 4).")
    r = 4
    for col, h in zip(cols, names):
        cell(ws, f"{col}{r}", h, f(9, True), HEAD, CENTER)
    ws.row_dimensions[r].height = 30; r += 1
    for course, who, hours in EDU_ROWS:
        cell(ws, f"A{r}", course, f(9, True), align=CENTER)
        cell(ws, f"B{r}", who, f(9))
        cell(ws, f"C{r}", hours, f(9))
        for col in "DEFGH":
            cell(ws, f"{col}{r}", None, align=CENTER)
        ws.row_dimensions[r].height = 44 if len(hours) > 50 or len(who) > 30 else 26; r += 1
    for _ in range(2):
        for col in cols:
            cell(ws, f"{col}{r}", None)
        ws.row_dimensions[r].height = 24; r += 1
    note(ws, r, "H",
         "영 별표 1 제1호에 따른 사업과 상시근로자 50명 미만의 도매업, 숙박 및 음식점업은 근로자·관리감독자 교육시간을 2분의 1 이상으로 합니다 (별표 4 비고). "
         "직무교육은 선임 후 3개월 이내 신규교육, 이수 후 매 2년이 되는 날 전후 6개월 사이 보수교육입니다 (시행규칙 제29조). "
         "채용 시·작업내용 변경 시 교육은 그때그때 하므로 '수시'로 적습니다. 실시한 교육은 교육일지에 남깁니다. · " + FOOT,
         NOTE, 46)


BUDGET_ROWS = [
    ("가. 인력·시설·장비", ["안전·보건 인력 (선임, 위탁)", "안전시설 (난간, 방호장치 등)", "보호구", "측정·점검 장비"]),
    ("나. 유해·위험요인 개선", ["위험성평가 개선 조치", "반기 점검 지적사항 개선"]),
    ("다. 그 밖의 체계 구축", ["안전보건교육", "작업환경측정·건강진단", "외부 점검·진단"]),
]


def sheet_budget(ws):
    """5. 안전·보건 예산과 집행 (A4 세로)"""
    setup(ws)
    widths(ws, "ABCDEFG", [19, 26, 12, 10, 12, 10, 11])
    title(ws, "G", "안전·보건 예산 편성과 집행",
          "재해 예방에 필요한 예산을 편성하고 용도에 맞게 집행했는지 확인합니다 (중대재해처벌법 시행령 제4조제4호, 산업안전보건법 시행령 제13조제2항제3호).")
    r = 4
    label(ws, r, "A", "연도"); blank(ws, f"B{r}:B{r}"); label(ws, r, "C", "사업장"); blank(ws, f"D{r}:G{r}")
    ws.row_dimensions[r].height = 24; r += 2
    heads(ws, r, "ABCDEFG", ["구분", "항목", "편성액", "집행 시기", "상반기 집행", "하반기 집행", "비고"]); r += 1
    for group, items in BUDGET_ROWS:
        start = r
        for it in items + [""]:
            cell(ws, f"B{r}", it or None, f(9))
            for col in "CDEFG":
                cell(ws, f"{col}{r}", None, align=CENTER)
            ws.row_dimensions[r].height = 24; r += 1
        ws.merge_cells(f"A{start}:A{r - 1}")
        cell(ws, f"A{start}", group, f(9, True), align=CENTER)
        boxrange(ws, f"A{start}:A{r - 1}")
    cell(ws, f"A{r}", "합계", f(9, True), HEAD, CENTER)
    for col in "BCDEFG":
        cell(ws, f"{col}{r}", None, align=CENTER)
    ws.row_dimensions[r].height = 24; r += 1
    note(ws, r, "G",
         "구분 가·나·다는 중대재해처벌법 시행령 제4조제4호 각 목입니다. 각 목 아래 항목은 예시이며 사업장에 맞게 바꿉니다 (현장 권장). "
         "반기 점검에서 의무가 이행되지 않은 것이 확인되면 인력 배치나 예산 추가 편성 등 필요한 조치를 합니다 (같은 영 제5조제2항제2호·제4호).",
         NOTE, 40); r += 2

    section(ws, r, "G", "주요 안전·보건 시설 현황"); r += 1
    heads(ws, r, "ABCDEFG", ["시설·장비", "위치·수량", "", "상태", "다음 점검", "", "비고"])
    ws.merge_cells(f"B{r}:C{r}"); ws.merge_cells(f"E{r}:F{r}"); r += 1
    for _ in range(6):
        cell(ws, f"A{r}", None)
        blank(ws, f"B{r}:C{r}")
        cell(ws, f"D{r}", None, align=CENTER)
        blank(ws, f"E{r}:F{r}")
        cell(ws, f"G{r}", None)
        ws.row_dimensions[r].height = 24; r += 1
    note(ws, r, "G", "시설 현황은 이사회 보고 계획에 들어가는 '안전·보건 관련 예산 및 시설 현황'입니다 (산업안전보건법 시행령 제13조제2항제3호). · " + FOOT, NOTE, 30)


def main():
    from openpyxl import Workbook
    wb = Workbook()
    wb.remove(wb.active)
    sheet_policy(wb.create_sheet("1 경영방침·목표"))
    sheet_org(wb.create_sheet("2 조직과 역할"))
    sheet_plan(wb.create_sheet("3 연간 추진계획"))
    sheet_edu(wb.create_sheet("4 연간 교육계획"))
    sheet_budget(wb.create_sheet("5 예산과 시설"))
    for ws in wb.worksheets:
        ws.page_setup.fitToHeight = 1  # 시트마다 A4 한 장
    wb.properties.creator = "그린헬멧기사"
    p = OUT / "annual-safety-plan.xlsx"
    wb.save(p)
    print("ok", p.name)


if __name__ == "__main__":
    main()
