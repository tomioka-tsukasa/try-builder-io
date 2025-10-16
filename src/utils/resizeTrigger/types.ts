export type ResizeTrigger = (
  callback: () => void,
  option?: ResizeOption,
) => void

export type ResizeOption = {
  resizeBasicValue?: number,
  terminal?: number,
}

export type ResizeBreakPointTrigger = (
  callback: () => void,
  basic?: number,
  terminal?: number,
) => void
