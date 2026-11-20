"""자료실 미리보기 그림: make_thumbs.ps1 이 뽑은 첫 장(PDF·PNG)을 public/library/thumbs/{id}.png 로 만든다.
위쪽 760x400 부분만 남긴다(카드에서는 윗부분만 보인다)."""
import pathlib, fitz

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / ".thumbs"
OUT = ROOT / "public" / "library" / "thumbs"
OUT.mkdir(parents=True, exist_ok=True)
W, H = 760, 400

for f in sorted(SRC.iterdir()):
    if f.suffix == ".pdf":
        page = fitz.open(f)[0]
        r = page.rect
        # 용지 여백을 조금 잘라 내고 위쪽을 가로 760px로
        clip = fitz.Rect(r.x0 + r.width * 0.04, r.y0 + r.height * 0.03, r.x1 - r.width * 0.04, r.y1)
        zoom = W / clip.width
        clip.y1 = clip.y0 + H / zoom
        page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), clip=clip, alpha=False).save(OUT / (f.stem + ".png"))
    elif f.suffix == ".png":
        img = fitz.Pixmap(str(f))
        doc = fitz.open(); pg = doc.new_page(width=img.width, height=img.height); pg.insert_image(pg.rect, pixmap=img)
        zoom = W / img.width
        pg.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=False).save(OUT / (f.stem + ".png"))
    print("thumb", f.stem)
