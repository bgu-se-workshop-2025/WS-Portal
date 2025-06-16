import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { sdk } from '../../../sdk/sdk';
import { BidDto, Pageable } from '../../../shared/types/dtos';
import StoreBidCard from '../components/StoreBidCard';

const PAGE: Pageable = { page: 0, size: 20 };

const StoreBidsPage: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const [bids, setBids] = useState<BidDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBids = useCallback(async () => {
    if (!storeId) {
      setError('Error: missing storeId in URL parameters.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await sdk.getBidsOfStore(storeId, PAGE);
      setBids(data);
    } catch (err: any) {
      console.error('Error fetching store bids:', err);
      setError(err.message);
      setBids([]);
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    fetchBids();
  }, [fetchBids]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Store Bids</Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {!loading && !error && bids.length === 0 && (
        <Typography variant="body1" mt={2}>No bids found.</Typography>
      )}
      <Grid container spacing={2} mt={2}>
        {bids.map(bid => (
          <Grid container size={{xs: 12, sm: 6, md: 4}} key={bid.id}>
            {/* Removed onAction since StoreBidCard doesn't accept it */}
            <StoreBidCard bid={bid} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default StoreBidsPage;
