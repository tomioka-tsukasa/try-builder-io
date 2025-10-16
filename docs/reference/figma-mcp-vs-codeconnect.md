# Code Connect vs Figma MCP Server の比較

## 概要

FigmaのCode ConnectとFigma MCP Serverは、どちらもデザインと開発を繋ぐ機能ですが、**全く異なるアプローチ**を取っています。この文書では両者の違いと使い分けについて説明します。

## Code Connect とは

### 目的
**既存コンポーネントとFigmaデザインの関連付け**

### 仕組み
開発者が事前に作成したコンポーネントをFigmaデザインに手動で関連付けることで、「このデザインに対応するコードは既にあります」という案内を提供します。

### Code Connect の実装例

#### 1. 既存コンポーネント（開発者が事前に作成）
```javascript
// src/components/Button.tsx
export default function Button({ variant, size, children }) {
  return (
    <button className={`btn ${variant} ${size}`}>
      {children}
    </button>
  );
}
```

#### 2. Code Connect設定ファイル
```javascript
// button.figma.tsx
import figma from '@figma/code-connect';
import Button from './Button';

figma.connect(Button, "https://www.figma.com/file/xyz?node-id=1:23", {
  props: {
    variant: figma.enum("Style", {
      Primary: "btn-primary",
      Secondary: "btn-secondary",
      Danger: "btn-danger"
    }),
    size: figma.enum("Size", {
      Small: "btn-sm",
      Medium: "btn-md",
      Large: "btn-lg"
    }),
    children: figma.string("Label")
  }
});
```

#### 3. 開発者体験
1. Figmaでボタンコンポーネントを選択
2. Dev Modeで「既存のButtonコンポーネント」へのリンクが表示
3. 「このコンポーネントを使用してください」という案内

## Figma MCP Server とは

### 目的
**デザイン情報をClaude Codeに提供してコード生成を支援**

### 仕組み
Figma MCP Serverがデザインデータを抽出してClaude Codeに提供し、Claude Codeが指定されたフレームワーク・言語に応じて新しいコードを自動生成します。

### Figma MCP Server の動作例

#### 1. デザイン選択
Figmaで任意のデザイン要素を選択

#### 2. 自動コード生成プロセス
```javascript
// 1. Figma MCP Server がデザイン情報を提供
// 2. Claude Code が受信した情報を基に以下のコードを生成
const img = "http://localhost:3845/assets/ad89cca48a4f5ea415d85c91d56e54b9de58d4b3.png";

export default function ContentsIndexUi() {
  return (
    <div className="content-stretch flex items-start relative size-full"
         data-name="Contents + Index UI"
         data-node-id="570:37920">
      <div className="basis-0 box-border content-stretch flex flex-col gap-[100px] grow items-start min-h-px min-w-px pl-0 pr-[200px] py-[170px] relative shrink-0"
           data-name="Contents"
           data-node-id="570:37921">
        {/* Claude Code がデザイン情報を基に生成したTailwindクラス */}
        <div className="absolute bg-[rgba(255,255,255,0.5)] bottom-0 left-0 right-[-50px] top-0"
             data-name="■"
             data-node-id="570:37922" />
      </div>
    </div>
  );
}
```

#### 3. 開発者体験
1. Figmaで任意のデザインを選択
2. Claude Code がFigma MCP Server からデザイン情報を受信
3. Claude Code が受信した情報を基にコード生成
4. 「このデザインから新しいコードを作成しました」

## 主要な違い

| 項目 | Code Connect | Figma MCP Server + Claude Code |
|------|-------------|--------------------------------|
| **アプローチ** | 既存コード → デザイン関連付け | デザイン情報 → Claude Codeでコード生成 |
| **事前準備** | コンポーネント + 設定ファイル必要 | 不要（即座に利用可能） |
| **対象** | デザインシステムコンポーネント | 任意のデザイン要素 |
| **コード出力** | 既存コンポーネントへの参照 | Claude Code が生成する新しい完全なコード |
| **更新頻度** | 手動設定更新 | リアルタイム自動生成 |
| **学習コスト** | 設定ファイル記述が必要 | 即座に使用開始 |
| **実装指示** | 設定ファイルで自動的に適切なコンポーネント提示 | Claude に手動で指示書・ルールを伝える必要がある |

### 実装ガイダンスの違い

#### Code Connect の場合
```javascript
// 設定ファイルで定義済み → 自動的に適切なコンポーネント提示
figma.connect(Button, "node-id", {
  variant: figma.enum("Style", { Primary: "primary" }),
  size: figma.enum("Size", { Large: "large" })
});
```
**結果**: Figmaでデザインを選択するだけで、適切な`<Button variant="primary" size="large">`が自動提示される

#### Figma MCP Server + Claude Code の場合
```javascript
// Claude に毎回手動指示が必要
// 「既存のButtonコンポーネントを使用して、propsはvariant="primary", size="large"で実装してください」
```
**結果**: Claude に具体的な実装ルールを毎回伝える必要がある

## 使い分けガイド

### Code Connect を使うべき場面

#### デザインシステムが構築済み
```javascript
// 既にこのようなコンポーネントがある場合
<Button variant="primary" size="large">
  送信する
</Button>
```

#### 再利用性を重視
- 同じボタンデザインが複数の画面で使用される
- 一貫したコンポーネント使用を促進したい
- デザイナーに「既存コンポーネントの使用」を案内したい

#### チーム開発
- デザイナーと開発者の認識を統一したい
- コンポーネントライブラリの活用率を向上させたい

### Figma MCP Server + Claude Code を使うべき場面

#### 新規レイアウト開発
```javascript
// このような新しいレイアウトを作成したい場合
<div className="complex-layout-with-specific-positioning">
  {/* Claude Code が生成するカスタムデザインの実装 */}
</div>
```

#### プロトタイピング
- 新しいアイデアを素早くコード化したい
- デザイン探索中の実装検証
- モックアップからの迅速な実装

#### カスタムデザイン
- 既存コンポーネントでは表現できないデザイン
- 特殊なレイアウトやアニメーション
- ランディングページなどの独自デザイン

## 実際の開発フロー

### フェーズ1: デザインシステム構築
```
1. 基本コンポーネントを開発
   ↓
2. Code Connect で関連付け
   ↓
3. デザイナーが既存コンポーネントを活用
```

### フェーズ2: 新機能開発
```
1. 新しいデザインを作成
   ↓
2. Figma MCP Server + Claude Code でコード生成
   ↓
3. 生成コードをベースに開発
```

### フェーズ3: 統合・最適化
```
1. 新機能で共通パターンを特定
   ↓
2. 新しいコンポーネントとして抽出
   ↓
3. Code Connect で関連付け
   ↓
4. デザインシステムに追加
```

## 両方を使った理想的なワークフロー

### デザイナー視点
1. **既存コンポーネント確認**: Code Connectで利用可能なコンポーネントをチェック
2. **新規デザイン作成**: 既存で対応できない部分は新しくデザイン
3. **実装フィードバック**: Claude Code 生成コードを開発者と確認

### 開発者視点
1. **コンポーネント活用**: Code Connectで既存コンポーネントを確認
2. **新規実装**: Claude Code でデザインから新しいレイアウトコードを生成
3. **システム統合**: 生成コードを既存システムに統合・最適化

## 注意事項

### Code Connect
- **初期コスト**: 設定ファイルの作成が必要
- **メンテナンス**: デザイン変更時の設定更新
- **スコープ**: 事前に定義したコンポーネントのみ対応

### Figma MCP Server + Claude Code
- **依存関係**: Figma Desktop App起動が必須
- **役割分担**: MCP Server (情報提供) + Claude Code (コード生成)
- **カスタマイズ**: Claude Code が生成したコードの手動調整が必要な場合がある
- **一貫性**: デザインシステムとの整合性確認が必要

## まとめ

Code ConnectとFigma MCP Server + Claude Codeは**補完関係**にあります：

- **Code Connect**: 「標準化と再利用」のためのツール
- **Figma MCP Server + Claude Code**: 「イノベーションと迅速開発」のためのツール

効果的な開発チームは、両方を適切に使い分けることで、**既存資産の活用**と**新しい価値の創造**の両方を実現しています。

**重要**: Figma MCP Server はデザイン情報の提供を担当し、実際のコード生成はClaude Code が行います。