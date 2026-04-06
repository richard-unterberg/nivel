import cm from '@classmatejs/react'

export const ProseContainer = cm.section`
  prose 
  prose-neutral
  max-w-none
  dark:prose-invert
  prose-a:text-primary

  prose-pre:bg-base-200!

  prose-code:py-0!
  prose-code:px-1!

  prose-code:rounded!
  prose-code:dark:inset-shadow-2xs

  prose-code:bg-primary/5!
  prose-code:border-primary/15!

  prose-code:dark:bg-primary/10!
  prose-code:dark:border-primary/20!

  prose-p:leading-[200%]
  prose-li:leading-[200%]
  prose-table:my-8
  prose-table:w-full
  prose-table:text-sm
  prose-th:align-top
  prose-th:font-semibold
  prose-td:align-top
  [&_table_code]:whitespace-nowrap
  [&_thead]:bg-base-200/70

  prose-p:after:content-none
  prose-p:before:content-none
  prose-blockquote:not-italic
  prose-blockquote:bg-base-200
  prose-blockquote:py-2
  prose-li:my-1
  prose-figure:mb-0
  [&_figure_*]:mb-0
  [&_blockquote_p]:mt-0
  [&_blockquote_p]:mb-2
  [&_blockquote_ul]:pl-4
  [&_blockquote_ul]:mt-2
  [&_blockquote_li]:mt-2
  [&_blockquote_blockquote]:mt-2
  [&_blockquote_blockquote]:mb-0
  [&_blockquote_blockquote]:bg-base-300/40
  [&_blockquote_blockquote]:pt-2
  [&_blockquote_blockquote]:pb-1
`
