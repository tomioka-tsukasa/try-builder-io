import { ResizeTrigger } from './types'

export const resizeTrigger: ResizeTrigger = (
  callback,
  option = {
    resizeBasicValue: 50,
  }
) => {
  let lastWidth = window.innerWidth
  let lastHeight = window.innerHeight

  const onResize = () => {
    const currentWidth = window.innerWidth
    const currentHeight = window.innerHeight

    if (
      Math.abs(currentWidth - lastWidth) >= (option.resizeBasicValue ?? 50)
      || Math.abs(currentWidth - lastHeight) >= (option.resizeBasicValue ?? 50)
    ) {
      lastWidth = currentWidth
      lastHeight = currentHeight
      callback()
    }
  }

  window.addEventListener('resize', () => {
    onResize()
  })
}

// export const resizeBreakPointTrigger: ResizeBreakPointTrigger = (
//   callback,
//   basic = 50,
//   terminal = 100,
// ) => {
//   let lastWidth = window.innerWidth

//   const onResize = () => {
//     if (
//       lastWidth === responsives.mq.pc
//       || lastWidth === responsives.mq.pc + 1
//       || lastWidth === responsives.mq.tablet
//       || lastWidth === responsives.mq.tablet + 1
//       || lastWidth === responsives.mq.sp
//       || lastWidth === responsives.mq.sp + 1
//     ) {
//       callback()
//     }

//     const currentWidth = window.innerWidth

//     if (Math.abs(currentWidth - lastWidth) >= basic) {
//       lastWidth = currentWidth
//       callback()
//     }
//   }

//   let timer: number
//   window.addEventListener('resize', () => {
//     clearTimeout(timer)
//     timer = window.setTimeout(onResize, terminal)
//   })
// }
