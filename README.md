# Manaba Life Status

manabaの稼働状況を記録・可視化するプロジェクト

## ログファイル構成
```
/
├─ status.json
├─ heatmaps/
│   ├─ 2025.json
│   └─ 2026.json
├─ logs/
│   ├─ 2025-10.ndjson
│   ├─ 2025-11.ndjson
│   └─ ...
├─ scripts/
│   ├─ logger.js
│   └─ utils.js
└─ viewer/
    ├─ index.html
    ├─ app.js
    ├─ styles.css
    └─ ...
```

## ログファイルサンプル

### `status.json`
```json
{
  "v": 1,
  "lastEvent": {
    "ts": 1730007200000,
    "host": "manaba.tsukuba.ac.jp"
  },
  "generatedAt": 1730007200000
}
```

### `logs/YYYY-MM.ndjson`
```json
{"v":1,"ts":1730000100000,"host":"manaba.tsukuba.ac.jp","id":"1730000100000-xyz12"}
{"v":1,"ts":1730003700000,"host":"manaba.tsukuba.ac.jp","id":"1730003700000-q9fmz"}
{"v":1,"ts":1730007200000,"host":"manaba.tsukuba.ac.jp","id":"1730007200000-8ak2c"}
```

### `heatmaps/YYYY.json`
```json
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

## 使い方

### GitHub Actions経由で実行

#### 1. Personal Access Tokenの作成

1. GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token (classic)" をクリック
3. `repo` スコープを選択
4. トークンをコピー

#### 2. API経由でトリガー

```bash
curl -X POST \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Authorization: token YOUR_PERSONAL_ACCESS_TOKEN" \
  https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/dispatches \
  -d '{
    "event_type": "update-status",
    "client_payload": {
      "timestamp": "1761651197060",
      "host": "manaba.tsukuba.ac.jp"
    }
  }'
```

#### 3. GitHub UI経由で手動実行（テスト用）

1. リポジトリの "Actions" タブを開く
2. "Update Status" ワークフローを選択
3. "Run workflow" ボタンをクリック
4. タイムスタンプとホスト名を入力して実行
