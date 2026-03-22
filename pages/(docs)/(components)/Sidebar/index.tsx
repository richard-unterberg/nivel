import { useState } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import ApiTab from '@/docs/(components)/Sidebar/ApiTab'
import MenuTab from '@/docs/(components)/Sidebar/MenuTab'
import appConfig from '@/lib/config'
import { t } from '@/lib/i18n/messages'

const Sidebar = () => {
  const [selectedTab, setSelectedTab] = useState<'menu' | 'api'>('menu')
  const { locale } = usePageContext()

  return (
    <div className="-ml-4 sticky top-16 shadow-lg shadow-base-300 ">
      <img
        src={`${appConfig.publicAssets}decorators/nav-shade.png`}
        alt=""
        width={400}
        height={400}
        className="w-150 absolute right-px top-0 hidden dark:block opacity-100 z-2 pointer-events-none"
      />
      <div className="absolute h-full w-px right-0 top-0 bg-linear-to-t to-vike-grey/20 via-vike-grey from-vike-grey/20 pointer-events-none z-1"></div>
      <div className="pr-4 h-[calc(100svh-16*var(--spacing))] overflow-y-scroll overflow-x-hidden  relative z-10">
        <ul className="menu menu-sm menu-horizontal gap-1">
          <li>
            <button
              className={selectedTab === 'menu' ? 'justify-start menu-active text-primary' : 'justify-start'}
              onClick={() => setSelectedTab('menu')}
            >
              {t(locale, 'docs', 'documentation')}
            </button>
          </li>
          <li>
            <button
              className={selectedTab === 'api' ? 'justify-start menu-active text-primary' : 'justify-start'}
              onClick={() => setSelectedTab('api')}
            >
              {t(locale, 'docs', 'apiReference')}
            </button>
          </li>
        </ul>
        {selectedTab === 'menu' ? <MenuTab /> : <ApiTab />}
      </div>
    </div>
  )
}

export default Sidebar
