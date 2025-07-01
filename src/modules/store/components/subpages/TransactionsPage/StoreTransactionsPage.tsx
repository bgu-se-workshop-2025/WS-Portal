import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Typography,
  List,
  ListItem,
  Divider,
  TablePagination,
  Button,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useParams } from "react-router-dom";

import { sdk } from "../../../../../sdk/sdk";
import { StoreOrderDto, StoreSnapshotDto, ProductSnapshotDto } from "../../../../../shared/types/dtos";

const DEFAULT_SIZE = 10;

// Helper functions
const calculateProductTotal = (p: ProductSnapshotDto) => p.price * p.quantity;
const hasProductDiscount = (p: ProductSnapshotDto) => p.discountPrice < calculateProductTotal(p);
const calculateDiscountedSum = (products: ProductSnapshotDto[]) =>
  products.reduce((sum, p) => sum + p.discountPrice, 0);
const calculateOriginalSum = (products: ProductSnapshotDto[]) =>
  products.reduce((sum, p) => sum + p.price * p.quantity, 0);

const StoreTransactionsPage: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const [orders, setOrders] = useState<StoreOrderDto[]>([]);
  const [snapshots, setSnapshots] = useState<Record<string, StoreSnapshotDto>>({});
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
      const snapshotMap: Record<string, StoreSnapshotDto> = {};
      await Promise.all(
        result.map(async (tx) => {
          const snap = await sdk.getStoreSnapshotById(tx.storeSnapshot);
          snapshotMap[tx.id] = snap;
        })
      );
      setSnapshots(snapshotMap);
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

  const displayed = orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
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
        {displayed.map((tx) => {
          const snapshot = snapshots[tx.id];
          if (!snapshot) return null;

          const products = snapshot.products || [];
          const totalOriginal = calculateOriginalSum(products);
          const totalAfterProductDiscounts = calculateDiscountedSum(products);
          const productDiscount = totalOriginal - totalAfterProductDiscounts;
          const storeDiscountOnly = snapshot.discount - productDiscount;
          const finalTotal = totalOriginal - snapshot.discount;

          return (
            <ListItem
              key={tx.id}
              sx={{
                flexDirection: "column",
                alignItems: "flex-start",
                mb: 3,
                border: "1px solid #f1f5f9",
                borderRadius: 3,
                backgroundColor: "#fff",
                p: 2,
                "&:hover": {
                  borderColor: "#3b82f6",
                  backgroundColor: "#f6f8fa",
                },
              }}
            >
              <Box width="100%" display="flex" justifyContent="space-between" mb={1}>
                <Typography fontWeight={600} fontSize={16} color="#58a6ff">
                  Order <span style={{ color: "#6366f1" }}>#{tx.id.slice(0, 8)}…</span>
                </Typography>
                <Typography fontSize={13} color="text.secondary">
                  {new Date(tx.time).toLocaleString("he-IL", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </Typography>
              </Box>

              <Divider sx={{ mb: 2, width: "100%", bgcolor: "#e0e7ef" }} />

              <Typography fontWeight={600} mb={1} color="#58a6ff">
                🏬 Store:{" "}
                <Button
                  variant="text"
                  size="small"
                  sx={{ textTransform: "none", fontWeight: 600, color: "#58a6ff" }}
                  onClick={() => window.location.href = `/store/${snapshot.storeId}`}
                >
                  {snapshot.name}
                </Button>
              </Typography>

              {products.map((p) => (
                <Box key={p.productId} mb={1} pl={1}>
                  <Typography>
                    <strong>{p.name}</strong> × {p.quantity} @ {p.price.toFixed(2)}₪ each
                  </Typography>
                  {hasProductDiscount(p) ? (
                    <Typography fontSize={14} sx={{ color: "#388e3c", fontWeight: 600 }}>
                      <span style={{ textDecoration: "line-through", color: "#888" }}>
                        {calculateProductTotal(p).toFixed(2)}₪
                      </span>
                      &nbsp;→&nbsp;
                      {p.discountPrice.toFixed(2)}₪
                    </Typography>
                  ) : (
                    <Typography fontSize={14}>Total: {p.discountPrice.toFixed(2)}₪</Typography>
                  )}
                </Box>
              ))}

              <Divider sx={{ my: 1, width: "100%", bgcolor: "#e0e7ef" }} />

              <Typography fontSize={14} sx={{ mt: 1 }}>
                Original total: <strong>{totalOriginal.toFixed(2)}₪</strong>
              </Typography>
              {productDiscount > 0 && (
                <Typography fontSize={14}>
                  Product discounts: <span style={{ color: "#f57c00", fontWeight: 500 }}>−{productDiscount.toFixed(2)}₪</span>
                </Typography>
              )}
              {storeDiscountOnly > 0 && (
                <Typography fontSize={14}>
                  Store discount: <span style={{ color: "#e53935", fontWeight: 500 }}>−{storeDiscountOnly.toFixed(2)}₪</span>
                </Typography>
              )}
              <Typography fontSize={16} fontWeight={700} sx={{ mt: 1 }} color="#1976d2">
                Final total: {finalTotal.toFixed(2)}₪
              </Typography>
            </ListItem>
          );
        })}
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
