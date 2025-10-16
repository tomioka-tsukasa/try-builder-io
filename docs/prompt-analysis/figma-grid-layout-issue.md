# Figma Grid Layout Issue Analysis

## 問題の概要

Figma MCP でコンポーネントを生成する際、不要な `display: grid` が適用されてアイコン画像が横に伸びるバグが発生。

## 具体的な問題箇所

Button コンポーネントの `iconGrid` で以下が発生：

```css
/* 問題のあるコード */
export const iconGrid = style([
  {
    display: 'grid',           // ← 不要
    gridTemplateColumns: 'max-content',
    gridTemplateRows: 'max-content',
    // ...
  },
])

export const iconContainer = style([
  {
    gridArea: '1 / 1',         // ← 不要
    // ...
  },
])

export const arrowIcon = style([
  {
    flexGrow: 1,               // ← 横伸び原因
    // ...
  },
])
```

## 問題の原因

Figma MCP が以下の構造を Grid として解釈：

1. **複数のレイヤーが重なっている構造**
2. **Auto Layout の Absolute positioning**
3. **Frame 内での位置指定**
4. **複層の Frame 構造**

## Figma 側での対策

### 1. アイコン部分の構造をシンプル化

```
現在: Frame > Frame > Icon (複層構造)
改善: Frame > Icon (フラット構造)
```

### 2. Auto Layout の設定見直し

- アイコンコンテナで **Auto Layout** を使用
- Direction: **Horizontal**
- Align items: **Center**
- Justify content: **End**
- **Absolute positioning を避ける**

### 3. レイヤー構造の最適化

```
Button
├── Label Container (Auto Layout: Horizontal, Fill container)
└── Icon Container (Auto Layout: Horizontal, Hug contents)
    └── Arrow Icon (Fixed size: 7×12px)
```

### 4. Constraints の設定

- Icon Container: **Right & Center**
- Arrow Icon: **Center & Center**
- **Fill container は使わず、Hug contents で固定サイズ**

### 5. Component 化

- アイコン部分を別 Component として作成
- Props で variant 管理
- 再利用性を高める

## 推奨する Figma 修正手順

1. **アイコン部分を選択して Auto Layout 適用**
2. **不要な Frame を削除（フラット化）**
3. **Fixed size でアイコンサイズを明示**
4. **Parent Frame で Flexbox 的な配置設定**
5. **Absolute positioning の使用を避ける**

## 期待される効果

この修正により、MCP が生成するコードは：
- `display: flex` ベースになる
- Grid 関連の問題が解消される
- より予測可能なレイアウトコードが生成される
- メンテナンス性が向上する

## 注意点

- 既存の Component を修正する場合は、他の Instance への影響も確認
- Design System 全体の一貫性を保つ
- 他のアイコン付きコンポーネントも同様の構造に統一する