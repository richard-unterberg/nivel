import type { Locale } from '@/lib/i18n/config'
import { DEFAULT_LOCALE } from '@/lib/i18n/config'
import { localizeHref, stripLocaleFromPathname } from '@/lib/i18n/routing'

export const headingTitles = {
  scaffoldNewVikeApp: {
    en: 'Scaffold new Vike app',
    zh: '创建新的 Vike 应用',
  },
  addSsrSsgToVite: {
    en: 'Add SSR/SSG to existing Vite app',
    zh: '为现有 Vite 应用添加 SSR/SSG',
  },
  whyVike: {
    en: 'Why Vike',
    zh: '为什么选择 Vike',
  },
  faq: {
    en: 'FAQ',
    zh: '常见问题',
  },
  openSourcePricing: {
    en: 'Open Source Pricing',
    zh: '开源定价',
  },
  freeProgram: {
    en: 'Free Program',
    zh: '免费计划',
  },
  extensions: {
    en: 'Extensions',
    zh: '扩展',
  },
  team: {
    en: 'Team',
    zh: '团队',
  },
  dataFetching: {
    en: 'Data Fetching',
    zh: '数据获取',
  },
  preRendering: {
    en: 'Pre-rendering (SSG)',
    zh: '预渲染 (SSG)',
  },
  ssrVsSpa: {
    en: 'SSR vs SPA',
    zh: 'SSR 与 SPA',
  },
  headTags: {
    en: '`<head>` tags',
    zh: '`<head>` 标签',
  },
  commonIssues: {
    en: 'Common Issues',
    zh: '常见问题',
  },
  routing: {
    en: 'Routing',
    zh: '路由',
  },
  baseUrl: {
    en: 'Base URL',
    zh: '基础 URL',
  },
  activeLinks: {
    en: 'Active Links',
    zh: '激活链接',
  },
  staticDirectory: {
    en: 'Static Directory (`public/`)',
    zh: '静态目录（`public/`）',
  },
  serverClient: {
    en: '`.server.js` / `.client.js / ...`',
    zh: '`.server.js` / `.client.js / ...`',
  },
  environmentVariables: {
    en: 'Environment Variables',
    zh: '环境变量',
  },
  httpHeaders: {
    en: 'HTTP Headers',
    zh: 'HTTP 头',
  },
  i18n: {
    en: 'Internationalization (i18n)',
    zh: '国际化（i18n）',
  },
  pathAliases: {
    en: 'Paths Aliases',
    zh: '路径别名',
  },
  preloading: {
    en: 'Preloading',
    zh: '预加载',
  },
  apiRoutes: {
    en: 'API Routes',
    zh: 'API 路由',
  },
  staticHostsOverview: {
    en: 'Overview',
    zh: '概览',
  },
  githubPages: {
    en: 'GitHub Pages',
    zh: 'GitHub Pages',
  },
  netlify: {
    en: 'Netlify',
    zh: 'Netlify',
  },
  cloudflarePages: {
    en: 'Cloudflare Pages',
    zh: 'Cloudflare Pages',
  },
  cloudflare: {
    en: 'Cloudflare',
    zh: 'Cloudflare',
  },
  vercel: {
    en: 'Vercel',
    zh: 'Vercel',
  },
  awsLambda: {
    en: 'AWS Lambda',
    zh: 'AWS Lambda',
  },
  netlifyFunctions: {
    en: 'Netlify Functions',
    zh: 'Netlify Functions',
  },
  edgeonePages: {
    en: 'EdgeOne Pages',
    zh: 'EdgeOne Pages',
  },
  aws: {
    en: 'AWS',
    zh: 'AWS',
  },
  docker: {
    en: 'Docker',
    zh: 'Docker',
  },
  selfHostedOther: {
    en: 'Other',
    zh: '其他',
  },
  otherDeployment: {
    en: 'Other deployment',
    zh: '其他部署方式',
  },
  authentication: {
    en: 'Authentication',
    zh: '身份认证',
  },
  serverIntegration: {
    en: 'Server integration',
    zh: '服务端集成',
  },
  errorTracking: {
    en: 'Error Tracking',
    zh: '错误追踪',
  },
  cssInJs: {
    en: 'CSS-in-JS',
    zh: 'CSS-in-JS',
  },
  markdown: {
    en: 'Markdown',
    zh: 'Markdown',
  },
  store: {
    en: 'Store (State Management)',
    zh: 'Store（状态管理）',
  },
  graphql: {
    en: 'GraphQL',
    zh: 'GraphQL',
  },
  vanillaUiTools: {
    en: 'Vanilla UI tools',
    zh: '原生 UI 工具',
  },
  analytics: {
    en: 'Analytics',
    zh: '分析',
  },
  componentLibraries: {
    en: 'Component libraries',
    zh: '组件库',
  },
  dataFetchingIntegration: {
    en: 'Data fetching',
    zh: '数据获取',
  },
  serviceWorker: {
    en: 'Service worker',
    zh: 'Service Worker',
  },
  viewTransitions: {
    en: 'View transitions',
    zh: '视图过渡',
  },
  uiFramework: {
    en: 'UI framework',
    zh: 'UI 框架',
  },
  seeAlso: {
    en: 'See also',
    zh: '另请参阅',
  },
} as const

export type HeadingKey = keyof typeof headingTitles

const headingLinks: Record<HeadingKey, string> = {
  scaffoldNewVikeApp: '/new',
  addSsrSsgToVite: '/add',
  whyVike: '/why',
  faq: '/faq',
  openSourcePricing: '/pricing',
  freeProgram: '/free',
  extensions: '/extensions',
  team: '/team',
  dataFetching: '/data-fetching',
  preRendering: '/pre-rendering',
  ssrVsSpa: '/SSR-vs-SPA',
  headTags: '/head-tags',
  commonIssues: '/common-issues',
  routing: '/routing',
  baseUrl: '/base-url',
  activeLinks: '/active-links',
  staticDirectory: '/static-directory',
  serverClient: '/file-env',
  environmentVariables: '/env',
  httpHeaders: '/headers',
  i18n: '/i18n',
  pathAliases: '/path-aliases',
  preloading: '/preloading',
  apiRoutes: '/api-routes',
  staticHostsOverview: '/static-hosts',
  githubPages: '/github-pages',
  netlify: '/netlify',
  cloudflarePages: '/cloudflare-pages',
  cloudflare: '/cloudflare',
  vercel: '/vercel',
  awsLambda: '/aws-lambda',
  netlifyFunctions: '/netlify-functions',
  edgeonePages: '/edgeone-pages',
  aws: '/aws',
  docker: '/docker',
  selfHostedOther: '/deploy',
  otherDeployment: '/deploy',
  authentication: '/auth',
  serverIntegration: '/server-integration',
  errorTracking: '/error-tracking',
  cssInJs: '/css-in-js',
  markdown: '/markdown',
  store: '/store',
  graphql: '/graphql',
  vanillaUiTools: '/integration',
  analytics: '/integration',
  componentLibraries: '/integration',
  dataFetchingIntegration: '/integration',
  serviceWorker: '/integration',
  viewTransitions: '/integration',
  uiFramework: '/ui-frameworks',
  seeAlso: '/integration',
}

export const getHeadingTitle = (headingKey: HeadingKey, locale: Locale = DEFAULT_LOCALE) => {
  return headingTitles[headingKey][locale]
}

export const getHeadingData = (headingKey: HeadingKey, locale: Locale = DEFAULT_LOCALE) => {
  return {
    title: getHeadingTitle(headingKey, locale),
    href: localizeHref(headingLinks[headingKey], locale),
  }
}

export const getHeadingTitleFromHref = (href: string, locale: Locale = DEFAULT_LOCALE) => {
  const pathname = stripLocaleFromPathname(href.split('#')[0]?.split('?')[0] ?? href).pathname
  const match = Object.entries(headingLinks).find(([, headingHref]) => headingHref === pathname)
  if (!match) return null

  const [headingKey] = match
  return getHeadingTitle(headingKey as HeadingKey, locale)
}
