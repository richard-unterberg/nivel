import React from 'react'
import batiLogo from './bati-logo.svg'

const batiLogoSize = 16

const BatiNote = () => {
  return (
    <div className='text-vike-grey-300 text-right'>
      Powered by{' '}
      <a href="https://github.com/vikejs/bati" className="inline-flex gap-2 items-center">
        Bati{' '}
        <img
          src={batiLogo}
          style={{
            width: batiLogoSize,
            height: batiLogoSize,
            display: 'inline-block',
            verticalAlign: 'text-top',
          }}
        />
      </a>
    </div>
  )
}

export default BatiNote
