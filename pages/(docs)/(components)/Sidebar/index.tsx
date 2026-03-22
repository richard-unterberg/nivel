import { useState } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import ApiTab from '@/docs/(components)/Sidebar/ApiTab'
import MenuTab from '@/docs/(components)/Sidebar/MenuTab'
import { t } from '@/lib/i18n/messages'

const Sidebar = () => {
  const [selectedTab, setSelectedTab] = useState<'menu' | 'api'>('menu')
  const { locale } = usePageContext()

  return (
    <div className="border-r border-vike-grey -translate-x-4 pr-4 h-[calc(100svh-16*var(--spacing))] overflow-y-scroll overflow-x-hidden sticky top-16">
      <ul className="menu menu-sm menu-horizontal gap-1">
        <li>
          <button
            className={selectedTab === 'menu' ? 'justify-start menu-active' : 'justify-start'}
            onClick={() => setSelectedTab('menu')}
          >
            {t(locale, 'docs', 'documentation')}
          </button>
        </li>
        <li>
          <button
            className={selectedTab === 'api' ? 'justify-start menu-active' : 'justify-start'}
            onClick={() => setSelectedTab('api')}
          >
            {t(locale, 'docs', 'apiReference')}
          </button>
        </li>
      </ul>
      {selectedTab === 'menu' ? <MenuTab /> : <ApiTab />}
    </div>
  )
}

export default Sidebar
