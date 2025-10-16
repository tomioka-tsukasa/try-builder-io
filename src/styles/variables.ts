export {
  PcDesignWidth,
  PcOverDesignWidth,
  TabletDesignWidth,
  SpDesignWidth,
  DesignRatio,
  PcMqWidthMin,
  PcMqWidthMax,
  PcOverMqWidthMin,
  TabletMqWidthMin,
  SpMqWidth,
  usePixelLimit,
  pixelLimitWidth,
} from './responsive.config'

/**
 * カラー定義
 */

export const colors = {
  main: {
    sample: '#000000',
  },
  base: {
    white: '#ffffff',
    black: '#000000',
    gray: '#f0f0f0',
    bg: '#f0f0f0',
  },
  sub: {
    sample: '#ee8e47',
  },
  text: {
    sample: '#5f5f5f',
  },
}

/**
 * フォント定義
 */

export { basicFontStyle, notoSansStyle, notoSans, type SetFontFamily } from './fontUtils'
