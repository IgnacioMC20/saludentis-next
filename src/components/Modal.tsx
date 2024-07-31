import { Close } from '@mui/icons-material'
import { Modal as MuiModal, Box, IconButton } from '@mui/material'

type Props = {
    open: boolean
    handleClose: () => void
    children?: React.ReactNode
}

export const Modal = ({ open, handleClose, children }: Props) => {

    const handleBackdropClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation()
    }

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '90%', sm: '50%' },
        bgcolor: 'white',
        border: 'none',
        boxShadow: 24,
        p: 5,
        borderRadius: 5,
    }

    return (
        <MuiModal
            open={open}
            onClose={(_event, reason) => {
                if (reason !== 'backdropClick') {
                    handleClose()
                }
            }}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            slotProps={{
                backdrop: {
                    style: {
                        backdropFilter: 'blur(5px)',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    },
                },
            }}
        >
            <Box sx={style} onClick={handleBackdropClick}>
                <IconButton onClick={handleClose} size="medium" sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <Close />
                </IconButton>
                {children}
            </Box>
        </MuiModal>
    )
}