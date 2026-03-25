import { usePageContext } from 'vike-react/usePageContext'
import SidebarNavigation from '@/components/Sidebar/SidebarNavigation'
import { getMenuNavigation } from '@/lib/navigation/menuNavigation'

const MenuTab = () => {
  const { locale, urlPathnameLocalized, urlPathname } = usePageContext()
  const menu = getMenuNavigation(locale)

  return <SidebarNavigation groups={menu} currentPathname={urlPathnameLocalized ?? urlPathname} />
}

export default MenuTab
