# 정기 위험성평가 세트 xlsx 생성기
# 출처 (국가법령정보센터 2026-11-25 확인):
#   산업안전보건법 제36조 (법률 제21374호 개정, 2026. 6. 1. 시행), 제175조제4항제2호의2·제5항제1호·제6항제2호의2
#     (상시 50명 이상(건설 50억 원 이상) 2027. 1. 1., 50명 미만 2028. 1. 1. 시행, 부칙 제1조)
#   산업안전보건법 시행규칙 제37조, 제37조의2~4 (고용노동부령 제470호, 2026. 6. 1. 시행)
#   사업장 위험성평가에 관한 지침 (고용노동부고시 제2026-73호, 2026. 11. 4. 전부개정·시행)
# 법 조문에 없는 예시는 '현장 권장'으로 따로 적는다.
# 실행: python scripts/make_risk_set.py → public/library/risk-assessment-set.xlsx (그다음 plain_colors.py)
from make_checklists import OUT, HEAD, CENTER, WRAP, f, setup, cell, boxrange
from make_loto import title, note, section, heads, NOTE, FOOT

GOSI = "고시"  # 사업장 위험성평가에 관한 지침


def widths(ws, cols, ws_):
    for col, w in zip(cols, ws_):
        ws.column_dimensions[col].width = w


def label(ws, r, col, text):
    cell(ws, f"{col}{r}", text, f(9, True), HEAD, CENTER)


def blank(ws, rng, h=None):
    a = rng.split(":")[0]
    if ":" in rng and rng.split(":")[0] != rng.split(":")[1]:
        ws.merge_cells(rng)
    cell(ws, a, None)
    boxrange(ws, rng)


def checks(ws, r, last, items, basis_col, h=22):
    """[ ] 항목 | 근거 줄 목록"""
    for text, basis in items:
        cell(ws, f"A{r}", "[ ]", align=CENTER)
        prev = chr(ord(basis_col) - 1)
        ws.merge_cells(f"B{r}:{prev}{r}")
        cell(ws, f"B{r}", text, f(9))
        boxrange(ws, f"B{r}:{prev}{r}")
        if basis_col != last:
            ws.merge_cells(f"{basis_col}{r}:{last}{r}")
        cell(ws, f"{basis_col}{r}", basis, f(8), align=CENTER)
        boxrange(ws, f"{basis_col}{r}:{last}{r}")
        ws.row_dimensions[r].height = h
        r += 1
    return r


def sheet_rule(ws):
    """1. 위험성평가 실시규정 (A4 세로)"""
    setup(ws)
    widths(ws, "ABCDEF", [6, 22, 22, 22, 14, 12])
    title(ws, "F", "위험성평가 실시규정",
          "최초평가 때 작성하고 계속 관리합니다. 상시근로자 5명 미만(건설공사 1억 원 미만)은 생략할 수 있습니다 (사업장 위험성평가에 관한 지침 제19조).")
    r = 4
    label(ws, r, "A", "사업장"); blank(ws, f"B{r}:C{r}"); label(ws, r, "D", "제정·개정일"); blank(ws, f"E{r}:F{r}")
    ws.row_dimensions[r].height = 24; r += 2
    rows = [
        ("1. 평가의 목적 및 방법", "예: 빈도·강도법 3×3 (현장 권장). 지침 제9조: 빈도·강도법, 체크리스트법, 위험성 수준 3단계 판단법, 핵심 요인 기술(One Point Sheet)법 등"),
        ("2. 평가담당자 및 책임자의 역할", "총괄관리자(사업주 또는 안전보건관리책임자 등), 관리감독자, 안전·보건관리자, 설비 전문가 (지침 제8조)"),
        ("3. 평가 시기", "최초평가, 정기평가(매년 1회 이상), 수시평가, 상시평가 (시행규칙 제37조제2항, 지침 제13조~제16조)"),
        ("4. 근로자 및 근로자대표의 참여 방법", "사업장 순회 점검이 원칙, 설문조사·면담 병행 가능 (시행규칙 제37조의2). 근로자대표가 요구하면 참여 (법 제36조제3항)"),
        ("5. 근로자에 대한 공유 방법", "실시 전 일정, 실시 후 결과 (시행규칙 제37조의3). 교육, 설명회, 게시, 문서, TBM 등 (지침 제17조)"),
        ("6. 결과의 기록·보존 방법", "개선대책 수립을 마친 다음 날부터 3년 보존, 전자문서 가능 (시행규칙 제37조의4, 지침 제21조)"),
    ]
    for head, hint in rows:
        section(ws, r, "F", head); r += 1
        ws.merge_cells(f"A{r}:F{r}"); cell(ws, f"A{r}", None); boxrange(ws, f"A{r}:F{r}")
        ws.row_dimensions[r].height = 62; r += 1
        note(ws, r, "F", hint, NOTE, 26); r += 1
    r += 1
    label(ws, r, "A", "승인")
    ws.merge_cells(f"B{r}:F{r}"); cell(ws, f"B{r}", "총괄관리자                                   (서명)", f(9), align=CENTER); boxrange(ws, f"B{r}:F{r}")
    ws.row_dimensions[r].height = 32; r += 1
    note(ws, r, "F", "각 칸 아래 작은 글씨는 법령 요약과 예시입니다. 예시는 현장 권장이며 사업장에 맞게 고쳐 씁니다. · " + FOOT, NOTE, 26)


def sheet_plan(ws):
    """2. 실시계획과 사전 공유 (A4 세로)"""
    setup(ws)
    widths(ws, "ABCDEF", [6, 34, 16, 16, 14, 12])
    title(ws, "F", "위험성평가 실시계획",
          "평가 전에 실시 일정을 근로자에게 알립니다 (산업안전보건법 제36조제4항, 시행규칙 제37조의3제1호).")
    r = 4
    label(ws, r, "A", "구분")
    ws.merge_cells(f"B{r}:F{r}")
    cell(ws, f"B{r}", "[ ] 최초평가    [ ] 정기평가 (매년 1회 이상)    [ ] 수시평가    [ ] 상시평가", f(9)); boxrange(ws, f"B{r}:F{r}")
    ws.row_dimensions[r].height = 24; r += 1
    label(ws, r, "A", "기간"); blank(ws, f"B{r}:C{r}"); label(ws, r, "D", "대상 공정·작업"); blank(ws, f"E{r}:F{r}")
    ws.row_dimensions[r].height = 28; r += 2

    section(ws, r, "F", "1. 수행 체계 (지침 제8조)"); r += 1
    heads(ws, r, "ABCDEF", ["", "역할", "성명", "소속·직위", "근거", "비고"]); r += 1
    roles = [
        ("총괄관리자 (사업주, 안전보건관리책임자 등)", "제8조제1항"),
        ("관리감독자: 요인 파악, 개선대책 이행", "제8조제2항"),
        ("안전관리자·보건관리자·안전보건관리담당자: 기술 보좌", "제8조제3항"),
        ("기계·기구·설비 전문 지식을 갖춘 사람", "제8조제4항"),
        ("외부 전문가·전문기관 컨설팅 (선택)", "제8조제5항"),
    ]
    for i, (role, basis) in enumerate(roles, 1):
        cell(ws, f"A{r}", i, align=CENTER)
        cell(ws, f"B{r}", role, f(9))
        for col in "CDF":
            cell(ws, f"{col}{r}", None, align=CENTER)
        cell(ws, f"E{r}", f"{GOSI} {basis}", f(8), align=CENTER)
        ws.row_dimensions[r].height = 30; r += 1
    r += 1

    section(ws, r, "F", "2. 근로자대표 참여 (법 제36조제3항, 지침 제7조)"); r += 1
    r = checks(ws, r, "F", [
        ("근로자대표에게 참여 요구 여부를 확인했다", "법 제36조제3항"),
        ("요구한 경우 참여 일정·범위·방법을 협의했다", f"{GOSI} 제7조"),
    ], "E"); r += 1

    section(ws, r, "F", "3. 사전조사 자료 (지침 제20조, 활용 가능)"); r += 1
    r = checks(ws, r, "F", [
        ("작업표준, 작업절차", "제20조제1호"),
        ("설비 사양서, 물질안전보건자료(MSDS)", "제20조제2호"),
        ("공정 흐름과 작업 주변 환경", "제20조제3호"),
        ("도급 작업이 있으면 혼재 작업의 위험성과 작업 상황", "제20조제4호"),
        ("안전보건규칙 제38조 사전조사 결과와 작업계획서", "제20조제5호"),
        ("재해사례, 재해통계, 아차사고 (아차사고 요인은 평가 대상에 포함: 제10조제3항)", "제20조제6호"),
        ("작업환경측정, 건강진단, 근골격계 유해요인조사 결과 등", "제20조제7호"),
    ], "E"); r += 1

    section(ws, r, "F", "4. 정기평가 때 함께 볼 것 (지침 제14조제2항)"); r += 1
    r = checks(ws, r, "F", [
        ("기계·기구, 설비 등의 기간 경과에 의한 성능 저하", "제14조제2항제1호"),
        ("안전·보건과 관련된 지식 또는 경험의 변화", "제14조제2항제2호"),
        ("현재 수립되어 있는 개선대책의 유효성", "제14조제2항제3호"),
    ], "E"); r += 1

    section(ws, r, "F", "5. 실시 일정 사전 공유 (시행규칙 제37조의3제1호, 지침 제17조)"); r += 1
    label(ws, r, "A", "방법")
    ws.merge_cells(f"B{r}:F{r}")
    cell(ws, f"B{r}", "[ ] 안전보건교육  [ ] 설명회  [ ] 사업장 게시  [ ] 문서 전달  [ ] TBM 등 정기 회의  [ ] 전자적 방법  [ ] 그 밖의 입증 가능한 방법", f(9))
    boxrange(ws, f"B{r}:F{r}"); ws.row_dimensions[r].height = 32; r += 1
    label(ws, r, "A", "공유일"); blank(ws, f"B{r}:C{r}"); label(ws, r, "D", "확인자"); blank(ws, f"E{r}:F{r}")
    ws.row_dimensions[r].height = 24; r += 1
    note(ws, r, "F", FOOT, NOTE, 20)


def sheet_join(ws):
    """3. 근로자 참여 기록 (A4 세로)"""
    setup(ws)
    widths(ws, "ABCDEFGHI", [5, 12, 16, 7, 7, 7, 7, 14, 12])
    title(ws, "I", "위험성평가 근로자 참여 기록",
          "해당 작업에 실제 종사하는 근로자를 사업장 순회 점검 방법으로 참여시킵니다 (산업안전보건법 제36조제2항, 시행규칙 제37조의2, 지침 제6조).")
    r = 4
    label(ws, r, "A", "일시"); blank(ws, f"B{r}:C{r}"); label(ws, r, "D", "장소"); blank(ws, f"E{r}:G{r}")
    label(ws, r, "H", "인솔"); blank(ws, f"I{r}:I{r}")
    ws.row_dimensions[r].height = 26; r += 2
    heads(ws, r, "ABCDEFGHI", ["번호", "성명", "소속·작업", "①\n파악", "②\n결정", "③\n대책", "④\n확인", "구분", "서명"])
    ws.row_dimensions[r].height = 34; r += 1
    for i in range(1, 17):
        cell(ws, f"A{r}", i, align=CENTER)
        for col in "BCDEFGI":
            cell(ws, f"{col}{r}", None, align=CENTER)
        cell(ws, f"H{r}", "근로자 · 대표", f(8), align=CENTER)
        ws.row_dimensions[r].height = 24; r += 1
    note(ws, r, "I", "참여 단계 ①~④는 지침 제6조제1항 각 호입니다. 참여한 단계에 ○를 적습니다. '구분'은 근로자 또는 근로자대표에 ○ (시행규칙 제37조의4제1항제2호).", NOTE, 26); r += 2

    section(ws, r, "I", "순회 점검에 참여시킬 수 없는 특별한 사정이 있는 경우 (시행규칙 제37조의2제2항)"); r += 1
    label(ws, r, "A", "사유")
    ws.merge_cells(f"B{r}:I{r}"); cell(ws, f"B{r}", None); boxrange(ws, f"B{r}:I{r}")
    ws.row_dimensions[r].height = 40; r += 1
    label(ws, r, "A", "방법")
    ws.merge_cells(f"B{r}:I{r}")
    cell(ws, f"B{r}", "[ ] 설문조사 (응답 __명)    [ ] 면담 (__명)    [ ] 그 밖의 의견 수렴: ______________", f(9))
    boxrange(ws, f"B{r}:I{r}"); ws.row_dimensions[r].height = 26; r += 1
    note(ws, r, "I", "설문지·면담 기록은 이 장에 붙여 함께 보관합니다 (현장 권장). · " + FOOT, NOTE, 22)


def sheet_table(ws):
    """4. 위험성평가표 (가로)"""
    setup(ws, landscape=True)
    names = ["번호", "공정·작업", "유해·위험 요인", "재해 형태", "현재 안전·보건조치",
             "가능성", "중대성", "위험성", "허용", "개선대책", "대책 구분",
             "담당", "완료 예정", "완료일", "개선 후\n위험성", "근로자\n확인"]
    cols = [chr(ord("A") + i) for i in range(len(names))]
    last = cols[-1]
    widths(ws, cols, [4.5, 13, 24, 9, 18, 6, 6, 6, 6, 24, 9, 8, 8, 8, 7, 7])
    title(ws, last, "위험성평가표",
          "유해·위험 요인 파악 → 위험성 결정 → 개선대책 수립·이행 순서로 적습니다 (시행규칙 제37조제1항). 위험성은 사업장이 정한 기준으로 판단합니다 (지침 제11조).")
    r = 4
    cell(ws, f"A{r}", "공정", f(9, True), HEAD, CENTER); ws.merge_cells(f"B{r}:C{r}"); cell(ws, f"B{r}", None); boxrange(ws, f"B{r}:C{r}")
    cell(ws, f"D{r}", "평가일", f(9, True), HEAD, CENTER); ws.merge_cells(f"E{r}:F{r}"); cell(ws, f"E{r}", None); boxrange(ws, f"E{r}:F{r}")
    cell(ws, f"G{r}", "평가자", f(9, True), HEAD, CENTER); ws.merge_cells(f"H{r}:J{r}"); cell(ws, f"H{r}", None); boxrange(ws, f"H{r}:J{r}")
    cell(ws, f"K{r}", "구분", f(9, True), HEAD, CENTER); ws.merge_cells(f"L{r}:{last}{r}")
    cell(ws, f"L{r}", "[ ] 최초 [ ] 정기 [ ] 수시 [ ] 상시", f(9)); boxrange(ws, f"L{r}:{last}{r}")
    ws.row_dimensions[r].height = 24; r += 2
    for col, h in zip(cols, names):
        cell(ws, f"{col}{r}", h, f(8, True), HEAD, CENTER)
    ws.row_dimensions[r].height = 30; r += 1
    for i in range(1, 15):
        cell(ws, f"A{r}", i, align=CENTER)
        for col in cols[1:]:
            cell(ws, f"{col}{r}", None, f(9), align=WRAP if col in "BCEJ" else CENTER)
        ws.row_dimensions[r].height = 36; r += 1
    note(ws, r, last,
         "대책 구분은 ① 제거·대체(작업 폐지·변경, 물질 대체, 설계 단계 제거) ② 공학적(연동장치, 환기장치) ③ 관리적(작업절차서) ④ 보호구 순서로 검토합니다 (지침 제12조제1항). "
         "개선 후에도 허용 가능한 수준이 아니면 추가 대책을 세우고, 오래 걸리는 대책은 잠정 조치를 함께 적습니다 (제12조제3항·제4항). "
         "'근로자 확인'은 개선 후 위험성이 허용 가능한 수준이 되었는지 근로자가 함께 확인한 표시입니다 (제6조제1항제4호).",
         NOTE, 40); r += 1
    note(ws, r, last,
         "판단 기준 예시 (현장 권장, 빈도·강도법 3×3): 가능성 1 낮음 · 2 보통 · 3 높음, 중대성 1 경미(치료 불필요) · 2 중간(휴업 재해) · 3 중대(사망·영구장해). "
         "위험성 = 가능성 × 중대성, 1~2 허용 · 3~4 개선 · 6~9 즉시 개선. 허용 가능한 수준은 법령에서 정한 기준 이상이어야 합니다 (지침 제11조제1항). · " + FOOT,
         NOTE, 32)


def sheet_share(ws):
    """5. 결과 공유와 기록 보존 (A4 세로)"""
    setup(ws)
    widths(ws, "ABCDEF", [6, 16, 26, 16, 12, 14])
    title(ws, "F", "위험성평가 결과 공유와 기록",
          "결과를 근로자에게 알리고, 기록을 3년간 보존합니다 (산업안전보건법 제36조제4항·제5항, 시행규칙 제37조의3·제37조의4).")
    r = 4
    section(ws, r, "F", "1. 기록에 꼭 들어갈 것 (시행규칙 제37조의4제1항)"); r += 1
    r = checks(ws, r, "F", [
        ("위험성평가 실시 시기 및 담당자", "제1호"),
        ("위험성평가에 참여한 근로자 및 근로자대표", "제2호"),
        ("파악한 유해·위험 요인", "제3호 (제37조의3제2호)"),
        ("위험성 수준 결정 결과", "제3호 (제37조의3제2호)"),
        ("개선대책 수립 내용 및 이행 결과", "제3호 (제37조의3제2호)"),
    ], "E"); r += 1

    section(ws, r, "F", "2. 결과 공유 기록 (시행규칙 제37조의3제2호, 지침 제17조)"); r += 1
    heads(ws, r, "ABCDEF", ["번호", "일시", "방법\n(교육·설명회·게시·문서·TBM·전자)", "대상 (공정·작업)", "인원", "확인자"]); ws.row_dimensions[r].height = 32; r += 1
    for i in range(1, 7):
        cell(ws, f"A{r}", i, align=CENTER)
        for col in "BCDEF":
            cell(ws, f"{col}{r}", None, align=CENTER)
        ws.row_dimensions[r].height = 26; r += 1
    r += 1
    section(ws, r, "F", "3. 신규 채용·작업 변경 근로자 공유 (지침 제17조제2항: 작업 시작 전)"); r += 1
    heads(ws, r, "ABCDEF", ["번호", "성명", "사유 (신규 채용, 작업 변경 등)", "공유일", "작업 시작일", "공유자"]); r += 1
    for i in range(1, 6):
        cell(ws, f"A{r}", i, align=CENTER)
        for col in "BCDEF":
            cell(ws, f"{col}{r}", None, align=CENTER)
        ws.row_dimensions[r].height = 24; r += 1
    r += 1
    section(ws, r, "F", "4. 보존"); r += 1
    ws.merge_cells(f"A{r}:B{r}"); cell(ws, f"A{r}", "개선대책 수립 완료일", f(9, True), HEAD, CENTER); boxrange(ws, f"A{r}:B{r}")
    blank(ws, f"C{r}:C{r}"); label(ws, r, "D", "보존 기한 (3년)"); blank(ws, f"E{r}:F{r}")
    ws.row_dimensions[r].height = 28; r += 1
    note(ws, r, "F",
         "3년은 개선대책 수립을 완료한 다음 날부터 셉니다. 전자문서로 보존할 수 있습니다 (지침 제21조). "
         "과태료 (산업안전보건법 제175조, 상시 50명 이상(건설 공사금액 50억 원 이상) 2027. 1. 1.부터, 50명 미만 2028. 1. 1.부터): "
         "위험성평가 미실시 1천만 원 이하, 근로자 참여·근로자대표 참여·결과 공유(제36조제4항 전단) 위반 500만 원 이하, 기록·보존 위반 300만 원 이하. · " + FOOT,
         NOTE, 54)


def main():
    from openpyxl import Workbook
    wb = Workbook()
    wb.remove(wb.active)
    sheet_rule(wb.create_sheet("1 실시규정"))
    sheet_plan(wb.create_sheet("2 실시계획"))
    sheet_join(wb.create_sheet("3 근로자 참여"))
    sheet_table(wb.create_sheet("4 위험성평가표"))
    sheet_share(wb.create_sheet("5 공유와 기록"))
    for ws in wb.worksheets:
        ws.page_setup.fitToHeight = 1
    wb.properties.creator = "그린헬멧기사"
    p = OUT / "risk-assessment-set.xlsx"
    wb.save(p)
    print("ok", p.name)


if __name__ == "__main__":
    main()
