import { Languages } from 'lucide-react'
import type { ChangeEvent } from 'react'
import { navigate } from 'vike/client/router'
import { usePageContext } from 'vike-react/usePageContext'
import { localeLabels, locales } from '@/lib/i18n/config'
import { getLogicalPathname, localizeHref, stripLocaleFromPathname } from '@/lib/i18n/routing'
import { useUserSettingsStore } from '@/lib/settings-store'

const LanguageSwitch = () => {
  const { urlPathnameLocalized, urlPathname } = usePageContext()
  const setLocalePreference = useUserSettingsStore((state) => state.setLocalePreference)
  const currentLocalizedPathname = urlPathnameLocalized ?? urlPathname
  const logicalPathname = getLogicalPathname(currentLocalizedPathname)
  const currentLocale = stripLocaleFromPathname(currentLocalizedPathname).locale

  const onChange = async (event: ChangeEvent<HTMLSelectElement>) => {
    const select = event.currentTarget
    const selectedLocale = select.value as (typeof locales)[number]
    const newHref = localizeHref(logicalPathname, selectedLocale)

    setLocalePreference(selectedLocale)

    if (newHref === currentLocalizedPathname) return
    navigate(newHref)
  }

  return (
    <label className="select select-sm w-28">
      <span className="floating-label">
        <Languages className="w-4 h-4" />
      </span>
      <select value={currentLocale} onChange={(event) => void onChange(event)} aria-label="Switch language">
        {locales.map((locale) => (
          <option key={locale} value={locale}>
            {localeLabels[locale]}
          </option>
        ))}
      </select>
    </label>
  )
}

export default LanguageSwitch
