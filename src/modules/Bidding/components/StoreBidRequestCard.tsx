import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Box, Stack,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Chip, useTheme
} from '@mui/material';
import { BidRequestDto } from '../../../shared/types/dtos';
import useBid from '../hooks/useBid';
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
  const {
    acceptBidRequest,
    rejectBidRequest,
    submitAlternativePrice,
    getSellersRemaining,
    remainingSellers,
  } = useBid();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [priceStr, setPriceStr] = useState('');
  const [productName, setProductName] = useState(request.productId);
  const [userName, setUserName] = useState(request.userId);
  const [storeName, setStoreName] = useState(request.storeId);

  const isFinal = ['REJECTED', 'APPROVED', 'CANCELLED'].includes(request.requestStatus);

  // Fetch display names once
  useEffect(() => {
    sdk.getProduct(request.productId).then(p => setProductName(p.name)).catch(() => {});
    sdk.getPublicUserProfileDetails(request.userId).then(u => setUserName(u.username)).catch(() => {});
    sdk.getStore(request.storeId).then(s => setStoreName(s.name)).catch(() => {});
    getSellersRemaining(request.bidRequestId);
  }, [request.bidRequestId, request.productId, request.userId, request.storeId, getSellersRemaining]);

  const sellersLeft = remainingSellers[request.bidRequestId] || [];

  // disable buttons if this seller already accepted
  const disabledButtons = isFinal || sellersLeft.length === 0;

  const handleAccept = async () => {
    await acceptBidRequest(request.bidRequestId);
    await getSellersRemaining(request.bidRequestId);
    onChanged();
  };

  const handleReject = async () => {
    await rejectBidRequest(request.bidRequestId);
    onChanged();
  };

  const handleSuggest = async () => {
    const price = parseFloat(priceStr);
    if (!price || price <= 0) return alert('Enter valid price');
    await submitAlternativePrice(request.bidRequestId, price);
    setDialogOpen(false);
    setPriceStr('');
    onChanged();
  };

  return (
    <>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: theme.transitions.create(['transform','box-shadow'], {
            duration: theme.transitions.duration.standard,
            easing: theme.transitions.easing.easeInOut,
          }),
          '&:hover': { boxShadow: theme.shadows[6], transform: 'translateY(-4px)' },
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>Product: {productName}</Typography>
          <Typography variant="body2">User: {userName}</Typography>
          <Typography variant="body2">Store: {storeName}</Typography>
          <Typography variant="body1" mt={1}><strong>Price:</strong> ${request.price.toFixed(2)}</Typography>
          <Box mt={1}>
            <Chip label={request.requestStatus.replace(/_/g, ' ')} color={statusColor[request.requestStatus]} variant="outlined" />
          </Box>
        </CardContent>

        <Box sx={{ p: 2 }}>
          <Stack spacing={1}>
            <Stack direction="row" spacing={1}>
              <Button variant="contained" color="success"
                disabled={disabledButtons}
                onClick={handleAccept}
                fullWidth
              >
                Accept
              </Button>
              <Button variant="outlined" color="error"
                disabled={disabledButtons}
                onClick={handleReject}
                fullWidth
              >
                Reject
              </Button>
            </Stack>
            <Button variant="outlined"
              disabled={disabledButtons}
              onClick={() => setDialogOpen(true)}
              fullWidth
            >
              Suggest Price
            </Button>
          </Stack>
        </Box>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Suggest Price</DialogTitle>
        <DialogContent>
          <TextField label="New Price" type="number" fullWidth margin="normal"
            value={priceStr} onChange={e => setPriceStr(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSuggest}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StoreBidRequestCard;
