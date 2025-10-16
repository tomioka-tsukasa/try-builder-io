import { SlugList } from '@/store/directory/types'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { UseAppLocation } from './useAppLocationTypes'

// 現在のパスからスラッグを決定する関数
const getSlugFromPath = (pathname: string): SlugList => {
  console.log('current pathname: ', pathname)

  return 'top'
}

export const useAppLocation: UseAppLocation = () => {
  const location = useLocation()
  // 初期値を現在のパスに基づいて設定
  const [slug, setSlug] = useState<SlugList>(() => getSlugFromPath(location.pathname))

  useEffect(() => {
    const newSlug = getSlugFromPath(location.pathname)
    setSlug(newSlug)
  }, [location])

  return {
    pathname: location.pathname,
    slug,
  }
}
