import type { IsExternalLink } from './types'

export const isExternalLink: IsExternalLink = (
  link
) => {
  return /^https?:\/\//.test(link)
}
