import { StyleRule } from '@vanilla-extract/css'

type ValueType = string | number | (string | number)[];

// Proxyオブジェクトの関数の型定義
interface CSSPropertyFunction {
  (defaultValue: ValueType, spValue?: ValueType, tabletValue?: ValueType): StyleRule;
}

// CSSプロパティごとの型付きProxy
export interface RvwProxy {
  [key: string]: CSSPropertyFunction;
}

// mqStyleの型定義
interface MqStyleFunction {
  (values: (string | number)[]): StyleRule;
}

export interface MqStyleProxy {
  [key: string]: MqStyleFunction;
}

// メディアクエリ関数の型定義
export type MediaQueryFunction = (styles: StyleRule) => StyleRule;

// ホバー関連の型定義
export type HoverFunction = (styles: StyleRule) => StyleRule;
export type HoverInteractionFunction = () => StyleRule;

// モジュール拡張
declare module './responsive.util' {
  export const rvw: RvwProxy
  export const mqStyle: MqStyleProxy
  export const pc: MediaQueryFunction
  export const sp: MediaQueryFunction
  export const tablet: MediaQueryFunction
  export const pcOver: MediaQueryFunction
  export const pixelBreakpoint: MediaQueryFunction
  export const hover: HoverFunction
  export const hoverInteraction: HoverInteractionFunction
}
