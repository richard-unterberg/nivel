import { type Locale, resolveLocale } from '@/lib/i18n/config'

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
  },
  search: {
    placeholder: {
      en: 'Search docs...',
      zh: '搜索文档...',
    },
    prompt: {
      en: 'Search by title, heading, or body text.',
      zh: '按标题、小节或正文搜索。',
    },
    loading: {
      en: 'Loading search index...',
      zh: '正在加载搜索索引...',
    },
    empty: {
      en: 'No matching docs found.',
      zh: '没有找到匹配的文档。',
    },
    usefulLinks: {
      en: 'Useful links',
      zh: '实用链接',
    },
    usefulGetStarted: {
      en: 'Get started',
      zh: '开始使用',
    },
    usefulIntroduction: {
      en: 'Introduction',
      zh: '介绍',
    },
    usefulHome: {
      en: 'Home',
      zh: '首页',
    },
    usefulGithub: {
      en: 'GitHub repository',
      zh: 'GitHub 仓库',
    },
  },
  home: {
    titlePrefix: {
      en: 'Telefunc(tions)',
      zh: 'Telefunc(函数)',
    },
    titleAccent: {
      en: '',
      zh: '开发者',
    },
    subtitle: {
      en: 'End-to-End type safety without the schema',
      zh: '是一个以开发者为中心的文档入门套件，构建在 Vike 之上，并针对性能与开发体验进行了优化。',
    },
    cta: {
      en: 'See it in action',
      zh: '查看演示',
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
