import { usePageContext } from 'vike-react/usePageContext'
import { getApiNavigation } from '@/docs/(components)/Sidebar/apiNavigation'
import SidebarNavigation from '@/docs/(components)/Sidebar/SidebarNavigation'

const ApiTab = () => {
  const pageContext = usePageContext()
  const groups = getApiNavigation(pageContext.locale)

  return (
    <SidebarNavigation groups={groups} currentPathname={pageContext.urlPathnameLocalized ?? pageContext.urlPathname} />
  )
}

export default ApiTab
