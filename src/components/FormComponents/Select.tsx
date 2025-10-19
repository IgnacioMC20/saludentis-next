import { Autocomplete, TextField, FormControl } from '@mui/material'
import React, { useState } from 'react'

import { IPatient } from '@/interfaces'
import { getFullName } from '@/utils'

interface Props {
  patients: IPatient[]
  // eslint-disable-next-line no-unused-vars
  setPatientId: (id: string) => void
}

export const Select: React.FC<Props> = ({ patients = [], setPatientId }) => {
  const patientsFormatted = patients.map((patient) => ({ _id: patient._id, fullName: getFullName(patient.firstName, patient.middleName, patient.lastName) }))
  const [selectedPatient, setSelectedPatient] = useState(null)

  const handleChange = (event: any, value: any) => {
    setSelectedPatient(value)

    setPatientId(value?._id?.toString() ?? null)
  }

  return (
    <FormControl sx={{ width: '100%' }}>
      <Autocomplete
        options={patientsFormatted}
        getOptionLabel={(option) => option.fullName}
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
        isOptionEqualToValue={(option, value) => option._id === value._id}
      />
    </FormControl>
  )
}
