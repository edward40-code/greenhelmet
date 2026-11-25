# 도급 안전보건 관리 세트 xlsx 생성기
# 출처 (국가법령정보센터 2026-11-25 확인):
#   산업안전보건법 제61조~제66조, 제167조, 제169조, 제170조, 제172조, 제175조
#   같은 법 시행령 제52조, 제53조, 제53조의2, 제54조 (대통령령 제36540호, 2026. 8. 1. 시행)
#   같은 법 시행규칙 제79조~제83조 (고용노동부령 제477호, 2026. 8. 1. 시행)
# 법 조문에 없는 항목은 '현장 권장'으로 따로 적는다.
# 실행: python scripts/make_contractor.py → public/library/contractor-safety-set.xlsx (그다음 plain_colors.py)
from make_checklists import OUT, HEAD, CENTER, WRAP, f, setup, cell, boxrange
from make_loto import title, note, section, heads, NOTE, FOOT
from make_risk_set import widths, label, blank, checks

DUTIES = [
    ("안전 및 보건에 관한 협의체 구성·운영 (매월 1회 이상 회의, 결과 기록·보존)", "법 제64조①1, 규칙 제79조"),
    ("작업장 순회점검 (건설업·제조업 등 2일에 1회 이상, 그 밖 1주일에 1회 이상)", "법 제64조①2, 규칙 제80조"),
    ("관계수급인이 하는 정기·채용 시·변경 시·특별교육에 장소·자료 제공 등 지원", "법 제64조①3, 규칙 제80조③"),
    ("관계수급인이 하는 유해·위험 작업 특별교육(법 제29조제3항)의 실시 확인", "법 제64조①4"),
    ("발파, 화재·폭발, 붕괴, 지진 등에 대비한 경보체계 운영과 대피 훈련", "법 제64조①5"),
    ("휴게·세면·목욕·세탁·탈의·수면시설 장소 제공 또는 이용 협조", "법 제64조①6, 규칙 제81조"),
    ("같은 장소 작업의 시기·내용, 안전·보건조치 확인", "법 제64조①7"),
    ("작업 혼재로 화재·폭발 등 위험 우려 시 작업시기·내용 조정", "법 제64조①8, 영 제53조의2"),
    ("근로자와 함께 하는 정기·수시 합동 안전·보건점검 (분기 1회 이상, 건설업 등 2개월 1회 이상)", "법 제64조②, 규칙 제82조"),
    ("질식·붕괴 위험 작업 등 도급 시 작업 시작 전 안전·보건 정보 문서 제공", "법 제65조, 규칙 제83조"),
]

MIX = ["화재·폭발", "끼임", "기계 충돌", "추락", "낙하·비래", "넘어짐·무너짐", "붕괴", "질식·중독"]


def sheet_status(ws):
    setup(ws, landscape=True)
    cols = list("ABCDEFGHIJK")
    widths(ws, cols, [5, 16, 22, 16, 7, 14, 10, 10, 10, 12, 12])
    title(ws, "K", "도급 현황과 도급인 의무 확인표",
          "관계수급인 근로자가 도급인의 사업장에서 작업하면 도급인은 아래 의무를 이행합니다 (산업안전보건법 제63조·제64조).")
    r = 4
    label(ws, r, "A", "연도"); blank(ws, f"B{r}:B{r}"); label(ws, r, "C", "사업장"); blank(ws, f"D{r}:F{r}")
    label(ws, r, "G", "총괄책임자"); blank(ws, f"H{r}:K{r}")
    ws.row_dimensions[r].height = 24; r += 2
    section(ws, r, "K", "1. 관계수급인 현황"); r += 1
    names = ["번호", "업체명", "도급 작업", "작업 장소", "인원", "계약 기간", "적격 수급인\n확인", "정보 제공\n대상", "정보 제공일", "협의체 참여", "비고"]
    heads(ws, r, cols, names); ws.row_dimensions[r].height = 30; r += 1
    for i in range(1, 9):
        cell(ws, f"A{r}", i, align=CENTER)
        for col in cols[1:]:
            cell(ws, f"{col}{r}", None, f(9), align=CENTER)
        cell(ws, f"G{r}", "[ ]", align=CENTER)
        cell(ws, f"H{r}", "예 · 아니오", f(8), align=CENTER)
        cell(ws, f"J{r}", "[ ]", align=CENTER)
        ws.row_dimensions[r].height = 22; r += 1
    r += 1
    section(ws, r, "K", "2. 도급인 의무 이행 확인 (월별 점검)"); r += 1
    ws.merge_cells(f"B{r}:G{r}"); ws.merge_cells(f"H{r}:I{r}"); ws.merge_cells(f"J{r}:K{r}")
    for col, h in [("A", "확인"), ("B", "의무"), ("H", "근거"), ("J", "기록 위치")]:
        cell(ws, f"{col}{r}", h, f(10, True), HEAD, CENTER)
    boxrange(ws, f"A{r}:K{r}"); ws.row_dimensions[r].height = 22; r += 1
    for text, basis in DUTIES:
        cell(ws, f"A{r}", "[ ]", align=CENTER)
        ws.merge_cells(f"B{r}:G{r}"); cell(ws, f"B{r}", text, f(9))
        ws.merge_cells(f"H{r}:I{r}"); cell(ws, f"H{r}", basis, f(8), align=CENTER)
        ws.merge_cells(f"J{r}:K{r}"); cell(ws, f"J{r}", None, f(8), align=CENTER)
        boxrange(ws, f"A{r}:K{r}"); ws.row_dimensions[r].height = 26; r += 1
    note(ws, r,
         "K",
         "안전보건총괄책임자: 관계수급인 근로자를 포함한 상시근로자 100명(선박·보트 건조업, 1차 금속 제조업, 토사석 광업 50명) 이상 또는 총공사금액 20억 원 이상 건설업 (영 제52조). "
         "적격 수급인 확인은 산업재해 예방조치 능력을 갖춘 사업주에게 도급하라는 제61조에 따른 것이며 확인 방법은 사업장이 정합니다 (현장 권장). · " + FOOT,
         NOTE, 40)


def sheet_council(ws):
    setup(ws)
    widths(ws, "ABCDEFG", [6, 16, 16, 16, 16, 12, 12])
    title(ws, "G", "안전 및 보건에 관한 협의체 회의록",
          "도급인과 수급인 전원으로 구성하고 매월 1회 이상 정기 회의를 열어 결과를 기록·보존합니다 (산업안전보건법 시행규칙 제79조).")
    r = 4
    label(ws, r, "A", "회차"); blank(ws, f"B{r}:B{r}"); label(ws, r, "C", "일시"); blank(ws, f"D{r}:E{r}")
    label(ws, r, "F", "장소"); blank(ws, f"G{r}:G{r}"); ws.row_dimensions[r].height = 24; r += 2
    section(ws, r, "G", "1. 참석자 (도급인과 수급인 전원)"); r += 1
    heads(ws, r, "ABCDEFG", ["구분", "회사", "", "직위", "성명", "서명", ""])
    ws.merge_cells(f"B{r}:C{r}"); ws.merge_cells(f"F{r}:G{r}"); boxrange(ws, f"A{r}:G{r}")
    r += 1
    for i in range(7):
        cell(ws, f"A{r}", "도급인" if i == 0 else "수급인", f(9), align=CENTER)
        for col in "BCDEFG":
            cell(ws, f"{col}{r}", None, f(9), align=CENTER)
        ws.merge_cells(f"B{r}:C{r}"); ws.merge_cells(f"F{r}:G{r}")
        ws.row_dimensions[r].height = 22; r += 1
    r += 1
    section(ws, r, "G", "2. 협의 사항 (시행규칙 제79조제2항)"); r += 1
    items = ["작업의 시작 시간", "작업 또는 작업장 간의 연락방법", "재해발생 위험이 있는 경우 대피방법",
             "작업장 위험성평가의 실시에 관한 사항 (법 제36조)", "사업주와 수급인 또는 수급인 상호 간의 연락 방법 및 작업공정의 조정"]
    for i, it in enumerate(items, 1):
        ws.merge_cells(f"A{r}:B{r}"); cell(ws, f"A{r}", f"{i}. {it}", f(9, True))
        ws.merge_cells(f"C{r}:G{r}"); cell(ws, f"C{r}", None, f(9))
        boxrange(ws, f"A{r}:G{r}"); ws.row_dimensions[r].height = 46; r += 1
    r += 1
    section(ws, r, "G", "3. 결정 사항과 조치"); r += 1
    heads(ws, r, "ABCDEFG", ["번호", "결정 사항", "", "", "담당", "기한", "완료"])
    ws.merge_cells(f"B{r}:D{r}"); r += 1
    for i in range(1, 5):
        cell(ws, f"A{r}", i, align=CENTER)
        ws.merge_cells(f"B{r}:D{r}"); cell(ws, f"B{r}", None, f(9)); boxrange(ws, f"B{r}:D{r}")
        for col in "EF":
            cell(ws, f"{col}{r}", None, f(9), align=CENTER)
        cell(ws, f"G{r}", "[ ]", align=CENTER)
        ws.row_dimensions[r].height = 26; r += 1
    note(ws, r, "G", "협의체를 구성·운영하지 않으면 500만 원 이하 벌금입니다 (법 제172조). 회의 결과는 기록·보존해야 하며(시행규칙 제79조제3항), 3년 이상 보관을 권장합니다 (현장 권장). · " + FOOT, NOTE, 30)


def sheet_patrol(ws):
    setup(ws, landscape=True)
    names = ["번호", "일자", "점검자", "장소·공정", "수급업체", "작업 내용", "지적 사항", "시정 요구", "조치 결과", "확인일"]
    cols = list("ABCDEFGHIJ")
    widths(ws, cols, [5, 10, 10, 16, 14, 18, 30, 8, 24, 10])
    title(ws, "J", "작업장 순회점검 일지",
          "건설업, 제조업, 토사석 광업, 서적·잡지 등 인쇄물 출판업, 음악 등 오디오물 출판업, 금속·비금속 원료 재생업은 2일에 1회 이상, 그 밖의 사업은 1주일에 1회 이상 순회점검합니다 (시행규칙 제80조).")
    r = 4
    for col, h in zip(cols, names):
        cell(ws, f"{col}{r}", h, f(9, True), HEAD, CENTER)
    ws.row_dimensions[r].height = 24; r += 1
    for i in range(1, 19):
        cell(ws, f"A{r}", i, align=CENTER)
        for col in cols[1:]:
            cell(ws, f"{col}{r}", None, f(9), align=WRAP if col in "DFGI" else CENTER)
        cell(ws, f"H{r}", "[ ]", align=CENTER)
        ws.row_dimensions[r].height = 26; r += 1
    note(ws, r, "J",
         "관계수급인은 순회점검을 거부·방해·기피해서는 안 되며 시정요구에 따라야 합니다 (시행규칙 제80조제2항). "
         "보호구 착용 지시처럼 관계수급인 근로자의 작업행동에 관한 직접적인 조치는 도급인의 안전·보건조치에서 제외되므로 지적은 수급업체 관리자에게 전달합니다 (법 제63조 단서). · " + FOOT,
         NOTE, 34)


def sheet_mix(ws):
    setup(ws, landscape=True)
    cols = [chr(ord("A") + i) for i in range(6 + len(MIX) + 1)]
    last = cols[-1]
    widths(ws, cols, [5, 10, 14, 17, 17, 17] + [8] * len(MIX) + [26])
    title(ws, last, "혼재 작업 확인·조정표",
          "같은 장소에서 도급인과 관계수급인 등이 함께 작업하면 작업시기·내용과 안전·보건조치를 확인하고, 아래 위험이 우려되면 작업시기·내용을 조정합니다 (법 제64조제1항제7호·제8호, 영 제53조의2).")
    r = 4
    names = ["번호", "일자", "장소", "도급인 작업", "수급업체 A 작업", "수급업체 B 작업"] + MIX + ["조정 내용 (시기·순서·구역 분리)"]
    for col, h in zip(cols, names):
        cell(ws, f"{col}{r}", h, f(9, True), HEAD, CENTER)
    ws.row_dimensions[r].height = 34; r += 1
    for i in range(1, 15):
        cell(ws, f"A{r}", i, align=CENTER)
        for col in cols[1:6]:
            cell(ws, f"{col}{r}", None, f(9), align=WRAP)
        for col in cols[6:-1]:
            cell(ws, f"{col}{r}", "[ ]", align=CENTER)
        cell(ws, f"{last}{r}", None, f(9))
        ws.row_dimensions[r].height = 28; r += 1
    note(ws, r, last,
         "위험 칸은 영 제53조의2 각 호의 순서입니다: 화재·폭발 / 동력 기계·설비 끼임 / 차량계 하역운반기계·건설기계·양중기 충돌 / 추락 / 낙하·비래 / 기계·기구 넘어짐·무너짐 / 토사·구축물 붕괴 / 산소결핍·유해가스 질식·중독. "
         "확인·조정을 하지 않으면 500만 원 이하 벌금입니다 (법 제172조). · " + FOOT,
         NOTE, 36)


def sheet_joint(ws):
    setup(ws)
    widths(ws, "ABCDEFG", [6, 30, 14, 10, 10, 10, 22])
    title(ws, "G", "도급사업 합동 안전·보건점검표",
          "도급인, 관계수급인, 도급인·관계수급인 근로자 각 1명으로 점검반을 꾸려 정기 점검합니다. 건설업·선박 및 보트 건조업 2개월에 1회 이상, 그 밖 분기에 1회 이상 (시행규칙 제82조).")
    r = 4
    label(ws, r, "A", "점검일"); blank(ws, f"B{r}:B{r}"); label(ws, r, "C", "구분"); blank(ws, f"D{r}:G{r}")
    cell(ws, f"D{r}", "정기 · 수시", f(9), align=CENTER)
    ws.row_dimensions[r].height = 24; r += 2
    section(ws, r, "G", "1. 점검반 구성 (시행규칙 제82조제1항)"); r += 1
    heads(ws, r, "ABCDEFG", ["번호", "구분", "회사", "직위", "성명", "서명", "비고"]); r += 1
    roles = ["도급인 (또는 그 사업장 안전보건관리책임자)", "관계수급인 (또는 그 사업장 안전보건관리책임자)",
             "도급인 근로자 1명", "관계수급인 근로자 1명 (해당 공정)", "", ""]
    for i, role in enumerate(roles, 1):
        cell(ws, f"A{r}", i, align=CENTER)
        cell(ws, f"B{r}", role or None, f(8))
        for col in "CDEFG":
            cell(ws, f"{col}{r}", None, f(9), align=CENTER)
        ws.row_dimensions[r].height = 24; r += 1
    r += 1
    section(ws, r, "G", "2. 점검 결과"); r += 1
    heads(ws, r, "ABCDEFG", ["번호", "점검 장소·내용", "수급업체", "양호", "불량", "조치 기한", "조치 결과"]); r += 1
    samples = ["협의체 결정 사항 이행 상태", "혼재 작업 구역의 분리·신호 체계", "비상 경보·대피로 확보 상태", "위험성평가 개선 대책 이행 상태"]
    for i in range(1, 11):
        cell(ws, f"A{r}", i, align=CENTER)
        cell(ws, f"B{r}", samples[i - 1] if i <= len(samples) else None, f(9))
        cell(ws, f"C{r}", None, f(9), align=CENTER)
        for col in "DE":
            cell(ws, f"{col}{r}", "[ ]", align=CENTER)
        for col in "FG":
            cell(ws, f"{col}{r}", None, f(9), align=CENTER)
        ws.row_dimensions[r].height = 26; r += 1
    note(ws, r, "G", "점검 내용 예시 네 줄은 현장 권장입니다. 합동점검을 하지 않으면 500만 원 이하 벌금입니다 (법 제172조). · " + FOOT, NOTE, 28)


def sheet_edu_info(ws):
    setup(ws, landscape=True)
    cols = list("ABCDEFGHIJ")
    widths(ws, cols, [5, 16, 16, 12, 9, 9, 14, 14, 12, 16])
    title(ws, "J", "수급인 교육 지원·실시 확인과 안전·보건 정보 제공 확인",
          "관계수급인의 안전보건교육(법 제29조제1항~제3항)에 장소·자료를 지원하고, 유해·위험 작업 특별교육(같은 조 제3항)의 실시를 확인합니다 (법 제64조제1항제3호·제4호).")
    r = 4
    section(ws, r, "J", "1. 교육 지원·실시 확인"); r += 1
    names = ["번호", "수급업체", "교육 종류", "교육일", "대상 인원", "이수 인원", "지원 (장소·자료)", "확인 서류", "확인일", "확인자 서명"]
    for col, h in zip(cols, names):
        cell(ws, f"{col}{r}", h, f(9, True), HEAD, CENTER)
    ws.row_dimensions[r].height = 26; r += 1
    for i in range(1, 9):
        cell(ws, f"A{r}", i, align=CENTER)
        for col in cols[1:]:
            cell(ws, f"{col}{r}", None, f(9), align=CENTER)
        cell(ws, f"C{r}", "정기 · 채용 · 변경 · 특별", f(8), align=CENTER)
        ws.row_dimensions[r].height = 22; r += 1
    r += 1
    section(ws, r, "J", "2. 안전·보건 정보 문서 제공 확인 (작업 시작 전, 법 제65조, 시행규칙 제83조)"); r += 1
    label(ws, r, "A", "작업"); ws.merge_cells(f"A{r}:B{r}"); blank(ws, f"C{r}:E{r}")
    label(ws, r, "F", "수급업체"); blank(ws, f"G{r}:H{r}"); label(ws, r, "I", "제공일"); blank(ws, f"J{r}:J{r}")
    ws.row_dimensions[r].height = 24; r += 1
    r = checks(ws, r, "J", [
        ("대상 작업: 위험 화학물질 반응기·증류탑·배관·저장탱크의 개조·분해·해체·철거 / 그 설비 내부 작업 / 질식·붕괴 위험 장소 작업", "법 제65조①, 영 제54조"),
        ("화학설비와 부속설비에서 다루는 위험물질·관리대상 유해물질의 명칭과 유해성·위험성", "규칙 제83조①1"),
        ("유해하거나 위험한 작업에 대한 안전·보건상 주의사항", "규칙 제83조①2"),
        ("유출 등 사고 발생 시 필요한 조치 내용", "규칙 제83조①3"),
        ("하도급하는 경우 받은 문서 사본을 하수급인에게 작업 시작 전까지 제공", "규칙 제83조②"),
        ("수급인 근로자가 제공된 정보에 따라 필요한 조치를 받고 있는지 확인 (필요하면 기록 제출 요청)", "법 제65조③, 규칙 제83조③"),
    ], "H", h=30)
    note(ws, r, "J",
         "정보를 문서로 제공하지 않으면 1년 이하 징역 또는 1천만 원 이하 벌금입니다 (법 제170조제4호). 정보를 받지 못한 수급인은 작업을 하지 않을 수 있고 이행 지체 책임을 지지 않습니다 (법 제65조제4항). · " + FOOT,
         NOTE, 32)


def main():
    from openpyxl import Workbook
    wb = Workbook()
    wb.remove(wb.active)
    sheet_status(wb.create_sheet("1 현황·의무"))
    sheet_council(wb.create_sheet("2 협의체 회의록"))
    sheet_patrol(wb.create_sheet("3 순회점검"))
    sheet_mix(wb.create_sheet("4 혼재 작업"))
    sheet_joint(wb.create_sheet("5 합동점검"))
    sheet_edu_info(wb.create_sheet("6 교육·정보 제공"))
    for ws in wb.worksheets:
        ws.page_setup.fitToHeight = 1
    wb.properties.creator = "그린헬멧기사"
    p = OUT / "contractor-safety-set.xlsx"
    wb.save(p)
    print("ok", p.name)


if __name__ == "__main__":
    main()
