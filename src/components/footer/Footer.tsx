import * as styles from './Footer.css.ts'

export const Footer = () => {
  return <>
    <div className={`${styles.root}`}>
      <div className={`${styles.text}`}>
        ©sample text
      </div>
      <small className={`${styles.copyright}`}>
        Copyright (c) 20xx.
      </small>
    </div>
  </>
}
