/**
 * Google Tag Manager（GTM）設定用のユーティリティ関数
 */

// GTMスクリプトの初期化状態を追跡
let gtmInitialized = false

/**
 * Google Tag Managerを初期化
 * @param id GTMのコンテナID（例: 'GTM-XXXXXXX'）
 */
export const initializeGTM = (id: string): void => {
  // 既に初期化済みなら何もしない
  if (gtmInitialized) {
    return
  }

  // GTMの初期化フラグをオン
  gtmInitialized = true

  // GTMスクリプトを挿入
  const script = document.createElement('script')
  script.innerHTML = 'console.log(\'GTM sample script initialized.\')'

  document.head.appendChild(script)

  // GTM用のnoscriptタグをbodyに挿入
  const noscript = document.createElement('noscript')
  const iframe = document.createElement('iframe')
  // iframe.src = `https://www.googletagmanager.com/ns.html?id=${id}`
  console.log(`【google tag manager id: ${id}】検証のため、iframe.srcを設定していません。`)
  iframe.height = '0'
  iframe.width = '0'
  iframe.style.display = 'none'
  iframe.style.visibility = 'hidden'

  noscript.appendChild(iframe)
  document.body.insertBefore(noscript, document.body.firstChild)
}

/**
 * GTMデータレイヤーにイベントを送信
 * @param data データレイヤーに送信するデータオブジェクト
 */
export const pushToDataLayer = (data: Record<string, unknown>): void => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(data)
  } else {
    console.warn('GTM dataLayer is not available')
  }
}

// TypeScriptの型定義
declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}
