import { WhatsApp } from '@mui/icons-material'
import {
    Paper,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Table as MaterialTable,
    IconButton,
    Link,
    Typography,
} from '@mui/material'
import NextLink from 'next/link'
import { ChangeEvent, useEffect, useState } from 'react'

import { Loading } from '../Loading'
import { theme } from '@/themes'
import { formatDateToDDMMYYYY, getFullName, getProperName } from '@/utils'

type DataIllnesses = {
    id: string
    nombre: string
    detalle: string
}

type DataTreatments = {
    id: string
    detalle: string
    precio: number
}

type DataPatients = {
    id: string
    nombreCompleto: string
    fechaNacimiento: string
    numeroTelefonico: string
    whatsapp?: boolean
    edad: string
}

type DataBalance = {
    id: string
    consulta: string
    fecha: string
    total: number
    pagado: number
}

type Props = {
    data: DataIllnesses[] | DataTreatments[] | DataPatients[] | DataBalance[]
    progress?: boolean
    customRowsPerPage?: number
}

export const Table = ({ data, progress = false, customRowsPerPage = 10 }: Props) => {
    if (!data.length) return null

    const rows = data.map((item) => {
        return {
            ...item
        }
    })
    const columns = Object.keys(data[0]).map(key => {
        return {
            id: key,
            label: key,
            minWidth: 170,
            align: 'center' as 'center',
            format: (value: number) => 'Q. ' + value.toLocaleString('en-US')
        }
    })
    const [page, setPage] = useState(0)
    const [loading, setLoading] = useState(progress)
    const [rowsPerPage, setRowsPerPage] = useState(customRowsPerPage)

    useEffect(() => {
        // if (progress) {
        setTimeout(() => {

            setLoading(false)
        }, 2000)
        // }
    }, [])

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value)
        setPage(0)
    }

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 'none' }}>
            {
                loading ? (
                    <Loading />
                ) :
                    (
                        <>

                            <TableContainer sx={{ maxHeight: 500 }}>
                                <MaterialTable stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            {columns.map((column) => {

                                                if (column.label === 'id') {
                                                    return (
                                                        <TableCell
                                                            key={column.id}
                                                            align={column.align}
                                                            style={{ minWidth: column.minWidth }}
                                                            sx={{ backgroundColor: theme.gray }}
                                                        >
                                                            <Typography
                                                                width={'100%'}
                                                                sx={{
                                                                    fontWeight: 700,
                                                                    textDecoration: 'none',
                                                                }}
                                                                textAlign={'center'}
                                                            >
                                                                #
                                                            </Typography>
                                                        </TableCell>
                                                    )
                                                }
                                                return (
                                                    <TableCell
                                                        key={column.id}
                                                        align={column.align}
                                                        style={{ minWidth: column.minWidth }}
                                                        sx={{ backgroundColor: theme.gray }}
                                                    >
                                                        {getFullName(column.label)}
                                                    </TableCell>
                                                )
                                            }
                                            )}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row) => {
                                                return (
                                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                                        {columns.map((column) => {
                                                            const value = (row as { [key: string]: any })[column.id]
                                                            const phone = (row as { [key: string]: any })['Numero de Telefono']
                                                            const rowIndex = rows.indexOf(row) + 1

                                                            if (!value) {
                                                                return (
                                                                    <TableCell key={column.id} align={column.align} />
                                                                )
                                                            }
                                                            // Render a link
                                                            if (column.id === 'id') {
                                                                return (
                                                                    <TableCell key={column.id} align={column.align}>
                                                                        <NextLink href={`/paciente/${value}`} passHref legacyBehavior>
                                                                            <Link display={'flex'} alignItems={'center'}>
                                                                                <Typography
                                                                                    width={'100%'}
                                                                                    sx={{
                                                                                        fontWeight: 700,
                                                                                        textDecoration: 'none',
                                                                                    }}
                                                                                    textAlign={'center'}
                                                                                    color={'black'}
                                                                                >
                                                                                    {rowIndex}
                                                                                </Typography>
                                                                            </Link>
                                                                        </NextLink>
                                                                    </TableCell>
                                                                )
                                                            }
                                                            if (typeof value === 'boolean') {
                                                                return (
                                                                    <TableCell key={column.id} align={column.align}>
                                                                        <NextLink href={`https://api.whatsapp.com/send?phone=502${phone}`} target='_blank'>
                                                                            <IconButton>
                                                                                <WhatsApp />
                                                                            </IconButton>
                                                                        </NextLink>
                                                                    </TableCell>
                                                                )
                                                            }
                                                            return (
                                                                <TableCell key={column.id} align={column.align}>
                                                                    {
                                                                        column.format(value) && typeof value === 'number'
                                                                            ? column.format(value)
                                                                            : (column.id === 'Fecha de Nacimiento' ? formatDateToDDMMYYYY(value) : getProperName(value))
                                                                    }
                                                                </TableCell>
                                                            )
                                                        })}
                                                    </TableRow>
                                                )
                                            })}
                                    </TableBody>
                                </MaterialTable>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[customRowsPerPage, 25, 100]}
                                component="div"
                                count={rows.length}
                                rowsPerPage={customRowsPerPage ? customRowsPerPage : rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </>
                    )
            }
        </Paper>
    )
}