import { Edit } from '@mui/icons-material'
import { Fab } from '@mui/material'
import React from 'react'

interface Props {
    func: () => void
}

export const FloatingActionButton: React.FC<Props> = ({ func }) => {

    return (

        <Fab color="primary" aria-label="edit" onClick={func} sx={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
        }}>
            <Edit color='info' />
        </Fab>

    )
}
