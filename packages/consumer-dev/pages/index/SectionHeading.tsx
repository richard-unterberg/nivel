import ma from '@marmo/react'

const StyledSectionHeading = ma.h2`
  border-t-1 border-primary-muted-light pt-16 px-12 mt-16
  w-fit mx-auto
  font-semibold text-center mb-16
`

const SectionHeading = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="prose-container prose-h2:xl:text-5xl">
      <StyledSectionHeading>{children}</StyledSectionHeading>
    </div>
  )
}

export default SectionHeading
