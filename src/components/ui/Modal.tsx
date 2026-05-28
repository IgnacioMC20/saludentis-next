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
        width: { xs: 'calc(100% - 32px)', sm: 'min(720px, calc(100% - 48px))' },
        maxHeight: 'calc(100dvh - 32px)',
        bgcolor: 'white',
        border: 'none',
        p: 0,
        borderRadius: 5,
        overflow: 'hidden',
        boxShadow: '0 24px 80px rgba(15, 23, 42, 0.24)',
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
                <IconButton
                    onClick={handleClose}
                    size="medium"
                    sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        zIndex: 2,
                        bgcolor: 'rgba(255, 255, 255, 0.86)',
                        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)',
                        '&:hover': {
                            bgcolor: 'white',
                        },
                    }}
                >
                    <Close />
                </IconButton>
                <Box
                    data-testid="modal-scroll-container"
                    sx={{
                        maxHeight: 'calc(100dvh - 32px)',
                        overflowY: 'auto',
                        px: { xs: 2.5, sm: 5 },
                        py: { xs: 3, sm: 5 },
                        scrollbarGutter: 'stable',
                    }}
                    style={{
                        maxHeight: 'calc(100dvh - 32px)',
                        overflowY: 'auto',
                    }}
                >
                    {children}
                </Box>
            </Box>
        </MuiModal>
    )
}
