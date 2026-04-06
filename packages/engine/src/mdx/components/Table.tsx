import cm from '@classmatejs/react'

export interface TableData {
  headers: string[]
  rows: string[][]
}

export interface TableProps {
  size?: 'sm' | 'md' | 'lg'
  data: TableData
}

export const Table = ({ size = 'md', data }: TableProps) => {
  return (
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
  )
}

const StyledTable = cm.table.variants<{ $size: TableProps['size'] }>({
  base: `
    not-prose
    table
    w-full
    table-zebra
    mb-6
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
