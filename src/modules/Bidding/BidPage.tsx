import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { sdk } from '../../sdk/sdk';
import { BidDto, Pageable } from '../../shared/types/dtos';
import BidCard from './BidCard';

interface BidPageProps {
  mode: 'user' | 'store';
}

const BidPage: React.FC<BidPageProps> = ({ mode }) => {
  const { id } = useParams(); // userId or storeId
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bids, setBids] = useState<BidDto[]>([]);

  const fetchBids = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const pageable: Pageable = { page: 0, size: 20 };

      const data =
        mode === 'user'
          ? await sdk.getBidsOfUser(pageable)
          : await sdk.getBidsOfStore(id!, pageable);

      setBids(data);
    } catch (err: any) {
      console.warn('Backend not available, using mock data:', err.message);

      // Fallback mock data
      const mockUserBids: BidDto[] = [
        {
          id: 'mock-bid-user-1',
          userId: id ?? 'mock-user',
          productId: 'product-123',
          price: 99.99,
          storeId: 'store-1',
        },
        {
          id: 'mock-bid-user-2',
          userId: id ?? 'mock-user',
          productId: 'product-456',
          price: 149.5,
          storeId: 'store-2',
        },
        {
          id: 'mock-bid-user-3',
          userId: id ?? 'mock-user',
          productId: 'product-789',
          price: 20,
          storeId: 'store-3',
        },
      ];

      const mockStoreBids: BidDto[] = [
        {
          id: 'mock-bid-store-1',
          userId: 'user-1',
          productId: 'item-A',
          price: 75.0,
          storeId: id ?? 'mock-store',
        },
        {
          id: 'mock-bid-store-2',
          userId: 'user-2',
          productId: 'item-B',
          price: 120.5,
          storeId: id ?? 'mock-store',
        },
        {
          id: 'mock-bid-store-3',
          userId: 'user-3',
          productId: 'item-C',
          price: 59.99,
          storeId: id ?? 'mock-store',
        },
      ];

      const mockData = mode === 'user' ? mockUserBids : mockStoreBids;
      setBids(mockData);
    } finally {
      setLoading(false);
    }
  }, [id, mode]);

  useEffect(() => {
    if (id || mode === 'user') {
      fetchBids();
    }
  }, [id, mode, fetchBids]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {mode === 'user' ? 'My Bids' : 'Store Bids'}
      </Typography>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && bids.length === 0 && !error && (
        <Typography variant="body1" mt={2}>
          No bids were found.
        </Typography>
      )}

      <Grid container spacing={2} mt={2}>
        {bids.map((bid) => (
          <Grid container size = {{xs: 12, sm: 6, md: 4}} key={bid.id}>
            <BidCard bid={bid} mode={mode} onAction={fetchBids} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BidPage;
