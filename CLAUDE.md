# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリでコード作業を行う際のガイダンスを提供します。

## 確認すべき別ファイルのドキュメント

@docs/claude-custom.md を参照して内容を把握

## 主要な開発コマンド

**パッケージマネージャー**: Bun（推奨）または npm

```bash
# 開発サーバー起動 (localhost:5173)
bun run dev

# 本番ビルド
bun run build

# 納品用ビルド（本番デプロイ用、デバッグページを除外）
bun run build:delivery

# リンター実行（自動修正付き）
bun run lint

# ビルド済みアプリケーションのプレビュー
bun run preview

# アセット最適化ツール
bun run cvi  # 画像変換
bun run cvv  # 動画変換
```

## アーキテクチャ概要

Figma連携テストを目的とした、React + TypeScript + Vite + Vanilla Extractで構築されたアプリケーションです。

### 主要技術
- **React 19** with TypeScript
- **Vite** カスタムマルチページ生成機能付きビルドツール
- **Vanilla Extract** CSS-in-JSスタイリング
- **React Router** クライアントサイドルーティング
- **Redux Toolkit** 状態管理
- **Framer Motion** アニメーション

### ディレクトリ構成
```
src/
├── components/
│   ├── ui/              # 再利用可能なUIコンポーネント（Button, Image等）
│   ├── utils/           # ユーティリティコンポーネント（ImgOpt, ScrollRestoration）
│   ├── header/          # ヘッダーコンポーネント
│   ├── footer/          # フッターコンポーネント
│   └── meta/            # メタタグとGTMコンポーネント
├── pages/               # ページコンポーネント（Home, FigmaTest01-04）
├── layout/              # レイアウトコンポーネント（Basicレイアウト）
├── store/               # Reduxストアとスライス
├── styles/              # グローバルスタイルとデザイントークン
├── hooks/               # カスタムReactフック
├── utils/               # ユーティリティ関数
├── lib/
│   └── figma-library/   # Figmaデザインデータとコンポーネント
└── types/               # TypeScript型定義
```

### ルーティングシステム
ルートは `src/store/directory/directory.ts` で一元管理：
- **DM** オブジェクトにすべてのルートパスを定義
- **ROUTES_META** で各ルートのメタタグを定義
- ビルド時に適切なメタタグ付きでページが自動生成される

### スタイリングアーキテクチャ
- **Vanilla Extract**（.css.tsファイル）でコンポーネントスタイル
- **デザイントークン** は `src/lib/figma-library/design-data.json` に定義
- **レスポンシブ設定** は `src/styles/responsive.config.ts` に定義
- **グローバルスタイル** は `src/styles/global.css.ts` に定義

### ビルドシステム
- **標準ビルド**: 全ページとデバッグ機能を含む
- **納品用ビルド**: 本番最適化済み、デバッグページを除外
- カスタムViteプラグインで各ルート用のHTMLファイルを複数生成
- ルートごとに自動的にメタタグを注入

### 状態管理
- Reduxストアは `src/store/` に配置
- カスタムフックは `src/store/hook.ts` に定義
- プロバイダー設定は `src/store/provider.tsx` で管理

### アセット最適化
- 画像最適化ツールは `tools/asseets-opt/` に配置
- レスポンシブ画像用のカスタムImgOptコンポーネント
- 動画変換ユーティリティも利用可能

## 重要な開発注意事項

- 本番デプロイ時は必ず **納品用ビルド**（`bun run build:delivery`）を使用
- コンポーネントスタイルはVanilla Extractを使用 - 新しいスタイル作成前に既存パターンを確認
- 新しいページを追加する際は `directory.ts` でルート定義を更新
- メタタグはビルド時にROUTES_METAから自動生成される
- Figmaデザイントークンは `design-data.json` で管理
- レスポンシブブレークポイントは `responsive.config.ts` で定義
