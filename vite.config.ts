import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import { BASE_ROOT, ROUTES_META, DM } from './src/store/directory/directory'
import Unfonts from 'unplugin-fonts/vite'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// デリバリービルドかどうかを判定（デバッグページを除外するかどうか）
const isDeliveryBuild = process.env.BUILD_TARGET === 'delivery'

// 基本のルート (directory.ts の DM から自動生成)
const baseRoutes = Object.values(DM).map(path => {
  // "/" は空文字列に、"/figma-test-03" は "figma-test-03" に変換
  return path === '/' ? '' : path.slice(1)
})

// ルートキーとルートパスのマッピング
const ROUTE_KEY_MAPPING = {
  '': 'TOP',
  'figma-test-03': 'FIGMA_TEST_03',
} as const

// メタタグを生成する関数
const generateMetaTags = (route: string) => {
  const routeKey = ROUTE_KEY_MAPPING[route as keyof typeof ROUTE_KEY_MAPPING]

  // 該当するルートキーがない場合はTOPのメタデータを使用
  const metaData = routeKey && ROUTES_META[routeKey as keyof typeof ROUTES_META]
    ? ROUTES_META[routeKey as keyof typeof ROUTES_META].meta
    : ROUTES_META.TOP.meta

  return `
    <meta name="description" content="${metaData.description}" />
    <meta property="og:type" content="${metaData.ogType}" />
    <meta property="og:url" content="${metaData.canonicalUrl}" />
    <meta property="og:title" content="${metaData.ogTitle}" />
    <meta property="og:site_name" content="${metaData.ogSiteName}" />
    <meta property="og:description" content="${metaData.ogDescription}" />
    <meta property="og:image" content="${metaData.ogImage}" />
    <meta name="twitter:card" content="${metaData.twitterCard}" />
    <meta name="twitter:url" content="${metaData.canonicalUrl}" />
    <meta name="twitter:title" content="${metaData.ogTitle}" />
    <meta name="twitter:description" content="${metaData.ogDescription}" />
    <meta name="twitter:image" content="${metaData.ogImage}" />
    <link rel="canonical" href="${metaData.canonicalUrl}" />`
}

// ビルド設定
const BUILD_CONFIG = {
  OUT_DIR: 'dist/',
  ASSETS_DIR: 'assets',
  ROUTES: isDeliveryBuild ? baseRoutes : [...baseRoutes]
} as const

// https://vite.dev/config/
export default defineConfig({
  base: BASE_ROOT,
  plugins: [
    react(),
    Unfonts({
      google: {
        families: [
          {
            name: 'Noto Sans JP',
            styles: 'wght@400..900',
            defer: false,
          }
        ],
        display: 'swap',
        preconnect: true,
      }
    }),
    vanillaExtractPlugin({
      identifiers: 'debug',
    }),
    {
      name: 'copy-index-html',
      closeBundle: () => {
        const distDir = path.resolve(__dirname, BUILD_CONFIG.OUT_DIR)
        const originalIndexPath = path.resolve(distDir, 'index.html')
        const originalHtml = fs.readFileSync(originalIndexPath, 'utf-8')

        // 各ルートディレクトリにindex.htmlをコピー
        BUILD_CONFIG.ROUTES.forEach(route => {
          let targetDir: string
          let targetHtml = originalHtml

          if (route === '') {
            // ルートディレクトリの場合は dist/ ディレクトリ自体
            targetDir = distDir
          } else {
            targetDir = path.resolve(distDir, route)
            if (!fs.existsSync(targetDir)) {
              fs.mkdirSync(targetDir, { recursive: true })
            }
          }

          // メタタグを<head>内に挿入
          const metaTags = generateMetaTags(route)
          if (metaTags) {
            // </head>タグの直前にメタタグを挿入
            targetHtml = targetHtml.replace('</head>', `${metaTags}\n  </head>`)
          }

          // タイトルタグを更新
          const routeKey = ROUTE_KEY_MAPPING[route as keyof typeof ROUTE_KEY_MAPPING]
          const metaData = routeKey && ROUTES_META[routeKey as keyof typeof ROUTES_META]
            ? ROUTES_META[routeKey as keyof typeof ROUTES_META].meta
            : ROUTES_META.TOP.meta
          targetHtml = targetHtml.replace(/<title>.*?<\/title>/, `<title>${metaData.title}</title>`)

          // 修正されたHTMLを保存
          fs.writeFileSync(path.resolve(targetDir, 'index.html'), targetHtml)
        })
      }
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    host: true,
    port: 5173
  },
  build: {
    minify: 'terser',
    terserOptions: {
      mangle: true,
      compress: {
        evaluate: false,
        inline: false,
        drop_console: true
      },
      format: {
        comments: false
      }
    },
    cssCodeSplit: true,
    assetsInlineLimit: 0,
    outDir: BUILD_CONFIG.OUT_DIR,
    assetsDir: BUILD_CONFIG.ASSETS_DIR
  }
})
