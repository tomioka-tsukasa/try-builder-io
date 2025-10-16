// Vanilla Extract CSSモジュールの型定義
declare module '*.css.ts' {
  const styles: {
    [key: string]: string;
  }
  export = styles;
  export default styles
}
