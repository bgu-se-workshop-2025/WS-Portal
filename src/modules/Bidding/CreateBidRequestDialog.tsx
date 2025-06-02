// CreateBidRequestDialog.tsx

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Stack,
} from '@mui/material';
import { sdk } from '../../sdk/sdk';
import { BidRequestDto, BidRequestStatus } from '../../shared/types/dtos';

interface CreateBidRequestDialogProps {
  open: boolean;
  onClose: () => void;
  productId: string;
  storeId: string;
  bidRequestStatus?: BidRequestStatus;
}

const CreateBidRequestDialog: React.FC<CreateBidRequestDialogProps> = ({
  open,
  onClose,
  productId,
}) => {
  const [price, setPrice] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (price === '' || price <= 0) {
      setError('Please enter a valid bid price.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const bidRequest: BidRequestDto = {
        bidRequestId: '', 
        productId,
        price,
        storeId: '',
        bidRequestStatus: BidRequestStatus.PENDING,
      };

      await sdk.createBidRequest(bidRequest);
      onClose();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPrice(value === '' ? '' : Number(value));
  };

  const handleClose = () => {
    if (!loading) {
      setPrice('');
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Place a Bid</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Bid Price"
            type="number"
            value={price}
            onChange={handlePriceChange}
            fullWidth
            inputProps={{ min: 0 }}
          />
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Submit Bid'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateBidRequestDialog;
