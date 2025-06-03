import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import { sdk } from '../../sdk/sdk';
import { BidRequestDto, Pageable } from '../../shared/types/dtos';
import BidRequestCard from './BidRequestCard';

interface BidRequestPageProps {
  mode: 'user' | 'store'; // 'user' or 'store' mode
}

const BidRequestPage: React.FC<BidRequestPageProps> = ({ mode }) => {
  const { id } = useParams(); // userId or storeId
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bidRequests, setBidRequests] = useState<BidRequestDto[]>([]);

  const fetchBidRequests = useCallback(async () => {
    let timeoutId: NodeJS.Timeout | undefined = undefined;

    try {
      setLoading(true);
      setError(null);

      // Force stop spinner after 5 seconds
      timeoutId = setTimeout(() => {
        setLoading(false);
      }, 5000);

      const pageable: Pageable = { page: 0, size: 20 };

      const data =
        mode === 'user'
          ? await sdk.getBidRequestsOfUser(pageable)
          : await sdk.getBidRequestsOfStore(id!, pageable);

      setBidRequests(data);
    } catch (err: any) {
      console.warn('Backend not available, using mock data:', err.message);

      // Fallback mock data
      const mockUserBidRequests: BidRequestDto[] = [
        {
          bidRequestId: 'mock-user-1',
          storeId: 'store-1',
          productId: 'product-123',
          price: 99.99,
          requestStatus: 0,
        },
        {
          bidRequestId: 'mock-user-2',
          storeId: 'store-2',
          productId: 'product-456',
          price: 149.5,
          requestStatus: 3,
        },
        {
          bidRequestId: 'mock-user-3',
          storeId: 'store-3',
          productId: 'product-789',
          price: 20,
          requestStatus: 4,
        },
        {
          bidRequestId: 'mock-user-4',
          storeId: 'store-4',
          productId: 'product-135',
          price: 600,
          requestStatus: 2,
        },
      ];

      const mockStoreBidRequests: BidRequestDto[] = [
        {
          bidRequestId: 'mock-store-1',
          storeId: id ?? 'mock-store',
          productId: 'item-A',
          price: 75.0,
          requestStatus: 0,
        },
        {
          bidRequestId: 'mock-store-2',
          storeId: id ?? 'mock-store',
          productId: 'item-B',
          price: 120.5,
          requestStatus: 2,
        },
        {
          bidRequestId: 'mock-store-3',
          storeId: id ?? 'mock-store',
          productId: 'item-C',
          price: 59.99,
          requestStatus: 4,
        },
      ];

      const mockData = mode === 'user' ? mockUserBidRequests : mockStoreBidRequests;
      setBidRequests(mockData);
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      setLoading(false);
    }
  }, [id, mode]);

  useEffect(() => {
    fetchBidRequests();
  }, [id, mode, fetchBidRequests]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {mode === 'user' ? 'My Bid Requests' : 'Store Bid Requests'}
      </Typography>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && bidRequests.length === 0 && !error && (
        <Typography variant="body1" mt={2}>
          No bid requests were found.
        </Typography>
      )}

      <Grid container spacing={2} mt={2}>
        {bidRequests.map((request) => (
          <Grid container size = {{xs: 12, sm: 6, md: 4}} key={request.bidRequestId}>
            <BidRequestCard
              bidRequest={request}
              mode={mode}
              onAction={fetchBidRequests}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BidRequestPage;
