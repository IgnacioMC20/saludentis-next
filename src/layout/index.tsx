import React, { FC } from 'react'

import { Navbar } from '@/components'

interface Props {
    children: React.ReactNode
}

export const Layout: FC<Props> = ({ children }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            // height: '100%',
          }}>
            <nav>
                <Navbar />
            </nav>

            <main style={{
                 flex: 1,
                 display: 'flex',
                 flexDirection: 'column',
                 justifyContent: 'center',
                 alignItems: 'center',
                 padding: '0px 30px',
            }}>
                {children}
            </main>
        </div>
    )
}
