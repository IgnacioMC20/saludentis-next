import { render, screen } from '@testing-library/react'

import { Loading } from '@/components'

describe('Loading component', () => {
    it('renders the loading spinner correctly', () => {
        render(<Loading />)

        // Verifica que el Box está presente
        const box = screen.getByTestId('loading-box')
        expect(box).toBeInTheDocument()
        expect(box).toHaveStyle({
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100vh',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 1300,
        })

        // Verifica que el CircularProgress está presente
        const spinner = screen.getByRole('progressbar')
        expect(spinner).toBeInTheDocument()
    })
})
