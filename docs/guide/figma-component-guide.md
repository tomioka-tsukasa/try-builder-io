# Figma MCP コンポーネント実装ガイド

コンポーネント実装時に特化したガイドです。
必ず `./figma-common-guide.md` を先に参照してください。

**変数定義** : 下記の変数は置き換えて書類を読んでください。

<!--
変数定義:
- DIR_COMMON_COMPONENTS: /src/components/
- DIR_PAGE_COMPONENTS: /src/pages/**/components/
-->

## 事前確認

### 既存UIコンポーネント確認
```bash
ls -la DIR_COMMON_COMPONENTS
```

**目的**: 重複実装の防止、既存パターンの把握

## 実装方針決定

### Figmaノード名と既存コンポーネント名の対応確認
```bash
# 例: img_caption ノードがある → ImgCaption コンポーネントを探す
find DIR_COMMON_COMPONENTS -name "*[ノード名に対応する名前]*" -type f
```

**重要なポイント:**
- Figmaのノード名（snake_case）と既存コンポーネント名（PascalCase）の対応関係を確認
- 既存コンポーネントがある場合は必ず再利用
- 類似機能コンポーネントの拡張可能性を検討

### 新規コンポーネント作成の必要性判断
以下を検討：
- 既存コンポーネントで対応可能か
- 新規作成が必要なコンポーネントは何か
- どこに配置するか
  - プロジェクト共通コンポーネント DIR_COMMON_COMPONENTS
  - ページ内 DIR_PAGE_COMPONENTS

## コンポーネント実装

### 既存コンポーネントとの整合性確認
- 生成されたコンポーネント（Button, Input, Card等）が既存コンポーネントにないか確認
- 既存コンポーネントがある場合は、生成コードから削除し、importで使用

### 新規コンポーネントの分離・配置
- 再利用性の高いコンポーネントは DIR_COMMON_COMPONENTS に別ファイルとして作成
- 各コンポーネントに適切な Props インターフェースを定義

### コンポーネント配置の判断基準

#### DIR_COMMON_COMPONENTS に配置する場合
- 複数ページで再利用される可能性が高い
- 独立した機能を持つUI要素（Button、Input、Card、Modal等）
- デザインシステムの一部として管理すべき要素

#### DIR_PAGE_COMPONENTS に配置する場合
- そのページでのみ使用される固有のコンポーネント
- ページの構造に強く依存する要素

## コンポーネント設計ベストプラクティス

### 1. Props インターフェース設計
```typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  className
}: ButtonProps) {
  // 実装
}
```

### 2. 再利用性の考慮
- バリエーション（variant）の定義
- サイズ（size）の選択肢
- カスタムスタイル（className）の受け取り
- 必要な機能のプロパティ化

### 3. スタイルの分離
```typescript
// Button.css.ts
export const buttonBase = style([
  {
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
]);

export const variants = styleVariants({
  primary: {
    backgroundColor: colors.primary.main,
    color: colors.basic.white,
  },
  secondary: {
    backgroundColor: colors.gray.light,
    color: colors.basic.dark,
  },
});

export const sizes = styleVariants({
  small: { padding: '8px 16px', fontSize: '14px' },
  medium: { padding: '12px 24px', fontSize: '16px' },
  large: { padding: '16px 32px', fontSize: '18px' },
});
```

## コンポーネントドキュメント

### 1. 使用例の記載
```typescript
/**
 * 基本的なボタンコンポーネント
 *
 * @example
 * <Button variant="primary" size="medium" onClick={handleClick}>
 *   クリック
 * </Button>
 */
export default function Button({ ... }: ButtonProps) {
  // 実装
}
```

### 2. エクスポート
```typescript
// index.ts でのre-export
export { default as Button } from './Button/Button';
export { default as Input } from './Input/Input';
export { default as Card } from './Card/Card';
```

## テスト・検証

### 1. 単体テストの考慮
- コンポーネントが独立して動作するか
- プロパティの変更が正しく反映されるか
- エラー状態の処理が適切か

### 2. デザインシステムとの一貫性
- 既存コンポーネントとの見た目の統一性
- デザイントークンの正しい使用
- レスポンシブ対応の確認
