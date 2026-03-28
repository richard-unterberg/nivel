import { type BundledLanguage, bundledLanguages, bundledLanguagesAlias, getSingletonHighlighter } from 'shiki'

const shikiThemes = {
  light: 'min-light',
  dark: 'one-dark-pro',
} as const

const embeddedLanguageWarmups: Partial<Record<BundledLanguage, BundledLanguage[]>> = {
  mdx: ['mdx', 'tsx', 'jsx', 'typescript', 'javascript'],
}

const resolveShikiLanguage = (language: string) => {
  if (language in bundledLanguages) {
    return language as BundledLanguage
  }

  const alias = bundledLanguagesAlias[language as keyof typeof bundledLanguagesAlias]
  return typeof alias === 'string' ? alias : null
}

const getShikiHighlighter = async (language: BundledLanguage) => {
  const langs = [...new Set(embeddedLanguageWarmups[language] ?? [language])]

  return getSingletonHighlighter({
    themes: [shikiThemes.light, shikiThemes.dark],
    langs,
  })
}

export const highlightCodeToHast = async (code: string, language: string) => {
  const shikiLanguage = resolveShikiLanguage(language)
  if (!shikiLanguage) return null

  const highlighter = await getShikiHighlighter(shikiLanguage)
  return highlighter.codeToHast(code, {
    lang: shikiLanguage,
    themes: shikiThemes,
  })
}
