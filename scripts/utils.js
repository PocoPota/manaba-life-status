import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

/**
 * タイムスタンプから年を抽出する
 * @param {number} ts - Unixタイムスタンプ（ミリ秒）
 * @returns {number} 年（例: 2025）
 */
export const getYearFromTs = (ts) => {
  return new Date(ts).getFullYear();
};

/**
 * タイムスタンプから年月文字列を抽出する
 * @param {number} ts - Unixタイムスタンプ（ミリ秒）
 * @returns {string} 年月文字列（例: "2025-10"）
 */
export const getYearMonthFromTs = (ts) => {
  const date = new Date(ts);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

/**
 * タイムスタンプから日付文字列を抽出する
 * @param {number} ts - Unixタイムスタンプ（ミリ秒）
 * @returns {string} 日付文字列（例: "2025-10-28"）
 */
export const getDateFromTs = (ts) => {
  const date = new Date(ts);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 現在のタイムスタンプを取得する
 * @returns {number} 現在のUnixタイムスタンプ（ミリ秒）
 */
export const getNow = () => Date.now();

/**
 * 短いランダムID（5文字）を生成する
 * @returns {string} 短いランダムID
 */
export const generateShortId = () => {
  return crypto.randomBytes(3).toString('base64').replace(/[+/=]/g, '').substring(0, 5);
};

/**
 * JSONファイルを読み込んでパースする
 * @param {string} filePath - JSONファイルのパス
 * @returns {Promise<object|null>} パースされたJSONデータ、ファイルが存在しない場合はnull
 * @throws {Error} ファイルは存在するが読み込みまたはパースできない場合
 */
export const readJsonFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
};

/**
 * JSONデータをファイルに書き込む（必要に応じてディレクトリを作成）
 * @param {string} filePath - JSONファイルのパス
 * @param {object} data - 書き込むデータ
 * @returns {Promise<void>}
 */
export const writeJsonFile = async (filePath, data) => {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

/**
 * ファイルに行を追記する（必要に応じてディレクトリとファイルを作成）
 * @param {string} filePath - ファイルのパス
 * @param {string} line - 追記する行（改行は自動的に追加される）
 * @returns {Promise<void>}
 */
export const appendToFile = async (filePath, line) => {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.appendFile(filePath, line + '\n', 'utf-8');
};
