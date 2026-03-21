export const locales = ['en', 'zh'] as const

export type Locale = (typeof locales)[number]

export const DEFAULT_LOCALE: Locale = 'en'

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  zh: '中文',
}

export const localeHtmlLang: Record<Locale, string> = {
  en: 'en',
  zh: 'zh-CN',
}

export const isLocale = (value: string): value is Locale => {
  return locales.includes(value as Locale)
}
