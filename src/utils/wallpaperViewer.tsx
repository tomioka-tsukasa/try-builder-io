import { useEffect, useState } from 'react'

type WallpaperInfo = {
  id: string
  name: string
}

type Props = {
  /** 1〜9 を指定。想定外の値は無視して何も表示しない */
  type?: number
}

const wallpaperList: WallpaperInfo[] = [
  { id: 'wallpaper-1-Paed8is8', name: 'wallpaper-1' },
  { id: 'wallpaper-2-eizi7Nah', name: 'wallpaper-2' },
  { id: 'wallpaper-3-Ka1vei4b', name: 'wallpaper-3' },
  { id: 'wallpaper-4-ziu7shoZ', name: 'wallpaper-4' },
  { id: 'wallpaper-5-li7dis1A', name: 'wallpaper-5' },
  { id: 'wallpaper-6-Ye9AaZie', name: 'wallpaper-6' },
  { id: 'wallpaper-7-fiez8Aez', name: 'wallpaper-7' },
  { id: 'wallpaper-8-huru1ooM', name: 'wallpaper-8' },
  { id: 'wallpaper-9-keiCh5po', name: 'wallpaper-9' }
]

/**
 * `type` が指定された壁紙だけを動的 import で読み込む。
 * JPG は Vite が data:URI に変換して JS チャンク化。
 * 初回アクセス時のみそのチャンクがネットワーク要求される。
 */
export const WallpaperViewer = ({ type }: Props) => {
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    if (!type || type < 1 || type > wallpaperList.length) {
      setSrc(null)
      return
    }

    const { id } = wallpaperList[type - 1]

    // `?inline` で data:URI にインライン化
    import(`../assets/wallpapers/${id}.jpg?inline`)
      .then((mod: { default: string }) => {
        setSrc(mod.default)
      })
      .catch(() => {
        setSrc(null) // 読み込み失敗時
      })
  }, [type])

  if (!src) return null

  return <img src={src} alt={wallpaperList[(type ?? 1) - 1].name} />
}
