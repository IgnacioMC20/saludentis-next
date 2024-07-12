import { FC } from 'react'

interface Props {
    children: React.ReactNode

}

export const AuthLayout: FC<Props> = ({ children }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            // height: '100%',
        }}>
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
