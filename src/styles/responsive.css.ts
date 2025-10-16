import { StyleRule } from '@vanilla-extract/css'
import { Properties } from 'csstype'
import { PcDesignWidth, SpDesignWidth, PcMqWidthMin, PcOverMqWidthMin, TabletMqWidthMin, SpMqWidth, usePixelLimit, pixelLimitWidth, TabletDesignWidth } from './responsive.config'

// メディアクエリ定義
export const mediaQueries = {
  sp: `screen and (max-width: ${SpMqWidth}px)`,
  tablet: `screen and (min-width: ${TabletMqWidthMin}px) and (max-width: ${PcMqWidthMin - 1}px)`,
  pc: `screen and (min-width: ${PcMqWidthMin}px) and (max-width: ${PcOverMqWidthMin - 1}px)`,
  pcOver: `screen and (min-width: ${PcOverMqWidthMin}px)`,
  hover: '(hover: hover)',
  pixelBreakpoint: `screen and (min-width: ${pixelLimitWidth}px)`,
}

// 型定義
type ValueType = string | number | (string | number)[];
type UnitType = 'vw' | 'px' | 'auto';
type CSSProperty = keyof Properties;

// ユーティリティ関数
const stripUnit = (value: string | number): number => {
  if (typeof value === 'number') return value
  if (typeof value === 'string' && value.endsWith('px')) {
    return parseFloat(value)
  }

  return parseFloat(String(value))
}

const vwCalc = (size: string | number, viewport = SpDesignWidth): string => {
  const rate = 100 / viewport
  const adjustedSize = stripUnit(size)

  return `${rate * adjustedSize}vw`
}

const vwTabletCalc = (size: string | number, viewport = TabletDesignWidth): string => {
  const rate = 100 / viewport
  const adjustedSize = stripUnit(size)

  return `${rate * adjustedSize}vw`
}

const vwPcCalc = (size: string | number, viewport = PcDesignWidth): string => {
  const rate = 100 / viewport
  const adjustedSize = stripUnit(size)

  return `${rate * adjustedSize}vw`
}

// px値を返す関数
const toPx = (size: string | number): string => {
  const adjustedSize = stripUnit(size)

  return `${adjustedSize}px`
}

// 値の処理方法を決定
const getUnitType = (value: string | number): UnitType => {
  if (typeof value === 'string') {
    if (value === 'auto' || value === 'inherit' || value === 'initial') return 'auto'
    if (/^\d+(\.\d+)?(px|rem|em|vh|%|pt|pc|in|cm|mm|ex|ch|vmin|vmax)$/.test(value)) return 'auto'
  }

  return 'vw' // デフォルトはvw変換（数値も文字列の数値もvwに変換）
}

// 値を文字列に変換
const processValue = (value: string | number, calcFunc: (val: string | number) => string): string => {
  const unitType = getUnitType(value)
  if (typeof value === 'string' || unitType === 'auto') return String(value)

  return calcFunc(value) // 変換関数を呼び出す
}

// 値の配列を処理
const processValues = (values: (string | number)[], calcFunc: (val: string | number) => string): string => {
  return values.map(value => processValue(value, calcFunc)).join(' ')
}

// レスポンシブスタイル作成のベース関数
const createResponsiveStyle = (
  property: CSSProperty,
  defaultValue: ValueType,
  spValue?: ValueType,
  tabletValue?: ValueType,
  useLimit: boolean = usePixelLimit
): StyleRule => {
  // 値の正規化
  const defaultArray = Array.isArray(defaultValue) ? defaultValue : [defaultValue]
  const spArray = spValue ? (Array.isArray(spValue) ? spValue : [spValue]) : defaultArray
  const tabletArray = tabletValue ? (Array.isArray(tabletValue) ? tabletValue : [tabletValue]) : defaultArray

  // vw値の計算
  const defaultStr = processValues(defaultArray, vwPcCalc)
  const spStr = processValues(spArray, vwCalc)
  const tabletStr = processValues(tabletArray, vwTabletCalc)

  const result: StyleRule = {
    [property]: defaultStr,
    '@media': {
      [mediaQueries.sp]: {
        [property]: spStr,
      },
      [mediaQueries.tablet]: {
        [property]: tabletStr,
      },
    }
  }

  // useLimit=trueの場合、pixelLimitWidth以上のサイズでpx値を使用（デフォルト値を基準にする）
  if (useLimit) {
    const pxStr = defaultArray.map(value => {
      const numValue = typeof value === 'number' ? value : parseFloat(String(value))

      return toPx(numValue)
    }).join(' ')

    // pixelBreakpointメディアクエリでpx値を設定
    if (!result['@media']) {
      result['@media'] = {}
    }
    result['@media'][mediaQueries.pixelBreakpoint] = {
      [property]: pxStr
    }
  }

  return result
}

// メディアクエリごとの値を設定するベース関数
const createMqStyle = (
  property: CSSProperty,
  values: (string | number)[]
): StyleRule => {
  const [defaultValue, spValue, tabletValue, pcOverValue] = values

  const result: StyleRule = {
    [property]: defaultValue,
  }

  if (!result['@media']) result['@media'] = {}

  if (spValue !== undefined) {
    result['@media'][mediaQueries.sp] = {
      [property]: spValue
    }
  }

  if (tabletValue !== undefined) {
    result['@media'][mediaQueries.tablet] = {
      [property]: tabletValue
    }
  }

  if (pcOverValue !== undefined) {
    result['@media'][mediaQueries.pcOver] = {
      [property]: pcOverValue
    }
  } else if (defaultValue !== undefined) {
    // PC-Overの値が指定されていない場合、defaultValueを元にpx値を計算
    const adjustedSize = stripUnit(defaultValue)
    const pcOverCalcValue = `${adjustedSize}px`
    result['@media'][mediaQueries.pcOver] = {
      [property]: pcOverCalcValue
    }
  }

  return result
}

// プロキシを作成して、rvw.fontSize(16) のような使い方を可能にする
export const rvw = new Proxy({} as Record<CSSProperty, (defaultValue: ValueType, spValue?: ValueType, tabletValue?: ValueType, useLimit?: boolean) => StyleRule>, {
  get: (_, prop: string) => {
    return (defaultValue: ValueType, spValue?: ValueType, tabletValue?: ValueType, useLimit: boolean = usePixelLimit) => {
      return createResponsiveStyle(prop as CSSProperty, defaultValue, spValue, tabletValue, useLimit)
    }
  }
})

// プロキシを作成して、mqStyle.marginBottom([40, 20, 30, 60]) のような使い方を可能にする
export const mqStyle = new Proxy({} as Record<CSSProperty, (values: (string | number)[]) => StyleRule>, {
  get: (_, prop: string) => {
    return (values: (string | number)[]) => {
      return createMqStyle(prop as CSSProperty, values)
    }
  }
})

// メディアクエリユーティリティ
// PC向けスタイル
export const pc = (styles: StyleRule): StyleRule => ({
  '@media': { [mediaQueries.pc]: styles }
})

// PC-Over向けスタイル
export const pcOver = (styles: StyleRule): StyleRule => ({
  '@media': { [mediaQueries.pcOver]: styles }
})

// SP向けスタイル
export const sp = (styles: StyleRule): StyleRule => ({
  '@media': { [mediaQueries.sp]: styles }
})

// タブレット向けスタイル
export const tablet = (styles: StyleRule): StyleRule => ({
  '@media': { [mediaQueries.tablet]: styles }
})

// ピクセルリミット向けスタイル
export const pixelBreakpoint = (styles: StyleRule): StyleRule => ({
  '@media': { [mediaQueries.pixelBreakpoint]: styles }
})

// ホバーエフェクト
export const hover = (styles: StyleRule): StyleRule => ({
  '@media': {
    [mediaQueries.hover]: {
      ':hover': { ...styles }
    }
  }
})

// ホバーインタラクション
export const hoverInteraction = (): StyleRule => ({
  '@media': {
    [mediaQueries.hover]: {
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0, 0.5, 0.5, 1) 0s',
      ':hover': {
        filter: 'brightness(1.1)',
      }
    }
  }
})
