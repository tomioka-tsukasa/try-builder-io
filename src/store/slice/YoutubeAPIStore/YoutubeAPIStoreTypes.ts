export type InitialState = {
  isApiReady: IsApiReady,
}

export type IsApiReady = boolean

export type SetIsApiReadyAction = IsApiReady

export interface YoutubeWindow {
  YT: typeof YT;
  onYouTubeIframeAPIReady: () => void;
}
