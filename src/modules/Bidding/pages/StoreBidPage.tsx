import React, { useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { Pageable } from '../../../shared/types/dtos';
import StoreBidCard from '../components/StoreBidCard';
import useBid from '../hooks/useBid';

const PAGE: Pageable = { page: 0, size: 20 };

const StoreBidsPage: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const {
    getBidsOfStore,
    bids,
    loading: { list: loadingList },
    error,
  } = useBid();

  const fetchBids = useCallback(() => {
    if (!storeId) return;
    getBidsOfStore(storeId, PAGE);
  }, [storeId, getBidsOfStore]);

  useEffect(() => {
    fetchBids();
  }, [fetchBids]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Store Bids
      </Typography>

      {loadingList && <CircularProgress />}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {!loadingList && !error && bids.length === 0 && (
        <Typography variant="body1" mt={2}>
          No bids found.
        </Typography>
      )}

      <Grid container spacing={2} mt={2}>
        {bids.map((bid) => (
          <Grid container size={{ xs: 12, sm: 6, md: 4}} key={bid.id}>
            <StoreBidCard bid={bid} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default StoreBidsPage;
