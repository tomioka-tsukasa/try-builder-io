# 画像最適化コンポーネントガイド

## 概要

`ImgOpt.tsx`は画像表示を最適化するためのコンポーネントです。このコンポーネントを使用することで、以下の機能が自動的に適用されます：

- 最新の画像フォーマット（AVIF, WebP）のサポート
- ブラウザごとの最適な画像フォーマットの選択
- レスポンシブ対応（SP/PC別の画像表示）
- SVGファイルのサポート

## 基本的な使い方

```tsx
import { ImgOpt } from 'src/components/utils/ImgOpt';

// 基本的な使用方法
<ImgOpt 
  src="/path/to/image.png" 
  alt="画像の説明" 
/>

// レスポンシブ対応（SP用画像を指定）
<ImgOpt 
  src="/path/to/pc-image.png" 
  srcSp="/path/to/sp-image.png" 
  alt="画像の説明" 
/>

// サイズ指定
<ImgOpt 
  src="/path/to/image.png" 
  width={300} 
  height={200} 
  alt="画像の説明" 
/>

// クラス指定
<ImgOpt 
  src="/path/to/image.png" 
  className="custom-image-class" 
  alt="画像の説明" 
/>
```

## プロパティ

| プロパティ | 型 | 必須 | 説明 |
|------------|-----|------|------|
| src | string | ◯ | PC/デフォルト用の画像パス |
| srcSp | string | - | SP用の画像パス（500px以下のデバイスで使用） |
| alt | string | - | 代替テキスト（アクセシビリティのため推奨） |
| width | number \| string | - | 画像の幅 |
| height | number \| string | - | 画像の高さ |
| className | string | - | 追加のクラス名 |

その他の標準的な`<img>`要素の属性も利用可能です。

## 動作の仕組み

1. コンポーネントがマウントされた時点でブラウザがサポートする画像フォーマットを検出
2. ユーザーのデバイスに応じて適切な画像パス（PC or SP）を選択
3. サポートされている最適な画像フォーマットを選択（AVIF > WebP > PNG/JPG）
4. 最適化された画像パスで標準の`<img>`要素を描画

## ベストプラクティス

- 常に`alt`属性を指定し、アクセシビリティを確保する
- 画像が装飾目的の場合は`alt=""`と空文字を指定する
- SPデバイス用の画像が必要な場合は`srcSp`を指定する
- パフォーマンス向上のために`width`と`height`を指定して画像のレイアウトシフトを防止する

## 注意点

- 画像URLが準備できるまで（画像フォーマットの検出中）は何も表示されません
- SVGファイルを使用する場合、フォーマット最適化は適用されません
- 画像パスは有効なURLまたは相対パスである必要があります 