# LOTO(잠금·표지) 점검표 xlsx 생성기
# 출처: 산업안전보건기준에 관한 규칙 제92조(정비 등의 작업 시의 운전정지 등), 제93조(방호장치의 해체 금지),
#       제224조(로봇 수리 등 작업 시의 조치), 제319조(정전전로에서의 전기작업)
#       국가법령정보센터 현행본(고용노동부령 제450호, 2026.3.2. 시행) 2026-11-22 확인
# 법 조문에 없는 항목은 '현장 권장'으로 따로 묶는다.
# 실행: python scripts/make_loto.py → public/library/checklist-loto.xlsx (그다음 plain_colors.py)
from make_checklists import OUT, HEAD, CENTER, WRAP, f, setup, cell, boxrange

NOTE = f(8)
FOOT = "서식 제공: 그린헬멧기사 · 법령은 국가법령정보센터 현행 원문으로 확인해 주세요."


def title(ws, last, text, sub=None):
    ws.merge_cells(f"A1:{last}1")
    cell(ws, "A1", text, f(16, True), align=CENTER, border=False)
    ws.row_dimensions[1].height = 30
    if sub:
        ws.merge_cells(f"A2:{last}2")
        cell(ws, "A2", sub, f(9), align=CENTER, border=False)
        ws.row_dimensions[2].height = 30


def note(ws, r, last, text, font=NOTE, h=30):
    ws.merge_cells(f"A{r}:{last}{r}")
    cell(ws, f"A{r}", text, font, border=False)
    ws.row_dimensions[r].height = h


def section(ws, r, last, text):
    ws.merge_cells(f"A{r}:{last}{r}")
    cell(ws, f"A{r}", text, f(11, True), HEAD)
    boxrange(ws, f"A{r}:{last}{r}")
    ws.row_dimensions[r].height = 22


def field(ws, r, label, value_from="B", last="F", h=24):
    cell(ws, f"A{r}", label, f(10, True), HEAD, CENTER)
    ws.merge_cells(f"{value_from}{r}:{last}{r}")
    cell(ws, f"{value_from}{r}", None)
    boxrange(ws, f"{value_from}{r}:{last}{r}")
    ws.row_dimensions[r].height = h


def heads(ws, r, cols, names):
    for col, h in zip(cols, names):
        cell(ws, f"{col}{r}", h, f(10, True), HEAD, CENTER)
    ws.row_dimensions[r].height = 22


LAW_ITEMS = [
    ("A. 기계 정비·청소·수리 전 (법령)", [
        ("기계의 운전을 정지했다", "제92조제1항"),
        ("기동장치에 잠금장치를 하고 열쇠를 별도 관리한다 (또는 표지판을 설치했다)", "제92조제2항"),
        ("기계 안에 압축된 기체·액체를 미리 방출했다", "제92조제4항"),
        ("작업 방법상 기계가 갑자기 가동될 우려가 있으면 작업지휘자를 배치했다", "제92조제3항"),
        ("(로봇) 기동스위치를 열쇠로 잠그고 열쇠를 별도 관리하거나 '작업 중' 표지판을 붙였다", "제224조"),
    ]),
    ("B. 전기 설비 정전 작업 (법령, 해당할 때)", [
        ("공급되는 모든 전원을 도면·배선도 등으로 확인했다", "제319조제2항제1호"),
        ("전원을 차단한 뒤 단로기 등을 개방하고 확인했다", "제319조제2항제2호"),
        ("차단장치나 단로기 등에 잠금장치와 꼬리표를 붙였다", "제319조제2항제3호"),
        ("잔류전하를 완전히 방전시켰다", "제319조제2항제4호"),
        ("검전기로 작업 대상 기기의 충전 여부를 확인했다", "제319조제2항제5호"),
        ("역송전·유도 등으로 전압이 생길 우려가 있으면 단락 접지기구로 접지했다", "제319조제2항제6호"),
    ]),
    ("C. 작업을 마치고 다시 켤 때 (법령)", [
        ("해체했던 방호장치를 즉시 정상 기능으로 되돌렸다", "제93조제2항"),
        ("(전기) 작업기구·단락 접지기구를 제거하고 안전하게 통전되는지 확인했다", "제319조제3항제1호"),
        ("(전기) 모든 작업자가 설비에서 떨어져 있는지 확인했다", "제319조제3항제2호"),
        ("(전기) 잠금장치와 꼬리표는 설치한 근로자가 직접 철거했다", "제319조제3항제3호"),
        ("(전기) 모든 이상 유무를 확인한 후 전원을 투입했다", "제319조제3항제4호"),
    ]),
    ("D. 현장 권장 (법 조문이 아닌, 현장에서 널리 쓰는 방법)", [
        ("작업자마다 자기 자물쇠를 걸었다 (1인 1자물쇠)", "현장 권장"),
        ("잠근 뒤 기동 버튼을 눌러 켜지지 않는 것을 확인했다", "현장 권장"),
        ("관성으로 도는 부분이 완전히 멈췄고, 매달린 부품은 받쳤다", "현장 권장"),
        ("(기계) 건 사람이 직접 잠금을 풀고, 주변 인원을 확인한 뒤 켰다", "현장 권장"),
        ("교대 때는 다음 작업자가 자기 자물쇠를 건 뒤에 앞 작업자가 푼다", "현장 권장"),
    ]),
]


def sheet_check(ws):
    """1. 작업 전 점검표 (A4 세로)"""
    setup(ws)
    for col, w in zip("ABCDEF", [12, 48, 17, 6, 7, 8]):
        ws.column_dimensions[col].width = w
    title(ws, "F", "LOTO(잠금·표지) 작업 전 점검표",
          "동력으로 작동되는 기계의 정비·청소·급유·검사·수리·교체·조정 작업 전에 확인합니다 (산업안전보건기준에 관한 규칙 제92조).")
    r = 4
    for lb in ["작업 일시", "설비명·위치", "작업 내용", "작업자", "관리감독자"]:
        cell(ws, f"A{r}", lb, f(9, True), HEAD, CENTER)
        ws.merge_cells(f"B{r}:F{r}")
        cell(ws, f"B{r}", None); boxrange(ws, f"B{r}:F{r}")
        ws.row_dimensions[r].height = 22; r += 1
    r += 1
    n = 1
    for sec, items in LAW_ITEMS:
        section(ws, r, "F", sec); r += 1
        heads(ws, r, "ABCDEF", ["번호", "점검 내용", "근거", "예", "아니오", "해당없음"]); r += 1
        for text, basis in items:
            cell(ws, f"A{r}", n, align=CENTER)
            cell(ws, f"B{r}", text)
            cell(ws, f"C{r}", basis, f(8), align=CENTER)
            for col in "DEF":
                cell(ws, f"{col}{r}", None, align=CENTER)
            ws.row_dimensions[r].height = 32 if len(text) > 34 else 24
            n += 1; r += 1
        r += 1
    cell(ws, f"A{r}", "작업자", f(10, True), HEAD, CENTER)
    ws.merge_cells(f"B{r}:C{r}"); cell(ws, f"B{r}", "(서명)", f(9), align=Alignment_right()); boxrange(ws, f"B{r}:C{r}")
    ws.merge_cells(f"D{r}:E{r}"); cell(ws, f"D{r}", "관리감독자", f(10, True), HEAD, CENTER); boxrange(ws, f"D{r}:E{r}")
    cell(ws, f"F{r}", "(서명)", f(8), align=Alignment_right())
    ws.row_dimensions[r].height = 30; r += 1
    note(ws, r, "F", "'아니오'가 하나라도 있으면 작업을 시작하지 않습니다. 법 위반 시 5년 이하의 징역 또는 5천만 원 이하의 벌금(산업안전보건법 제168조), 근로자가 사망하면 7년 이하의 징역 또는 1억 원 이하의 벌금(제167조). · " + FOOT, NOTE, 40)


def Alignment_right():
    from openpyxl.styles import Alignment
    return Alignment(horizontal="right", vertical="bottom")


ENERGY = ["전기", "공압 (압축공기)", "유압", "증기·열", "중력·스프링 (낙하·복원)", "배관 내 물질 (가스·액체)", "기타 (            )"]


def sheet_procedure(ws):
    """2. 설비별 에너지 차단 절차서 (설비마다 한 장, 가로)"""
    setup(ws, landscape=True)
    cols, widths = "ABCDEFG", [23, 20, 20, 22, 22, 22, 8]
    for col, w in zip(cols, widths):
        ws.column_dimensions[col].width = w
    title(ws, "G", "설비별 에너지 차단 절차서",
          "설비마다 한 장씩 만들어 설비 가까이 두고, LOTO 교육 때 함께 씁니다. 시트를 복사해 설비별로 쓰세요.")
    r = 4
    for a, b in [("설비명", "관리번호"), ("설치 위치", "작성일")]:
        cell(ws, f"A{r}", a, f(10, True), HEAD, CENTER)
        ws.merge_cells(f"B{r}:C{r}"); cell(ws, f"B{r}", None); boxrange(ws, f"B{r}:C{r}")
        cell(ws, f"D{r}", b, f(10, True), HEAD, CENTER)
        ws.merge_cells(f"E{r}:G{r}"); cell(ws, f"E{r}", None); boxrange(ws, f"E{r}:G{r}")
        ws.row_dimensions[r].height = 24; r += 1
    cell(ws, f"A{r}", "작성자", f(10, True), HEAD, CENTER)
    ws.merge_cells(f"B{r}:C{r}"); cell(ws, f"B{r}", None); boxrange(ws, f"B{r}:C{r}")
    cell(ws, f"D{r}", "검토자 (관리감독자)", f(10, True), HEAD, CENTER)
    ws.merge_cells(f"E{r}:G{r}"); cell(ws, f"E{r}", None); boxrange(ws, f"E{r}:G{r}")
    ws.row_dimensions[r].height = 24; r += 2
    section(ws, r, "G", "1. 에너지원별 차단 방법"); r += 1
    heads(ws, r, cols, ["에너지 종류", "차단 장치·위치", "차단 방법", "잠금·표지 방법", "남은 에너지 없애는 방법", "차단 확인 방법", "해당"]); r += 1
    for e in ENERGY:
        cell(ws, f"A{r}", e, f(10, True), align=CENTER)
        for col in "BCDEF":
            cell(ws, f"{col}{r}", None)
        cell(ws, f"G{r}", "[ ]", align=CENTER)
        ws.row_dimensions[r].height = 34; r += 1
    note(ws, r, "G", "예: 전기 – 분전반 MCC-3 차단기 OFF, 차단기 잠금, 검전기 확인 / 공압 – 메인 밸브 잠금, 배기 밸브로 잔압 배출, 압력계 0 확인 / 중력 – 승강부 하강 또는 고정 핀 삽입", NOTE, 28); r += 2
    section(ws, r, "G", "2. 작업 순서"); r += 1
    steps = [
        ("알린다", "작업 사실을 운전자·주변 작업자에게 알린다", "현장 권장"),
        ("멈춘다", "정상 정지 순서로 기계의 운전을 정지한다", "규칙 제92조제1항"),
        ("끊는다", "1번 표의 모든 에너지원을 차단한다", "규칙 제92조, 제319조제2항"),
        ("잠근다·붙인다", "기동장치·차단장치에 잠금장치와 표지(꼬리표)를 단다", "규칙 제92조제2항, 제319조제2항제3호"),
        ("뺀다", "압축 기체·액체, 잔류전하 등 남은 에너지를 없앤다", "규칙 제92조제4항, 제319조제2항제4호"),
        ("확인한다", "기동 버튼을 눌러 켜지지 않는지, 검전기·압력계로 확인한다", "현장 권장, 제319조제2항제5호"),
        ("되돌린다", "방호장치를 복구하고, 인원을 확인한 뒤 건 사람이 잠금을 풀고 켠다", "규칙 제93조제2항, 제319조제3항"),
    ]
    heads(ws, r, cols, ["순서", "단계", "할 일", "", "", "근거", ""])
    ws.merge_cells(f"C{r}:E{r}"); ws.merge_cells(f"F{r}:G{r}")
    r += 1
    for i, (step, todo, basis) in enumerate(steps, 1):
        cell(ws, f"A{r}", i, align=CENTER)
        cell(ws, f"B{r}", step, f(10, True), align=CENTER)
        ws.merge_cells(f"C{r}:E{r}"); cell(ws, f"C{r}", todo); boxrange(ws, f"C{r}:E{r}")
        ws.merge_cells(f"F{r}:G{r}"); cell(ws, f"F{r}", basis, f(8), align=CENTER); boxrange(ws, f"F{r}:G{r}")
        ws.row_dimensions[r].height = 26; r += 1
    note(ws, r, "G", FOOT, NOTE, 20)


def sheet_log(ws):
    """3. 잠금·해제 기록부 (가로)"""
    setup(ws, landscape=True)
    names = ["날짜", "설비명", "작업 내용", "잠금 시각", "잠금자 (성명·자물쇠 번호)", "켜짐 시험", "해제 시각", "해제자 (건 사람)", "방호장치 복구", "관리감독자 확인"]
    widths = [10, 16, 22, 9, 20, 9, 9, 15, 10, 13]
    last = "J"
    title(ws, last, "잠금·해제 기록부",
          "누가 언제 잠그고 풀었는지 남깁니다. 잠금장치와 꼬리표는 건 사람이 직접 풉니다 (전기 작업은 규칙 제319조제3항제3호).")
    for i, (h, w) in enumerate(zip(names, widths)):
        col = chr(ord("A") + i)
        ws.column_dimensions[col].width = w
        cell(ws, f"{col}4", h, f(9, True), HEAD, CENTER)
    ws.row_dimensions[4].height = 30
    for r in range(5, 21):
        for i in range(len(names)):
            col = chr(ord("A") + i)
            cell(ws, f"{col}{r}", "[ ]" if names[i] in ("켜짐 시험", "방호장치 복구") else None, align=CENTER)
        ws.row_dimensions[r].height = 24
    note(ws, 22, last, "켜짐 시험: 잠근 뒤 기동 버튼을 눌러 켜지지 않는 것을 확인 (현장 권장). · " + FOOT, NOTE, 22)


def sheet_keys(ws):
    """4. 자물쇠·열쇠 관리대장"""
    setup(ws)
    names = ["자물쇠 번호", "사용자 (성명)", "부서", "지급일", "예비 열쇠 보관 장소", "반납일", "비고"]
    widths = [11, 14, 12, 11, 20, 11, 14]
    last = "G"
    title(ws, last, "자물쇠·열쇠 관리대장",
          "잠금장치를 한 뒤 열쇠는 별도로 관리합니다 (규칙 제92조제2항). 자물쇠는 한 사람에게 하나씩 지급하고 열쇠는 본인이 지닙니다 (현장 권장).")
    for i, (h, w) in enumerate(zip(names, widths)):
        col = chr(ord("A") + i)
        ws.column_dimensions[col].width = w
        cell(ws, f"{col}4", h, f(10, True), HEAD, CENTER)
    ws.row_dimensions[4].height = 26
    for r in range(5, 25):
        for i in range(len(names)):
            cell(ws, f"{chr(ord('A') + i)}{r}", None, align=CENTER)
        ws.row_dimensions[r].height = 24
    note(ws, 26, last, "예비 열쇠는 관리감독자가 따로 보관하고, 건 사람이 없을 때 쓰는 절차(본인 연락, 현장 확인, 기록)를 미리 정해 둡니다 (현장 권장). · " + FOOT, NOTE, 30)


def sheet_tags(ws):
    """5. 꼬리표 (인쇄해서 잘라 쓰기, A4 한 장에 6장)"""
    setup(ws)
    for col, w in zip("ABCDE", [30, 3, 30, 3, 1]):
        ws.column_dimensions[col].width = w
    title(ws, "C", "꼬리표 (인쇄해서 잘라 쓰세요)", "두꺼운 종이에 인쇄하거나 코팅해서 잠금장치에 함께 겁니다.")
    r = 4
    for _ in range(3):
        for col in "AC":
            rows = [
                ("조작 금지", f(20, True), 36, CENTER),
                ("작업 중입니다. 켜지 마십시오.", f(11, True), 22, CENTER),
                ("작업자:", f(10), 22, WRAP),
                ("연락처:", f(10), 22, WRAP),
                ("작업 내용:", f(10), 22, WRAP),
                ("건 날짜·시각:", f(10), 22, WRAP),
                ("이 표지는 건 사람만 뗍니다.", f(9, True), 20, CENTER),
            ]
            for k, (text, font, h, al) in enumerate(rows):
                c = cell(ws, f"{col}{r + k}", text, font, align=al)
                ws.row_dimensions[r + k].height = h
        r += len(rows) + 1
    note(ws, r, "C", FOOT, NOTE, 20)


def main():
    from openpyxl import Workbook
    wb = Workbook()
    wb.remove(wb.active)
    sheet_check(wb.create_sheet("1 작업 전 점검표"))
    sheet_procedure(wb.create_sheet("2 설비별 차단 절차서"))
    sheet_log(wb.create_sheet("3 잠금·해제 기록부"))
    sheet_keys(wb.create_sheet("4 자물쇠·열쇠 관리대장"))
    sheet_tags(wb.create_sheet("5 꼬리표(인쇄용)"))
    for ws in wb.worksheets:
        ws.page_setup.fitToHeight = 1  # 시트마다 A4 한 장
    wb.properties.creator = "그린헬멧기사"
    p = OUT / "checklist-loto.xlsx"
    wb.save(p)
    print("ok", p.name)


if __name__ == "__main__":
    main()
