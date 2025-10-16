/**
 * Xシェア機能を提供するサンプルhook
 */
function useShare() {
  /**
   * Xシェアサンプル関数
   * storeから自動的に診断結果を取得し、適切なシェア文言を生成してシェアウィンドウを開く
   */
  const shareResult = () => {
    // シェア文言を生成
    const shareText = 'シェアテキスト'.trim()

    // URLエンコード
    const encodedText = encodeURIComponent(shareText)

    // Xのシェアウィンドウを開く
    window.open(`https://x.com/intent/tweet?text=${encodedText}`, '_blank')
  }

  return { shareResult }
}

export default useShare
