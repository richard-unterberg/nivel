import cm from '@classmatejs/react'

interface TableData {
  headers: string[]
  rows: string[][]
}

interface TableProps {
  size?: 'sm' | 'md' | 'lg'
  data: TableData
}

export const Table = ({ size = 'md', data }: TableProps) => {
  return (
    <StyledTable $size={size}>
      <thead className="bg-base-200 rounded-t-box overflow-hidden">
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
