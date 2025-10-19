
import { Fab } from '@mui/material'
import React from 'react'

interface Props {
    func: () => void
    icon: React.ReactNode
}

export const FloatingActionButton: React.FC<Props> = ({ func, icon }) => {

    return (

        <Fab color="primary" aria-label="edit" onClick={func} sx={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
        }}>
            {icon}
        </Fab>

    )
}
