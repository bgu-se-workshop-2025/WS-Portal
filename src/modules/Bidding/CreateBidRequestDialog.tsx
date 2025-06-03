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
  Typography,
} from '@mui/material';
import { sdk } from '../../sdk/sdk';
import { BidRequestDto, BidRequestStatus } from '../../shared/types/dtos';

interface CreateBidRequestDialogProps {
  open: boolean;
  onClose: () => void;
  productId: string;
  storeId: string;
}

const CreateBidRequestDialog: React.FC<CreateBidRequestDialogProps> = ({
  open,
  onClose,
  productId,
  storeId,
}) => {
  const [price, setPrice] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        storeId,
        price,
        requestStatus: BidRequestStatus.PENDING,
      };

      await sdk.createBidRequest(bidRequest);
      handleClose();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Submit Bid Request</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <Typography variant="body2" color="text.secondary">
            Product ID: <strong>{productId}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Store ID: <strong>{storeId}</strong>
          </Typography>
          <TextField
            label="Bid Price"
            type="number"
            value={price}
            onChange={handlePriceChange}
            fullWidth
            inputProps={{ min: 0 }}
            disabled={loading}
          />
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading || price === ''}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Bid'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateBidRequestDialog;
