import { UtmParams } from '../hooks/useUtm/useUtmTypes'

/**
 * リファラーからUTMパラメータを検出する
 * @returns 検出されたUTMパラメータ
 */
export function detectReferrer(): UtmParams {
  // SSR時やリファラーが存在しない場合は空のオブジェクトを返す
  if (typeof document === 'undefined' || !document.referrer) {
    return {}
  }

  try {
    const referrerUrl = new URL(document.referrer)
    const hostname = referrerUrl.hostname.toLowerCase()
    // Google検索からの場合
    if (hostname === 'google.co.jp' || hostname.endsWith('.google.co.jp') ||
      hostname === 'google.com' || hostname.endsWith('.google.com')) {
      return {
        utm_source: 'google',
        utm_medium: 'organic',
        utm_campaign: 'search'
      }
    }

    // Yahoo検索からの場合（日本のみ）
    if (hostname === 'yahoo.co.jp' || hostname.endsWith('.yahoo.co.jp') ||
      hostname === 'search.yahoo.co.jp') {
      return {
        utm_source: 'yahoo',
        utm_medium: 'organic',
        utm_campaign: 'search'
      }
    }

    // Bing/MSN検索からの場合
    if (hostname === 'bing.com' || hostname.endsWith('.bing.com') ||
      hostname === 'search.msn.com') {
      return {
        utm_source: 'msa',
        utm_medium: 'organic',
        utm_campaign: 'search'
      }
    }

    // 検索エンジン以外のリファラーの場合は空のオブジェクトを返す
    return {}
  } catch (e) {
    console.error('リファラーの解析中にエラーが発生しました:', e)
    return {}
  }
}
