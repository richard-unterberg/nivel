import type { MdexSystemConfig, ResolvedMdexSystemConfig } from '@/lib/docs/systemConfig'
import type { Locale } from '@/lib/i18n/config'
import type { ThemePreference } from '@/lib/theme'

declare global {
  interface ImportMetaEnv {
    readonly BASE_ASSETS?: string
  }

  namespace Vike {
    interface Config {
      mdex?: MdexSystemConfig
    }

    interface ConfigResolved {
      mdex?: ResolvedMdexSystemConfig
    }

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
