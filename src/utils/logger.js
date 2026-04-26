/**
 * ログ管理ユーティリティ
 * localStorageを使用してログを保存・管理する
 */

const STORAGE_KEY = 'nluigui_logs_v1'
const SESSION_START_TIME = Date.now()

/**
 * デバイス情報を取得する
 * @returns {string} ユーザーエージェント情報
 */
function getDeviceInfo() {
  return navigator.userAgent
}

/**
 * 画面サイズを取得する
 * @returns {Object} { width: number, height: number }
 */
function getScreenSize() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

/**
 * 経過時間（ミリ秒）を取得する
 * @returns {number} セッション開始からの経過時間（ミリ秒）
 */
function getElapsedTimeMs() {
  return Date.now() - SESSION_START_TIME
}

/**
 * 経過時間（秒）を取得する
 * @returns {number} セッション開始からの経過時間（秒、小数第2位で四捨五入）
 */
function getElapsedTimeSec() {
  return Math.round(getElapsedTimeMs() / 10) / 100
}

/**
 * ログエントリを作成する
 * @param {Object} logData - ログデータ
 * @param {string} logData.subjectName - 被験者名
 * @param {string} logData.screenName - 画面名
 * @param {string} logData.actionName - 操作名
 * @param {string} [logData.buttonName] - ボタン名
 * @param {string} [logData.inputText] - 入力テキスト
 * @returns {Object} ログエントリ
 */
function createLogEntry(logData) {
  const screenSize = getScreenSize()
  const currentTime = new Date()

  const entry = {
    id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    被験者名: logData.subjectName || '',
    画面名: logData.screenName || '',
    操作名: logData.actionName || '',
    ボタン名: logData.buttonName || '',
    入力テキスト: logData.inputText || '',
    発生時刻: currentTime.toISOString(),
    経過時間_ms: getElapsedTimeMs(),
    経過時間_秒: getElapsedTimeSec(),
    画面幅: screenSize.width,
    画面高さ: screenSize.height,
    使用端末ブラウザ情報: getDeviceInfo(),
  }

  return entry
}

/**
 * ログを保存する
 * @param {Object} logData - ログデータ（createLogEntry への引数と同じ形式）
 * @returns {Object} 保存されたログエントリ
 */
function addLog(logData) {
  try {
    const logs = getAllLogs()
    const entry = createLogEntry(logData)
    logs.push(entry)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs))
    return entry
  } catch (error) {
    console.error('ログの保存に失敗しました:', error)
    return null
  }
}

/**
 * すべてのログを取得する
 * @returns {Array} ログエントリの配列
 */
function getAllLogs() {
  try {
    const logsJson = localStorage.getItem(STORAGE_KEY)
    return logsJson ? JSON.parse(logsJson) : []
  } catch (error) {
    console.error('ログの取得に失敗しました:', error)
    return []
  }
}

/**
 * ログをIDで取得する
 * @param {string} id - ログエントリのID
 * @returns {Object|null} マッチしたログエントリ、または null
 */
function getLogById(id) {
  const logs = getAllLogs()
  return logs.find((log) => log.id === id) || null
}

/**
 * 被験者名でフィルタリングしたログを取得する
 * @param {string} subjectName - 被験者名
 * @returns {Array} マッチしたログエントリの配列
 */
function getLogsBySubjectName(subjectName) {
  const logs = getAllLogs()
  return logs.filter((log) => log.被験者名 === subjectName)
}

/**
 * 画面名でフィルタリングしたログを取得する
 * @param {string} screenName - 画面名
 * @returns {Array} マッチしたログエントリの配列
 */
function getLogsByScreenName(screenName) {
  const logs = getAllLogs()
  return logs.filter((log) => log.画面名 === screenName)
}

/**
 * 操作名でフィルタリングしたログを取得する
 * @param {string} actionName - 操作名
 * @returns {Array} マッチしたログエントリの配列
 */
function getLogsByActionName(actionName) {
  const logs = getAllLogs()
  return logs.filter((log) => log.操作名 === actionName)
}

/**
 * すべてのログを削除する
 * @returns {boolean} 成功したかどうか
 */
function clearAllLogs() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch (error) {
    console.error('ログの削除に失敗しました:', error)
    return false
  }
}

/**
 * 特定のIDのログを削除する
 * @param {string} id - ログエントリのID
 * @returns {boolean} 成功したかどうか
 */
function deleteLogById(id) {
  try {
    let logs = getAllLogs()
    logs = logs.filter((log) => log.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs))
    return true
  } catch (error) {
    console.error('ログの削除に失敗しました:', error)
    return false
  }
}

/**
 * ログの件数を取得する
 * @returns {number} ログの件数
 */
function getLogCount() {
  return getAllLogs().length
}

/**
 * ログを配列からCSV形式のテキストに変換する
 * @param {Array} logs - ログエントリの配列
 * @returns {string} CSV形式のテキスト（UTF-8 BOM付き）
 */
function convertLogsToCSV(logs) {
  if (!Array.isArray(logs) || logs.length === 0) {
    // ヘッダー行のみ（BOM付き）
    const headers = [
      'ID',
      '被験者名',
      '画面名',
      '操作名',
      'ボタン名',
      '入力テキスト',
      '発生時刻',
      '経過時間_ms',
      '経過時間_秒',
      '画面幅',
      '画面高さ',
      '使用端末ブラウザ情報',
    ]
    const BOM = '\uFEFF'
    return BOM + headers.map(escapeCSVField).join(',') + '\r\n'
  }

  // ヘッダー行
  const headers = [
    'ID',
    '被験者名',
    '画面名',
    '操作名',
    'ボタン名',
    '入力テキスト',
    '発生時刻',
    '経過時間_ms',
    '経過時間_秒',
    '画面幅',
    '画面高さ',
    '使用端末ブラウザ情報',
  ]

  // データ行
  const rows = logs.map((log) => [
    log.id || '',
    log.被験者名 || '',
    log.画面名 || '',
    log.操作名 || '',
    log.ボタン名 || '',
    log.入力テキスト || '',
    log.発生時刻 || '',
    log.経過時間_ms || '',
    log.経過時間_秒 || '',
    log.画面幅 || '',
    log.画面高さ || '',
    log.使用端末ブラウザ情報 || '',
  ])

  // BOM付きCSV作成
  const BOM = '\uFEFF'
  const csvContent =
    BOM +
    headers.map(escapeCSVField).join(',') +
    '\r\n' +
    rows.map((row) => row.map(escapeCSVField).join(',')).join('\r\n')

  return csvContent
}

/**
 * CSVフィールドをエスケープする（ダブルクォート、改行対応）
 * @param {string} field - エスケープ対象のフィールド
 * @returns {string} エスケープされたフィールド
 */
function escapeCSVField(field) {
  const strField = String(field)

  // ダブルクォート、カンマ、改行を含む場合は全体をクォートで囲む
  if (strField.includes('"') || strField.includes(',') || strField.includes('\n')) {
    return `"${strField.replace(/"/g, '""')}"` // 内部のダブルクォートをエスケープ
  }

  return strField
}

/**
 * ログをCSVファイルとしてダウンロードする
 * @param {Array} logs - ダウンロード対象のログエントリの配列
 * @param {string} [filename] - ダウンロードするファイル名（デフォルト: logs_YYYYMMDD_HHmmss.csv）
 */
function downloadLogsAsCSV(logs, filename) {
  const csv = convertLogsToCSV(logs)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  // デフォルトのファイル名を生成
  if (!filename) {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const date = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    filename = `logs_${year}${month}${date}_${hours}${minutes}${seconds}.csv`
  }

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * 現在のセッション開始時刻を取得する
 * @returns {number} セッション開始時刻（ミリ秒タイムスタンプ）
 */
function getSessionStartTime() {
  return SESSION_START_TIME
}

/**
 * ログの統計情報を取得する
 * @returns {Object} 統計情報
 */
function getLogStatistics() {
  const logs = getAllLogs()
  const subjectNames = new Set(logs.map((log) => log.被験者名))
  const screenNames = new Set(logs.map((log) => log.画面名))
  const actionNames = new Set(logs.map((log) => log.操作名))

  return {
    総ログ件数: logs.length,
    ユニークな被験者数: subjectNames.size,
    ユニークな画面数: screenNames.size,
    ユニークな操作数: actionNames.size,
    被験者一覧: Array.from(subjectNames),
    画面一覧: Array.from(screenNames),
    操作一覧: Array.from(actionNames),
  }
}

export {
  addLog,
  getAllLogs,
  getLogById,
  getLogsBySubjectName,
  getLogsByScreenName,
  getLogsByActionName,
  clearAllLogs,
  deleteLogById,
  getLogCount,
  convertLogsToCSV,
  downloadLogsAsCSV,
  getSessionStartTime,
  getLogStatistics,
  getElapsedTimeMs,
  getElapsedTimeSec,
  getScreenSize,
  getDeviceInfo,
}
