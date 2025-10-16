import { APP_NAME, BROWSER, DEVICE_TYPE, OS } from './constants'

export type BrowserInfo = {
  os: typeof OS[keyof typeof OS]
  isWebView: boolean
  browser: typeof BROWSER[keyof typeof BROWSER]
  appName: typeof APP_NAME[keyof typeof APP_NAME]
  webViewVersion: string
  deviceType: typeof DEVICE_TYPE[keyof typeof DEVICE_TYPE]
  iosVersion: string
}

export type BrowserInfoState = {
  info: BrowserInfo
}
