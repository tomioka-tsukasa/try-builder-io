export const ROOT = '/'

export const BASE_ROOT = '/'

export const SLUGS = {
  TOP: 'top',
} as const

export const DM = {
  TOP: ROOT,
} as const

export const ROUTES_META = {
  TOP: {
    meta: {
      title: 'meta title',
      description: 'meta description',
      canonicalUrl: 'meta canonicalUrl',
      ogType: 'website',
      ogTitle: 'meta title',
      ogSiteName: 'meta title',
      ogDescription: 'meta ogDescription',
      twitterCard: 'summary_large_image',
      ogImage: '/'
    }
  },
  MORI_CORP_TEST_05: {
    meta: {
      title: '森ビル コンテンツライブラリ - Test 05',
      description: 'ムービー、グラフィック広告、ラジオ、出版物など森ビルの多様なコンテンツを紹介するページ',
      canonicalUrl: '/mori-corp-test-05',
      ogType: 'website',
      ogTitle: '森ビル コンテンツライブラリ - Test 05',
      ogSiteName: '森ビル',
      ogDescription: 'ムービー、グラフィック広告、ラジオ、出版物など森ビルの多様なコンテンツを紹介するページ',
      twitterCard: 'summary_large_image',
      ogImage: '/'
    }
  },
  FIGMA_COMPONENTS: {
    meta: {
      title: 'Figma Components - 確認ページ',
      description: 'Figmaから実装したコンポーネントの確認ページ',
      canonicalUrl: '/figma-components',
      ogType: 'website',
      ogTitle: 'Figma Components - 確認ページ',
      ogSiteName: 'Figma Components',
      ogDescription: 'Figmaから実装したコンポーネントの確認ページ',
      twitterCard: 'summary_large_image',
      ogImage: '/'
    }
  }
} as const
