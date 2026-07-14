import { maMerge } from '@marmo/react'
import { Link } from '@unterberg/nivel'
import type { HTMLAttributes } from 'react'

const CTAButtons = (props: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={maMerge('flex justify-center gap-x-3 sm:gap-x-5 mx-9 not-prose mb-10 mt-4 md:my-10', props.className)}
      {...props}
    >
      <Link
        href={`/quick-start`}
        className="btn btn-secondary sm:btn-lg"
        aria-label="Get started with telefunc by following the quick start guide"
      >
        Get started
      </Link>
      <Link
        href={`/concepts`}
        className="btn btn-ghost border-base-content bg-transparent sm:btn-lg"
        aria-label="Learn more about the concepts behind telefunc"
      >
        Learn more
      </Link>
    </div>
  )
}

export default CTAButtons
