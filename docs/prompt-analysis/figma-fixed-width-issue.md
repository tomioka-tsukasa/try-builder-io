# Figma Fixed Width Issue Analysis

## 問題の概要

Figma MCP でページ全体のコンテナを生成する際、固定幅指定（`rvw.width(1512)`）により不要な水平スクロール領域が発生。

## 具体的な問題箇所

MoriCorpTest05.css.ts で以下が発生：

```css
/* 問題のあるコード */
export const container = style([
  {
    width: '100%',           // ← 本来これで十分
    minHeight: '100vh',
  },
  rvw.width(1512),          // ← 不要な固定幅指定（水平スクロール原因）
  rvw.height(2605),
])
```

## 問題の原因

Figma で **ページ全体の Frame が固定幅（1512px）** に設定されているため：
- MCP が固定幅を CSS に変換
- レスポンシブ対応時に水平スクロールが発生
- 小さな画面で表示が崩れる

## Figma 側での修正方法

### 1. ページコンテナの設定変更

```
現在: Frame width: Fixed (1512px)
修正: Frame width: Fill container / 制約なし
```

### 2. レスポンシブ対応構造の実装

```
Page Container (100%幅)
└── Content Wrapper (最大幅制限 + センタリング)
    ├── Section 1
    ├── Section 2
    └── Section N
```

### 3. Auto Layout の正しい設定

**Page Container:**
- Direction: **Vertical**
- Width: **Fill container**
- Align items: **Center** (コンテンツをセンタリング)
- Padding: **0**

**Content Wrapper:**
- Direction: **Vertical**
- Width: **Fixed (1312px)** または **Max width constraint**
- Padding: **左右 100px**
- Margin: **Auto** (センタリング)

### 4. Constraints の正しい設定

- **Page Container**: Left & Right (両端に追従)
- **Content Wrapper**: Center (中央配置)
- **各セクション**: Left & Right (親の幅に追従)

### 5. 推奨する Figma 修正手順

1. **ページ全体の Frame を選択**
2. **Width を "Fill container" に変更**
3. **内部に Content Wrapper Frame を作成**
4. **Content Wrapper に最大幅（1312px）を設定**
5. **Auto Layout でセンタリング設定**
6. **各セクションは Content Wrapper 内に配置**

## 修正前後の比較

### 修正前（問題のある構造）
```
Page Frame (Fixed: 1512px)
├── Section 1
├── Section 2
└── Section N
```
→ 固定幅により水平スクロール発生

### 修正後（推奨構造）
```
Page Frame (Fill container)
└── Content Wrapper (Max width: 1312px, Center)
    ├── Section 1
    ├── Section 2
    └── Section N
```
→ レスポンシブ対応、水平スクロールなし

## 期待される効果

この修正により：
- MCP が `width: '100%'` のみを生成
- 水平スクロールが発生しない
- レスポンシブ対応が正しく動作
- デスクトップでは最大幅制限、モバイルでは 100% 幅
- より実用的なコードが生成される

## 設計原則

### Figma でのレスポンシブ設計ベストプラクティス

1. **外側コンテナ**: 100% 幅（制約なし）
2. **内側コンテンツ**: 最大幅制限 + センタリング
3. **固定幅は避けて、制約ベースで設計**
4. **Auto Layout を活用したフレキシブル設計**
5. **デスクトップファーストではなく、フルード設計**

## 注意点

- 既存のデザインシステムとの整合性を保つ
- 他のページでも同様の構造に統一する
- レスポンシブブレークポイントを考慮した設計
- Content Wrapper の最大幅はプロジェクトの要件に合わせて調整

## 追加推奨事項

- **Figma Variables** でレスポンシブブレークポイントを管理
- **Component 化** で再利用性を高める
- **Auto Layout** の習得でより良いコード生成を実現