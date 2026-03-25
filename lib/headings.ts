import type { Locale } from '@/lib/i18n/config'
import type { MdexSystemConfig } from '@/lib/docs/systemConfig'
import { DEFAULT_LOCALE, resolveLocale } from '@/lib/i18n/config'
import { getDocPath } from '@/lib/docs/systemConfig'
import { localizeHref } from '@/lib/i18n/routing'

type HeadingDefinition = {
  docPath: string
  title: Record<Locale, string>
}

export const headingDefinitions = {
  docsHome: {
    docPath: '',
    title: {
      en: 'Docs',
      zh: '文档',
    },
  },
  getStarted: {
    docPath: 'get-started',
    title: {
      en: 'Welcome',
      zh: '欢迎',
    },
  },
  overview: {
    docPath: 'components/overview',
    title: {
      en: 'Overview',
      zh: '概览',
    },
  },
  components: {
    docPath: 'components/overview',
    title: {
      en: 'Components',
      zh: '组件',
    },
  },
  guides: {
    docPath: 'guides/overview',
    title: {
      en: 'Guides',
      zh: '指南',
    },
  },
} as const satisfies Record<string, HeadingDefinition>

export type HeadingKey = keyof typeof headingDefinitions

const getHeadingTitle = (headingKey: HeadingKey, locale: Locale | string | undefined = DEFAULT_LOCALE) => {
  return headingDefinitions[headingKey].title[resolveLocale(locale)]
}

const getHeadingLink = (headingKey: HeadingKey, mdexConfig?: MdexSystemConfig) => {
  return getDocPath(headingDefinitions[headingKey].docPath, mdexConfig)
}

export const getHeadingData = (
  headingKey: HeadingKey,
  locale: Locale | string | undefined = DEFAULT_LOCALE,
  mdexConfig?: MdexSystemConfig,
) => {
  return {
    title: getHeadingTitle(headingKey, locale),
    href: localizeHref(getHeadingLink(headingKey, mdexConfig), locale),
  }
}
