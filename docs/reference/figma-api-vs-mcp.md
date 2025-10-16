# Figma REST API vs MCP Server の比較

## 概要

Figmaのデザインデータを取得してコード生成する際の、REST APIアプローチとMCP Serverアプローチの違いについて詳しく解説します。両方とも最終的にはClaude Codeがコード生成を行いますが、**情報の質と精度に大きな違い**があります。

## アプローチの違い

### Figma REST API アプローチ
```
Figma Design → REST API → 生JSONデータ → Claude Code → コード生成
```

### MCP Server アプローチ
```
Figma Design → MCP Server → 最適化済みデータ → Claude Code → コード生成
```

## データ形式の詳細比較

### 1. Figma REST API JSON（生データ）

**特徴**: デザイナー視点の完全な設計情報

```json
{
  "id": "570:37938",
  "name": "Body",
  "type": "FRAME",
  "scrollBehavior": "SCROLLS",
  "absoluteBoundingBox": {
    "x": 29096.0,
    "y": 1671.0,
    "width": 354.0,
    "height": 32.0
  },
  "fills": [{
    "blendMode": "NORMAL",
    "type": "SOLID",
    "color": {
      "r": 0.31764706969261169,
      "g": 0.32156863808631897,
      "b": 0.32156863808631897,
      "a": 1.0
    }
  }],
  "style": {
    "fontFamily": "A P-OTF Midashi Go MB31 Pr6N",
    "fontPostScriptName": "PMidashiGoMB31Pr6N-Bold",
    "fontWeight": 600,
    "fontSize": 21.0
  }
}
```

**含まれる情報**：
- デザインツール固有の詳細情報
- 絶対座標システム
- RGBA色値（0-1範囲）
- PostScriptフォント名
- Figma固有のプロパティ

### 2. MCP Server（開発最適化データ）

**特徴**: 開発者向けに最適化された情報

#### XML構造データ
```xml
<frame id="570:37920" name="Contents + Index UI" x="0" y="0" width="1512" height="889">
  <frame id="570:37921" name="Contents" x="0" y="0" width="1512" height="889">
    <frame id="570:37938" name="Body" x="100" y="0" width="1212" height="549">
      <!-- 階層構造が明確 -->
    </frame>
  </frame>
</frame>
```

#### 生成可能なコード例
```javascript
export default function ContentsIndexUi() {
  return (
    <div className="content-stretch flex items-start relative size-full"
         data-name="Contents + Index UI"
         data-node-id="570:37920">
      <div className="leading-[0] relative shrink-0 text-[#515252] text-[21px] w-[354px]">
        <p className="leading-[1.5]">テキストダミー</p>
      </div>
    </div>
  );
}
```

**含まれる情報**：
- CSS準拠の相対座標
- HEX色値（#515252）
- Web標準フォント名
- TailwindCSS/標準CSSクラス
- 最適化されたHTML構造

## Claude Code による解釈精度の違い

### REST API JSONの場合：Claude が推測・変換が必要

#### 1. 座標変換
```json
// 入力データ
"absoluteBoundingBox": { "x": 29096.0, "y": 1671.0 }

// Claude が推測して生成
position: 'absolute',
left: '100px',  // 複雑な計算が必要
top: '170px'    // 他要素との相対位置を推測
```

#### 2. 色変換
```json
// 入力データ
"color": {
  "r": 0.31764706969261169,
  "g": 0.32156863808631897,
  "b": 0.32156863808631897
}

// Claude が変換
color: '#515252'  // RGBA → HEX変換（精度に限界）
```

### MCP Server の場合：最適化済みデータを受信

#### 1. 適切な座標
```javascript
// 既に最適化済み
className="absolute bottom-0 left-0 top-[-120px]"
style={{ height: "calc(100% + 120px)" }}
```

#### 2. 適切な色
```javascript
// 既にHEX形式
className="text-[#515252]"
```

## 実装品質の違い

### REST API アプローチの課題

1. **精度の限界**: 990行のJSONから Claude が構造を理解
2. **変換エラー**: RGBA→HEX、座標→CSS変換での誤差
3. **レイアウト推測**: 絶対座標からFlexbox推測の不正確性
4. **フォント問題**: PostScript名からCSS font-family推測

#### 生成されるコード例（品質が低い）
```javascript
// REST API ベースでの生成例
<div style={{
  position: 'absolute',
  left: 100,
  top: 170,
  width: 354,
  height: 32,
  color: '#515151', // 色変換の微妙な誤差
  fontSize: 21,
  fontFamily: 'sans-serif' // フォント推測の限界
}}>
  テキストダミー
</div>
```

### MCP Server アプローチの優位性

1. **Figma公式の最適化**: Figma開発チームによる開発者向け情報変換
2. **開発者視点**: Web標準に準拠したデータ提供
3. **CSS最適化**: 効率的で保守しやすいスタイル
4. **レスポンシブ設計**: vw単位、calc()の適切な活用

#### 生成されるコード例（品質が高い）
```javascript
// MCP Server ベースでの生成例
<div className="leading-[0] relative shrink-0 text-[#515252] text-[21px] w-[354px]"
     data-node-id="584:6731">
  <p className="leading-[1.5]">テキストダミー</p>
</div>
```

## 役割分担の明確化

### Figma MCP Server の実際の役割
- **デザイン情報の最適化**: 生データを開発者向けに変換
- **Web標準への適応**: CSS、HTML準拠の形式で提供
- **構造の整理**: 階層関係の明確化
- **不要情報の除外**: 開発に不要なデザイン詳細の削減

### Claude Code の実際の役割
- **コード生成**: 最適化された情報から実際のコードを生成
- **フレームワーク対応**: React、Vue等への変換
- **プロジェクト適応**: 既存コードベースに合わせた調整
- **スタイルシステム適用**: Tailwind、CSS Modules等への対応

## 使い分け指針

### REST API を使うべき場合
- **カスタム処理**: 独自のデザインデータ処理ロジックが必要
- **詳細解析**: Figma固有の設計情報が必要
- **バッチ処理**: 大量のデザインファイルの一括処理

### MCP Server を使うべき場合
- **コード生成**: デザインから実装コードへの変換
- **プロトタイピング**: 迅速な実装検証
- **チーム開発**: デザイナー・開発者間の効率的な連携
- **品質重視**: 高精度な実装が求められる場合

## まとめ

**Figma REST API**: 完全な設計情報へのアクセス（開発者が解釈・変換）
**Figma MCP Server**: 開発向け最適化済み情報の提供（Claude が効率的にコード生成）

MCP Server アプローチの方が、**Figma公式による開発者向け情報最適化**により、実装精度と効率性が大幅に向上します。

**コード生成においては、MCP Server + Claude Code の組み合わせが圧倒的に優秀**です。

### 重要な理解
- **MCP Server**: デザイン情報の最適化・提供サービス
- **Claude Code**: 実際のコード生成エンジン
- **連携による効果**: Figma公式最適化 + AIコード生成の組み合わせ