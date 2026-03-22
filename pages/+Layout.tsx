import type { ReactNode } from 'react'
import Navbar from '@/components/Navbar'
import { ThemeProvider } from '@/components/ThemeProvider'

const PageLayout = (props: { children: ReactNode }) => {
  return (
    <ThemeProvider>
      <Navbar />
      <div className="pt-16">{props.children}</div>
    </ThemeProvider>
  )
}

export default PageLayout
