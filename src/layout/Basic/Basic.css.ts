import { style } from '@vanilla-extract/css'
import { notoSans } from '@/styles/variables'

export const container = style([
  {
    width: '100%',
    ...notoSans(),
  },
])
