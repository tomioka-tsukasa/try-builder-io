# Tools
## ImagesOptimize

画像最適化ツールの使い方

### 機能

- 画像を WebP、AVIF、最適化された元形式(JPG/PNG)に変換
- SVG ファイルの最適化
- キャッシュ機能による差分最適化

### 使い方

1. `image-original` ディレクトリに最適化したい画像を配置します
2. 以下のコマンドを実行:

```bash
# ツールディレクトリ内で実行する場合
npm run cvi
# または
yarn cvi

# プロジェクトルートから実行する場合
npm run cvi
# または
yarn cvi
```

### 設定

`configImage.yml` ファイルで以下の設定が可能:

- 入出力ディレクトリの指定
- 圧縮率・品質の調整
- 出力形式の選択（WebP/AVIF/オリジナル）

## VideoOptimize

動画最適化ツールの使い方

```bash
# ツールディレクトリ内で実行する場合
npm run cvv
# または
yarn cvv

# プロジェクトルートから実行する場合
npm run cvv
# または
yarn cvv
```
```
