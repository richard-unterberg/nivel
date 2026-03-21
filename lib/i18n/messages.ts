import type { Locale } from '@/lib/i18n/config'

export const messages = {
  header: {
    docsHome: {
      en: 'Docs',
      zh: '文档',
    },
  },
  home: {
    title: {
      en: 'Welcome',
      zh: '欢迎',
    },
    subtitle: {
      en: 'A Vike docs prototype with locale-aware routing and localized MDX content.',
      zh: '一个带有多语言路由和本地化 MDX 内容的 Vike 文档原型。',
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
    overview: {
      en: 'Overview',
      zh: '概览',
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
    deploy: {
      en: 'Deploy',
      zh: '部署',
    },
    staticHosts: {
      en: 'Static hosts',
      zh: '静态托管',
    },
    serverless: {
      en: 'Full-stack (serverless)',
      zh: '全栈（Serverless）',
    },
    selfHosted: {
      en: 'Full-stack (self-hosted)',
      zh: '全栈（自托管）',
    },
    integration: {
      en: 'Integration',
      zh: '集成',
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
  locale: Locale,
  group: TGroup,
  key: TKey,
) => {
  const entry = messages[group][key] as Record<Locale, string>
  return entry[locale]
}
