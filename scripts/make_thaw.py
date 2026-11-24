# 해빙기 안전점검표 xlsx 생성기
# 출처 (국가법령정보센터 2026-11-25 확인): 산업안전보건기준에 관한 규칙 (고용노동부령 제450호, 2026. 3. 2. 시행)
#   제37조, 제50조, 제52조, 제58조, 제334조, 제338조~제340조, 제347조
# 법 조문에 없는 항목은 '현장 권장'으로 따로 적는다.
# 실행: python scripts/make_thaw.py → public/library/checklist-thaw.xlsx (그다음 plain_colors.py)
from make_checklists import OUT, HEAD, CENTER, WRAP, f, setup, cell, boxrange
from make_loto import title, note, section, heads, NOTE, FOOT
from make_risk_set import widths, label, blank

R = "기준규칙"
REC = "현장 권장"


def header(ws, last="G"):
    r = 4
    label(ws, r, "A", "현장"); blank(ws, f"B{r}:C{r}"); label(ws, r, "D", "점검일"); blank(ws, f"E{r}:{last}{r}")
    ws.row_dimensions[r].height = 24; r += 1
    label(ws, r, "A", "점검자"); blank(ws, f"B{r}:C{r}"); label(ws, r, "D", "날씨"); blank(ws, f"E{r}:{last}{r}")
    ws.row_dimensions[r].height = 24
    return r + 2


def items(ws, r, head, rows):
    section(ws, r, "G", head); r += 1
    heads(ws, r, "ABCDEFG", ["번호", "점검 항목", "근거\n(기준규칙)", "양호", "불량", "해당\n없음", "조치 내용"]); ws.row_dimensions[r].height = 28; r += 1
    for i, (text, basis) in enumerate(rows, 1):
        cell(ws, f"A{r}", i, align=CENTER)
        cell(ws, f"B{r}", text, f(9))
        cell(ws, f"C{r}", basis, f(8), align=CENTER)
        for col in "DEF":
            cell(ws, f"{col}{r}", "[ ]", align=CENTER)
        cell(ws, f"G{r}", None)
        ws.row_dimensions[r].height = 30; r += 1
    return r + 1


def sheet_dig(ws):
    setup(ws)
    widths(ws, "ABCDEFG", [7, 46, 13, 6, 6, 6, 20])
    title(ws, "G", "해빙기 굴착·흙막이 점검표",
          "얼었던 지반이 녹으면 굴착면과 흙막이가 무너지기 쉽습니다. 굴착작업 전에 점검하고 이상은 즉시 보수합니다 (산업안전보건기준에 관한 규칙 제338조·제347조).")
    r = header(ws)
    r = items(ws, r, "1. 굴착작업 전 점검 (제338조)", [
        ("작업장소와 그 주변에 부석·균열이 없다", f"제338조제1호"),
        ("함수·용수 및 동결의 유무와 상태 변화를 확인했다 (녹은 물, 솟는 물, 언 부분)", f"제338조제2호"),
        ("굴착면 기울기가 별표 11 기준 또는 설계도서에 맞다", f"제339조제1항"),
        ("빗물·눈 녹은 물이 스며들지 않게 측구 설치, 비닐 덮기 등을 했다", f"제339조제2항"),
        ("붕괴·낙하 원인이 되는 빗물이나 지하수를 배제한다", f"제50조제2호"),
        ("위험 우려 구간에 흙막이 지보공·방호망 설치, 출입 금지 조치를 했다", f"제340조"),
    ])
    r = items(ws, r, "2. 흙막이 지보공 정기 점검 (제347조제1항)", [
        ("부재의 손상·변형·부식·변위 및 탈락이 없다", f"제347조제1항제1호"),
        ("버팀대의 긴압(조임) 정도가 적정하다", f"제347조제1항제2호"),
        ("부재의 접속부·부착부·교차부 상태가 양호하다", f"제347조제1항제3호"),
        ("침하가 없다", f"제347조제1항제4호"),
        ("설계도서에 따른 계측을 했고 토압 증가 등 이상이 없다 (이상 시 즉시 보강)", f"제347조제2항"),
        ("주변 도로·지반의 함몰, 배면 균열이 없다", REC),
    ])
    note(ws, r - 1, "G", "불량 항목은 즉시 보수하고 3번 시트(조치 대장)에 남깁니다. 해빙기는 지역과 해마다 다르므로 낮 기온이 영상으로 오르기 시작하면 점검 주기를 앞당깁니다 (현장 권장). · " + FOOT, NOTE, 30)


def sheet_struct(ws):
    setup(ws)
    widths(ws, "ABCDEFG", [7, 46, 13, 6, 6, 6, 20])
    title(ws, "G", "해빙기 구축물·비계·동바리 점검표",
          "동해(凍害)와 부동침하로 생긴 균열·기울어짐, 비계와 동바리 기둥의 침하를 확인합니다 (산업안전보건기준에 관한 규칙 제52조·제58조·제334조).")
    r = header(ws)
    r = items(ws, r, "1. 구축물·옹벽·축대", [
        ("동해·부동침하로 균열·비틀림이 생기지 않았다 (생겼으면 구조검토·안전진단 등 안전성 평가)", f"제52조제2호"),
        ("인근 굴착·항타로 침하·균열이 생기지 않았다", f"제52조제1호"),
        ("지반은 안전한 경사이고, 낙하 위험 토석을 제거했거나 옹벽 등을 설치했다", f"제50조제1호"),
        ("옹벽·축대의 배수구멍이 막히지 않았고 배부름·기울어짐이 없다", REC),
        ("오랫동안 쓰지 않던 구축물을 다시 쓰기 전에 안전성을 검토했다", f"제52조제5호"),
    ])
    r = items(ws, r, "2. 비계 (눈·비 등으로 작업을 멈춘 뒤 작업 시작 전, 제58조)", [
        ("발판 재료의 손상 여부와 부착·걸림 상태", f"제58조제1호"),
        ("비계 연결부·접속부의 풀림 상태", f"제58조제2호"),
        ("연결 재료와 연결 철물의 손상·부식 상태", f"제58조제3호"),
        ("손잡이의 탈락 여부", f"제58조제4호"),
        ("기둥의 침하·변형·변위·흔들림 상태 (언 땅이 녹아 받침이 꺼지지 않았는지)", f"제58조제5호"),
        ("로프의 부착 상태와 매단 장치의 흔들림 상태", f"제58조제6호"),
    ])
    r = items(ws, r, "3. 거푸집·동바리 (콘크리트 타설 당일 작업 전, 제334조)", [
        ("거푸집·동바리의 변형·변위와 지반의 침하가 없다", f"제334조제1호"),
        ("타설 중 감시자를 배치해 변형·변위·침하를 확인한다", f"제334조제2호"),
        ("설계도서상의 콘크리트 양생기간을 지켜 해체한다", f"제334조제4호"),
    ])
    note(ws, r - 1, "G", "비·눈·바람 등 기상상태가 불안정해 근로자가 위험해질 우려가 있으면 작업을 중지합니다 (제37조제1항). · " + FOOT, NOTE, 24)


def sheet_log(ws):
    setup(ws, landscape=True)
    names = ["번호", "점검일", "위치", "이상 내용", "사진 번호", "조치 내용", "담당", "완료일", "재점검"]
    cols = list("ABCDEFGHI")
    widths(ws, cols, [5, 11, 22, 36, 9, 36, 10, 11, 11])
    title(ws, "I", "해빙기 점검 이상 발견·조치 대장",
          "점검에서 찾은 이상과 보수·보강 결과를 기록합니다 (산업안전보건기준에 관한 규칙 제347조: 이상을 발견하면 즉시 보수).")
    r = 4
    for col, h in zip(cols, names):
        cell(ws, f"{col}{r}", h, f(9, True), HEAD, CENTER)
    ws.row_dimensions[r].height = 26; r += 1
    for i in range(1, 15):
        cell(ws, f"A{r}", i, align=CENTER)
        for col in cols[1:]:
            cell(ws, f"{col}{r}", None, f(9), align=WRAP if col in "CDF" else CENTER)
        cell(ws, f"I{r}", "[ ]", align=CENTER)
        ws.row_dimensions[r].height = 30; r += 1
    note(ws, r, "I", "사진은 이상 부위와 보수 후를 같은 각도로 찍어 번호를 맞춰 두면 확인이 쉽습니다 (현장 권장). ·" + FOOT, NOTE, 26)


def main():
    from openpyxl import Workbook
    wb = Workbook()
    wb.remove(wb.active)
    sheet_dig(wb.create_sheet("1 굴착·흙막이"))
    sheet_struct(wb.create_sheet("2 구축물·비계·동바리"))
    sheet_log(wb.create_sheet("3 조치 대장"))
    for ws in wb.worksheets:
        ws.page_setup.fitToHeight = 1
    wb.properties.creator = "그린헬멧기사"
    p = OUT / "checklist-thaw.xlsx"
    wb.save(p)
    print("ok", p.name)


if __name__ == "__main__":
    main()
