import * as styles from './Header.css.ts'

type HeaderProps = {
  className?: string
}

function Header({ className }: HeaderProps) {
  return (
    <header className={`${styles.container} ${className || ''}`}>
      Header
    </header>
  )
}

export default Header
