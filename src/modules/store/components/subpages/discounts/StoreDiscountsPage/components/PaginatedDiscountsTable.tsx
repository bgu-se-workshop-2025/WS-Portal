import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { DiscountDataModel } from '../../DiscountTypes';
import { getLabelForTag, isCategoryScoped } from '../../util/discountUtils';
import { Button } from '@mui/material';
import { Delete } from '@mui/icons-material';

export type PaginatedDiscountTableProps = {
    rows: DiscountDataModel[];
    deleteDiscount: (id: string) => Promise<void>;
}

const PaginatedDiscountsTable = ({ rows, deleteDiscount }: PaginatedDiscountTableProps) => {

    const handleDeleteDiscount = async (id?: string) => {
        if (id) {
            await deleteDiscount(id);
        }
    };

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align='center' width={2}>
                            <Delete />
                        </TableCell>
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
                            <TableCell width={2}>
                                <Button onClick={() => handleDeleteDiscount(row.id)} size="small">
                                    <Delete />
                                </Button>
                            </TableCell>
                            <TableCell align="left">{row.title}</TableCell>
                            <TableCell align="left">{row.description}</TableCell>
                            <TableCell align="left">{row.discountPercentage}%</TableCell>
                            <TableCell align="left">{
                                isCategoryScoped(row)
                                    ? "Category"
                                    : row.scope ?
                                        row.scope.storeId
                                            ? "Store"
                                            : "Product"
                                        : ""
                            }
                            </TableCell>
                            <TableCell align="left">{getLabelForTag(row.type)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default PaginatedDiscountsTable;