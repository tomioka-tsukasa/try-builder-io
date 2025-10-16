import { detectReferrer } from '../../utils/detectReferrer'
import { UtmParams } from './useUtmTypes'

// グローバルなUTMパラメータ状態
let currentUtmParams: UtmParams = {}

/**
 * UTMパラメータの初期化と監視を設定
 */
export function initUtm(): void {
  console.log('UTMパラメータ管理を初期化')

  // SSR時はwindowが存在しないためチェック
  if (typeof window === 'undefined') return

  // 初期化処理
  extractAndProcessUtm()

  // SPAルーティング変更とブラウザの戻る/進むボタンの監視設定
  setupRouteChangeListener()
}

/**
 * URLからUTMパラメータを抽出して処理
 */
export function extractAndProcessUtm(): void {
  // URLからUTMパラメータを取得
  const urlParams = new URLSearchParams(window.location.search)
  const utmFromUrl: UtmParams = {
    utm_source: urlParams.get('utm_source') || undefined,
    utm_medium: urlParams.get('utm_medium') || undefined,
    utm_campaign: urlParams.get('utm_campaign') || undefined,
    utm_content: urlParams.get('utm_content') || undefined,
    utm_term: urlParams.get('utm_term') || undefined,
  }

  // URLにUTMパラメータが存在するか確認
  const hasUtmParamsInUrl = Object.values(utmFromUrl).some(value => value !== undefined)

  // URLにUTMパラメータが存在する場合は、それを保存して終了
  if (hasUtmParamsInUrl) {
    const filteredUtmFromUrl = filterEmptyValues(utmFromUrl)
    updateUtmParams(filteredUtmFromUrl)
    console.log('URLからUTMパラメータを取得しセッションに保存:', filteredUtmFromUrl)
    return
  }

  // リファラーからUTMパラメータを検出
  const utmFromReferrer = detectReferrer()

  // リファラーからUTMパラメータが取得できた場合は、それを保存して終了
  if (Object.keys(filterEmptyValues(utmFromReferrer)).length > 0) {
    const filteredUtmFromReferrer = filterEmptyValues(utmFromReferrer)
    updateUtmParams(filteredUtmFromReferrer)
    console.log('リファラーからUTMパラメータを取得しセッションに保存:', filteredUtmFromReferrer)
    return
  }

  // セッションストレージからUTMパラメータを取得
  const storedUtm = getStoredUtm()

  // セッションストレージにUTMパラメータが存在する場合は、それを使用
  if (Object.keys(filterEmptyValues(storedUtm)).length > 0) {
    const filteredStoredUtm = filterEmptyValues(storedUtm)
    updateUtmParams(filteredStoredUtm)
    console.log('セッションストレージからUTMパラメータを復元:', filteredStoredUtm)
    return
  }

  // どこからもUTMパラメータが取得できない場合はデフォルトのUTMパラメータを使用
  console.log('デフォルトUTMパラメーター適用')
  const defaultUtmParams = getDefaultUtmParams()
  updateUtmParams(defaultUtmParams)
}

/**
 * デフォルトのUTMパラメータを取得
 */
function getDefaultUtmParams(): UtmParams {
  return {
    utm_source: 'other',
    utm_medium: 'organic',
    utm_campaign: 'default'
  }
}

/**
 * SPAのルーティング変更を検知
 */
function setupRouteChangeListener(): void {
  // 履歴APIの変更を監視（SPAでの画面遷移検出用）
  const originalPushState = history.pushState
  const originalReplaceState = history.replaceState

  // pushStateをオーバーライド
  history.pushState = function (...args) {
    originalPushState.apply(this, args)
    handleRouteChange()
  }

  // replaceStateをオーバーライド
  history.replaceState = function (...args) {
    originalReplaceState.apply(this, args)
    handleRouteChange()
  }

  // ブラウザの戻る/進むボタンの検出
  window.addEventListener('popstate', () => {
    handleRouteChange()
  })
}

/**
 * ルート変更時の処理
 */
function handleRouteChange(): void {
  console.log('ルーティング変更を検知:', window.location.pathname + window.location.search)

  // 少し遅延させてからUTMパラメータを再取得（DOMの更新後に実行）
  setTimeout(() => {
    extractAndProcessUtm()
  }, 50)
}

/**
 * UTMパラメータをURLに適用する
 */
export function applyUtmParamsToUrl(params: UtmParams): void {
  // 現在のURLを取得
  const url = new URL(window.location.href)
  const currentParams = new URLSearchParams(url.search)
  let hasChanges = false

  // UTMパラメータをURLに追加
  Object.entries(params).forEach(([key, value]) => {
    if (value && !currentParams.has(key)) {
      currentParams.set(key, value)
      hasChanges = true
    }
  })

  // URLが変更された場合のみURLを更新
  if (hasChanges) {
    url.search = currentParams.toString()

    // URLを更新（履歴に残さないようにreplaceStateを使用）
    window.history.replaceState({}, '', url.toString())
    console.log('URLにUTMパラメータを適用:', url.toString())
  }
}

/**
 * UTMパラメータを更新
 */
export function updateUtmParams(params: UtmParams): void {
  // パラメータが変更された場合のみイベントを発行
  const hasChanged = !isEqual(currentUtmParams, params)

  currentUtmParams = { ...params }
  storeUtm(params)

  if (hasChanged) {
    // UTMパラメータが変更されたことを通知するカスタムイベントを発行
    const event = new CustomEvent('utm_params_changed', {
      detail: { utmParams: currentUtmParams }
    })
    window.dispatchEvent(event)
    console.log('UTMパラメータ変更イベント発行:', currentUtmParams)
  }
}

/**
 * 2つのオブジェクトが等しいか比較
 */
function isEqual(obj1: any, obj2: any): boolean {
  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false
  }

  for (const key in obj1) {
    if (obj1[key] !== obj2[key]) {
      return false
    }
  }

  return true
}

/**
 * 現在のUTMパラメータを取得
 */
export function getCurrentUtmParams(): UtmParams {
  return { ...currentUtmParams }
}

/**
 * セッションストレージからUTMパラメータを取得
 */
export function getStoredUtm(): UtmParams {
  try {
    const stored = sessionStorage.getItem('utm_params')
    return stored ? JSON.parse(stored) : {}
  } catch (e) {
    return {}
  }
}

/**
 * UTMパラメータをセッションストレージに保存
 */
export function storeUtm(params: UtmParams): void {
  try {
    sessionStorage.setItem('utm_params', JSON.stringify(params))
  } catch (e) {
    console.warn('Failed to store UTM params:', e)
  }
}

/**
 * オブジェクトから空の値を除外
 */
export function filterEmptyValues(obj: Record<string, string | undefined>): Record<string, string> {
  return Object.entries(obj)
    .filter(([_, v]) => v !== undefined && v !== null && v !== '')
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v as string }), {})
}
