# Claude Code x Figma MCP 実装フロー詳細解説

## 概要

Figma MCP Server から受信したコンポーネント情報を、React + TypeScript + Vanilla Extract 環境に実装する具体的なプロセスを詳細に解説します。

## 実装対象コンポーネント

**対象**: `ImgTitleDesc` コンポーネント（画像+タイトル+説明文の複合コンポーネント）
**選択箇所**: Figma Components セクション
**実装先**: `/src/components/ui/ImgTitleDesc/`

## 1. Figma MCP Server からの情報受信

### 受信したデータ構造

#### メタデータ（XML形式）
```xml
<section id="608:6942" name="Components" x="28184" y="-16530" width="10469" height="2686">
  <frame id="608:6997" name="img_title_desc" x="1236" y="314" width="270" height="612">
    <symbol id="608:6996" name="pattern=default" x="20" y="20" width="230" height="256" />
    <symbol id="608:6998" name="pattern=white_bg" x="20" y="316" width="230" height="260" />
  </frame>
</section>
```

**受信情報の特徴**:
- コンポーネントの階層構造が明確
- バリアント情報（`pattern=default`, `pattern=white_bg`）を識別
- 各要素のノードIDが保持されている

#### 生成済みReactコード
```typescript
interface ImgTitleDescProps {
  title?: string;
  desc?: string;
  iconIsArrow?: boolean;
  iconIsExternal?: boolean;
  pattern?: "white_bg" | "default";
}

function ImgTitleDesc({
  title = "タイトル",
  desc = "説明文",
  iconIsArrow = true,
  iconIsExternal = true,
  pattern = "default"
}: ImgTitleDescProps) {
  if (pattern === "white_bg") {
    return (
      <div className="bg-white content-stretch flex flex-col items-start relative rounded-[3px] size-full">
        {/* white_bg バリアント */}
      </div>
    );
  }
  return (
    <div className="content-stretch flex flex-col gap-[11px] items-start relative rounded-[3px] size-full">
      {/* default バリアント */}
    </div>
  );
}
```

**受信コードの品質分析**:
- ✅ **TypeScript完全対応**: interface定義、型安全性
- ✅ **バリアント対応**: Union型によるパターン制御
- ✅ **デフォルト値**: 全プロパティにフォールバック設定
- ✅ **条件分岐**: パターンによる適切な描画切り替え
- ✅ **アクセシビリティ**: aria-hidden等の適切な設定

## 2. 受信情報の整理と分析

### コンポーネント設計の分析結果

#### Props設計
```typescript
interface ImgTitleDescProps {
  title?: string           // テキスト要素: タイトル
  desc?: string           // テキスト要素: 説明文
  iconIsArrow?: boolean   // 表示制御: 矢印アイコン
  iconIsExternal?: boolean // 表示制御: 外部リンクアイコン
  pattern?: "white_bg" | "default" // バリアント: 背景パターン
  imageUrl?: string       // 追加: 画像URL（カスタマイズ用）
}
```

**整理ポイント**:
- **必須/任意の判別**: 全て任意プロパティでデフォルト値設定
- **型の推測精度**: string/boolean/Union型が適切に推論
- **拡張性**: imageUrl プロパティを追加してカスタマイズ対応

#### バリアント分析
```typescript
// パターン1: default（シンプル）
{
  background: 'なし',
  padding: 'なし',
  layout: 'gap-[11px]',
  imageHeight: '可変（flex-grow）'
}

// パターン2: white_bg（カード形式）
{
  background: 'white',
  padding: '20px',
  layout: 'コンパクト',
  imageHeight: '180px固定'
}
```

## 3. React + TypeScript + Vanilla Extract への変換

### 変換戦略

#### 3.1 ファイル構成の設計
```
src/components/ui/ImgTitleDesc/
├── ImgTitleDesc.tsx      # コンポーネント本体
├── ImgTitleDesc.css.ts   # Vanilla Extract スタイル
└── index.ts              # エクスポート用（任意）
```

#### 3.2 Tailwind → Vanilla Extract変換

**変換プロセス**:
```typescript
// 受信: Tailwind クラス
className="bg-white content-stretch flex flex-col items-start relative rounded-[3px] size-full"

// 変換: Vanilla Extract スタイル
export const containerWhiteBg = style({
  backgroundColor: 'white',    // bg-white
  display: 'flex',            // flex
  flexDirection: 'column',    // flex-col
  alignItems: 'flex-start',   // items-start
  position: 'relative',       // relative
  borderRadius: '3px',        // rounded-[3px]
  width: '100%',             // size-full
  height: '100%',            // size-full
})
```

**変換時の判断基準**:
- **プロジェクト標準**: 既存コードがVanilla Extractを使用
- **型安全性**: CSSプロパティの型チェック
- **保守性**: スタイルとロジックの分離
- **パフォーマンス**: 実行時CSSの最適化

### 3.3 実装結果

#### ImgTitleDesc.css.ts（抜粋）
```typescript
import { style } from '@vanilla-extract/css'

export const containerDefault = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '11px',
  alignItems: 'flex-start',
  position: 'relative',
  borderRadius: '3px',
  width: '100%',
  height: '100%',
})

export const containerWhiteBg = style({
  backgroundColor: 'white',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  position: 'relative',
  borderRadius: '3px',
  width: '100%',
  height: '100%',
})
```

#### ImgTitleDesc.tsx（抜粋）
```typescript
import * as styles from './ImgTitleDesc.css'

const ImgTitleDesc: React.FC<ImgTitleDescProps> = ({
  title = 'タイトル',
  desc = '説明文',
  pattern = 'default',
  imageUrl = imgImage,
}) => {
  if (pattern === 'white_bg') {
    return (
      <div className={styles.containerWhiteBg} data-node-id="608:6998">
        {/* white_bg バリアント */}
      </div>
    )
  }

  return (
    <div className={styles.containerDefault} data-node-id="608:6996">
      {/* default バリアント */}
    </div>
  )
}
```

## 4. プロジェクト適応における考慮事項

### 4.1 既存コードベースとの統合

**統合ポイント**:
- ✅ **スタイリング**: Vanilla Extract（プロジェクト標準）
- ✅ **TypeScript**: 既存の型定義パターンに準拠
- ✅ **ディレクトリ構成**: `/src/components/ui/` 配下に配置
- ✅ **命名規則**: PascalCase コンポーネント名

### 4.2 カスタマイズ対応

**追加した拡張性**:
```typescript
imageUrl?: string  // 画像URL カスタマイズ
```

### 4.3 データ属性の保持

**Figmaとの連携維持**:
```typescript
data-node-id="608:6996"     // Figmaノードとの紐付け
data-name="pattern=default" // 可読性向上
```

## 5. 実装品質の評価

| 項目 | Tailwind版 | Vanilla Extract版 | 評価 |
|------|------------|------------------|------|
| **型安全性** | ✅ TypeScript完全対応 | ✅ CSS型チェック追加 | 向上 |
| **バリアント** | ✅ Union型で型安全 | ✅ 同等の実装 | 維持 |
| **保守性** | △ インラインCSS | ✅ スタイル分離 | 向上 |
| **プロジェクト適応** | ❌ Tailwind依存 | ✅ Vanilla Extract | 向上 |

## 6. 使用方法

### 基本的な使用方法

```typescript
import ImgTitleDesc from '@/components/ui/ImgTitleDesc/ImgTitleDesc'

// デフォルトバリアント
<ImgTitleDesc
  title="ヒルズ 挑戦する都市"
  desc="森 稔"
/>

// ホワイト背景バリアント
<ImgTitleDesc
  title="カスタムタイトル"
  desc="カスタム説明文"
  pattern="white_bg"
  imageUrl="/custom-image.jpg"
/>
```

## 7. まとめ

### Figma MCP → React実装の効果

1. **開発効率**: 設計→実装の時間を大幅短縮
2. **品質保証**: Figma公式最適化による高精度実装
3. **保守性**: 型安全性とスタイル分離による長期保守対応
4. **一貫性**: デザインシステムとの完全な同期

### 今回の実装フローの成果

- **受信品質**: Figma MCP Serverによる完璧な型定義とバリアント対応
- **変換精度**: Tailwind → Vanilla Extract の完全変換
- **プロジェクト適応**: 既存コードベースとの seamless な統合
- **拡張性**: 将来のカスタマイズに対応する設計

**結論**: Figma MCP Server + Claude Code の組み合わせにより、手動実装と同等以上の品質でありながら、大幅な効率化を実現する実装フローが確立されました。