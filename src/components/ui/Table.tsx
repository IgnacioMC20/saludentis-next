import { EditOutlined } from '@mui/icons-material'
import {
    Box,
    Paper,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Table as MaterialTable,
    Typography,
    Button,
    Link,
} from '@mui/material'
// import { useRouter } from 'next/router'
import { ChangeEvent, useEffect, useMemo, useState } from 'react'

import { TableSearch } from './TableSearch'
import { theme } from '@/themes'
import { getFullName } from '@/utils'

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

type DataBalance = {
    id: string
    consulta: string
    fecha: string
    total: number
    pagado: number
}

type Props = {
    data: DataIllnesses[] | DataTreatments[] | DataBalance[]
    progress?: boolean
    customRowsPerPage?: number

    // eslint-disable-next-line no-unused-vars
    fetchFunc?: (id: string) => void
    // eslint-disable-next-line no-unused-vars
    onRowClick?: (id: string) => void
}

// eslint-disable-next-line no-unused-vars
export const Table = ({ data, progress = false, customRowsPerPage = 10, fetchFunc, onRowClick }: Props) => {
    if (!data?.length) return null

    // const router = useRouter()
    // get the last param from the url
    // const url = router.asPath.split('/').pop()

    const [searchTerm, setSearchTerm] = useState('')
    const rows = useMemo(() => data.map((item) => ({
        ...item
    })), [data])
    const columns = useMemo(() => Object.keys(data[0]).map(key => {
        return {
            id: key,
            label: key,
            minWidth: 170,
            align: 'center' as 'center',
            format: (value: number) => 'Q. ' + value.toLocaleString('en-US')
        }
    }), [data])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(customRowsPerPage)
    const filteredRows = useMemo(() => {
        const normalizedQuery = searchTerm.trim().toLowerCase()

        if (!normalizedQuery) return rows

        return rows.filter((row) =>
            Object.entries(row).some(([key, value]) => {
                if (key === 'id' || key === 'Editar' || value == null) {
                    return false
                }

                return String(value).toLowerCase().includes(normalizedQuery)
            })
        )
    }, [rows, searchTerm])

    useEffect(() => {
        setPage(0)
    }, [searchTerm])

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
                (
                    <>
                        <Box>
                            <TableSearch
                                value={searchTerm}
                                onChange={setSearchTerm}
                                placeholder="Buscar tratamientos o enfermedades"
                            />
                        </Box>

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
                                    {filteredRows
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row) => {
                                            return (
                                                <TableRow
                                                    hover
                                                    role="checkbox"
                                                    tabIndex={-1}
                                                    key={row.id}
                                                    onClick={() => onRowClick?.(row.id)}
                                                    sx={{
                                                        cursor: onRowClick ? 'pointer' : 'default',
                                                        '&:hover': onRowClick ? {
                                                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                                        } : {}
                                                    }}
                                                >
                                                    {columns.map((column) => {
                                                        const value = (row as { [key: string]: any })[column.id]
                                                        const rowIndex = filteredRows.indexOf(row) + 1

                                                        if (!value) {
                                                            return (
                                                                <TableCell key={column.id} align={column.align} />
                                                            )
                                                        }
                                                        if (column.id === 'Editar') {
                                                            return (
                                                                <TableCell key={column.id} align={column.align}>
                                                                    <Button onClick={() => fetchFunc?.(value)} variant='contained' color='info' sx={{
                                                                        ':hover': {
                                                                            backgroundColor: theme.gray,
                                                                            color: theme.white,
                                                                            transition: 'all 0.3s ease-in-out',
                                                                        }
                                                                    }}>
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
                                                                                <EditOutlined />
                                                                            </Typography>
                                                                        </Link>
                                                                    </Button>
                                                                </TableCell>
                                                            )
                                                        }
                                                        if (column.id === 'id') {
                                                            return (
                                                                <TableCell key={column.id} align={column.align}>
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
                                                                </TableCell>
                                                            )
                                                        }
                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                {
                                                                    column.format(value) && typeof value === 'number'
                                                                        ? column.format(value)
                                                                        : getFullName(value)
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
                            rowsPerPageOptions={[]}
                            component="div"
                            count={filteredRows.length}
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
