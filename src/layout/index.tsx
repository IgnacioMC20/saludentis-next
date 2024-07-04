import React, { FC } from 'react'

import { Navbar } from '@/components'

interface Props {
    children: React.ReactNode
}

export const Layout: FC<Props> = ({ children }) => {
    return (
        <>
            <nav>
                <Navbar />
            </nav>

            <main style={{
                margin: '80px auto',
                maxWidth: '1440px',
                padding: '0px 30px'
            }}>
                {children}
            </main>
        </>
    )
}
