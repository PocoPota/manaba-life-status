import path from 'path';
import {
  getYearFromTs,
  getYearMonthFromTs,
  getDateFromTs,
  getNow,
  generateShortId,
  readJsonFile,
  writeJsonFile,
  appendToFile
} from './utils.js';

/**
 * 最新のイベント情報でstatus.jsonを更新する
 * @param {number} ts - Unixタイムスタンプ（ミリ秒）
 * @param {string} host - ホスト名（例: "manaba.tsukuba.ac.jp"）
 */
export const statusLogger = async (ts, host) => {
  const statusPath = path.join(import.meta.dirname, '..', 'status.json');
  const statusData = {
    v: 1,
    lastEvent: { ts, host },
    generatedAt: getNow()
  };
  await writeJsonFile(statusPath, statusData);
};

/**
 * 月次NDJSONログファイルに新しいログエントリを追記する
 * @param {number} ts - Unixタイムスタンプ（ミリ秒）
 * @param {string} host - ホスト名（例: "manaba.tsukuba.ac.jp"）
 */
export const logLogger = async (ts, host) => {
  const yearMonth = getYearMonthFromTs(ts);
  const logPath = path.join(import.meta.dirname, '..', 'logs', `${yearMonth}.ndjson`);
  const id = `${ts}-${generateShortId()}`;
  const logEntry = { v: 1, ts, host, id };
  await appendToFile(logPath, JSON.stringify(logEntry));
};

/**
 * 新しいイベントで年次ヒートマップデータを更新する
 * @param {number} ts - Unixタイムスタンプ（ミリ秒）
 */
export const heatmapLogger = async (ts) => {
  const year = getYearFromTs(ts);
  const date = getDateFromTs(ts);
  const heatmapPath = path.join(import.meta.dirname, '..', 'heatmaps', `${year}.json`);

  let heatmapData = await readJsonFile(heatmapPath);

  if (!heatmapData) {
    heatmapData = {
      v: 1,
      year,
      days: {},
      updatedAt: getNow()
    };
  }

  heatmapData.days[date] = (heatmapData.days[date] || 0) + 1;
  heatmapData.updatedAt = getNow();

  await writeJsonFile(heatmapPath, heatmapData);
};
