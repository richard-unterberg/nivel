import cm, { cmMerge } from '@classmatejs/react'
import type { ComponentPropsWithoutRef } from 'react'

export interface TableData {
  headers: string[]
  rows: string[][]
}

export interface TableProps {
  size?: 'sm' | 'md' | 'lg'
  data: TableData
}
/** @deprecated - do not use pls */
export const Table = ({ size = 'md', data }: TableProps) => {
  return (
    <TableScrollContainer>
      <StyledTable $size={size}>
        <thead className="overflow-hidden rounded-t-box bg-base-200">
          <tr>
            {data.headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </TableScrollContainer>
  )
}

export const MdxTable = ({ className, ...props }: ComponentPropsWithoutRef<'table'>) => {
  return (
    <TableScrollContainer>
      <table
        className={cmMerge(
          `
            table
            w-full
            min-w-[48rem]
            text-sm
            [&_code]:whitespace-nowrap
            [&_td]:align-top
            [&_td]:bg-base-200
            [&_td]:p-3
            [&_td]:[overflow-wrap:normal]
            [&_td]:[word-break:normal]
            [&_th]:align-top
            [&_th]:bg-base-muted-superlight
            [&_th]:font-semibold
            [&_th]:p-3
            [&_th]:[overflow-wrap:normal]
            [&_th]:[word-break:normal]
            [&_thead]:border-base-muted-light
            [&_tr]:border-base-muted-light
          `,
          className,
        )}
        {...props}
      />
    </TableScrollContainer>
  )
}

const TableScrollContainer = cm.div`
  not-prose 
  my-8 
  max-w-full overflow-x-auto 
  rounded-box shadow
`

const StyledTable = cm.table.variants<{ $size: TableProps['size'] }>({
  base: `
    table
    w-full
    min-w-[44rem]
    table-zebra
    [&_td]:[overflow-wrap:normal]
    [&_td]:[word-break:normal]
    [&_th]:[overflow-wrap:normal]
    [&_th]:[word-break:normal]
  `,
  variants: {
    $size: {
      sm: 'table-sm',
      md: 'table-md',
      lg: 'table-lg',
    },
  },
  defaultVariants: {
    $size: 'md',
  },
})
