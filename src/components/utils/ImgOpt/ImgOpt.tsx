import React, { useEffect, useState } from 'react'
import { imgStyle } from './ImgOpt.css'
import { getOptimalImagePath, getSupportedFormats } from './ImgOptUtils'

// SPデバイス用のメディアクエリ
const SP_MEDIA_QUERY = 'screen and (max-width: 500px)'

// ImgOpt コンポーネントのプロパティ型定義
export type ImgOptProps = {
  src: string;           // PC/デフォルト用の画像パス
  srcSp?: string;        // SP用の画像パス
  alt?: string;          // 代替テキスト
  width?: number | string; // 画像の幅
  height?: number | string; // 画像の高さ
  className?: string;    // 追加のクラス名
} & Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'width' | 'height'>;

/**
 * ImgOpt コンポーネント
 * 
 * 画像を最適化して表示するためのコンポーネント
 * AVIF, WebP, オリジナル(PNG/JPG)のフォーマットに対応
 * SVGにも対応
 * レスポンシブ対応（srcSp指定時）
 */
export function ImgOpt({
  src,
  srcSp,
  alt = '',
  width,
  height,
  className,
  ...props
}: ImgOptProps): React.ReactElement | null {
  // 画像URLの状態
  const [imageSrc, setImageSrc] = useState<string>('')
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [isReady, setIsReady] = useState<boolean>(false)

  // メディアクエリのチェック
  useEffect(() => {
    const mql = window.matchMedia(SP_MEDIA_QUERY)
    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
    }

    setIsMobile(mql.matches)
    mql.addEventListener('change', handleChange)

    return () => {
      mql.removeEventListener('change', handleChange)
    }
  }, [])

  // 最初のマウント時に画像パスを設定
  useEffect(() => {
    // 現在のデバイスに適した画像パス
    const currentSrc = isMobile && srcSp ? srcSp : src

    // すでにフォーマット情報が利用可能ならすぐに画像パスを設定
    const formats = getSupportedFormats((availableFormats) => {
      // コールバックで結果が返ってきたら画像パスを設定
      const optimalSrc = getOptimalImagePath(currentSrc, availableFormats)
      setImageSrc(optimalSrc)
      setIsReady(true)
    })

    // フォーマット情報がすでに利用可能ならすぐに設定
    if (formats) {
      const optimalSrc = getOptimalImagePath(currentSrc, formats)
      setImageSrc(optimalSrc)
      setIsReady(true)
    }
  }, [src, srcSp, isMobile])

  // デバイスやsrcが変更された場合
  useEffect(() => {
    // 初期化前なら何もしない
    if (!isReady) return

    // 現在のデバイスに適した画像パス
    const currentSrc = isMobile && srcSp ? srcSp : src

    // フォーマット情報は既に取得済みのはず
    const formats = getSupportedFormats()
    if (formats) {
      const optimalSrc = getOptimalImagePath(currentSrc, formats)
      setImageSrc(optimalSrc)
    }
  }, [src, srcSp, isMobile, isReady])

  // 画像URLが準備できるまで何も表示しない
  if (!isReady || !imageSrc) {
    return null
  }

  // 画像を表示
  return (
    <img
      // src={imageSrc}
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`${imgStyle} ${className || ''}`}
      {...props}
    />
  )
}

export default ImgOpt
