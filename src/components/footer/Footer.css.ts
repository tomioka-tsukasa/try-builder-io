import { style } from '@vanilla-extract/css'
import { rvw } from '@/styles/responsive.css'

export const root = style([
  {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontWeight: '700',
  },
  rvw.fontSize(10),
  rvw.gap(6),
  rvw.padding([186, 0, 103]),
])

export const text = style([
  rvw.letterSpacing(1.8),
  rvw.fontSize(10),
])

export const copyright = style([
  rvw.letterSpacing(3),
  rvw.fontSize(10),
])
