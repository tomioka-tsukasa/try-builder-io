import { style } from '@vanilla-extract/css';
import { colors } from '../../styles/variables';
import { SpMqWidth } from '../../styles/responsive.config';

export const container = style({
  padding: '40px 20px',
  maxWidth: '1200px',
  margin: '0 auto',
});

export const heading = style({
  fontSize: '32px',
  fontWeight: 700,
  marginBottom: '40px',
  color: colors.base.black,
  '@media': {
    [SpMqWidth]: {
      fontSize: '24px',
      marginBottom: '30px',
    },
  },
});

export const section = style({
  marginBottom: '60px',
  '@media': {
    [SpMqWidth]: {
      marginBottom: '40px',
    },
  },
});

export const subheading = style({
  fontSize: '20px',
  fontWeight: 700,
  marginBottom: '20px',
  color: colors.base.black,
  '@media': {
    [SpMqWidth]: {
      fontSize: '18px',
      marginBottom: '15px',
    },
  },
});

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 270px))',
  gap: '20px',
  '@media': {
    [SpMqWidth]: {
      gridTemplateColumns: '1fr',
    },
  },
});

export const buttonGroup = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '20px',
  '@media': {
    [SpMqWidth]: {
      flexDirection: 'column',
    },
  },
});
