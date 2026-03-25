import { cmMerge } from '@classmatejs/react'
import { Search as SearchIcon } from 'lucide-react'
import { useState } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import { t } from '@/lib/messages'

const Search = () => {
  const { locale } = usePageContext()
  const [isSearchHovered, setIsSearchHovered] = useState(false)

  return (
    <div className={cmMerge('relative w-50 text-right')}>
      <button
        type="button"
        className="absolute z-2 inset-0 cursor-pointer "
        onMouseEnter={() => setIsSearchHovered(true)}
        onMouseLeave={() => setIsSearchHovered(false)}
      />
      <label
        className={cmMerge(
          'input input-sm',
          isSearchHovered ? 'border-accent/70 shadow-lg shadow-primary/30' : 'shadow-transparent',
        )}
      >
        <span className="floating-label">
          <SearchIcon className={cmMerge('w-4 h-4', isSearchHovered ? '' : '')} />
        </span>
        <input
          type="text"
          placeholder={t(locale, 'header', 'searchPlaceholder')}
          className={cmMerge(
            'w-fit placeholder:text-vike-grey-300/50 transition-colors',
            isSearchHovered && 'placeholder:text-vike-grey-300',
          )}
        />
      </label>
    </div>
  )
}

export default Search
