# Builder.io Publish 使い方ガイド

> 作成日：2025年10月16日
> 対象：Builder.io Publishの基本的な使い方が分からない方向け
> 情報源：Builder.io公式ドキュメント、コミュニティ情報

## Builder.io Publishとは

Builder.io PublishはVisual Headless CMSとして機能するサービスです。従来のCMSと違い、**ビジュアルエディター**でコンテンツを作成しながら、**ヘッドレス（API駆動）**でコンテンツを配信できます。

### 主な特徴
- **ドラッグ&ドロップ**でページ作成
- **AI支援**によるコンテンツ生成
- **ヘッドレス配信**（任意のフロントエンドで利用可能）
- **マーケター**でも開発者なしでコンテンツ更新可能

## 1. アカウント作成から開始まで

### Step 1: アカウント作成
1. **https://builder.io** にアクセス
2. **「Sign Up」**ボタンをクリック
3. **メールアドレス**または**OAuth**（Google/GitHub等）で登録
4. **チーム情報**を入力（任意）

### Step 2: Space Type（スペースタイプ）の選択

Builder.ioには2つのメインスペースがあります：

#### Publish Space（今回の対象）
- **用途**: コンテンツ管理・ページ作成
- **機能**: ビジュアルエディター + ヘッドレスCMS
- **対象**: マーケター、コンテンツ作成者

#### Fusion Space（参考）
- **用途**: コード生成・アプリ開発
- **機能**: AI駆動コード生成
- **対象**: エンジニア、プロダクトチーム

**選択**: 「**Publish Space**」を選択

### Step 3: API Key取得
1. **Space Settings**（スペース設定）に移動
2. **「Public API Key」**セクションを探す
3. **API Key**をコピー（後で使用）

## 2. 環境セットアップ（フロントエンド連携）

### Next.js プロジェクトの場合

#### 前提条件
- **Node.js**がインストール済み
- **Next.js**プロジェクトが存在

#### セットアップ手順
```bash
# Builder.io SDK インストール
npm install @builder.io/react

# または
yarn add @builder.io/react
```

#### 環境変数設定
```bash
# .env.local ファイルに追加
NEXT_PUBLIC_BUILDER_API_KEY=your_api_key_here
```

#### プレビューURL設定
1. Builder.io管理画面で**「Page Model」**セクションに移動
2. **Settings Icon**（歯車アイコン）をクリック
3. **「Options」**タブを選択
4. **Preview URL**に`http://localhost:3000/`を入力
5. **「Save」**ボタンで保存

### その他のフレームワーク
- **React**: `@builder.io/react`
- **Vue**: `@builder.io/vue`
- **Angular**: `@builder.io/angular`
- **Svelte**: `@builder.io/svelte`

## 3. Visual Editor でコンテンツ作成

### Step 1: Editor にアクセス

#### 方法1: Builder Dev Tool経由
1. **ブラウザ**でローカル開発サーバー（localhost:3000等）にアクセス
2. **画面右下**の「**Builder Dev Tool Icon**」をクリック
3. **「Add Builder Page」**をクリック
4. **Builder Visual Editor**が開く

#### 方法2: Builder.io管理画面から直接
1. **builder.io**にログイン
2. **Publish Space**を選択
3. **「+ New Entry」**をクリック

### Step 2: ページ作成の基本

#### ページ情報入力
1. **Page Name**（ページ名）を入力
   - 例：「ホームページ」「商品紹介」
2. **URL/Slug**を設定
   - 例：`/`, `/products`, `/about`
3. **「Create」**ボタンをクリック

#### Visual Editor の基本操作

##### コンポーネント追加
1. **左サイドバー**から希望のコンポーネントを選択
   - **Text**: テキストブロック
   - **Image**: 画像
   - **Button**: ボタン
   - **Hero**: ヒーローセクション
   - **Columns**: カラムレイアウト

2. **ドラッグ&ドロップ**でページにコンポーネントを配置

##### スタイリング
1. 配置したコンポーネントを**クリック**
2. **右サイドバー**でプロパティを編集
   - **Design**: 色、フォント、サイズ等
   - **Advanced**: CSS詳細設定
   - **Animation**: アニメーション効果

##### レスポンシブ対応
1. **画面上部**のデバイスアイコンで表示切り替え
   - **Desktop**: デスクトップ
   - **Tablet**: タブレット
   - **Mobile**: スマートフォン
2. 各デバイスで個別にスタイル調整可能

### Step 3: AI機能活用

#### AI Content Generation
1. **テキストコンポーネント**を選択
2. **「Generate with AI」**ボタンをクリック
3. **プロンプト**を入力（例：「会社紹介文を生成」）
4. **生成された内容**を確認・編集

#### AI Image Generation
1. **画像コンポーネント**を選択
2. **「Generate with AI」**オプションを選択
3. **画像の説明**を入力（例：「モダンなオフィス風景」）
4. **生成された画像**から選択

## 4. 公開・配信

### Step 1: プレビュー確認
1. **「Preview」**ボタンをクリック
2. **各デバイス**での表示を確認
3. **リンク・ボタン**の動作テスト

### Step 2: 公開
1. **右上の「Publish」**ボタンをクリック
2. **公開設定**を確認
   - **Target Audience**: 対象オーディエンス
   - **Scheduling**: 公開スケジュール（任意）
3. **「Publish Now」**で即座に公開

### Step 3: コンテンツ取得（フロントエンド側）

#### Next.js での実装例
```jsx
import { builder, BuilderComponent } from '@builder.io/react';

// Builder API Key 設定
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY);

export default function Page() {
  const [builderContent, setBuilderContent] = useState(null);

  useEffect(() => {
    // Builder からコンテンツ取得
    builder.get('page', { url: '/' })
      .promise()
      .then(setBuilderContent);
  }, []);

  return (
    <div>
      <BuilderComponent model="page" content={builderContent} />
    </div>
  );
}
```

## 5. よくある使用パターン

### パターン1: マーケティングランディングページ
1. **Hero Section**: キャッチコピー + CTA
2. **Features**: 機能紹介（3カラム）
3. **Testimonials**: お客様の声
4. **CTA**: 最終行動促進

### パターン2: ブログ・記事ページ
1. **Header**: タイトル・メタ情報
2. **Content**: Rich Text Editor活用
3. **Related**: 関連記事リンク
4. **Newsletter**: メルマガ登録

### パターン3: 商品紹介ページ
1. **Product Hero**: 商品画像・基本情報
2. **Description**: 詳細説明
3. **Features**: 特徴一覧
4. **Purchase**: 購入ボタン

## 6. チーム管理・権限設定

### メンバー招待
1. **Space Settings** → **Members**
2. **「Invite Member」**をクリック
3. **メールアドレス**と**権限**を設定
   - **Admin**: 全権限
   - **Editor**: コンテンツ編集のみ
   - **Viewer**: 閲覧のみ

### コンテンツ承認フロー
1. **「Request Review」**でレビュー依頼
2. **管理者**が承認・却下
3. **承認後**に公開可能

## 7. 料金・プラン

### 無料プラン
- **1 Space**
- **1 Standard Role**
- **10,000 Visual Views**
- **基本機能**利用可能

### 有料プラン
- **Basic**: $19/月〜
- **詳細機能**・**追加容量**・**サポート**

## 8. トラブルシューティング

### よくある問題

#### プレビューが表示されない
**原因**: Preview URL の設定ミス
**解決**: `http://localhost:3000/` 形式で正確に入力

#### コンテンツが反映されない
**原因**: API Key の設定ミス
**解決**: 環境変数とBuilder設定の確認

#### ビルドエラー
**原因**: Turbopack との競合（Next.js）
**解決**: Turbopack を無効化

## 9. まとめ

Builder.io Publishは以下の手順で簡単に始められます：

1. **アカウント作成** → Publish Space選択
2. **API Key取得** → フロントエンド設定
3. **Visual Editor** → ドラッグ&ドロップでコンテンツ作成
4. **公開** → 即座にライブ配信

**特に有効なシーン**：
- **マーケティング**キャンペーンページの迅速作成
- **非エンジニア**でのコンテンツ更新
- **A/Bテスト**用ページの量産
- **多言語サイト**のコンテンツ管理

**次のステップ**：
実際にアカウントを作成して、シンプルなランディングページから始めてみることをお勧めします。

---

*詳細な最新情報は [Builder.io公式ドキュメント](https://www.builder.io/c/docs) をご確認ください。*