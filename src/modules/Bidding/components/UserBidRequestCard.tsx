import React, { useState } from 'react';
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
};

interface Props {
  request: BidRequestDto;
  onChanged: () => void;
}

const UserBidRequestCard: React.FC<Props> = ({ request, onChanged }) => {
  const theme = useTheme();
  const [confirm, setConfirm] = useState(false);
  const isFinal = ['REJECTED', 'APPROVED'].includes(request.requestStatus);

  const cancelRequest = async () => {
    try {
      await sdk.rejectBidRequest(request.bidRequestId);
      onChanged();
      setConfirm(false);
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <>
      <Card sx={{ /* same hover styles */ }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600}>
            Product: {request.productId}
          </Typography>
          <Typography>Store: {request.storeId}</Typography>
          <Typography><strong>Price:</strong> ${request.price.toFixed(2)}</Typography>
          <Box mt={1}>
            <Chip
              label={request.requestStatus.replace(/_/g, ' ')}
              color={statusColor[request.requestStatus]}
              variant="outlined"
            />
          </Box>
        </CardContent>
        <Box sx={{ p:2 }}>
          <Button
            variant="outlined" color="error" fullWidth
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
          <Typography>Are you sure?</Typography>
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
