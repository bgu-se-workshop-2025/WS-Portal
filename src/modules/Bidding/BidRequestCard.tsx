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
import { BidRequestDto } from '../../shared/types/dtos';
import useBid from './hooks/useBid';

interface BidRequestCardProps {
  bidRequest: BidRequestDto;
  mode: 'user' | 'store';
  onAction?: () => void;
}

const statusColorMap: Record<BidRequestDto['requestStatus'], 'default' | 'primary' | 'success' | 'warning' | 'error'> = {
  PENDING: 'default',
  ACCEPTED: 'primary',
  APPROVED: 'success',
  RECEIVED_ALTERNATIVE_PRICE: 'warning',
  REJECTED: 'error',
};

const BidRequestCard: React.FC<BidRequestCardProps> = ({ bidRequest, mode, onAction }) => {
  const theme = useTheme();
  const { acceptBidRequest, rejectBidRequest, submitAlternativePrice, loading } = useBid();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [newPrice, setNewPrice] = useState<string>('');

  const isFinal = ['REJECTED','APPROVED'].includes(bidRequest.requestStatus);

  const handleAccept = async () => {
    await acceptBidRequest(bidRequest.bidRequestId);
    onAction?.();
  };

  const handleReject = async () => {
    await rejectBidRequest(bidRequest.bidRequestId);
    onAction?.();
  };

  const handleSuggest = async () => {
    await submitAlternativePrice(bidRequest.bidRequestId, Number(newPrice));
    setDialogOpen(false);
    setNewPrice('');
    onAction?.();
  };

  return (
    <>
      <Card
        sx={{
          minHeight: 180,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          '&:hover': {
            boxShadow: theme.shadows[6],
            transform: 'translateY(-4px)',
          },
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
      >
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600}>
            Product: {bidRequest.productId}
          </Typography>
          <Typography variant="body2">
            Store: {bidRequest.storeId}
          </Typography>
          <Typography variant="body1" mt={1}>
            <strong>Price:</strong> ${bidRequest.price.toFixed(2)}
          </Typography>
          <Box mt={1}>
            <Chip
              label={bidRequest.requestStatus.replace(/_/g, ' ')}
              color={statusColorMap[bidRequest.requestStatus]}
              variant="outlined"
            />
          </Box>
        </CardContent>

        <Box sx={{ p: 2 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {mode === 'store' && (
              <>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleAccept}
                  disabled={isFinal || loading}
                >
                  Accept
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleReject}
                  disabled={isFinal || loading}
                >
                  Reject
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setDialogOpen(true)}
                  disabled={isFinal || loading}
                >
                  Suggest Price
                </Button>
              </>
            )}

            {mode === 'user' && (
              <Button
                variant="outlined"
                color="error"
                fullWidth
                onClick={() => setConfirmDialogOpen(true)}
                disabled={isFinal || loading}
              >
                Cancel Request
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
            onChange={e => setNewPrice(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSuggest}
            variant="contained"
            disabled={loading || !newPrice}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Cancel Bid Request</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to cancel this bid?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>No</Button>
          <Button
            onClick={async () => {
              setConfirmDialogOpen(false);
              await rejectBidRequest(bidRequest.bidRequestId);
              onAction?.();
            }}
            color="error"
            variant="contained"
            disabled={loading}
          >
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BidRequestCard;
