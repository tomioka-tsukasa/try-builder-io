import * as styles from './Basic.css'
import { Footer } from '@/components/footer/Footer'
import Header from '@/components/header/Header'
import GoogleTagManager from '@/components/meta/GoogleTagManager'
import MetaTags from '@/components/meta/MetaTags'
import { pushToDataLayer } from '@/components/meta/gtmUtils'
import { useAppLocation } from '@/hooks/useAppLocation/useAppLocation'
import { useMeta } from '@/hooks/useMeta/useMeta'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useAppDispatch } from '@/store/hook'
import { setIsApiReady } from '@/store/slice/YoutubeAPIStore/YoutubeAPIStore'
import { YoutubeWindow } from '@/store/slice/YoutubeAPIStore/YoutubeAPIStoreTypes'

export const Basic = () => {
  const { slug, pathname } = useAppLocation()
  const { meta } = useMeta()
  const dispatch = useAppDispatch()

  // YouTube IFrame APIの初期化
  useEffect(() => {
    // APIが既に読み込まれている場合はスキップ
    if (window.YT) return

    (window as unknown as YoutubeWindow).onYouTubeIframeAPIReady = () => {
      dispatch(setIsApiReady(true))
    }

    // APIの読み込み
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
  }, [dispatch])

  // ページビューイベントの送信
  useEffect(() => {
    if (slug) {
      // ページが変わったらGTMにイベントを送信
      pushToDataLayer({
        event: 'pageview',
        page: {
          path: pathname,
          title: meta.title,
          type: slug
        }
      })
    }
  }, [slug, pathname, meta.title])

  // ページ毎のクラスをbodyにセット
  useEffect(() => {
    if (document) {
      document.body.classList.add(`page-id-${slug}`)
    }
  }, [slug])

  return <>
    <MetaTags meta={meta} />
    <GoogleTagManager id='GTM-XXXXXXX' />
    <main className={`${styles.container}`}>
      <Header />
      <Outlet />
      <Footer />
    </main>
  </>
}
