import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { DiscountDataModel } from '../../DiscountTypes';

export type PaginatedDiscountTableProps = {
    rowsPerPage: number;
    rows: DiscountDataModel[];
}

const PaginatedDiscountsTable = ({ rowsPerPage, rows }: PaginatedDiscountTableProps) => {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align="left">Title</TableCell>
                        <TableCell align="left">Description</TableCell>
                        <TableCell align="left">Percentage</TableCell>
                        <TableCell align="left">Scope</TableCell>
                        <TableCell align="left">Type</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell align="left">{row.title}</TableCell>
                            <TableCell align="left">{row.description}</TableCell>
                            <TableCell align="left">{row.discountPercentage}%</TableCell>
                            <TableCell align="left">{row.scope}</TableCell>
                            <TableCell align="left">{row.type}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default PaginatedDiscountsTable;