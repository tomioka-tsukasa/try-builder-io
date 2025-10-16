# Figma MCP ページ実装ガイド

ページ実装時に特化したガイドです。
必ず `./figma-common-guide.md` を先に参照してください。

**変数定義** : 下記の変数は置き換えて書類を読んでください。

<!--
変数定義:
- DIR_COMMON_COMPONENTS: /src/components/
- DIR_PAGE_COMPONENTS: /src/pages/**/components/
- DIR_PAGE_DIRECTORY: /src/pages/
- DIR_ROUTE_DEFINE: src/store/directory/directory.ts
- DIR_ROUTE: src/routes/routes.tsx
-->

## 事前確認

### 既存UIコンポーネント確認
```bash
ls -la DIR_COMMON_COMPONENTS
```

**目的**: 利用可能なコンポーネントの把握、実装工数の削減

### ページディレクトリ構造確認
```bash
ls -la DIR_PAGE_DIRECTORY
```

## ページ実装設計

### 1. 使用コンポーネントの決定
- 既存の DIR_COMMON_COMPONENTS コンポーネントで対応可能な部分
- ページ固有で新規作成が必要な部分
- 複数コンポーネントの組み合わせが必要な部分

### 2. DIR_PAGE_COMPONENTS フォルダに配置する場合
- そのページでのみ使用される固有のコンポーネント
- ページの構造に強く依存する要素
- セクション単位の大きなコンポーネント

## ルーティング・メタデータ設定

### ルート定義
DIR_ROUTE_DEFINE での設定:

```typescript
export const SLUGS = {
  // 既存ルート...
  NEW_PAGE: '/new-page',
} as const

export const DM = {
  // 既存ルート...
  NEW_PAGE: `${ROOT}${SLUGS.NEW_PAGE}`,
} as const
```

### ルーティング登録
DIR_ROUTE での設定:

```typescript
import NewPage from '@/pages/new-page/NewPage'

export const AppRoutes = () => {
  return (
    <BrowserRouter basename={BASE_ROOT}>
      <Routes>
        <Route element={<Layout />}>
          {/* 既存ルート... */}
          <Route path={DM.NEW_PAGE} element={<NewPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
```

### メタデータ設定
DIR_ROUTE_DEFINE での設定:

```typescript
export const ROUTES_META = {
  // 既存メタデータ...
  NEW_PAGE: {
    meta: {
      title: 'ページタイトル',
      description: 'ページ説明',
      canonicalUrl: 'https://example.com/new-page',
      ogType: 'website',
      ogTitle: 'OGタイトル',
      ogSiteName: 'サイト名',
      ogDescription: 'OG説明',
      twitterCard: 'summary_large_image',
      ogImage: '/path/to/ogimage.jpg'
    }
  }
} as const
```
