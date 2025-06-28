import React, { useEffect, useState } from "react";
import {
  Card, CardContent, Typography, Stack, Divider, Box
} from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StoreIcon from "@mui/icons-material/Store";
import { StoreOrderDto, StoreSnapshotDto, ProductSnapshotDto } from "../../../../../shared/types/dtos";
import { sdk } from "../../../../../sdk/sdk";

interface Props {
  transaction: StoreOrderDto;
}

const TransactionCard: React.FC<Props> = ({ transaction }) => {
  const { id, time, storeSnapshot: snapshotId } = transaction;

  const [snapshot, setSnapshot] = useState<StoreSnapshotDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    sdk.getStoreSnapshotById(snapshotId)
      .then(setSnapshot)
      .catch(() => setError("Failed to load store snapshot."));
  }, [snapshotId]);

  const formatCurrency = (amount: number) => `₪${amount.toFixed(2)}`;
  const formatTime = (timestamp: string) =>
    new Date(timestamp).toLocaleString("he-IL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });

  return (
    <Card variant="outlined" sx={{ mb: 3, borderColor: "#d0d7de", background: "#fbfcfd" }}>
      <CardContent>
        {/* Header */}
        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
          <ReceiptLongIcon fontSize="small" />
          <Typography variant="subtitle2" sx={{ color: "#1d3557" }}>
            Transaction ID:
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: "monospace", color: "#3b3b3b" }}>
            {id.slice(0, 8)}…
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
          <AccessTimeIcon fontSize="small" />
          <Typography variant="subtitle2" sx={{ color: "#1d3557" }}>
            Date:
          </Typography>
          <Typography variant="body2" sx={{ color: "#3b3b3b" }}>
            {formatTime(time)}
          </Typography>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {snapshot ? (
          <>
            {/* Store Name */}
            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <StoreIcon fontSize="small" />
              <Typography variant="subtitle2" sx={{ color: "#1d3557" }}>
                Store:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {snapshot.name}
              </Typography>
            </Stack>

            {/* Product List */}
            {snapshot.products.map((product: ProductSnapshotDto) => {
              const original = product.price * product.quantity;
              const discounted = product.discountPrice;
              const isDiscounted = discounted < original;

              return (
                <Box key={product.productId} mb={2} pl={1}>
                  <Typography sx={{ fontWeight: 600, color: "#2d3142" }}>
                    {product.name} × {product.quantity}{" "}
                    <span style={{ color: "#444" }}>@ {formatCurrency(product.price)} each</span>
                  </Typography>

                  {isDiscounted ? (
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#2196f3", 
                        fontWeight: "bold",
                        fontSize: "1.05rem",
                        mt: 0.5,
                      }}
                    > 
                    <strong>Total:</strong>&nbsp;
                      <span style={{ textDecoration: "line-through", color: "#e57373", fontSize: "1.05rem" }}>
                        {formatCurrency(original)}
                      </span>
                        &nbsp;
                         <span style={{
                            fontSize: "1.3rem",
                            fontWeight: "bold",
                            color: "#388e3c",            // light green
                            verticalAlign: "middle"
                          }}>
                            →
                          </span>
                        &nbsp;                      <span style={{ color: "#2196f3", fontWeight: "bold" , fontSize: "1.05rem" }}>
                        {formatCurrency(discounted)}
                      </span>
                    </Typography>
                  ) : (
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#2196f3", 
                        fontWeight: "bold",
                        fontSize: "1.05rem",
                        mt: 0.5,
                      }}
                    >
                      Total: {formatCurrency(original)}
                    </Typography>
                  )}
                </Box>
              );
            })}

            {/* ➖ Divider */}
            <Divider sx={{ my: 2, borderColor: "#e0e7ef" }} />

            {/* Summary */}
            <Typography sx={{ fontWeight: 600, fontSize: "1rem", color: "#1d3557" }}>
              Store total:{" "}
              <span style={{ color: "#2196f3" }}>
                {formatCurrency(snapshot.price - snapshot.discount)}
              </span>
            </Typography>
          </>
        ) : (
          <Typography color="error" variant="body2">
            {error || "Snapshot data unavailable."}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionCard;
