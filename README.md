# Manaba Life Status
## ログファイル
### ログファイル構成
```
/
├─ status.json
├─ heatmap/
│   ├─ 2025.json
│   └─ 2026.json
├─ log/
│   ├─ 2025-10.ndjson
│   ├─ 2025-11.ndjson
│   └─ ... 
└─ viewer/
    ├─ index.html
    ├─ app.js
    ├─ styles.css
    └─ ...
```

### ログファイルサンプル
```status.json
{
  "v": 1,
  "lastEvent": {
    "ts": 1730007200000,
    "host": "manaba.tsukuba.ac.jp"
  },
  "generatedAt": 1730007200000
}
```

```log/YYYY-MM.ndjson
{"v":1,"ts":1730000100000,"host":"manaba.tsukuba.ac.jp","id":"1730000100000-xyz12"}
{"v":1,"ts":1730003700000,"host":"manaba.tsukuba.ac.jp","id":"1730003700000-q9fmz"}
{"v":1,"ts":1730007200000,"host":"manaba.tsukuba.ac.jp","id":"1730007200000-8ak2c"}
```

```heatmap/YYYY.json
{
  "v": 1,
  "year": 2025,
  "days": {
    "2025-10-01": 12,
    "2025-10-02": 0,
    "2025-10-03": 7
  },
  "updatedAt": 1730060000000
}
```