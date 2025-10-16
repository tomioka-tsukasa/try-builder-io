import React from 'react'
import * as styles from './ImgCaption.css'

export interface ImgCaptionProps {
  /** 画像のURL */
  imageSrc: string;
  /** キャプションテキスト */
  caption?: string;
  /** 画像のalt属性 */
  imageAlt?: string;
  /** 追加のクラス名 */
  className?: string;
}

/**
 * ImgCaption コンポーネント
 * 
 * 画像とキャプションを表示するコンポーネント
 */
export function ImgCaption({
  imageSrc,
  caption = 'キャプション',
  imageAlt = '',
  className,
}: ImgCaptionProps): React.ReactElement {
  return (
    <div className={`${styles.container} ${className || ''}`.trim()}>
      <img src={imageSrc} alt={imageAlt} className={styles.image} />
      <div className={styles.inner}>
        <div className={styles.content}>
          <p className={styles.caption}>{caption}</p>
        </div>
      </div>
    </div>
  )
}

export default ImgCaption
