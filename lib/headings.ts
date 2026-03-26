import type { MdexSystemConfig } from '@/lib/docs/systemConfig'
import { getDocPath } from '@/lib/docs/systemConfig'
import type { Locale } from '@/lib/i18n/config'
import { DEFAULT_LOCALE, resolveLocale } from '@/lib/i18n/config'
import { localizeHref } from '@/lib/i18n/routing'

type HeadingDefinition = {
  docPath: string
  title: Record<Locale, string>
  navTitle?: Record<Locale, string>
  excerpt?: Record<Locale, string>
}

export const headingDefinitions = {
  docsHome: {
    docPath: '',
    title: {
      en: 'Docs',
      zh: '文档',
    },
    excerpt: {
      en: 'Explore the documentation for mdex, a modern docs template for Vike.',
      zh: '探索 mdex 的文档, mdex 是一个为 Vike 设计的现代文档模板。',
    },
  },
  getStarted: {
    docPath: 'get-started',
    title: {
      en: 'Welcome',
      zh: '欢迎',
    },
    excerpt: {
      en: 'Get started with mdex and learn how to create your own documentation site.',
      zh: '开始使用 mdex, 学习如何创建你自己的文档站点。',
    },
  },
  components: {
    docPath: 'components',
    title: {
      en: 'Components',
      zh: '组件',
    },
    navTitle: {
      en: 'Overview',
      zh: '组件概览',
    },
    excerpt: {
      en: 'Discover the key features and benefits of using mdex for your documentation needs.',
      zh: '了解使用 mdex 满足你的文档需求的主要功能和优势。',
    },
  },
  guides: {
    docPath: 'guides',
    title: {
      en: 'Guides',
      zh: '指南',
    },
    excerpt: {
      en: 'Follow step-by-step guides to make the most out of mdex and customize your docs site.',
      zh: '按照分步指南充分利用 mdex 并定制你的文档站点。',
    },
  },
  alert: {
    docPath: 'components/alert',
    title: {
      en: 'Alert',
      zh: '警告提示',
    },
    excerpt: {
      en: 'Learn how to use the Alert component to display important messages and notifications.',
      zh: '学习如何使用 Alert 组件来显示重要消息和通知。',
    },
  },
} as const satisfies Record<string, HeadingDefinition>

export type HeadingKey = keyof typeof headingDefinitions

const normalizeDocPath = (value: string) => value.replace(/^\/+|\/+$/g, '')

const getHeadingDefinition = (headingKey: HeadingKey) => {
  return headingDefinitions[headingKey] as HeadingDefinition
}

const getHeadingByDocPath = (docPath: string) => {
  const normalizedDocPath = normalizeDocPath(docPath)

  return Object.values(headingDefinitions).find((heading) => normalizeDocPath(heading.docPath) === normalizedDocPath) as
    | HeadingDefinition
    | undefined
}

const getHeadingTitle = (headingKey: HeadingKey, locale: Locale | string | undefined = DEFAULT_LOCALE) => {
  return getHeadingDefinition(headingKey).title[resolveLocale(locale)]
}

const getHeadingNavTitle = (headingKey: HeadingKey, locale: Locale | string | undefined = DEFAULT_LOCALE) => {
  const resolvedLocale = resolveLocale(locale)
  const heading = getHeadingDefinition(headingKey)

  return heading.navTitle?.[resolvedLocale] ?? heading.title[resolvedLocale]
}

const getHeadingLink = (headingKey: HeadingKey, mdexConfig?: MdexSystemConfig) => {
  return getDocPath(getHeadingDefinition(headingKey).docPath, mdexConfig)
}

export const getHeadingData = (
  headingKey: HeadingKey,
  locale: Locale | string | undefined = DEFAULT_LOCALE,
  mdexConfig?: MdexSystemConfig,
) => {
  return {
    title: getHeadingNavTitle(headingKey, locale),
    href: localizeHref(getHeadingLink(headingKey, mdexConfig), locale),
  }
}

export const getDocHeadingMetadata = (docPath: string, locale: Locale | string | undefined = DEFAULT_LOCALE) => {
  const heading = getHeadingByDocPath(docPath)

  if (!heading) {
    return null
  }

  const resolvedLocale = resolveLocale(locale)

  return {
    title: heading.title[resolvedLocale],
    description: heading.excerpt?.[resolvedLocale] ?? null,
  }
}
