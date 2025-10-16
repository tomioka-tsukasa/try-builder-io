import { style } from '@vanilla-extract/css';
import { colors } from '../../../styles/variables';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '3px',
  overflow: 'hidden',
  width: '100%',
  maxWidth: '270px',
});

export const containerWhiteBg = style({
  backgroundColor: colors.base.white,
});

export const image = style({
  width: '100%',
  aspectRatio: '46 / 41',
  objectFit: 'cover',
  borderRadius: '3px 3px 0 0',
  borderBottom: `1px solid rgba(0, 0, 0, 0.10)`,
  display: 'block',
});

export const inner = style({
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  padding: '20px',
});

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  flex: '1 0 0',
});

export const title = style({
  color: colors.base.black,
  fontFamily: 'Inter, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '12px',
  fontWeight: 700,
  lineHeight: '19px',
  margin: 0,
});

export const description = style({
  color: '#515255',
  fontFamily: 'Inter, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '12px',
  fontWeight: 400,
  lineHeight: '19px',
  margin: 0,
});

export const icon = style({
  width: '12px',
  height: '12px',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});
