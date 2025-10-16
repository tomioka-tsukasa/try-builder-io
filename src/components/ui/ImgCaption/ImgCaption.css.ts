import { style } from '@vanilla-extract/css'

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '11px',
  borderRadius: '3px',
  width: '100%',
})

export const image = style({
  width: '100%',
  aspectRatio: '379 / 170',
  objectFit: 'cover',
  borderRadius: '3px 3px 0 0',
  borderBottom: '1px solid rgba(0, 0, 0, 0.10)',
  display: 'block',
})

export const inner = style({
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
})

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  flex: '1 0 0',
})

export const caption = style({
  color: '#515255',
  fontFamily: 'Inter, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '12px',
  fontWeight: 400,
  lineHeight: '19px',
  margin: 0,
})
