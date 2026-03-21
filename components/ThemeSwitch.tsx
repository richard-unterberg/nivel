import { cmMerge } from '@classmatejs/solid'
import Moon from 'lucide-solid/icons/moon'
import Sun from 'lucide-solid/icons/sun'
import { createSignal, onMount } from 'solid-js'

const ThemeSwitch = () => {
  const [isLight, setIsLight] = createSignal(false)

  const updateTheme = (isLight: boolean) => {
    const html = document.documentElement
    html.setAttribute('data-theme', isLight ? 'vike-light' : 'vike-dark')
    setIsLight(isLight)
  }

  onMount(() => {
    setIsLight(document.documentElement.getAttribute('data-theme') === 'vike-light')
  })

  return (
    <label class="cursor-pointer swap swap-rotate rounded-full bg-base-100 p-2">
      <input
        type="checkbox"
        checked={isLight()}
        aria-label="Toggle light theme"
        onChange={(event) => updateTheme(event.currentTarget.checked)}
      />
      <Sun class={cmMerge('h-4 w-4', 'swap-on')} />
      <Moon class={cmMerge('h-4 w-4', 'swap-off')} />
    </label>
  )
}

export default ThemeSwitch
