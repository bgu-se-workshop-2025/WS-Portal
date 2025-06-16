import React, { useState } from 'react';
import {
  Card, CardContent, Typography, Box, Stack,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Chip, useTheme
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

const StoreBidRequestCard: React.FC<Props> = ({ request, onChanged }) => {
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [priceStr, setPriceStr] = useState('');
  const isFinal = ['REJECTED', 'APPROVED'].includes(request.requestStatus);

  const accept = async () => { await sdk.acceptBidRequest(request.bidRequestId); onChanged(); };
  const reject = async () => { await sdk.rejectBidRequest(request.bidRequestId); onChanged(); };
  const suggest = async () => {
    const price = parseFloat(priceStr);
    if (isNaN(price) || price <= 0) return alert('Enter valid price');
    await sdk.submitAlternativePrice(request.bidRequestId, price);
    setDialogOpen(false);
    setPriceStr('');
    onChanged();
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
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Button
              variant="contained" color="success"
              disabled={isFinal} onClick={accept}>Accept</Button>
            <Button
              variant="outlined" color="error"
              disabled={isFinal} onClick={reject}>Reject</Button>
            <Button
              variant="outlined"
              disabled={isFinal} onClick={() => setDialogOpen(true)}
            >
              Suggest Price
            </Button>
          </Stack>
        </Box>
      </Card>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Suggest Price</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth label="New Price" type="number"
            margin="normal" value={priceStr}
            onChange={e => setPriceStr(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={suggest}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StoreBidRequestCard;
