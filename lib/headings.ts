import type { HeadingConfig } from './docs/headings'

export const headingDefinitions = {
  getStarted: {
    docPath: 'get-started',
    title: {
      en: 'Doc maintainer guide',
      zh: '快速开始',
    },
    excerpt: {
      en: 'Get started with telefunc and learn how to create your own documentation site.',
      zh: '开始使用 telefunc, 学习如何创建你自己的文档站点。',
    },
  },
  quickStart: {
    docPath: 'quick-start',
    title: {
      en: 'Quick Start',
      zh: '快速开始',
    },
    excerpt: {
      en: 'Get started with telefunc and learn how to create your own documentation site.',
      zh: '开始使用 telefunc, 学习如何创建你自己的文档站点。',
    },
  },
  concepts: {
    docPath: 'concepts',
    title: {
      en: 'Concepts',
      zh: '概念',
    },
    excerpt: {
      en: 'Learn the core concepts behind telefunc and how it works under the hood.',
      zh: '了解 telefunc 背后的核心概念以及它的底层工作原理。',
    },
  },
  bestPractices: {
    docPath: 'best-practices',
    title: {
      en: 'Best Practices',
      zh: '最佳实践',
    },
    excerpt: {
      en: 'Discover best practices for structuring your documentation and writing effective content.',
      zh: '了解构建文档结构和撰写有效内容的最佳实践。',
    },
  },
  serverIntegration: {
    docPath: 'server-integration',
    title: {
      en: 'Server Integration',
      zh: '服务器集成',
    },
    excerpt: {
      en: 'Learn how to integrate telefunc with your server and deploy your documentation site.',
      zh: '学习如何将 telefunc 集成到你的服务器中，并部署你的文档站点。',
    },
  },
  initialData: {
    docPath: 'initial-data',
    title: {
      en: 'Initial Data',
      zh: '初始数据',
    },
    excerpt: {
      en: 'Learn how to provide initial data for your documentation pages and enhance the user experience.',
      zh: '学习如何为你的文档页面提供初始数据，并提升用户体验。',
    },
  },
  permissions: {
    docPath: 'permissions',
    title: {
      en: 'Permissions',
      zh: '权限',
    },
    excerpt: {
      en: 'Learn how to manage permissions for your documentation site and control access to content.',
      zh: '学习如何管理你的文档站点的权限，并控制内容的访问。',
    },
  },
  validation: {
    docPath: 'validation',
    title: {
      en: 'Validation',
      zh: '验证',
    },
    excerpt: {
      en: 'Learn how to validate your documentation content and ensure it meets quality standards.',
      zh: '学习如何验证你的文档内容，并确保它符合质量标准。',
    },
  },
  fileUploads: {
    docPath: 'file-uploads',
    title: {
      en: 'File Uploads',
      zh: '文件上传',
    },
    excerpt: {
      en: 'Learn how to handle file uploads in your documentation site and provide a seamless experience for users.',
      zh: '学习如何在你的文档站点处理文件上传，并为用户提供无缝的体验。',
    },
  },
  errorHandling: {
    docPath: 'error-handling',
    title: {
      en: 'Error Handling',
      zh: '错误处理',
    },
    excerpt: {
      en: 'Learn how to handle errors in your documentation site and provide helpful feedback to users.',
      zh: '学习如何在你的文档站点处理错误，并为用户提供有用的反馈。',
    },
  },
  whySchemaless: {
    docPath: 'why-schemaless',
    title: {
      en: 'Why Schemaless?',
      zh: '为什么无模式？',
    },
    excerpt: {
      en: 'Learn about the benefits of using a schemaless approach for your documentation content.',
      zh: '了解使用无模式方法为你的文档内容带来的好处。',
    },
  },
  howItWorks: {
    docPath: 'how-it-works',
    title: {
      en: 'How It Works',
      zh: '它是如何工作的？',
    },
    excerpt: {
      en: 'Learn how telefunc works under the hood and how it provides a seamless documentation experience.',
      zh: '了解 telefunc 是如何工作的，以及它如何提供无缝的文档体验。',
    },
  },
  apiTelefunc: {
    docPath: 'telefunc',
    title: {
      en: '`telefunc()`',
      zh: '`telefunc()`',
    },
    excerpt: {
      en: 'Learn about the telefunc API and how to use it to create powerful documentation sites.',
      zh: '了解 telefunc API 以及如何使用它来创建强大的文档站点。',
    },
  },
  throwAbort: {
    docPath: 'throw-abort',
    title: {
      en: '`throw Abort()`',
      zh: '`throw Abort()`',
    },
    excerpt: {
      en: 'Learn about the throwAbort API and how to use it to handle errors in your documentation site.',
      zh: '了解 throwAbort API 以及如何使用它来处理你的文档站点中的错误。',
    },
  },
  getContext: {
    docPath: 'get-context',
    title: {
      en: '`getContext()`',
      zh: '`getContext()`',
    },
    excerpt: {
      en: 'Learn about the getContext API and how to use it to access context in your documentation site.',
      zh: '了解 getContext API 以及如何使用它来访问你的文档站点中的上下文。',
    },
  },
  shield: {
    docPath: 'shield',
    title: {
      en: '`shield()`',
      zh: '`shield()`',
    },
    excerpt: {
      en: 'Learn about the shield API and how to use it to protect your documentation site from unauthorized access.',
      zh: '了解 shield API 以及如何使用它来保护你的文档站点免受未经授权的访问。',
    },
  },
  onBug: {
    docPath: 'on-bug',
    title: {
      en: '`onBug()`',
      zh: '`onBug()`',
    },
    excerpt: {
      en: 'Learn about the onBug API and how to use it to handle bugs in your documentation site.',
      zh: '了解 onBug API 以及如何使用它来处理你的文档站点中的错误。',
    },
  },
  onAbort: {
    docPath: 'on-abort',
    title: {
      en: '`onAbort()`',
      zh: '`onAbort()`',
    },
    excerpt: {
      en: 'Learn about the onAbort API and how to use it to handle aborted requests in your documentation site.',
      zh: '了解 onAbort API 以及如何使用它来处理你的文档站点中的中止请求。',
    },
  },
  telefuncUrl: {
    docPath: 'telefunc-url',
    title: {
      en: '`telefuncURL`',
      zh: 'telefunc URL',
    },
    excerpt: {
      en: 'Learn about the telefunc URL structure and how to use it to organize your documentation content.',
      zh: '了解 telefunc URL 结构以及如何使用它来组织你的文档内容。',
    },
  },
  disableNamingConvention: {
    docPath: 'disable-naming-convention',
    title: {
      en: '`disableNamingConvention`',
      zh: '禁用命名约定',
    },
    excerpt: {
      en: 'Learn how to disable the naming convention for your documentation content and use custom names.',
      zh: '学习如何禁用你的文档内容的命名约定，并使用自定义名称。',
    },
  },
  httpHeaders: {
    docPath: 'http-headers',
    title: {
      en: '`httpHeaders`',
      zh: 'HTTP 头',
    },
    excerpt: {
      en: 'Learn about the HTTP headers used in telefunc and how to customize them for your documentation site.',
      zh: '了解 telefunc 中使用的 HTTP 头，以及如何为你的文档站点自定义它们。',
    },
  },
  fetch: {
    docPath: 'fetch',
    title: {
      en: '`fetch`',
      zh: '`fetch`',
    },
    excerpt: {
      en: 'Learn how to use the fetch API in your documentation site and make requests to your server.',
      zh: '学习如何在你的文档站点使用 fetch API，并向你的服务器发出请求。',
    },
  },
  telefuncFiles: {
    docPath: 'telefunc-files',
    title: {
      en: '`telefuncFiles`',
      zh: 'telefunc 文件',
    },
    excerpt: {
      en: 'Learn about telefunc files and how to use them to organize your documentation content.',
      zh: '了解 telefunc 文件以及如何使用它们来组织你的文档内容。',
    },
  },
  root: {
    docPath: 'root',
    title: {
      en: '`root`',
      zh: '介绍',
    },
    excerpt: {
      en: 'Welcome to the telefunc documentation! This is your starting point for learning about telefunc and how to use it to create powerful documentation sites.',
      zh: '欢迎来到 telefunc 文档！这是你学习 telefunc 以及如何使用它来创建强大的文档站点的起点。',
    },
  },
  configShield: {
    docPath: 'shield',
    title: {
      en: '`shield`',
      zh: '`shield`',
    },
    excerpt: {
      en: 'Learn about the shield API and how to use it to protect your documentation site from unauthorized access.',
      zh: '了解 shield API 以及如何使用它来保护你的文档站点免受未经授权的访问。',
    },
  },
  log: {
    docPath: 'log',
    title: {
      en: '`log`',
      zh: '`log`',
    },
    excerpt: {
      en: 'Learn about the log API and how to use it to log information in your documentation site.',
      zh: '了解 log API 以及如何使用它来在你的文档站点中记录信息。',
    },
  },
} satisfies HeadingConfig
