import Image from 'next/image'
import React from 'react'
import { Button } from '../../components/ui/button'

function Header() {
  return (
    <header className='p-4 flex items-center justify-between'>
      <div className='flex items-center gap-2'>
      <Image alt='logo' src={'./logo.svg'} width={30} height={30}/>
      <h2 className='text-2xl font-bold'>Video Gen</h2>
      </div>

      <div>
         <Button>Get Started</Button>
      </div>
    </header>
  )
}

export default Header