// 対応フォーマットの型定義
export type SupportedFormats = {
  avif: boolean;
  webp: boolean;
};

// 初期化状態の型定義
type FormatCheckState = {
  isChecking: boolean;
  formats: SupportedFormats | null;
  error: Error | null;
};

// 初期化状態（シングルトンパターン）
const state: FormatCheckState = {
  isChecking: false,
  formats: null,
  error: null
}

// フォーマットチェック完了時のコールバックを登録するための配列
const callbacks: ((formats: SupportedFormats) => void)[] = []

/**
 * Safariブラウザかどうかを検出する関数
 * @returns Safariブラウザの場合はtrue、それ以外はfalse
 */
const isSafari = (): boolean => {
  if (typeof window === 'undefined') return false
  const ua = window.navigator.userAgent
  return ua.includes('Safari') && !ua.includes('Chrome') && !ua.includes('Edg')
}

/**
 * Chromeブラウザかどうかを検出する関数
 * @returns Chromeブラウザの場合はtrue、それ以外はfalse
 */
const isChrome = (): boolean => {
  if (typeof window === 'undefined') return false
  const ua = window.navigator.userAgent
  return ua.includes('Chrome') && !ua.includes('Edg')
}

/**
 * Safariのバージョンを取得する関数（詳細）
 * @returns {major: number, minor: number} メジャーとマイナーバージョン
 */
const getSafariVersionDetailed = (): { major: number, minor: number } => {
  if (!isSafari() || typeof window === 'undefined') return { major: 0, minor: 0 }

  const ua = window.navigator.userAgent
  const versionMatch = ua.match(/Version\/(\d+)\.(\d+)/)

  if (versionMatch && versionMatch.length >= 3) {
    return {
      major: parseInt(versionMatch[1], 10),
      minor: parseInt(versionMatch[2], 10)
    }
  }

  return { major: 0, minor: 0 }
}

/**
 * Chromeのバージョンを取得する関数
 * @returns バージョン番号または0（検出できない場合）
 */
const getChromeVersion = (): number => {
  if (!isChrome() || typeof window === 'undefined') return 0

  const ua = window.navigator.userAgent
  const versionMatch = ua.match(/Chrome\/(\d+)\.(\d+)/)

  if (versionMatch && versionMatch.length >= 2) {
    return parseInt(versionMatch[1], 10)
  }

  return 0
}

/**
 * 特定の画像タイプがサポートされているかチェックする関数
 * @param type MIMEタイプ（例: 'image/avif'）
 * @returns サポートされていればtrue、されていなければfalse
 */
const checkImageTypeSupport = (type: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // ブラウザ環境でない場合はfalseを返す
    if (typeof window === 'undefined') {
      resolve(false)
      return
    }

    // ブラウザベースの検出（より信頼性が高い）
    if (type === 'image/avif') {
      // Safariの場合
      if (isSafari()) {
        const version = getSafariVersionDetailed()
        // Safari 16.4以降はAVIFをサポート
        if (version.major > 16 || (version.major === 16 && version.minor >= 4)) {
          console.log(`Safari ${version.major}.${version.minor} を検出: AVIFをサポート`)
          resolve(true)
          return
        } else if (version.major > 0) {
          console.log(`Safari ${version.major}.${version.minor} を検出: AVIFを非サポート`)
          resolve(false)
          return
        }
      }

      // Chromeの場合
      if (isChrome()) {
        const chromeVersion = getChromeVersion()
        // Chrome 85以降はAVIFをサポート
        if (chromeVersion >= 85) {
          console.log(`Chrome ${chromeVersion} を検出: AVIFをサポート`)
          resolve(true)
          return
        }
      }
    }

    // 機能検出による方法（フォールバック）
    console.log(`画像検出開始: ${type}`)

    // 機能検出1: Canvas経由でのチェック（最も信頼性が高い）
    if (type === 'image/avif' && typeof document !== 'undefined') {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = 1
        canvas.height = 1
        const canSupport = canvas.toDataURL(type).indexOf(`data:${type}`) === 0
        if (canSupport) {
          console.log(`Canvas検出: ${type} サポート`)
          resolve(true)
          return
        } else {
          console.log(`Canvas検出: ${type} 非サポート`)
        }
      } catch (e) {
        console.log(`Canvas検出エラー: ${e}`)
      }
    }

    // 機能検出2: Image要素経由でのチェック（フォールバック）
    const img = new Image()
    img.onload = () => {
      console.log(`画像読み込み成功: ${type}`)
      // 画像の幅が1pxあれば正常にロードされたとみなす
      if (img.width === 1) {
        resolve(true)
      } else {
        console.log(`画像サイズ異常: 幅=${img.width}px`)
        resolve(false)
      }
    }
    img.onerror = () => {
      console.log(`画像読み込み失敗: ${type}`)
      resolve(false)
    }

    // 実際の1x1透明画像のデータ
    if (type === 'image/avif') {
      // 実際のAVIF形式の1x1透明画像
      img.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK'
    } else if (type === 'image/webp') {
      // 実際のWebP形式の1x1透明画像
      img.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA=='
    } else {
      // その他の形式
      img.src = `data:${type};base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=`
    }
  })
}

/**
 * パスにベースパスを適用する関数
 * @param path 元のパス
 * @returns ベースパスが適用されたパス
 */
export const applyBasePath = (path: string): string => {
  // 既に完全なURLの場合はそのまま返す（http://やhttps://から始まる場合）
  if (path.match(/^https?:\/\//)) {
    return path
  }

  const baseUrl = import.meta.env.BASE_URL || '/'

  // パスが/で始まる場合、ベースパスを追加
  if (path.startsWith('/')) {
    // ベースパスが/で終わる場合とパスが/で始まる場合の重複を避ける
    const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
    return `${base}${path}`
  }

  // 相対パスの場合はそのまま返す
  return path
}

/**
 * 最適な画像パスを取得する関数
 * @param imagePath 元の画像パス
 * @param formats サポートされているフォーマット情報
 * @returns 最適化された画像パス
 */
export const getOptimalImagePath = (imagePath: string, formats: SupportedFormats): string => {
  // ベースパスを適用
  const pathWithBase = applyBasePath(imagePath)

  // SVGの場合はそのまま返す
  if (pathWithBase.toLowerCase().endsWith('.svg')) {
    return pathWithBase
  }

  // 拡張子を除いたパス
  const lastDotIndex = pathWithBase.lastIndexOf('.')
  if (lastDotIndex === -1) {
    return pathWithBase // 拡張子がない場合
  }

  const basePath = pathWithBase.substring(0, lastDotIndex)

  // フォーマット対応に基づいて最適なパスを返す
  if (formats.avif) {
    return `${basePath}.avif`
  } else {
    // AVIFが非対応の場合は常にWebPを使用
    return `${basePath}.webp`
  }
}

/**
 * フォーマットチェックを実行する内部関数
 */
const checkFormats = async (): Promise<SupportedFormats> => {
  try {
    // ブラウザ環境でない場合（SSRなど）
    if (typeof window === 'undefined') {
      const defaultFormats = { avif: false, webp: true }
      state.formats = defaultFormats
      state.isChecking = false
      return defaultFormats
    }

    console.log('ブラウザ情報:', window.navigator.userAgent)

    if (isSafari()) {
      const version = getSafariVersionDetailed()
      console.log(`Safari検出: バージョン ${version.major}.${version.minor}`)
    } else if (isChrome()) {
      console.log(`Chrome検出: バージョン ${getChromeVersion()}`)
    } else {
      console.log('その他のブラウザを検出')
    }

    // AVIFのサポート状況のみをチェック（WebPは常にサポートしているとみなす）
    const isAvifSupported = await checkImageTypeSupport('image/avif')

    const formats = {
      avif: isAvifSupported,
      webp: true // WebPは常にサポートしているとみなす
    }

    console.log(`AVIF検出結果: ${isAvifSupported ? '✅ サポート' : '❌ 非サポート'}`)

    // 状態を更新
    state.formats = formats
    state.isChecking = false

    // 登録されたコールバックを呼び出し
    callbacks.forEach(callback => callback(formats))

    return formats
  } catch (error) {
    state.error = error instanceof Error ? error : new Error(String(error))
    state.isChecking = false
    throw error
  }
}

/**
 * サポートされている画像フォーマットを取得する関数
 * 結果が利用可能な場合は同期的に返し、チェック中の場合はコールバックを登録
 * @param callback フォーマットチェック完了時に呼び出されるコールバック
 * @returns フォーマット情報が利用可能な場合はその情報、それ以外はnull
 */
export const getSupportedFormats = (
  callback?: (formats: SupportedFormats) => void
): SupportedFormats | null => {
  // すでにフォーマット情報が利用可能ならそれを返す
  if (state.formats) {
    if (callback) {
      callback(state.formats)
    }
    return state.formats
  }

  // コールバックが指定されていればそれを登録
  if (callback) {
    callbacks.push(callback)
  }

  // チェックがまだ開始されていなければ開始
  if (!state.isChecking) {
    state.isChecking = true
    checkFormats().catch(console.error)
  }

  // チェック中の場合はnullを返す
  return null
}

/**
 * フォーマット検出をリセットして再チェックする関数
 */
export const resetFormatDetection = (): void => {
  state.formats = null
  state.isChecking = false
  state.error = null

  console.log('フォーマット検出をリセットしました')
  getSupportedFormats()
}

/**
 * 画像フォーマットのサポート状況をコンソールに出力する関数
 */
export const logSupportedFormats = (): void => {
  getSupportedFormats((formats) => {
    console.log('🖼️ サポートされている画像フォーマット:')
    console.log(`AVIF: ${formats.avif ? '✅ サポート' : '❌ 非サポート (WebPにフォールバック)'}`)
  })
}

// モジュールが読み込まれた時点でチェックを開始
getSupportedFormats()

// ブラウザ環境の場合にフォーマットサポート状況をログ出力
if (typeof window !== 'undefined') {
  logSupportedFormats()
}
