import { JSXElement } from 'solid-js'

const DocsLayout = ({ children }: { children: JSXElement }) => {
  return (
    <div class="max-w-7xl grid grid-cols-12 gap-4 mx-auto">
      <div class="bg-warning text-warning-content col-span-4">Sidebar</div>
      <div class="col-span-8">{children}</div>
    </div>
  )
}

export default DocsLayout
