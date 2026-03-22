import { usePageContext } from 'vike-react/usePageContext'
import { getMenuNavigation } from '@/docs/(components)/Sidebar/menuNavigation'
import SidebarNavigation from '@/docs/(components)/Sidebar/SidebarNavigation'

const MenuTab = () => {
  const pageContext = usePageContext()
  const menu = getMenuNavigation(pageContext.locale)

  return (
    <SidebarNavigation groups={menu} currentPathname={pageContext.urlPathnameLocalized ?? pageContext.urlPathname} />
  )
}

export default MenuTab
