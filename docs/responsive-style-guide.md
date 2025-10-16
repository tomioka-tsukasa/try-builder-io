# レスポンシブスタイルガイド

## 概要

`src/styles/responsive.css.ts`はプロジェクトのレスポンシブデザインの基盤となるユーティリティです。Vanilla Extractを使用して、さまざまなデバイスサイズに最適化されたスタイルを簡単に定義できます。

## デザインサイズ

プロジェクトでは以下のデザインサイズを基準としています：

- PC設計サイズ: 1440px
- PCオーバー設計サイズ: 1800px
- タブレット設計サイズ: 1440px
- **SP設計サイズ: 1125px (375px×3)**

これらのサイズに基づいて、レスポンシブ対応を行ってください。特にSP設計サイズは1125pxであり、すべてのマージンやレイアウトの実装において、この値が基準となります。

## メディアクエリ定義

```typescript
export const mediaQueries = {
  sp: `screen and (max-width: ${SpMqWidth}px)`, // 500px以下
  tablet: `screen and (min-width: ${TabletMqWidthMin}px) and (max-width: ${PcMqWidthMax - 1}px)`, // 768px-1799px
  pc: `screen and (min-width: ${PcMqWidthMin}px) and (max-width: ${PcOverMqWidthMin - 1}px)`, // 768px-1799px
  pcOver: `screen and (min-width: ${PcOverMqWidthMin}px)`, // 1800px以上
  hover: `(hover: hover)`,
  pixelBreakpoint: `screen and (min-width: ${pixelLimitWidth}px)`, // 501px以上
};
```

## 主な機能

### `rvw` - レスポンシブな値を生成

ビューポートの幅に応じて値を計算します。異なるデバイスごとに最適な値を設定できます。**マージンやレイアウトの実装には必ず`rvw`を使用してください。**

```typescript
// 使用例
const styles = {
  container: style({
    ...rvw.fontSize(16, 14, 15), // PC:16, SP:14, タブレット:15の値
    ...rvw.margin(20, 10),      // PC:20, SP:10の値
    ...rvw.padding(30),         // 全デバイス共通:30の値
  })
}
```

### `mqStyle` - メディアクエリごとの値を設定

異なるメディアクエリごとに値を直接指定します。

```typescript
// 使用例
const styles = {
  container: style({
    ...mqStyle.marginBottom([40, 20, 30, 60]), // PC, SP, タブレット, PCオーバーの順
    ...mqStyle.gap([20, 10, 15, 25]),
  })
}
```

### デバイス別スタイル

特定のデバイスにのみ適用するスタイルを定義できます。

```typescript
// 使用例
const styles = {
  container: style({
    display: 'flex',
    ...pc({
      flexDirection: 'row',
    }),
    ...sp({
      flexDirection: 'column',
    }),
    ...tablet({
      padding: '20px',
    }),
    ...pcOver({
      maxWidth: '1800px',
    }),
  })
}
```

### ホバーエフェクト

ホバー対応デバイスのみにエフェクトを適用します。

```typescript
// 使用例
const styles = {
  button: style({
    backgroundColor: 'blue',
    ...hover({
      backgroundColor: 'darkblue',
    }),
    ...hoverInteraction(), // 標準のホバーインタラクション
  })
}
```

## 注意点

1. vw単位はピクセル制限（`pixelLimitWidth`: 501px）以上のサイズでは固定ピクセル値に変換されます
2. デフォルトでは、PC設計サイズ（1440px）、SP設計サイズ（1125px = 375px*3）が基準値として使用されます
3. メディアクエリの閾値は変数で定義されており、一貫性のあるレスポンシブ対応が可能です
4. デザイナーから提供された画像に厳密に準拠し、レイアウトやマージンは必ず`rvw`を使用して実装してください

## ベストプラクティス

- デザインの一貫性を保つため、直接CSSプロパティを指定するよりも`rvw`や`mqStyle`を使用してください
- 複雑なレイアウトには`mqStyle`を、シンプルな値には`rvw`を使用すると効率的です
- ホバーエフェクトには必ず`hover`ユーティリティを使用し、タッチデバイスとの互換性を確保してください
- デザイン指示に正確に従い、特にSPデザインサイズ（1125px）に基づいた値を`rvw`で実装してください 