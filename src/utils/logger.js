/**
 * ログ管理ユーティリティ (GAS連携版)
 */

const STORAGE_KEY = 'nluigui_logs_v1'
const SESSION_START_TIME = Date.now()

// --- 【重要】ここを書き換えてください ---
// 先ほど発行された「ウェブアプリ URL」をこの中に入れます
const GAS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbwC8gpKC0qvrV9ii09ueaGZAwC5i_qRnxttFZxcZVF0u1P3VgVGB657Nhw45eQeROCC/exec' 

/**
 * デバイス情報を取得する
 */
function getDeviceInfo() {
  return navigator.userAgent
}

/**
 * 画面サイズを取得する
 */
function getScreenSize() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

/**
 * 経過時間（ms）を取得する
 */
function getElapsedTimeMs() {
  return Date.now() - SESSION_START_TIME
}

/**
 * 経過時間（秒）を取得する
 */
function getElapsedTimeSec() {
  return Math.round(getElapsedTimeMs() / 10) / 100
}

/**
 * ログエントリを作成する
 */
function createLogEntry(logData) {
  const screenSize = getScreenSize()
  const currentTime = new Date()

  return {
    id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    被験者名: logData.subjectName || '',
    画面名: logData.screenName || '',
    操作名: logData.actionName || '',
    ボタン名: logData.buttonName || '',
    入力テキスト: logData.inputText || '',
    入力文字: logData.inputChar || '',
    入力種別: logData.inputType || '',
    文字位置: logData.charIndex ?? '',
    入力後テキスト: logData.afterText || '',
    発生時刻: currentTime.toISOString(),
    経過時間_ms: getElapsedTimeMs(),
    経過時間_秒: getElapsedTimeSec(),
    画面幅: screenSize.width,
    画面高さ: screenSize.height,
    使用端末ブラウザ情報: getDeviceInfo(),
  }
}

/**
 * ログを保存し、クラウド(GAS)へ送信する
 */
export async function addLog(logData) {
  const entry = createLogEntry(logData)
  
  // 1. localStorageに保存（バックアップ）
  try {
    const logs = getAllLogs()
    logs.push(entry)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs))
  } catch (error) {
    console.error('Local save failed:', error)
  }

  // 2. クラウド(GAS)へ送信
  if (GAS_WEBAPP_URL && GAS_WEBAPP_URL !== 'ここにコピーしたURLを貼り付ける') {
    try {
      // 画面遷移に影響を与えないよう非同期で送信
      fetch(GAS_WEBAPP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      })
    } catch (error) {
      console.error('Cloud sync failed:', error)
    }
  }

  return entry
}

/**
 * すべてのログを取得する
 */
export function getAllLogs() {
  try {
    const logsJson = localStorage.getItem(STORAGE_KEY)
    return logsJson ? JSON.parse(logsJson) : []
  } catch (error) {
    console.error('ログの取得に失敗しました:', error)
    return []
  }
}

/**
 * すべてのログを削除する
 */
export function clearAllLogs() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch (error) {
    return false
  }
}

/**
 * ログをCSV形式に変換する（BOM付き）
 */
export function convertLogsToCSV(logs) {
    const headers = [
  'ID',
  '被験者名',
  '画面名',
  '操作名',
  'ボタン名',
  '入力テキスト',

  '入力文字',
  '入力種別',
  '文字位置',
  '入力後テキスト',

  '発生時刻',
  '経過時間_ms',
  '経過時間_秒',
  '画面幅',
  '画面高さ',
  '使用端末'
  ]
  
  const escapeCSV = (field) => {
    const str = String(field)
    if (str.includes('"') || str.includes(',') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

const rows = logs.map(log => [
  log.id,
  log.被験者名,
  log.画面名,
  log.操作名,
  log.ボタン名,
  log.入力テキスト,

  // 追加
  log.入力文字,
  log.入力種別,
  log.文字位置,
  log.入力後テキスト,

  log.発生時刻,
  log.経過時間_ms,
  log.経過時間_秒,
  log.画面幅,
  log.画面高さ,
  log.使用端末ブラウザ情報
])

  const BOM = '\uFEFF'
  const csvContent = [headers, ...rows].map(r => r.map(escapeCSV).join(',')).join('\r\n')
  return BOM + csvContent
}

/**
 * ログをCSVファイルとしてダウンロードする
 */
export function downloadLogsAsCSV(logs, filename) {
  const csv = convertLogsToCSV(logs)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  
  if (!filename) {
    filename = `logs_${new Date().getTime()}.csv`
  }

  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function getLogCount() { return getAllLogs().length }
export function getSessionStartTime() { return SESSION_START_TIME }
