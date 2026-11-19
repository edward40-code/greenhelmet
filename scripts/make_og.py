# 링크 공유용 썸네일(og:image) 만들기 → public/og.png (1200x630)
# 실행: python scripts/make_og.py   (Pillow 필요, 글꼴: Windows의 NotoSansKR-VF.ttf, 없으면 맑은 고딕)
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
S = 2  # 2배로 그린 뒤 줄여서 가장자리를 부드럽게
W, H = 1200 * S, 630 * S
INK, INK2, LOGO, WHITE = "#16242b", "#1f333c", "#6fd08c", "#ffffff"
SOFT, YELLOW = "#b9c6cc", "#f2c230"


def font(size, weight=700):
    for p in (r"C:\Windows\Fonts\NotoSansKR-VF.ttf", r"C:\Windows\Fonts\malgunbd.ttf"):
        if Path(p).exists():
            f = ImageFont.truetype(p, size * S)
            try:
                f.set_variation_by_axes([weight])
            except Exception:
                pass
            return f
    raise SystemExit("한글 글꼴을 찾지 못했습니다")


img = Image.new("RGB", (W, H), INK)
d = ImageDraw.Draw(img)

# 배경: 오른쪽 아래로 갈수록 살짝 밝아지는 면 + 점 무늬
for i in range(H):
    t = i / H
    d.line([(0, i), (W, i)], fill=tuple(int(a + (b - a) * t * 0.55) for a, b in zip((0x16, 0x24, 0x2b), (0x1b, 0x4a, 0x33))))
for y in range(0, H, 26 * S):
    for x in range(0, W, 26 * S):
        d.ellipse([x, y, x + 2 * S, y + 2 * S], fill="#2a3d45")

# 위쪽 안전 줄무늬(노랑·검정 사선)
band = 16 * S
stripe = Image.new("RGB", (W, band), YELLOW)
sd = ImageDraw.Draw(stripe)
for x in range(-band, W + band, 44 * S):
    sd.polygon([(x, band), (x + 22 * S, band), (x + 22 * S + band, 0), (x + band, 0)], fill=INK)
img.paste(stripe, (0, 0))

M = 88 * S  # 왼쪽 여백

# 로고: 둥근 사각형 + 안전모 선 그림 (public/icon.svg와 같은 모양)
bx, by, bs = M, 92 * S, 92 * S
d.rounded_rectangle([bx, by, bx + bs, by + bs], radius=20 * S, fill="#0f1a1f", outline="#2f4650", width=2 * S)
u = bs * 0.8 / 24  # 24 단위 격자
ox, oy = bx + bs * 0.1, by + bs * 0.1
lw = int(2.2 * u)
P = lambda x, y: (ox + x * u, oy + y * u)
d.arc([*P(4, 8), *P(20, 24)], 180, 360, fill=LOGO, width=lw)
d.rounded_rectangle([*P(2, 16), *P(22, 18.4)], radius=int(0.6 * u), outline=LOGO, width=lw)
d.line([P(10, 8.3), P(10, 5), P(14, 5), P(14, 8.3)], fill=LOGO, width=lw, joint="curve")
for x, y in ((4, 16), (20, 16), (10, 5), (14, 5)):
    r = lw / 2
    cx, cy = P(x, y)
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=LOGO)

d.text((bx + bs + 24 * S, by + bs / 2), "그린헬멧기사", font=font(50, 800), fill=WHITE, anchor="lm")

# 큰 제목
y = 232 * S
d.text((M, y), "안전·보건·환경 실무자의", font=font(66, 800), fill=WHITE)
d.text((M, y + 88 * S), "매일 현장 브리핑", font=font(66, 800), fill=LOGO)

# 설명
d.text((M, y + 198 * S), "사고속보와 법령 소식, 바로 쓰는 법정 점검표·서식을 무료로", font=font(30, 500), fill=SOFT)

# 아래 칩
x, cy = M, 540 * S
f = font(26, 700)
for label in ("사고속보", "법정 점검표", "이슈리포트", "현장 도구"):
    w = d.textlength(label, font=f)
    pad = 22 * S
    d.rounded_rectangle([x, cy - 26 * S, x + w + pad * 2, cy + 26 * S], radius=26 * S, fill=INK2, outline="#3a525c", width=2 * S)
    d.text((x + pad, cy), label, font=f, fill=WHITE, anchor="lm")
    x += w + pad * 2 + 14 * S
d.text((W - M, cy), "회원가입 없이 무료", font=font(24, 600), fill=YELLOW, anchor="rm")

out = ROOT / "public" / "og.png"
img.resize((1200, 630), Image.LANCZOS).save(out, optimize=True)
print(out, out.stat().st_size // 1024, "KB")
