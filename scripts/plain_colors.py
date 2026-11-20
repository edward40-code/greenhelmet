"""자료실 양식(.xlsx, .docx)의 색을 정리한다.
칸 바탕색은 모두 없애고, 글자·테두리는 모두 검정으로 한다. 양식에는 어떤 색도 넣지 않는다.
양식을 만드는 스크립트(make_*.py)를 돌린 뒤 마지막에 한 번 실행한다.

    python scripts/plain_colors.py
"""
import copy
import pathlib
import re
import shutil
import tempfile
import zipfile

from openpyxl import load_workbook
from openpyxl.styles import PatternFill

LIB = pathlib.Path(__file__).resolve().parent.parent / "public" / "library"
BLACK = "FF000000"


def _black_side(side):
    if side is None or side.style is None:
        return side
    s = copy.copy(side)
    s.color = BLACK
    return s


def xlsx(path: pathlib.Path):
    wb = load_workbook(path)
    for ws in wb:
        ws.sheet_properties.tabColor = None
        for row in ws.iter_rows():
            for c in row:
                fill = c.fill
                if fill is not None and fill.fill_type:
                    c.fill = PatternFill(fill_type=None)
                if c.font is not None and c.font.color is not None:
                    fnt = copy.copy(c.font)
                    fnt.color = BLACK
                    c.font = fnt
                b = c.border
                if b is not None:
                    nb = copy.copy(b)
                    nb.left, nb.right, nb.top, nb.bottom = map(_black_side, (b.left, b.right, b.top, b.bottom))
                    c.border = nb
    wb.save(path)


def docx(path: pathlib.Path):
    tmp = pathlib.Path(tempfile.mkdtemp()) / path.name
    with zipfile.ZipFile(path) as zin, zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            if item.filename.startswith("word/") and item.filename.endswith(".xml"):
                x = data.decode("utf-8")
                x = re.sub(r'(<w:color [^>]*w:val=")[0-9A-Fa-f]{6}(")', r"\g<1>000000\2", x)
                x = re.sub(r'(w:color=")[0-9A-Fa-f]{6}(")', r"\g<1>000000\2", x)  # 테두리 색
                x = re.sub(r'w:fill="[0-9A-Fa-f]{6}"', 'w:fill="auto"', x)
                # 스타일의 테마 색(파랑 등)이 위의 값을 덮어쓰지 않게 테마 색 지정을 지운다
                x = re.sub(r' w:theme(Color|Shade|Tint|Fill|FillShade|FillTint)="[^"]*"', "", x)
                data = x.encode("utf-8")
            zout.writestr(item, data)
    shutil.move(tmp, path)


if __name__ == "__main__":
    for p in sorted(LIB.glob("*.xlsx")):
        xlsx(p)
        print("xlsx", p.name)
    for p in sorted(LIB.glob("*.docx")):
        docx(p)
        print("docx", p.name)
