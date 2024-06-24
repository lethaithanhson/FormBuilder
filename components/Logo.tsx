import Link from 'next/link'
import React from 'react'

function Logo() {
  return (
   <Link href={'/'} className='font-extrabold text-[28px] bg-gradient-to-r from-red-500 to-amber-500 text-transparent 
   bg-clip-text'>PageForm</Link>
  )
}

export default Logo