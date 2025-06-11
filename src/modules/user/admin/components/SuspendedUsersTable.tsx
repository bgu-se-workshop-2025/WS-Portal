import { Button, ButtonGroup, CircularProgress, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import Resources from "../AdminPageResources.json";
import { useAdminResponse } from "../hooks/useAdmin";
import { useEffect, useState } from "react";
import { SuspensionTicketDto } from "../../../../shared/types/dtos";
import { Delete } from "@mui/icons-material";

const headers = Resources.SuspendedUsersTable.Headers;

export type SuspendedUsersTableProps = {
    useAdminResponse: useAdminResponse;
}

const SuspendedUsersTable = ({ useAdminResponse }: SuspendedUsersTableProps) => {
    const { loading, error, cancelSuspensionUser, getSuspensions } = useAdminResponse;
    const [suspensions, setSuspensions] = useState<SuspensionTicketDto[]>([]);
    const [page, setPage] = useState(0);

    useEffect(() => {
        getSuspensions(page, 25).then((value) => {
            setSuspensions(value);
        })
    }, [page]);

    const handleCancel = async (username: string) => {
        await cancelSuspensionUser(username);
    }

    const formatDate = (date: Date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    }


    return <Stack gap={Resources.Page.NormalFormGap}>
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        {headers.map(title =>
                            <TableCell key={title}>{title}</TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {!error && suspensions.length > 0 && suspensions.map((entry) =>
                        <TableRow>
                            <TableCell>
                                <Button
                                    disabled={entry.status !== "ACTIVE"}
                                    onClick={() => handleCancel(entry.username)}
                                >
                                    <Delete />
                                </Button>
                            </TableCell>
                            <TableCell>{entry.username}</TableCell>
                            <TableCell>{formatDate(entry.issued)}</TableCell>
                            <TableCell>{formatDate(entry.ends)}</TableCell>
                            <TableCell>{entry.status}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
        {loading && <CircularProgress />}
        {!loading && !error && suspensions.length === 0 &&
            <Typography variant="caption">{Resources.SuspendedUsersTable.NoSuspensions}</Typography>
        }
        {!loading && error &&
            <Typography color="error">{error}</Typography>
        }
        <Stack justifyContent="center" direction="row">
            <ButtonGroup>
                <Button
                    disabled={page <= 0 || loading}
                    onClick={() => setPage(page - 1)}
                >
                    {Resources.SuspendedUsersTable.PreviousPageButtonLabel}
                </Button>
                <Button disabled>{page}</Button>
                <Button
                    disabled={suspensions.length < 25 || loading}
                    onClick={() => setPage(page + 1)}
                >
                    {Resources.SuspendedUsersTable.NextPageButtonLabel}
                </Button>
            </ButtonGroup>
        </Stack>
    </Stack>
}

export default SuspendedUsersTable;