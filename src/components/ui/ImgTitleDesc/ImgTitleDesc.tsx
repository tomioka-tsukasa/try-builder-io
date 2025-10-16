import React from 'react'
import * as styles from './ImgTitleDesc.css'

export type ImgTitleDescPattern = 'default' | 'white_bg';
export type ImgTitleDescIcon = 'arrow' | 'external' | 'none';

export interface ImgTitleDescProps {
  /** 画像のURL */
  imageSrc: string;
  /** タイトルテキスト */
  title?: string;
  /** 説明文テキスト */
  description?: string;
  /** 画像のalt属性 */
  imageAlt?: string;
  /** 表示パターン */
  pattern?: ImgTitleDescPattern;
  /** アイコンの種類 */
  icon?: ImgTitleDescIcon;
  /** 追加のクラス名 */
  className?: string;
}

/**
 * ImgTitleDesc コンポーネント
 * 
 * 画像、タイトル、説明文を表示するカードコンポーネント
 * オプションでアイコン（矢印または外部リンク）を表示可能
 */
export function ImgTitleDesc({
  imageSrc,
  title = 'タイトル',
  description = '説明文',
  imageAlt = '',
  pattern = 'default',
  icon = 'none',
  className,
}: ImgTitleDescProps): React.ReactElement {
  const containerClass = `${styles.container} ${
    pattern === 'white_bg' ? styles.containerWhiteBg : ''
  } ${className || ''}`.trim()

  return (
    <div className={containerClass}>
      <img src={imageSrc} alt={imageAlt} className={styles.image} />
      <div className={styles.inner}>
        <div className={styles.content}>
          <p className={styles.title}>{title}</p>
          <p className={styles.description}>{description}</p>
        </div>
        {icon !== 'none' && (
          <div className={styles.icon}>
            {icon === 'arrow' && (
              <svg width='7' height='12' viewBox='0 0 7 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path d='M0 12L7 6L0 0L4.76 6L0 12Z' fill='black'/>
              </svg>
            )}
            {icon === 'external' && (
              <svg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path d='M10 10H2V2H6V0H2C0.89 0 0 0.9 0 2V10C0 11.1 0.89 12 2 12H10C11.1 12 12 11.1 12 10V6H10V10ZM7 0V2H9.59L3.76 7.83L5.17 9.24L11 3.41V6H13V0H7Z' fill='black'/>
              </svg>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ImgTitleDesc
