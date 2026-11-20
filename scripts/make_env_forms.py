# 환경 양식 xlsx 생성기 (자료실 '서식·양식')
# 근거 조문은 국가법령정보센터 현행본을 2026-11-20에 확인했다.
#  - 대기환경보전법 시행령 제11조제4항, 시행규칙 제27조·제36조·제52조·제54조 (시행 2026.11.12.)
#  - 물환경보전법 시행규칙 제38조·제49조 (시행 2026.6.22.)
#  - 폐기물관리법 제17조·제18조·제36조, 시행규칙 제16조의13, [별표 5] 제3호다목·제4호나목 (별표 개정 2026.3.26.)
# 실행: python scripts/make_env_forms.py → public/library/*.xlsx
from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill
from make_checklists import OUT, HEAD, CENTER, WRAP, FONT, f, setup, cell, boxrange
from make_confined_space import title, note, section, field, NOTE, RED

MADE = "서식 제공: 그린헬멧기사"
GREY = f(9, color="000000")
RIGHT = Alignment(horizontal="right", vertical="center")
SOFT = PatternFill(fill_type=None)  # 양식에는 연한 녹색 말고 색을 넣지 않는다
YELLOW = PatternFill(fill_type=None)  # 실제 표지는 노란 바탕(별표 5). 본에는 색을 넣지 않는다


def col(i):
    return chr(ord("A") + i)


def header(ws, r, heads, widths=None, h=24):
    for i, hd in enumerate(heads):
        if widths:
            ws.column_dimensions[col(i)].width = widths[i]
        cell(ws, f"{col(i)}{r}", hd, f(10, True), HEAD, CENTER)
    ws.row_dimensions[r].height = h


def blank_rows(ws, r, n, ncols, h=24, number=True):
    for k in range(n):
        for i in range(ncols):
            cell(ws, f"{col(i)}{r}", (k + 1) if (number and i == 0) else None, align=CENTER)
        ws.row_dimensions[r].height = h
        r += 1
    return r


def sign(ws, r, labels, c1, c2, c3, c4):
    """오른쪽 아래 서명 칸. c1:c2 = 이름표, c3:c4 = 서명"""
    for lb in labels:
        if c1 != c2:
            ws.merge_cells(f"{c1}{r}:{c2}{r}")
        cell(ws, f"{c1}{r}", lb, f(10, True), HEAD, CENTER)
        boxrange(ws, f"{c1}{r}:{c2}{r}")
        if c3 != c4:
            ws.merge_cells(f"{c3}{r}:{c4}{r}")
        cell(ws, f"{c3}{r}", "(서명)", align=RIGHT)
        boxrange(ws, f"{c3}{r}:{c4}{r}")
        ws.row_dimensions[r].height = 26
        r += 1
    return r


def lines(text, per):
    """줄바꿈될 줄 수 어림 (한글 기준 글자 수)"""
    return sum(len(p) // per + 1 for p in str(text).split("\n"))


def save(wb, name, one_page=True):
    if one_page:
        for ws in wb.worksheets:
            ws.page_setup.fitToHeight = 1
    wb.properties.creator = "그린헬멧기사"
    wb.save(OUT / name)
    print("ok", name, [ws.title for ws in wb.worksheets])


# ───────────────────────── 1. 환경 인허가 관리대장·변경신고 확인표 ─────────────────────────
CHANGE_Q = [
    ("대기", "같은 배출구에 연결된 대기 배출시설을 늘리거나, 바꾸거나, 없애는가",
     "변경 전 변경신고. 같은 종류·같은 배출구 시설 총규모의 10% 미만이면서 ① 늘어나는 오염물질이 방지시설 처리용량 안이고 ② 다른 법령의 설치 제한에 걸리지 않을 때만 제외",
     "대기 시행규칙 제27조제1항제1호·제3항제1호"),
    ("대기", "(허가 사업장) 이번 증설로 허가·변경허가·변경신고한 규모 합계나 누계가 50% 이상(특정대기유해물질 배출시설은 30% 이상) 늘어나는가",
     "변경신고가 아니라 변경허가 대상. 이번 건만이 아니라 누계로 판단",
     "대기 시행령 제11조제4항"),
    ("대기", "대기 방지시설을 늘리거나, 바꾸거나, 없애는가",
     "변경 전 변경신고",
     "대기 시행규칙 제27조제1항제3호·제3항제3호"),
    ("대기", "쓰는 원료나 연료를 바꾸는가",
     "변경 전 변경신고. 새 대기오염물질이 나오지 않고 배출량이 늘지 않는 원료, 황 함유량이 더 낮은 연료로 바꾸는 경우는 제외",
     "대기 시행규칙 제27조제1항제5호·제3항제4호"),
    ("대기", "허가증·신고증명서에 적힌 사항이나 하루 조업시간을 바꾸는가",
     "변경 전 변경신고",
     "대기 시행규칙 제27조제1항제7호·제3항제7호"),
    ("수질", "폐수배출량이 신고 당시보다 50% 이상 늘거나, 배출량 변화로 사업장 종류(1~5종)가 바뀌는가",
     "변경 전 변경신고 (변경허가 대상인 경우는 변경허가)",
     "물환경 시행규칙 제38조제1항제1호·제2호, 제4항제1호"),
    ("수질", "폐수배출시설에서 새로운 수질오염물질이 나오게 되는가",
     "변경 전 변경신고 (변경허가 대상인 경우는 변경허가)",
     "물환경 시행규칙 제38조제1항제3호"),
    ("수질", "수질오염방지시설의 폐수처리방법이나 처리공정을 바꾸는가, 방지시설을 새로 설치하거나 시설 일부를 폐쇄하는가",
     "변경 전 변경신고",
     "물환경 시행규칙 제38조제1항제4호~제6호"),
    ("공통", "사업장 명칭이나 대표자가 바뀌는가",
     "대기: 사유가 발생한 날부터 2개월 이내 / 수질: 변경한 날부터 2개월 이내",
     "대기 시행규칙 제27조제2항·제3항, 물환경 시행규칙 제38조제2항제1호·제4항제2호"),
    ("공통", "배출시설이나 방지시설을 임대하는가",
     "대기: 사유가 발생한 날부터 30일 이내 / 수질: 변경한 날부터 30일 이내",
     "대기 시행규칙 제27조제1항제6호·제3항제6호, 물환경 시행규칙 제38조제2항제3호·제4항제3호"),
    ("공통", "(원료 변경 없이) 측정·검사에서 허가·신고하지 않은 새 오염물질이 확인됐는가",
     "대기: 배출이 확인된 날부터 30일 이내 / 수질: 측정 결과를 확인한 날 또는 검사 결과를 통보받은 날부터 30일 이내",
     "대기 시행규칙 제27조제2항·제3항, 물환경 시행규칙 제38조제2항제6호·제4항제4호"),
    ("폐기물", "새로운 폐기물이 생기거나, 원료·공정 변경으로 폐기물의 종류·성질이 달라지는가",
     "지정폐기물에 해당하는지 미리 확인. 배출자 신고 사항이 바뀌면 변경신고. 위탁계약서와 수탁업체 허가 품목에 그 폐기물이 있는지 확인",
     "폐기물관리법 제17조제1항제1호·제2항, 시행규칙 제16조의13"),
    ("화학물질", "새로운 화학물질(원료·부원료·세척제 등)을 들여오는가",
     "물질안전보건자료(MSDS)를 먼저 받고, 화학물질 관련 법령의 허가·신고 대상인지 확인",
     "(해당 법령 확인)"),
]


def permit_ledger(ws):
    setup(ws, landscape=True)
    heads = ["번호", "구분", "인허가·신고 이름", "허가(신고) 번호", "최초 일자", "최근 변경 일자와 내용", "허가증 보관 위치", "현장과 대조한 날", "담당"]
    widths = [6, 11, 28, 16, 12, 30, 16, 14, 10]
    last = col(len(heads) - 1)
    title(ws, last, "환경 인허가 관리대장",
          "허가증·신고증명서를 한 장에 모아 적고, 1년에 한 번 이상 허가증을 들고 현장을 걸으며 대조한 날을 적습니다.")
    header(ws, 4, heads, widths)
    ws.merge_cells(f"A5:{last}5")
    cell(ws, "A5", "적는 예: 대기배출시설 설치허가(신고) · 폐수배출시설 설치허가(신고) · 사업장폐기물배출자 신고 · 지정폐기물 처리계획 확인 · 소음·진동 배출시설 신고 · 화학물질 관련 허가·신고 · 통합허가 등 우리 사업장에 해당하는 것",
         GREY, SOFT)
    boxrange(ws, f"A5:{last}5")
    ws.row_dimensions[5].height = 30
    r = blank_rows(ws, 6, 14, len(heads), h=26)
    note(ws, r + 1, last, f"'최근 변경 일자와 내용'에는 변경신고·변경허가를 한 날짜와 무엇을 바꿨는지 적습니다. 허가증 뒤쪽의 변경신고 기재 내용과 같아야 합니다. · {MADE}")


def permit_check(ws):
    setup(ws)
    for c, w in zip("ABCDEFG", [8, 40, 5, 5, 6, 34, 26]):
        ws.column_dimensions[c].width = w
    title(ws, "G", "변경 전 인허가 영향 확인표",
          "설비·원료·공정·조직을 바꾸는 결재(변경관리)에 붙여 씁니다. '예'나 '확인 필요'가 하나라도 있으면 환경 담당자가 먼저 검토합니다.")
    r = 4
    for lb in ["변경 건 이름", "변경 예정일", "요청 부서·담당", "변경 내용"]:
        ws.merge_cells(f"A{r}:B{r}")
        cell(ws, f"A{r}", lb, f(10, True), HEAD, CENTER)
        boxrange(ws, f"A{r}:B{r}")
        ws.merge_cells(f"C{r}:G{r}")
        boxrange(ws, f"C{r}:G{r}")
        ws.row_dimensions[r].height = 40 if lb == "변경 내용" else 24
        r += 1
    r += 1
    header(ws, r, ["구분", "확인 질문", "예", "아니오", "확인\n필요", "'예'일 때 할 일과 시기", "근거"], h=30)
    r += 1
    for g, q, todo, basis in CHANGE_Q:
        cell(ws, f"A{r}", g, f(10, True), align=CENTER)
        cell(ws, f"B{r}", q)
        for c in "CDE":
            cell(ws, f"{c}{r}", None, align=CENTER)
        cell(ws, f"F{r}", todo, f(9))
        cell(ws, f"G{r}", basis, f(8, color="000000"))
        ws.row_dimensions[r].height = max(30, 13.5 * max(lines(q, 25), lines(todo, 25), lines(basis, 22)) + 8)
        r += 1
    r += 1
    section(ws, r, "G", "검토 결과 (환경 담당자)")
    r += 1
    ws.merge_cells(f"A{r}:G{r}")
    cell(ws, f"A{r}", "[ ] 인허가 영향 없음      [ ] 변경신고 필요 (종류:                              기한:                    )      [ ] 변경허가 필요      [ ] 관할 기관에 문의")
    boxrange(ws, f"A{r}:G{r}")
    ws.row_dimensions[r].height = 30
    r += 2
    r = sign(ws, r, ["요청자", "환경 담당자 검토"], "E", "F", "G", "G")
    r += 1
    note(ws, r, "G",
         f"근거: 대기환경보전법 시행령 제11조제4항, 같은 법 시행규칙 제27조, 물환경보전법 시행규칙 제38조, 폐기물관리법 제17조. 조문의 요건과 예외를 줄여 적었습니다. 실제 판단은 국가법령정보센터 현행 조문으로 확인하고, 애매하면 관할 기관에 문의하세요. 통합허가 사업장(환경오염시설의 통합관리에 관한 법률)은 그 법의 절차를 따로 확인해야 합니다. · {MADE}",
         NOTE, 52)


def permit_timing(ws):
    setup(ws)
    for c, w in zip("ABC", [36, 32, 36]):
        ws.column_dimensions[c].width = w
    title(ws, "C", "변경신고 시기 한눈에 보기", "변경 전에 해야 하는 것과, 바뀐 뒤 기한 안에 해야 하는 것을 구분해 둡니다.")
    header(ws, 4, ["상황", "대기", "수질"])
    rows = [
        ("배출시설 증설·교체·폐쇄", "변경 전", "변경 전\n(배출량 50% 이상 증가, 사업장 종류 변경, 일부 폐쇄 등)"),
        ("방지시설 증설·교체·폐쇄, 처리방법·처리공정 변경", "변경 전", "변경 전"),
        ("원료·연료 변경", "변경 전\n(새 오염물질이 없고 배출량이 늘지 않는 원료, 황 함유량이 낮은 연료는 제외)", "새 수질오염물질이 나오게 되면 변경 전"),
        ("사업장 명칭·대표자 변경", "사유 발생일부터 2개월 이내", "변경한 날부터 2개월 이내"),
        ("배출시설·방지시설 임대", "사유 발생일부터 30일 이내", "변경한 날부터 30일 이내"),
        ("원료 변경 없이 측정·검사에서 새 오염물질 확인", "배출이 확인된 날부터 30일 이내", "측정 결과를 확인한 날 또는 검사 결과를 통보받은 날부터 30일 이내"),
        ("시설 전부 폐쇄, 소재지 변경, 그 밖의 허가·신고 사항 변경", "(허가증·신고증명서에 적힌 사항과 일일 조업시간 변경은 변경 전)", "변경한 날부터 30일 이내"),
    ]
    r = 5
    for a, b, c in rows:
        cell(ws, f"A{r}", a, f(10, True))
        cell(ws, f"B{r}", b, align=CENTER)
        cell(ws, f"C{r}", c, align=CENTER)
        ws.row_dimensions[r].height = max(34, 14 * max(lines(a, 22), lines(b, 20), lines(c, 22)) + 10)
        r += 1
    r += 1
    note(ws, r, "C",
         "허가 사업장에서 규모 합계나 누계가 50% 이상(특정대기유해물질 배출시설은 30% 이상) 늘어나는 증설은 변경신고가 아니라 변경허가 대상입니다(대기환경보전법 시행령 제11조제4항).",
         RED, 34)
    note(ws, r + 1, "C",
         f"근거: 대기환경보전법 시행규칙 제27조제2항·제3항, 물환경보전법 시행규칙 제38조제4항 (2026.11.20. 국가법령정보센터 현행본 확인). 세부 요건과 예외를 줄여 적은 표입니다. · {MADE}",
         NOTE, 34)


def make_permit():
    wb = Workbook()
    wb.remove(wb.active)
    permit_ledger(wb.create_sheet("1 인허가 대장"))
    permit_check(wb.create_sheet("2 변경 전 영향 확인"))
    permit_timing(wb.create_sheet("3 신고 시기 요약"))
    save(wb, "env-permit-ledger.xlsx")


# ───────────────────────── 2. 폐기물 관리 세트 ─────────────────────────
def waste_storage(ws):
    setup(ws, landscape=True)
    heads = ["번호", "폐기물 종류", "구분\n(지정/일반)", "보관 장소", "보관 시작일", "보관 기한\n(일)", "보관 만료일\n(자동 계산)", "현재 보관량", "표지\n부착", "반출 예정일", "비고"]
    widths = [6, 24, 10, 16, 13, 9, 14, 12, 7, 13, 18]
    last = col(len(heads) - 1)
    title(ws, last, "폐기물 보관 현황표",
          "보관을 시작한 날과 보관 기한(일)을 적으면 만료일이 자동으로 계산됩니다. 만료일 전에 반출 일정을 잡으세요.")
    header(ws, 4, heads, widths, h=32)
    r = 5
    for k in range(15):
        for i in range(len(heads)):
            cell(ws, f"{col(i)}{r}", (k + 1) if i == 0 else None, align=CENTER)
        ws[f"G{r}"].value = f'=IF(AND(E{r}<>"",F{r}<>""),E{r}+F{r},"")'
        ws[f"G{r}"].fill = SOFT
        for c in "EGJ":
            ws[f"{c}{r}"].number_format = "yyyy-mm-dd"
        ws.row_dimensions[r].height = 24
        r += 1
    r += 1
    section(ws, r, last, "보관 기한 기준 (폐기물관리법 시행규칙 [별표 5])")
    r += 1
    rules = [
        ("지정폐기물 45일", "폐산·폐알칼리·폐유·폐유기용제·폐촉매·폐흡착제·폐흡수제·폐농약, 폴리클로리네이티드비페닐(PCB) 함유폐기물, 폐수처리 오니 중 유기성 오니 — 보관이 시작된 날부터 45일을 넘겨 보관할 수 없습니다 (제4호나목6))"),
        ("지정폐기물 60일", "그 밖의 지정폐기물 — 60일. 1년간 배출하는 지정폐기물 총량이 3톤 미만인 사업장은 1년 안에서 보관할 수 있습니다 (제4호나목6))"),
        ("사업장일반폐기물 90일", "보관이 시작되는 날부터 90일(중간가공 폐기물은 120일). 보관하는 양이 5톤 미만인 경우 등은 제외됩니다 (제3호다목3))"),
    ]
    for a, b in rules:
        ws.merge_cells(f"A{r}:C{r}")
        cell(ws, f"A{r}", a, f(10, True), align=CENTER)
        boxrange(ws, f"A{r}:C{r}")
        ws.merge_cells(f"D{r}:{last}{r}")
        cell(ws, f"D{r}", b, f(9))
        boxrange(ws, f"D{r}:{last}{r}")
        ws.row_dimensions[r].height = 30
        r += 1
    note(ws, r + 1, last,
         f"의료폐기물, 의료기관 일회용기저귀 등은 기준이 따로 있습니다. 시·도지사나 지방환경관서의 장이 인정한 경우 등 예외는 별표 5 원문을 확인하세요. 별표 5는 2026.3.26. 개정본을 2026.11.20.에 확인했습니다. · {MADE}")


def waste_reconcile(ws):
    setup(ws, landscape=True)
    heads = ["폐기물 종류", "① 배출자 신고·\n처리계획 확인 품목", "② 위탁계약서\n(품목·기간)", "③ 수탁업체\n허가 품목", "④ 올바로 인계 기록\n(최근 날짜·수량)", "⑤ 보관장 실물\n(있음/없음·표지)", "서로\n맞음", "어긋난 점과 조치"]
    widths = [20, 18, 18, 16, 20, 17, 7, 26]
    last = col(len(heads) - 1)
    title(ws, last, "폐기물 위탁 서류 대조표",
          "폐기물 한 종류를 한 줄에 적고, 다섯 가지가 같은 폐기물을 가리키는지 옆으로 맞춰 봅니다. 감사·점검 전에 분기마다 한 번 하면 좋습니다.")
    header(ws, 4, heads, widths, h=34)
    r = blank_rows(ws, 5, 10, len(heads), h=34, number=False)
    r += 1
    section(ws, r, last, "자주 어긋나는 곳")
    r += 1
    for t in [
        "공정이 바뀌어 새 폐기물이 생겼는데 계약서와 수탁업체 허가 품목에는 없다",
        "수탁업체 허가증 사본이 오래돼 지금 허가 내용과 다르다",
        "올바로에 입력한 수량과 계근표 수량이 맞지 않는다",
        "원료·공정을 바꾼 뒤 지정폐기물에 해당하는지 다시 확인하지 않았다 (폐기물관리법 제17조제1항제1호)",
        "계약서에 폐기물의 성질·상태와 취급 시 주의사항이 비어 있다 (시행규칙 제16조의13)",
    ]:
        cell(ws, f"A{r}", "[ ]", align=CENTER)
        ws.merge_cells(f"B{r}:{last}{r}")
        cell(ws, f"B{r}", t)
        boxrange(ws, f"B{r}:{last}{r}")
        ws.row_dimensions[r].height = 22
        r += 1
    r += 1
    r = sign(ws, r, ["대조한 날", "담당자"], "F", "G", "H", "H")
    ws[f"H{r-2}"].value = None
    note(ws, r + 1, last,
         f"근거: 폐기물관리법 제17조, 제18조제3항(전자정보처리프로그램 입력), 같은 법 시행규칙 제16조의13(위탁·수탁의 기준 및 절차). · {MADE}")


VENDOR = [
    ("위탁 전", "수탁처리능력 확인서를 받았다", "시행규칙 제16조의13"),
    ("위탁 전", "폐기물처리업 허가증(또는 처리 신고증명서) 사본이 붙어 있고, 지금 유효한 최신본이다", "시행규칙 제16조의13"),
    ("위탁 전", "방치폐기물 처리이행보증을 확인할 수 있는 서류 사본이 붙어 있다", "시행규칙 제16조의13"),
    ("위탁 전", "폐기물적정처리추진센터 공개 자료 등으로 적법한 수탁자인지 확인했다", "시행규칙 제16조의13"),
    ("계약", "위탁계약을 서면으로 맺었다", "시행규칙 제16조의13"),
    ("계약", "계약서에 폐기물의 종류와 수량, 계약 기간과 비용이 들어 있다", "시행규칙 제16조의13"),
    ("계약", "계약서에 폐기물의 성질·상태와 취급 시 주의사항이 들어 있다", "시행규칙 제16조의13"),
    ("계약", "계약서를 체결일부터 3년간 보관한다", "시행규칙 제16조의13"),
    ("계약", "우리가 맡기는 폐기물이 수탁업체 허가 품목에 모두 들어 있다", "자체 확인"),
    ("배출", "배출할 때마다 인계·인수 내용을 전자정보처리프로그램(올바로)에 입력한다", "법 제18조제3항"),
    ("배출", "올바로 수량과 계근표·반출 기록이 맞는지 확인한다", "자체 확인"),
    ("배출", "해당 폐기물이면 유해성 정보자료를 만들어 수탁자에게 제공했다", "법 제18조의2제3항"),
    ("사후", "수탁업체의 허가 변경·행정처분 여부를 정기적으로 확인한다", "자체 확인"),
]


def waste_vendor(ws):
    setup(ws)
    for c, w in zip("ABCDEF", [6, 10, 54, 18, 6, 7]):
        ws.column_dimensions[c].width = w
    title(ws, "F", "폐기물 수탁업체 확인표", "수탁업체 한 곳마다 한 장씩 씁니다. 해마다, 그리고 허가증이 바뀔 때마다 다시 확인합니다.")
    r = 4
    for lb in ["수탁업체 이름", "위탁하는 폐기물", "허가(신고) 번호", "계약 기간"]:
        ws.merge_cells(f"A{r}:B{r}")
        cell(ws, f"A{r}", lb, f(10, True), HEAD, CENTER)
        boxrange(ws, f"A{r}:B{r}")
        ws.merge_cells(f"C{r}:F{r}")
        boxrange(ws, f"C{r}:F{r}")
        ws.row_dimensions[r].height = 24
        r += 1
    r += 1
    header(ws, r, ["번호", "단계", "확인 사항", "근거 (폐기물관리법)", "예", "아니오"])
    r += 1
    for i, (g, q, b) in enumerate(VENDOR, 1):
        cell(ws, f"A{r}", i, align=CENTER)
        cell(ws, f"B{r}", g, align=CENTER)
        cell(ws, f"C{r}", q)
        cell(ws, f"D{r}", b, f(9), align=CENTER)
        for c in "EF":
            cell(ws, f"{c}{r}", None, align=CENTER)
        ws.row_dimensions[r].height = max(26, 14 * lines(q, 36) + 10)
        r += 1
    r += 1
    note(ws, r, "F",
         "위탁한 폐기물이 부적정하게 처리되면, 위탁 절차를 지키지 않았거나 그 밖의 귀책사유가 있는 배출자는 조치명령 대상이 될 수 있습니다(폐기물관리법 제48조제1항제3호).",
         RED, 34)
    r += 2
    r = sign(ws, r, ["확인한 날", "담당자"], "C", "C", "D", "F")
    ws[f"D{r-2}"].value = None
    note(ws, r + 1, "F",
         f"'자체 확인'은 법정 항목이 아니라 서류가 서로 맞는지 보려고 넣은 항목입니다. 근거 조문은 줄여 적었으니 정확한 문구는 국가법령정보센터 현행본을 확인하세요. · {MADE}")


def waste_sign(ws):
    """지정폐기물 보관표지 (별표 5 제4호나목9) 표지판의 보기)"""
    setup(ws, landscape=True)
    for c, w in zip("ABCD", [30, 34, 22, 34]):
        ws.column_dimensions[c].width = w
    big = Font(name=FONT, size=30, bold=True)
    lab = Font(name=FONT, size=16, bold=True)
    ws.merge_cells("A1:D1")
    c = cell(ws, "A1", "지정폐기물 보관표지", big, YELLOW, CENTER)
    boxrange(ws, "A1:D1")
    ws.row_dimensions[1].height = 62

    def row(r, label, h=46, value=None):
        cell(ws, f"A{r}", label, lab, YELLOW, Alignment(vertical="center", wrap_text=True, indent=1))
        ws.merge_cells(f"B{r}:D{r}")
        cell(ws, f"B{r}", value, Font(name=FONT, size=16), YELLOW, Alignment(vertical="center", indent=1))
        boxrange(ws, f"B{r}:D{r}")
        ws.row_dimensions[r].height = h

    row(2, "① 폐기물의 종류")
    row(3, "② 보관가능용량", value="                                        톤")
    row(4, "③ 관리책임자")
    row(5, "④ 보관기간", value="                    ～                         (        일간)")
    row(6, "⑤ 취급 시 주의사항", h=40, value="○ 보관 시:")
    row(7, None, h=40, value="○ 운반 시:")
    row(8, None, h=40, value="○ 처리 시:")
    ws.merge_cells("A6:A8")
    boxrange(ws, "A6:A8")
    for r in (6, 7, 8):
        ws[f"A{r}"].fill = YELLOW
    row(9, "⑥ 운반(처리)예정장소")
    ws.merge_cells("A11:D11")
    cell(ws, "A11",
         "쓰는 법: 이 시트는 표지 내용의 본입니다. 보관창고에는 가로 60cm × 세로 40cm 이상으로 만들어 사람이 쉽게 볼 수 있는 곳에 붙입니다(A2 용지는 가로가 59.4cm라 조금 모자랍니다). 드럼 같은 소형 용기에는 가로 15cm × 세로 10cm 이상으로 붙입니다. 색은 노란색 바탕에 검은색 선과 검은색 글자입니다. 드럼 등 용기에 보관하면 용기별(같은 종류가 여러 개면 종류별)로 폐기물의 종류·양·배출업소를 알 수 있게 적습니다.",
         f(9), border=False)
    ws.row_dimensions[11].height = 58
    ws.merge_cells("A12:D12")
    cell(ws, "A12", f"근거: 폐기물관리법 시행규칙 [별표 5] 제4호나목9) (2026.3.26. 개정본, 2026.11.20. 확인). 인쇄할 때는 이 안내 두 줄을 빼고 표지만 인쇄하세요. · {MADE}", NOTE, border=False)
    ws.row_dimensions[12].height = 28
    ws.print_area = "A1:D9"


def make_waste():
    wb = Workbook()
    wb.remove(wb.active)
    waste_storage(wb.create_sheet("1 보관 현황표"))
    waste_reconcile(wb.create_sheet("2 위탁 서류 대조표"))
    waste_vendor(wb.create_sheet("3 수탁업체 확인표"))
    waste_sign(wb.create_sheet("4 지정폐기물 보관표지"))
    save(wb, "waste-management-set.xlsx")


# ───────────────────────── 3. 환경 법정 기록·측정 달력 ─────────────────────────
CAL = [
    ("대기", "배출시설·방지시설 운영기록 (4·5종 사업장: 운영기록부)", "대기 시행규칙 제36조", "매일", "최종 기재일부터 1년"),
    ("대기", "배출시설·방지시설 운영기록 (1·2·3종 사업장: 고시된 전산 방법)", "대기 시행규칙 제36조", "전산 기록", "전산 보존"),
    ("대기", "자가측정 (대상·항목·주기는 시행규칙 별표 11)", "대기 시행규칙 제52조", "별표 11 주기", "여과지·시료채취기록지: 측정한 날부터 6개월"),
    ("대기", "자가측정 결과보고 (전산으로 기록·보존하지 않는 경우)", "대기 시행규칙 제52조제3항", "상반기분 7월 31일까지, 하반기분 다음 해 1월 31일까지", "—"),
    ("대기", "대행 측정 확인 (시험기준대로 측정·기록했는지 환경기술인이 확인)", "대기 시행규칙 제54조", "측정할 때마다", "여과지·기록지 날짜별 보관"),
    ("수질", "폐수배출시설·수질오염방지시설 운영일지", "물환경 시행규칙 제49조제1항", "매일", "최종 기록일부터 1년 (폐수무방류배출시설은 3년)"),
    ("폐기물", "지정폐기물 보관 기한 관리", "폐기물 시행규칙 별표 5 제4호나목6)", "보관 시작일부터 45일 또는 60일", "—"),
    ("폐기물", "사업장일반폐기물 보관 기한 관리", "폐기물 시행규칙 별표 5 제3호다목3)", "보관 시작일부터 90일 (5톤 미만 등 제외)", "—"),
    ("폐기물", "인계·인수 내용 전자정보처리프로그램(올바로) 입력", "폐기물관리법 제18조제3항", "배출할 때마다", "전산 보존"),
    ("폐기물", "위탁계약서 보관", "폐기물 시행규칙 제16조의13", "계약할 때", "체결일부터 3년"),
    ("폐기물", "폐기물 발생·배출·처리 장부 (올바로를 쓰면 장부 대신 인정)", "폐기물관리법 제36조제1항", "발생·배출할 때", "마지막 기록일부터 3년"),
    ("공통", "사업장 명칭·대표자 변경신고 (대기·수질)", "대기 시행규칙 제27조, 물환경 시행규칙 제38조", "바뀐 날부터 2개월 이내", "—"),
]


def cal_sheet(ws):
    setup(ws, landscape=True)
    heads = ["번호", "분야", "항목", "근거 조문", "주기·기한", "보존 기간", "담당"] + [f"{m}월" for m in range(1, 13)]
    widths = [5, 8, 34, 22, 22, 22, 9] + [4.4] * 12
    last = col(len(heads) - 1)
    title(ws, last, "환경 법정 기록·측정 달력 (        년)",
          "기록을 담당자가 아니라 달력에 묶어 둡니다. 한 줄에 한 항목씩, 한 달이 끝나면 그 달 칸에 ○(했음) ×(빠짐) /(해당 없음)를 적습니다.")
    header(ws, 4, heads, widths, h=26)
    r = 5
    for i, (g, item, basis, cyc, keep) in enumerate(CAL, 1):
        vals = [i, g, item, basis, cyc, keep, None] + [None] * 12
        for k, v in enumerate(vals):
            cell(ws, f"{col(k)}{r}", v, f(9) if k in (3, 4, 5) else f(), align=WRAP if k in (2, 3, 4, 5) else CENTER)
        ws.row_dimensions[r].height = max(28, 13.5 * max(lines(item, 22), lines(basis, 15), lines(cyc, 15), lines(keep, 15)) + 8)
        r += 1
    ws.merge_cells(f"A{r}:{last}{r}")
    cell(ws, f"A{r}", "아래 칸에는 우리 사업장에 해당하는 항목을 더 적습니다 (예: 수질 자가측정, 굴뚝자동측정기기 관리, 화학물질 관련 점검·보고, 소음·진동, 각종 실적 보고, 법정 교육, 사내 기준). 근거 조문과 주기를 꼭 같이 적으세요.",
         GREY, SOFT)
    boxrange(ws, f"A{r}:{last}{r}")
    ws.row_dimensions[r].height = 30
    r += 1
    r = blank_rows(ws, r, 8, len(heads), h=26, number=False)
    note(ws, r + 1, last,
         f"미리 적어 둔 12줄은 2026.11.20.에 국가법령정보센터 현행 조문으로 확인한 내용을 줄여 옮긴 것입니다. 사업장 종류와 시설에 따라 해당하지 않는 줄은 지우세요. 법령이 바뀌면 고쳐 써야 합니다. · {MADE}",
         NOTE, 30)


def handover_sheet(ws):
    setup(ws, landscape=True)
    heads = ["번호", "업무 (기록·측정·보고)", "주기", "다음 마감일", "기록이 있는 곳\n(파일·전산·서류철)", "대행업체·연락처", "주의할 점", "확인"]
    widths = [6, 28, 12, 13, 24, 20, 26, 7]
    last = col(len(heads) - 1)
    title(ws, last, "환경 업무 인수인계 확인표",
          "담당자가 바뀔 때 '업무 목록'이 아니라 '주기와 다음 마감일'을 넘깁니다. 넘겨받는 사람이 한 줄씩 확인하고 표시합니다.")
    r = 4
    for lb in ["넘기는 사람", "넘겨받는 사람", "인수인계 날짜"]:
        ws.merge_cells(f"A{r}:B{r}")
        cell(ws, f"A{r}", lb, f(10, True), HEAD, CENTER)
        boxrange(ws, f"A{r}:B{r}")
        ws.merge_cells(f"C{r}:{last}{r}")
        boxrange(ws, f"C{r}:{last}{r}")
        ws.row_dimensions[r].height = 22
        r += 1
    r += 1
    header(ws, r, heads, widths, h=32)
    r = blank_rows(ws, r + 1, 12, len(heads), h=26)
    note(ws, r + 1, last, f"전산 시스템(올바로 등) 계정과 인증서는 누가 관리하는지도 함께 넘기세요. · {MADE}")


def stop_sheet(ws):
    setup(ws, landscape=True)
    heads = ["번호", "시설 이름", "정지 시작", "재가동", "정지 사유", "정지 중 조치 (방지시설·측정 등)", "기록한 사람"]
    widths = [6, 24, 14, 14, 26, 32, 12]
    last = col(len(heads) - 1)
    title(ws, last, "시설 가동 정지 기록",
          "멈춘 기간도 기록합니다. '가동 없음'이라고 적힌 기록은 빈칸이 아니라 정보입니다. 나중에 측정을 건너뛴 것처럼 보이는 일을 막아 줍니다.")
    header(ws, 4, heads, widths)
    r = blank_rows(ws, 5, 14, len(heads), h=26)
    note(ws, r + 1, last, f"정지 기간에 해당하는 운영기록부·운영일지에도 '가동 없음'을 적어 두세요. · {MADE}")


def make_calendar():
    wb = Workbook()
    wb.remove(wb.active)
    cal_sheet(wb.create_sheet("1 기록·측정 달력"))
    handover_sheet(wb.create_sheet("2 인수인계 확인표"))
    stop_sheet(wb.create_sheet("3 가동 정지 기록"))
    save(wb, "env-records-calendar.xlsx")


# ───────────────────────── 4. 환경 일일 순찰 점검표 ─────────────────────────
PATROL = [
    ("대기", "배출시설을 돌리는 동안 방지시설이 함께 정상 가동되고 있다"),
    ("대기", "후드·덕트에 찢어지거나 새는 곳이 없다"),
    ("대기", "차압계 등 계기 값이 평소 범위 안에 있다"),
    ("대기", "굴뚝·배출구에서 평소와 다른 연기·냄새가 나지 않는다"),
    ("수질", "폐수처리시설이 정상 가동되고 약품이 충분하다"),
    ("수질", "pH 등 계기 값이 평소 범위 안에 있다"),
    ("수질", "폐수·약품·기름이 빗물 배수로로 흘러갈 곳이 없다"),
    ("수질", "빗물 맨홀·배수로에 기름띠나 평소와 다른 색이 없다"),
    ("폐기물", "폐기물을 종류별로 구분해 보관하고 표지가 붙어 있다"),
    ("폐기물", "용기 뚜껑이 닫혀 있고 새는 곳이 없다"),
    ("폐기물", "보관 기한이 다가온 폐기물이 없다 (보관 현황표 확인)"),
    ("폐기물", "보관장 밖에 내놓은 폐기물이 없다"),
    ("화학물질", "용기에 내용물 표시가 있고, 새더라도 밖으로 흘러가지 않는 곳에 보관한다"),
    ("화학물질", "샌 흔적이 없고 흡착재 등 방제 물품이 제자리에 있다"),
    ("소음·악취", "부지 경계에서 평소와 다른 소음·악취가 없다"),
    ("기록", "오늘 운영기록(운영기록부·운영일지)을 적었다"),
]


def make_patrol():
    wb = Workbook()
    wb.remove(wb.active)
    ws = wb.create_sheet("환경 일일 순찰")
    setup(ws)
    for c, w in zip("ABCDEF", [11, 46, 7, 7, 8, 22]):
        ws.column_dimensions[c].width = w
    title(ws, "F", "환경 일일 순찰 점검표", "하루 한 번 현장을 돌며 확인합니다. 불량은 조치 내용과 끝낸 날까지 적습니다.")
    r = 4
    for lb in ["점검 일시", "날씨", "점검자"]:
        field(ws, r, lb)
        r += 1
    r += 1
    header(ws, r, ["구분", "점검 내용", "양호", "불량", "해당없음", "조치 내용"])
    r += 1
    start, prev = r, PATROL[0][0]
    for g, q in PATROL + [(None, None)]:
        if g != prev:
            cell(ws, f"A{start}", prev, f(10, True), align=CENTER)
            if r - 1 > start:
                ws.merge_cells(f"A{start}:A{r-1}")
            boxrange(ws, f"A{start}:A{r-1}")
            start, prev = r, g
        if g is None:
            break
        cell(ws, f"B{r}", q)
        for c in "CDEF":
            cell(ws, f"{c}{r}", None, align=CENTER)
        ws.row_dimensions[r].height = max(24, 14 * lines(q, 30) + 10)
        r += 1
    cell(ws, f"A{r}", "추가", f(10, True), HEAD, CENTER)
    ws.merge_cells(f"B{r}:F{r}")
    cell(ws, f"B{r}", "아래 칸에는 우리 사업장 시설에 맞는 항목을 넣습니다 (예: 방지시설별 계기 기준값, 저장탱크 수위, 악취 방지시설).", GREY)
    boxrange(ws, f"B{r}:F{r}")
    r += 1
    for _ in range(4):
        for c in "ABCDEF":
            cell(ws, f"{c}{r}", None, align=CENTER)
        ws.row_dimensions[r].height = 24
        r += 1
    r += 1
    r = sign(ws, r, ["점검자", "환경 담당자 확인"], "C", "D", "E", "F")
    note(ws, r + 1, "F",
         f"법령이 정한 서식이 아니라 사업장이 스스로 쓰는 자율 점검표입니다. 법정 운영기록(운영기록부·운영일지)과 자가측정은 따로 해야 합니다. 항목을 사업장 시설에 맞게 고쳐 쓰세요. · {MADE}",
         NOTE, 34)
    save(wb, "env-daily-patrol.xlsx")


# ───────────────────────── 5. 시정조치 계획서 ─────────────────────────
FIVE = [
    ("① 원인", "왜 생겼나. 사람 탓이 아니라 체계(절차·서식·결재선)의 틈으로 씁니다.", 54),
    ("② 즉시 조치", "지금 당장 무엇을 했나. 한 날짜와 증빙을 적습니다.", 46),
    ("③ 근본 조치", "다시 생기지 않게 무엇을 바꾸나. 사람이 바뀌어도 남는 장치(서식·결재선·달력·점검표)를 적습니다.", 54),
    ("④ 기한과 담당", "언제까지, 누가. 부서가 아니라 직책으로 적습니다.", 36),
    ("⑤ 확인 방법", "끝났다는 것을 무엇으로 증명하나. 재점검 때 내놓을 증빙을 적습니다.", 46),
]
EXAMPLE = [
    "구매 부서의 원료 변경이 환경안전 검토 없이 진행되는 절차의 틈",
    "○월 ○일 변경신고서 제출, 접수증 첨부",
    "변경관리(MOC) 서식에 '인허가 영향' 검토 칸 추가, 원료 변경 결재선에 환경안전 합의 추가",
    "서식 개정 ○월 ○일까지 / 환경안전팀장",
    "개정 서식 사본, 이후 3개월간 원료 변경 건의 환경안전 검토 기록",
]


def cap_form(ws, example=False):
    setup(ws)
    for c, w in zip("ABCDEF", [16, 18, 16, 14, 14, 20]):
        ws.column_dimensions[c].width = w
    title(ws, "F", "시정조치 계획서" + (" (작성 예)" if example else ""),
          "지적 한 건에 한 장씩 씁니다. 다섯 줄이 모두 채워져야 계획입니다.")
    ex = f(10, color="000000")
    r = 4
    info = [("지적 받은 날", None), ("지적한 곳", "본사 환경안전 감사" if example else None),
            ("지적 사항", "배출시설 원료 변경 후 변경신고 누락" if example else None),
            ("근거", "[ ] 법령 (조문:                              )      [ ] 사내 기준      [ ] 권고")]
    for lb, v in info:
        field(ws, r, lb, value=v, font=ex if (example and v and lb != "근거") else None, h=30 if lb == "지적 사항" else 24)
        r += 1
    field(ws, r, "무게", value="[ ] 법적 결과(처벌·행정처분)가 걸림 — 먼저 처리      [ ] 사내 기준      [ ] 개선 권고")
    r += 2
    for i, (lb, guide, h) in enumerate(FIVE):
        cell(ws, f"A{r}", lb, f(11, True), HEAD, CENTER)
        ws.merge_cells(f"B{r}:F{r}")
        cell(ws, f"B{r}", guide, GREY, SOFT)
        boxrange(ws, f"B{r}:F{r}")
        ws.row_dimensions[r].height = 30 if len(guide) > 44 else 22
        r += 1
        ws.merge_cells(f"A{r}:F{r}")
        cell(ws, f"A{r}", EXAMPLE[i] if example else None, ex if example else f(), align=Alignment(wrap_text=True, vertical="top"))
        boxrange(ws, f"A{r}:F{r}")
        ws.row_dimensions[r].height = h
        r += 1
    r += 1
    field(ws, r, "이견이 있을 때", value="이견 — 근거:                    조문 /                    기록   (근거를 붙인 이견만 적습니다)", h=28)
    r += 2
    section(ws, r, "F", "완료 확인")
    r += 1
    for lb in ["완료한 날", "증빙 (붙임 목록)"]:
        field(ws, r, lb, h=30 if "증빙" in lb else 24)
        r += 1
    r += 1
    r = sign(ws, r, ["작성자", "부서장 확인"], "C", "D", "E", "F")
    note(ws, r + 1, "F",
         ("예시는 설명을 위해 만든 것으로 특정 사업장의 사례가 아닙니다. " if example else "")
         + f"'담당자 교육'만으로는 근본 조치가 되기 어렵습니다. 담당자가 바뀌면 같은 일이 다시 생기기 때문입니다. · {MADE}",
         NOTE, 30)


def cap_ledger(ws):
    setup(ws, landscape=True)
    heads = ["번호", "지적 받은 날", "지적 사항", "무게\n(법령/사내/권고)", "근본 조치", "기한", "담당", "완료한 날", "증빙 확인"]
    widths = [6, 12, 32, 13, 32, 12, 12, 12, 10]
    last = col(len(heads) - 1)
    title(ws, last, "시정조치 관리대장", "지적 사항을 한 줄씩 모아 기한과 완료 여부를 한눈에 봅니다. 같은 지적이 두 번 나오지 않는지 확인하는 용도입니다.")
    header(ws, 4, heads, widths, h=32)
    r = blank_rows(ws, 5, 15, len(heads), h=28)
    note(ws, r + 1, last, f"법적 결과가 걸린 항목부터 기한을 짧게 잡습니다. · {MADE}")


def make_cap():
    wb = Workbook()
    wb.remove(wb.active)
    cap_form(wb.create_sheet("1 시정조치 계획서"))
    cap_form(wb.create_sheet("2 작성 예"), example=True)
    cap_ledger(wb.create_sheet("3 관리대장"))
    save(wb, "corrective-action-plan.xlsx")


if __name__ == "__main__":
    make_permit()
    make_waste()
    make_calendar()
    make_patrol()
    make_cap()
