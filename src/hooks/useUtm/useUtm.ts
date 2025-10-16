import { useState, useEffect, useCallback } from 'react'
import { UtmParams, UseUtmReturn } from './useUtmTypes'
import { getCurrentUtmParams, filterEmptyValues } from './initUtm'

/**
 * UTMパラメータを管理するカスタムフック
 * - UTMパラメータの状態を管理
 * - 外部/内部リンクへのUTMパラメータ付与
 * @returns UTMパラメータと関連するユーティリティ関数
 */
export function useUtm(): UseUtmReturn {
  // UTMパラメータの状態管理
  const [utmParams, setUtmParams] = useState<UtmParams>(getCurrentUtmParams())

  // アプリケーションの状態変更を監視して、UTMパラメータを更新
  useEffect(() => {
    // 初期状態を取得
    setUtmParams(getCurrentUtmParams())

    // カスタムイベントを使用してUTMパラメータの変更を監視
    const handleUtmChange = () => {
      setUtmParams(getCurrentUtmParams())
    }

    // グローバルなUTMパラメータの変更イベントを監視
    window.addEventListener('utm_params_changed', handleUtmChange)

    return () => {
      window.removeEventListener('utm_params_changed', handleUtmChange)
    }
  }, [])

  // 外部リンク用のUTMパラメータを付与する関数
  const withUtm = useCallback((url: string): string => {
    if (!url || Object.keys(filterEmptyValues(utmParams)).length === 0) {
      return url
    }

    try {
      const urlObj = new URL(url)

      // 既存のUTMパラメータを保持しつつ、不足しているパラメータを追加
      Object.entries(utmParams).forEach(([key, value]) => {
        if (value && !urlObj.searchParams.has(key)) {
          urlObj.searchParams.append(key, value)
        }
      })

      return urlObj.toString()
    } catch (e) {
      // 無効なURLの場合は元のURLを返す
      console.warn('Invalid URL:', url)
      return url
    }
  }, [utmParams])

  // 内部リンク用のUTMパラメータを付与する関数
  const preserveUtm = useCallback((path: string): string => {
    if (!path || Object.keys(filterEmptyValues(utmParams)).length === 0) {
      return path
    }

    // パスにUTMパラメータを追加
    const hasQueryParams = path.includes('?')
    let newPath = path

    const utmQueryParams = Object.entries(utmParams)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}=${encodeURIComponent(value!)}`)
      .join('&')

    if (utmQueryParams) {
      newPath += hasQueryParams ? `&${utmQueryParams}` : `?${utmQueryParams}`
    }

    return newPath
  }, [utmParams])

  // 外部リンクかどうかを判定する関数
  const isExternalUrl = useCallback((url: string): boolean => {
    if (!url) return false

    // 相対パスは内部リンク
    if (url.startsWith('/') || url.startsWith('#') || url.startsWith('.')) {
      return false
    }

    // プロトコル相対URLや絶対URLの場合
    try {
      // 現在のオリジンと比較
      const currentOrigin = window.location.origin
      const urlObj = new URL(url, currentOrigin)
      return urlObj.origin !== currentOrigin
    } catch (e) {
      return false
    }
  }, [])

  return {
    utmParams,
    withUtm,
    preserveUtm,
    isExternalUrl
  }
}
