import { Autocomplete, TextField, FormControl } from '@mui/material'
import React, { useState } from 'react'

import { Patient } from '@/interfaces'

interface Props {
  patients: Patient[]
}

export const Select: React.FC<Props> = ({ patients }) => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  const handleChange = (event: any, value: Patient | null) => {
    setSelectedPatient(value)
  }

  return (
    <FormControl sx={{ width: '100%' }}>
      <Autocomplete
        options={patients}
        getOptionLabel={(option) => option.name}
        value={selectedPatient}
        onChange={handleChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Nombre"
            variant="outlined"
            fullWidth
          />
        )}
        isOptionEqualToValue={(option, value) => option.id === value.id}
      />
    </FormControl>
  )
}
