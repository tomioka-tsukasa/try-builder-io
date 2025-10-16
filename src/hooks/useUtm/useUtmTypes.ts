/**
 * UTMパラメータの型定義
 */
export type UtmParams = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

/**
 * useUtmフックの戻り値の型定義
 */
export type UseUtmReturn = {
  /**
   * 現在のUTMパラメータ
   */
  utmParams: UtmParams;

  /**
   * 外部リンクにUTMパラメータを付与する関数
   * @param url 対象のURL
   * @returns UTMパラメータが付与されたURL
   */
  withUtm: (url: string) => string;

  /**
   * 内部リンク（SPA遷移）用のパスにUTMパラメータを付与する関数
   * @param path 対象のパス
   * @returns UTMパラメータが付与されたパス
   */
  preserveUtm: (path: string) => string;

  /**
   * 指定したURLが外部リンクかどうかを判定する関数
   * @param url 判定対象のURL
   * @returns 外部リンクの場合はtrue、内部リンクの場合はfalse
   */
  isExternalUrl: (url: string) => boolean;
};
