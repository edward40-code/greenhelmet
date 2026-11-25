# 근골격계 유해요인조사 관리 세트 xlsx 생성기
# 출처 (국가법령정보센터 2026-11-25 확인):
#   산업안전보건기준에 관한 규칙 제656조~제666조 (고용노동부령 제450호, 2026. 3. 2. 시행)
#   근골격계부담작업의 범위 및 유해요인조사 방법에 관한 고시 제2조~제4조 (고용노동부고시 제2020-12호)
#   산업안전보건법 제39조, 제168조 (법률 제22122호, 2026. 10. 27. 시행)
# 고시 별지 제1호·제2호서식(유해요인조사표, 증상조사표)은 옮기지 않고 원문을 쓰도록 적는다.
# 실행: python scripts/make_msd_survey.py → public/library/msd-survey-set.xlsx (그다음 plain_colors.py)
from openpyxl.utils import get_column_letter
from make_checklists import OUT, HEAD, CENTER, WRAP, f, setup, cell, boxrange
from make_loto import title, note, section, heads, NOTE, FOOT
from make_risk_set import widths, label, blank, checks

BURDEN = [
    "하루 4시간 이상 집중적으로 자료입력 등을 위해 키보드 또는 마우스를 조작",
    "하루 총 2시간 이상 목, 어깨, 팔꿈치, 손목 또는 손을 사용해 같은 동작 반복",
    "하루 총 2시간 이상 머리 위에 손, 어깨 위에 팔꿈치, 팔꿈치를 몸통에서 들거나 몸통 뒤쪽에 둔 상태",
    "지지되지 않거나 자세를 바꿀 수 없는 조건에서 하루 총 2시간 이상 목이나 허리를 구부리거나 트는 상태",
    "하루 총 2시간 이상 쪼그리고 앉거나 무릎을 굽힌 자세",
    "하루 총 2시간 이상 지지 없이 1kg 이상 물건을 한 손 손가락으로 집어 옮기거나 2kg 이상 힘으로 한 손 손가락으로 쥠",
    "하루 총 2시간 이상 지지 없이 4.5kg 이상 물건을 한 손으로 들거나 같은 힘으로 쥠",
    "하루 10회 이상 25kg 이상의 물체를 듦",
    "하루 25회 이상 10kg 이상의 물체를 무릎 아래, 어깨 위, 팔을 뻗은 상태에서 듦",
    "하루 총 2시간 이상, 분당 2회 이상 4.5kg 이상의 물체를 듦",
    "하루 총 2시간 이상 시간당 10회 이상 손 또는 무릎으로 반복적으로 충격을 가함",
]


def sheet_classify(ws):
    setup(ws, landscape=True)
    names = ["번호", "공정·작업", "작업자 수", "하루 작업시간"] + [f"{i}호" for i in range(1, 12)] + ["부담작업", "비고"]
    cols = [get_column_letter(i + 1) for i in range(len(names))]
    last = cols[-1]
    widths(ws, cols, [5, 22, 8, 12] + [5] * 11 + [9, 14])
    title(ws, last, "근골격계부담작업 분류표",
          "작업마다 해당하는 호에 ○를 적습니다. 하나라도 해당하면 부담작업이며, 단기간 작업(2개월 이내 1회성)과 간헐적 작업(연간 60일 이하)은 제외합니다 (고시 제2조·제3조).")
    r = 4
    label(ws, r, "A", "조사일"); blank(ws, f"B{r}:B{r}"); label(ws, r, "C", "부서"); blank(ws, f"D{r}:{last}{r}")
    ws.row_dimensions[r].height = 24; r += 2
    for col, h in zip(cols, names):
        cell(ws, f"{col}{r}", h, f(9, True), HEAD, CENTER)
    ws.row_dimensions[r].height = 26; r += 1
    first = r
    for i in range(1, 16):
        cell(ws, f"A{r}", i, align=CENTER)
        for col in cols[1:]:
            cell(ws, f"{col}{r}", None, f(9), align=CENTER)
        m0, m1 = cols[4], cols[14]
        cell(ws, f"{cols[15]}{r}", f'=IF(COUNTA({m0}{r}:{m1}{r})=0,"",IF(B{r}="","","해당"))', f(9, True), align=CENTER)
        ws.row_dimensions[r].height = 22; r += 1
    r += 1
    section(ws, r, last, "근골격계부담작업 11가지 (근골격계부담작업의 범위 및 유해요인조사 방법에 관한 고시 제3조)"); r += 1
    for i, text in enumerate(BURDEN, 1):
        cell(ws, f"A{r}", f"{i}호", f(9, True), align=CENTER)
        ws.merge_cells(f"B{r}:{last}{r}")
        cell(ws, f"B{r}", text, f(9))
        boxrange(ws, f"B{r}:{last}{r}")
        ws.row_dimensions[r].height = 20; r += 1
    note(ws, r, last,
         "'하루'는 1일 소정근로시간과 연장근로시간 동안의 총 작업시간이고, '2시간 이상'·'4시간 이상'은 부담작업을 실제로 한 시간을 합한 것입니다 (고시 제2조). · " + FOOT,
         NOTE, 28)


def sheet_schedule(ws):
    setup(ws)
    widths(ws, "ABCDEF", [11, 24, 24, 14, 12, 12])
    title(ws, "F", "유해요인조사 일정·방법 확인",
          "근골격계부담작업이 있으면 3년마다 유해요인조사를 합니다 (산업안전보건기준에 관한 규칙 제657조제1항).")
    r = 4
    label(ws, r, "A", "최근 조사일"); blank(ws, f"B{r}:B{r}")
    label(ws, r, "C", "다음 정기조사 기한")
    cell(ws, f"D{r}", f'=IF(B{r}="","",EDATE(B{r},36))', f(10, True), align=CENTER)
    ws.merge_cells(f"D{r}:F{r}"); boxrange(ws, f"D{r}:F{r}")
    ws[f"D{r}"].number_format = "yyyy-mm-dd"; ws[f"B{r}"].number_format = "yyyy-mm-dd"
    ws.row_dimensions[r].height = 26; r += 2
    section(ws, r, "F", "1. 조사 시기 (규칙 제657조)"); r += 1
    r = checks(ws, r, "F", [
        ("정기조사: 3년마다 (작업장 상황, 작업조건, 근골격계질환 징후·증상)", "제657조①"),
        ("신설 사업장: 신설일부터 1년 이내 최초 조사", "제657조① 단서"),
        ("수시조사 1개월 이내: 근골격계질환자 발생 또는 업무상 질병 인정 (최근 1년 이내 조사·개선했으면 제외)", "제657조②1"),
        ("수시조사 1개월 이내: 부담작업에 해당하는 새로운 작업·설비 도입", "제657조②2"),
        ("수시조사 1개월 이내: 부담작업의 업무량·작업공정 등 작업환경 변경", "제657조②3"),
    ], "E", h=30)
    r += 1
    section(ws, r, "F", "2. 조사 방법과 참여 (규칙 제657조③, 제658조, 제661조)"); r += 1
    r = checks(ws, r, "F", [
        ("근로자대표 또는 해당 작업 근로자를 참여시켰다", "제657조③"),
        ("근로자 면담, 증상 설문조사, 인간공학적 조사 등 적절한 방법으로 했다", "제658조"),
        ("질환자 발생으로 한 수시조사는 고시 별지 제1호(유해요인조사표)·제2호(증상조사표) 서식을 활용했다", "제658조 단서, 고시 제4조"),
        ("조사 결과와 조사 방법을 해당 근로자에게 알렸다", "제661조②"),
        ("근로자대표가 요구하면 설명회를 열어 질환자 발생 수시조사 결과를 같은 방법으로 일하는 근로자에게 알렸다", "제661조③"),
    ], "E", h=30)
    r += 1
    section(ws, r, "F", "3. 예방관리 프로그램 대상인지 (규칙 제662조)"); r += 1
    r = checks(ws, r, "F", [
        ("근골격계질환 업무상 질병 인정자가 연간 10명 이상, 또는 5명 이상이면서 근로자 수의 10% 이상", "제662조①1"),
        ("노사 이견이 지속되어 고용노동부장관이 수립·시행을 명령했다", "제662조①2"),
        ("프로그램을 작성·시행할 때 노사협의를 거쳤다", "제662조②"),
    ], "E", h=28)
    note(ws, r, "F",
         "유해요인조사는 산업안전보건법 제39조제1항제5호(단순반복작업, 인체에 과도한 부담을 주는 작업)의 보건조치이며, 제39조제1항 위반은 5년 이하 징역 또는 5천만 원 이하 벌금입니다 (법 제168조제1호). · " + FOOT,
         NOTE, 32)


def sheet_improve(ws):
    setup(ws, landscape=True)
    names = ["번호", "공정·작업", "해당 호", "유해요인", "개선 방안", "담당", "완료 예정일", "완료일", "효과 확인", "근로자 의견"]
    cols = list("ABCDEFGHIJ")
    widths(ws, cols, [5, 18, 8, 24, 30, 9, 11, 11, 16, 16])
    title(ws, "J", "유해요인 개선 계획·이행표",
          "조사 결과 근골격계질환이 생길 우려가 있으면 인간공학적으로 설계된 보조설비·편의설비 설치 등 작업환경을 개선합니다 (산업안전보건기준에 관한 규칙 제659조).")
    r = 4
    for col, h in zip(cols, names):
        cell(ws, f"{col}{r}", h, f(9, True), HEAD, CENTER)
    ws.row_dimensions[r].height = 26; r += 1
    for i in range(1, 13):
        cell(ws, f"A{r}", i, align=CENTER)
        for col in cols[1:]:
            cell(ws, f"{col}{r}", None, f(9), align=CENTER)
        ws.row_dimensions[r].height = 28; r += 1
    note(ws, r, "J",
         "근로자가 운동범위 축소, 쥐는 힘 저하 등의 징후를 알리면 의학적 조치를 하고 필요하면 작업환경을 개선합니다 (제660조). 개선 후 같은 작업을 다시 평가해 효과를 확인합니다 (현장 권장). · " + FOOT,
         NOTE, 30)


def sheet_notice(ws):
    setup(ws)
    widths(ws, "ABCDE", [6, 34, 20, 12, 14])
    title(ws, "E", "근로자 알림·중량물 작업 점검표",
          "근골격계부담작업을 하는 근로자에게 알릴 사항과 5kg 이상 중량물 작업 조치를 확인합니다 (산업안전보건기준에 관한 규칙 제661조, 제663조~제666조).")
    r = 4
    label(ws, r, "A", "점검일"); blank(ws, f"B{r}:B{r}"); label(ws, r, "C", "점검자"); blank(ws, f"D{r}:E{r}")
    ws.row_dimensions[r].height = 24; r += 2
    section(ws, r, "E", "1. 근로자에게 알릴 사항 (규칙 제661조제1항)"); r += 1
    heads(ws, r, "ABCDE", ["확인", "알릴 사항", "알린 방법", "알린 날", "대상"])
    r += 1
    for text in ["근골격계부담작업의 유해요인", "근골격계질환의 징후와 증상", "근골격계질환 발생 시의 대처요령",
                 "올바른 작업자세와 작업도구, 작업시설의 올바른 사용방법", "그 밖에 근골격계질환 예방에 필요한 사항"]:
        cell(ws, f"A{r}", "[ ]", align=CENTER)
        cell(ws, f"B{r}", text, f(9))
        cell(ws, f"C{r}", "교육 · 게시 · TBM", f(8), align=CENTER)
        for col in "DE":
            cell(ws, f"{col}{r}", None, f(9), align=CENTER)
        ws.row_dimensions[r].height = 26; r += 1
    r += 1
    section(ws, r, "E", "2. 중량물을 인력으로 들어올리는 작업 (규칙 제663조~제666조)"); r += 1
    r = checks(ws, r, "E", [
        ("과도한 무게로 목·허리 등에 무리한 부담을 주지 않도록 했다", "제663조"),
        ("물품 중량·취급빈도·운반거리·운반속도에 따라 작업시간과 휴식시간을 배분했다", "제664조"),
        ("5kg 이상 물품의 중량과 무게중심을 작업장 주변에 안내 표시했다", "제665조1호"),
        ("취급하기 곤란한 물품은 손잡이, 갈고리, 진공빨판 등 보조도구를 쓴다", "제665조2호"),
        ("무게중심을 낮추고 대상물에 몸을 밀착하는 등 부담을 줄이는 자세를 알렸다", "제666조"),
    ], "E", h=28)
    note(ws, r, "E", "알린 방법과 대상은 사업장에 맞게 고칩니다 (현장 권장). · " + FOOT, NOTE, 24)


def main():
    from openpyxl import Workbook
    wb = Workbook()
    wb.remove(wb.active)
    sheet_classify(wb.create_sheet("1 부담작업 분류"))
    sheet_schedule(wb.create_sheet("2 조사 일정·방법"))
    sheet_improve(wb.create_sheet("3 개선 계획"))
    sheet_notice(wb.create_sheet("4 알림·중량물"))
    for ws in wb.worksheets:
        ws.page_setup.fitToHeight = 1
    wb.properties.creator = "그린헬멧기사"
    p = OUT / "msd-survey-set.xlsx"
    wb.save(p)
    print("ok", p.name)


if __name__ == "__main__":
    main()
