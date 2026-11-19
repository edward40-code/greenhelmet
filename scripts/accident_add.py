# 사고 요약을 content/accident-notes.json 에 합친다 (예약작업용)
# 실행: python scripts/accident_add.py <요약 JSON 파일>
#   입력 형식: {"acc-...": "요약 문장", ...}  (UTF-8)
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
for k, v in new.items():
    if k not in feed_ids:
        print("건너뜀(피드에 없는 id):", k)
        continue
    v = " ".join(str(v).split())
    if len(v) < 40:
        print("건너뜀(요약이 너무 짧음):", k)
        continue
    notes[k] = {"summary": v, "checked": today}
    added += 1
notes_path.write_text(json.dumps(notes, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"추가 {added}건, 전체 {len(notes)}건")
