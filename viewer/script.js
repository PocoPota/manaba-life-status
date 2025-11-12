// status.jsonの読み込み
fetch('../status.json', {
  cache: 'no-store',
  headers: {
    'Cache-Control': 'no-cache'
  }
})
  .then(response => response.json())
  .then(data => {
    const lastAccessDate = new Date(data.lastEvent.ts);
    document.getElementById('lastAccess').textContent = lastAccessDate.toLocaleString('ja-JP');
    document.getElementById('host').textContent = data.lastEvent.host;
  })
  .catch(error => {
    document.getElementById('lastAccess').textContent = 'エラー';
    document.getElementById('host').textContent = 'エラー';
    console.error('データの読み込みに失敗しました:', error);
  });

// heatmapデータの読み込みとuptime barの描画
async function loadUptimeData() {
  try {
    const currentYear = new Date().getFullYear();
    const response = await fetch(`../heatmaps/${currentYear}.json`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    const heatmapData = await response.json();

    renderUptimeBar(heatmapData.days);
  } catch (error) {
    document.getElementById('uptimeBar').textContent = 'データの読み込みに失敗しました';
    document.getElementById('uptimePercent').textContent = 'N/A';
    console.error('heatmapデータの読み込みに失敗しました:', error);
  }
}

function renderUptimeBar(daysData) {
  const uptimeBar = document.getElementById('uptimeBar');
  uptimeBar.innerHTML = '';

  // 最大値を取得（レベル分けに使用）
  const maxValue = Math.max(...Object.values(daysData).filter(v => v > 0), 1);

  // 件数からレベルを決定（0-4の5段階）
  function getLevel(value) {
    if (value === 0) return 0;
    const percent = (value / maxValue) * 100;
    if (percent <= 25) return 1;
    if (percent <= 50) return 2;
    if (percent <= 75) return 3;
    return 4;
  }

  // 過去365日分の日付を生成
  const days = [];
  const today = new Date();
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    days.push({
      date: dateStr,
      value: daysData[dateStr] || 0,
      hasData: daysData.hasOwnProperty(dateStr),
      dateObj: date
    });
  }

  // uptime率の計算
  const daysWithData = days.filter(d => d.hasData).length;
  const upDays = days.filter(d => d.value > 0).length;
  const uptimePercent = daysWithData > 0 ? ((upDays / daysWithData) * 100).toFixed(2) : 'N/A';
  document.getElementById('uptimePercent').textContent = `${uptimePercent}%`;

  // 最初の日の曜日を取得（0=日曜日, 1=月曜日, ...）
  const firstDay = days[0].dateObj.getDay();
  // 月曜日始まりにするため、日曜日なら6、月曜日なら0になるように調整
  const offset = firstDay === 0 ? 6 : firstDay - 1;

  // 最初の週の空白セルを追加
  for (let i = 0; i < offset; i++) {
    const emptyElement = document.createElement('div');
    emptyElement.className = 'uptime-day level-0';
    emptyElement.style.visibility = 'hidden';
    uptimeBar.appendChild(emptyElement);
  }

  // 各日の要素を作成
  days.forEach(day => {
    const dayElement = document.createElement('div');
    dayElement.className = 'uptime-day';

    let level;
    if (!day.hasData) {
      level = 0;
      dayElement.title = `${day.date}: データなし`;
    } else {
      level = getLevel(day.value);
      if (day.value > 0) {
        dayElement.title = `${day.date}: 稼働 (${day.value}件)`;
      } else {
        dayElement.title = `${day.date}: ダウン`;
      }
    }

    dayElement.classList.add(`level-${level}`);
    uptimeBar.appendChild(dayElement);
  });
}

// ページ読み込み時に実行
loadUptimeData();
