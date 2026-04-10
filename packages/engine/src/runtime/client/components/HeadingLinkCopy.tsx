import { useEffect } from 'react'

const copyText = async (value: string) => {
  try {
    await navigator.clipboard.writeText(value)
    return
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = value
    textarea.setAttribute('readonly', 'true')
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }
}

const getHeadingLink = (target: EventTarget | null) =>
  target instanceof Element ? target.closest('a[data-copy-heading-link]') : null

export const HeadingLinkCopy = () => {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) {
        return
      }

      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return
      }

      const link = getHeadingLink(event.target)
      if (!link) {
        return
      }

      const href = link.getAttribute('href')
      if (!href) {
        return
      }

      const nextUrl = new URL(href, window.location.href)
      if (nextUrl.hash && window.location.hash !== nextUrl.hash) {
        history.replaceState(null, '', nextUrl.hash)
      }

      void copyText(nextUrl.href)
    }

    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  return null
}
