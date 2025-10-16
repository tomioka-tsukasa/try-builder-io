import { globalStyle } from '@vanilla-extract/css'
import { colors, notoSans } from './variables'

// リセットCSS
globalStyle('*', {
  margin: 0,
  padding: 0,
  boxSizing: 'border-box',
})

globalStyle('html', {
  fontSize: '62.5%', // 10px = 1rem
  lineHeight: 1.6,
})

globalStyle('body', {
  fontSize: '1.6rem',
  color: colors.text.sample,
  backgroundColor: colors.base.bg,
  ...notoSans()
})

globalStyle('article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section', {
  display: 'block',
})

globalStyle('ol, ul', {
  listStyle: 'none',
})

globalStyle('a', {
  color: 'inherit',
  textDecoration: 'none',
})

globalStyle('table', {
  borderCollapse: 'collapse',
  borderSpacing: 0,
})

globalStyle('button, input, select, textarea', {
  font: 'inherit',
  color: 'inherit',
  background: 'transparent',
  border: 'none',
  appearance: 'none',
  borderRadius: 0,
  outline: 'none',
})

globalStyle('img', {
  maxWidth: '100%',
  height: 'auto',
  verticalAlign: 'bottom',
})
