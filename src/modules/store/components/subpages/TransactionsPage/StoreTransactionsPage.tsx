import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Typography,
  List,
  TablePagination,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useParams } from "react-router-dom";

import { sdk } from "../../../../../sdk/sdk";
import { StoreOrderDto } from "../../../../../shared/types/dtos";
import TransactionCard from "./TransactionCard";

const DEFAULT_SIZE = 10;

const StoreTransactionsPage: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();

  const [orders, setOrders] = useState<StoreOrderDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_SIZE);

  const load = useCallback(async () => {
    if (!storeId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await sdk.getStoreOrders(storeId, { page: 0, size: 100 });
      setOrders(result);
    } catch (err: any) {
      setError("Error fetching store orders: " + (err.message ?? "Unknown"));
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const displayed = orders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (!storeId) return <Alert severity="warning">No store selected.</Alert>;
  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  if (orders.length === 0)
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        No transactions found.
      </Alert>
    );

 
  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, color: "#58a6ff" }}>
          Store Transactions
        </Typography>
        <Tooltip title="Refresh">
          <IconButton onClick={load}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <List sx={{ width: "100%", p: 0, maxWidth: 900, mx: "auto" }}>
        {displayed.map((tx) => (
          <TransactionCard key={tx.id} transaction={tx} />
        ))}
      </List>

      <TablePagination
        component="div"
        count={orders.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default StoreTransactionsPage;
