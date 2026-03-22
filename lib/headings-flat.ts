import type { Locale } from '@/lib/i18n/config'
import { DEFAULT_LOCALE } from '@/lib/i18n/config'
import { localizeHref, stripLocaleFromPathname } from '@/lib/i18n/routing'

const createUntranslatedHeadings = <const T extends Record<string, string>>(titles: T) => {
  return Object.fromEntries(Object.entries(titles).map(([key, title]) => [key, { en: title, zh: title }])) as {
    [K in keyof T]: { en: T[K]; zh: T[K] }
  }
}

const baseHeadingTitles = {
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
    zh: '静态目录（`public/`)',
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
    zh: '国际化 (i18n)',
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
    zh: 'Store (态管理)',
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

const apiHeadingTitles = {
  ...createUntranslatedHeadings({
    apiPageContext: '`pageContext`',
    apiGlobalContext: '`globalContext`',
    apiPlusPage: '`+Page`',
    apiPlusRoute: '`+route`',
    apiPlusHead: '`+Head`',
    apiPlusLayout: '`+Layout`',
    apiPlusWrapper: '`+Wrapper`',
    apiPlusClient: '`+client.js`',
    apiCli: 'CLI',
    apiData: '`+data()`',
    apiGuard: '`+guard()`',
    apiOnBeforeRender: '`+onBeforeRender()`',
    apiOnHydrationEnd: '`+onHydrationEnd()`',
    apiOnError: '`+onError()`',
    apiOnHookCall: '`+onHookCall()`',
    apiOnPageTransitionStart: '`+onPageTransitionStart()`',
    apiOnCreatePageContext: '`+onCreatePageContext()`',
    apiOnCreateGlobalContext: '`+onCreateGlobalContext()`',
    apiOnBeforePrerenderStart: '`+onBeforePrerenderStart()`',
    apiOnPrerenderStart: '`+onPrerenderStart()`',
    apiUseData: '`useData()`',
    apiUsePageContext: '`usePageContext()`',
    apiUseConfig: '`useConfig()`',
    apiUseHydrated: '`useHydrated()`',
    apiGetGlobalContext: '`getGlobalContext()`',
    apiThrowRedirect: '`throw redirect()`',
    apiThrowRender: '`throw render()`',
    apiClientOnlyComponent: '`<ClientOnly>`',
    apiModifyUrl: '`modifyUrl()`',
    apiNavigate: '`navigate()`',
    apiReload: '`reload()`',
    apiPrefetch: '`prefetch()`',
    apiRenderPage: '`renderPage()`',
    apiEscapeInject: '`escapeInject`',
    apiInjectFilter: '`injectFilter()`',
    apiTitleSetting: '`+title`',
    apiDescriptionSetting: '`+description`',
    apiImageSetting: '`+image`',
    apiViewportSetting: '`+viewport`',
    apiHtmlAttributesSetting: '`+htmlAttributes`',
    apiBodyAttributesSetting: '`+bodyAttributes`',
    apiSsrSetting: '`+ssr`',
    apiStreamSetting: '`+stream`',
    apiPhotonSetting: '`+photon`',
    apiPrerenderSetting: '`+prerender`',
    apiRedirectsSetting: '`+redirects`',
    apiKeepScrollPositionSetting: '`+keepScrollPosition`',
    apiPrefetchStaticAssetsSetting: '`+prefetchStaticAssets`',
    apiHooksTimeoutSetting: '`+hooksTimeout`',
    apiPassToClientSetting: '`+passToClient`',
    apiHeadersResponseSetting: '`+headersResponse`',
    apiCspSetting: '`+csp`',
    apiClientRoutingSetting: '`+clientRouting`',
    apiMetaSetting: '`+meta`',
    apiLoading: '`<Loading>`',
    apiFavicon: '`favicon`',
    apiLang: '`lang`',
    apiReactSetting: '`+react`',
    apiHeadHtmlBegin: '`headHtmlBegin`',
    apiHeadHtmlEnd: '`headHtmlEnd`',
    apiBodyHtmlBegin: '`bodyHtmlBegin`',
    apiBodyHtmlEnd: '`bodyHtmlEnd`',
    apiInjectScriptsAt: '`injectScriptsAt`',
    apiInjectAssets: '`injectAssets()`',
    apiCreateDevMiddleware: '`createDevMiddleware()`',
    apiHydrationCanBeAborted: '`hydrationCanBeAborted`',
    apiExtends: '`extends`',
    apiHost: '`+host`',
    apiPort: '`+port`',
    apiForce: '`+force`',
    apiMode: '`+mode`',
    apiGetPageContextServer: '`getPageContext()`',
    apiGetPageContextClient: '`getPageContextClient()`',
    apiGetVikeConfig: '`getVikeConfig()`',
    apiReactStrictMode: '`reactStrictMode`',
    apiClientHooks: '`clientHooks`',
    apiRequire: '`require`',
    apiFilesystemRoutingRoot: '`filesystemRoutingRoot`',
    apiClientOnlyHelper: '`clientOnly()`',
  } as const),
  apiConfigFiles: {
    en: 'Config Files',
    zh: '配置文件',
  },
  apiJavaScriptApi: {
    en: 'JavaScript API',
    zh: 'JavaScript API',
  },
  apiErrorPage: {
    en: 'Error Page',
    zh: '错误页面',
  },
  apiFilesystemRouting: {
    en: 'Filesystem Routing',
    zh: '文件系统路由',
  },
  apiRouteString: {
    en: 'Route String',
    zh: '路由字符串',
  },
  apiRouteFunction: {
    en: 'Route Function',
    zh: '路由函数',
  },
  apiRoutingPrecedence: {
    en: 'Routing Precedence',
    zh: '路由优先级',
  },
  apiHooksMore: {
    en: 'Overview',
    zh: '概览',
  },
  apiSettingsMore: {
    en: '... more',
    zh: '更多...',
  },
  apiFileStructure: {
    en: 'File Structure',
    zh: '文件结构',
  },
  apiOnRenderHtml: {
    en: '`+onRenderHtml()` hook',
    zh: '`+onRenderHtml()` 钩子',
  },
  apiOnRenderClient: {
    en: '`+onRenderClient()` hook',
    zh: '`+onRenderClient()` 钩子',
  },
  apiOnBeforeRenderHtml: {
    en: '`+onBeforeRenderHtml()` hook',
    zh: '`+onBeforeRenderHtml()` 钩子',
  },
  apiOnAfterRenderHtml: {
    en: '`+onAfterRenderHtml()` hook',
    zh: '`+onAfterRenderHtml()` 钩子',
  },
  apiOnBeforeRoute: {
    en: '`+onBeforeRoute()` hook',
    zh: '`+onBeforeRoute()` 钩子',
  },
  apiOnData: {
    en: '`+onData()` hook',
    zh: '`+onData()` 钩子',
  },
  apiOnCreateApp: {
    en: '`+onCreateApp()` hook',
    zh: '`+onCreateApp()` 钩子',
  },
  apiOnPageTransitionEnd: {
    en: '`+onPageTransitionEnd()` hook',
    zh: '`+onPageTransitionEnd()` 钩子',
  },
  apiOnBeforeRenderClient: {
    en: '`+onBeforeRenderClient()` hook',
    zh: '`+onBeforeRenderClient()` 钩子',
  },
  apiOnAfterRenderClient: {
    en: '`+onAfterRenderClient()` hook',
    zh: '`+onAfterRenderClient()` 钩子',
  },
  apiVitePlugin: {
    en: 'Vite plugin',
    zh: 'Vite 插件',
  },
} as const

export const headingTitles = {
  ...baseHeadingTitles,
  ...apiHeadingTitles,
} as const

export type HeadingKey = keyof typeof headingTitles

const baseHeadingLinks = {
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
} as const

const apiHeadingLinks = {
  apiPageContext: '/pageContext',
  apiGlobalContext: '/globalContext',
  apiPlusPage: '/Page',
  apiPlusRoute: '/route',
  apiPlusHead: '/Head',
  apiPlusLayout: '/Layout',
  apiPlusWrapper: '/Wrapper',
  apiConfigFiles: '/config',
  apiCli: '/cli',
  apiJavaScriptApi: '/api',
  apiErrorPage: '/error-page',
  apiPlusClient: '/client',
  apiFilesystemRouting: '/filesystem-routing',
  apiRouteString: '/route-string',
  apiRouteFunction: '/route-function',
  apiRoutingPrecedence: '/routing-precedence',
  apiData: '/data',
  apiGuard: '/guard',
  apiOnBeforeRender: '/onBeforeRender',
  apiOnHydrationEnd: '/onHydrationEnd',
  apiOnError: '/onError',
  apiOnHookCall: '/onHookCall',
  apiOnPageTransitionStart: '/onPageTransitionStart',
  apiOnCreatePageContext: '/onCreatePageContext',
  apiOnCreateGlobalContext: '/onCreateGlobalContext',
  apiOnBeforePrerenderStart: '/onBeforePrerenderStart',
  apiOnPrerenderStart: '/onPrerenderStart',
  apiHooksMore: '/hooks',
  apiUseData: '/useData',
  apiUsePageContext: '/usePageContext',
  apiUseConfig: '/useConfig',
  apiUseHydrated: '/useHydrated',
  apiGetGlobalContext: '/getGlobalContext',
  apiThrowRedirect: '/redirect',
  apiThrowRender: '/render',
  apiClientOnlyComponent: '/ClientOnly',
  apiModifyUrl: '/modifyUrl',
  apiNavigate: '/navigate',
  apiReload: '/reload',
  apiPrefetch: '/prefetch',
  apiRenderPage: '/renderPage',
  apiEscapeInject: '/escapeInject',
  apiInjectFilter: '/injectFilter',
  apiTitleSetting: '/title',
  apiDescriptionSetting: '/description',
  apiImageSetting: '/image',
  apiViewportSetting: '/viewport',
  apiHtmlAttributesSetting: '/htmlAttributes',
  apiBodyAttributesSetting: '/bodyAttributes',
  apiSsrSetting: '/ssr',
  apiStreamSetting: '/stream',
  apiPhotonSetting: '/photon',
  apiPrerenderSetting: '/prerender',
  apiRedirectsSetting: '/redirects',
  apiKeepScrollPositionSetting: '/keepScrollPosition',
  apiPrefetchStaticAssetsSetting: '/prefetchStaticAssets',
  apiHooksTimeoutSetting: '/hooksTimeout',
  apiPassToClientSetting: '/passToClient',
  apiHeadersResponseSetting: '/headersResponse',
  apiCspSetting: '/csp',
  apiClientRoutingSetting: '/clientRouting',
  apiMetaSetting: '/meta',
  apiSettingsMore: '/settings',
  apiLoading: '/Loading',
  apiFavicon: '/favicon',
  apiFileStructure: '/file-structure',
  apiLang: '/lang',
  apiReactSetting: '/react-setting',
  apiOnRenderHtml: '/onRenderHtml',
  apiOnRenderClient: '/onRenderClient',
  apiOnBeforeRenderHtml: '/onBeforeRenderHtml',
  apiOnAfterRenderHtml: '/onAfterRenderHtml',
  apiHeadHtmlBegin: '/headHtmlBegin',
  apiHeadHtmlEnd: '/headHtmlEnd',
  apiBodyHtmlBegin: '/bodyHtmlBegin',
  apiBodyHtmlEnd: '/bodyHtmlEnd',
  apiInjectScriptsAt: '/injectScriptsAt',
  apiInjectAssets: '/injectAssets',
  apiCreateDevMiddleware: '/createDevMiddleware',
  apiOnBeforeRoute: '/onBeforeRoute',
  apiOnData: '/onData',
  apiHydrationCanBeAborted: '/hydrationCanBeAborted',
  apiExtends: '/extends',
  apiOnCreateApp: '/onCreateApp',
  apiHost: '/host',
  apiPort: '/port',
  apiForce: '/force',
  apiMode: '/mode',
  apiGetPageContextServer: '/getPageContext',
  apiGetPageContextClient: '/getPageContextClient',
  apiGetVikeConfig: '/getVikeConfig',
  apiReactStrictMode: '/reactStrictMode',
  apiOnPageTransitionEnd: '/onPageTransitionEnd',
  apiOnBeforeRenderClient: '/onBeforeRenderClient',
  apiOnAfterRenderClient: '/onAfterRenderClient',
  apiClientHooks: '/clientHooks',
  apiRequire: '/require',
  apiFilesystemRoutingRoot: '/filesystemRoutingRoot',
  apiVitePlugin: '/vite-plugin',
  apiClientOnlyHelper: '/clientOnly-helper',
} as const

const headingLinks: Record<HeadingKey, string> = {
  ...baseHeadingLinks,
  ...apiHeadingLinks,
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
