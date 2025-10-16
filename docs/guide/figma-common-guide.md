# Figma MCP 共通実装ガイド

コンポーネント実装・ページ実装に共通で参照すべきガイドです。

## 事前確認

### 既存デザインデータ確認
```bash
cat src/lib/figma-library/design-data.json
cat src/lib/figma-library/components.json
cat src/lib/figma-library/metadata.json
```

## Figmaデザイン取得・分析

### スクリーンショットで全体把握
```bash
mcp__figma-dev-mode-mcp-server__get_screenshot
```

### メタデータでノード構造確認
```bash
mcp__figma-dev-mode-mcp-server__get_metadata
```

### Code Connect情報確認（失敗しても続行）
```bash
mcp__figma-dev-mode-mcp-server__get_code_connect_map
```

### Figmaからコード生成
```bash
# 実装コードを取得（既存コンポーネント確認後）
mcp__figma-dev-mode-mcp-server__get_code
```

## 実装要件

### HTML構造
- セマンティックHTML構造で記述
- FigmaデザインデータとMCPのXMLデータから適切なHTML要素を選択
- ノード名から要素を推測：
  - `head` `heading` `見出し` → `<h1>` `<h2>` など
  - `button` `btn` `ボタン` → `<button>`
  - `nav` `navigation` → `<nav>`
  - `list` `ul` `ol` → `<ul>` `<ol>`

### React/TypeScript
- すべてのコンポーネントで `interface Props` による型定義
- HTMLに `data-name="[Figmaノード名]"` `data-node-id="[FigmaノードID]"` を付与
- 画像は `/src/components/utils/ImgOpt/ImgOpt.tsx` を使用

```typescript
interface ComponentProps {
  title: string;
  description?: string;
}

export default function Component({ title, description }: ComponentProps) {
  return (
    <div data-name="component" data-node-id="123:456">
      <h2>{title}</h2>
      <ImgOpt src="/path/to/image.png" alt={title} />
    </div>
  )
}
```

### スタイリング
- Vanilla Extract (.css.ts) でスタイル実装
- `/src/styles/colors.ts` のデザイントークン優先使用
- `/src/styles/responsive.config.ts` のブレークポイント使用
- 既存コンポーネントのスタイルパターンに準拠

#### 数値のレスポンシブ化

- 基本的に `px` の固定値ではなく `rvw()` を使用
- 詳細なガイドは @docs/responsive-style-guide.md を参照
```typescript
import { style } from '@vanilla-extract/css'
import { rvw } from '@/styles/responsive.css'

export const paragraph = style([
  {
    fontWeight: 'bold',
  },
  rvw.fontSize(16, 14),
  rvw.width(320, 240),
  rvw.padding([9, 24, 10], [6, 16, 7]),
])
```

#### line-height の特別な処理

**重要**: `line-height` は `rvw()` を使用せず、Figmaの数値を倍率に計算し直して指定する

```typescript
// ❌ 間違い
export const text = style([
  rvw.lineHeight(2.1, 2.1), // NG: rvwは使わない
])

// ✅ 正しい
export const text = style([
  {
    lineHeight: 1.5, // 倍率で指定（単位なし）
  },
  rvw.fontSize(16, 14),
])
```

**計算方法**: Figmaで `line-height: 32px` `font-size: 16px` が指定されていたら `line-height / font-size = 2.0` のように計算。

#### 禁止パターン
```typescript
// HTMLタグセレクターは使用禁止
export const container = style([
  {
    selectors: {
      '& p': { color: 'red' } // NG
    },
  },
])
```

#### 推奨パターン
```typescript
// 個別クラスで管理
export const container = style([
  {
    display: 'flex',
    flexDirection: 'column'
  },
])

export const text = style([
  {
    color: 'red',
  },
])
```

### SVGアイコン・画像実装ルール

**重要**: SVGコードも `.svg画像` としてダウンロードし、以下の手順で実装すること：

1. **MCPで取得したSVGファイルを使用**
   - `mcp__figma-dev-mode-mcp-server__get_code`で取得されたSVGファイルパスを確認
   - 例: `const iconSvg = "/path/to/icon.svg"`

2. **ImgOptコンポーネントで表示**
   ```typescript
   <ImgOpt
     src={iconSvg}
     alt="アイコン"
     className={styles.icon}
   />
   ```

3. **手動SVGコード禁止**
   - `<svg>`タグを直接記述しない
   - Figmaデザインとの完全一致を最優先とする

4. **スタイリング調整**
   - `ImgOpt`でサイズ・色調整が困難な場合のみ、CSSフィルターを使用
   - それでも困難な場合は実装方針を再検討

### Figmaライブラリデータ活用

#### デザイントークン参照パターン
```typescript
import { colors } from '@/styles/colors'

// カラー参照
backgroundColor: colors.basic.white
border: `1px solid ${colors.basic.medium}`
color: colors.green.medium
```

#### データ不足時の対処
- `colors.ts` にカラー情報がない場合：
  1. Figmaでライブラリカラー一覧セクションを選択
  2. `mcp__figma-dev-mode-mcp-server__get_variable_defs` 実行
  3. 取得データを `'@/lib/figma-library/design-data.json'` の `design_tokens.colors` に追加
  4. さらに適切な命名規則で `colors.ts` に追加

## 画像アセットの最適化
- 生成された画像パスを ImgOpt コンポーネントに置き換え
- 適切なalt属性の設定

## エラーハンドリング

### `get_variable_defs` エラー対処
- 「使用されている変数がない」→ ライブラリ変数を使用しているコンポーネントを選択

### `get_code` エラー対処
- 生成失敗 → ノードを小さな単位に分けて再実行
- ノードID無効 → `get_metadata` で有効ID確認

### `get_screenshot` エラー対処
- 画像取得失敗 → ノードの表示状態・サイズを確認
