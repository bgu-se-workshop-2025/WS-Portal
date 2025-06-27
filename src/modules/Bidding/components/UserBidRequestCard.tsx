import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Box, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Chip, useTheme
} from '@mui/material';
import { BidRequestDto } from '../../../shared/types/dtos';
import useBid from '../hooks/useBid';

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
  const { cancelBidRequest, loading } = useBid();
  const [confirm, setConfirm] = useState(false);

  const [productName, setProductName] = useState(request.productId);
  const [storeName, setStoreName] = useState(request.storeId);

  useEffect(() => {
    // Fetch product/store names
    import('../../../sdk/sdk').then(({ sdk }) => {
      sdk.getProduct(request.productId)
        .then(p => setProductName(p.name))
        .catch(() => {});
      sdk.getStore(request.storeId)
        .then(s => setStoreName(s.name))
        .catch(() => {});
    });
  }, [request.productId, request.storeId]);

  const isFinal = ['REJECTED', 'APPROVED', 'CANCELLED'].includes(request.requestStatus);
  const isBusy = loading.action;

  const handleCancel = async () => {
    await cancelBidRequest(request.bidRequestId);
    setConfirm(false);
    onChanged();
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
          '&:hover': {
            boxShadow: theme.shadows[6],
            transform: 'translateY(-4px)',
          },
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
            disabled={isFinal || isBusy}
            onClick={() => setConfirm(true)}
          >
            {isBusy ? 'Cancelling…' : 'Cancel Request'}
          </Button>
        </Box>
      </Card>

      <Dialog open={confirm} onClose={() => setConfirm(false)} fullWidth maxWidth="xs">
        <DialogTitle>Cancel Bid Request?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to cancel this bid request?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirm(false)} disabled={isBusy}>No</Button>
          <Button color="error" variant="contained" onClick={handleCancel} disabled={isBusy}>
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserBidRequestCard;
