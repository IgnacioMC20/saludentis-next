import { Box, Grid, TextField, Typography, Button } from '@mui/material'

import ClinicHistory from '@/components/PacientComponents/ClinicHistory'
import PacientInfo from '@/components/PacientComponents/PacientInfo'
import SearchAppBar from '@/components/PacientComponents/SearchBar'
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
      '-ms-overflow-style': 'none', // for Internet Explorer and Edge
      'scrollbar-width': 'none', // for Firefox
    }}>
        <SearchAppBar />
        <PacientInfo/>
        {/* <ClinicHistory/> */}
      </Box>
    </Layout>

  )
}