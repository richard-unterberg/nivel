import type { Locale } from '@/lib/i18n/config'

declare global {
  namespace Vike {
    interface PageContext {
      locale: Locale
      urlPathnameLocalized: string
    }

    interface PageContextServer {
      locale: Locale
      urlPathnameLocalized: string
    }

    interface PageContextClient {
      locale: Locale
      urlPathnameLocalized: string
    }
  }
}

export {}
