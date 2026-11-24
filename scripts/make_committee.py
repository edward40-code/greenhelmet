# 산업안전보건위원회 운영 양식 xlsx 생성기
# 출처 (국가법령정보센터 2026-11-25 확인):
#   산업안전보건법 제15조제1항, 제24조, 제164조제1항제2호, 제175조제5항제1호 (법률 제22122호)
#   산업안전보건법 시행령 제34조~제39조, [별표 9] (개정 2024. 6. 25.) (대통령령 제36540호)
#   중대재해 처벌 등에 관한 법률 시행령 제4조제7호 단서
# 법 조문에 없는 항목은 '현장 권장'으로 따로 적는다.
# 실행: python scripts/make_committee.py → public/library/committee-set.xlsx (그다음 plain_colors.py)
from make_checklists import OUT, HEAD, CENTER, WRAP, f, setup, cell, boxrange
from make_loto import title, note, section, heads, NOTE, FOOT
from make_risk_set import widths, label, blank, checks


def sheet_members(ws):
    """1. 위원 명단 (A4 세로)"""
    setup(ws)
    widths(ws, "ABCDEF", [6, 37, 14, 16, 12, 12])
    title(ws, "F", "산업안전보건위원회 위원 명단",
          "근로자위원과 사용자위원을 같은 수로 구성합니다 (산업안전보건법 제24조제1항, 시행령 제35조).")
    r = 4
    label(ws, r, "A", "사업장"); blank(ws, f"B{r}:C{r}"); label(ws, r, "D", "구성일"); blank(ws, f"E{r}:F{r}")
    ws.row_dimensions[r].height = 24; r += 2

    def block(r, head, rows, extra):
        section(ws, r, "F", head); r += 1
        heads(ws, r, "ABCDEF", ["번호", "구분", "성명", "소속·직위", "대리 지정자", "서명"]); r += 1
        n = 1
        for text in rows + [""] * extra:
            cell(ws, f"A{r}", n, align=CENTER)
            cell(ws, f"B{r}", text or None, f(9))
            for col in "CDEF":
                cell(ws, f"{col}{r}", None, align=CENTER)
            ws.row_dimensions[r].height = 24; r += 1; n += 1
        return r

    r = block(r, "1. 근로자위원 (시행령 제35조제1항)", [
        "근로자대표",
        "명예산업안전감독관 (위촉된 경우, 근로자대표 지명)",
        "근로자대표가 지명하는 근로자",
    ], 4)
    note(ws, r, "F", "근로자대표 지명 근로자는 9명 이내이며, 근로자인 명예산업안전감독관이 있으면 그 수를 뺍니다 (제35조제1항제3호).", NOTE, 22); r += 2
    r = block(r, "2. 사용자위원 (시행령 제35조제2항)", [
        "해당 사업의 대표자 (다른 지역 사업장은 안전보건관리책임자)",
        "안전관리자 1명 (위탁 시 전문기관 담당자)",
        "보건관리자 1명 (위탁 시 전문기관 담당자)",
        "산업보건의 (선임된 경우)",
        "대표자가 지명하는 부서의 장",
    ], 2)
    note(ws, r, "F", "부서의 장은 9명 이내이며, 상시근로자 50명 이상 100명 미만 사업장은 부서의 장을 빼고 구성할 수 있습니다 (제35조제2항).", NOTE, 22); r += 2

    section(ws, r, "F", "3. 위원장과 구성 확인"); r += 1
    label(ws, r, "A", "위원장")
    ws.merge_cells(f"B{r}:F{r}")
    cell(ws, f"B{r}", "[ ] 단독: __________    [ ] 공동위원장 (근로자위원 __________ / 사용자위원 __________)", f(9))
    boxrange(ws, f"B{r}:F{r}"); ws.row_dimensions[r].height = 26; r += 1
    r = checks(ws, r, "F", [
        ("위원장은 위원 중에서 호선했다", "시행령 제36조"),
        ("근로자위원과 사용자위원 수가 같다 (근로자위원 __명 / 사용자위원 __명)", "법 제24조제1항"),
        ("출석할 수 없을 때 직무를 대리할 사람을 정했다 (근로자대표, 명예감독관, 대표자, 안전·보건관리자)", "시행령 제37조제3항"),
    ], "E", 26)
    note(ws, r, "F",
         "구성 대상 (시행령 별표 9): 화학·1차 금속·금속가공·자동차·기계장비 제조업 등 9개 업종 50명 이상, 농업·금융·정보서비스·사업지원서비스 등 300명 이상, "
         "건설업 공사금액 120억 원 이상(토목공사업 150억 원 이상), 그 밖의 사업 100명 이상. 업종은 별표 9 원문으로 확인합니다. · " + FOOT,
         NOTE, 40)


def sheet_schedule(ws):
    """2. 연간 회의 일정과 소집 통지 (A4 세로)"""
    setup(ws)
    widths(ws, "ABCDEF", [12, 16, 16, 30, 12, 12])
    title(ws, "F", "산업안전보건위원회 회의 일정과 소집",
          "정기회의는 분기마다 위원장이 소집하고, 임시회의는 위원장이 필요하다고 인정할 때 소집합니다 (시행령 제37조제1항).")
    r = 4
    label(ws, r, "A", "연도"); blank(ws, f"B{r}:C{r}"); label(ws, r, "D", "위원장"); blank(ws, f"E{r}:F{r}")
    ws.row_dimensions[r].height = 24; r += 2
    section(ws, r, "F", "1. 연간 정기회의 일정"); r += 1
    heads(ws, r, "ABCDEF", ["분기", "예정일", "실시일", "주요 안건 (계획)", "장소", "회의록"]); r += 1
    for q in ["1분기", "2분기", "3분기", "4분기"]:
        cell(ws, f"A{r}", q, f(9, True), align=CENTER)
        for col in "BCDEF":
            cell(ws, f"{col}{r}", None, align=CENTER if col != "D" else WRAP)
        cell(ws, f"F{r}", "[ ]", align=CENTER)
        ws.row_dimensions[r].height = 34; r += 1
    note(ws, r, "F",
         "분기별 안건 예시 (현장 권장): 1분기 연간 산업재해 예방계획·교육계획, 2분기 상반기 작업환경측정·하계 대비, 3분기 건강진단·하반기 계획 점검, 4분기 연간 실적과 다음 연도 계획.",
         NOTE, 30); r += 2

    section(ws, r, "F", "2. 회의 소집 통지"); r += 1
    label(ws, r, "A", "구분")
    ws.merge_cells(f"B{r}:F{r}"); cell(ws, f"B{r}", "[ ] 정기회의 (__분기)    [ ] 임시회의", f(9)); boxrange(ws, f"B{r}:F{r}")
    ws.row_dimensions[r].height = 24; r += 1
    label(ws, r, "A", "일시"); blank(ws, f"B{r}:C{r}"); label(ws, r, "D", "장소"); blank(ws, f"E{r}:F{r}")
    ws.row_dimensions[r].height = 24; r += 1
    label(ws, r, "A", "통지일"); blank(ws, f"B{r}:C{r}"); label(ws, r, "D", "통지 방법"); blank(ws, f"E{r}:F{r}")
    ws.row_dimensions[r].height = 24; r += 1
    heads(ws, r, "ABCDEF", ["번호", "안건", "", "심의·의결 근거 (법 제24조제2항)", "제안", "자료"])
    ws.merge_cells(f"B{r}:C{r}"); r += 1
    for i in range(1, 7):
        cell(ws, f"A{r}", i, align=CENTER)
        ws.merge_cells(f"B{r}:C{r}"); cell(ws, f"B{r}", None); boxrange(ws, f"B{r}:C{r}")
        for col in "DEF":
            cell(ws, f"{col}{r}", None, align=CENTER)
        ws.row_dimensions[r].height = 28; r += 1
    r += 1
    label(ws, r, "A", "소집자")
    ws.merge_cells(f"B{r}:F{r}"); cell(ws, f"B{r}", "위원장                                         (서명)", f(9), align=CENTER); boxrange(ws, f"B{r}:F{r}")
    ws.row_dimensions[r].height = 30; r += 1
    note(ws, r, "F", "통지 시기와 방법은 법령에 정한 것이 없어 사업장 규정에 따릅니다 (현장 권장: 회의 7일 전, 안건 자료 첨부). · " + FOOT, NOTE, 24)


AGENDA = [
    ("사업장의 산업재해 예방계획의 수립", "제15조제1항제1호"),
    ("안전보건관리규정의 작성 및 변경", "제15조제1항제2호"),
    ("안전보건교육", "제15조제1항제3호"),
    ("작업환경측정 등 작업환경의 점검 및 개선", "제15조제1항제4호"),
    ("근로자의 건강진단 등 건강관리", "제15조제1항제5호"),
    ("중대재해의 원인 조사 및 재발 방지대책 수립", "제15조제1항제6호 중 중대재해"),
    ("산업재해에 관한 통계의 기록 및 유지", "제15조제1항제7호"),
    ("유해하거나 위험한 기계·기구·설비를 도입한 경우 안전 및 보건 관련 조치", "제24조제2항제3호"),
    ("그 밖에 근로자의 안전 및 보건을 유지·증진시키기 위하여 필요한 사항", "제24조제2항제4호"),
]


def sheet_minutes(ws):
    """3. 회의록 (A4 세로)"""
    setup(ws)
    widths(ws, "ABCDEFG", [6, 30, 10, 10, 10, 12, 18])
    title(ws, "G", "산업안전보건위원회 회의록",
          "개최 일시·장소, 출석위원, 심의 내용과 의결·결정 사항, 그 밖의 토의사항을 기록하고 2년간 보존합니다 (시행령 제37조제4항, 법 제164조제1항제2호).")
    r = 4
    label(ws, r, "A", "구분")
    ws.merge_cells(f"B{r}:G{r}"); cell(ws, f"B{r}", "[ ] 정기회의 (__분기)    [ ] 임시회의", f(9)); boxrange(ws, f"B{r}:G{r}")
    ws.row_dimensions[r].height = 22; r += 1
    label(ws, r, "A", "일시"); blank(ws, f"B{r}:B{r}"); label(ws, r, "C", "장소"); blank(ws, f"D{r}:G{r}")
    ws.row_dimensions[r].height = 24; r += 2

    section(ws, r, "G", "1. 출석위원 (제37조제4항제2호)"); r += 1
    heads(ws, r, "ABCDEFG", ["", "", "재적", "출석", "과반수", "개의", "비고"]); r += 1
    for side in ["근로자위원", "사용자위원"]:
        ws.merge_cells(f"A{r}:B{r}"); cell(ws, f"A{r}", side, f(9, True), align=CENTER); boxrange(ws, f"A{r}:B{r}")
        for col in "CDE":
            cell(ws, f"{col}{r}", None, align=CENTER)
        cell(ws, f"F{r}", "[ ]", align=CENTER); cell(ws, f"G{r}", None)
        ws.row_dimensions[r].height = 22; r += 1
    note(ws, r, "G", "근로자위원과 사용자위원 각 과반수가 출석해야 개의하고, 출석위원 과반수 찬성으로 의결합니다 (제37조제2항). 출석위원 명단과 서명은 뒤쪽 4번에 받습니다.", NOTE, 24); r += 2

    section(ws, r, "G", "2. 심의 내용 및 의결·결정 사항 (제37조제4항제3호)"); r += 1
    heads(ws, r, "ABCDEFG", ["번호", "안건과 심의 내용", "찬성", "반대", "기권", "결과", "이행 담당·기한"]); r += 1
    for i in range(1, 6):
        cell(ws, f"A{r}", i, align=CENTER)
        cell(ws, f"B{r}", None)
        for col in "CDEG":
            cell(ws, f"{col}{r}", None, align=CENTER)
        cell(ws, f"F{r}", "가결 · 부결\n· 보고", f(8), align=CENTER)
        ws.row_dimensions[r].height = 44; r += 1
    note(ws, r, "G",
         "반드시 심의·의결할 사항 (법 제24조제2항): " + " / ".join(f"{a}" for a, _ in AGENDA) + ". "
         "의결하지 못하거나 해석·이행방법에 의견이 다르면 중재기구나 제3자 중재로 해결합니다 (시행령 제38조).",
         NOTE, 52); r += 2

    section(ws, r, "G", "3. 그 밖의 토의사항 (제37조제4항제4호)"); r += 1
    ws.merge_cells(f"A{r}:G{r}"); cell(ws, f"A{r}", None); boxrange(ws, f"A{r}:G{r}")
    ws.row_dimensions[r].height = 56; r += 2

    section(ws, r, "G", "4. 출석위원 서명"); r += 1
    heads(ws, r, "ABCDEFG", ["구분", "성명", "", "서명", "구분", "성명", "서명"])
    ws.merge_cells(f"B{r}:C{r}"); r += 1
    for _ in range(5):
        cell(ws, f"A{r}", "근로자", f(8), align=CENTER)
        ws.merge_cells(f"B{r}:C{r}"); cell(ws, f"B{r}", None); boxrange(ws, f"B{r}:C{r}")
        cell(ws, f"D{r}", None); cell(ws, f"E{r}", "사용자", f(8), align=CENTER)
        cell(ws, f"F{r}", None); cell(ws, f"G{r}", None)
        ws.row_dimensions[r].height = 22; r += 1
    note(ws, r, "G", FOOT, NOTE, 18)


def sheet_followup(ws):
    """4. 의결사항 이행 관리대장 (A4 가로)"""
    setup(ws, landscape=True)
    names = ["번호", "회의일", "의결 사항", "이행 담당", "기한", "이행 내용", "완료일", "결과 공지", "다음 회의 보고"]
    cols = list("ABCDEFGHI")
    widths(ws, cols, [5, 11, 40, 12, 11, 38, 11, 11, 12])
    title(ws, "I", "산업안전보건위원회 의결사항 이행 관리대장",
          "사업주와 근로자는 위원회가 심의·의결한 사항을 성실하게 이행해야 합니다 (산업안전보건법 제24조제4항).")
    r = 4
    for col, h in zip(cols, names):
        cell(ws, f"{col}{r}", h, f(9, True), HEAD, CENTER)
    ws.row_dimensions[r].height = 26; r += 1
    for i in range(1, 15):
        cell(ws, f"A{r}", i, align=CENTER)
        for col in cols[1:]:
            cell(ws, f"{col}{r}", None, f(9), align=WRAP if col in "CF" else CENTER)
        cell(ws, f"H{r}", "[ ]", align=CENTER); cell(ws, f"I{r}", "[ ]", align=CENTER)
        ws.row_dimensions[r].height = 30; r += 1
    note(ws, r, "I",
         "다음 정기회의에서 이행 결과를 보고하고 회의록에 남기면 이행 여부를 확인하기 쉽습니다 (현장 권장). "
         "산업안전보건위원회를 구성·운영하지 않거나(제24조제1항) 의결 사항을 성실하게 이행하지 않으면(제24조제4항) 500만 원 이하 과태료입니다 (제175조제5항제1호). · " + FOOT,
         NOTE, 32)


def sheet_notice(ws):
    """5. 회의 결과 공지 (A4 세로)"""
    setup(ws)
    widths(ws, "ABCDEF", [12, 22, 22, 16, 14, 14])
    title(ws, "F", "산업안전보건위원회 회의 결과 공지",
          "위원장은 심의·의결된 내용과 중재 결정 내용을 근로자에게 신속히 알립니다 (시행령 제39조).")
    r = 4
    label(ws, r, "A", "회의일"); blank(ws, f"B{r}:C{r}"); label(ws, r, "D", "공지일"); blank(ws, f"E{r}:F{r}")
    ws.row_dimensions[r].height = 24; r += 1
    label(ws, r, "A", "방법")
    ws.merge_cells(f"B{r}:F{r}")
    cell(ws, f"B{r}", "[ ] 사내방송   [ ] 사내보   [ ] 게시   [ ] 자체 정례조회   [ ] 그 밖의 방법: __________", f(9))
    boxrange(ws, f"B{r}:F{r}"); ws.row_dimensions[r].height = 26; r += 2

    section(ws, r, "F", "알리는 내용 (게시용)"); r += 1
    heads(ws, r, "ABCDEF", ["번호", "의결·결정 사항", "", "근로자가 알아야 할 것", "", "시행일"])
    ws.merge_cells(f"B{r}:C{r}"); ws.merge_cells(f"D{r}:E{r}"); r += 1
    for i in range(1, 7):
        cell(ws, f"A{r}", i, align=CENTER)
        for rng in (f"B{r}:C{r}", f"D{r}:E{r}"):
            ws.merge_cells(rng); cell(ws, rng.split(":")[0], None); boxrange(ws, rng)
        cell(ws, f"F{r}", None, align=CENTER)
        ws.row_dimensions[r].height = 40; r += 1
    r += 1
    section(ws, r, "F", "중재 결정 사항 (해당 시, 시행령 제38조)"); r += 1
    ws.merge_cells(f"A{r}:F{r}"); cell(ws, f"A{r}", None); boxrange(ws, f"A{r}:F{r}")
    ws.row_dimensions[r].height = 50; r += 2
    label(ws, r, "A", "위원장")
    ws.merge_cells(f"B{r}:F{r}"); cell(ws, f"B{r}", "(서명)", f(9), align=CENTER); boxrange(ws, f"B{r}:F{r}")
    ws.row_dimensions[r].height = 30; r += 1
    note(ws, r, "F",
         "산업안전보건위원회에서 안전·보건 사항을 논의하거나 심의·의결한 경우 중대재해처벌법상 종사자 의견을 들은 것으로 봅니다 (중대재해처벌법 시행령 제4조제7호 단서). "
         "공지한 게시물 사진이나 회람 서명을 회의록과 함께 보관하면 근거가 됩니다 (현장 권장). · " + FOOT,
         NOTE, 40)


def main():
    from openpyxl import Workbook
    wb = Workbook()
    wb.remove(wb.active)
    sheet_members(wb.create_sheet("1 위원 명단"))
    sheet_schedule(wb.create_sheet("2 일정과 소집"))
    sheet_minutes(wb.create_sheet("3 회의록"))
    sheet_followup(wb.create_sheet("4 이행 관리대장"))
    sheet_notice(wb.create_sheet("5 결과 공지"))
    for ws in wb.worksheets:
        ws.page_setup.fitToHeight = 1
    wb.properties.creator = "그린헬멧기사"
    p = OUT / "committee-set.xlsx"
    wb.save(p)
    print("ok", p.name)


if __name__ == "__main__":
    main()
