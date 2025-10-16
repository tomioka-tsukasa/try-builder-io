// import { Variants } from 'framer-motion'

// type TransitionProps = {
//   duration?: number
//   delay?: number
//   ease?: string | number[]
//   stiffness?: number
//   damping?: number
//   mass?: number
//   type?: string
// }

// /**
//  * Framer Motion用の共通アニメーションバリアントを提供するユーティリティ
//  */
// class MotionVariants {


//   /**
//    * 拡大しながらフェードインするアニメーション
//    * @param initialScale 初期スケール値
//    * @param transition トランジション設定
//    */
//   static scaleIn(initialScale = 0.8, transition?: TransitionProps): Variants {
//     return {
//       hidden: { opacity: 0, scale: initialScale },
//       visible: {
//         opacity: 1,
//         scale: 1,
//         transition
//       }
//     }
//   }  /**
//   * 拡大しながらフェードインするアニメーション
//   * @param initialScale 初期スケール値
//   * @param transition トランジション設定
//   */
//   static scaleInTopTitle(initialScale = 0.8, transition?: TransitionProps): Variants {
//     return {
//       hidden: { opacity: 0, x: 300, scale: initialScale },
//       visible: {
//         opacity: 1,
//         x: 0,
//         scale: 1,
//         transition
//       }
//     }
//   }

//   /**
//    * 水平方向のスライドインアニメーション
//    * @param distance スライドする距離（負の値で左から、正の値で右からスライド）
//    * @param transition トランジション設定
//    */
//   static slideInX(distance = 50, transition?: TransitionProps): Variants {
//     return {
//       hidden: { opacity: 0, x: distance },
//       visible: {
//         opacity: 1,
//         x: 0,
//         transition
//       }
//     }
//   }

//   /**
//    * 垂直方向のスライドインアニメーション
//    * @param distance スライドする距離（負の値で上から、正の値で下からスライド）
//    * @param transition トランジション設定
//    */
//   static slideInY(distance = 50, transition?: TransitionProps): Variants {
//     return {
//       hidden: { opacity: 0, y: distance },
//       visible: {
//         opacity: 1,
//         y: 0,
//         transition
//       }
//     }
//   }

//   static slideInXY(distanceX = 50, distanceY = 50, transition?: TransitionProps): Variants {
//     return {
//       hidden: { opacity: 0, x: distanceX, y: distanceY },
//       visible: { opacity: 1, x: 0, y: 0, transition }
//     }
//   }

//   /**
//    * バウンス効果付きのスライドインアニメーション（Y軸）
//    * @param distance スライドする距離
//    * @param stiffness バネの硬さ
//    * @param damping 減衰係数
//    */
//   static bounceY(distance = 100, stiffness = 100, damping = 10): Variants {
//     return {
//       hidden: { opacity: 0, y: distance },
//       visible: {
//         opacity: 1,
//         y: 0,
//         transition: {
//           type: 'spring',
//           stiffness,
//           damping
//         }
//       }
//     }
//   }

//   /**
//    * バウンス効果付きのスライドインアニメーション（X軸）
//    * @param distance スライドする距離
//    * @param stiffness バネの硬さ
//    * @param damping 減衰係数
//    */
//   static bounceX(distance = 100, stiffness = 100, damping = 10): Variants {
//     return {
//       hidden: { opacity: 0, x: distance },
//       visible: {
//         opacity: 1,
//         x: 0,
//         transition: {
//           type: 'spring',
//           stiffness,
//           damping
//         }
//       }
//     }
//   }

//   /**
//    * フェードインアニメーション
//    * @param transition トランジション設定
//    */
//   static fadeIn(transition?: TransitionProps): Variants {
//     return {
//       hidden: { opacity: 0 },
//       visible: {
//         opacity: 1,
//         transition
//       }
//     }
//   }

//   /**
//    * 回転しながらフェードインするアニメーション
//    * @param rotate 回転角度
//    * @param transition トランジション設定
//    */
//   static rotateIn(rotate = 10, transition?: TransitionProps): Variants {
//     return {
//       hidden: { opacity: 0, rotate },
//       visible: {
//         opacity: 1,
//         rotate: 0,
//         transition
//       }
//     }
//   }

// }

// export default MotionVariants
