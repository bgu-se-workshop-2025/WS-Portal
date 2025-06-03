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
  Chip,
  useTheme,
} from '@mui/material';
import { sdk } from '../../sdk/sdk';
import { BidRequestDto, BidRequestStatus } from '../../shared/types/dtos';

interface BidRequestCardProps {
  bidRequest: BidRequestDto;
  mode: 'user' | 'store';
  onAction?: () => void;
}

const statusToString = (status: BidRequestStatus): string => {
  switch (status) {
    case BidRequestStatus.PENDING:
      return 'Pending';
    case BidRequestStatus.ACCEPTED:
      return 'Accepted';
    case BidRequestStatus.APPROVED:
      return 'Approved';
    case BidRequestStatus.RECEIVED_ALTERNATIVE_PRICE:
      return 'Received Alternative Price';
    case BidRequestStatus.REJECTED:
      return 'Rejected';
    default:
      return 'Unknown';
  }
};

const statusColorMap: Record<
  BidRequestStatus,
  'default' | 'primary' | 'success' | 'warning' | 'error'
> = {
  [BidRequestStatus.PENDING]: 'default',
  [BidRequestStatus.ACCEPTED]: 'primary',
  [BidRequestStatus.APPROVED]: 'success',
  [BidRequestStatus.RECEIVED_ALTERNATIVE_PRICE]: 'warning',
  [BidRequestStatus.REJECTED]: 'error',
};

const BidRequestCard: React.FC<BidRequestCardProps> = ({
  bidRequest,
  mode,
  onAction,
}) => {
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [newPrice, setNewPrice] = useState('');

  const handleAccept = async () => {
    try {
      await sdk.acceptBidRequest(bidRequest.bidRequestId);
      onAction?.();
    } catch (err) {
      alert(`Error accepting bid: ${err}`);
    }
  };

  const handleReject = async () => {
    try {
      await sdk.rejectBidRequest(bidRequest.bidRequestId);
      onAction?.();
    } catch (err) {
      alert(`Error rejecting bid: ${err}`);
    }
  };

  const handleDelete = async () => {
    try {
      await sdk.deleteBidRequest(bidRequest.bidRequestId);
      onAction?.();
    } catch (err) {
      alert(`Error deleting bid request: ${err}`);
    }
  };

  const handleSuggestPrice = async () => {
    try {
      await sdk.submitAlternativePrice(
        bidRequest.bidRequestId,
        parseFloat(newPrice)
      );
      setDialogOpen(false);
      setNewPrice('');
      onAction?.();
    } catch (err) {
      alert(`Error suggesting price: ${err}`);
    }
  };

  const isFinalStatus =
    bidRequest.requestStatus === BidRequestStatus.REJECTED ||
    bidRequest.requestStatus === BidRequestStatus.APPROVED;

  return (
    <>
      <Card
        sx={{
          minHeight: 160,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#ffffff',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            boxShadow: theme.shadows[6],
            transform: 'translateY(-4px)',
          },
        }}
      >
        <CardContent>
          <Typography variant="subtitle1">
            Product: {bidRequest.productId}
          </Typography>
          <Typography>Store ID: {bidRequest.storeId}</Typography>
          <Typography>Offered Price: ${bidRequest.price}</Typography>
          <Box mt={1}>
            <Chip
              label={statusToString(bidRequest.requestStatus)}
              color={statusColorMap[bidRequest.requestStatus]}
              variant="outlined"
            />
          </Box>
        </CardContent>

        <Box px={2} pb={2}>
          <Stack direction="row" spacing={1}>
            {mode === 'store' && (
              <>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleAccept}
                  disabled={isFinalStatus}
                >
                  Accept
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleReject}
                  disabled={isFinalStatus}
                >
                  Reject
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setDialogOpen(true)}
                  disabled={isFinalStatus}
                >
                  Suggest Price
                </Button>
              </>
            )}

            {mode === 'user' && (
              <Box sx={{ width: '100%' }}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  onClick={() => setConfirmDialogOpen(true)}
                  disabled={isFinalStatus}
                >
                  Cancel
                </Button>
              </Box>
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
          <Button
            onClick={handleSuggestPrice}
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirm Cancellation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel this bid request?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>No</Button>
          <Button
            onClick={() => {
              setConfirmDialogOpen(false);
              handleDelete();
            }}
            color="error"
            variant="contained"
          >
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BidRequestCard;
