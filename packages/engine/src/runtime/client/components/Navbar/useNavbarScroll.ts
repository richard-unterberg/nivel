import { useEffect, useState } from 'react'

export const useNavbarScroll = (isLandingPage: boolean) => {
  const [isLandingPageScrolled, setIsLandingPageScrolled] = useState(false)

  useEffect(() => {
    if (!isLandingPage) {
      setIsLandingPageScrolled(false)
      return
    }

    const handleScroll = () => {
      setIsLandingPageScrolled(window.scrollY > 20)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isLandingPage])

  return {
    isLandingPageScrolled,
  }
}
