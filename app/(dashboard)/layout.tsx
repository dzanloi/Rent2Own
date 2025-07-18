import React, { ReactNode } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from '@/components/AppSidebar'
import AdminNav from '@/components/AdminNav'


const layout = ({ children } : { children: ReactNode }) => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className='w-full bg-white'>
                <AdminNav />
                <SidebarTrigger />
                {children}
            </main>
        </SidebarProvider>
    )
}

export default layout
