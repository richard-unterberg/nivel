import { type Locale, resolveLocale } from '@/lib/i18n/config'

const messages = {
  header: {
    docsHome: {
      en: 'Docs',
      zh: '文档',
    },
    componentsHome: {
      en: 'Components',
      zh: '组件',
    },
    blogHome: {
      en: 'Blog',
      zh: '博客',
    },
    searchPlaceholder: {
      en: 'Search the page...',
      zh: '搜索页面内容...',
    },
  },
  home: {
    title: {
      en: 'Document anything',
      zh: '记录一切，遗忘无物',
    },
    subtitle: {
      en: 'mdex is a developer-focused documentation starter kit built on top of Vike, optimized for performance and developer experience.',
      zh: 'mdex 是一个以开发者为中心的文档入门套件，构建在 Vike 之上，并针对性能与开发体验进行了优化。',
    },
    cta: {
      en: 'Get started',
      zh: '开始阅读',
    },
  },
  sidebar: {
    getStarted: {
      en: 'Get Started',
      zh: '开始',
    },
    components: {
      en: 'Components',
      zh: '组件',
    },
    guides: {
      en: 'Guides',
      zh: '指南',
    },
    basics: {
      en: 'Basics',
      zh: '基础',
    },
    routing: {
      en: 'Routing',
      zh: '路由',
    },
    more: {
      en: 'More',
      zh: '更多',
    },
  },
  docs: {
    onThisPage: {
      en: 'On this page',
      zh: '本页导航',
    },
    edit: {
      en: 'Edit this page',
      zh: '编辑此页',
    },
    reportIssue: {
      en: 'Report an issue',
      zh: '报告问题',
    },
    documentation: {
      en: 'Documentation',
      zh: '文档',
    },
    componentReference: {
      en: 'Component Reference',
      zh: '块引用',
    },
  },
  error: {
    internalTitle: {
      en: 'Internal Error',
      zh: '内部错误',
    },
    internalBody: {
      en: 'Something went wrong.',
      zh: '发生了错误。',
    },
    notFoundTitle: {
      en: 'Page Not Found',
      zh: '页面未找到',
    },
    notFoundBody: {
      en: 'This page could not be found.',
      zh: '无法找到该页面。',
    },
  },
} as const

type Messages = typeof messages
type MessageGroup = keyof Messages
type MessageKey<TGroup extends MessageGroup> = keyof Messages[TGroup]

export const t = <TGroup extends MessageGroup, TKey extends MessageKey<TGroup>>(
  locale: Locale | string | undefined,
  group: TGroup,
  key: TKey,
) => {
  const entry = messages[group][key] as Record<Locale, string>
  return entry[resolveLocale(locale)]
}
