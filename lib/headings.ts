import type { HeadingConfig } from './docs/headings'

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
      en: 'Welcome to mdex',
      zh: '欢迎使用 mdex',
    },
    excerpt: {
      en: 'Get started with mdex and learn how to create your own documentation site.',
      zh: '开始使用 mdex, 学习如何创建你自己的文档站点。',
    },
  },
  designSystem: {
    docPath: 'design-theming',
    title: {
      en: 'Design System',
      zh: '使用 Tailwind CSS 和 DaisyUI 进行样式设计',
    },
    excerpt: {
      en: 'Learn how to style your mdex documentation site using Tailwind CSS and DaisyUI.',
      zh: '学习如何使用 Tailwind CSS 和 DaisyUI 来设计你的 mdex 文档站点。',
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
  componentsOverview: {
    docPath: 'components',
    title: {
      en: 'Overview',
      zh: '概览',
    },
    navTitle: {
      en: 'Components',
      zh: '组件',
    },
    excerpt: {
      en: 'Get an overview of all the components available in mdex and how they can enhance your docs.',
      zh: '概览 mdex 中的所有组件以及它们如何增强你的文档。',
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
  tailwind: {
    docPath: 'guides/tailwind',
    title: {
      en: 'Master the Design System',
      zh: '使用 Tailwind CSS 和 DaisyUI 进行样式设计',
    },
    excerpt: {
      en: 'Learn how to style your mdex documentation site using Tailwind CSS and DaisyUI.',
      zh: '学习如何使用 Tailwind CSS 和 DaisyUI 来设计你的 mdex 文档站点。',
    },
  },
  daisyUiTestRange: {
    docPath: 'guides/daisy-ui-test-range',
    title: {
      en: 'DaisyUI Test Range',
      zh: 'DaisyUI 测试范围',
    },
    excerpt: {
      en: 'Explore the test range for DaisyUI components and ensure compatibility with mdex.',
      zh: '探索 DaisyUI 组件的测试范围，确保与 mdex 的兼容性。',
    },
  },
} satisfies HeadingConfig
