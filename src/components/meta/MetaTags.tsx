import { useAppLocation } from '@/hooks/useAppLocation/useAppLocation'
import React, { useEffect } from 'react'
import { updateCanonical, updateNameMeta, updatePropertyMeta, updateTitle } from './metaUtils'

type MetaTagsProps = {
  meta: {
    title: string;
    description: string;
    canonicalUrl: string;
    ogType?: string;
    ogTitle?: string;
    ogSiteName?: string;
    ogDescription?: string;
    ogImage?: string;
    twitterCard?: string;
    customMeta?: Array<{ name: string; content: string }>;
  };
};

/**
 * メタタグを更新するコンポーネント
 * スラッグやメタ情報が変わるたびに更新されます
 */
function MetaTags({ meta }: MetaTagsProps): React.ReactNode {
  const { slug } = useAppLocation()

  // ページのメタ情報を更新
  useEffect(() => {
    // タイトルの更新
    updateTitle(meta.title)

    // カノニカルURL
    updateCanonical(meta.canonicalUrl)

    // 基本メタタグ
    updateNameMeta('description', meta.description)

    // OGPタグ
    updatePropertyMeta('og:type', meta.ogType || 'website')
    updatePropertyMeta('og:url', meta.canonicalUrl)
    updatePropertyMeta('og:title', meta.ogTitle || meta.title)
    updatePropertyMeta('og:site_name', meta.ogSiteName || meta.title)
    updatePropertyMeta('og:description', meta.ogDescription || meta.description)
    if (meta.ogImage) {
      updatePropertyMeta('og:image', meta.ogImage)
    }

    // Twitterタグ
    updateNameMeta('twitter:card', meta.twitterCard || 'summary_large_image')
    updateNameMeta('twitter:url', meta.canonicalUrl)
    updateNameMeta('twitter:title', meta.ogTitle || meta.title)
    updateNameMeta('twitter:description', meta.ogDescription || meta.description)
    if (meta.ogImage) {
      updateNameMeta('twitter:image', meta.ogImage)
    }

    // カスタムメタタグ
    meta.customMeta?.forEach(item => {
      updateNameMeta(item.name, item.content)
    })

  }, [meta, slug])

  return null
}

export default MetaTags
