# Figma MCP 接続データ形式と対応言語

## 概要

Claude Code を通じて Figma MCP Server から取得できる情報の詳細と、生成可能なコード形式について説明します。

## Figma MCP Server とClaude Code の連携仕組み

### 正確な理解：デザイン情報提供とコード生成の分離

**Figma側は事前にコードを保存していません**。また、**Figma MCP Server もコード生成は行いません**。以下が正確なプロセスです：

```
1. Figma Desktop App
   ↓ (デザインデータ保持)
2. Figma MCP Server (localhost:3845)
   ↓ (MCPプロトコル経由でデザイン情報提供)
3. Claude Code
   ↓ (受信したデザイン情報からコード生成)
```

### 各コンポーネントの実際の役割

#### Figma Desktop App
**保持しているもの**：
- **デザインデータのみ**: レイヤー構造、位置、サイズ、色、テキスト、画像等
- **生のデザイン情報**: ベクターデータ、スタイル定義、コンポーネント階層
- **メタデータ**: ノード関係、表示状態、変数定義

#### Figma MCP Server
**デザイン情報提供サービス**として機能：

1. **デザインデータ抽出**: Figma Desktop App からデザイン情報を取得
2. **MCPプロトコル通信**: JSON-RPC ベースでClaude Code と通信
3. **データ形式提供**: XML (メタデータ)、JSON (変数)、PNG (スクリーンショット) 等
4. **アセットホスティング**: 画像をローカルサーバー（localhost:3845）でホスト

**注意**: コード生成は行わず、あくまで**デザイン情報の提供のみ**

#### Claude Code
**実際のコード生成エンジン**として機能：

1. **デザイン情報受信**: MCP Server から XML、JSON、画像等を受信
2. **フレームワーク対応**: clientFrameworks パラメータに基づいてReact、Vue等を選択
3. **スタイル生成**: clientLanguages や既存プロジェクト構成に基づいてTailwind CSS等を適用
4. **コード出力**: 完全なコンポーネントコードを生成

### リアルタイム動作の実態

- **リアルタイム反映**: Figmaでデザイン変更 → MCP Server が新しい情報提供 → Claude Code が新しいコード生成
- **フレームワーク切り替え**: Claude Code がパラメータに応じて異なるコードを生成
- **スタイル自動検出**: Claude Code がプロジェクトのスタイルシステムを解析して適切なコード生成

つまり、**Figma MCP Server = デザイン情報提供サービス**、**Claude Code = コード生成エンジン**です。

## 参考情報源

この理解は以下の公式情報源に基づいています：

### 公式ドキュメント
- [Figma Blog: Introducing our Dev Mode MCP server](https://www.figma.com/blog/introducing-figmas-dev-mode-mcp-server/) - 2024年ベータリリース発表
- [Figma Help Center: Guide to the Dev Mode MCP Server](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Dev-Mode-MCP-Server) - 技術仕様と設定方法
- [Model Context Protocol 公式仕様](https://modelcontextprotocol.io/docs/learn/architecture) - MCPアーキテクチャの詳細

### 技術記事・解説
- [Figma MCP: Complete Guide to Design-to-Code Automation](https://www.seamgen.com/blog/figma-mcp-complete-guide-to-design-to-code-automation)
- [Design to Code with the Figma MCP Server](https://www.builder.io/blog/figma-mcp-server)
- [Figma Dev Mode MCP Server: Generate Code from Figma Designs](https://www.scriptbyai.com/figma-dev-mode-mcp/)

### 仕組みの確認方法
- **実動作観察**: Figmaでデザイン変更 → 即座にコード変更反映
- **パラメータテスト**: clientFrameworks切り替えで異なるコード出力
- **ローカル通信**: `http://127.0.0.1:3845/mcp` での情報提供確認

## 取得可能なデータ形式

### 1. メタデータ（XML形式）

**取得方法**: `mcp__figma-dev-mode-mcp-server__get_metadata`

```xml
<frame id="570:37920" name="Contents + Index UI" x="0" y="0" width="1512" height="889">
  <frame id="570:37921" name="Contents" x="0" y="0" width="1512" height="889">
    <frame id="570:37922" name="■" x="0" y="5.684341886080802e-14" width="1562.0001997890795" height="888.9992210270439" />
    <frame id="570:37935" name="movie" x="0" y="170" width="1312" height="549">
      <instance id="570:37936" name="Left Bar" x="0" y="0" width="50" height="549" hidden="true" />
      <instance id="570:37937" name="Title" x="100" y="0" width="900" height="57" hidden="true" />
      <frame id="570:37938" name="Body" x="100" y="0" width="1212" height="549">
        <!-- さらなる階層構造 -->
      </frame>
    </frame>
  </frame>
</frame>
```

**含まれる情報**：
- **ノードID**: `id="570:37920"` - 一意のFigmaノード識別子
- **レイヤー名**: `name="Contents + Index UI"` - Figmaで設定したレイヤー名
- **位置情報**: `x="0" y="0"` - 親要素からの相対座標
- **サイズ情報**: `width="1512" height="889"` - 要素のピクセル寸法
- **階層構造**: ネストしたXML構造でコンポーネントの親子関係を表現
- **表示状態**: `hidden="true"` - 非表示要素の情報

### 2. デザイン変数（JSON形式）

**取得方法**: `mcp__figma-dev-mode-mcp-server__get_variable_defs`

```json
{
  "Extra_Medium_#515252": "#515252",
  "Main_Dark_#000000": "#000000"
}
```

**含まれる情報**：
- **変数名**: Figma で定義されたデザイントークン名
- **カラー値**: HEX形式のカラー値
- **デザインシステム**: 一貫したスタイル管理のための定義

### 3. 生成コード（JavaScript/TypeScript）

**取得方法**: `mcp__figma-dev-mode-mcp-server__get_code`

```javascript
const img = "http://localhost:3845/assets/ad89cca48a4f5ea415d85c91d56e54b9de58d4b3.png";
const img1 = "http://localhost:3845/assets/40aa15a7e813bc19c0db61cfda5fe1ff05332cb6.svg";

export default function ContentsIndexUi() {
  return (
    <div className="content-stretch flex items-start relative size-full"
         data-name="Contents + Index UI"
         data-node-id="570:37920">
      <div className="basis-0 box-border content-stretch flex flex-col gap-[100px] grow items-start min-h-px min-w-px pl-0 pr-[200px] py-[170px] relative shrink-0"
           data-name="Contents"
           data-node-id="570:37921">
        {/* Tailwind CSSクラスを使用した構造 */}
        <div className="absolute bg-[rgba(255,255,255,0.5)] bottom-0 left-0 right-[-50px] top-0"
             data-name="■"
             data-node-id="570:37922" />
        {/* さらなる構造... */}
      </div>
    </div>
  );
}
```

**含まれる情報**：
- **画像アセット**: `const img = "http://localhost:3845/assets/..."` - ローカルサーバーの画像URL
- **Tailwind CSSクラス**: レスポンシブでモダンなCSSクラス
- **データ属性**: `data-node-id="570:37920"` - 元のFigmaノードとの関連付け
- **完全なコンポーネント**: そのまま使用可能なReactコンポーネント
- **レイアウト情報**: Flexbox、Grid、位置指定などの詳細なレイアウト

**追加のメタ情報**：
```
Use tailwind if available, otherwise detect the project's styling approach (e.g. CSS in JS, CSS Modules, theme providers, etc) and follow it. Use vanilla CSS only if no system is detected. Do not install any dependencies.

Node ids have been added to the code as data attributes, e.g. `data-node-id="1:2"`.

These variables are contained in the design: Extra_Medium_#515252: #515252, Main_Dark_#000000: #000000.

Image assets are stored on a localhost server. Clients can use these images directly in code as a way to view the image assets the same way they would other remote servers.
```

### 4. スクリーンショット（PNG画像）

**取得方法**: `mcp__figma-dev-mode-mcp-server__get_screenshot`

- 選択されたノードの視覚的なスクリーンショット
- PNG形式で出力
- プレビュー、ドキュメント、デザインレビューに活用

### 5. Code Connect マッピング（JSON形式）

**取得方法**: `mcp__figma-dev-mode-mcp-server__get_code_connect_map`

```json
{
  "1:2": {
    "codeConnectSrc": "https://github.com/foo/components/Button.tsx",
    "codeConnectName": "Button"
  }
}
```

**含まれる情報**：
- **ノードID**: Figmaのノード識別子
- **コード参照**: 既存コンポーネントのGitHubリンクやファイルパス
- **コンポーネント名**: 実際のコード内でのコンポーネント名

## サポートされている言語・フレームワーク

### プログラミング言語

#### 主要サポート
- **JavaScript** - ES6+対応、モジュール形式
- **TypeScript** - 型定義付きコード生成
- **HTML/CSS** - 純粋なWebstandards

#### モバイル・デスクトップ
- **Dart** (Flutter)
- **Swift** (SwiftUI)
- **Kotlin** (Jetpack Compose)

### Webフレームワーク

#### React エコシステム
- **React** - 関数コンポーネント、Hooks対応
- **Next.js** - SSG/SSR最適化
- **Gatsby** - 静的サイト生成

#### その他のフレームワーク
- **Vue.js** - Composition API対応
- **Angular** - コンポーネント形式
- **Svelte** - コンパイル時最適化

### CSSフレームワーク・手法

#### 推奨（デフォルト）
- **Tailwind CSS** - ユーティリティファーストアプローチ
  - レスポンシブデザイン自動対応
  - カスタムプロパティサポート
  - プリフライト正規化

#### 自動検出対応
- **CSS Modules** - スコープ化されたCSS
- **CSS-in-JS** - styled-components、emotion等
- **SCSS/Sass** - プリプロセッサー
- **Vanilla CSS** - 標準CSS（フォールバック）

### 特殊機能

#### デザインシステム
- **デザイントークン**: Figma変数の自動変換
- **コンポーネントライブラリ**: 既存コンポーネントとの連携
- **ブランドガイドライン**: 一貫性保持

#### アクセシビリティ
- **ARIA属性**: 自動付与
- **セマンティックHTML**: 適切なタグ選択
- **キーボードナビゲーション**: フォーカス管理

#### レスポンシブデザイン
- **ブレイクポイント**: 自動検出と適用
- **フルードレイアウト**: 柔軟なサイズ調整
- **デバイス対応**: モバイルファーストアプローチ

## パラメーター設定

### 基本パラメーター

```javascript
// 基本的な呼び出し例
mcp__figma_dev_mode_mcp_server__get_code({
  nodeId: "570:37920",              // 対象ノードID（省略時は現在選択中）
  clientFrameworks: "react",        // 使用フレームワーク
  clientLanguages: "typescript"     // 使用言語
});
```

### フレームワーク指定例

```javascript
// React + TypeScript
clientFrameworks: "react"
clientLanguages: "typescript,javascript"

// Vue.js + JavaScript
clientFrameworks: "vue"
clientLanguages: "javascript"

// Flutter
clientFrameworks: "flutter"
clientLanguages: "dart"

// 複数フレームワーク
clientFrameworks: "react,vue"
clientLanguages: "typescript,javascript"
```

### 最適化のヒント

1. **プロジェクトコンテキスト**: 既存プロジェクトの設定を自動検出
2. **依存関係**: 追加のパッケージインストールは不要
3. **カスタマイズ**: 生成コードは手動調整可能
4. **バージョン管理**: data-node-id によるFigmaとの関連付け保持

## 注意事項

- **ローカルアセット**: 画像は `localhost:3845` でホストされる
- **ネットワーク**: Figma Desktop App起動中のみアクセス可能
- **ノード選択**: Figmaで選択中の要素が自動的に対象になる
- **リアルタイム**: Figmaでの変更がすぐに反映される