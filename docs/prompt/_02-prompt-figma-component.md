Figmaで選択中のコンポーネント一覧を実装してください。

## 手順

1. `/CLAUDE.md` を読んでプロジェクトの基本情報を把握
2. `/docs/guide/figma-common-guide.md` を読んで共通要件を把握
3. `/docs/guide/figma-component-guide.md` を読んでコンポーネント固有要件を把握
4. `/docs/responsive-style-guide.md` を読んでレスポンシブの書き方を把握
5. 最後に実装したコンポーネントを読み込んでサンプルを確認できるページを生成してください

## コンポーネント確認ページ生成ルール

### 目的
**Figmaデザインとの完全一致確認**が唯一の目的。UI検証やデモではない。

### 表示ルール

**禁止事項**:
- 装飾的なコンテナ（背景色・ボーダー・パディング）
- 1行に複数のコンポーネント
- サイズ制限のあるグリッドレイアウト
- 存在しない画像パス

**必須事項**:
- コンポーネントを素の状態で表示
- 縦並び配置、適切な余白のみ
- 実在する画像素材の使用（MCP取得画像 > 既存画像 > 適切なサンプル）

### 実装例

```typescript
<section className={styles.section}>
  <h2>Button</h2>

  <div className={styles.item}>
    <h3>Default Size</h3>
    <Button size="default">ボタン</Button>
  </div>
</section>

// CSS: 余白のみ、装飾なし
export const section = style({ marginBottom: '60px' })
export const item = style({ marginBottom: '32px' })
```
