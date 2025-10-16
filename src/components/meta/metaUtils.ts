/**
 * メタタグを更新するユーティリティ関数
 */

// タイトルを更新
export const updateTitle = (title: string): void => {
  document.title = title
}

// メタタグを更新（name属性）
export const updateNameMeta = (name: string, content: string): void => {
  let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement
  if (!element) {
    element = document.createElement('meta')
    element.name = name
    document.head.appendChild(element)
  }
  element.content = content
}

// メタタグを更新（property属性）
export const updatePropertyMeta = (property: string, content: string): void => {
  let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute('property', property)
    document.head.appendChild(element)
  }
  element.content = content
}

// カノニカルリンクを更新
export const updateCanonical = (href: string): void => {
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.appendChild(canonical)
  }
  canonical.href = href
}
