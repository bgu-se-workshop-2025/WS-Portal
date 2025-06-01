// TODO - check if need to fix the backend and add BidRequestId to BidRequestDto

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { sdk } from '../../sdk/sdk';
import { BidRequestDto } from '../../shared/types/dtos';

interface BidRequestCardProps {
  bidRequest: BidRequestDto;
  mode: 'user' | 'store';
  onAction?: () => void;
}

const BidRequestCard: React.FC<BidRequestCardProps> = ({
  bidRequest,
  mode,
  onAction,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPrice, setNewPrice] = useState('');

  const handleAccept = async () => {
    try {
      await sdk.acceptBidRequest(bidRequest.id);
      onAction?.();
    } catch (err) {
      alert(`Error accepting bid: ${err}`);
    }
  };

  const handleReject = async () => {
    try {
      await sdk.rejectBidRequest(bidRequest.id);
      onAction?.();
    } catch (err) {
      alert(`Error rejecting bid: ${err}`);
    }
  };

  const handleDelete = async () => {
    try {
      await sdk.deleteBidRequest(bidRequest.id);
      onAction?.();
    } catch (err) {
      alert(`Error deleting bid request: ${err}`);
    }
  };

  const handleSuggestPrice = async () => {
    try {
      await sdk.submitAlternativePrice(bidRequest.id, parseFloat(newPrice));
      setDialogOpen(false);
      setNewPrice('');
      onAction?.();
    } catch (err) {
      alert(`Error suggesting price: ${err}`);
    }
  };

  return (
    <>
      <Card
        sx={{
          minHeight: 160,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <CardContent>
          <Typography variant="h6">Bid ID: {bidRequest.id}</Typography>
          <Typography variant="subtitle1">Product: {bidRequest.productId}</Typography>
          <Typography>Offered Price: ${bidRequest.price}</Typography>
          <Typography>Status: {bidRequest.bidRequestStatus}</Typography>
        </CardContent>

        <Box px={2} pb={2}>
          <Stack direction="row" spacing={1}>
            {mode === 'store' && (
              <>
                <Button variant="contained" color="success" onClick={handleAccept}>
                  Accept
                </Button>
                <Button variant="outlined" color="error" onClick={handleReject}>
                  Reject
                </Button>
                <Button variant="outlined" onClick={() => setDialogOpen(true)}>
                  Suggest Price
                </Button>
              </>
            )}

            {mode === 'user' && (
              <Button variant="outlined" color="error" onClick={handleDelete}>
                Cancel
              </Button>
            )}
          </Stack>
        </Box>
      </Card>

      {/* Suggest Price Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Suggest Alternative Price</DialogTitle>
        <DialogContent>
          <TextField
            label="New Price"
            type="number"
            fullWidth
            variant="outlined"
            margin="normal"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSuggestPrice} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BidRequestCard;