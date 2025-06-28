import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Divider,
  Chip,
} from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StoreIcon from "@mui/icons-material/Store";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { StoreOrderDto } from "../../../../../shared/types/dtos";

interface Props {
  transaction: StoreOrderDto;
}

const TransactionCard: React.FC<Props> = ({ transaction }) => {
  const { id, time, storeSnapshot } = transaction;

  // Try to parse the JSON snapshot
  let snapshot: any = null;
  try {
    snapshot = JSON.parse(storeSnapshot);
  } catch {
    snapshot = null;
  }

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        {/* ───── ID ───── */}
        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
          <ReceiptLongIcon fontSize="small" />
          <Typography variant="subtitle2" color="text.secondary">
            Transaction&nbsp;ID:
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
            {id.slice(0, 8)}…
          </Typography>
        </Stack>

        {/* ───── Date ───── */}
        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
          <AccessTimeIcon fontSize="small" />
          <Typography variant="subtitle2" color="text.secondary">
            Date:
          </Typography>
          <Typography variant="body2">
            {new Date(time).toLocaleString()}
          </Typography>
        </Stack>

        <Divider sx={{ my: 1 }} />

        {/* ───── Snapshot Info ───── */}
        {snapshot ? (
          <>
            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
              <StoreIcon fontSize="small" />
              <Typography variant="subtitle2" color="text.secondary">
                Store:
              </Typography>
              <Typography variant="body2">{snapshot.name}</Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
              <ShoppingCartIcon fontSize="small" />
              <Typography variant="subtitle2" color="text.secondary">
                Items:
              </Typography>
              <Chip
                label={snapshot.productSnapshots?.length ?? 0}
                size="small"
              />
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <LocalOfferIcon fontSize="small" />
              <Typography variant="subtitle2" color="text.secondary">
                Total Price:
              </Typography>
              <Typography variant="body2">
                ₪{snapshot.price?.toFixed(2) ?? "?"}
              </Typography>
            </Stack>
          </>
        ) : (
          <Typography variant="body2" color="error">
            Snapshot data unavailable.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionCard;
