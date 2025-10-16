import { useAppLocation } from '@/hooks/useAppLocation/useAppLocation'
import { ROUTES_META } from '@/store/directory/directory'
import { MetaType, UseMetaReturn } from './types'

// ROUTES_METAのキー型
type RouteKeys = keyof typeof ROUTES_META;

// 対応するROUTES_METAキーを取得する関数
const getRouteKeyFromSlug = (slug: string | undefined): RouteKeys => {
  if (!slug) return 'TOP'

  // スラッグを大文字に変換
  const upperSlug = slug.toUpperCase() as RouteKeys

  // ROUTES_METAに存在するかチェック
  if (upperSlug in ROUTES_META) {
    return upperSlug
  }

  return 'TOP' // デフォルト値
}

// カスタムフック - 現在のページに応じたメタデータを返す
export const useMeta = (): UseMetaReturn => {
  const { slug } = useAppLocation()

  // slugからルートキーを取得
  const routeKey = getRouteKeyFromSlug(slug)

  // メタ情報を取得して型変換
  const meta = ROUTES_META[routeKey].meta as unknown as MetaType

  // 不足しているプロパティに初期値を設定
  const completeMetaData: MetaType = {
    title: meta.title || '',
    description: meta.description || '',
    canonicalUrl: meta.canonicalUrl || '',
    ogType: meta.ogType || 'website',
    ogTitle: meta.ogTitle || meta.title || '',
    ogSiteName: meta.ogSiteName || meta.title || '',
    ogDescription: meta.ogDescription || meta.description || '',
    ogImage: meta.ogImage || null,
    twitterCard: meta.twitterCard || 'summary_large_image',
    customMeta: meta.customMeta || []
  }

  return { meta: completeMetaData }
}
