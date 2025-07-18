import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  useTheme
} from '@mui/material';
import { BidDto } from '../../../shared/types/dtos';
import { sdk } from '../../../sdk/sdk';

interface StoreBidCardProps {
  bid: BidDto;
}

const StoreBidCard: React.FC<StoreBidCardProps> = ({ bid }) => {
  const theme = useTheme();
  const [productName, setProductName] = useState<string>(bid.productId);
  const [userName, setUserName] = useState<string>(bid.userId);
  const [storeName, setStoreName] = useState<string>(bid.storeId);

  useEffect(() => {
    sdk.getProduct(bid.productId).then(p => setProductName(p.name)).catch(() => {});
    sdk.getPublicUserProfileDetails(bid.userId).then(u => setUserName(u.username)).catch(() => {});
    sdk.getStore(bid.storeId).then(s => setStoreName(s.name)).catch(() => {});
  }, [bid.productId, bid.userId, bid.storeId]);

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
          Buyer: {userName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Store: {storeName}
        </Typography>
        <Typography variant="body1" mt={1}>
          Final Price: ${bid.price.toFixed(2)}
        </Typography>
        {bid.isPurchased && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Purchased
          </Alert>
        )}
      </CardContent>

      <Box sx={{ px: 2, pb: 2 }}>
        {bid.isPurchased ? (
          <Typography variant="body2" color="text.secondary" textAlign="center" width="100%">
            Purchase completed
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary" textAlign="center" width="100%">
            Waiting for buyer to complete purchase.
          </Typography>
        )}
      </Box>
    </Card>
  );
};

export default StoreBidCard;
