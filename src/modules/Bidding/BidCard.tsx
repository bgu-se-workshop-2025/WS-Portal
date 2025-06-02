import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  useTheme,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BidDto } from '../../shared/types/dtos';

interface BidCardProps {
  bid: BidDto;
  mode: 'user' | 'store';
  onAction: () => void;
}

const BidCard: React.FC<BidCardProps> = ({ bid, mode }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handlePurchase = () => {
    navigate(`/payment?mode=bid&bidId=${bid.id}`);
    // Payment page is responsible for deletion
  };

  return (
    <Card
      sx={{
        minHeight: 180,
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
        <Typography variant="subtitle1" gutterBottom>
          Product: {bid.productId}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Store ID: {bid.storeId}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Final Price: ${bid.price.toFixed(2)}
        </Typography>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2 }}>
        {mode === 'user' ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handlePurchase}
            fullWidth
          >
            Purchase
          </Button>
        ) : (
          <Box sx={{ width: '100%' }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: 'center', width: '100%' }}
            >
              Waiting for user to purchase.
            </Typography>
          </Box>
        )}
      </CardActions>
    </Card>
  );
};

export default BidCard;
