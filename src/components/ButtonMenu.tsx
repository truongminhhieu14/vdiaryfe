import { AlignJustify } from 'lucide-react'
import React, { useState } from 'react'
import SideBar from './SideBar'

const ButtonMenu = () => {
      const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  return (
    <>
      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <AlignJustify className='hover:text-darkColor hoverEffect md:hidden'/>
      </button>
      <div className='md:hidden'>
        <SideBar isOpen={isSidebarOpen} onClose={()=>setIsSidebarOpen(false)}/>
      </div>
    </>
  )
}

export default ButtonMenu