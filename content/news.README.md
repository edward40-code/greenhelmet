# 운영자 등록 소식 (content/news.json)

자동 수집(고용노동부)이 닿지 않는 소식을 직접 넣는 파일입니다. 한 건 예시:

```json
{
  "id": "2026-11-20-me-air",
  "title": "기사·보도자료 제목 그대로",
  "url": "https://원문 주소",
  "source": "환경부",
  "date": "2026-11-20",
  "kind": "보도자료",
  "field": "env",
  "summary": "직접 쓴 1~2줄 요약. 기사 본문을 옮기지 않습니다."
}
```

- field: safety(산업안전), health(보건), env(환경), chem(화학물질), fire(소방·위험물), const(건설안전), common(공통)
- kind: 보도자료, 사고속보, 입법·행정예고, 정책자료, 업계 동향 등 자유롭게
