import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { InitialState, SetIsApiReadyAction } from './YoutubeAPIStoreTypes'

const initialState: InitialState = {
  isApiReady: false,
}

const YoutubeAPIStore = createSlice({
  name: 'YoutubeAPIStore',
  initialState,
  reducers: {
    setIsApiReady(state, action: PayloadAction<SetIsApiReadyAction>) {
      state.isApiReady = action.payload
    },
  }
})

export const { setIsApiReady } = YoutubeAPIStore.actions
export default YoutubeAPIStore.reducer
