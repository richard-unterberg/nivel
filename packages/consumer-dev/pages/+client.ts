import type { NivelActionEventDetail } from '@unterberg/nivel/client'

type Umami = {
  track: (name: string, data?: Record<string, unknown>) => void
}

type PendingAnalyticsEvent = {
  data: Record<string, unknown>
  name: string
}

declare global {
  interface Window {
    __nivelAnalyticsListenerInstalled?: boolean
    umami?: Umami
  }
}

const WEBSITE_ID = '1d5fc8f9-2ff4-4846-a242-1a2b061572ed'
const MAX_PENDING_EVENTS = 20
const pendingEvents: PendingAnalyticsEvent[] = []

const eventNamesByAction: Record<string, string> = {
  'code.copy': 'nivel_code_copy',
  'code.choice_change': 'nivel_code_choice_change',
  'page.copy_link': 'nivel_page_copy_link',
  'llm.open_chatgpt': 'nivel_open_chatgpt',
  'llm.open_claude': 'nivel_open_claude',
}

const getUmami = () => {
  return window.umami && typeof window.umami.track === 'function' ? window.umami : null
}

const flushPendingEvents = () => {
  const umami = getUmami()
  if (!umami) {
    return
  }

  while (pendingEvents.length > 0) {
    const event = pendingEvents.shift()
    if (event) {
      umami.track(event.name, event.data)
    }
  }
}

const trackAnalyticsEvent = (name: string, data: Record<string, unknown>) => {
  const umami = getUmami()
  if (umami) {
    umami.track(name, data)
    return
  }

  pendingEvents.push({ data, name })
  if (pendingEvents.length > MAX_PENDING_EVENTS) {
    pendingEvents.shift()
  }
}

const getElementText = (element: Element) => {
  const normalizedText = element.textContent?.replace(/\s+/g, ' ').trim()
  return normalizedText || null
}

const findNearestPreviousHeading = (target: Element) => {
  const root = target.closest('[data-doc-content]')
  const component = target.closest('[data-nivel-component]') ?? target
  if (!root) {
    return null
  }

  let heading: Element | null = null
  for (const candidate of root.querySelectorAll('h1, h2, h3, h4')) {
    const position = candidate.compareDocumentPosition(component)
    if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
      heading = candidate
      continue
    }
    break
  }

  return heading ? getElementText(heading) : null
}

const isNivelActionEventDetail = (value: unknown): value is NivelActionEventDetail => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'action' in value &&
    typeof value.action === 'string' &&
    'component' in value &&
    typeof value.component === 'string'
  )
}

const installNivelAnalyticsListener = () => {
  if (window.__nivelAnalyticsListenerInstalled) {
    return
  }

  window.__nivelAnalyticsListenerInstalled = true
  document.addEventListener('nivel:action', (event) => {
    if (!(event instanceof CustomEvent) || !isNivelActionEventDetail(event.detail)) {
      return
    }

    console.log('Nivel action event:', event.detail)

    const eventName = eventNamesByAction[event.detail.action]
    if (!eventName) {
      return
    }

    console.log(`Tracking analytics event: ${eventName}`, event.detail)

    const target = event.target instanceof Element ? event.target : null
    const component = target?.closest('[data-nivel-component]')

    trackAnalyticsEvent(eventName, {
      ...event.detail,
      componentHandle: component?.getAttribute('data-nivel-component') ?? null,
      pathname: window.location.pathname,
      sectionTitle: target ? findNearestPreviousHeading(target) : null,
    })
  })
}

const loadAnalytics = () => {
  const existingScript = document.querySelector(`script[data-website-id="${WEBSITE_ID}"]`)
  if (existingScript) {
    existingScript.addEventListener('load', flushPendingEvents, { once: true })
    flushPendingEvents()
    return
  }

  const script = document.createElement('script')
  script.src = 'https://cloud.umami.is/script.js'
  script.async = true
  script.dataset.websiteId = WEBSITE_ID
  script.addEventListener('load', flushPendingEvents, { once: true })
  document.head.appendChild(script)
}

const scheduleAnalyticsLoad = () => {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(loadAnalytics, { timeout: 3000 })
    return
  }

  globalThis.setTimeout(loadAnalytics, 1500)
}

installNivelAnalyticsListener()

if (document.readyState === 'complete') {
  scheduleAnalyticsLoad()
} else {
  window.addEventListener('load', scheduleAnalyticsLoad, { once: true })
}
