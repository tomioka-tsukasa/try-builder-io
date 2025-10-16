import crypto from 'crypto'
import fs from 'fs'
import * as yaml from 'js-yaml'
import path from 'path'
import sharp from 'sharp'
import { optimize } from 'svgo'

/**
 * 画像最適化ツール
 */

// 設定ファイルの読み込み
const CONFIG_PATH = './configImage.yml'
const CACHE_PATH = './cacheImage.json'

let config
try {
  config = yaml.load(fs.readFileSync(CONFIG_PATH, 'utf8'))
} catch (err) {
  console.error(`設定ファイルの読み込みに失敗しました: ${err.message}`)
  process.exit(1)
}

const { inputDirectory, outputDirectory, compression, forceOptim, svgoOptions, output } = config

// 入力ディレクトリの存在確認
if (!fs.existsSync(inputDirectory)) {
  console.error(`エラー: 入力ディレクトリ "${inputDirectory}" が見つかりません。`)
  process.exit(1)
}

// 出力ディレクトリの作成
if (!fs.existsSync(outputDirectory)) {
  try {
    fs.mkdirSync(outputDirectory, { recursive: true })
    console.log(`出力ディレクトリを作成しました: ${outputDirectory}`)
  } catch (err) {
    console.error(`出力ディレクトリの作成に失敗しました: ${err.message}`)
    process.exit(1)
  }
}

const deleteRemovedImages = (inputPath, outputPath) => {
  if (!fs.existsSync(outputPath)) return
  
  try {
    const outputFiles = fs.readdirSync(outputPath)

    outputFiles.forEach((outputFile) => {
      const inputFilePath = path.join(inputPath, outputFile)
      const outputFilePath = path.join(outputPath, outputFile)

      try {
        const stat = fs.statSync(outputFilePath)
        if (stat.isDirectory()) {
          if (fs.existsSync(inputFilePath)) {
            deleteRemovedImages(inputFilePath, outputFilePath)
          } else {
            fs.rmdirSync(outputFilePath, { recursive: true })
            console.log(`削除したディレクトリ: ${outputFilePath} (対応する入力ディレクトリなし)`)
          }
        } else {
          const extensions = ['.webp', '.avif', '.jpeg', '.jpg', '.png']
          const correspondingInputFileExists = extensions.some(
            (ext) =>
              fs.existsSync(inputFilePath.replace(ext, '.png')) ||
              fs.existsSync(inputFilePath.replace(ext, '.jpeg')) ||
              fs.existsSync(inputFilePath.replace(ext, '.jpg')),
          )

          if (!correspondingInputFileExists) {
            fs.unlinkSync(outputFilePath)
            console.log(`削除したファイル: ${outputFilePath} (対応する入力ファイルなし)`)
          }
        }
      } catch (err) {
        console.error(`ファイル処理中にエラーが発生しました ${outputFilePath}: ${err.message}`)
      }
    })
  } catch (err) {
    console.error(`ディレクトリ読み込み中にエラーが発生しました ${outputPath}: ${err.message}`)
  }
}

// キャッシュを読み込む
let cache = {}
try {
  if (fs.existsSync(CACHE_PATH)) {
    cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'))
  }
} catch (err) {
  console.warn(`キャッシュの読み込みに失敗しました: ${err.message}。新しいキャッシュを作成します。`)
}

// ファイルのハッシュ値を計算
const calculateHash = (filePath) => {
  try {
    const fileBuffer = fs.readFileSync(filePath)
    const hashSum = crypto.createHash('sha256')
    hashSum.update(fileBuffer)
    return hashSum.digest('hex')
  } catch (err) {
    console.error(`ハッシュ計算中にエラーが発生しました ${filePath}: ${err.message}`)
    return null
  }
}

// 画像を処理
const processImage = async (file, relativePath = '') => {
  const filePath = path.join(inputDirectory, relativePath, file)
  
  try {
    const fileHash = calculateHash(filePath)
    if (!fileHash) return

    const outputPath = path.join(outputDirectory, relativePath, file)
    // 出力ディレクトリが存在しない場合は作成
    const outputDir = path.dirname(outputPath)
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
      console.log(`ディレクトリを作成しました: ${outputDir}`)
    }

    // ハッシュ値に変更がなければスキップ
    if (
      !forceOptim &&
      cache[filePath] &&
      cache[filePath].hash === fileHash &&
      JSON.stringify(cache[filePath].compression) === JSON.stringify(compression) &&
      fs.existsSync(outputPath)
    ) {
      console.log(`スキップ: ${outputPath} (既に処理済み)`)
      return
    }

    // 処理の実施
    if (file.endsWith('.svg')) {
      const svgString = fs.readFileSync(filePath, 'utf-8')
      const result = await optimize(svgString, { ...svgoOptions, path: filePath })
      fs.writeFileSync(outputPath, result.data)
      console.log(`SVG最適化: ${filePath}`)
    } else {
      // optionに則り、出力するものをタスクに入れる
      const processTasks = []
      if (output.avif) {
        processTasks.push(
          sharp(filePath)
            .avif({
              quality: compression.avif.quality,
              chromaSubsampling: '4:4:4',
              effort: compression.avif.effort,
            })
            .toFile(outputPath.replace(/(\.jpeg|\.jpg|\.png)$/, '.avif')),
        )
      }

      if (output.webp) {
        processTasks.push(
          sharp(filePath)
            .webp({
              quality: compression.webp.quality,
              effort: compression.webp.effort,
            })
            .toFile(outputPath.replace(/(\.jpeg|\.jpg|\.png)$/, '.webp')),
        )
      }

      if (output.original) {
        // JPEGファイルの場合の処理
        if (file.endsWith('.jpeg') || file.endsWith('.jpg')) {
          processTasks.push(
            sharp(filePath)
              .jpeg({
                ...{
                  quality: 70,
                  chromaSubsampling: '4:4:4',
                  mozjpeg: true,
                  trellisQuantisation: true,
                  overshootDeringing: true,
                },
                ...compression.jpeg,
              })
              .toFile(outputPath.replace(/(\.jpeg|\.jpg)$/, '.jpg')),
          )
        }

        // PNGファイルの場合の処理
        if (file.endsWith('.png')) {
          const pngConfig = {
            compressionLevel: compression.png.compressionLevel || 9,
            progressive: compression.png.progressive || false,
            palette: compression.png.palette || false,
          }
          
          // qualityとdither設定が存在する場合のみ追加
          if (compression.png.quality !== undefined) {
            pngConfig.quality = compression.png.quality
          }
          if (compression.png.dither !== undefined) {
            pngConfig.dither = compression.png.dither
          }
          
          processTasks.push(
            sharp(filePath)
              .png(pngConfig)
              .toFile(outputPath.replace(/\.png$/, '.png')),
          )
        }
      }

      await Promise.all(processTasks)
    }

    console.log(`処理完了: ${outputPath}`)
    // キャッシュを更新
    cache[filePath] = { hash: fileHash, compression, svgoOptions }
  } catch (err) {
    console.error(`画像処理中にエラーが発生しました ${filePath}: ${err.message}`)
  }
}

// ディレクトリを処理
const processDirectory = (directory, relativePath = '') => {
  try {
    const dirPath = path.join(directory, relativePath)
    const files = fs.readdirSync(dirPath)
    
    const promises = files.map((file) => {
      try {
        const filePath = path.join(directory, relativePath, file)
        const stat = fs.statSync(filePath)

        if (stat.isDirectory()) {
          return processDirectory(directory, path.join(relativePath, file))
        } else if (
          file.endsWith('.png') ||
          file.endsWith('.jpeg') ||
          file.endsWith('.jpg') ||
          file.endsWith('.svg')
        ) {
          return processImage(file, relativePath)
        }
        return Promise.resolve()
      } catch (err) {
        console.error(`ファイル処理中にエラーが発生しました ${file}: ${err.message}`)
        return Promise.resolve()
      }
    }).filter(Boolean)

    return Promise.all(promises)
  } catch (err) {
    console.error(`ディレクトリ処理中にエラーが発生しました ${directory}/${relativePath}: ${err.message}`)
    return Promise.resolve()
  }
}

// メイン処理
console.log(`処理を開始します...`)
console.log(`入力ディレクトリ: ${inputDirectory}`)
console.log(`出力ディレクトリ: ${outputDirectory}`)

processDirectory(inputDirectory)
  .then(() => {
    try {
      // 処理が終了したら、入力ディレクトリに存在しない出力ディレクトリのファイルを削除
      deleteRemovedImages(inputDirectory, outputDirectory)

      // キャッシュを保存
      fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2))
      console.log('処理が完了しました。')
    } catch (err) {
      console.error(`最終処理中にエラーが発生しました: ${err.message}`)
    }
  })
  .catch((err) => {
    console.error(`処理中にエラーが発生しました: ${err.message}`)
    process.exit(1)
  })
