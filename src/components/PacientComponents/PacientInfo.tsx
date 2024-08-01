import { Box, Grid, TextField, Typography, Button } from '@mui/material'

export default function PacientInfo() {
  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Datos personales
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre"
                defaultValue="Gelia Rocío Canesa Peralta"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Fecha de Nacimiento"
                defaultValue="1970-07-20"
                variant="outlined"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="CUI" variant="outlined" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Edad"
                defaultValue="53 años"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Teléfono"
                defaultValue="57787240"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dirección"
                defaultValue="Casa 13 las Jacarandas camino a San Bartolomé Becerra"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Sexo"
                defaultValue="Femenino"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Estado Civil"
                defaultValue="Casado"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Ocupación"
                defaultValue="Terapeuta Energética"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Última visita"
                defaultValue="2024-02-02"
                variant="outlined"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Fecha"
                defaultValue="2024-06-26"
                variant="outlined"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Motivo de la consulta"
                defaultValue="Se me quebró una muela."
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Último tratamiento"
                defaultValue="Relleno dental"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Email" variant="outlined" />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary">
                Actualizar Datos
              </Button>
            </Grid>
          </Grid>
        </Box>
  )
}
