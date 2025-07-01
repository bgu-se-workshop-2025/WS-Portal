import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Alert,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BidDto } from '../../../shared/types/dtos';
import { sdk } from '../../../sdk/sdk';

interface UserBidCardProps {
  bid: BidDto;
  onAction: () => void;
}

const UserBidCard: React.FC<UserBidCardProps> = ({ bid, onAction }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [productName, setProductName] = useState<string>(bid.productId);
  const [storeName, setStoreName] = useState<string>(bid.storeId);

  useEffect(() => {
    sdk.getProduct(bid.productId)
      .then(p => setProductName(p.name))
      .catch(() => {});
    sdk.getStore(bid.storeId)
      .then(s => setStoreName(s.name))
      .catch(() => {});
  }, [bid.productId, bid.storeId]);

  const handlePurchase = () => {
    if (!bid.isPurchased) {
      navigate(`/payment?bidId=${bid.id}`);
      onAction();
    }
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
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardContent>
        <Typography variant="subtitle1" fontWeight={600}>
          Product: {productName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Store: {storeName}
        </Typography>
        <Typography variant="body1" mt={1}>
          Final Price: ${bid.price.toFixed(2)}
        </Typography>
        {bid.isPurchased && (
          <Alert sx={{ mt: 2 }} severity="success">
            Purchased
          </Alert>
        )}
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePurchase}
          fullWidth
          disabled={bid.isPurchased}
        >
          {bid.isPurchased ? 'Purchased' : 'Purchase'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default UserBidCard;
