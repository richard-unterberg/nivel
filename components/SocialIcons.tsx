import baseAssets from '@/lib/baseAssets'

const icons = {
  github: {
    icon: `github.svg`,
    href: 'https://github.com/vikejs/vike',
  },
  // discord: {
  //   icon: `discord.svg`,
  //   href: 'https://discord.com/invite/hfHhnJyVg8',
  // },
  // x: {
  //   icon: `x.svg`,
  //   href: 'https://x.com/vike_js',
  // },
  // bluesky: {
  //   icon: `bluesky.svg`,
  //   href: 'https://bsky.app/profile/vike.dev',
  // },
  linkedin: {
    icon: `linkedin.svg`,
    href: 'https://www.linkedin.com/company/vikejs/posts/?feedView=all',
  },
}

const SocialIcons = () => {
  return (
    <ul className="flex gap-1 items-center">
      {Object.entries(icons).map(([key, { icon, href }]) => (
        <li key={key} className="m-0 p-0">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full flex items-center justify-center border bg-base-200 border-base-light w-8 h-8"
          >
            <img
              src={`${baseAssets}brands/${icon}`}
              alt={`${key} icon`}
              className="w-auto h-3 dark:invert opacity-75"
            />
          </a>
        </li>
      ))}
    </ul>
  )
}

export default SocialIcons
