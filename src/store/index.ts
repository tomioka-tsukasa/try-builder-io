import { configureStore } from '@reduxjs/toolkit'
import YoutubeAPIStore from './slice/YoutubeAPIStore/YoutubeAPIStore'

export const makeStore = () => {

  return configureStore({
    reducer: {
      YoutubeAPIStore,
    }
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
