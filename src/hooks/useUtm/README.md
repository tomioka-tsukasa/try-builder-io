# UTMパラメータ管理システム

このディレクトリには、WebアプリケーションでのUTMパラメータ（トラッキングパラメータ）を包括的に管理するシステムが含まれています。

## 📁 ファイル構成

- `initUtm.ts` - UTMパラメータの初期化と管理の中核ロジック
- `useUtm.ts` - React用のカスタムフック（UI層での利用）
- `useUtmTypes.ts` - TypeScript型定義
- `README.md` - このドキュメント

## 🚀 initUtm.ts の主な機能

`initUtm.ts`は、UTMパラメータの**自動検出・設定・管理**を行う中核モジュールです。

### 1. UTMパラメータの自動検出と優先順位

UTMパラメータは以下の優先順位で検出・設定されます：

```typescript
// 1. URLクエリパラメータから直接取得（最優先）
const urlParams = new URLSearchParams(window.location.search)
const utmFromUrl: UtmParams = {
  utm_source: urlParams.get('utm_source') || undefined,
  utm_medium: urlParams.get('utm_medium') || undefined,
  utm_campaign: urlParams.get('utm_campaign') || undefined,
  utm_content: urlParams.get('utm_content') || undefined,
  utm_term: urlParams.get('utm_term') || undefined,
}
```

```typescript
// 2. リファラーから検出（検索エンジンからの流入を自動判定）
const utmFromReferrer = detectReferrer()
// Google検索 → utm_source: 'google', utm_medium: 'organic', utm_campaign: 'search'
// Yahoo検索 → utm_source: 'yahoo', utm_medium: 'organic', utm_campaign: 'search'
// Bing検索 → utm_source: 'msa', utm_medium: 'organic', utm_campaign: 'search'
```

```typescript
// 3. セッションストレージから復元（SPA遷移時の継続）
const storedUtm = getStoredUtm()
```

```typescript
// 4. デフォルト値の適用（フォールバック）
function getDefaultUtmParams(): UtmParams {
  return {
    utm_source: 'other',
    utm_medium: 'organic',
    utm_campaign: 'default'
  }
}
```

### 2. SPA（Single Page Application）対応

SPAでのページ遷移時もUTMパラメータを継続管理します：

```typescript
// 履歴APIの変更を監視（SPAでの画面遷移検出用）
const originalPushState = history.pushState
const originalReplaceState = history.replaceState

// pushStateをオーバーライド
history.pushState = function(...args) {
  originalPushState.apply(this, args)
  handleRouteChange() // UTMパラメータを再取得
}
```

### 3. URLへの自動適用

UTMパラメータを検出した場合、URLに自動的に追加します：

```typescript
function applyUtmParamsToUrl(params: UtmParams): void {
  const url = new URL(window.location.href)
  const currentParams = new URLSearchParams(url.search)
  
  // UTMパラメータをURLに追加
  Object.entries(params).forEach(([key, value]) => {
    if (value && !currentParams.has(key)) {
      currentParams.set(key, value)
    }
  })
  
  // URLを更新（履歴に残さないようにreplaceStateを使用）
  window.history.replaceState({}, '', url.toString())
}
```

### 4. セッション永続化

ブラウザセッション中でUTMパラメータを保持します：

```typescript
// セッションストレージに保存
export function storeUtm(params: UtmParams): void {
  try {
    sessionStorage.setItem('utm_params', JSON.stringify(params))
  } catch (e) {
    console.warn('Failed to store UTM params:', e)
  }
}

// セッションストレージから復元
export function getStoredUtm(): UtmParams {
  try {
    const stored = sessionStorage.getItem('utm_params')
    return stored ? JSON.parse(stored) : {}
  } catch (e) {
    return {}
  }
}
```

## 🔧 Exportされている関数と利用例

### `initUtm()`
**用途**: アプリケーション起動時の初期化

```typescript
// App.tsx や main.tsx で呼び出し
import { initUtm } from './hooks/useUtm/initUtm'

// アプリケーション起動時に一度だけ実行
initUtm()
```

### `extractAndProcessUtm()`
**用途**: 手動でUTMパラメータを再取得したい場合

```typescript
import { extractAndProcessUtm } from './hooks/useUtm/initUtm'

// 特定のタイミングでUTMパラメータを再取得
extractAndProcessUtm()
```

### `getCurrentUtmParams()`
**用途**: 現在のUTMパラメータを取得

```typescript
import { getCurrentUtmParams } from './hooks/useUtm/initUtm'

// 現在のUTMパラメータを取得
const currentUtm = getCurrentUtmParams()
console.log(currentUtm) // { utm_source: 'google', utm_medium: 'organic', utm_campaign: 'search' }
```

### `updateUtmParams(params)`
**用途**: プログラム的にUTMパラメータを更新

```typescript
import { updateUtmParams } from './hooks/useUtm/initUtm'

// カスタムUTMパラメータを設定
updateUtmParams({
  utm_source: 'newsletter',
  utm_medium: 'email',
  utm_campaign: 'monthly'
})
```

### `applyUtmParamsToUrl(params)`
**用途**: UTMパラメータを現在のURLに手動で適用

```typescript
import { applyUtmParamsToUrl } from './hooks/useUtm/initUtm'

// 特定のUTMパラメータをURLに追加
applyUtmParamsToUrl({
  utm_source: 'newsletter',
  utm_medium: 'email',
  utm_campaign: 'weekly'
})
// URL例: https://example.com/?utm_source=newsletter&utm_medium=email&utm_campaign=weekly
```

### `filterEmptyValues(obj)`
**用途**: 空の値を除外したオブジェクトを作成

```typescript
import { filterEmptyValues } from './hooks/useUtm/initUtm'

const dirtyParams = {
  utm_source: 'google',
  utm_medium: '',
  utm_campaign: undefined,
  utm_content: 'banner'
}

const cleanParams = filterEmptyValues(dirtyParams)
// 結果: { utm_source: 'google', utm_content: 'banner' }
```

## 🎯 利用ケース

### 1. マーケティングキャンペーンの効果測定
```typescript
// URL: https://example.com/?utm_source=facebook&utm_medium=social&utm_campaign=summer2024
// → 自動的にUTMパラメータが検出・保存される
```

### 2. 検索エンジンからの流入分析
```typescript
// Google検索から来た場合
// → 自動的に utm_source: 'google', utm_medium: 'organic' が設定される
```

### 3. SPAでの継続的なトラッキング
```typescript
// ページ遷移後もUTMパラメータが維持される
// /home → /products → /checkout
// 全てのページで同じUTMパラメータが利用可能
```

### 4. 外部リンクへのUTMパラメータ付与
```typescript
// useUtmフックと組み合わせて使用
const { withUtm } = useUtm()
const externalLink = withUtm('https://partner-site.com')
// 結果: https://partner-site.com?utm_source=google&utm_medium=organic&utm_campaign=search
```

## ⚠️ 注意事項

- **SSR対応**: `typeof window === 'undefined'` チェックでSSR環境でのエラーを防止
- **エラーハンドリング**: try-catch文でセッションストレージのエラーを適切に処理
- **履歴管理**: `replaceState`を使用してブラウザ履歴を汚染しない
- **パフォーマンス**: 50msの遅延でDOM更新後にUTMパラメータを再取得

## 🔗 関連ファイル

- `useUtm.ts` - Reactコンポーネントでの利用
- `detectReferrer.ts` - リファラー検出ロジック
- `useUtmTypes.ts` - TypeScript型定義
