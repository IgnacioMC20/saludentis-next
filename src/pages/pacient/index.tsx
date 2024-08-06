import { Box } from '@mui/material'

import ClinicHistory from '@/components/PatientComponents/ClinicHistory'
import PacientInfo from '@/components/PatientComponents/PacientInfo'
import SearchAppBar from '@/components/PatientComponents/SearchBar'
import { Layout } from '@/layout'

export default function PacientPage() {
  return (
    <Layout>
      <Box sx={{
        padding: 0,
        width: {
          xs: '100%',
          sm: '90%',
        },
        backgroundColor: 'white',
        height: '600px',
        overflow: 'scroll',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        '-ms-overflow-style': 'none',
        'scrollbar-width': 'none',
      }}>
        <SearchAppBar />
        <PacientInfo />
        <ClinicHistory />
      </Box>
    </Layout>

  )
}