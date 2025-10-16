import React from 'react';
import * as styles from './Button.css';

export type ButtonSize = 'default' | 'large';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** ボタンのラベルテキスト */
  label?: string;
  /** ボタンのサイズ */
  size?: ButtonSize;
  /** アイコンを表示するか */
  showIcon?: boolean;
  /** 追加のクラス名 */
  className?: string;
  /** クリックイベントハンドラ */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Button コンポーネント
 * 
 * ラベルと矢印アイコンを持つボタンコンポーネント
 * サイズ指定（default/large）に対応
 */
export function Button({
  label = 'ラベル',
  size = 'default',
  showIcon = true,
  className,
  onClick,
  ...props
}: ButtonProps): React.ReactElement {
  const buttonClass = `${styles.button} ${styles.buttonSize[size]} ${className || ''}`.trim();

  return (
    <button className={buttonClass} onClick={onClick} {...props}>
      <div className={styles.label}>
        <span className={styles.labelText}>{label}</span>
      </div>
      {showIcon && (
        <div className={styles.icon}>
          <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 12L7 6L0 0L4.76 6L0 12Z" fill="white"/>
          </svg>
        </div>
      )}
    </button>
  );
}

export default Button;
