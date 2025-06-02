import React from 'react';
import { Card, CardContent, Typography, Button, Box, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BidDto } from '../../shared/types/dtos';
import { sdk } from '../../sdk/sdk';

interface BidCardProps {
  bid: BidDto;
  mode: 'user' | 'store';
  onAction: () => void;
}

const BidCard: React.FC<BidCardProps> = ({ bid, mode, onAction }) => {
  const navigate = useNavigate();

  const handlePurchase = async () => {
    navigate(`/payment?mode=bid&bidId=${bid.id}`);
    // After navigating, the payment page is responsible for deleting the bid
    // Once deleted and user returns, `onAction` should be triggered to refresh the list
  };

  return (
    <Card sx={{ minHeight: 180, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <CardContent>
        <Typography variant="subtitle1">Product: {bid.productId}</Typography>
        <Typography>Final Price: ${bid.price}</Typography>
      </CardContent>

      <Box px={2} pb={2}>
        <Stack direction="row" spacing={1}>
          {mode === 'user' && (
            <Button variant="contained" color="primary" onClick={handlePurchase}>
              Purchase
            </Button>
          )}

          {mode === 'store' && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Waiting for user to purchase.
            </Typography>
          )}
        </Stack>
      </Box>
    </Card>
  );
};

export default BidCard;