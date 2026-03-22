import type { SidebarGroup } from '@/docs/(components)/Sidebar/SidebarNavigation'
import { getHeadingData, type HeadingKey } from '@/lib/headings-flat'
import type { Locale } from '@/lib/i18n/config'
import { t } from '@/lib/i18n/messages'

type ApiGroupDefinition = {
  titleKey:
    | 'basics'
    | 'routing'
    | 'hooks'
    | 'utilsShared'
    | 'utilsClient'
    | 'utilsServer'
    | 'settings'
    | 'htmlShell'
    | 'advanced'
    | 'seeAlso'
  headings: HeadingKey[]
}

const apiGroups: ApiGroupDefinition[] = [
  {
    titleKey: 'basics',
    headings: [
      'apiPageContext',
      'apiGlobalContext',
      'apiPlusPage',
      'apiPlusRoute',
      'apiPlusHead',
      'apiPlusLayout',
      'apiPlusWrapper',
      'apiConfigFiles',
      'apiCli',
      'apiJavaScriptApi',
      'apiErrorPage',
      'apiPlusClient',
    ],
  },
  {
    titleKey: 'routing',
    headings: ['apiFilesystemRouting', 'apiRouteString', 'apiRouteFunction', 'apiRoutingPrecedence'],
  },
  {
    titleKey: 'hooks',
    headings: [
      'apiHooksMore',
      'apiData',
      'apiGuard',
      'apiOnBeforeRender',
      'apiOnHydrationEnd',
      'apiOnError',
      'apiOnHookCall',
      'apiOnPageTransitionStart',
      'apiOnCreatePageContext',
      'apiOnCreateGlobalContext',
      'apiOnBeforePrerenderStart',
      'apiOnPrerenderStart',
    ],
  },
  {
    titleKey: 'utilsShared',
    headings: [
      'apiUseData',
      'apiUsePageContext',
      'apiUseConfig',
      'apiUseHydrated',
      'apiGetGlobalContext',
      'apiThrowRedirect',
      'apiThrowRender',
      'apiClientOnlyComponent',
      'apiModifyUrl',
    ],
  },
  {
    titleKey: 'utilsClient',
    headings: ['apiNavigate', 'apiReload', 'apiPrefetch'],
  },
  {
    titleKey: 'utilsServer',
    headings: ['apiRenderPage', 'apiEscapeInject', 'apiInjectFilter'],
  },
  {
    titleKey: 'settings',
    headings: [
      'apiTitleSetting',
      'apiDescriptionSetting',
      'apiImageSetting',
      'apiViewportSetting',
      'apiHtmlAttributesSetting',
      'apiBodyAttributesSetting',
      'apiSsrSetting',
      'apiStreamSetting',
      'apiPhotonSetting',
      'apiPrerenderSetting',
      'apiRedirectsSetting',
      'apiKeepScrollPositionSetting',
      'apiPrefetchStaticAssetsSetting',
      'apiHooksTimeoutSetting',
      'apiPassToClientSetting',
      'apiHeadersResponseSetting',
      'apiCspSetting',
      'apiClientRoutingSetting',
      'apiMetaSetting',
      'apiSettingsMore',
    ],
  },
]

export const getApiNavigation = (locale: Locale): SidebarGroup[] => {
  return apiGroups.map((group) => ({
    title: t(locale, 'sidebar', group.titleKey),
    links: group.headings.map((headingKey) => getHeadingData(headingKey, locale)),
  }))
}
