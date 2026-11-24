# 건강진단·작업환경측정 연간 관리 세트 xlsx 생성기
# 출처 (국가법령정보센터 2026-11-25 확인):
#   산업안전보건법 제125조, 제129조~제132조, 제175조제4항제6호·제7호 (법률 제22122호)
#   산업안전보건법 시행규칙 제188조, 제190조, 제197조, 제202조, 제203조, 제209조, 제210조, 제241조, [별표 23] (고용노동부령 제477호)
# 법 조문에 없는 항목은 '현장 권장'으로 따로 적는다.
# 실행: python scripts/make_health.py → public/library/health-annual-set.xlsx (그다음 plain_colors.py)
from make_checklists import OUT, HEAD, CENTER, WRAP, f, setup, cell, boxrange
from make_loto import title, note, section, heads, NOTE, FOOT
from make_risk_set import widths, label, blank

TASKS = [
    ("일반건강진단 (사무직)", "2년에 1회 이상", "규칙 제197조제1항"),
    ("일반건강진단 (그 밖의 근로자)", "1년에 1회 이상", "규칙 제197조제1항"),
    ("특수건강진단", "유해인자별 시기·주기 (별표 23)", "법 제130조, 규칙 제202조"),
    ("배치전건강진단", "특수건강진단 대상 업무 배치 전", "법 제130조제2항"),
    ("작업환경측정 (상반기)", "반기 1회 이상", "규칙 제190조제1항"),
    ("작업환경측정 (하반기)", "반기 1회 이상", "규칙 제190조제1항"),
    ("작업환경측정 결과 보고", "시료채취를 마친 날부터 30일 이내", "규칙 제188조제1항"),
    ("측정 결과 근로자 알림", "결과를 받은 뒤", "법 제125조제6항"),
    ("노출기준 초과 공정 개선 서류·계획 제출", "시료채취를 마친 날부터 60일 이내", "규칙 제188조제3항"),
    ("사후관리 조치결과 보고 (해당 시)", "결과표를 받은 날부터 30일 이내", "규칙 제210조제4항"),
]


def sheet_calendar(ws):
    setup(ws, landscape=True)
    names = ["번호", "업무", "주기·기한", "근거", "담당"] + [f"{m}월" for m in range(1, 13)] + ["비고"]
    cols = [chr(ord("A") + i) for i in range(len(names))]
    last = cols[-1]
    widths(ws, cols, [5, 30, 26, 20, 8] + [4.2] * 12 + [14])
    title(ws, last, "건강진단·작업환경측정 연간 일정",
          "할 달에 ○, 마친 달에 ●를 적습니다 (산업안전보건법 제125조·제129조·제130조, 시행규칙 제190조·제197조·제202조).")
    r = 4
    label(ws, r, "A", "연도"); blank(ws, f"B{r}:B{r}"); label(ws, r, "C", "사업장"); blank(ws, f"D{r}:{last}{r}")
    ws.row_dimensions[r].height = 22; r += 2
    for col, h in zip(cols, names):
        cell(ws, f"{col}{r}", h, f(9, True), HEAD, CENTER)
    ws.row_dimensions[r].height = 24; r += 1
    for i, (task, cycle, basis) in enumerate(TASKS + [("", "", "")] * 3, 1):
        cell(ws, f"A{r}", i, align=CENTER)
        cell(ws, f"B{r}", task or None, f(9))
        cell(ws, f"C{r}", cycle or None, f(8))
        cell(ws, f"D{r}", basis or None, f(8), align=CENTER)
        for col in cols[4:]:
            cell(ws, f"{col}{r}", None, align=CENTER)
        ws.row_dimensions[r].height = 24; r += 1
    note(ws, r, last,
         "작업환경측정은 측정치가 노출기준을 초과하면(고시 물질 외에는 2배 이상 초과) 해당 유해인자를 3개월에 1회 이상 측정하고, 최근 1년간 공정 변화가 없고 최근 2회 연속 소음 85dB 미만 또는 노출기준 미만이면 연 1회 이상 할 수 있습니다 (규칙 제190조). "
         "작업환경측정이나 건강진단을 하지 않으면 1천만 원 이하 과태료입니다 (법 제175조제4항제6호·제7호). 빈 줄에는 임시·수시건강진단 등 사업장 일정을 더합니다. · " + FOOT,
         NOTE, 40)


def sheet_general(ws):
    setup(ws)
    cols = list("ABCDEFGHI")
    widths(ws, cols, [5, 11, 13, 10, 12, 11, 12, 10, 14])
    title(ws, "I", "일반건강진단 대상자 명단",
          "사무직은 2년에 1회 이상, 그 밖의 근로자는 1년에 1회 이상 실시합니다 (시행규칙 제197조제1항).")
    r = 4
    label(ws, r, "A", "연도"); blank(ws, f"B{r}:C{r}"); label(ws, r, "D", "검진기관"); blank(ws, f"E{r}:I{r}")
    ws.row_dimensions[r].height = 22; r += 2
    heads(ws, r, "ABCDEFGHI", ["번호", "성명", "부서", "구분", "최근 실시일", "올해 대상", "실시일", "판정", "사후관리"])
    ws.row_dimensions[r].height = 24; r += 1
    for i in range(1, 26):
        cell(ws, f"A{r}", i, align=CENTER)
        cell(ws, f"D{r}", "사무 · 그 밖", f(8), align=CENTER)
        cell(ws, f"F{r}", "[ ]", align=CENTER)
        for col in "BCEGHI":
            cell(ws, f"{col}{r}", None, align=CENTER)
        ws.row_dimensions[r].height = 22; r += 1
    note(ws, r, "I",
         "사무직: 공장·공사현장과 같은 구역에 있지 않은 사무실에서 서무·인사·경리·판매·설계 등 사무업무를 하는 근로자 (판매업무에 직접 종사하는 근로자는 제외, 제197조제1항). "
         "결과표는 5년 보존합니다 (제241조제2항). 개별 결과는 본인 동의 없이 공개하지 않습니다 (법 제132조제2항). · " + FOOT,
         NOTE, 40)


BYL23 = [
    ("1", "N,N-디메틸아세트아미드, 디메틸포름아미드", "1개월 이내", "6개월"),
    ("2", "벤젠", "2개월 이내", "6개월"),
    ("3", "1,1,2,2-테트라클로로에탄, 사염화탄소, 아크릴로니트릴, 염화비닐", "3개월 이내", "6개월"),
    ("4", "석면, 면 분진", "12개월 이내", "12개월"),
    ("5", "광물성 분진, 목재 분진, 소음 및 충격소음", "12개월 이내", "24개월"),
    ("6", "제1호~제5호를 제외한 별표 22의 모든 대상 유해인자", "6개월 이내", "12개월"),
]


def sheet_special(ws):
    setup(ws, landscape=True)
    names = ["번호", "성명", "부서·공정", "유해인자", "별표23\n구분", "배치일", "배치전\n실시일", "첫 특수\n기한", "최근\n실시일", "주기", "다음 예정", "판정", "사후관리"]
    cols = [chr(ord("A") + i) for i in range(len(names))]
    last = cols[-1]
    widths(ws, cols, [5, 10, 16, 22, 7, 10, 10, 10, 10, 7, 10, 9, 16])
    title(ws, last, "특수·배치전건강진단 대상자 관리",
          "유해인자별로 배치 후 첫 번째 특수건강진단 시기와 주기를 관리합니다 (산업안전보건법 제130조, 시행규칙 제202조, 별표 23).")
    r = 4
    for col, h in zip(cols, names):
        cell(ws, f"{col}{r}", h, f(8, True), HEAD, CENTER)
    ws.row_dimensions[r].height = 30; r += 1
    for i in range(1, 13):
        cell(ws, f"A{r}", i, align=CENTER)
        for col in cols[1:]:
            cell(ws, f"{col}{r}", None, f(9), align=WRAP if col in "CD" else CENTER)
        ws.row_dimensions[r].height = 22; r += 1
    r += 1
    section(ws, r, last, "별표 23 특수건강진단의 시기 및 주기"); r += 1
    for col, h in (("A", "구분"), ("B", "대상 유해인자"), ("H", "배치 후 첫 번째"), ("J", "주기")):
        pass
    ws.merge_cells(f"B{r}:G{r}"); ws.merge_cells(f"H{r}:I{r}"); ws.merge_cells(f"J{r}:{last}{r}")
    for col, h in (("A", "구분"), ("B", "대상 유해인자"), ("H", "배치 후 첫 번째"), ("J", "주기")):
        cell(ws, f"{col}{r}", h, f(8, True), HEAD, CENTER)
    for rng in (f"B{r}:G{r}", f"H{r}:I{r}", f"J{r}:{last}{r}"):
        boxrange(ws, rng)
    ws.row_dimensions[r].height = 20; r += 1
    for no, what, first, cyc in BYL23:
        ws.merge_cells(f"B{r}:G{r}"); ws.merge_cells(f"H{r}:I{r}"); ws.merge_cells(f"J{r}:{last}{r}")
        cell(ws, f"A{r}", no, f(8), align=CENTER); cell(ws, f"B{r}", what, f(8))
        cell(ws, f"H{r}", first, f(8), align=CENTER); cell(ws, f"J{r}", cyc, f(8), align=CENTER)
        for rng in (f"B{r}:G{r}", f"H{r}:I{r}", f"J{r}:{last}{r}"):
            boxrange(ws, rng)
        ws.row_dimensions[r].height = 18; r += 1
    note(ws, r, last,
         "작업환경측정 결과 노출기준 이상 공정의 노출 근로자, 직업병 유소견자가 나온 공정의 노출 근로자, 주기 단축 소견을 받은 근로자는 다음 회에 한정해 주기를 2분의 1로 줄입니다 (제202조제2항). "
         "다른 사업장 등에서 같은 유해인자 건강진단을 받고 6개월(별표 23 제4호~제6호는 12개월)이 지나지 않았으면 배치전건강진단을 면제할 수 있습니다 (제203조). "
         "결과표는 5년, 고시 물질 취급 근로자는 30년 보존합니다 (제241조제2항). · " + FOOT,
         NOTE, 44)


def sheet_wem(ws):
    setup(ws, landscape=True)
    names = ["번호", "공정·작업", "유해인자", "측정일", "측정치", "노출기준", "초과", "다음 측정 주기", "결과 보고일", "근로자 알림일", "개선 계획 제출", "비고"]
    cols = [chr(ord("A") + i) for i in range(len(names))]
    last = cols[-1]
    widths(ws, cols, [5, 18, 18, 10, 10, 10, 6, 18, 11, 11, 12, 13])
    title(ws, last, "작업환경측정 결과 관리대장",
          "측정 결과를 기록·보존하고 보고하며, 해당 작업장 근로자에게 알리고 필요한 조치를 합니다 (산업안전보건법 제125조제5항·제6항, 시행규칙 제188조).")
    r = 4
    label(ws, r, "A", "반기"); ws.merge_cells(f"B{r}:C{r}")
    cell(ws, f"B{r}", "[ ] 상반기   [ ] 하반기", f(9)); boxrange(ws, f"B{r}:C{r}")
    label(ws, r, "D", "측정기관"); blank(ws, f"E{r}:H{r}"); label(ws, r, "I", "채취 완료일"); blank(ws, f"J{r}:{last}{r}")
    ws.row_dimensions[r].height = 24; r += 2
    for col, h in zip(cols, names):
        cell(ws, f"{col}{r}", h, f(8, True), HEAD, CENTER)
    ws.row_dimensions[r].height = 26; r += 1
    for i in range(1, 13):
        cell(ws, f"A{r}", i, align=CENTER)
        for col in cols[1:]:
            cell(ws, f"{col}{r}", None, f(9), align=WRAP if col in "BC" else CENTER)
        cell(ws, f"G{r}", "[ ]", align=CENTER)
        cell(ws, f"H{r}", "6개월 · 3개월 · 1년", f(8), align=CENTER)
        ws.row_dimensions[r].height = 22; r += 1
    r += 1
    section(ws, r, last, "근로자대표·위원회 요구 사항 (법 제125조제4항·제7항)"); r += 1
    for text in ["근로자대표가 요구하면 측정 시 근로자대표를 참석시켰다 (제4항)",
                 "산업안전보건위원회나 근로자대표가 요구하면 결과 설명회를 열었다 (제7항)"]:
        cell(ws, f"A{r}", "[ ]", align=CENTER)
        ws.merge_cells(f"B{r}:{last}{r}"); cell(ws, f"B{r}", text, f(9)); boxrange(ws, f"B{r}:{last}{r}")
        ws.row_dimensions[r].height = 22; r += 1
    note(ws, r, last,
         "결과보고서는 시료채취를 마친 날부터 30일 이내 제출합니다(측정기관이 전자적으로 제출하면 보고한 것으로 봄, 법 제125조제5항 단서). 노출기준 초과 공정은 60일 이내 개선 증명 서류나 개선 계획을 제출합니다 (규칙 제188조제3항). "
         "측정 결과 서류는 5년, 고시 물질은 30년 보존합니다 (제241조제1항). · " + FOOT,
         NOTE, 34)


def sheet_after(ws):
    setup(ws, landscape=True)
    names = ["번호", "성명", "건강진단 종류", "판정·의사 소견", "조치", "근로자 설명일", "보고 대상", "보고서 제출일", "확인"]
    cols = list("ABCDEFGHI")
    widths(ws, cols, [5, 11, 14, 30, 36, 12, 10, 13, 10])
    title(ws, "I", "건강진단 사후관리 조치 기록",
          "결과표에 따라 필요하면 조치하고 근로자에게 설명합니다 (산업안전보건법 제132조제4항, 시행규칙 제210조제1항).")
    r = 4
    for col, h in zip(cols, names):
        cell(ws, f"{col}{r}", h, f(8, True), HEAD, CENTER)
    ws.row_dimensions[r].height = 26; r += 1
    for i in range(1, 13):
        cell(ws, f"A{r}", i, align=CENTER)
        for col in "BCDFHI":
            cell(ws, f"{col}{r}", None, f(9), align=WRAP if col == "D" else CENTER)
        cell(ws, f"E{r}", "[ ]작업장소 변경 [ ]작업 전환 [ ]근로시간 단축 [ ]야간근로 제한 [ ]작업환경측정 [ ]시설·설비 개선", f(7))
        cell(ws, f"G{r}", "[ ]", align=CENTER)
        ws.row_dimensions[r].height = 30; r += 1
    note(ws, r, "I",
         "보고 대상: 특수·수시·임시건강진단 결과 근로 금지·제한, 작업전환, 근로시간 단축, 직업병 확진 의뢰 안내가 필요하다는 의사 소견이 있는 결과표를 받은 경우, 받은 날부터 30일 이내에 사후관리 조치결과 보고서를 제출합니다 (시행규칙 제210조제3항·제4항). "
         "건강진단 결과는 근로자의 건강 보호·유지 외의 목적으로 쓰지 않습니다 (법 제132조제3항). 이 기록은 개인정보가 담기므로 담당자만 열람하도록 보관합니다 (현장 권장). · " + FOOT,
         NOTE, 40)


def main():
    from openpyxl import Workbook
    wb = Workbook()
    wb.remove(wb.active)
    sheet_calendar(wb.create_sheet("1 연간 일정"))
    sheet_general(wb.create_sheet("2 일반건강진단"))
    sheet_special(wb.create_sheet("3 특수·배치전"))
    sheet_wem(wb.create_sheet("4 작업환경측정"))
    sheet_after(wb.create_sheet("5 사후관리"))
    for ws in wb.worksheets:
        ws.page_setup.fitToHeight = 1
    wb.properties.creator = "그린헬멧기사"
    p = OUT / "health-annual-set.xlsx"
    wb.save(p)
    print("ok", p.name)


if __name__ == "__main__":
    main()
