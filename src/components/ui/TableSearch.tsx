import { SearchOutlined } from '@mui/icons-material'
import { InputAdornment, TextField } from '@mui/material'
import { Dispatch, SetStateAction } from 'react'

type Props = {
    value: string
    onChange: Dispatch<SetStateAction<string>>
    placeholder?: string
}

export const TableSearch = ({
    value,
    onChange,
    placeholder = 'Buscar por cualquier campo'
}: Props) => {
    return (
        <TextField
            fullWidth
            size="small"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchOutlined />
                    </InputAdornment>
                ),
            }}
            sx={{ mb: 2 }}
        />
    )
}
