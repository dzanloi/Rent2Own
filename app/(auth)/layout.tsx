import React, { ReactNode } from 'react'
import { Toaster } from "@/components/ui/sonner"

const layout = ({ children } : {children:ReactNode}) => {
  return (
    <div className=''>
      {children}
      <Toaster />
    </div>
  )
}

export default layout
