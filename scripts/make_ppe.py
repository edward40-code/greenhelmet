# 보호구 지급·관리대장 xlsx 생성기
# 출처 (국가법령정보센터 2026-11-25 확인): 산업안전보건기준에 관한 규칙 제32조~제34조 (고용노동부령 제450호, 2026. 3. 2. 시행)
# 법 조문에 없는 항목은 '현장 권장'으로 따로 적는다.
# 실행: python scripts/make_ppe.py → public/library/ppe-ledger.xlsx (그다음 plain_colors.py)
from make_checklists import OUT, HEAD, CENTER, WRAP, f, setup, cell, boxrange
from make_loto import title, note, section, heads, NOTE, FOOT
from make_risk_set import widths, label, blank

RULE32 = [
    ("물체가 떨어지거나 날아올 위험 또는 근로자가 추락할 위험이 있는 작업", "안전모"),
    ("높이 또는 깊이 2미터 이상의 추락할 위험이 있는 장소에서 하는 작업", "안전대"),
    ("물체의 낙하·충격, 물체에의 끼임, 감전 또는 정전기의 대전에 의한 위험이 있는 작업", "안전화"),
    ("물체가 흩날릴 위험이 있는 작업", "보안경"),
    ("용접 시 불꽃이나 물체가 흩날릴 위험이 있는 작업", "보안면"),
    ("감전의 위험이 있는 작업", "절연용 보호구"),
    ("고열에 의한 화상 등의 위험이 있는 작업", "방열복"),
    ("선창 등에서 분진이 심하게 발생하는 하역작업", "방진마스크"),
    ("섭씨 영하 18도 이하인 급냉동어창에서 하는 하역작업", "방한모·방한복·방한화·방한장갑"),
    ("이륜자동차·원동기장치자전거로 운반·수거·배달하는 작업", "승차용 안전모"),
    ("자전거등으로 운반·수거·배달하는 작업", "안전모 (도로교통법 시행규칙 제32조제2항 기준)"),
]


def sheet_standard(ws):
    setup(ws)
    widths(ws, "ABCDEFG", [5, 40, 18, 22, 8, 8, 9])
    title(ws, "G", "작업별 보호구 지급 기준",
          "작업조건에 맞는 보호구를 작업하는 근로자 수 이상으로 지급하고 착용하도록 합니다 (산업안전보건기준에 관한 규칙 제32조제1항).")
    r = 4
    label(ws, r, "A", "연도"); blank(ws, f"B{r}:B{r}"); label(ws, r, "C", "사업장"); blank(ws, f"D{r}:G{r}")
    ws.row_dimensions[r].height = 22; r += 2
    heads(ws, r, "ABCDEFG", ["호", "작업 (제32조제1항)", "보호구", "우리 사업장 해당 작업", "인원", "지급 수량", "인원 이상"])
    ws.row_dimensions[r].height = 26; r += 1
    for i, (work, ppe) in enumerate(RULE32, 1):
        cell(ws, f"A{r}", i, align=CENTER)
        cell(ws, f"B{r}", work, f(8))
        cell(ws, f"C{r}", ppe, f(9, True), align=CENTER)
        for col in "DEF":
            cell(ws, f"{col}{r}", None, align=CENTER if col != "D" else WRAP)
        cell(ws, f"G{r}", "[ ]", align=CENTER)
        ws.row_dimensions[r].height = 30; r += 1
    for _ in range(4):
        for col in "ABCDEFG":
            cell(ws, f"{col}{r}", None, align=CENTER)
        cell(ws, f"G{r}", "[ ]", align=CENTER)
        ws.row_dimensions[r].height = 26; r += 1
    note(ws, r, "G",
         "빈 줄에는 방독마스크, 청력보호구, 화학물질용 장갑처럼 다른 조문(소음, 유해물질 등)이나 위험성평가에서 정한 보호구를 더합니다 (현장 권장). "
         "보호구를 받거나 착용 지시를 받은 근로자는 착용해야 합니다 (제32조제2항). · " + FOOT,
         NOTE, 32)


def sheet_issue(ws):
    setup(ws, landscape=True)
    names = ["번호", "성명", "부서·작업", "보호구", "규격·치수", "수량", "지급일", "교체 사유", "다음 교체 예정", "수령 서명"]
    cols = list("ABCDEFGHIJ")
    widths(ws, cols, [5, 12, 18, 18, 14, 6, 11, 18, 13, 14])
    title(ws, "J", "보호구 개인 지급 대장",
          "누구에게 무엇을 언제 지급했는지 남기고 수령 서명을 받습니다 (현장 권장, 지급 의무는 산업안전보건기준에 관한 규칙 제32조).")
    r = 4
    for col, h in zip(cols, names):
        cell(ws, f"{col}{r}", h, f(9, True), HEAD, CENTER)
    ws.row_dimensions[r].height = 24; r += 1
    for i in range(1, 21):
        cell(ws, f"A{r}", i, align=CENTER)
        for col in cols[1:]:
            cell(ws, f"{col}{r}", None, f(9), align=CENTER)
        cell(ws, f"H{r}", "신규 · 파손 · 분실 · 주기", f(8), align=CENTER)
        ws.row_dimensions[r].height = 22; r += 1
    note(ws, r, "J",
         "공동사용으로 질병이 감염될 우려가 있는 보호구(마스크, 귀마개 등)는 개인 전용으로 지급합니다 (제34조). 교체 주기는 제조사 사용설명서를 따릅니다 (현장 권장). · " + FOOT,
         NOTE, 26)


def sheet_check(ws):
    setup(ws, landscape=True)
    months = [f"{m}월" for m in range(1, 13)]
    names = ["번호", "보호구", "보관 장소", "점검 내용"] + months
    cols = [chr(ord("A") + i) for i in range(len(names))]
    last = cols[-1]
    widths(ws, cols, [5, 16, 14, 36] + [5] * 12)
    title(ws, last, "보호구 점검·재고 관리표",
          "지급한 보호구는 상시 점검해 이상이 있으면 수리하거나 교환하고, 방진마스크 필터 등은 언제나 교환할 수 있게 충분히 갖춰 둡니다 (산업안전보건기준에 관한 규칙 제33조).")
    r = 4
    for col, h in zip(cols, names):
        cell(ws, f"{col}{r}", h, f(9, True), HEAD, CENTER)
    ws.row_dimensions[r].height = 24; r += 1
    rows = [
        ("안전모", "", "균열·변형, 턱끈, 내장재 상태"),
        ("안전대", "", "벨트·죔줄 손상, 훅 잠금장치, 충격 흡수 장치"),
        ("안전화", "", "밑창 마모, 앞코 변형"),
        ("보안경·보안면", "", "렌즈 긁힘·깨짐, 고정끈"),
        ("절연용 보호구", "", "찢어짐·구멍, 절연 성능 확인 시기"),
        ("방진마스크", "", "필터 재고 (제33조제2항), 면체 밀착"),
        ("", "", ""), ("", "", ""), ("", "", ""),
    ]
    for i, (ppe, place, chk) in enumerate(rows, 1):
        cell(ws, f"A{r}", i, align=CENTER)
        cell(ws, f"B{r}", ppe or None, f(9, True), align=CENTER)
        cell(ws, f"C{r}", place or None, f(9), align=CENTER)
        cell(ws, f"D{r}", chk or None, f(8))
        for col in cols[4:]:
            cell(ws, f"{col}{r}", None, align=CENTER)
        ws.row_dimensions[r].height = 30; r += 1
    note(ws, r, last,
         "월 칸에는 이상 없음 ○, 수리·교환 △, 재고 부족 × 를 적습니다. 점검 내용은 예시이며 사용설명서와 사업장 기준을 따릅니다 (현장 권장). "
         "사업주는 보호구의 청결을 유지하도록 하되, 근로자가 청결을 유지하는 안전화·안전모·보안경은 제외됩니다 (제33조제1항). · " + FOOT,
         NOTE, 32)


def main():
    from openpyxl import Workbook
    wb = Workbook()
    wb.remove(wb.active)
    sheet_standard(wb.create_sheet("1 지급 기준"))
    sheet_issue(wb.create_sheet("2 개인 지급 대장"))
    sheet_check(wb.create_sheet("3 점검·재고"))
    for ws in wb.worksheets:
        ws.page_setup.fitToHeight = 1
    wb.properties.creator = "그린헬멧기사"
    p = OUT / "ppe-ledger.xlsx"
    wb.save(p)
    print("ok", p.name)


if __name__ == "__main__":
    main()
