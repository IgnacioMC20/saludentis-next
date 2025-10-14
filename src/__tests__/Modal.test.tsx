import { render, screen, fireEvent } from '@testing-library/react'

import { Modal } from '@/components'

describe('Modal Component', () => {
    const handleClose = jest.fn()

    const renderModal = (open: boolean, children?: React.ReactNode) => {
        return render(
            <Modal open={open} handleClose={handleClose}>
                {children}
            </Modal>
        )
    }

    it('renders the modal content when open', () => {
        renderModal(true, <div>Modal Content</div>)
        expect(screen.getByText('Modal Content')).toBeInTheDocument()
    })

    it('does not render the modal content when closed', () => {
        renderModal(false, <div>Modal Content</div>)
        expect(screen.queryByText('Modal Content')).not.toBeInTheDocument()
    })

    it('calls handleClose when the close button is clicked', () => {
        renderModal(true)
        const closeButton = screen.getByRole('button')
        fireEvent.click(closeButton)
        expect(handleClose).toHaveBeenCalledTimes(1)
    })

    it('displays the children correctly', () => {
        renderModal(true, <div>Some content</div>)
        expect(screen.getByText('Some content')).toBeInTheDocument()
    })
})
