import { Box, Grid, Skeleton } from '@mui/material'

function PatientInfoSkeleton() {
    return (
        <Box sx={{ flexGrow: 1, p: 0 }}>
            <Grid container spacing={2}>
                {/* Skeleton para Nombres */}
                <Grid item xs={12} sm={6}>
                    <Skeleton variant="text" width="100%" height={56} />
                </Grid>

                {/* Skeleton para Apellidos */}
                <Grid item xs={12} sm={6}>
                    <Skeleton variant="text" width="100%" height={56} />
                </Grid>

                {/* Skeleton para CUI/DPI */}
                <Grid item xs={12} sm={6}>
                    <Skeleton variant="text" width="100%" height={56} />
                </Grid>

                {/* Skeleton para Sexo */}
                <Grid item xs={12} sm={6}>
                    <Skeleton variant="text" width="100%" height={56} />
                </Grid>

                {/* Skeleton para Fecha de Nacimiento */}
                <Grid item xs={12} sm={6}>
                    <Skeleton variant="text" width="100%" height={56} />
                </Grid>

                {/* Skeleton para Edad */}
                <Grid item xs={12} sm={6}>
                    <Skeleton variant="text" width="100%" height={56} />
                </Grid>

                {/* Skeleton para Email */}
                <Grid item xs={12} sm={6}>
                    <Skeleton variant="text" width="100%" height={56} />
                </Grid>

                {/* Skeleton para Teléfono */}
                <Grid item xs={12} sm={6}>
                    <Skeleton variant="text" width="100%" height={56} />
                </Grid>

                {/* Skeleton para Dirección */}
                <Grid item xs={12}>
                    <Skeleton variant="text" width="100%" height={56} />
                </Grid>

                {/* Skeleton para Estado Civil */}
                <Grid item xs={12}>
                    <Skeleton variant="rectangular" width="100%" height={56} />
                </Grid>

                {/* Skeleton para Ocupación */}
                <Grid item xs={12} sm={6}>
                    <Skeleton variant="text" width="100%" height={56} />
                </Grid>

                {/* Skeleton para Nombre del Encargado */}
                <Grid item xs={12} sm={6}>
                    <Skeleton variant="text" width="100%" height={56} />
                </Grid>

                {/* Skeleton para Última visita */}
                <Grid item xs={12} sm={6}>
                    <Skeleton variant="text" width="100%" height={56} />
                </Grid>

                {/* Skeleton para Último Tratamiento */}
                <Grid item xs={12} sm={6}>
                    <Skeleton variant="text" width="100%" height={56} />
                </Grid>

                {/* Skeleton para Motivo de la Consulta */}
                <Grid item xs={12}>
                    <Skeleton variant="text" width="100%" height={56} />
                </Grid>

            </Grid>
        </Box>
    )
}

export default PatientInfoSkeleton
