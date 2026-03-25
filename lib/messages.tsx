import { type Locale, resolveLocale } from '@/lib/i18n/config'

const messages = {
  landing: {
    uspDesignSytemTitle: {
      en: 'Built on a design system',
      zh: '构建于设计系统之上',
    },
    uspDesignSystemDescription: {
      en: 'mdex is built on top of a design system, ensuring consistency and ease of maintenance across your documentation.',
      zh: 'mdex 构建于设计系统之上，确保文档的一致性和易维护性。',
    },
    uspVikePoweredTitle: {
      en: 'Powered by Vike & Vite',
      zh: '由 Vike 和 Vite 提供支持',
    },
    uspVikePoweredDescription: {
      en: 'Built on top of Vike, mdex offers a modern development experience with fast performance and great DX.',
      zh: '构建于 Vike 之上, mdex 提供了现代化的开发体验，具有快速的性能和出色的开发者体验。',
    },
    uspDeveloperExperienceTitle: {
      en: 'Optimized for DX',
      zh: '优化的开发者体验',
    },
    uspDeveloperExperienceDescription: {
      en: 'mdex is designed with developers in mind, offering a familiar file-based routing system and easy customization options.',
      zh: 'mdex 以开发者为中心设计，提供了熟悉的基于文件的路由系统和易于定制的选项。',
    },
  },
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
    titlePrefix: {
      en: 'Docs for',
      zh: '为',
    },
    titleAccent: {
      en: 'Developers',
      zh: '开发者',
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
