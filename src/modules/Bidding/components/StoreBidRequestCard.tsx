import React, { useState, useEffect } from 'react';
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
  CANCELLED: 'error',
};

interface Props {
  request: BidRequestDto;
  onChanged: () => void;
}

const StoreBidRequestCard: React.FC<Props> = ({ request, onChanged }) => {
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [priceStr, setPriceStr] = useState('');
  const [productName, setProductName] = useState(request.productId);
  const [userName, setUserName] = useState(request.userId);
  const [storeName, setStoreName] = useState(request.storeId);

  const isFinal = ['REJECTED', 'APPROVED', 'CANCELLED'].includes(request.requestStatus);

  useEffect(() => {
    sdk.getProduct(request.productId)
      .then(p => setProductName(p.name))
      .catch(() => {});

    sdk.getPublicUserProfileDetails(request.userId)
      .then(u => setUserName(u.username))
      .catch(() => setUserName(request.userId));

    sdk.getStore(request.storeId)
      .then(s => setStoreName(s.name))
      .catch(() => {});
  }, [request.productId, request.userId, request.storeId]);

  const accept = async () => {
    try {
      await sdk.acceptBidRequest(request.bidRequestId);
      onChanged();
    } catch (e: any) {
      console.error(e);
      alert(e.message || 'Failed to accept bid request');
    }
  };

  const reject = async () => {
    try {
      await sdk.rejectBidRequest(request.bidRequestId);
      onChanged();
    } catch (e: any) {
      console.error(e);
      alert(e.message || 'Failed to reject bid request');
    }
  };

  const suggest = async () => {
    const price = parseFloat(priceStr);
    if (isNaN(price) || price <= 0) return alert('Enter a valid price');
    try {
      await sdk.submitAlternativePrice(request.bidRequestId, price);
      setDialogOpen(false);
      setPriceStr('');
      onChanged();
    } catch (e: any) {
      console.error(e);
      alert(e.message || 'Failed to suggest price');
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
          transition: 'transform 0.2s, boxShadow 0.3s',
          '&:hover': {
            boxShadow: theme.shadows[6],
            transform: 'translateY(-4px)',
          }
        }}
      >
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600}>
            Product: {productName}
          </Typography>
          <Typography variant="body2">User: {userName}</Typography>
          <Typography variant="body2">Store: {storeName}</Typography>
          <Typography variant="body1" mt={1}>
            <strong>Price:</strong> ${request.price.toFixed(2)}
          </Typography>
          <Box mt={1}>
            <Chip
              label={request.requestStatus.replace(/_/g, ' ')}
              color={statusColor[request.requestStatus]}
              variant="outlined"
            />
          </Box>
        </CardContent>

        <Box sx={{ p: 2 }}>
          <Stack spacing={1}>
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                color="success"
                disabled={isFinal}
                onClick={accept}
                fullWidth
              >
                Accept
              </Button>
              <Button
                variant="outlined"
                color="error"
                disabled={isFinal}
                onClick={reject}
                fullWidth
              >
                Reject
              </Button>
            </Stack>
            <Button
              variant="outlined"
              disabled={isFinal}
              onClick={() => setDialogOpen(true)}
              fullWidth
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
            label="New Price"
            type="number"
            fullWidth
            margin="normal"
            value={priceStr}
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
