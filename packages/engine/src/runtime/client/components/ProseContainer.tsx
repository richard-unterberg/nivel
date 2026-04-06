import cm from '@classmatejs/react'

// https://github.com/tailwindlabs/tailwindcss-typography
export const ProseContainer = cm.section`
  prose 
  prose-neutral
  max-w-none
  dark:prose-invert
  prose-a:text-primary

  prose-pre:bg-base-200!

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

  prose-table:bg-base-200
  prose-table:rounded-box
  prose-thead:rounded-t-box
  prose-table:shadow
  prose-thead:overflow-hidden
  prose-thead:border-base-muted-light
  prose-tr:border-base-muted-light

  [&_table_code]:whitespace-nowrap

  prose-td:p-3
  prose-th:p-3

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
  [&_blockquote_ul]:mb-0

  [&_blockquote_ul]:pl-4
  [&_blockquote_ul]:mt-2
  [&_blockquote_li]:mt-2
  [&_blockquote_blockquote]:mt-2
  [&_blockquote_blockquote]:mb-0
  [&_blockquote_blockquote]:bg-base-300/40
  [&_blockquote_blockquote]:pt-2
  [&_blockquote_blockquote]:pb-1
`
