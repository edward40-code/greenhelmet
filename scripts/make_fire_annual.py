# 소방안전관리 연간 세트 xlsx 생성기
# 출처 (국가법령정보센터 2026-11-25 확인):
#   화재의 예방 및 안전관리에 관한 법률 제24조, 제26조, 제34조, 제36조, 제37조, 제52조 (법률 제21396호, 2026. 2. 27. 시행)
#   같은 법 시행령 제27조, 제38조 (대통령령 제36432호, 2026. 7. 1. 시행)
#   같은 법 시행규칙 제10조, 제11조, 제29조, 제34조~제37조 (행정안전부령 제628호, 2026. 7. 1. 시행)
#   소방시설 설치 및 관리에 관한 법률 제22조~제24조, 제61조
#   같은 법 시행규칙 제20조, 제22조, 제23조, 제25조 (행정안전부령 제653호, 2026. 10. 19. 시행)
# 법 조문에 없는 항목은 '현장 권장'으로 따로 적는다. 자체점검 시기·횟수(시행규칙 별표 3)는 원문 파일로 확인하도록 적는다.
# 실행: python scripts/make_fire_annual.py → public/library/fire-safety-annual-set.xlsx (그다음 plain_colors.py)
from make_checklists import OUT, HEAD, CENTER, WRAP, f, setup, cell, boxrange
from make_loto import title, note, section, heads, NOTE, FOOT
from make_risk_set import widths, label, blank, checks

MONTHS = [f"{m}월" for m in range(1, 13)]


def sheet_calendar(ws):
    setup(ws, landscape=True)
    cols = [chr(ord("A") + i) for i in range(17)]
    last = cols[-1]
    widths(ws, cols, [5, 34, 24, 27] + [5] * 12 + [9])
    title(ws, last, "소방안전관리 연간 일정표",
          "법정 주기를 1~12월에 배치하고, 실시한 달에 ○를 적습니다. 배치하는 달은 사업장이 정합니다 (현장 권장).")
    r = 4
    label(ws, r, "A", "연도"); blank(ws, f"B{r}:B{r}"); label(ws, r, "C", "소방안전관리대상물 등급"); blank(ws, f"D{r}:{last}{r}")
    ws.row_dimensions[r].height = 24; r += 2
    names = ["번호", "업무", "주기·기한", "근거"] + MONTHS + ["담당"]
    for col, h in zip(cols, names):
        cell(ws, f"{col}{r}", h, f(9, True), HEAD, CENTER)
    ws.row_dimensions[r].height = 26; r += 1
    rows = [
        ("소방계획서 작성·시행 (연초에 바뀐 점 반영)", "작성·시행 의무, 검토 시기는 현장 권장", "화재예방법 제24조⑤1, 영 제27조"),
        ("자위소방대 소집, 편성 상태·초기대응체계 점검, 편성 근무자 소방교육", "연 1회 이상", "규칙 제11조⑤"),
        ("근무자 소방훈련(소화·통보·피난)과 교육", "연 1회 이상 (소방서 요청 시 2회 범위 추가)", "화재예방법 제37조①, 규칙 제36조①"),
        ("소방훈련·교육 실시 결과서 제출 (특급·1급)", "실시한 날부터 30일 이내", "화재예방법 제37조②, 영 제38조, 규칙 제37조"),
        ("소방안전관리 업무수행 기록 작성", "월 1회 이상, 2년 보관", "규칙 제10조①③"),
        ("피난유도 안내정보 제공 (아래 방법 중 하나)", "연 2회 피난안내 교육 / 분기 1회 이상 방송 / 층마다 안내도 / 안내영상", "화재예방법 제36조③, 규칙 제35조①"),
        ("소방시설등 자체점검: 작동점검", "구분·대상·횟수는 별표 3 원문 확인", "소방시설법 제22조, 규칙 제20조 별표 3"),
        ("소방시설등 자체점검: 종합점검", "구분·대상·횟수는 별표 3 원문 확인", "소방시설법 제22조, 규칙 제20조 별표 3"),
        ("자체점검 결과 보고 (이행계획서 첨부)", "점검이 끝난 날부터 15일 이내 (토·공휴일 제외)", "소방시설법 제23조③, 규칙 제23조②③"),
        ("자체점검기록표 게시", "보고한 날부터 10일 이내", "소방시설법 제24조①, 규칙 제25조"),
        ("소방안전관리자·보조자 실무교육", "선임 후 6개월 이내, 이후 2년마다 1회 이상", "화재예방법 제34조, 규칙 제29조③④"),
        ("소방안전관리자 선임신고, 성명 등 게시", "선임한 날부터 14일 이내", "화재예방법 제26조①"),
    ]
    for i, (todo, cycle, basis) in enumerate(rows, 1):
        cell(ws, f"A{r}", i, align=CENTER)
        cell(ws, f"B{r}", todo, f(9))
        cell(ws, f"C{r}", cycle, f(8))
        cell(ws, f"D{r}", basis, f(8), align=CENTER)
        for col in cols[4:]:
            cell(ws, f"{col}{r}", None, align=CENTER)
        ws.row_dimensions[r].height = 34; r += 1
    for _ in range(2):
        for col in cols:
            cell(ws, f"{col}{r}", None, align=CENTER)
        ws.row_dimensions[r].height = 26; r += 1
    note(ws, r, last,
         "소방훈련·교육 미실시와 소방안전관리업무 미수행은 300만 원 이하, 훈련·교육 결과 미제출과 선임신고·게시 위반은 200만 원 이하, 실무교육 미이수는 100만 원 이하 과태료입니다 (화재예방법 제52조). "
         "자체점검 결과 미보고·거짓 보고, 이행계획 미완료, 점검기록표 미게시는 300만 원 이하 과태료입니다 (소방시설법 제61조제1항제8호~제10호). · " + FOOT,
         NOTE, 42)


PLAN_ITEMS = [
    ("위치·구조·연면적·용도·수용인원 등 일반 현황", "영 제27조①1"),
    ("소방시설, 방화시설, 전기시설, 가스시설, 위험물시설 현황", "영 제27조①2"),
    ("화재 예방을 위한 자체점검계획과 대응대책", "영 제27조①3"),
    ("소방시설·피난시설·방화시설의 점검·정비계획", "영 제27조①4"),
    ("피난층·피난시설 위치, 피난경로 설정, 화재안전취약자 피난계획을 포함한 피난계획", "영 제27조①5"),
    ("방화구획, 제연구획, 내부 마감재료, 방염대상물품 사용 현황과 방화구조·설비 유지·관리계획", "영 제27조①6"),
    ("관리의 권원이 분리된 특정소방대상물의 소방안전관리 (해당 시)", "영 제27조①7"),
    ("소방훈련·교육에 관한 계획", "영 제27조①8"),
    ("자위소방대 조직과 대원의 임무 (화재안전취약자 피난 보조 임무 포함)", "영 제27조①9"),
    ("화기 취급 작업 사전 안전조치·감독 등 공사 중 소방안전관리", "영 제27조①10"),
    ("소화와 연소 방지에 관한 사항", "영 제27조①11"),
    ("위험물 저장·취급 (예방규정을 정하는 제조소등은 제외)", "영 제27조①12"),
    ("소방안전관리 업무수행 기록·유지", "영 제27조①13"),
    ("화재 시 화재경보, 초기소화, 피난유도 등 초기대응", "영 제27조①14"),
    ("소방본부장·소방서장이 요청한 사항 (있을 때)", "영 제27조①15"),
]

EVAC_ITEMS = [
    ("화재경보의 수단과 방식", "규칙 제34조①1"),
    ("층별·구역별 피난대상 인원의 연령별·성별 현황", "규칙 제34조①2"),
    ("피난약자 현황", "규칙 제34조①3"),
    ("각 거실에서 옥외(옥상, 피난안전구역 포함)로 이르는 피난경로", "규칙 제34조①4"),
    ("피난약자와 동반자의 피난동선·피난방법", "규칙 제34조①5"),
    ("피난시설, 방화구획 등 피난에 영향을 줄 수 있는 사항", "규칙 제34조①6"),
    ("피난시설이 바뀌었으면 피난계획에 반영했다", "규칙 제34조③"),
]


def sheet_plan(ws):
    setup(ws)
    widths(ws, "ABCDE", [6, 30, 30, 10, 16])
    title(ws, "E", "소방계획서 포함 사항 점검표",
          "소방계획서에 시행령 제27조제1항의 15개 사항과 피난계획 사항이 모두 들어 있는지 확인합니다.")
    r = 4
    label(ws, r, "A", "작성일"); blank(ws, f"B{r}:B{r}"); label(ws, r, "C", "소방안전관리자"); blank(ws, f"D{r}:E{r}")
    ws.row_dimensions[r].height = 24; r += 2
    section(ws, r, "E", "1. 소방계획서 (화재예방법 제24조제5항제1호, 시행령 제27조제1항)"); r += 1
    r = checks(ws, r, "E", PLAN_ITEMS, "E", h=26)
    r += 1
    section(ws, r, "E", "2. 피난계획 (화재예방법 제36조, 시행규칙 제34조)"); r += 1
    r = checks(ws, r, "E", EVAC_ITEMS, "E", h=24)
    note(ws, r, "E",
         "소방본부장 또는 소방서장은 소방계획서 작성·실시를 지도·감독합니다 (시행령 제27조제2항). 연초와 시설·인원이 바뀔 때 다시 확인합니다 (현장 권장). · " + FOOT,
         NOTE, 30)


def sheet_brigade(ws):
    setup(ws)
    widths(ws, "ABCDEF", [16, 38, 12, 14, 12, 12])
    title(ws, "F", "자위소방대 편성표",
          "대장·부대장 각 1명을 두고, 인원은 수용인원 등을 고려해 구성합니다 (시행규칙 제11조제2항).")
    r = 4
    label(ws, r, "A", "편성일"); blank(ws, f"B{r}:B{r}"); label(ws, r, "C", "점검일"); blank(ws, f"D{r}:F{r}")
    ws.row_dimensions[r].height = 24; r += 2
    heads(ws, r, "ABCDEF", ["구분", "임무 (시행규칙 제11조제2항)", "성명", "연락처", "근무 위치", "대리자"])
    ws.row_dimensions[r].height = 24; r += 1
    rows = [
        ("대장", "자위소방대 총괄 지휘"),
        ("부대장", "대장 보좌, 대장이 임무를 할 수 없을 때 대행"),
        ("비상연락팀", "화재사실 전파와 신고"),
        ("초기소화팀", "화재 발생 시 초기화재 진압"),
        ("피난유도팀", "재실자와 피난약자를 안전한 장소로 대피"),
        ("응급구조팀", "인명 구조, 부상자 응급조치 (추가 편성 가능)"),
        ("방호안전팀", "화재확산 방지, 위험시설 비상정지 (추가 편성 가능)"),
    ]
    for team, duty in rows:
        for k in range(1 if team in ("대장", "부대장") else 3):
            cell(ws, f"A{r}", team if k == 0 else None, f(9, True), align=CENTER)
            cell(ws, f"B{r}", duty if k == 0 else None, f(8))
            for col in "CDEF":
                cell(ws, f"{col}{r}", None, f(9), align=CENTER)
            ws.row_dimensions[r].height = 22; r += 1
    note(ws, r, "F",
         "초기대응체계는 자위소방대에 포함해 근무 위치·인원을 고려해 편성하고, 대상물이 이용되는 동안 상시 운영합니다 (시행규칙 제11조제3항·제4항). "
         "연 1회 이상 소집해 편성 상태를 점검하고 교육한 결과는 별지 제13호서식에 기록해 2년간 보관합니다 (같은 조 제5항·제7항). · " + FOOT,
         NOTE, 40)


def sheet_drill(ws):
    setup(ws, landscape=True)
    names = ["번호", "실시일", "구분", "대상·장소", "참가 인원", "훈련·교육 내용", "소요 시간", "개선할 점", "결과서 제출일", "확인"]
    cols = list("ABCDEFGHIJ")
    widths(ws, cols, [5, 11, 18, 16, 9, 34, 9, 24, 12, 7])
    title(ws, "J", "소방훈련·교육 실시 관리표",
          "연 1회 이상 실시하고, 피난훈련에는 출입하는 사람을 안전한 장소로 대피·유도하는 훈련을 포함합니다 (화재예방법 제37조제1항, 시행규칙 제36조제1항).")
    r = 4
    for col, h in zip(cols, names):
        cell(ws, f"{col}{r}", h, f(9, True), HEAD, CENTER)
    ws.row_dimensions[r].height = 26; r += 1
    for i in range(1, 11):
        cell(ws, f"A{r}", i, align=CENTER)
        for col in cols[1:]:
            cell(ws, f"{col}{r}", None, f(9), align=CENTER)
        cell(ws, f"C{r}", "소화 · 통보 · 피난 · 교육", f(8), align=CENTER)
        cell(ws, f"J{r}", "[ ]", align=CENTER)
        ws.row_dimensions[r].height = 26; r += 1
    note(ws, r, "J",
         "법정 기록은 별지 제28호서식(소방훈련·교육 실시 결과 기록부)에 하고 실시한 날부터 2년간 보관합니다 (시행규칙 제36조제4항). 이 표는 연간 관리용입니다 (현장 권장). "
         "특급·1급은 실시한 날부터 30일 이내 별지 제29호서식 결과서를 소방서에 제출합니다 (시행규칙 제37조). 훈련에 필요한 장비와 교재를 갖춥니다 (제36조제3항). · " + FOOT,
         NOTE, 40)


def sheet_monthly(ws):
    setup(ws, landscape=True)
    names = ["월", "작성일", "피난시설·방화구획·방화시설\n관리 (제3호)", "소방시설 등 관리 (제4호)", "화기 취급 감독 (제6호)",
             "보수·정비 필요 사항", "관계인\n통보일", "작성자"]
    cols = list("ABCDEFGH")
    widths(ws, cols, [6, 10, 28, 28, 24, 26, 11, 10])
    title(ws, "H", "소방안전관리 업무수행 기록 (월별)",
          "소방안전관리자는 업무수행 기록을 월 1회 이상 작성·관리하고 작성한 날부터 2년간 보관합니다 (화재예방법 제24조제5항제7호, 시행규칙 제10조).")
    r = 4
    for col, h in zip(cols, names):
        cell(ws, f"{col}{r}", h, f(9, True), HEAD, CENTER)
    ws.row_dimensions[r].height = 30; r += 1
    for m in MONTHS:
        cell(ws, f"A{r}", m, f(9, True), align=CENTER)
        for col in cols[1:]:
            cell(ws, f"{col}{r}", None, f(9))
        ws.row_dimensions[r].height = 30; r += 1
    note(ws, r, "H",
         "법정 서식은 별지 제12호서식(소방안전관리자 업무 수행 기록표)입니다. 보수·정비가 필요한 사항은 지체 없이 관계인에게 알리고 기록합니다 (시행규칙 제10조제2항). · " + FOOT,
         NOTE, 30)


def sheet_report(ws):
    setup(ws, landscape=True)
    names = ["번호", "구분", "점검 시작일", "점검 종료일", "점검자", "결과 받은 날\n(10일)", "소방서 보고일\n(15일)",
             "이행 완료 기한", "이행완료 보고일\n(10일)", "기록표 게시일\n(10일)", "보관\n(2년)"]
    cols = list("ABCDEFGHIJK")
    widths(ws, cols, [5, 13, 11, 11, 16, 12, 12, 13, 12, 12, 8])
    title(ws, "K", "소방시설등 자체점검 결과 보고 관리표",
          "점검이 끝난 뒤 보고·이행·게시 기한을 한 줄에 맞춰 적습니다 (소방시설법 제22조~제24조, 시행규칙 제23조·제25조).")
    r = 4
    for col, h in zip(cols, names):
        cell(ws, f"{col}{r}", h, f(9, True), HEAD, CENTER)
    ws.row_dimensions[r].height = 34; r += 1
    for i in range(1, 9):
        cell(ws, f"A{r}", i, align=CENTER)
        for col in cols[1:]:
            cell(ws, f"{col}{r}", None, f(9), align=CENTER)
        cell(ws, f"B{r}", "작동 · 종합", f(8), align=CENTER)
        cell(ws, f"E{r}", "관리업자등 · 자체", f(8), align=CENTER)
        cell(ws, f"K{r}", "[ ]", align=CENTER)
        ws.row_dimensions[r].height = 26; r += 1
    r += 1
    section(ws, r, "K", "기한 정리"); r += 1
    r = checks(ws, r, "K", [
        ("관리업자등이 점검했으면 점검이 끝난 날부터 10일 이내 실시결과 보고서와 소방시설등점검표를 받는다", "규칙 제23조①"),
        ("점검이 끝난 날부터 15일 이내 실시결과 보고서에 이행계획서(별지 제10호서식)와 점검인력 배치확인서(관리업자 점검 시)를 붙여 소방서에 보고한다", "규칙 제23조②"),
        ("이행 완료 기한: 기계·기구 수리·정비는 보고일부터 10일, 전부·일부 철거 후 교체는 20일 이내 (소방서가 달리 정할 수 있음)", "규칙 제23조⑤"),
        ("이행을 마친 날부터 10일 이내 이행완료 보고서(별지 제11호서식)에 전·후 사진과 공사 계약서를 붙여 보고한다", "규칙 제23조⑥"),
        ("보고한 날부터 10일 이내 자체점검기록표(별표 5)를 출입자가 잘 보는 곳에 게시하고, 다음 기록표 게시 전까지 둔다", "규칙 제25조"),
        ("소화펌프 고장 등 중대위반사항은 지체 없이 수리 등 필요한 조치를 한다", "소방시설법 제23조①"),
        ("점검을 하기 곤란하면 실시 만료일 3일 전까지 면제·연기를 신청한다", "규칙 제22조①"),
    ], "I", h=28)
    note(ws, r, "K",
         "보고 기간에는 토요일과 공휴일을 넣지 않습니다 (시행규칙 제23조제3항). 실시결과 보고서는 점검이 끝난 날부터 2년간 자체 보관합니다 (같은 조 제4항). · " + FOOT,
         NOTE, 28)


def main():
    from openpyxl import Workbook
    wb = Workbook()
    wb.remove(wb.active)
    sheet_calendar(wb.create_sheet("1 연간 일정"))
    sheet_plan(wb.create_sheet("2 소방계획서 점검"))
    sheet_brigade(wb.create_sheet("3 자위소방대 편성"))
    sheet_drill(wb.create_sheet("4 훈련·교육"))
    sheet_monthly(wb.create_sheet("5 업무수행 기록"))
    sheet_report(wb.create_sheet("6 자체점검 보고"))
    for ws in wb.worksheets:
        ws.page_setup.fitToHeight = 1
    wb.properties.creator = "그린헬멧기사"
    p = OUT / "fire-safety-annual-set.xlsx"
    wb.save(p)
    print("ok", p.name)


if __name__ == "__main__":
    main()
