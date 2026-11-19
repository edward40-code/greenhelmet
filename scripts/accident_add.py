# 사고 요약을 content/accident-notes.json 에 합친다 (예약작업용)
# 실행: python scripts/accident_add.py <요약 JSON 파일>
#   입력 형식(UTF-8): {"acc-...": {"summary": "요약", "url": "언론사 기사 주소", "tags": ["사다리", "건설"], "kind": "fall"}, ...}
#   (예전 형식 {"acc-...": "요약"} 도 받는다. kind 는 제목만으로 유형이 틀릴 때만 넣는다:
#    fall 추락, caught 끼임, crush 깔림·붕괴, gas 질식·중독, shock 감전, explosion 폭발, fire 화재, leak 누출, struck 맞음·낙하물, vehicle 차량 충돌)
import json, sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parent.parent
notes_path = ROOT / "content/accident-notes.json"
feed_ids = {x["id"] for x in json.loads((ROOT / "content/feeds/accidents.json").read_text(encoding="utf-8"))}
notes = json.loads(notes_path.read_text(encoding="utf-8")) if notes_path.exists() else {}
new = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
today = (datetime.now(timezone.utc) + timedelta(hours=9)).strftime("%Y-%m-%d")
added = 0
KINDS = {"fall", "caught", "crush", "gas", "shock", "explosion", "fire", "leak", "struck", "vehicle"}
for k, v in new.items():
    if k not in feed_ids:
        print("건너뜀(피드에 없는 id):", k)
        continue
    if isinstance(v, str):
        v = {"summary": v}
    summary = " ".join(str(v.get("summary", "")).split())
    if len(summary) < 40:
        print("건너뜀(요약이 너무 짧음):", k)
        continue
    entry = {"summary": summary, "checked": today}
    url = str(v.get("url", "")).strip()
    if url.startswith("http") and "news.google.com" not in url:
        entry["url"] = url
    tags = [str(t).strip().lstrip("#") for t in v.get("tags", []) if str(t).strip()][:4]
    if tags:
        entry["tags"] = tags
    if v.get("kind") in KINDS:
        entry["kind"] = v["kind"]
    notes[k] = entry
    added += 1
notes_path.write_text(json.dumps(notes, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"추가 {added}건, 전체 {len(notes)}건")
