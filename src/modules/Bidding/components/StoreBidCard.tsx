import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme
} from '@mui/material';
import { BidDto } from '../../../shared/types/dtos';

interface StoreBidCardProps {
  bid: BidDto;
}

const StoreBidCard: React.FC<StoreBidCardProps> = ({ bid }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        minHeight: 180,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          boxShadow: theme.shadows[6],
          transform: 'translateY(-4px)'
        }
      }}
    >
      <CardContent>
        <Typography variant="subtitle1" fontWeight={600}>
          Product ID: {bid.productId}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          User ID: {bid.userId}
        </Typography>
        <Typography variant="body1" mt={1}>
          Final Price: ${bid.price.toFixed(2)}
        </Typography>
      </CardContent>
      <Box sx={{ px: 2, pb: 2 }}>
        <Typography variant="body2" color="text.secondary" textAlign="center" width="100%">
          Waiting for buyer to complete purchase.
        </Typography>
      </Box>
    </Card>
  );
};

export default StoreBidCard;
