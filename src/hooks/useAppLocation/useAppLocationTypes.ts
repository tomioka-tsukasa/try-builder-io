import { SlugList } from '@/store/directory/types'

export type UseAppLocation = () => {
  pathname: string,
  slug: SlugList,
}
