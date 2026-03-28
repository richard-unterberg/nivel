import { ArrowBigDownDash, Sticker } from 'lucide-react'
import { usePageContext } from 'vike-react/usePageContext'
import { MdxCodeBlock } from '@/components/docs/CodeBlock'
import GradientText from '@/components/GradientText'
import LayoutComponent from '@/components/LayoutComponent'
import baseAssets from '@/lib/baseAssets'
import { t } from '@/lib/messages'

/*
frontend:

// CreateTodo.tsx
// Environment: client
 
// CreateTodo.telefunc.ts isn't actually loaded;
// Telefunc transforms it into a thin HTTP client.
import { onNewTodo } from './CreateTodo.telefunc.ts'
 
async function onClick(form) {
  const text = form.input.value
  // Behind the scenes, Telefunc makes an HTTP request
  // to the server.
  await onNewTodo(text)
}
 
function CreateTodo() {
  return (
    <form>
      <input input="text"></input>
      <button onClick={onClick}>Add To-Do</button>
    </form>
  )
}

*/

const frontendCode = `// CreateTodo.telefunc.ts isn't actually loaded;
// Telefunc transforms it into a thin HTTP client.
import { onNewTodo } from './CreateTodo.telefunc.ts'
 
async function onClick(form) {
  const text = form.input.value
  // Behind the scenes, Telefunc makes an HTTP request
  // to the server.
  await onNewTodo(text)
}
 
function CreateTodo() {
  return (
    <form>
      <input input="text"></input>
      <button onClick={onClick}>Add To-Do</button>
    </form>
  )
}
`

/*
server:


*/

const backendCode = `// CreateTodo.telefunc.ts
// Environment: server
 
// Telefunc makes onNewTodo() remotely callable
// from the browser.
export { onNewTodo }
 
import { getContext } from 'telefunc'
 
// Telefunction arguments are automatically validated
// at runtime, so \`text\` is guaranteed to be a string.
async function onNewTodo(text: string) {
  const { user } = getContext()
 
  // With an ORM
  await Todo.create({ text, authorId: user.id })
 
  // With SQL
  await sql(
    'INSERT INTO todo_items VALUES (:text, :authorId)',
    { text, authorId: user.id }
  )
}
`

const Page = () => {
  const { locale } = usePageContext()

  return (
    <>
      <div className="overflow-x-clip min-h-[calc(100svh-40*var(--spacing))] flex flex-col justify-center gap-16 py-16">
        <LayoutComponent className="relative">
          <div className="z-1 object-center absolute w-300 h-300 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <img
              src={`${baseAssets}decorators/mascot-bg.avif`}
              alt=""
              width={300}
              height={300}
              className="w-full h-full select-none pointer-events-none opacity-40 dark:opacity-45"
            />
          </div>
          <div className="text-center mx-auto z-2 relative">
            <h1 className="text-4xl lg:text-5xl xl:text-7xl font-bold">
              {t(locale, 'home', 'titlePrefix')}{' '}
              <GradientText className="">{t(locale, 'home', 'titleAccent')}</GradientText>
            </h1>
            <p className="font-normal text-base-muted text-lg lg:text-3xl mt-6">{t(locale, 'home', 'subtitle')}</p>
          </div>
        </LayoutComponent>
        <LayoutComponent $size="sm" className="relative grid grid-cols-2 gap-4 items-stretch ">
          <MdxCodeBlock data-language="typescript" data-language-label="Called on the frontend">
            {frontendCode}
          </MdxCodeBlock>
          <MdxCodeBlock data-language="typescript" data-language-label="Defined on the server">
            {backendCode}
          </MdxCodeBlock>
        </LayoutComponent>
      </div>
      <div className=" animate-bounce">
        <Sticker className="w-8 h-8 mx-auto mb-2 text-base-muted" />
        <ArrowBigDownDash className="w-6 h-6 mx-auto text-base-muted animate-bounce" />
      </div>
    </>
  )
}

export default Page
