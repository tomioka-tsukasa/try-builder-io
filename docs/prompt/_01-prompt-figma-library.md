Figmaで選択中のカラー一覧をプロジェクトのスタイリングで扱えるように取得・加工してください。

## 手順

1. `/src/lib/figma-library/design-data.json` の存在確認

A. **存在しない場合:**
  - Figmaでライブラリカラー一覧セクションを選択
  - `mcp__figma-dev-mode-mcp-server__get_variable_defs` 実行
  - 取得データを `design_tokens.colors` 形式で `/src/lib/figma-library/design-data.json` に保存

B. **存在する場合:**
  - `/src/styles/colors.ts` に `colors` 変数として実装
  - 命名規則: Figma `Main_Dark: #000000` → TypeScript `main.dark: '#000000'`

## 実装例

```typescript
// /src/styles/colors.ts
export const colors = {
  basic: {
    dark: '#000000',
    white: '#ffffff',
    medium: '#515255',
  },
  main: {
    dark: '#000000',
  }
} as const
```

## 使用方法

Vanilla Extract での利用:
```typescript
import designData from '@/lib/figma-library/design-data.json'

export const button = style({
  backgroundColor: designData.design_tokens.colors.Basic_Dark,
})
```
