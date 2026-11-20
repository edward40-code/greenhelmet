# 밀폐공간 작업 프로그램 양식·예문 DOCX 생성기
# 근거: 산업안전보건기준에 관한 규칙 제618조~제641조, [별표 2] 제20호, [별표 18]
#       국가법령정보센터 현행본 2026-11-19 확인
# 실행: python scripts/make_cs_program.py → public/library/confined-space-program.docx
import sys
from pathlib import Path
from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

sys.stdout.reconfigure(encoding="utf-8")
OUT = Path(__file__).resolve().parent.parent / "public" / "library" / "confined-space-program.docx"
FONT = "맑은 고딕"
GRAY = RGBColor(0, 0, 0)  # 양식에는 연한 녹색 말고 색을 넣지 않는다
GREEN = RGBColor(0, 0, 0)
RED = RGBColor(0, 0, 0)

BYUL18 = [
    "1. 다음의 지층에 접하거나 통하는 우물·수직갱·터널·잠함·피트 또는 그 밖에 이와 유사한 것의 내부 (가. 상층에 물이 통과하지 않는 지층이 있는 역암층 중 함수 또는 용수가 없거나 적은 부분 / 나. 제1철 염류 또는 제1망간 염류를 함유하는 지층 / 다. 메탄·에탄 또는 부탄을 함유하는 지층 / 라. 탄산수를 용출하고 있거나 용출할 우려가 있는 지층)",
    "2. 장기간 사용하지 않은 우물 등의 내부",
    "3. 케이블·가스관 또는 지하에 부설되어 있는 매설물을 수용하기 위하여 지하에 부설한 암거·맨홀 또는 피트의 내부",
    "4. 빗물·하천의 유수 또는 용수가 있거나 있었던 통·암거·맨홀 또는 피트의 내부",
    "5. 바닷물이 있거나 있었던 열교환기·관·암거·맨홀·둑 또는 피트의 내부",
    "6. 장기간 밀폐된 강재(鋼材)의 보일러·탱크·반응탑이나 그 밖에 그 내벽이 산화하기 쉬운 시설(그 내벽이 스테인리스강으로 된 것 또는 그 내벽의 산화를 방지하기 위하여 필요한 조치가 되어 있는 것은 제외한다)의 내부",
    "7. 석탄·아탄·황화광·강재·원목·건성유(乾性油)·어유(魚油) 또는 그 밖의 공기 중의 산소를 흡수하는 물질이 들어 있는 탱크 또는 호퍼(hopper) 등의 저장시설이나 선창의 내부",
    "8. 천장·바닥 또는 벽이 건성유를 함유하는 페인트로 도장되어 그 페인트가 건조되기 전에 밀폐된 지하실·창고 또는 탱크 등 통풍이 불충분한 시설의 내부",
    "9. 곡물 또는 사료의 저장용 창고 또는 피트의 내부, 과일의 숙성용 창고 또는 피트의 내부, 종자의 발아용 창고 또는 피트의 내부, 버섯류의 재배를 위하여 사용하고 있는 사일로(silo), 그 밖에 곡물 또는 사료종자를 적재한 선창의 내부",
    "10. 간장·주류·효모 그 밖에 발효하는 물품이 들어 있거나 들어 있었던 탱크·창고 또는 양조주의 내부",
    "11. 분뇨, 오염된 흙, 썩은 물, 폐수, 오수, 그 밖에 부패하거나 분해되기 쉬운 물질이 들어 있는 정화조·침전조·집수조·탱크·암거·맨홀·관 또는 피트의 내부",
    "12. 드라이아이스를 사용하는 냉장고·냉동고·냉동화물자동차 또는 냉동컨테이너의 내부",
    "13. 헬륨·아르곤·질소·프레온·이산화탄소 또는 그 밖의 불활성기체가 들어 있거나 있었던 보일러·탱크 또는 반응탑 등 시설의 내부",
    "14. 산소농도가 18퍼센트 미만 또는 23.5퍼센트 이상, 이산화탄소농도가 1.5퍼센트 이상, 일산화탄소농도가 30피피엠 이상 또는 황화수소농도가 10피피엠 이상인 장소의 내부",
    "15. 갈탄·목탄·연탄난로를 사용하는 콘크리트 양생장소(養生場所) 및 가설숙소 내부",
    "16. 화학물질이 들어 있던 반응기 및 탱크의 내부",
    "17. 유해가스가 들어 있던 배관이나 집진기의 내부",
    "18. 근로자가 상주(常住)하지 않는 공간으로서 출입이 제한되어 있는 장소의 내부",
]


# ---------- 문서 헬퍼 ----------
def set_font(run, size=None, bold=None, color=None):
    run.font.name = FONT
    run._element.rPr.rFonts.set(qn("w:eastAsia"), FONT)
    if size:
        run.font.size = Pt(size)
    if bold is not None:
        run.bold = bold
    if color is not None:
        run.font.color.rgb = color


def para(doc, text="", size=10.5, bold=False, color=None, align=None, space_after=4, style=None):
    p = doc.add_paragraph(style=style) if style else doc.add_paragraph()
    if text:
        set_font(p.add_run(text), size, bold, color)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.35
    if align:
        p.alignment = align
    return p


def heading(doc, text, level=1):
    size = {0: 18, 1: 14, 2: 12}[level]
    p = para(doc, text, size=size, bold=True, color=GREEN if level == 1 else None, space_after=6)
    p.paragraph_format.space_before = Pt(14 if level <= 1 else 8)
    p.paragraph_format.keep_with_next = True
    return p


def guide(doc, text):
    """작성 안내 (양식에서 지우고 쓰는 부분)"""
    return para(doc, "※ " + text, size=9.5, color=GRAY)


def bullet(doc, text, size=10.5):
    p = para(doc, "• " + text, size=size, space_after=2)
    p.paragraph_format.left_indent = Cm(0.5)
    p.paragraph_format.first_line_indent = Cm(-0.35)
    return p


def shade(cell, hex_color):
    return  # 양식에는 어떤 색도 넣지 않는다
    tcPr = cell._element.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), hex_color)
    tcPr.append(shd)


def table(doc, headers, rows, widths=None, size=9.5, empty_rows=0):
    t = doc.add_table(rows=1, cols=len(headers))
    t.style = "Table Grid"
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    for i, h in enumerate(headers):
        c = t.rows[0].cells[i]
        c.text = ""
        set_font(c.paragraphs[0].add_run(h), size, True)
        c.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
        shade(c, "E8F3EC")
    for row in list(rows) + [[""] * len(headers)] * empty_rows:
        cells = t.add_row().cells
        for i, v in enumerate(row):
            cells[i].text = ""
            set_font(cells[i].paragraphs[0].add_run(str(v)), size)
    if widths:
        for row in t.rows:
            for i, w in enumerate(widths):
                row.cells[i].width = Cm(w)
    doc.add_paragraph().paragraph_format.space_after = Pt(2)
    return t


def page_break(doc):
    doc.add_paragraph().add_run().add_break(WD_BREAK.PAGE)


# ---------- 내용 ----------
def cover(doc, title, sub, example=False):
    for _ in range(5):
        para(doc)
    para(doc, title, size=24, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=10)
    para(doc, sub, size=12, color=GRAY, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=40)
    rows = [("사업장명", "○○식품(주) △△공장" if example else ""), ("수립일", "2026년 11월 20일" if example else "      년    월    일"),
            ("개정 번호", "Rev.0 (최초 수립)" if example else ""), ("작성", "안전관리자 홍길동" if example else ""), ("검토", "생산팀장 김철수" if example else ""), ("승인 (사업주·안전보건관리책임자)", "공장장 이영희" if example else "")]
    t = doc.add_table(rows=0, cols=2)
    t.style = "Table Grid"
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    for k, v in rows:
        c = t.add_row().cells
        c[0].text = ""; c[1].text = ""
        set_font(c[0].paragraphs[0].add_run(k), 10.5, True)
        shade(c[0], "E8F3EC")
        set_font(c[1].paragraphs[0].add_run(v), 10.5)
        c[0].width = Cm(6); c[1].width = Cm(9)
    if example:
        para(doc)
        para(doc, "※ 이 문서는 가상의 식품공장을 예로 든 예문입니다. 사업장명·인명·설비는 모두 가상입니다. 자기 사업장의 실제 밀폐공간과 위험요인으로 바꿔 쓰세요.",
             size=9.5, color=RED, align=WD_ALIGN_PARAGRAPH.CENTER)
    page_break(doc)


def chapters(doc, ex):
    """ex=True 이면 예문, False 이면 양식(작성 안내 포함)"""
    # 1
    heading(doc, "1. 목적 및 적용범위")
    if ex:
        para(doc, "이 프로그램은 「산업안전보건기준에 관한 규칙」(이하 '안전보건규칙') 제619조제1항에 따라 ○○식품(주) △△공장의 밀폐공간에서 일어날 수 있는 질식·중독·화재·폭발을 예방하기 위해 수립한다.")
        para(doc, "적용범위: 공장 안의 모든 밀폐공간(별첨 1 밀폐공간 대장)과, 그 안에서 작업하는 직영 근로자 및 수급인(협력업체) 근로자에게 적용한다.")
    else:
        guide(doc, "법적 근거(안전보건규칙 제619조제1항)와 적용 대상(사업장 전체 / 특정 공정, 직영·협력업체 근로자 포함 여부)을 적습니다.")
        para(doc, "이 프로그램은 「산업안전보건기준에 관한 규칙」 제619조제1항에 따라 (사업장명)의 밀폐공간 작업 근로자의 건강장해를 예방하기 위해 수립한다.")
        para(doc, "적용범위: ")

    # 2
    heading(doc, "2. 책임과 역할")
    if not ex:
        guide(doc, "아래 역할은 법령에 정한 업무를 기준으로 정리했습니다. 담당자 이름·직위를 적고, 사업장 사정에 맞게 더합니다.")
    roles = [
        ("사업주 (안전보건관리책임자)", "프로그램 수립·시행과 필요한 예산·장비 지원, 밀폐공간 작업 승인" + (" — 공장장 이영희" if ex else "")),
        ("관리감독자", "작업 시작 전 작업 지휘, 공기 상태 측정, 측정장비·환기장치·공기호흡기·송기마스크 점검, 착용 지도·점검 (별표 2 제20호)" + (" — 해당 공정 반장" if ex else "")),
        ("측정자", "산소·유해가스 농도 측정·평가, 측정 기록 (제619조의2). 측정 지식과 실무경험이 있는 사람으로 지정" + (" — 안전관리자 홍길동, 환경담당 박민수" if ex else "")),
        ("감시인", "작업 중 밀폐공간 외부에서 작업상황 감시, 이상 시 관할 소방관서 신고 후 사업주·관리감독자에게 알림 (제623조)" + (" — 작업마다 작업 전 확인서에 지정" if ex else "")),
        ("작업자", "지급된 보호구 착용(제620조·제624조), 허락 없이 출입금지 장소 출입 금지(제622조·제639조), 이상 발견 시 즉시 대피"),
        ("안전관리자·보건관리자", "프로그램 작성·평가 지원, 교육·훈련 계획, 측정장비 관리" + (" — 안전관리자 홍길동" if ex else "")),
    ]
    table(doc, ["구분", "역할"], roles, widths=[4.5, 11.5])

    # 3
    heading(doc, "3. 밀폐공간의 위치 파악 및 관리 방안  (제619조제1항제1호)")
    if ex:
        para(doc, "가. 공장 안의 밀폐공간을 안전보건규칙 별표 18에 따라 조사해 별첨 1 '밀폐공간 대장'에 등록하였다. 새 설비를 설치하거나 공정을 바꿀 때 안전관리자가 대장을 고친다.")
        para(doc, "나. 모든 밀폐공간 출입구에 출입금지 표지(안전보건규칙 별지 제4호서식)를 붙이고, 맨홀은 잠금장치를 달아 열쇠를 생산팀에서 관리한다(제622조).")
        para(doc, "다. 밀폐공간 출입은 작업 전 확인서(밀폐공간 작업 점검표 세트 1번 시트)를 작성하고 관리감독자가 확인한 뒤에만 허용한다.")
        para(doc, "라. 해마다 1월에 대장과 현장을 대조해 빠진 밀폐공간이 없는지 확인한다.")
    else:
        guide(doc, "사업장을 돌며 아래 별표 18의 18개 유형에 해당하는 장소를 모두 찾아 대장(별첨 1)에 적습니다. 맨홀·집수조·정화조·탱크·사일로·지하 피트·덕트처럼 평소 사람이 들어가지 않는 곳을 빠짐없이 봅니다.")
        guide(doc, "관리 방안에는 출입금지 표지(제622조), 잠금·열쇠 관리, 출입 승인 절차, 대장 갱신 시기를 적습니다.")
        for _ in range(3):
            para(doc, "가. ")
    heading(doc, "참고: 밀폐공간의 범위 (안전보건규칙 별표 18 원문)", 2)
    for b in BYUL18:
        bullet(doc, b, size=9)

    # 4
    heading(doc, "4. 유해·위험요인의 파악 및 관리 방안  (제619조제1항제2호)")
    if ex:
        para(doc, "밀폐공간마다 질식·중독을 일으킬 수 있는 요인과 관리 방안을 아래와 같이 정한다. 적정공기 기준은 산소 18% 이상 23.5% 미만, 이산화탄소 1.5% 미만, 일산화탄소 30ppm 미만, 황화수소 10ppm 미만이다(제618조제3호).")
        table(doc, ["밀폐공간", "유해·위험요인", "발생 원인", "관리 방안"], [
            ("폐수처리장 집수조", "황화수소, 산소결핍", "폐수·슬러지 부패, 교반 시 가스 방출", "작업 전·중 연속 측정, 강제 급·배기, 슬러지 교반 금지, 공기호흡기 비치"),
            ("발효탱크 (T-101~104)", "이산화탄소, 산소결핍", "발효 중 이산화탄소 발생·잔류", "배출 후 충분히 환기, 바닥 부근 측정, 송기마스크 대기"),
            ("질소 퍼지 저장탱크 (T-201)", "산소결핍 (질소)", "질소 퍼지 배관 연결", "질소 밸브 차단·맹판 설치·잠금 후 작업, 연속 측정"),
            ("우수 맨홀 (MH-1~6)", "산소결핍, 황화수소", "고인 빗물·유기물 부패", "작업 전 측정, 송풍기 환기"),
            ("지하 저수조", "산소결핍", "장기 밀폐, 내벽 산화", "청소 전 환기·측정, 감시인 배치"),
        ], widths=[3.2, 3, 4, 5.8], size=9)
    else:
        guide(doc, "대장에 올린 밀폐공간마다 어떤 가스(산소결핍, 황화수소, 일산화탄소, 이산화탄소, 가연성 가스, 불활성가스 등)가 왜 생기는지와 관리 방법을 적습니다.")
        table(doc, ["밀폐공간", "유해·위험요인", "발생 원인", "관리 방안"], [], widths=[3.2, 3, 4, 5.8], empty_rows=5)

    # 5
    heading(doc, "5. 밀폐공간 작업 시 사전 확인 절차  (제619조제1항제3호)")
    steps = [
        ("작업 계획", "작업 일시·기간·장소·내용, 관리감독자·작업자·감시인을 정한다 (제619조제2항제1호·제2호)."),
        ("측정자 지정과 숙지 확인", "측정자를 지정해 장비를 지급하고, 위험성·장비 조작·측정방법·적정공기 기준을 숙지했는지 확인한다 (제619조의2제1항·제2항)."),
        ("가스 유입 차단", "불활성가스·유해가스가 새거나 들어오거나 생길 가능성을 검토하고 밸브 차단·맹판·잠금 등 후속조치를 한다 (제619조제2항제4호)."),
        ("환기", "작업 시작 전 적정공기가 되도록 환기한다. 환기할 수 없으면 공기호흡기·송기마스크를 착용시킨다 (제620조)."),
        ("측정", "작업 시작 전과 중단 후 재개 전마다 산소·유해가스 농도를 측정하고, 측정자 성명·일시·장소·결과를 기록해 3년 보존한다 (제619조의2제1항·제4항)."),
        ("보호구·대피기구", "보호구 종류를 정해 지급하고, 추락 우려 시 안전대·구명밧줄과 걸 설비를 갖춘다. 공기호흡기·송기마스크·사다리·섬유로프를 비치한다 (제624조·제625조)."),
        ("감시인·연락설비", "감시인을 외부에 배치하고 작업장과 상시 연락할 설비를 설치한다 (제623조)."),
        ("작업자 주지", "위험성, 측정, 안전한 작업방법, 보호구, 비상연락처·응급조치, 대피기구 위치·사용법을 알리고 숙지 여부를 확인한다 (제641조)."),
        ("게시", "위 사항을 적은 작업 전 확인서를 작업이 끝날 때까지 출입구에 게시한다 (제619조제3항)."),
        ("인원 점검", "입장·퇴장 때마다 인원을 점검한다 (제621조)."),
        ("작업 중", "환기를 계속하고, 질식·화재·폭발 우려가 있으면 즉시 중단·대피시키며 적정공기 확인 전까지 출입을 금지한다 (제620조·제639조)."),
    ]
    if not ex:
        guide(doc, "아래 절차는 법령에 정한 확인 사항을 순서대로 정리한 것입니다. 사업장의 승인 단계(누가 승인하는지)와 서식 이름을 더해 쓰세요.")
    table(doc, ["단계", "확인 내용 (근거)"], steps, widths=[3.5, 12.5], size=9)
    if ex:
        para(doc, "사용 서식: 그린헬멧기사 '밀폐공간 작업 점검표 세트' — ① 작업 전 확인서 ② 안전조치 점검표 ③ 가스 측정 기록부 ④ 출입 인원 점검표. 작업 전 확인서와 안전조치 점검표는 관리감독자가 서명하고, 생산팀장이 작업을 승인한다.")
        para(doc, "구조 원칙: 쓰러진 사람을 구하러 보호구 없이 들어가지 않는다. 감시인은 먼저 119에 신고하고, 구조자는 공기호흡기 또는 송기마스크를 착용한다.", bold=True, color=RED)
    else:
        para(doc, "승인 절차: ")

    # 6
    heading(doc, "6. 안전보건교육 및 훈련  (제619조제1항제4호)")
    if ex:
        table(doc, ["구분", "대상", "내용", "시기"], [
            ("작업 전 주지·숙지 확인", "작업자, 감시인", "제641조 6개 사항 (위험성, 측정, 작업방법, 보호구, 비상연락·응급조치, 대피기구)", "매 작업 시작 전"),
            ("측정자 교육", "지정 측정자", "위험성, 장비 확인·조작, 측정방법, 적정공기 기준·평가 (제619조의2제2항)", "측정 업무 시작 전, 장비 교체 시"),
            ("긴급 구조훈련", "밀폐공간 작업 근로자", "비상연락체계, 구조용 장비, 공기호흡기·송기마스크 착용, 응급처치 (제640조)", "6개월에 1회 이상 (4월·10월)"),
            ("법정 안전보건교육", "해당 근로자", "산업안전보건법 시행규칙에 따른 교육 (밀폐공간 작업 해당 교육 포함)", "법령에 정한 시기"),
        ], widths=[3.3, 2.7, 6.6, 3.4], size=9)
        para(doc, "교육·훈련 결과는 기록하여 보존한다(긴급 구조훈련은 제640조에 따라 기록 보존).")
    else:
        guide(doc, "최소한 ① 작업 전 주지·숙지 확인(제641조) ② 측정자 교육(제619조의2제2항) ③ 6개월에 1회 이상 긴급 구조훈련과 기록(제640조)을 넣습니다. 법정 안전보건교육(특별교육 등)의 대상·시간은 산업안전보건법 시행규칙 현행본을 확인해 적으세요.")
        table(doc, ["구분", "대상", "내용", "시기"], [], widths=[3.3, 2.7, 6.6, 3.4], empty_rows=4)

    # 7
    heading(doc, "7. 그 밖에 건강장해 예방에 관한 사항  (제619조제1항제5호)")
    if ex:
        bullet(doc, "협력업체가 밀폐공간 작업을 할 때도 이 프로그램과 같은 서식을 쓰게 하고, 작업 전 확인서를 공장 관리감독자가 함께 확인한다.")
        bullet(doc, "측정장비는 사용 전 이상 유무를 확인하고, 제조사 권장 주기에 따라 교정한다. 교정 기록은 안전관리자가 보관한다.")
        bullet(doc, "공기호흡기 충전 상태와 송기마스크 상태를 매월 점검한다.")
        bullet(doc, "사고가 나면 즉시 작업을 중단하고 대피시키며, 적정공기가 확인될 때까지 출입금지 사실을 게시한다(제639조).")
        bullet(doc, "24시간 상시 환기장치를 설치한 밀폐공간은 월 1회 이상 환기장치 작동과 적정공기 유지 상태를 점검하고 결과를 출입구에 게시한다(제626조). 해당 공간: 없음.")
        bullet(doc, "기록 보존: 가스 측정 기록 3년(제619조의2제4항), 작업 전 확인서·인원 점검표·교육훈련 기록은 사내 기준에 따라 3년 보관한다.")
    else:
        guide(doc, "협력업체 작업 관리, 측정장비 교정, 보호구 관리, 사고 시 대피(제639조), 상시 환기장치 특례(제626조) 해당 여부, 기록 보존 기간 등을 적습니다.")
        for _ in range(3):
            bullet(doc, "")

    # 8
    heading(doc, "8. 프로그램의 평가와 개정")
    if ex:
        para(doc, "안전관리자는 매년 12월에 프로그램 이행 상황(대장 정확성, 서식 작성률, 측정 기록, 교육·훈련 실시, 아차사고)을 평가해 공장장에게 보고하고, 밀폐공간이 새로 생기거나 사고·아차사고가 나면 즉시 고친다.")
    else:
        guide(doc, "평가 주기와 평가 항목, 개정 사유(설비 신설·공정 변경·사고·법령 개정)를 적습니다.")
        para(doc, "")

    # 별첨
    page_break(doc)
    heading(doc, "별첨 1. 밀폐공간 대장")
    heads = ["번호", "명칭·위치", "별표 18 해당", "예상 위험요인", "출입금지 표지", "관리 부서", "상시 환기"]
    if ex:
        table(doc, heads, [
            ("1", "폐수처리장 집수조 (B동 지하)", "제11호", "황화수소, 산소결핍", "부착", "환경팀", "아니오"),
            ("2", "발효탱크 T-101~104 (A동)", "제10호", "이산화탄소, 산소결핍", "부착", "생산1팀", "아니오"),
            ("3", "질소 퍼지 저장탱크 T-201 (A동)", "제13호", "산소결핍", "부착", "생산2팀", "아니오"),
            ("4", "우수 맨홀 MH-1~6 (구내 도로)", "제4호", "산소결핍, 황화수소", "부착·잠금", "시설팀", "아니오"),
            ("5", "지하 저수조 (본관 지하)", "제4호", "산소결핍", "부착", "시설팀", "아니오"),
        ], widths=[1.1, 4.2, 1.9, 3.1, 2, 2, 1.7], size=9)
    else:
        table(doc, heads, [], widths=[1.1, 4.2, 1.9, 3.1, 2, 2, 1.7], size=9, empty_rows=10)
    heading(doc, "별첨 2. 사용 서식", 2)
    para(doc, "밀폐공간 작업 전 확인서, 안전조치 점검표, 산소·유해가스 농도 측정 기록부, 출입 인원 점검표, 긴급 구조훈련 기록, 상시 환기장치 월간 점검표 — 그린헬멧기사 자료실 '밀폐공간 작업 점검표 세트'(무료)를 내려받아 씁니다.", size=10)
    para(doc)
    para(doc, "근거 법령: 산업안전보건기준에 관한 규칙 제618조~제641조, [별표 2] 제20호, [별표 18], 별지 제4호서식 (국가법령정보센터 현행본 2026.11.19. 확인). 법령이 바뀌면 현행본과 대조해 고치세요. · 양식 제공: 그린헬멧기사",
         size=8.5, color=GRAY)


def main():
    doc = Document()
    sec = doc.sections[0]
    sec.page_height, sec.page_width = Cm(29.7), Cm(21)
    sec.left_margin = sec.right_margin = Cm(2)
    sec.top_margin = sec.bottom_margin = Cm(2)
    st = doc.styles["Normal"]
    st.font.name = FONT
    st.element.rPr.rFonts.set(qn("w:eastAsia"), FONT)
    st.font.size = Pt(10.5)

    # 사용 안내
    heading(doc, "밀폐공간 작업 프로그램 양식·예문 사용 안내", 0)
    para(doc, "이 파일은 두 부분으로 되어 있습니다.")
    bullet(doc, "1부 양식: '※' 안내문을 읽고 지운 뒤 우리 사업장 내용을 채웁니다.")
    bullet(doc, "2부 예문: 가상의 식품공장을 예로 들어 끝까지 채운 예입니다. 어느 정도로 쓰면 되는지 감을 잡는 데 씁니다.")
    para(doc, "밀폐공간에서 근로자에게 작업을 시키는 사업주는 다음 5가지를 포함한 밀폐공간 작업 프로그램을 수립·시행해야 합니다(안전보건규칙 제619조제1항).", space_after=2)
    for i, x in enumerate(["사업장 내 밀폐공간의 위치 파악 및 관리 방안", "밀폐공간 내 질식·중독 등을 일으킬 수 있는 유해·위험 요인의 파악 및 관리 방안",
                           "밀폐공간 작업 시 사전 확인이 필요한 사항에 대한 확인 절차", "안전보건교육 및 훈련", "그 밖에 밀폐공간 작업 근로자의 건강장해 예방에 관한 사항"], 1):
        bullet(doc, f"{i}. {x}")
    para(doc, "양식의 3~7장이 이 5가지에 하나씩 대응합니다. 문서를 만들어 두는 것으로 끝나지 않고, 실제 작업 때 절차대로 했다는 기록(작업 전 확인서, 측정 기록 등)이 남아야 '시행'한 것이 됩니다.",
         color=RED, size=10)
    page_break(doc)

    cover(doc, "밀폐공간 작업 프로그램", "1부 · 양식")
    chapters(doc, ex=False)
    page_break(doc)
    cover(doc, "밀폐공간 작업 프로그램", "2부 · 예문 (가상의 식품공장)", example=True)
    chapters(doc, ex=True)

    doc.core_properties.author = "그린헬멧기사"
    doc.core_properties.title = "밀폐공간 작업 프로그램 양식·예문"
    doc.save(OUT)
    print("ok", OUT.name)


if __name__ == "__main__":
    main()
