# Figma Builder.io プラグイン出力データ解析レポート（根拠明記版）

> 作成日：2025年10月16日
> 対象：Figma Builder.ioプラグインの「Copy Source」機能の出力データ
> 根拠：公式ドキュメント、実際のソースコード、技術仕様に基づく

## 1. データ構造概要【実際のソースコードから確認】

Builder.io Figmaプラグインの「Copy Source」機能が出力するJSONデータは、以下の3つの主要データで構成されています：

```json
{
  "absoluteHtml": "...",      // セマンティックHTML + CSS
  "imageData": ["..."],       // Base64エンコード画像データ
  "vcpImportId": "vcp-..."    // Visual Copilot識別ID
}
```

**根拠**: 実際のJSONファイル構造解析により確認（`jq 'keys'`コマンド実行結果）

## 2. 公式ドキュメントに基づく技術仕様

### 2.1 Visual Copilotの変換プロセス【Builder.io公式ブログより】

**出典**: [Introducing Visual Copilot: A Better Figma-to-Code Workflow](https://www.builder.io/blog/figma-to-code-visual-copilot)

#### 3段階の変換プロセス
1. **AI初期モデル**: 200万データポイントで訓練された専用AIモデル
   - 平面的なデザイン構造をコード階層に変換

2. **Mitosisコンパイラー**: オープンソースコンパイラーによる処理
   - GitHub: https://github.com/BuilderIO/mitosis
   - 構造化された階層を初期コードに変換

3. **LLM最終調整**: 微調整されたLarge Language Model
   - 特定のフレームワークとスタイリング設定に合わせて最適化

#### 対応フレームワーク
React、Vue、Svelte、Angular、Qwik、Solid、HTML

#### 対応スタイリング
プレーンCSS、Tailwind、Emotion、Styled Components、Styled JSX

### 2.2 Mitosisコンパイラーの技術仕様【オープンソース情報より】

**出典**: GitHub検索結果およびMitosis公式サイト

- **ライセンス**: MIT License（OSI承認）
- **主要言語**: TypeScript
- **GitHub Stars**: 11.9k
- **公式サイト**: https://mitosis.builder.io/
- **機能**: "Write once, run everywhere" - JSX lite（JSXの静的サブセット）をASTに変換

## 3. 実際のソースコードから確認できる事実

### 3.1 HTML構造の特徴【実際のコード解析】

#### Builder.io固有のデータ属性
```html
data-figma-component-set="true"
data-component-name="img_title_desc"
data-prop-definitions='{...}'
data-variant="true"
data-variant-properties='{...}'
```

**根拠**: `grep`コマンドによる実際のHTML属性抽出

#### コンポーネントメタデータの保持
```javascript
{
  "componentSetName": "img_title_desc",
  "variantProperties": {
    "pattern": ["white_bg", "default"]
  },
  "componentProperties": {
    "title#608:3": {"type": "TEXT", "defaultValue": "タイトル"},
    "desc#608:6": {"type": "TEXT", "defaultValue": "説明文"},
    "icon_is_arrow#608:10": {"type": "BOOLEAN", "defaultValue": true},
    "icon_is_external#608:13": {"type": "BOOLEAN", "defaultValue": true}
  },
  "totalVariants": 2
}
```

**根拠**: JSONファイル内のscriptタグ content の直接抽出

### 3.2 画像最適化システム【実際のURL解析】

#### Builder.io画像API
検出されたAPI URL（3件）:
```
https://api.builder.io/api/v1/image/assets/TEMP/dd14d85ba95cc5de8fa230d4b16a51cb3a606122?width=460
https://api.builder.io/api/v1/image/assets/TEMP/3645bb201388bc8f8b1662cc0f8ea7d656c22872?width=460
https://api.builder.io/api/v1/image/assets/TEMP/0305028a7ede20c89f55953d5d7fe9c89e3c6188?width=1516
```

**根拠**: 実際のHTMLからのURL抽出（`grep -o`コマンド実行結果）

#### パターン解析
- **エンドポイント**: `/api/v1/image/assets/TEMP/`
- **ファイル識別子**: 32文字のハッシュ値
- **最適化パラメータ**: `?width=460`, `?width=1516`
- **用途**: 自動的な画像サイズ最適化

### 3.3 Visual Copilot識別システム【実際のデータ】

#### vcpImportId
```
vcp-74a5ae3659cb435d8361b95146c7adae
```

**フォーマット**: `vcp-` + 32文字のハッシュ値

**根拠**: JSON構造の直接確認（`jq '.vcpImportId'`実行結果）

## 4. 事実に基づく技術的特徴

### 4.1 確認済みの変換品質

#### CSS品質【実際のスタイル解析】
```css
/* プロダクション対応フォントスタック */
font-family: Inter, -apple-system, Roboto, Helvetica, sans-serif;

/* モダンCSS活用 */
display: flex;
aspect-ratio: 46/41;
border-radius: 3px 3px 0 0;
```

#### レスポンシブ対応【実装確認】
- Flexboxを使用したレイアウト
- aspect-ratioによる画像アスペクト比保持
- 相対単位とpixel値の適切な使い分け

### 4.2 Figma連携の具体的実装

#### レイヤー名の保持
```html
layer-name="Components/Common"
layer-name="img_title_desc"
layer-name="button"
layer-name="タイトル"
layer-name="説明文"
```

**根拠**: HTML内のlayer-name属性の直接確認

#### コンポーネントプロパティ型システム
- `TEXT`: テキストコンテンツ
- `BOOLEAN`: フラグ制御（icon_is_arrow, icon_is_external）
- `INSTANCE_SWAP`: コンポーネントインスタンス交換

**根拠**: JSONメタデータの構造解析

## 5. 公式情報に基づく性能・効果

### 5.1 Builder.io公式の主張【公式ブログより】

**時間削減効果**: 50-80%の開発時間短縮
**精度**: ピクセルパーフェクトな変換
**レスポンシブ**: 自動的な全画面サイズ対応

**出典**: Visual Copilot公式発表資料

### 5.2 推奨されるFigmaデザインプラクティス【公式ドキュメント】

1. **Auto Layout使用**: 最も効果的な改善要素
2. **画像の明示的定義**: 複雑なデザインでのAI認識向上
3. **背景レイヤーのグループ化**: 構造简化
4. **重複・交差の最小化**: 不要な結果の防止

**出典**: Builder.io公式ベストプラクティスガイド

## 6. 推測・解釈部分の明確化

### 6.1 推測に基づく部分

以下の内容は公式情報がなく、技術的推測に基づくものです：

1. **具体的な工数削減率**（「約95%削減」など）
2. **Figmaから取得する具体的なデータ構造**
3. **内部的なAI処理の詳細手順**
4. **他社ツールとの詳細比較**

### 6.2 確認が必要な技術詳細

1. **Figma API利用の詳細**
2. **200万データポイントの訓練内容**
3. **LLMの具体的な微調整方法**
4. **Mitosisコンパイラーとの統合詳細**

## 7. 根拠に基づく結論

### 7.1 確認された技術的事実

1. **3段階AI変換プロセス**: 専用AI → Mitosis → LLM調整
2. **オープンソース基盤**: MitosisコンパイラーはMITライセンス
3. **包括的フレームワーク対応**: 7つのフレームワーク対応
4. **完全なメタデータ保持**: Figmaコンポーネント情報の構造化保存
5. **自動画像最適化**: Builder.io CDNによる動的リサイズ

### 7.2 革新性の根拠

**従来ツールとの差別化点**（公式主張）:
- 専用AI訓練による高精度変換
- プロダクション即利用可能な品質
- 既存コンポーネントライブラリとの統合

**技術的優位性**（実装確認）:
- 構造化されたメタデータ保持
- モダンCSS手法の自動適用
- 包括的な画像最適化システム

### 7.3 信頼性評価

**高い信頼性**:
- 公式ドキュメント記載事項
- オープンソースコンポーネント
- 実際のコード出力分析

**要検証事項**:
- 具体的な性能数値
- 内部処理の詳細
- 競合比較データ

---

*このレポートは公式ドキュメント、オープンソース情報、実際のコード解析に基づいて作成されました。推測部分は明確に区別して記載しています。*