import Logo from '@/components/Logo'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import { UserButton } from '@clerk/nextjs'
import React, { ReactNode } from 'react'

function Layout({ children }: { children: ReactNode }) {
    return (
        <div className='flex flex-col min-h-screen bg-background max-h-screen'>
            <nav className='bg-slate-100 dark:bg-slate-900 flex justify-between items-center border-b border-border h-[60px] px-4 py-2'>
                <Logo />
                <div className='flex gap-4 items-center'>
                    <ThemeSwitcher/>
                    <UserButton afterSignOutUrl='/sign-in'/>
                </div>
            </nav>
            <main className='flex w-full flex-grow'>{children}</main>
        </div>
    )
}

export default Layout