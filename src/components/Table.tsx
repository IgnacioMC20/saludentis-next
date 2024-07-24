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
} from '@mui/material'
import NextLink from 'next/link'
import { ChangeEvent, useEffect, useState } from 'react'

import { Loading } from './Loading'
import { theme } from '@/themes'
import { getProperName } from '@/utils'

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

type Props = {
    data: DataIllnesses[] | DataTreatments[] | DataPatients[]
    progress?: boolean
}

export const Table = ({ data, progress = false }: Props) => {

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
    const [rowsPerPage, setRowsPerPage] = useState(10)

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
        <Paper sx={{ width: '100%', minHeight: '500px', overflow: 'hidden', boxShadow: 'none' }}>
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
                                                            #
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
                                                        {getProperName(column.label)}
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

                                                            if (!value) {
                                                                return (
                                                                    <TableCell key={column.id} align={column.align} />
                                                                )
                                                            }
                                                            if (typeof value === 'boolean') {
                                                                return (
                                                                    <TableCell key={column.id} align={column.align}>
                                                                        <NextLink href={'https://api.whatsapp.com/send?phone=502'} target='_blank'>
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
                                                                            : getProperName(value)
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
                                rowsPerPageOptions={[10, 25, 100]}
                                component="div"
                                count={rows.length}
                                rowsPerPage={rowsPerPage}
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