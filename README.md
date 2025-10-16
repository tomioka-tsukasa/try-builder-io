# Builder.io 検証

React + TypeScript + Vite + Vanilla Extractで構築された検証用の環境です。

## Claudeセットアップ

1. `claude /init` 実行
2. 生成された `CLAUDE.md` に `/docs/claude-custom.md` を追加で読ませるような記述を追加

## 開発環境セットアップ

### 必要な環境
- Node.js 18以上
- Bun (推奨) または npm

### インストール

```bash
bun install
```

### 開発サーバー起動

```bash
bun run dev
```

開発サーバーが `http://localhost:5173` で起動します。

## ビルドコマンド

### 開発・テスト用ビルド
```bash
bun run build
```

### 納品用ビルド
```bash
bun run build:delivery
```
- **本番環境にデプロイする際はこちらを使用してください**
- デバッグページは除外されます
- `dist/` ディレクトリに最適化されたファイルが生成されます

## その他のコマンド

### リンター
```bash
bun run lint
```

### プレビュー
```bash
bun run preview
```

### 画像最適化
```bash
# 画像変換
bun run cvi

# 動画変換  
bun run cvv
```

## プロジェクト構造

```
src/
├── components/          # UIコンポーネント
├── pages/              # ページコンポーネント
├── styles/             # Vanilla Extractスタイル
├── store/              # 状態管理
└── assets/             # 静的ファイル
```

## デプロイ注意事項

- **必ず `bun run build:delivery` を使用してください**
- 生成されたファイルは `dist/` ディレクトリに出力されます
- デバッグページは本番環境には含まれません

## 技術スタック

- **React 19**: UIライブラリ
- **TypeScript**: 型安全性
- **Vite**: ビルドツール
- **Vanilla Extract**: CSS-in-JS
- **React Router**: ルーティング
- **Framer Motion**: アニメーション
