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
import { ChangeEvent, useEffect, useState, useMemo } from 'react'

import { Loading } from '../ui/Loading'
import { theme } from '@/themes'
import { formatDateToDDMMYYYY, getFullName, getProperName } from '@/utils'

// Type definitions for different data types the table can display
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

// Union type for all possible data types
type TableData = DataIllnesses | DataTreatments | DataPatients | DataBalance

// Column definition type
type TableColumn = {
    id: string
    label: string
    minWidth: number
    align: 'center'
    // eslint-disable-next-line no-unused-vars
    format: (value: number) => string
}

type Props = {
    data: TableData[]
    progress?: boolean
    customRowsPerPage?: number
    // eslint-disable-next-line no-unused-vars
    handleOpenConsultationModal?: ((id: string) => void) | null
}

export const Table = ({
    data,
    progress = false,
    customRowsPerPage = 10,
    handleOpenConsultationModal = null
}: Props) => {
    // Early return if no data
    if (!data.length) return null

    // State management
    const [page, setPage] = useState(0)
    const [loading, setLoading] = useState(progress)
    const [rowsPerPage, setRowsPerPage] = useState(customRowsPerPage)

    // Memoize data transformations to avoid unnecessary recalculations
    const rows = useMemo(() => data.map(item => ({ ...item })), [data])

    const columns = useMemo(() =>
        Object.keys(data[0]).map(key => ({
            id: key,
            label: key,
            minWidth: 170,
            align: 'center' as 'center',
            format: (value: number) => 'Q. ' + value.toLocaleString('en-US')
        })),
        [data])

    // Set loading state with timeout
    useEffect(() => {
        if (progress) {
            const timer = setTimeout(() => {
                setLoading(false)
            }, 2000)
            return () => clearTimeout(timer)
        }
    }, [progress])

    // Pagination handlers
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value)
        setPage(0)
    }

    // Helper function to render header cells
    const renderHeaderCell = (column: TableColumn) => {
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

    // Helper function to render cell content based on column type
    const renderCellContent = (
        column: TableColumn,
        row: any,
        rowIndex: number,
        phone?: string
    ) => {
        const value = row[column.id]

        // Return empty cell if no value
        if (!value) {
            return <TableCell key={column.id} align={column.align} />
        }

        // Special handling for ID column
        if (column.id === 'id') {
            // If we have a consultation modal handler, use it
            if (handleOpenConsultationModal) {
                return (
                    <TableCell key={column.id} align={column.align}>
                        <Link
                            display={'flex'}
                            alignItems={'center'}
                            onClick={() => handleOpenConsultationModal(value)}
                        >
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
                    </TableCell>
                )
            }

            // Otherwise, link to patient page
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

        // Special handling for boolean values (WhatsApp)
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

        // Default cell rendering with formatting
        return (
            <TableCell key={column.id} align={column.align}>
                {
                    column.format(value) && typeof value === 'number'
                        ? column.format(value)
                        : (column.id === 'Fecha de Nacimiento'
                            ? formatDateToDDMMYYYY(value)
                            : getProperName(value))
                }
            </TableCell>
        )
    }

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 'none' }}>
            {loading ? (
                <Loading />
            ) : (
                <>
                    <TableContainer sx={{ maxHeight: 500 }}>
                        <MaterialTable stickyHeader aria-label="sticky table">
                            {/* Table Header */}
                            <TableHead>
                                <TableRow>
                                    {columns.map(renderHeaderCell)}
                                </TableRow>
                            </TableHead>

                            {/* Table Body */}
                            <TableBody>
                                {rows
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => {
                                        const rowIndex = rows.indexOf(row) + 1
                                        const phone = (row as any)['Numero de Telefono']

                                        return (
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                tabIndex={-1}
                                                key={row.id}
                                                onClick={() => handleOpenConsultationModal?.(row.id)}
                                                sx={{
                                                    cursor: handleOpenConsultationModal ? 'pointer' : 'default',
                                                    '&:hover': handleOpenConsultationModal ? {
                                                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                                    } : {}
                                                }}
                                            >
                                                {columns.map(column =>
                                                    renderCellContent(column, row, rowIndex, phone)
                                                )}
                                            </TableRow>
                                        )
                                    })
                                }
                            </TableBody>
                        </MaterialTable>
                    </TableContainer>

                    {/* Pagination */}
                    <TablePagination
                        rowsPerPageOptions={[customRowsPerPage, 25, 100]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Filas por página:"
                        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`}
                    />
                </>
            )}
        </Paper>
    )
}
