import React, { useEffect } from 'react'
import { initializeGTM } from './gtmUtils'

type GoogleTagManagerProps = {
  id: string;
}

/**
 * Google Tag Manager初期化用コンポーネント
 * アプリのルートレベルで一度だけマウントされ、スクリプトを初期化します
 */
const GoogleTagManager: React.FC<GoogleTagManagerProps> = ({ id }) => {
  useEffect(() => {
    // GTMの初期化（一度だけ実行される）
    if (typeof window !== 'undefined') {
      initializeGTM(id)
    }
  }, [id])

  return null
}

export default GoogleTagManager
