export { BatiWidget }

import { useEffect, useState } from 'react'
import { useThemePreference } from '@/components/ThemeProvider'

function BatiWidget() {
  const [isLoading, setIsLoading] = useState(true)
  const { themePreference } = useThemePreference()

  useEffect(() => {
    ;(async () => {
      // Move this import to +client.js once we make non-global +client.js work
      await import('@batijs/elements' as string)
      setIsLoading(false)
    })()
  }, [])

  if (isLoading) {
    return <span className="loading loading-spinner loading-sm block min-h-140"></span>
  }

  return (
    <>
      <div className="container shadow-thick shadow-vike-grey dark:shadow-base-300/80 rounded-[20px] overflow-hidden">
        {/* @ts-expect-error */}
        <bati-widget theme={themePreference} />
      </div>
    </>
  )
}
