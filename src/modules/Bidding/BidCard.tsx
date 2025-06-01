// BidCard.tsx
// TODO - check about isPurchased and fix it if needed
import React from 'react';
import { Card, CardContent, Typography, Button, Box, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BidDto } from '../../shared/types/dtos';

interface BidCardProps {
  bid: BidDto;
  mode: 'user' | 'store';
}

const BidCard: React.FC<BidCardProps> = ({ bid, mode }) => {
  const navigate = useNavigate();

  const handlePurchase = () => {
    navigate(`/payment?mode=bid&bidId=${bid.id}`); // TODO - fix the URL
  };

  return (
    <Card sx={{ minHeight: 180, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <CardContent>
        <Typography variant="h6">Bid ID: {bid.id}</Typography> // TODO - I think I should remove this
        <Typography variant="subtitle1">Product: {bid.productId}</Typography>
        <Typography>Final Price: ${bid.price}</Typography>
        <Typography>Status: {bid.isPurchased ? 'Purchased' : 'Pending Purchase'}</Typography>
      </CardContent>

      <Box px={2} pb={2}>
        <Stack direction="row" spacing={1}>
          {mode === 'user' && !bid.isPurchased && (
            <Button variant="contained" color="primary" onClick={handlePurchase}>
              Purchase
            </Button>
          )}

          {mode === 'store' && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {bid.isPurchased ? 'User already purchased this bid.' : 'Waiting for user to purchase.'}
            </Typography>
          )}
        </Stack>
      </Box>
    </Card>
  );
};

export default BidCard;
