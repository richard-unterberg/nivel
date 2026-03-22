import { usePageContext } from 'vike-react/usePageContext'
import { getMenuNavigation } from '@/pages/(docs)/Sidebar/menuNavigation'
import SidebarNavigation from '@/pages/(docs)/Sidebar/SidebarNavigation'

const MenuTab = () => {
  const pageContext = usePageContext()
  const menu = getMenuNavigation(pageContext.locale)

  return (
    <SidebarNavigation groups={menu} currentPathname={pageContext.urlPathnameLocalized ?? pageContext.urlPathname} />
  )
}

export default MenuTab
