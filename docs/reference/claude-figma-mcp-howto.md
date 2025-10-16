# Claude Code と Figma MCP Server の統合

## 概要

Claude Code では、Figma MCP Server を通じて Figma Desktop App と直接連携できます。これにより、Figmaデザインからコード生成、スクリーンショット取得、メタデータ抽出などが可能になります。

## Claude Code と Claude Desktop の Figma MCPサーバー接続の違い

### Claude Code
- **HTTP Transport対応のMCP Clientが内蔵**されている
- 外部設定（`claude_desktop_config.json`）は**不要**
- `mcp-remote` などの追加ツールは**不要**
- Figma Desktop App が起動していれば即座に利用可能

#### 必要な要件

1. **Figma Desktop App が起動している**
2. **対象のFigmaファイルがデスクトップアプリで開かれている**
3. **Dev Mode でアクセス可能なファイル**

#### 不要な設定

- ❌ Figmaアクセストークン
- ❌ `claude_desktop_config.json` での追加設定
- ❌ 外部MCPサーバーのセットアップ
- ❌ `mcp-remote` などの変換ツール

### Claude Desktop
- **Stdio Transport のみサポート**（直接プロセス通信）
- Figma MCP ServerはHTTP Transportで動作するため直接接続不可
- `mcp-remote` による**トランスポート変換が必要**：
  - HTTP Transport → Stdio Transport変換
  - 認証処理とプロキシ機能
  - MCPクライアント・サーバー間のブリッジ

## MCPアーキテクチャの理解

### MCPの基本構成要素

[Model Context Protocol (MCP)](https://modelcontextprotocol.io/docs/learn/architecture) では、以下の3つの主要コンポーネントで構成されます：

1. **MCP Host**: AI アプリケーション（Claude Code）
2. **MCP Client**: サーバーとの接続を管理（Claude Code内）
3. **MCP Server**: コンテキストを提供（Figma Desktop App内）

### トランスポート層

MCPは2つの主要なトランスポート方式をサポートします：
- **Stdio Transport**: 直接プロセス通信
- **HTTP Transport**: リモートサーバー通信（認証付き）

## Claude Code と Figma の連携

```
Claude Code (MCP Host)
    ↓
MCP Client (Claude Code内蔵)
    ↓ HTTP Transport (localhost:3845)
MCP Server (Figma Desktop App内で起動)
    ↓
Figma Document (クラウド)
```

### 各コンポーネントの役割

#### 1. Claude Code (MCP Host)
- **MCP Client機能を内蔵**
- HTTP Transport経由でFigma MCP Serverと通信
- `mcp__figma-dev-mode-mcp-server__*` 関数でFigmaと連携
- 外部設定（`claude_desktop_config.json`）は不要

#### 2. MCP Client (Claude Code内蔵)
- Figma MCP Serverへの接続を管理
- HTTP Transport (localhost:3845) でFigma Desktop Appと通信
- MCPプロトコルに従ってリクエスト/レスポンスを処理

#### 3. Figma MCP Server (Figma Desktop App内で起動)
- **Figma Desktop Appが自動的にポート3845で起動**
- MCPプロトコルでツール、リソース、プロンプトを提供
- デザインデータの抽出とコード生成API を公開
- Dev Mode でアクティブな際に利用可能

#### 4. Figma Desktop App
- **必須要件**: デスクトップアプリが起動している必要あり
- MCP Server を内部で起動・管理
- Figma Document との同期とローカルキャッシュを提供
- ユーザーは事前にFigmaファイルを開いておく必要がある

### 主要な関数

#### `mcp__figma-dev-mode-mcp-server__get_code`
- 指定ノードからReact/HTML/CSSコードを生成
- Tailwind CSS対応
- データ属性でnode-idを付与

#### `mcp__figma-dev-mode-mcp-server__get_screenshot`
- ノードのスクリーンショットを取得
- PNG形式で出力

#### `mcp__figma-dev-mode-mcp-server__get_metadata`
- ノード構造をXML形式で取得
- レイヤー名、位置、サイズ情報を含む

#### `mcp__figma-dev-mode-mcp-server__get_variable_defs`
- Figma変数の定義を取得
- デザイントークンとして利用可能

#### `mcp__figma-dev-mode-mcp-server__get_code_connect_map`
- Code Connectの設定情報を取得
- 既存コンポーネントとの関連付け

#### `mcp__figma-dev-mode-mcp-server__create_design_system_rules`
- デザインシステムルールの生成
- プロジェクトの一貫性を保つためのガイドライン

### ノードIDの指定方法

#### 1. URL からの抽出
Figma URL: `https://figma.com/design/:fileKey/:fileName?node-id=1-2`
→ ノードID: `1:2`

#### 2. 直接指定
- 形式: `"123:456"` または `"123-456"`
- 例: `nodeId: "125:26"`

### 使用例

#### 1. 基本的なコード生成
```javascript
// 指定ノードからReactコンポーネントを生成
const result = await mcp__figma_dev_mode_mcp_server__get_code({
  nodeId: "125:26",
  clientFrameworks: "react",
  clientLanguages: "typescript,javascript"
});
```

#### 2. スクリーンショット取得
```javascript
// ノードの画像を取得
const screenshot = await mcp__figma_dev_mode_mcp_server__get_screenshot({
  nodeId: "125:26",
  clientFrameworks: "react",
  clientLanguages: "typescript,javascript"
});
```

## Claude Desktop での設定方法

Claude Desktop を使用する場合は、以下の複雑な設定が必要になります：

### 必要な要件
- **Figma**: Professional、Organization、またはEnterprise プラン
- **Claude**: ProまたはMaxプラン
- **Node.js**: mcp-remoteの実行に必要

### セットアップ手順

1. **Figma Desktop で Dev Mode を有効化**
  - Figma Desktop アプリを開く（ブラウザ版では動作しません）
  - デザインファイルを開く
  - 画面右上の `< >` ボタンまたは右下の "Dev Mode" をクリック
  - Dev Mode が有効になると、Figma が自動的にポート 3845 で MCP サーバーを起動

2. **Claude Desktop 設定ファイルの更新**

`~/Library/Application Support/Claude/claude_desktop_config.json` に以下を設定：

```json
{
    "mcpServers": {
        "figma-mcp": {
            "command": "/Users/YOUR_USERNAME/.volta/tools/image/node/24.0.2/bin/npx",
            "args": ["-y", "mcp-remote", "http://127.0.0.1:3845/mcp"],
            "env": {
                "PATH": "/Users/YOUR_USERNAME/.volta/tools/image/node/24.0.2/bin:/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin"
            }
        }
    }
}
```

### アーキテクチャ（Claude Desktop の場合）

```
Claude Desktop (MCP Host)
    ↓
MCP Client (Claude Desktop内蔵)
    ↓ Stdio Transport
mcp-remote (プロキシ)
    ↓ HTTP Transport (localhost:3845)
MCP Server (Figma Desktop App内で起動)
    ↓
Figma Document (クラウド)
```

mcp-remoteが**HTTP Transport → Stdio Transport変換**を行うことで、Claude Desktop（Stdio Transport）とFigma MCP Server（HTTP Transport）間の通信を可能にします。

### 参考資料

- [mcp-remote GitHub](https://github.com/geelen/mcp-remote)
- [Figma Dev Mode MCP ServerとClaude Desktopを連携させる](https://qiita.com/l_kei/items/c2aba274ad40134d677e)

## トラブルシューティング

### Figmaフォーラム｜Figma MCPが動作しない

[https://forum.figma.com/report-a-problem-6/figma-mcp-not-working-43506/index2.html](https://forum.figma.com/report-a-problem-6/figma-mcp-not-working-43506/index2.html)

### "Cannot connect to Figma Desktop App"
**原因**: Figma Desktop App が起動していない
**解決**: Figma Desktop App を起動し、対象ファイルを開く

### "Node not found"
**原因**: 指定されたノードIDが存在しない、またはファイルが開かれていない
**解決**:
- Figma Desktop App で正しいファイルを開く
- ノードIDを確認する

### "Permission denied"
**原因**: Dev Mode でアクセスできないファイル
**解決**:
- ファイルのオーナーまたは編集権限を確認
- Dev Mode にアクセス権限があることを確認
