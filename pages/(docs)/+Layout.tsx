import cm from '@classmatejs/solid'
import { JSXElement } from 'solid-js'
import LayoutComponent from '@/components/LayoutComponent'
import Sidebar from '@/pages/(docs)/Sidebar'

const ProseContainer = cm.section`
  prose 
  prose-neutral 
  dark:prose-invert 
  prose-a:text-primary
  prose-code:bg-base-200!
  prose-pre:bg-base-200!
  pt-12
`

const DocsLayout = (props: { children: JSXElement }) => {
  return (
    <>
      <div class="absolute w-full h-[80svh] top-0 left-0 bg-linear-to-b from-base-200 to-base-300" />
      <LayoutComponent class="flex mx-auto gap-14">
        <div class="w-90">
          <Sidebar />
        </div>
        <ProseContainer class="flex-1">
          <div>{props.children}</div>
          <footer class="mb-8 text-sm text-base-content/60">
            <a href="vike.dev" class="text-primary">
              Vike
            </a>{' '}
            &copy; {new Date().getFullYear()}. All rights reserved.
          </footer>
        </ProseContainer>
      </LayoutComponent>
    </>
  )
}

export default DocsLayout
