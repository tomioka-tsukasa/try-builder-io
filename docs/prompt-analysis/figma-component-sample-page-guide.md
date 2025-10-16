# Figmaコンポーネント確認ページの設計指針

## 問題点の分析

### 1. **余計な装飾による確認阻害**
**問題**: 白背景・ボーダー・パディングによりコンポーネント本来のデザインが見えない

**現状の問題例**:
```typescript
// NG: 装飾的なコンテナで包む
<div className={styles.componentContainer}>
  <Component />
</div>

// styles.componentContainer に背景色・ボーダー・パディングが設定されている
```

**改善指示**:
```markdown
コンポーネント確認ページは「Figmaデザインとの整合性チェック」が主目的です。
- コンテナの背景色・ボーダー・パディング等の装飾は一切加えない
- コンポーネントを素の状態で表示
- 背景はプロジェクトのデフォルト背景色のみ使用
```

### 2. **レイアウト制約による表示問題**
**問題**: グリッドで1/4サイズ表示により、実際のサイズ感が分からない

**現状の問題例**:
```typescript
// NG: サイズ制約のあるグリッドレイアウト
<div className={styles.buttonGrid}>
  <div>
    <Button>ボタン</Button>
  </div>
</div>

// styles.buttonGrid で gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
```

**改善指示**:
```markdown
各コンポーネントは本来のサイズで表示してください：
- グリッドレイアウトは使わず、縦並び表示
- コンポーネントのwidth制限なし（自然なサイズで表示）
- パターン毎の見出しは残すが、サイズ制約は除去
- 各パターン間に適切な余白のみ設定
```

### 3. **画像素材の問題**
**問題**: 適当な画像パスで実際の表示確認ができない

**現状の問題例**:
```typescript
// NG: 存在しない可能性のあるパス
const sampleImage = '/assets/sample.png'

<ImgCaption
  src={sampleImage}  // このファイルが存在するか不明
  alt="サンプル画像"
/>
```

**改善指示**:
```markdown
画像は以下の優先順位で設定：
1. MCPで取得されたFigma実画像を使用
2. プロジェクト内の既存画像を使用
3. 適切なサンプル画像（実在するパス）を配置
実際に表示される状態でのデザイン確認を最優先とする
```

## 推奨する総合指示

```markdown
コンポーネント確認ページの要件：

**主目的**: Figmaデザインとの完全一致確認

**表示ルール**:
- 装飾なしの素の状態で表示
- 本来のサイズで自然に表示
- 実際の画像素材を使用
- 縦並びで見やすく配置

**禁止事項**:
- コンポーネントを囲む装飾的なコンテナ
- サイズ制限によるレイアウト崩れ
- 存在しない画像パスの使用

**推奨実装例**:
```typescript
// OK: 素の状態で表示
<section className={styles.section}>
  <h2 className={styles.sectionTitle}>Button</h2>

  <div className={styles.itemContainer}>
    <h3 className={styles.itemTitle}>Default Size</h3>
    <Button size="default" onClick={handleClick}>
      ボタンテキスト
    </Button>
  </div>

  <div className={styles.itemContainer}>
    <h3 className={styles.itemTitle}>Large Size</h3>
    <Button size="large" onClick={handleClick}>
      ボタンテキスト
    </Button>
  </div>
</section>

// CSS
export const section = style({
  marginBottom: '60px', // 適切な余白のみ
})

export const itemContainer = style({
  marginBottom: '32px', // 適切な余白のみ
  // 装飾的なスタイルは一切なし
})
```

## 期待される効果

この指針により、純粋なデザイン検証が可能になり：
- Figmaデザインとの差異を正確に把握
- コンポーネントの実際のサイズ感を確認
- 実画像での表示品質を検証
- より効率的なデザインレビューが実現