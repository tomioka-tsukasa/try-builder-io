import { exec as execCb } from 'child_process'
import crypto from 'crypto'
import fs from 'fs'
import * as yaml from 'js-yaml'
import path from 'path'
import sharp from 'sharp'
import util from 'util'
/**
 * yarn add crypto sharp yaml svgo googleapis
 */

const exec = util.promisify(execCb)

const CONFIG_PATH = './configVideo.yml'
const CACHE_PATH = './cacheVideo.json'

// CONFIG_PATHの読み込み
const config = yaml.load(fs.readFileSync(CONFIG_PATH, 'utf8'))
const {
  inputDirectory,
  outputDirectory,
  formats,
  includeAudio,
  audioFrequency,
  webpQuality,
  syncDir = true,
   
  individualBitrates,
} = config

// CACHE_PATHが存在しない場合は空のファイルを作成
if (!fs.existsSync(CACHE_PATH)) {
  fs.writeFileSync(CACHE_PATH, JSON.stringify({}))
}

// CACHE_PATHの読み込み
const cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8') || '{}')

const originalFileNameFromOutput = (filename) => {
  return filename.replace('-h265', '')
}

const deleteRemovedVideos = (inputPath, outputPath, relativePath = '') => {
  // ディレクトリが存在するか確認し、なければ作成
  ensureDirectoryExists(inputPath)
  ensureDirectoryExists(outputPath)

  const outputFiles = fs.readdirSync(path.join(outputPath, relativePath))

  outputFiles.forEach((outputFile) => {
    const convertedFileName = originalFileNameFromOutput(outputFile)
    const inputBaseNameWithoutExt = path.basename(
      convertedFileName,
      path.extname(convertedFileName),
    )
    const outputFilePath = path.join(outputPath, relativePath, outputFile)
    const stat = fs.statSync(outputFilePath)

    if (stat.isDirectory()) {
      deleteRemovedVideos(inputPath, outputPath, path.join(relativePath, outputFile)) // 再帰的な呼び出し
    } else {
      const correspondingInputFileExists = fs
        .readdirSync(path.join(inputPath, relativePath))
        .some((inputFile) => {
          return path.basename(inputFile, path.extname(inputFile)) === inputBaseNameWithoutExt
        })

      if (!correspondingInputFileExists) {
         
        console.log(`Deleting output file: ${outputFilePath} (No corresponding input file)`) // 削除ログ
        fs.unlinkSync(outputFilePath)
      }
    }
  })
}

// ディレクトリが存在しない場合に作成するユーティリティ関数
const ensureDirectoryExists = (directoryPath) => {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true })
  }
}

const processDirectory = async (directory, relativePath = '') => {
  const fullPath = path.join(directory, relativePath)
  const files = fs.readdirSync(fullPath)
  for (const file of files) {
    const filePath = path.join(fullPath, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      await processDirectory(directory, path.join(relativePath, file))
    } else if (file.endsWith('.mp4') || file.endsWith('.mov')) {
      const outputPath = path.join(outputDirectory, relativePath)
      await processVideoFile(filePath, outputPath, file, relativePath)
    }
  }
}

const isBitrateUnchanged = (cachedBitrates, currentBitrates) => {
  return Object.keys(cachedBitrates).every((format) => {
    return (
      cachedBitrates[format].videoBitrate === currentBitrates[format].videoBitrate &&
      cachedBitrates[format].audioBitrate === currentBitrates[format].audioBitrate
    )
  })
}

const isFileProcessedBefore = (
  inputPath,
  outputPath,
  filename,
  fileHash,
  configFormats,
   
  _includeAudio,
) => {
  // formatのキーを使用して出力形式の配列を作成する
  const outputFormats = Object.keys(configFormats).map((key) => {
    return key === 'h265' ? '-h265.mp4' : `.${key}`
  })

  const cachedInfo = cache[inputPath]

  // キャッシュ情報が存在しない場合は、そのまま処理が必要であることを示す
  if (!cachedInfo) return [false, 'No cache info']

  // ハッシュ値が一致しない場合、ファイルが変更された可能性がある
  if (cachedInfo.hash !== fileHash) {
     
    console.debug(`Hash mismatch for ${filename}. Cached: ${cachedInfo.hash}, Current: ${fileHash}`)
    return [false, 'File hash mismatch']
  }

  // 出力ファイルがすべて存在するか確認
  const outputFilesExist = outputFormats.every((ext) =>
    fs.existsSync(path.join(outputPath, filename.replace('.mp4', ext))),
  )
  if (!outputFilesExist) {
     
    console.debug(`Output files missing for ${filename}.`)
    return [false, 'One or more output files do not exist']
  }

  // bitrateが変更されていないか確認
  if (!isBitrateUnchanged(cachedInfo.bitrates, configFormats)) {
     
    console.debug(`Bitrate parameters changed for ${filename}.`)
    return [false, 'Bitrate parameters changed']
  }

  return [true, '']
}

const processVideoFile = async (inputPath, outputPath, filename, relativePath = '') => {
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true })
  }

  const stats = fs.statSync(inputPath)
  if (!stats.isFile()) {
     
    console.error(`Skipped: ${filename} (Not a file)`)
    return
  }

  // 個別の設定を取得
  const { customFormats, useAudio } = getIndividualSettings(inputPath, relativePath)
  const currentFormats = customFormats || formats
  const currentIncludeAudio = useAudio !== undefined ? useAudio : includeAudio

  // オーディオ設定をログに出力（デバッグ用）
  if (currentIncludeAudio) {
     
    console.log(`Processing with audio: ${filename}, mp4: ${currentFormats.mp4.audioBitrate}, h265: ${currentFormats.h265.audioBitrate}, webm: ${currentFormats.webm.audioBitrate}`)
  } else {
     
    console.log(`Processing without audio: ${filename}`)
  }

  const fileHash = calculateHash(inputPath)
  const [isProcessed, reason] = isFileProcessedBefore(
    inputPath,
    outputPath,
    filename,
    fileHash,
    currentFormats,
    currentIncludeAudio,
  )

  if (isProcessed) {
    if (reason !== 'Bitrate parameters changed') {
       
      console.log(`Skipped: ${filename} (${reason})`)
      return
    }
  }

  if (reason === 'Bitrate parameters changed') {
     
    console.log(`Reprocessing: ${filename} due to bitrate change.`)
  } else {
     
    console.log(`Start: ${filename}`)
  }

  const baseFilename = filename.replace('.mp4', '')

  await createPosterImage(inputPath, outputPath, baseFilename, webpQuality)

  await Promise.all([
    convertFile(
      inputPath,
      outputPath,
      baseFilename,
      'mp4',
      'libx264',
      currentFormats.mp4.videoBitrate,
      currentIncludeAudio ? currentFormats.mp4.audioBitrate : null,
      currentIncludeAudio,
    ),
    convertFile(
      inputPath,
      outputPath,
      baseFilename + '-h265',
      'mp4',
      'libx265',
      currentFormats.h265.videoBitrate,
      currentIncludeAudio ? currentFormats.h265.audioBitrate : null,
      currentIncludeAudio,
    ),
    convertFile(
      inputPath,
      outputPath,
      baseFilename,
      'webm',
      'libvpx-vp9',
      currentFormats.webm.videoBitrate,
      currentIncludeAudio ? currentFormats.webm.audioBitrate : null,
      currentIncludeAudio,
    ),
  ])

   
  console.log(`Processed: ${filename}`)
  cache[inputPath] = {
    hash: fileHash,
    bitrates: currentFormats,
    includeAudio: currentIncludeAudio,
  }
}

// 個別の設定を取得する関数
const getIndividualSettings = (filePath, relativePath = '') => {
  if (!config.individualBitrates) {
    return { customFormats: null, useAudio: undefined }
  }

  const fullRelativePath = path.join(relativePath, path.basename(filePath))

  // individualBitratesのキーをループして、パターンに一致するかチェック
  for (const pattern in config.individualBitrates) {
    // 単純なワイルドカードパターンマッチング
    const isMatch = matchWildcardPattern(fullRelativePath, pattern)
    if (isMatch) {
      const settings = config.individualBitrates[pattern]
      // オーディオを含める場合は、各フォーマットにaudioBitrateが設定されていることを確認
      if (settings.includeAudio === true) {
        const formats = { ...settings.formats }
        // 各フォーマットでaudioBitrateが未設定の場合はデフォルト値を使用
        for (const format in formats) {
          if (!formats[format].audioBitrate) {
            formats[format].audioBitrate = config.formats[format].audioBitrate
          }
        }
        return {
          customFormats: formats,
          useAudio: settings.includeAudio
        }
      }
      return {
        customFormats: settings.formats,
        useAudio: settings.includeAudio
      }
    }
  }

  return { customFormats: null, useAudio: undefined }
}

// シンプルなワイルドカードパターンマッチング実装
const matchWildcardPattern = (str, pattern) => {
  // パターンを正規表現に変換
  const regexPattern = pattern
    .replace(/\*/g, '.*') // * を .* に置換
    .replace(/\?/g, '.') // ? を . に置換
  
  const regex = new RegExp(`^${regexPattern}$`)
  return regex.test(str)
}

const createPosterImage = async (inputPath, outputPath, baseFilename, webpQuality) => {
  const tempPngPath = `${outputPath}/${baseFilename}-temp.png`
  const webpPath = `${outputPath}/${baseFilename}.webp`

  // 1フレーム目を .png として保存
  await exec(`ffmpeg -i ${inputPath} -vf "select=eq(n\\,0)" -q:v 3 -vframes 1 ${tempPngPath}`)

  // .png を .webp に変換
  await sharp(tempPngPath).webp({ quality: webpQuality }).toFile(webpPath)

  // 一時ファイルを削除
  fs.unlinkSync(tempPngPath)
}

const convertFile = (
  inputPath,
  outputPath,
  filename,
  extension,
  codec,
  videoBitrate,
  audioBitrate,
  useAudio,
) => {
  const audioOptions = useAudio && audioBitrate 
    ? `-b:a ${audioBitrate} -ar ${audioFrequency}` 
    : '-an';
    
  return exec(
    `ffmpeg -y -i ${inputPath} -vcodec ${codec} -pix_fmt yuv420p -b:v ${videoBitrate} ${audioOptions} -movflags +faststart ${outputPath}/${filename}.${extension}`,
  )
}

// キャッシュとファイルシステムを同期
const syncCacheWithFileSystem = (cache) => {
  for (const filePath in cache) {
    if (!fs.existsSync(filePath)) {
       
      console.log(`Removing from cache: ${filePath} (File does not exist)`)
      delete cache[filePath]
    }
  }
}

const calculateHash = (filePath) => {
  const fileBuffer = fs.readFileSync(filePath)
  const hashSum = crypto.createHash('sha256')
  hashSum.update(fileBuffer)
  return hashSum.digest('hex')
}

processDirectory(inputDirectory).then(() => {
  if (syncDir) {
    deleteRemovedVideos(inputDirectory, outputDirectory)
  }
  syncCacheWithFileSystem(cache, inputDirectory)

  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2))

   
  console.log('Processing complete.')
})

// deleteRemovedVideos(inputDirectory, outputDirectory)
