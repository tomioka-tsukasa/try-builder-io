import { style, styleVariants } from '@vanilla-extract/css'
import { colors } from '../../../styles/variables'

export const button = style({
  display: 'flex',
  alignItems: 'center',
  borderRadius: '3px',
  backgroundColor: colors.base.black,
  border: 'none',
  cursor: 'pointer',
  transition: 'opacity 0.2s ease',
  ':hover': {
    opacity: 0.8,
  },
  ':active': {
    opacity: 0.6,
  },
})

export const buttonSize = styleVariants({
  default: {
    padding: '18px 22px 18px 20px',
    gap: '20px',
  },
  large: {
    padding: '20px 24px',
    gap: '20px',
  },
})

export const label = style({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  flex: '1 0 0',
})

export const labelText = style({
  color: colors.base.white,
  fontFamily: 'Arial, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '14px',
  fontWeight: 700,
  lineHeight: '16px',
  margin: 0,
})

export const icon = style({
  width: '12px',
  height: '12px',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
})
