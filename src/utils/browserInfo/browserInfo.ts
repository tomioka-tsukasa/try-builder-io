import { APP_NAME, BROWSER, DEVICE_TYPE, OS } from './constants.ts'
import { BrowserInfo, BrowserInfoState } from './types.ts'

export const initialState: BrowserInfoState = {
  info: {
    os: OS.EMPTY,
    isWebView: false,
    browser: BROWSER.EMPTY,
    appName: APP_NAME.DEFAULT,
    webViewVersion: '',
    deviceType: DEVICE_TYPE.EMPTY,
    iosVersion: '',
  },
}

// ブラウザ側で実行する関数（クライアントサイドのみ）
export const detectTouchDevice = (): boolean => {
  if (typeof window !== 'undefined') {
    return window.navigator.maxTouchPoints > 1
  }
  return false
}

export const detectBrowser = (ua: string, hasMultiTouch: boolean = false): BrowserInfo => {
  let os: BrowserInfo['os'] = OS.EMPTY
  let isWebView = false
  let browser: BrowserInfo['browser'] = BROWSER.EMPTY
  let appName: BrowserInfo['appName'] = APP_NAME.DEFAULT
  const webViewVersion = ''
  let iosVersion = ''

  // 小文字変換したUA文字列を作成（文字列比較用）
  const uaLower = ua.toLowerCase()

  if (/(iPhone|iPad|iPod)/.test(ua)) {
    os = OS.IOS
    // iOS バージョンの検出
    const iosVersionMatch = ua.match(/OS (\d+)_(\d+)(?:_(\d+))?/i)
    if (iosVersionMatch) {
      const major = iosVersionMatch[1]
      iosVersion = major
    }
  } else if (/Android/.test(ua)) {
    os = OS.ANDROID
  } else if (/Macintosh/.test(ua)) {
    os = OS.MACOS
  } else if (/Windows/.test(ua)) {
    os = OS.WINDOWS
  }

  if (/(iPhone|iPad|iPod|Android).*AppleWebKit(?!.*Safari)/.test(ua)) {
    isWebView = true
  }
  // wvパラメータがある場合もWebViewとして検出
  if (uaLower.includes('wv')) {
    isWebView = true
  }

  if (/Chrome/.test(ua) || /CriOS/.test(ua)) {
    browser = BROWSER.CHROME
    appName = APP_NAME.CHROME
  } else if (/Edge/.test(ua)) {
    browser = BROWSER.EDGE
    appName = APP_NAME.EDGE
  } else if (/Firefox/.test(ua)) {
    browser = BROWSER.FIREFOX
    appName = APP_NAME.FIREFOX
  } else if (/Safari/.test(ua)) {
    browser = BROWSER.SAFARI
    appName = APP_NAME.SAFARI
  } else if (isWebView) {
    browser = BROWSER.WEBVIEW
  }

  // アプリ名の判定
  if (uaLower.includes('line')) {
    appName = APP_NAME.LINE
  } else if (uaLower.includes('fbav')) {
    appName = APP_NAME.FACEBOOK
  } else if (uaLower.includes('instagram')) {
    appName = APP_NAME.INSTAGRAM
  } else if (uaLower.includes('slack')) {
    appName = APP_NAME.SLACK
  } else if (uaLower.includes('twitter') || uaLower.includes('x-twitter')) {
    appName = APP_NAME.X
  }

  // デバイスタイプの判定を改善
  let deviceType: BrowserInfo['deviceType'] = DEVICE_TYPE.PC

  if (/iPad/.test(ua)) {
    // 通常のiPad
    deviceType = DEVICE_TYPE.TABLET
  } else if (/Macintosh/.test(ua) && hasMultiTouch) {
    // iPadOSはMacintoshのUAだが、複数のタッチポイントを持つ
    deviceType = DEVICE_TYPE.TABLET
  } else if (/Android/.test(ua) && !/Mobile/.test(ua)) {
    // Androidタブレット（Mobileキーワードがない場合はタブレット）
    deviceType = DEVICE_TYPE.TABLET
  } else if (/iPhone|Android.*Mobile|Mobile/.test(ua)) {
    // スマートフォン
    deviceType = DEVICE_TYPE.SP
  }

  const result = { os, isWebView, browser, appName, webViewVersion, deviceType, iosVersion }
  return result
}

export const getBrowserInfo = (ua: string): BrowserInfo => {
  const hasMultiTouch = typeof window !== 'undefined' ? detectTouchDevice() : false

  return detectBrowser(ua, hasMultiTouch)
}
