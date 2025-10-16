import { ImgTitleDesc, Button, ImgCaption } from '../../components/ui'
import * as styles from './Home.css'

const Home = () => {
  return (
    <section id={'section-sample'} className={styles.container}>
      <h1 className={styles.heading}>UI Components Demo</h1>

      <div className={styles.section}>
        <h2 className={styles.subheading}>ImgTitleDesc コンポーネント</h2>
        <div className={styles.grid}>
          <ImgTitleDesc
            imageSrc='https://api.builder.io/api/v1/image/assets/TEMP/dd14d85ba95cc5de8fa230d4b16a51cb3a606122?width=460'
            title='タイトル'
            description='説明文'
            pattern='default'
            icon='none'
          />
          <ImgTitleDesc
            imageSrc='https://api.builder.io/api/v1/image/assets/TEMP/3645bb201388bc8f8b1662cc0f8ea7d656c22872?width=460'
            title='タイトル'
            description='説明文'
            pattern='white_bg'
            icon='arrow'
          />
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.subheading}>Button コンポーネント</h2>
        <div className={styles.buttonGroup}>
          <Button label='ラベル' size='default' />
          <Button label='ラベル' size='large' />
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.subheading}>ImgCaption コンポーネント</h2>
        <ImgCaption
          imageSrc='https://api.builder.io/api/v1/image/assets/TEMP/0305028a7ede20c89f55953d5d7fe9c89e3c6188?width=1516'
          caption='キャプション'
        />
      </div>
    </section>
  )
}

export default Home
