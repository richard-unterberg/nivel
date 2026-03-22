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
      en: 'Framework for<br className="hidden sm:block" /> Stability and Freedom',
      zh: '稳定与自由的框架',
    },
    subtitle: {
      en: "Vike is a minimal-lock-in framework that prioritizes application stability and development freedom, powered by an open foundation built for JavaScript's rapidly evolving ecosystem.",
      zh: 'Vike 是一个极简锁定的框架，优先考虑应用程序的稳定性和开发自由度，由一个开放的基础构建，为 JavaScript 快速发展的生态系统而构建。',
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
    hooks: {
      en: 'Hooks',
      zh: '钩子',
    },
    more: {
      en: 'More',
      zh: '更多',
    },
    other: {
      en: 'Other',
      zh: '其他',
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
      zh: '全栈 (Serverless)',
    },
    selfHosted: {
      en: 'Full-stack (self-hosted)',
      zh: '全栈（自托管）',
    },
    integration: {
      en: 'Integration',
      zh: '集成',
    },
    utilsShared: {
      en: 'Utils (server- & client-side)',
      zh: '工具函数（服务端与客户端）',
    },
    utilsClient: {
      en: 'Utils (client-side)',
      zh: '工具函数（仅客户端）',
    },
    utilsServer: {
      en: 'Utils (server-side)',
      zh: '工具函数（仅服务端）',
    },
    settings: {
      en: 'Settings',
      zh: '配置',
    },
    htmlShell: {
      en: 'HTML shell',
      zh: 'HTML 外壳',
    },
    advanced: {
      en: 'Advanced',
      zh: '高级',
    },
    seeAlso: {
      en: 'See also',
      zh: '另请参阅',
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
    apiReference: {
      en: 'API Reference',
      zh: 'API 参考',
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
