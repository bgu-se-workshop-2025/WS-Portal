import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BidDto } from '../../../shared/types/dtos';

interface UserBidCardProps {
  bid: BidDto;
  onAction: () => void;
}

const UserBidCard: React.FC<UserBidCardProps> = ({ bid, onAction }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handlePurchase = () => {
    navigate(`/payment?mode=bid&bidId=${bid.id}`);
    onAction();
  };

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
          Store ID: {bid.storeId}
        </Typography>
        <Typography variant="body1" mt={1}>
          Final Price: ${bid.price.toFixed(2)}
        </Typography>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button variant="contained" color="primary" onClick={handlePurchase} fullWidth>
          Purchase
        </Button>
      </CardActions>
    </Card>
  );
};

export default UserBidCard;
