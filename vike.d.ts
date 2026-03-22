import type { Locale } from '@/lib/i18n/config'
import type { ThemePreference } from '@/lib/theme'

declare global {
  namespace Vike {
    interface PageContext {
      locale: Locale
      themePreference: ThemePreference
      urlPathnameLocalized: string
    }

    interface PageContextServer {
      locale: Locale
      themePreference: ThemePreference
      urlPathnameLocalized: string
    }

    interface PageContextClient {
      locale: Locale
      themePreference: ThemePreference
      urlPathnameLocalized: string
    }
  }
}

export {}
