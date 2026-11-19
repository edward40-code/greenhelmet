# 요약이 아직 없는 사고속보 목록을 출력한다 (예약작업용)
# 실행: python scripts/accident_todo.py
import json, sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parent.parent
feed = json.loads((ROOT / "content/feeds/accidents.json").read_text(encoding="utf-8"))
notes_path = ROOT / "content/accident-notes.json"
notes = json.loads(notes_path.read_text(encoding="utf-8")) if notes_path.exists() else {}
todo = [x for x in feed if x["id"] not in notes]
print(json.dumps([{"id": x["id"], "date": x["date"], "source": x["source"], "title": x["title"], "url": x["url"]} for x in todo], ensure_ascii=False, indent=1))
print(f"# 요약 없는 사고: {len(todo)}건 / 전체 {len(feed)}건", file=sys.stderr)
