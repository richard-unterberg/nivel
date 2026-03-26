import MenuTab from '@/components/Sidebar/MenuTab'

const Sidebar = () => {
  return (
    <div className="-ml-3 sticky top-16">
      <div className="absolute h-full w-px right-0 top-0 bg-linear-to-t to-base-light  via-base-light  pointer-events-none z-1"></div>
      <div className="pr-4 h-[calc(100svh-16*var(--spacing))] overflow-y-scroll overflow-x-hidden  relative z-10">
        <MenuTab />
      </div>
    </div>
  )
}

export default Sidebar
