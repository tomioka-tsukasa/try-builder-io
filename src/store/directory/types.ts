import { DM, SLUGS } from './directory'

export type SlugList = typeof SLUGS[keyof typeof SLUGS]

export type SlugUpperList = Uppercase<SlugList>

export type DMList = typeof DM[keyof typeof DM]
