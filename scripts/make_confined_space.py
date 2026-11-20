# 밀폐공간 작업 점검표 xlsx 생성기
# 출처: 산업안전보건기준에 관한 규칙 제3편제10장(제618조~제641조), [별표 2] 제20호
#       국가법령정보센터 현행본 2026-11-19 확인 (제619조의2 2025.12.1. 개정 반영)
# 실행: python scripts/make_confined_space.py → public/library/checklist-confined-space.xlsx
from openpyxl import Workbook
from openpyxl.styles import Alignment
from make_checklists import OUT, HEAD, CENTER, WRAP, f, setup, cell, boxrange

LAW = "산업안전보건기준에 관한 규칙"
NOTE = f(8, color="000000")
RED = f(9, True, "000000")


def title(ws, last, text, sub=None):
    ws.merge_cells(f"A1:{last}1")
    cell(ws, "A1", text, f(16, True), align=CENTER, border=False)
    ws.row_dimensions[1].height = 30
    if sub:
        ws.merge_cells(f"A2:{last}2")
        cell(ws, "A2", sub, f(9, color="000000"), align=CENTER, border=False)
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


def field(ws, r, label, value_from="B", last="F", h=24, value=None, font=None):
    cell(ws, f"A{r}", label, f(10, True), HEAD, CENTER)
    ws.merge_cells(f"{value_from}{r}:{last}{r}")
    cell(ws, f"{value_from}{r}", value, font or f())
    boxrange(ws, f"{value_from}{r}:{last}{r}")
    ws.row_dimensions[r].height = h


def sheet_permit(ws):
    """1. 작업 전 확인서 (제619조제2항 6개 사항 + 출입구 게시)"""
    setup(ws)
    for col, w in zip("ABCDEF", [16, 18, 16, 14, 14, 20]):
        ws.column_dimensions[col].width = w
    title(ws, "F", "밀폐공간 작업 전 확인서",
          "작업이 끝날 때까지 이 확인서를 작업장 출입구에 게시합니다 (규칙 제619조제3항).")
    r = 4
    section(ws, r, "F", "1. 작업 정보 (제619조제2항제1호)"); r += 1
    for lb in ["작업 일시", "작업 기간", "작업 장소", "작업 내용"]:
        field(ws, r, lb); r += 1
    r += 1
    section(ws, r, "F", "2. 작업자 정보 (제2호)"); r += 1
    for lb in ["관리감독자", "작업자", "감시인 (외부 배치)", "측정자 (지정)"]:
        field(ws, r, lb, h=28 if lb == "작업자" else 24); r += 1
    r += 1
    section(ws, r, "F", "3. 산소 및 유해가스 농도 측정결과 및 후속조치 (제3호, 제619조의2)"); r += 1
    for col, h in zip("ABCDEF", ["측정 항목", "적정공기 기준", "작업 전 측정값", "재개 시 측정값", "적정 여부", "후속조치"]):
        cell(ws, f"{col}{r}", h, f(10, True), HEAD, CENTER)
    r += 1
    for item, std in [("산소(O₂)", "18% 이상 23.5% 미만"), ("이산화탄소(CO₂)", "1.5% 미만"), ("일산화탄소(CO)", "30ppm 미만"), ("황화수소(H₂S)", "10ppm 미만"), ("기타 (            )", "")]:
        cell(ws, f"A{r}", item, align=CENTER)
        cell(ws, f"B{r}", std, align=CENTER)
        for col in "CD":
            cell(ws, f"{col}{r}", None, align=CENTER)
        cell(ws, f"E{r}", "[ ]적정 [ ]부적정", f(9), align=CENTER)
        cell(ws, f"F{r}", None)
        ws.row_dimensions[r].height = 24
        r += 1
    note(ws, r, "F", "적정공기 기준: 규칙 제618조제3호. 작업을 일시 중단했다가 다시 시작할 때도 측정합니다(제619조의2제1항). 적정공기가 아니면 환기하거나 공기호흡기·송기마스크를 착용시킵니다(같은 조 제3항).", NOTE, 32); r += 1
    r += 1
    section(ws, r, "F", "4. 불활성가스·유해가스 누출·유입·발생 가능성 검토 및 후속조치 (제4호)"); r += 1
    for lb in ["검토 내용", "후속조치"]:
        field(ws, r, lb, h=36); r += 1
    note(ws, r, "F", "예: 연결 배관의 질소·아르곤 퍼지, 인접 탱크·맨홀에서의 가스 유입, 슬러지·유기물 부패로 인한 황화수소 발생, 용접·도장 작업으로 인한 가스 발생 → 밸브 차단·맹판 설치, 연속 측정 등", NOTE, 30); r += 1
    r += 1
    section(ws, r, "F", "5. 착용해야 할 보호구 (제5호)"); r += 1
    ws.merge_cells(f"A{r}:F{r}")
    cell(ws, f"A{r}", "[ ] 공기호흡기   [ ] 송기마스크   [ ] 안전대   [ ] 구명밧줄   [ ] 안전모   [ ] 보안경   [ ] 화학물질용 보호복·장갑   [ ] 기타(          )")
    boxrange(ws, f"A{r}:F{r}"); ws.row_dimensions[r].height = 34; r += 1
    note(ws, r, "F", "방진마스크·방독마스크는 산소결핍 공기에서 보호 효과가 없습니다. 산소결핍·고농도 유해가스 우려가 있으면 공기호흡기 또는 송기마스크를 씁니다(제620조·제624조).", RED, 30); r += 1
    r += 1
    section(ws, r, "F", "6. 비상연락체계 (제6호)"); r += 1
    for lb, v in [("관할 소방관서", "119 /"), ("사업장 비상연락", None), ("감시인 연락설비", "[ ] 무전기  [ ] 유선  [ ] 기타(          )  — 작업장과 감시인 사이 상시 연락 (제623조제3항)")]:
        field(ws, r, lb, value=v); r += 1
    r += 1
    for lb in ["작성자", "관리감독자 확인"]:
        ws.merge_cells(f"C{r}:D{r}")
        cell(ws, f"C{r}", lb, f(10, True), HEAD, CENTER); boxrange(ws, f"C{r}:D{r}")
        ws.merge_cells(f"E{r}:F{r}")
        cell(ws, f"E{r}", "(서명)", align=Alignment(horizontal="right", vertical="center")); boxrange(ws, f"E{r}:F{r}")
        ws.row_dimensions[r].height = 26; r += 1
    r += 1
    note(ws, r, "F", f"근거: {LAW} 제618조(적정공기), 제619조제2항·제3항, 제619조의2. 법령이 바뀌면 국가법령정보센터 현행본을 확인하세요. · 서식 제공: 그린헬멧기사", NOTE, 30)


CHECK = [
    ("측정", "산소·유해가스 농도 측정·평가에 관한 지식과 실무경험이 있는 사람을 측정자로 지정하고 측정장비를 지급했다", "제619조의2제1항"),
    ("측정", "측정자가 밀폐공간의 위험성, 측정장비 이상 유무 확인·조작 방법, 측정방법, 적정공기 기준·평가 방법을 숙지했는지 확인했다(필요 시 교육)", "제619조의2제2항"),
    ("측정", "작업 시작 전(중단 후 재개 포함)에 산소 및 유해가스 농도를 측정해 적정공기인지 평가했다", "제619조의2제1항"),
    ("측정", "측정자 성명, 측정 일시·장소, 결과를 기록했다 (3년 보존)", "제619조의2제4항"),
    ("환기", "작업 시작 전과 작업 중에 적정공기 상태가 유지되도록 환기한다 (환기가 곤란하면 공기호흡기·송기마스크 착용)", "제620조"),
    ("출입", "밀폐공간에 관계 근로자 외 출입을 금지하고 출입금지 표지(별지 제4호서식)를 보기 쉬운 곳에 게시했다", "제622조"),
    ("출입", "입장시킬 때와 퇴장시킬 때마다 인원을 점검한다", "제621조"),
    ("감시", "작업상황을 감시할 감시인을 지정해 밀폐공간 외부에 배치했다", "제623조제1항"),
    ("감시", "감시인은 이상 시 지체 없이 관할 소방관서에 신고하고 사업주·관리감독자에게 알린다는 것을 알고 있다", "제623조제2항"),
    ("감시", "작업장과 외부 감시인 사이에 항상 연락할 수 있는 설비를 설치했다", "제623조제3항"),
    ("보호구", "추락 우려가 있으면 안전대나 구명밧줄, 공기호흡기 또는 송기마스크를 지급해 착용시켰다", "제624조제1항"),
    ("보호구", "안전대·구명밧줄을 안전하게 걸 수 있는 설비를 설치했다", "제624조제2항"),
    ("대피", "공기호흡기 또는 송기마스크, 사다리, 섬유로프 등 피난·구출 기구를 갖춰 두었다", "제625조"),
    ("주지", "작업근로자와 감시인에게 ① 밀폐공간의 위험성 ② 농도 측정 ③ 환기설비 가동 등 안전한 작업방법 ④ 보호구 착용·사용방법 ⑤ 관할 소방관서 등 비상연락처와 응급조치 ⑥ 대피용 기구의 위치·사용방법을 알리고 숙지 여부를 확인했다", "제641조"),
    ("관리감독자", "관리감독자가 작업 시작 전에 작업을 지휘하고, 공기 상태를 측정하고, 측정장비·환기장치·공기호흡기·송기마스크를 점검했다", "별표 2 제20호 가~다목"),
    ("관리감독자", "관리감독자가 공기호흡기·송기마스크 착용을 지도하고 착용 상황을 점검한다", "별표 2 제20호 라목"),
    ("게시", "작업 전 확인서(작업 정보, 작업자, 측정결과, 가스 유입 검토, 보호구, 비상연락체계)를 작업 종료까지 출입구에 게시했다", "제619조제3항"),
    ("대피", "질식·화재·폭발 우려가 있으면 즉시 작업을 중단하고 대피시키며, 적정공기 확인 전까지 출입을 금지한다", "제639조"),
]


def sheet_check(ws):
    setup(ws)
    for col, w in zip("ABCDEF", [6, 11, 52, 16, 6, 6]):
        ws.column_dimensions[col].width = w
    title(ws, "F", "밀폐공간 작업 전 안전조치 점검표", "작업 시작 전에 관리감독자가 하나씩 확인합니다. '아니오'가 하나라도 있으면 조치한 뒤에 들어갑니다.")
    r = 4
    for lb in ["점검 일시", "밀폐공간 위치"]:
        cell(ws, f"A{r}", None, border=False)
        ws.merge_cells(f"A{r}:B{r}")
        cell(ws, f"A{r}", lb, f(10, True), HEAD, CENTER); boxrange(ws, f"A{r}:B{r}")
        ws.merge_cells(f"C{r}:F{r}"); boxrange(ws, f"C{r}:F{r}")
        ws.row_dimensions[r].height = 24; r += 1
    r += 1
    for col, h in zip("ABCDEF", ["번호", "구분", "확인 사항", "근거 (안전보건규칙)", "예", "아니오"]):
        cell(ws, f"{col}{r}", h, f(10, True), HEAD, CENTER)
    ws.row_dimensions[r].height = 22; r += 1
    for i, (g, item, basis) in enumerate(CHECK, 1):
        cell(ws, f"A{r}", i, align=CENTER)
        cell(ws, f"B{r}", g, align=CENTER)
        cell(ws, f"C{r}", item)
        cell(ws, f"D{r}", basis, f(9), align=CENTER)
        for col in "EF":
            cell(ws, f"{col}{r}", None, align=CENTER)
        ws.row_dimensions[r].height = max(26, 15 * (len(item) // 34 + 1) + 6)
        r += 1
    r += 1
    note(ws, r, "F", "구조하러 맨몸으로 들어가지 마세요. 밀폐공간 질식사고에서는 구조하러 들어간 사람이 함께 쓰러지는 경우가 많습니다. 공기호흡기·송기마스크를 착용하고, 감시인은 먼저 119에 신고합니다.", RED, 36); r += 2
    for lb in ["점검자", "관리감독자 확인"]:
        ws.merge_cells(f"C{r}:C{r}")
        cell(ws, f"C{r}", lb, f(10, True), HEAD, Alignment(horizontal="right", vertical="center"))
        ws.merge_cells(f"D{r}:F{r}")
        cell(ws, f"D{r}", "(서명)", align=Alignment(horizontal="right", vertical="center")); boxrange(ws, f"D{r}:F{r}")
        ws.row_dimensions[r].height = 26; r += 1
    r += 1
    note(ws, r, "F", f"근거: {LAW} 제619조의2부터 제641조까지, [별표 2] 제20호. 확인 사항은 조문 내용을 요약해 옮겼습니다. 정확한 문구는 국가법령정보센터 현행본을 확인하세요. · 서식 제공: 그린헬멧기사", NOTE, 30)


def sheet_measure(ws):
    setup(ws, landscape=True)
    heads = ["측정 일시", "측정 장소·위치", "산소 %", "CO₂ %", "CO ppm", "H₂S ppm", "기타", "적정 여부", "조치 내용", "측정자 성명", "서명"]
    widths = [16, 22, 8, 8, 8, 8, 10, 10, 24, 12, 10]
    last = chr(ord("A") + len(heads) - 1)
    title(ws, last, "밀폐공간 산소·유해가스 농도 측정 기록부",
          "측정·평가한 사람의 성명, 일시·장소, 결과를 기록해 3년간 보존합니다 (규칙 제619조의2제4항). 작업 시작 전과 작업 재개 전마다 측정합니다.")
    for i, (h, w) in enumerate(zip(heads, widths)):
        col = chr(ord("A") + i)
        ws.column_dimensions[col].width = w
        cell(ws, f"{col}4", h, f(10, True), HEAD, CENTER)
    stds = ["", "상·중·하 위치 구분", "18~23.5 미만", "1.5 미만", "30 미만", "10 미만", "", "", "", "", ""]
    for i, s in enumerate(stds):
        cell(ws, f"{chr(ord('A') + i)}5", s or None, f(8, color="000000"), align=CENTER)
    for r in range(6, 26):
        for i in range(len(heads)):
            cell(ws, f"{chr(ord('A') + i)}{r}", None, align=CENTER)
        ws.row_dimensions[r].height = 22
    note(ws, 27, last, "기준: 규칙 제618조제3호 적정공기. 공간이 깊거나 넓으면 위·가운데·아래와 여러 지점을 측정합니다. 영상 기록(고정형·이동형 영상정보처리기기)으로 남기는 것도 기록으로 인정됩니다(제619조의2제4항). · 서식 제공: 그린헬멧기사")


def sheet_people(ws):
    setup(ws)
    heads = ["번호", "성명", "소속", "입장 시각", "퇴장 시각", "확인자"]
    widths = [6, 16, 18, 14, 14, 16]
    title(ws, "F", "밀폐공간 출입 인원 점검표", "근로자를 입장시킬 때와 퇴장시킬 때마다 인원을 점검합니다 (규칙 제621조). 작업이 끝나면 입장 인원과 퇴장 인원이 같은지 확인합니다.")
    r = 4
    for lb in ["작업 일자", "밀폐공간 위치", "감시인"]:
        cell(ws, f"A{r}", None, border=False)
        ws.merge_cells(f"A{r}:B{r}")
        cell(ws, f"A{r}", lb, f(10, True), HEAD, CENTER); boxrange(ws, f"A{r}:B{r}")
        ws.merge_cells(f"C{r}:F{r}"); boxrange(ws, f"C{r}:F{r}")
        ws.row_dimensions[r].height = 24; r += 1
    r += 1
    for i, (h, w) in enumerate(zip(heads, widths)):
        col = chr(ord("A") + i)
        ws.column_dimensions[col].width = w
        cell(ws, f"{col}{r}", h, f(10, True), HEAD, CENTER)
    r += 1
    for n in range(1, 21):
        cell(ws, f"A{r}", n, align=CENTER)
        for col in "BCDEF":
            cell(ws, f"{col}{r}", None, align=CENTER)
        ws.row_dimensions[r].height = 24; r += 1
    r += 1
    ws.merge_cells(f"A{r}:C{r}")
    cell(ws, f"A{r}", "입장 인원 합계:          명", f(10, True)); boxrange(ws, f"A{r}:C{r}")
    ws.merge_cells(f"D{r}:F{r}")
    cell(ws, f"D{r}", "퇴장 인원 합계:          명", f(10, True)); boxrange(ws, f"D{r}:F{r}")
    ws.row_dimensions[r].height = 26


def sheet_drill(ws):
    setup(ws)
    for col, w in zip("ABCDEF", [16, 18, 16, 14, 14, 20]):
        ws.column_dimensions[col].width = w
    title(ws, "F", "밀폐공간 긴급 구조훈련 기록", "밀폐공간 작업 근로자에게 6개월에 1회 이상 훈련하고 결과를 기록해 보존합니다 (규칙 제640조).")
    r = 4
    for lb in ["훈련 일시", "훈련 장소", "강사·주관"]:
        field(ws, r, lb); r += 1
    section(ws, r, "F", "훈련 내용 (제640조에 정한 항목)"); r += 1
    for item in ["비상연락체계 운영", "구조용 장비의 사용", "공기호흡기 또는 송기마스크의 착용", "응급처치"]:
        cell(ws, f"A{r}", "[ ] 실시", align=CENTER)
        ws.merge_cells(f"B{r}:F{r}")
        cell(ws, f"B{r}", item); boxrange(ws, f"B{r}:F{r}")
        ws.row_dimensions[r].height = 24; r += 1
    field(ws, r, "훈련 결과·개선점", h=60); r += 2
    section(ws, r, "F", "참석자"); r += 1
    for col, h in zip("ABCDEF", ["성명", "서명", "성명", "서명", "성명", "서명"]):
        cell(ws, f"{col}{r}", h, f(10, True), HEAD, CENTER)
    r += 1
    for _ in range(8):
        for col in "ABCDEF":
            cell(ws, f"{col}{r}", None, align=CENTER)
        ws.row_dimensions[r].height = 24; r += 1
    r += 1
    note(ws, r, "F", "다음 훈련 예정일(6개월 이내):                         · 서식 제공: 그린헬멧기사", f(9, True))


def sheet_vent(ws):
    setup(ws, landscape=True)
    heads = ["점검 일자", "밀폐공간 위치", "환기장치 작동·사용 상태", "적정공기 유지 상태(측정값)", "이상 내용", "조치 사항", "점검자"]
    widths = [12, 20, 22, 26, 20, 22, 12]
    last = "G"
    title(ws, last, "상시 환기장치 월간 점검표 (특례 적용 밀폐공간)",
          "24시간 상시 가동하는 급·배기 환기장치를 설치한 밀폐공간은 월 1회 이상 점검하고, 점검 결과를 출입구에 상시 게시합니다 (규칙 제626조제2항·제3항).")
    for i, (h, w) in enumerate(zip(heads, widths)):
        col = chr(ord("A") + i)
        ws.column_dimensions[col].width = w
        cell(ws, f"{col}4", h, f(10, True), HEAD, CENTER)
    for r in range(5, 17):
        for i in range(len(heads)):
            cell(ws, f"{chr(ord('A') + i)}{r}", None, align=CENTER)
        ws.row_dimensions[r].height = 28
    note(ws, 18, last, "별표 18 제10호·제11호 밀폐공간에는 이 특례가 적용되지 않습니다(제626조제1항). 특례 대상이 아니면 이 시트는 지워도 됩니다. · 서식 제공: 그린헬멧기사")


def main():
    wb = Workbook()
    wb.remove(wb.active)
    sheet_permit(wb.create_sheet("1 작업 전 확인서"))
    sheet_check(wb.create_sheet("2 안전조치 점검표"))
    sheet_measure(wb.create_sheet("3 가스 측정 기록부"))
    sheet_people(wb.create_sheet("4 출입 인원 점검"))
    sheet_drill(wb.create_sheet("5 긴급 구조훈련"))
    sheet_vent(wb.create_sheet("6 상시환기장치 월간점검"))
    for ws in wb.worksheets:
        ws.page_setup.fitToHeight = 1  # 시트마다 A4 한 장
    wb.properties.creator = "그린헬멧기사"
    p = OUT / "checklist-confined-space.xlsx"
    wb.save(p)
    print("ok", p.name)


if __name__ == "__main__":
    main()
