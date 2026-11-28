# 작업계획서 xlsx 생성기
# 출처: 산업안전보건기준에 관한 규칙 제38조(사전조사 및 작업계획서의 작성 등), 제39조(작업지휘자의 지정),
#       제20조제7호(차량계 하역운반기계등 정의), [별표 4] 사전조사 및 작업계획서 내용 <개정 2025. 9. 1.>
#       (고용노동부령 제450호, 2026. 3. 2. 시행) 국가법령정보센터 2026-11-28 확인
# 별표 4 항목은 원문을 그대로 옮긴다. 법에 없는 칸은 '현장 권장'으로 적는다.
# 실행: python scripts/make_work_plan.py → public/library/work-plan-*.xlsx (그다음 plain_colors.py)
from openpyxl import Workbook
from openpyxl.styles import Alignment

from make_checklists import OUT, HEAD, CENTER, f, setup, cell, boxrange
from make_loto import title, note, section, heads, NOTE, FOOT

RIGHT = Alignment(horizontal="right", vertical="center")
LEADER = {2, 6, 8, 10, 11}  # 제39조제1항: 작업지휘자 지정 대상

WORKS = [
    {"no": "1", "sheet": "1 타워크레인", "name": "타워크레인 설치·조립·해체",
     "law": "타워크레인을 설치ㆍ조립ㆍ해체하는 작업", "gear": "타워크레인 종류·형식",
     "survey": [],
     "plan": ["타워크레인의 종류 및 형식", "설치ㆍ조립 및 해체순서", "작업도구ㆍ장비ㆍ가설설비(假設設備) 및 방호설비",
              "작업인원의 구성 및 작업근로자의 역할 범위", "제142조에 따른 지지 방법"]},
    {"no": "2", "sheet": "2 차량계 하역운반기계", "name": "차량계 하역운반기계등 (지게차 등)",
     "law": "차량계 하역운반기계등을 사용하는 작업 (화물자동차를 사용하는 도로상의 주행작업은 제외)",
     "gear": "장비·관리번호",
     "survey": [],
     "plan": ["해당 작업에 따른 추락ㆍ낙하ㆍ전도ㆍ협착 및 붕괴 등의 위험 예방대책",
              "차량계 하역운반기계등의 운행경로 및 작업방법"]},
    {"no": "3", "sheet": "3 차량계 건설기계", "name": "차량계 건설기계",
     "law": "차량계 건설기계를 사용하는 작업", "gear": "장비·관리번호",
     "survey": ["해당 기계의 굴러 떨어짐, 지반의 붕괴 등으로 인한 근로자의 위험을 방지하기 위한 해당 작업장소의 지형 및 지반상태"],
     "plan": ["사용하는 차량계 건설기계의 종류 및 성능", "차량계 건설기계의 운행경로", "차량계 건설기계에 의한 작업방법"]},
    {"no": "4", "sheet": "4 화학설비", "name": "화학설비와 그 부속설비",
     "law": "화학설비와 그 부속설비를 사용하는 작업", "gear": "설비명·관리번호",
     "survey": [],
     "plan": ["밸브ㆍ콕 등의 조작(해당 화학설비에 원재료를 공급하거나 해당 화학설비에서 제품 등을 꺼내는 경우만 해당한다)",
              "냉각장치ㆍ가열장치ㆍ교반장치(攪拌裝置) 및 압축장치의 조작", "계측장치 및 제어장치의 감시 및 조정",
              "안전밸브, 긴급차단장치, 그 밖의 방호장치 및 자동경보장치의 조정",
              "덮개판ㆍ플랜지(flange)ㆍ밸브ㆍ콕 등의 접합부에서 위험물 등의 누출 여부에 대한 점검", "시료의 채취",
              "화학설비에서는 그 운전이 일시적 또는 부분적으로 중단된 경우의 작업방법 또는 운전 재개 시의 작업방법",
              "이상 상태가 발생한 경우의 응급조치", "위험물 누출 시의 조치", "그 밖에 폭발ㆍ화재를 방지하기 위하여 필요한 조치"]},
    {"no": "5", "sheet": "5 전기작업", "name": "전기작업",
     "law": "제318조에 따른 전기작업 (전압이 50볼트를 넘거나 전기에너지가 250볼트암페어를 넘는 경우로 한정)",
     "gear": "설비·전압",
     "survey": [],
     "plan": ["전기작업의 목적 및 내용", "전기작업 근로자의 자격 및 적정인원",
              "작업 범위, 작업책임자 임명, 전격ㆍ아크 섬광ㆍ아크 폭발 등 전기위험 요인 파악, 접근 한계거리, 활선접근 경보장치 휴대 등 작업시작 전에 필요한 사항",
              "제319조에 따른 전로 차단에 관한 작업계획 및 전원(電源) 재투입 절차 등 작업 상황에 필요한 안전 작업 요령",
              "절연용 보호구 및 방호구, 활선작업용 기구ㆍ장치 등의 준비ㆍ점검ㆍ착용ㆍ사용 등에 관한 사항",
              "점검ㆍ시운전을 위한 일시 운전, 작업 중단 등에 관한 사항", "교대 근무 시 근무 인계(引繼)에 관한 사항",
              "전기작업장소에 대한 관계 근로자가 아닌 사람의 출입금지에 관한 사항",
              "전기안전작업계획서를 해당 근로자에게 교육할 수 있는 방법과 작성된 전기안전작업계획서의 평가ㆍ관리계획",
              "전기 도면, 기기 세부 사항 등 작업과 관련되는 자료"]},
    {"no": "6", "sheet": "6 굴착", "name": "굴착",
     "law": "굴착면의 높이가 2미터 이상이 되는 지반의 굴착작업", "gear": "사용 장비",
     "survey": ["형상ㆍ지질 및 지층의 상태", "균열ㆍ함수(含水)ㆍ용수 및 동결의 유무 또는 상태",
                "매설물 등의 유무 또는 상태", "지반의 지하수위 상태"],
     "plan": ["굴착방법 및 순서, 토사등 반출 방법", "필요한 인원 및 장비 사용계획", "매설물 등에 대한 이설ㆍ보호대책",
              "사업장 내 연락방법 및 신호방법", "흙막이 지보공 설치방법 및 계측계획", "작업지휘자의 배치계획",
              "그 밖에 안전ㆍ보건에 관련된 사항"]},
    {"no": "7", "sheet": "7 터널굴착", "name": "터널굴착",
     "law": "터널굴착작업", "gear": "사용 장비",
     "survey": ["보링(boring) 등 적절한 방법으로 낙반ㆍ출수(出水) 및 가스폭발 등으로 인한 근로자의 위험을 방지하기 위하여 미리 지형ㆍ지질 및 지층상태를 조사"],
     "plan": ["굴착의 방법", "터널지보공 및 복공(覆工)의 시공방법과 용수(湧水)의 처리방법",
              "환기 또는 조명시설을 설치할 때에는 그 방법"]},
    {"no": "8", "sheet": "8 교량", "name": "교량 설치·해체·변경",
     "law": "교량(상부구조가 금속 또는 콘크리트로 구성되는 교량으로서 높이 5미터 이상이거나 최대 지간 길이 30미터 이상인 교량)의 설치ㆍ해체 또는 변경 작업",
     "gear": "사용 장비",
     "survey": [],
     "plan": ["작업 방법 및 순서", "부재(部材)의 낙하ㆍ전도 또는 붕괴를 방지하기 위한 방법",
              "작업에 종사하는 근로자의 추락 위험을 방지하기 위한 안전조치 방법",
              "공사에 사용되는 가설 철구조물 등의 설치ㆍ사용ㆍ해체 시 안전성 검토 방법",
              "사용하는 기계 등의 종류 및 성능, 작업방법", "작업지휘자 배치계획", "그 밖에 안전ㆍ보건에 관련된 사항"]},
    {"no": "9", "sheet": "9 채석", "name": "채석",
     "law": "채석작업", "gear": "사용 장비",
     "survey": ["지반의 붕괴ㆍ굴착기계의 굴러 떨어짐 등에 의한 근로자에게 발생할 위험을 방지하기 위한 해당 작업장의 지형ㆍ지질 및 지층의 상태"],
     "plan": ["노천굴착과 갱내굴착의 구별 및 채석방법", "굴착면의 높이와 기울기",
              "굴착면 소단(小段: 비탈면의 경사를 완화시키기 위해 중간에 좁은 폭으로 설치하는 평탄한 부분)의 위치와 넓이",
              "갱내에서의 낙반 및 붕괴방지 방법", "발파방법", "암석의 분할방법", "암석의 가공장소",
              "사용하는 굴착기계ㆍ분할기계ㆍ적재기계 또는 운반기계(굴착기계등)의 종류 및 성능",
              "토석 또는 암석의 적재 및 운반방법과 운반경로", "표토 또는 용수(湧水)의 처리방법"]},
    {"no": "10", "sheet": "10 해체", "name": "구축물등의 해체",
     "law": "구축물, 건축물, 그 밖의 시설물 등(구축물등)의 해체작업", "gear": "해체 대상·구조",
     "survey": ["해체건물 등의 구조, 주변 상황 등"],
     "plan": ["해체의 방법 및 해체 순서도면", "가설설비ㆍ방호설비ㆍ환기설비 및 살수ㆍ방화설비 등의 방법",
              "사업장 내 연락방법", "해체물의 처분계획", "해체작업용 기계ㆍ기구 등의 작업계획서",
              "해체작업용 화약류 등의 사용계획서", "그 밖에 안전ㆍ보건에 관련된 사항"]},
    {"no": "11", "sheet": "11 중량물 취급", "name": "중량물 취급",
     "law": "중량물의 취급작업", "gear": "품명·무게",
     "survey": [],
     "plan": ["추락위험을 예방할 수 있는 안전대책", "낙하위험을 예방할 수 있는 안전대책", "전도위험을 예방할 수 있는 안전대책",
              "협착위험을 예방할 수 있는 안전대책", "붕괴위험을 예방할 수 있는 안전대책"]},
    {"no": "12·13", "sheet": "12·13 궤도·입환", "name": "궤도 보수·점검, 입환",
     "law": "궤도나 그 밖의 관련 설비의 보수ㆍ점검작업 (제12호), 열차의 교환ㆍ연결 또는 분리 작업(입환작업, 제13호)",
     "gear": "작업 구간·차량",
     "survey": [],
     "plan": ["적절한 작업 인원", "작업량", "작업순서", "작업방법 및 위험요인에 대한 안전조치방법 등"]},
]

KO = "가나다라마바사아자차카타파하"


def label(ws, r, col, text):
    cell(ws, f"{col}{r}", text, f(9, True), HEAD, CENTER)


def blank(ws, rng):
    a = rng.split(":")[0]
    if ":" in rng:
        ws.merge_cells(rng)
    cell(ws, a, None)
    boxrange(ws, rng)


def lines(text, width):
    return max(1, -(-len(text) // width))


def plan_sheet(ws, w):
    """작업계획서 한 장 (A4 세로). 열 A~F."""
    setup(ws)
    for col, width in zip("ABCDEF", [12, 17, 17, 17, 17, 17]):
        ws.column_dimensions[col].width = width
    leader = any(int(n) in LEADER for n in w["no"].split("·"))
    title(ws, "F", f"{w['name']} 작업계획서",
          f"산업안전보건기준에 관한 규칙 제38조제1항제{w['no']}호, [별표 4] 사전조사 및 작업계획서 내용")
    r = 4
    sec = 1
    section(ws, r, "F", f"{sec}. 작업 개요"); r += 1; sec += 1
    label(ws, r, "A", "대상 작업"); ws.merge_cells(f"B{r}:F{r}")
    cell(ws, f"B{r}", w["law"], f(9)); boxrange(ws, f"B{r}:F{r}")
    ws.row_dimensions[r].height = 18 * lines(w["law"], 52) + 6; r += 1
    label(ws, r, "A", "작업 장소"); blank(ws, f"B{r}:C{r}"); label(ws, r, "D", "작업 기간"); blank(ws, f"E{r}:F{r}")
    ws.row_dimensions[r].height = 24; r += 1
    label(ws, r, "A", "작업 내용"); blank(ws, f"B{r}:F{r}"); ws.row_dimensions[r].height = 36; r += 1
    label(ws, r, "A", w["gear"]); blank(ws, f"B{r}:F{r}"); ws.row_dimensions[r].height = 28; r += 1
    label(ws, r, "A", "작업 인원"); blank(ws, f"B{r}:C{r}")
    label(ws, r, "D", "작업지휘자\n(제39조)" if leader else "작업 책임자")
    blank(ws, f"E{r}:F{r}"); ws.row_dimensions[r].height = 30; r += 1
    label(ws, r, "A", "작성일"); blank(ws, f"B{r}:C{r}"); label(ws, r, "D", "작성자"); blank(ws, f"E{r}:F{r}")
    ws.row_dimensions[r].height = 24; r += 2

    if w["survey"]:
        section(ws, r, "F", f"{sec}. 사전조사 (결과를 기록·보존, 제38조제1항)"); r += 1; sec += 1
        heads(ws, r, "ABCDEF", ["번호", "조사 항목 (별표 4)", "", "조사 결과", "", ""])
        ws.merge_cells(f"B{r}:C{r}"); ws.merge_cells(f"D{r}:F{r}"); r += 1
        for i, item in enumerate(w["survey"]):
            cell(ws, f"A{r}", KO[i] + "." if len(w["survey"]) > 1 else "-", align=CENTER)
            ws.merge_cells(f"B{r}:C{r}"); cell(ws, f"B{r}", item, f(9)); boxrange(ws, f"B{r}:C{r}")
            blank(ws, f"D{r}:F{r}")
            ws.row_dimensions[r].height = max(40, 15 * lines(item, 20) + 8); r += 1
        label(ws, r, "A", "조사일"); blank(ws, f"B{r}:C{r}"); label(ws, r, "D", "조사자"); blank(ws, f"E{r}:F{r}")
        ws.row_dimensions[r].height = 24; r += 2

    section(ws, r, "F", f"{sec}. 작업계획 (별표 4에 따라 포함할 사항)"); r += 1; sec += 1
    heads(ws, r, "ABCDEF", ["번호", "포함할 사항 (별표 4 원문)", "", "계획 내용", "", ""])
    ws.merge_cells(f"B{r}:C{r}"); ws.merge_cells(f"D{r}:F{r}"); r += 1
    for i, item in enumerate(w["plan"]):
        cell(ws, f"A{r}", KO[i] + ".", align=CENTER)
        ws.merge_cells(f"B{r}:C{r}"); cell(ws, f"B{r}", item, f(9)); boxrange(ws, f"B{r}:C{r}")
        blank(ws, f"D{r}:F{r}")
        n = len(w["plan"])
        base = 80 if n <= 2 else 56 if n <= 5 else 44 if n <= 7 else 34
        ws.row_dimensions[r].height = max(base, 15 * lines(item, 20) + 8); r += 1
    r += 1

    if w["no"] in ("2", "3"):
        section(ws, r, "F", f"{sec}. 운행경로·작업장 배치도"); r += 1; sec += 1
        blank(ws, f"A{r}:F{r}"); ws.row_dimensions[r].height = 150; r += 2

    section(ws, r, "F", f"{sec}. 근로자에게 알림 (제38조제2항)"); r += 1; sec += 1
    label(ws, r, "A", "알린 날짜"); blank(ws, f"B{r}:C{r}"); label(ws, r, "D", "알린 방법")
    ws.merge_cells(f"E{r}:F{r}"); cell(ws, f"E{r}", "[ ] TBM  [ ] 교육  [ ] 게시", f(9)); boxrange(ws, f"E{r}:F{r}")
    ws.row_dimensions[r].height = 24; r += 1
    heads(ws, r, "ABCDEF", ["번호", "성명", "서명", "번호", "성명", "서명"]); r += 1
    for i in range(1, 6):
        cell(ws, f"A{r}", i, align=CENTER); cell(ws, f"B{r}", None); cell(ws, f"C{r}", None)
        cell(ws, f"D{r}", i + 5, align=CENTER); cell(ws, f"E{r}", None); cell(ws, f"F{r}", None)
        ws.row_dimensions[r].height = 22; r += 1
    r += 1

    roles = ["작성자", "작업지휘자" if leader else "관리감독자", "안전관리자" if leader else "확인자"]
    for col, role in zip("ACE", roles):
        nxt = chr(ord(col) + 1)
        label(ws, r, col, role)
        cell(ws, f"{nxt}{r}", "(서명)", f(9), align=RIGHT)
    ws.row_dimensions[r].height = 30; r += 1
    note(ws, r, "F",
         "작업은 이 계획서에 따라 해야 합니다 (제38조제1항). 작업 방법이 바뀌면 다시 작성하고 근로자에게 다시 알립니다 (현장 권장). · " + FOOT,
         NOTE, 30)


def cover_sheet(ws, works):
    setup(ws)
    for col, w in zip("ABCDE", [10, 40, 11, 12, 22]):
        ws.column_dimensions[col].width = w
    title(ws, "E", "작업계획서 양식 13종",
          "산업안전보건기준에 관한 규칙 제38조제1항, [별표 4] 사전조사 및 작업계획서 내용 (2025. 9. 1. 개정). 시트 이름을 누르면 이동합니다.")
    heads(ws, 4, "ABCDE", ["제38조①", "작업", "사전조사", "작업지휘자", "시트"])
    for i, w in enumerate(works, 5):
        cell(ws, f"A{i}", f"제{w['no']}호", align=CENTER)
        cell(ws, f"B{i}", w["law"], f(9))
        cell(ws, f"C{i}", "기록" if w["survey"] else "-", align=CENTER)
        leader = any(int(n) in LEADER for n in w["no"].split("·"))
        cell(ws, f"D{i}", "지정" if leader else "-", align=CENTER)
        c = cell(ws, f"E{i}", w["sheet"], f(10))
        c.hyperlink = f"#'{w['sheet']}'!A1"
        ws.row_dimensions[i].height = 18 * lines(w["law"], 34) + 6
    r = 5 + len(works) + 1
    note(ws, r, "E",
         "작업지휘자: 제2호·제6호·제8호·제10호·제11호 작업계획서를 작성한 경우 지정합니다 (제39조제1항). "
         "제2호 작업은 다른 근로자가 접근할 수 없거나 한 대만 운전하고 주위에 근로자가 없어 충돌 위험이 없으면 지정하지 않을 수 있습니다. "
         "차량계 하역운반기계등: 지게차ㆍ구내운반차ㆍ화물자동차 등의 차량계 하역운반기계 및 고소작업대 (제20조제7호). · " + FOOT,
         NOTE, 54)


def save(name, works, cover):
    wb = Workbook()
    wb.remove(wb.active)
    if cover:
        cover_sheet(wb.create_sheet("목차"), works)
    for w in works:
        plan_sheet(wb.create_sheet(w["sheet"]), w)
    for ws in wb.worksheets:
        ws.page_setup.fitToHeight = 1
    wb.properties.creator = "그린헬멧기사"
    p = OUT / name
    wb.save(p)
    print("ok", p.name)


def main():
    by = {w["no"]: w for w in WORKS}
    save("work-plan-all.xlsx", WORKS, True)
    save("work-plan-forklift.xlsx", [by["2"]], False)
    save("work-plan-heavy.xlsx", [by["11"]], False)


if __name__ == "__main__":
    main()
