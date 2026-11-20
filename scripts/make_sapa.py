# 중대재해처벌법 반기 점검 세트 xlsx 생성기
# 근거는 국가법령정보센터 현행본을 2026-11-20에 확인했다.
#  - 중대재해 처벌 등에 관한 법률 (법률 제17907호, 2022.1.27. 시행) 제2조·제3조·제4조·제5조
#  - 같은 법 시행령 (대통령령 제35805호, 2025.10.1. 시행) 제4조·제5조·제13조
#  - 산업안전보건법 (2026.10.27. 시행) 제15조·제54조·제62조 등, 같은 법 시행령 제15조·제53조
# 실행: python scripts/make_sapa.py → public/library/sapa-half-year-set.xlsx
#       그다음 python scripts/plain_colors.py
from openpyxl import Workbook
from openpyxl.styles import Alignment
from make_checklists import HEAD, CENTER, WRAP, f, setup, cell, boxrange
from make_confined_space import title, note, section, NOTE
from make_env_forms import MADE, col, header, blank_rows, sign, save

SRC = "중대재해처벌법 시행령 2025.10.1. 시행본 기준"
TOP = Alignment(wrap_text=True, vertical="top")
CHK = "[ ]이행  [ ]미흡  [ ]해당없음"


def info(ws, r, label, last="F", h=24, value=None, font=None):
    """칸 이름(A:B 합침) + 내용(C:끝). A열은 번호 칸이라 좁다"""
    ws.merge_cells(f"A{r}:B{r}")
    cell(ws, f"A{r}", label, f(10, True), HEAD, CENTER)
    boxrange(ws, f"A{r}:B{r}")
    ws.merge_cells(f"C{r}:{last}{r}")
    cell(ws, f"C{r}", value, font or f())
    boxrange(ws, f"C{r}:{last}{r}")
    ws.row_dimensions[r].height = h


# ───────────── 1. 반기 이행 점검표 (법 제4조, 영 제4조·제5조·제13조) ─────────────
DUTIES = [
    # (조문, 의무, 반기 점검 대상, 확인할 서류 예)
    ("영 제4조제1호", "사업 또는 사업장의 안전·보건에 관한 목표와 경영방침 설정", "", "경영방침 문서, 연간 목표"),
    ("영 제4조제2호", "안전·보건 업무를 총괄·관리하는 전담 조직 (산업안전보건법 제17조~제19조·제22조 인력이 총 3명 이상이고, 상시근로자 500명 이상이거나 토목건축공사업 시공능력 상위 200위 이내 건설사업자인 경우)", "", "조직도, 업무분장표"),
    ("영 제4조제3호", "유해·위험요인을 확인·개선하는 업무절차 마련, 그 절차대로 확인·개선되는지 점검 후 필요한 조치 (위험성평가 절차를 마련하고 실시 결과를 보고받으면 점검한 것으로 봄)", "반기 1회 이상", "위험성평가 절차, 실시 결과 보고"),
    ("영 제4조제4호", "예산 편성과 용도에 맞는 집행: 가. 안전·보건 인력·시설·장비 구비  나. 유해·위험요인 개선  다. 그 밖에 고용노동부장관 고시 사항", "", "예산 편성·집행 대장"),
    ("영 제4조제5호가목", "안전보건관리책임자·관리감독자·안전보건총괄책임자에게 업무 수행에 필요한 권한과 예산 부여", "", "위임전결 규정, 예산 배정"),
    ("영 제4조제5호나목", "위 책임자들이 업무를 충실히 수행하는지 평가하는 기준 마련, 그 기준에 따라 평가·관리", "반기 1회 이상", "책임자등 평가표"),
    ("영 제4조제6호", "안전관리자·보건관리자·안전보건관리담당자·산업보건의를 정해진 수 이상 배치 (겸직 시 고시 기준에 따라 업무 수행시간 보장)", "", "선임 서류, 위탁계약서"),
    ("영 제4조제7호", "종사자 의견을 듣는 절차 마련, 의견을 듣고 개선방안을 마련·이행하는지 점검 후 필요한 조치 (산업안전보건위원회·협의체에서 논의·심의·의결하면 의견을 들은 것으로 봄)", "반기 1회 이상", "회의록, 의견·조치 기록"),
    ("영 제4조제8호", "중대산업재해 발생이나 급박한 위험에 대비한 매뉴얼 마련: 가. 작업 중지·근로자 대피·위험요인 제거  나. 구호조치  다. 추가 피해방지. 매뉴얼대로 조치하는지 점검", "반기 1회 이상", "매뉴얼, 훈련 기록"),
    ("영 제4조제9호", "도급·용역·위탁 시 기준과 절차 마련: 가. 수급인의 재해예방 조치 능력·기술 평가기준·절차  나. 안전·보건 관리비용 기준  다. 건설업·조선업은 공사기간·건조기간 기준. 그대로 이루어지는지 점검", "반기 1회 이상", "수급인 평가표, 계약서"),
    ("영 제5조제2항제1호", "안전·보건 관계 법령에 따른 의무 이행 여부 점검 (지정기관 위탁 점검 포함). 직접 점검하지 않으면 끝난 뒤 지체 없이 결과 보고받기", "반기 1회 이상", "관계 법령 점검표"),
    ("영 제5조제2항제2호", "점검 결과 이행되지 않은 의무가 있으면 인력 배치·예산 추가 편성·집행 등 필요한 조치", "", "조치 기록"),
    ("영 제5조제2항제3호", "유해·위험한 작업에 관한 법정 안전·보건교육이 실시되었는지 점검. 직접 점검하지 않으면 결과 보고받기", "반기 1회 이상", "교육 실시 기록"),
    ("영 제5조제2항제4호", "실시되지 않은 교육은 지체 없이 이행 지시·예산 확보 등 필요한 조치", "", "지시 기록"),
    ("법 제4조제1항제2호", "재해 발생 시 재발방지 대책의 수립 및 그 이행", "", "재발방지 대책서"),
    ("법 제4조제1항제3호", "중앙행정기관·지방자치단체가 관계 법령에 따라 개선·시정 등을 명한 사항의 이행", "", "명령서, 이행 결과"),
    ("영 제13조", "위 조치의 이행 사항을 서면(전자문서 포함)으로 작성해 이행한 날부터 5년간 보관 (소상공인 제외)", "", "문서 보관 목록"),
]


def check_sheet(ws):
    setup(ws, landscape=True)
    heads = ["번호", "조문", "의무", "점검 주기", "확인할 서류 (예)", "이행 여부", "미흡할 때 조치", "담당"]
    widths = [5, 14, 52, 11, 17, 13, 22, 9]
    last = col(len(heads) - 1)
    title(ws, last, "중대재해처벌법 반기 이행 점검표",
          "중대재해 처벌 등에 관한 법률 제4조, 같은 법 시행령 제4조·제5조·제13조")
    r = 4
    for lb in ["사업장", "점검 대상 기간"]:
        cell(ws, f"A{r}", lb, f(10, True), HEAD, CENTER)
        ws.merge_cells(f"A{r}:B{r}")
        boxrange(ws, f"A{r}:B{r}")
        ws.merge_cells(f"C{r}:{last}{r}")
        cell(ws, f"C{r}", "         년   [ ]상반기 (1~6월)   [ ]하반기 (7~12월)" if "기간" in lb else None)
        boxrange(ws, f"C{r}:{last}{r}")
        ws.row_dimensions[r].height = 24
        r += 1
    r += 1
    header(ws, r, heads, widths, h=26)
    r += 1
    for i, (law, duty, cyc, docs) in enumerate(DUTIES, 1):
        cell(ws, f"A{r}", i, align=CENTER)
        cell(ws, f"B{r}", law, f(9), align=CENTER)
        cell(ws, f"C{r}", duty, f(9))
        cell(ws, f"D{r}", cyc or "-", f(9), align=CENTER)
        cell(ws, f"E{r}", docs, f(9))
        cell(ws, f"F{r}", CHK.replace("  ", "\n"), f(8), align=CENTER)
        cell(ws, f"G{r}", None)
        cell(ws, f"H{r}", None)
        ws.row_dimensions[r].height = max(40, 13 * (len(duty) // 34 + 1) + 8)
        r += 1
    r += 1
    r = sign(ws, r, ["점검자", "안전보건 담당 부서장", "경영책임자 확인"], "E", "E", "F", "H")
    note(ws, r + 1, last, f"{SRC} · {MADE}", NOTE, 20)


# ───────────── 2. 안전보건 목표·경영방침 (영 제4조제1호) ─────────────
def policy_sheet(ws):
    setup(ws)
    heads = ["번호", "목표", "측정 지표", "목표값", "담당", "기한", "상반기 실적", "하반기 실적"]
    widths = [5, 26, 18, 10, 10, 10, 12, 12]
    last = col(len(heads) - 1)
    title(ws, last, "안전·보건 경영방침과 목표", "중대재해처벌법 시행령 제4조제1호")
    r = 4
    info(ws, r, "연도", last=last); r += 1
    info(ws, r, "사업장", last=last); r += 2
    section(ws, r, last, "경영방침"); r += 1
    ws.merge_cells(f"A{r}:{last}{r}")
    cell(ws, f"A{r}", None, align=TOP)
    boxrange(ws, f"A{r}:{last}{r}")
    ws.row_dimensions[r].height = 150
    r += 2
    section(ws, r, last, "연간 목표"); r += 1
    header(ws, r, heads, widths, h=26); r += 1
    r = blank_rows(ws, r, 10, len(heads), h=30)
    r += 1
    info(ws, r, "게시·공유 방법", last=last, h=30); r += 2
    r = sign(ws, r, ["경영책임자"], "F", "F", "G", "H")
    note(ws, r + 1, last, f"{SRC} · {MADE}", NOTE, 20)


# ───────────── 3. 안전보건 예산 편성·집행 대장 (영 제4조제4호) ─────────────
def budget_sheet(ws):
    setup(ws, landscape=True)
    heads = ["번호", "구분", "항목", "편성액 (원)", "상반기 집행", "하반기 집행", "집행 합계", "집행률", "비고"]
    widths = [5, 22, 34, 14, 14, 14, 14, 9, 18]
    last = col(len(heads) - 1)
    title(ws, last, "안전·보건 예산 편성·집행 대장", "중대재해처벌법 시행령 제4조제4호")
    r = 4
    info(ws, r, "연도", last=last); r += 1
    info(ws, r, "구분", last=last, h=30,
          value="가. 안전·보건 인력, 시설·장비 구비   나. 유해·위험요인 개선 (위험성평가 결과 등)   다. 그 밖에 고용노동부장관 고시 사항"); r += 2
    header(ws, r, heads, widths, h=26); r += 1
    first = r
    for k in range(18):
        cell(ws, f"A{r}", k + 1, align=CENTER)
        cell(ws, f"B{r}", "[ ]가  [ ]나  [ ]다", f(9), align=CENTER)
        for c in "CDEF":
            cell(ws, f"{c}{r}", None, align=CENTER if c == "C" else WRAP)
        cell(ws, f"G{r}", f'=IF(COUNT(E{r}:F{r})=0,"",SUM(E{r}:F{r}))')
        cell(ws, f"H{r}", f'=IF(OR(D{r}="",D{r}=0,G{r}=""),"",G{r}/D{r})', align=CENTER)
        ws[f"H{r}"].number_format = "0%"
        cell(ws, f"I{r}", None)
        for c in "DEFG":
            ws[f"{c}{r}"].number_format = '#,##0;-#,##0;""'
        ws.row_dimensions[r].height = 24
        r += 1
    cell(ws, f"A{r}", "합계", f(10, True), HEAD, CENTER)
    ws.merge_cells(f"A{r}:C{r}")
    boxrange(ws, f"A{r}:C{r}")
    for c in "DEFG":
        cell(ws, f"{c}{r}", f"=SUM({c}{first}:{c}{r - 1})", f(10, True))
        ws[f"{c}{r}"].number_format = '#,##0;-#,##0;""'
    cell(ws, f"H{r}", f'=IF(D{r}=0,"",G{r}/D{r})', f(10, True), align=CENTER)
    ws[f"H{r}"].number_format = "0%"
    cell(ws, f"I{r}", None)
    ws.row_dimensions[r].height = 26
    r += 2
    r = sign(ws, r, ["작성자", "경영책임자 확인"], "F", "G", "H", "I")
    note(ws, r + 1, last, f"편성한 용도에 맞게 집행했는지가 의무입니다(같은 호 본문). 용도를 바꿔 쓰면 비고에 적습니다. · {SRC} · {MADE}", NOTE, 20)


# ───────────── 4. 안전보건관리책임자등 업무 평가표 (영 제4조제5호나목) ─────────────
ROLES = [
    ("안전보건관리책임자 (산업안전보건법 제15조제1항)", [
        "사업장의 산업재해 예방계획의 수립",
        "안전보건관리규정의 작성 및 변경 (법 제25조·제26조)",
        "안전보건교육 (법 제29조)",
        "작업환경측정 등 작업환경의 점검 및 개선",
        "근로자의 건강진단 등 건강관리 (법 제129조~제132조)",
        "산업재해의 원인 조사 및 재발 방지대책 수립",
        "산업재해에 관한 통계의 기록 및 유지",
        "안전장치 및 보호구 구입 시 적격품 여부 확인",
        "그 밖에 고용노동부령으로 정하는 유해·위험 방지조치",
    ]),
    ("관리감독자 (산업안전보건법 시행령 제15조제1항)", [
        "해당작업 관련 기계·기구·설비의 안전·보건 점검 및 이상 유무 확인",
        "소속 근로자의 작업복·보호구·방호장치 점검, 착용·사용 교육·지도",
        "해당작업에서 발생한 산업재해 보고 및 응급조치",
        "해당작업의 작업장 정리·정돈 및 통로 확보 확인·감독",
        "안전관리자·보건관리자·안전보건관리담당자·산업보건의의 지도·조언에 대한 협조",
        "위험성평가: 유해·위험요인 파악 참여, 개선조치 시행 참여",
        "그 밖에 고용노동부령으로 정하는 해당작업의 안전·보건 사항",
    ]),
    ("안전보건총괄책임자 (산업안전보건법 시행령 제53조제1항)", [
        "위험성평가의 실시 (법 제36조)",
        "작업의 중지 (법 제51조·제54조)",
        "도급 시 산업재해 예방조치 (법 제64조)",
        "산업안전보건관리비의 관계수급인 간 사용 협의·조정 및 집행 감독 (법 제72조제1항)",
        "안전인증대상기계등과 자율안전확인대상기계등의 사용 여부 확인",
    ]),
]


def eval_sheet(ws):
    setup(ws)
    heads = ["번호", "법정 업무", "평가", "확인한 근거", "개선할 점"]
    widths = [5, 46, 14, 18, 18]
    last = col(len(heads) - 1)
    title(ws, last, "안전보건관리책임자등 업무 평가표", "중대재해처벌법 시행령 제4조제5호나목 (반기 1회 이상 평가·관리)")
    for c, w in zip("ABCDE", widths):
        ws.column_dimensions[c].width = w
    r = 4
    for lb in ["평가 대상 (성명·직책)", "평가 기간", "평가자"]:
        info(ws, r, lb, last=last, value="         년   [ ]상반기   [ ]하반기" if lb == "평가 기간" else None)
        r += 1
    r += 1
    n = 0
    for role, items in ROLES:
        section(ws, r, last, f"[ ] {role}"); r += 1
        header(ws, r, heads, h=22); r += 1
        for it in items:
            n += 1
            cell(ws, f"A{r}", n, align=CENTER)
            cell(ws, f"B{r}", it, f(9))
            cell(ws, f"C{r}", "[ ]충실 [ ]보통\n[ ]미흡", f(8), align=CENTER)
            cell(ws, f"D{r}", None)
            cell(ws, f"E{r}", None)
            ws.row_dimensions[r].height = 30
            r += 1
        r += 1
    info(ws, r, "종합 의견", last=last, h=44); r += 2
    r = sign(ws, r, ["평가자", "경영책임자 확인"], "C", "C", "D", "E")
    note(ws, r + 1, last, f"평가 대상의 구분에 표시하고 그 업무만 평가합니다. 평가 기준(충실·보통·미흡의 뜻)은 사업장이 정합니다. · {SRC} · {MADE}", NOTE, 30)


# ───────────── 5. 종사자 의견 청취·조치 기록 (영 제4조제7호) ─────────────
def voice_sheet(ws):
    setup(ws, landscape=True)
    heads = ["번호", "받은 날", "들은 경로", "의견 내용", "재해 예방에\n필요한가", "개선방안", "담당", "완료(예정)일", "이행 확인"]
    widths = [5, 11, 18, 40, 11, 34, 9, 11, 10]
    last = col(len(heads) - 1)
    title(ws, last, "종사자 의견 청취·조치 기록", "중대재해처벌법 시행령 제4조제7호 (개선방안 이행 여부 반기 1회 이상 점검)")
    header(ws, 4, heads, widths, h=32)
    r = 5
    for k in range(14):
        cell(ws, f"A{r}", k + 1, align=CENTER)
        cell(ws, f"B{r}", None, align=CENTER)
        cell(ws, f"C{r}", "[ ]위원회 [ ]협의체\n[ ]건의함 [ ]TBM [ ]기타", f(8), align=CENTER)
        cell(ws, f"D{r}", None)
        cell(ws, f"E{r}", "[ ]예  [ ]아니오", f(8), align=CENTER)
        for c in "FGHI":
            cell(ws, f"{c}{r}", None, align=CENTER if c in "HI" else WRAP)
        ws.row_dimensions[r].height = 32
        r += 1
    r += 1
    r = sign(ws, r, ["반기 점검자", "경영책임자 확인"], "F", "F", "G", "I")
    note(ws, r + 1, last, f"산업안전보건위원회, 도급인·수급인 협의체에서 논의하거나 심의·의결한 것은 종사자 의견을 들은 것으로 봅니다(같은 호 단서). 회의록 번호를 의견 내용에 적어 둡니다. · {SRC} · {MADE}", NOTE, 30)


# ───────────── 6. 중대산업재해 대응 매뉴얼 점검 (영 제4조제8호) ─────────────
MANUAL = [
    ("가. 대응조치", "작업 중지 기준과 중지를 지시할 수 있는 사람이 정해져 있다"),
    ("가. 대응조치", "근로자 대피 경로와 모이는 곳이 정해져 있고 현장에 게시되어 있다"),
    ("가. 대응조치", "위험요인 제거(전원 차단, 밸브 잠금, 출입 통제 등) 방법이 정해져 있다"),
    ("나. 구호조치", "응급처치 담당, 119 신고, 병원 이송 순서가 정해져 있다"),
    ("나. 구호조치", "구호에 쓰는 장비(구급함, 공기호흡기, 들것 등) 위치가 정해져 있다"),
    ("다. 추가 피해방지", "2차 사고를 막는 조치(구조자 보호구 착용, 주변 작업 중지, 현장 보존)가 정해져 있다"),
    ("다. 추가 피해방지", "비상 연락망(사내, 협력업체, 관계기관)이 최신이다"),
    ("관련 의무", "중대재해 발생 시 즉시 작업 중지·대피, 지체 없이 고용노동부에 보고 (산업안전보건법 제54조)"),
    ("관련 의무", "수급인 근로자도 매뉴얼 대상에 들어 있고 내용을 알고 있다"),
]


def manual_sheet(ws):
    setup(ws)
    heads = ["번호", "구분", "확인 항목", "결과", "보완할 점"]
    widths = [5, 14, 46, 13, 18]
    last = col(len(heads) - 1)
    title(ws, last, "중대산업재해 대응 매뉴얼 점검표", "중대재해처벌법 시행령 제4조제8호 (매뉴얼대로 조치하는지 반기 1회 이상 점검)")
    r = 4
    for lb in ["점검일", "매뉴얼 이름·개정일", "점검자"]:
        info(ws, r, lb, last=last); r += 1
    r += 1
    section(ws, r, last, "1. 매뉴얼 내용"); r += 1
    header(ws, r, heads, widths, h=22); r += 1
    for i, (g, it) in enumerate(MANUAL, 1):
        cell(ws, f"A{r}", i, align=CENTER)
        cell(ws, f"B{r}", g, f(9), align=CENTER)
        cell(ws, f"C{r}", it, f(9))
        cell(ws, f"D{r}", "[ ]예 [ ]아니오", f(8), align=CENTER)
        cell(ws, f"E{r}", None)
        ws.row_dimensions[r].height = 30
        r += 1
    r += 1
    section(ws, r, last, "2. 훈련·점검 기록"); r += 1
    for c, h in zip("ABCDE", ["번호", "일자", "상황 (시나리오)", "참여 인원", "드러난 문제와 보완"]):
        cell(ws, f"{c}{r}", h, f(10, True), HEAD, CENTER)
    ws.row_dimensions[r].height = 22
    r += 1
    r = blank_rows(ws, r, 5, 5, h=30)
    r += 1
    r = sign(ws, r, ["점검자", "경영책임자 확인"], "C", "C", "D", "E")
    note(ws, r + 1, last, f"가·나·다는 시행령에 적힌 세 가지 조치입니다. 각 줄의 확인 항목은 이 세 가지를 현장에서 확인할 수 있게 풀어 쓴 예시이니 사업장에 맞게 고칩니다. · {SRC} · {MADE}", NOTE, 30)


# ───────────── 7. 수급인 안전·보건 평가표 (영 제4조제9호) ─────────────
ABILITY = [
    ("안전·보건 경영방침과 담당 조직이 있다", 10),
    ("안전·보건 관리 인력(자격·경력)이 업무 규모에 맞다", 15),
    ("위험성평가를 실시하고 결과를 관리한다", 15),
    ("작업 절차서와 작업계획서를 갖추고 있다", 10),
    ("근로자 안전보건교육을 실시하고 기록한다", 10),
    ("필요한 보호구와 장비를 갖추고 있다", 10),
    ("최근 3년 산업재해 발생 현황 (적을수록 높은 점수)", 15),
    ("최근 3년 안전·보건 법령 위반 이력 (없을수록 높은 점수)", 15),
]


def vendor_sheet(ws):
    setup(ws)
    heads = ["번호", "평가 항목", "배점", "점수", "근거 서류"]
    widths = [5, 46, 8, 8, 25]
    last = col(len(heads) - 1)
    title(ws, last, "도급·용역·위탁 수급인 안전·보건 평가표", "중대재해처벌법 시행령 제4조제9호 (기준·절차대로 이루어지는지 반기 1회 이상 점검)")
    r = 4
    for lb in ["수급인 (업체명)", "맡기는 업무", "계약 기간", "평가일 / 평가자"]:
        info(ws, r, lb, last=last); r += 1
    r += 1
    section(ws, r, last, "가. 산업재해 예방을 위한 조치 능력과 기술"); r += 1
    header(ws, r, heads, widths, h=22); r += 1
    first = r
    for i, (it, pt) in enumerate(ABILITY, 1):
        cell(ws, f"A{r}", i, align=CENTER)
        cell(ws, f"B{r}", it, f(9))
        cell(ws, f"C{r}", pt, align=CENTER)
        cell(ws, f"D{r}", None, align=CENTER)
        cell(ws, f"E{r}", None)
        ws.row_dimensions[r].height = 26
        r += 1
    cell(ws, f"A{r}", "합계", f(10, True), HEAD, CENTER)
    ws.merge_cells(f"A{r}:B{r}")
    boxrange(ws, f"A{r}:B{r}")
    cell(ws, f"C{r}", f"=SUM(C{first}:C{r - 1})", f(10, True), align=CENTER)
    cell(ws, f"D{r}", f'=IF(COUNT(D{first}:D{r - 1})=0,"",SUM(D{first}:D{r - 1}))', f(10, True), align=CENTER)
    cell(ws, f"E{r}", "적격 기준:        점 이상", f(9))
    ws.row_dimensions[r].height = 26
    r += 1
    info(ws, r, "평가 결과", last=last, h=40, value="[ ]적격    [ ]부적격\n[ ]조건부 적격 (보완 조건:                         )"); r += 2
    section(ws, r, last, "나. 안전·보건을 위한 관리비용"); r += 1
    for lb in ["비용 산정 기준", "계약에 반영한 금액", "반영 확인"]:
        info(ws, r, lb, last=last, value="[ ]계약서에 반영됨   [ ]반영 안 됨" if lb == "반영 확인" else None); r += 1
    r += 1
    section(ws, r, last, "다. 공사기간·건조기간 (건설업·조선업만)"); r += 1
    for lb in ["적정 기간 기준", "계약 기간", "확인"]:
        info(ws, r, lb, last=last, value="[ ]기준 이상   [ ]해당없음\n[ ]기준 미만 (사유:                         )" if lb == "확인" else None, h=40 if lb == "확인" else 24); r += 1
    r += 1
    r = sign(ws, r, ["평가자", "경영책임자 확인"], "C", "D", "E", "E")
    note(ws, r + 1, last, f"가·나·다는 시행령이 마련하라고 정한 기준입니다. 평가 항목과 배점, 적격 기준은 예시이니 사업장 기준으로 고칩니다. · {SRC} · {MADE}", NOTE, 30)


# ───────────── 8. 안전·보건 관계 법령 의무 이행 점검 (영 제5조) ─────────────
LAWS = [
    ("제15조", "안전보건관리책임자"),
    ("제16조", "관리감독자"),
    ("제17조~제19조, 제22조", "안전관리자, 보건관리자, 안전보건관리담당자, 산업보건의"),
    ("제24조", "산업안전보건위원회"),
    ("제25조·제26조", "안전보건관리규정의 작성, 작성·변경 절차"),
    ("제29조", "근로자에 대한 안전보건교육"),
    ("제31조", "건설업 기초안전보건교육"),
    ("제32조", "안전보건관리책임자 등에 대한 직무교육"),
    ("제34조", "법령 요지 등의 게시 등"),
    ("제36조", "위험성평가의 실시"),
    ("제37조", "안전보건표지의 설치·부착"),
    ("제38조·제39조", "안전조치, 보건조치"),
    ("제41조", "고객의 폭언 등으로 인한 건강장해 예방조치 등"),
    ("제42조", "유해위험방지계획서의 작성·제출 등"),
    ("제54조", "중대재해 발생 시 사업주의 조치"),
    ("제57조", "산업재해 발생 은폐 금지 및 보고 등"),
    ("제63조·제64조", "도급인의 안전조치 및 보건조치, 도급에 따른 산업재해 예방조치"),
    ("제80조", "유해하거나 위험한 기계·기구에 대한 방호조치"),
    ("제93조", "안전검사"),
    ("제110조·제114조", "물질안전보건자료의 작성 및 제출, 게시 및 교육"),
    ("제125조", "작업환경측정"),
    ("제129조·제130조", "일반건강진단, 특수건강진단 등"),
    ("제164조", "서류의 보존"),
]


def laws_sheet(ws):
    setup(ws, landscape=True)
    heads = ["번호", "법령·조문", "의무 (조문 제목)", "해당", "이행 여부", "확인한 서류", "미이행 시 조치 (영 제5조제2항제2호)"]
    widths = [5, 30, 44, 8, 13, 22, 30]
    last = col(len(heads) - 1)
    title(ws, last, "안전·보건 관계 법령 의무 이행 점검표", "중대재해처벌법 시행령 제5조제2항제1호 (반기 1회 이상 점검, 위탁 점검이면 결과 보고받기)")
    r = 4
    info(ws, r, "점검 대상 기간", last=last, value="         년   [ ]상반기   [ ]하반기"); r += 1
    info(ws, r, "점검자 (위탁기관)", last=last); r += 2
    header(ws, r, heads, widths, h=26); r += 1
    for i, (no, name) in enumerate(LAWS, 1):
        cell(ws, f"A{r}", i, align=CENTER)
        cell(ws, f"B{r}", f"산업안전보건법 {no}", f(9))
        cell(ws, f"C{r}", name, f(9))
        cell(ws, f"D{r}", "[ ]", align=CENTER)
        cell(ws, f"E{r}", "[ ]이행 [ ]미흡", f(8), align=CENTER)
        cell(ws, f"F{r}", None)
        cell(ws, f"G{r}", None)
        ws.row_dimensions[r].height = 22
        r += 1
    for k in range(6):
        for c in "ABCDEFG":
            cell(ws, f"{c}{r}", (len(LAWS) + k + 1) if c == "A" else ("[ ]" if c == "D" else ("[ ]이행 [ ]미흡" if c == "E" else None)), f(8) if c == "E" else f(), align=CENTER if c in "ADE" else WRAP)
        ws.row_dimensions[r].height = 22
        r += 1
    r += 1
    r = sign(ws, r, ["점검자", "경영책임자 확인 (보고받은 날:          )"], "E", "F", "G", "G")
    note(ws, r + 1, last, f"관계 법령은 우리 사업장에 적용되는 것으로서 종사자의 안전·보건을 확보하는 데 관련된 법령입니다(영 제5조제1항). 빈 줄에 화학물질관리법, 소방 관계 법령 등 해당 법령을 더 적습니다. 조문 제목은 산업안전보건법 2026.10.27. 시행본. · {MADE}", NOTE, 30)


def make():
    wb = Workbook()
    sheets = [
        ("1 반기 이행 점검표", check_sheet),
        ("2 경영방침과 목표", policy_sheet),
        ("3 예산 편성·집행", budget_sheet),
        ("4 책임자등 평가", eval_sheet),
        ("5 종사자 의견", voice_sheet),
        ("6 대응 매뉴얼 점검", manual_sheet),
        ("7 수급인 평가", vendor_sheet),
        ("8 관계 법령 점검", laws_sheet),
    ]
    for i, (name, fn) in enumerate(sheets):
        ws = wb.active if i == 0 else wb.create_sheet()
        ws.title = name
        fn(ws)
    save(wb, "sapa-half-year-set.xlsx")


if __name__ == "__main__":
    make()
