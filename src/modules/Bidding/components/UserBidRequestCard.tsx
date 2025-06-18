import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, Typography, Box, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Chip, useTheme
} from '@mui/material';
import { BidRequestDto } from '../../../shared/types/dtos';
import { sdk } from '../../../sdk/sdk';

const statusColor: Record<BidRequestDto['requestStatus'], any> = {
  PENDING: 'default',
  ACCEPTED: 'primary',
  APPROVED: 'success',
  RECEIVED_ALTERNATIVE_PRICE: 'warning',
  REJECTED: 'error',
  CANCELLED: 'error',
};

interface Props {
  request: BidRequestDto;
  onChanged: () => void;
}

const UserBidRequestCard: React.FC<Props> = ({ request, onChanged }) => {
  const theme = useTheme();
  const [confirm, setConfirm] = useState(false);
  const isFinal = ['REJECTED', 'APPROVED', 'CANCELLED'].includes(request.requestStatus);

  const [productName, setProductName] = useState<string>(request.productId);
  const [storeName, setStoreName] = useState<string>(request.storeId);

  // Fetch product and store names
  useEffect(() => {
    sdk.getProduct(request.productId)
      .then((p) => setProductName(p.name))
      .catch(() => setProductName(request.productId));

    sdk.getStore(request.storeId)
      .then((s) => setStoreName(s.name))
      .catch(() => setStoreName(request.storeId));
  }, [request.productId, request.storeId]);

  const cancelRequest = async () => {
    try {
      await sdk.cancelBidRequest(request.bidRequestId);
      onChanged();
      setConfirm(false);
    } catch (e: any) {
      console.error(e);
      alert(e.message || 'Failed to cancel request');
    }
  };

  return (
    <>
      <Card
        sx={{
          minHeight: 180,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'transform 0.2s, box-shadow 0.3s',
          ...(isFinal
            ? {}
            : {
              '&:hover': {
                boxShadow: theme.shadows[6],
                transform: 'translateY(-4px)',
              },
            }),
        }}
      >
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600}>
            Product: {productName}
          </Typography>
          <Typography>Store: {storeName}</Typography>
          <Typography><strong>Price:</strong> ${request.price.toFixed(2)}</Typography>
          <Box mt={1}>
            <Chip
              label={request.requestStatus.replace(/_/g, ' ')}
              color={statusColor[request.requestStatus]}
              variant="outlined"
            />
          </Box>
        </CardContent>
        <Box sx={{ p: 2 }}>
          <Button
            variant="outlined"
            color="error"
            fullWidth
            disabled={isFinal}
            onClick={() => setConfirm(true)}
          >
            Cancel Request
          </Button>
        </Box>
      </Card>

      <Dialog open={confirm} onClose={() => setConfirm(false)}>
        <DialogTitle>Cancel Bid Request?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to cancel this bid request?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirm(false)}>No</Button>
          <Button color="error" variant="contained" onClick={cancelRequest}>
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserBidRequestCard;
