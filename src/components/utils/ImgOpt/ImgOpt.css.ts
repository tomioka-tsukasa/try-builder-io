import { style } from '@vanilla-extract/css'

// スタイル定義
export const imgStyle = style({
  width: '100%',
  height: 'auto',
  display: 'block',
})

export const imgTypeStyle = {
  heightMax: style([
    {
      height: '100%',
      width: 'auto',
    }
  ])
}
