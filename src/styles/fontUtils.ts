import type { StyleRule } from '@vanilla-extract/css'

// フォントファミリーの基本定義
export const basicFontStyle = '"Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif'
export const notoSansStyle = `'Noto Sans JP', ${basicFontStyle}`

// フォントスタイル適用関数
export type SetFontFamily = (
  option?: {
    weight?: number,
    style?: string,
  }
) => StyleRule

export const notoSans: SetFontFamily = (option = {
  weight: 400,
  style: 'normal',
}) => {
  return {
    fontFamily: notoSansStyle,
    fontOpticalSizing: 'auto',
    fontWeight: option.weight,
    fontStyle: option.style,
    WebkitTextSizeAdjust: '100%',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    fontFeatureSettings: '"palt"',
  }
}
