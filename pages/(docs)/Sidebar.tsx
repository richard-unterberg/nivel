import { cmMerge } from '@classmatejs/solid'
import { LucideIcon } from 'lucide-solid'
import Compass from 'lucide-solid/icons/compass'
import Map from 'lucide-solid/icons/map'
import Plug from 'lucide-solid/icons/plug'
import Rocket from 'lucide-solid/icons/rocket'
import Sprout from 'lucide-solid/icons/sprout'
import { createMemo, For, JSXElement } from 'solid-js'
import { usePageContext } from 'vike-solid/usePageContext'
import { getHeadingData } from '@/lib/headings-flat'
import { t } from '@/lib/i18n/messages'
import { getLogicalPathname } from '@/lib/i18n/routing'

type Heading = {
  title: JSXElement
  href: string
}

type Category = {
  title?: JSXElement
  children?: Heading[]
}

type MenuGroup = {
  icon?: LucideIcon
  title: JSXElement
  links?: (Heading | Category)[]
}

const isCategory = (item: Heading | Category): item is Category => 'children' in item

const isActiveHref = (currentPathname: string, href: string) => {
  const currentLogicalPathname = getLogicalPathname(currentPathname)
  const hrefLogicalPathname = getLogicalPathname(href)
  return hrefLogicalPathname === '/'
    ? currentLogicalPathname === hrefLogicalPathname
    : currentLogicalPathname.startsWith(hrefLogicalPathname)
}

const hasActiveChild = (items: (Heading | Category)[], currentPathname: string): boolean => {
  return items.some((item) =>
    isCategory(item)
      ? Boolean(item.children) && hasActiveChild(item.children as Heading[], currentPathname)
      : isActiveHref(currentPathname, item.href),
  )
}

const renderInlineMarkdown = (title: JSXElement): JSXElement => {
  if (typeof title !== 'string') return title

  return title.split(/(`[^`]+`)/g).map((part) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code>{part.slice(1, -1)}</code>
    }

    return part
  })
}

const getMenu = (locale: 'en' | 'zh'): MenuGroup[] => [
  {
    icon: Sprout,
    title: t(locale, 'sidebar', 'getStarted'),
    links: [getHeadingData('scaffoldNewVikeApp', locale), getHeadingData('addSsrSsgToVite', locale)],
  },
  {
    icon: Compass,
    title: t(locale, 'sidebar', 'overview'),
    links: [
      getHeadingData('whyVike', locale),
      getHeadingData('faq', locale),
      getHeadingData('openSourcePricing', locale),
      getHeadingData('freeProgram', locale),
      getHeadingData('extensions', locale),
      getHeadingData('team', locale),
    ],
  },
  {
    icon: Map,
    title: t(locale, 'sidebar', 'guides'),
    links: [
      {
        title: t(locale, 'sidebar', 'basics'),
        children: [
          getHeadingData('dataFetching', locale),
          getHeadingData('preRendering', locale),
          getHeadingData('ssrVsSpa', locale),
          getHeadingData('headTags', locale),
          getHeadingData('commonIssues', locale),
        ],
      },
      {
        title: t(locale, 'sidebar', 'routing'),
        children: [
          getHeadingData('routing', locale),
          getHeadingData('baseUrl', locale),
          getHeadingData('activeLinks', locale),
        ],
      },
      {
        title: t(locale, 'sidebar', 'more'),
        children: [
          getHeadingData('staticDirectory', locale),
          getHeadingData('serverClient', locale),
          getHeadingData('environmentVariables', locale),
          getHeadingData('httpHeaders', locale),
          getHeadingData('i18n', locale),
          getHeadingData('pathAliases', locale),
          getHeadingData('preloading', locale),
          getHeadingData('apiRoutes', locale),
        ],
      },
    ],
  },
  {
    title: t(locale, 'sidebar', 'deploy'),
    icon: Rocket,
    links: [
      {
        title: t(locale, 'sidebar', 'staticHosts'),
        children: [
          getHeadingData('staticHostsOverview', locale),
          getHeadingData('githubPages', locale),
          getHeadingData('netlify', locale),
          getHeadingData('cloudflarePages', locale),
        ],
      },
      {
        title: t(locale, 'sidebar', 'serverless'),
        children: [
          getHeadingData('cloudflare', locale),
          getHeadingData('vercel', locale),
          getHeadingData('awsLambda', locale),
          getHeadingData('netlifyFunctions', locale),
          getHeadingData('edgeonePages', locale),
        ],
      },
      {
        title: t(locale, 'sidebar', 'selfHosted'),
        children: [
          getHeadingData('aws', locale),
          getHeadingData('docker', locale),
          getHeadingData('selfHostedOther', locale),
        ],
      },
      getHeadingData('otherDeployment', locale),
    ],
  },
  {
    title: t(locale, 'sidebar', 'integration'),
    icon: Plug,
    links: [
      getHeadingData('authentication', locale),
      getHeadingData('serverIntegration', locale),
      getHeadingData('errorTracking', locale),
      getHeadingData('cssInJs', locale),
      getHeadingData('markdown', locale),
      getHeadingData('store', locale),
      getHeadingData('graphql', locale),
      getHeadingData('vanillaUiTools', locale),
      getHeadingData('analytics', locale),
      getHeadingData('componentLibraries', locale),
      getHeadingData('dataFetchingIntegration', locale),
      getHeadingData('serviceWorker', locale),
      getHeadingData('viewTransitions', locale),
      getHeadingData('uiFramework', locale),
      getHeadingData('seeAlso', locale),
    ],
  },
]

const MenuLink = (props: Heading & { currentPathname: string }) => {
  return (
    <li>
      <a
        href={props.href}
        class={cmMerge('justify-start', isActiveHref(props.currentPathname, props.href) && 'menu-active')}
      >
        {renderInlineMarkdown(props.title)}
      </a>
    </li>
  )
}

const MenuCategory = (props: Category & { currentPathname: string }) => {
  const _isOpen = createMemo(() => (props.children ? hasActiveChild(props.children, props.currentPathname) : false))

  return (
    <li>
      <details open={_isOpen()}>
        <summary class="text-vike-grey-200">{renderInlineMarkdown(props.title)}</summary>
        <ul>
          <For each={props.children}>{(item) => <MenuItem item={item} currentPathname={props.currentPathname} />}</For>
        </ul>
      </details>
    </li>
  )
}

const MenuItem = (props: { item: Heading | Category; currentPathname: string }) => {
  return isCategory(props.item) ? (
    <MenuCategory {...props.item} currentPathname={props.currentPathname} />
  ) : (
    <MenuLink {...props.item} currentPathname={props.currentPathname} />
  )
}

const MenuGroupComponent = (props: MenuGroup & { currentPathname: string }) => {
  const Icon = props.icon

  return (
    <li>
      <details open class="">
        <summary class="text-vike-grey-100">
          {Icon && <Icon class="inline w-3 h-3" />}
          <span class="text-base-content font-semibold ">{renderInlineMarkdown(props.title)}</span>
        </summary>
        <ul>
          <For each={props.links}>{(item) => <MenuItem item={item} currentPathname={props.currentPathname} />}</For>
        </ul>
      </details>
    </li>
  )
}

const Sidebar = () => {
  const pageContext = usePageContext()
  const menu = createMemo(() => getMenu(pageContext.locale))

  return (
    <div class="-translate-x-4 pr-4 h-[calc(100svh-20*var(--spacing))] overflow-y-scroll overflow-x-hidden sticky top-20 border-r border-vike-grey">
      <ul class="menu w-full px-0">
        <For each={menu()}>
          {(group) => (
            <MenuGroupComponent
              {...group}
              currentPathname={pageContext.urlPathnameLocalized ?? pageContext.urlPathname}
            />
          )}
        </For>
      </ul>
    </div>
  )
}

export default Sidebar
