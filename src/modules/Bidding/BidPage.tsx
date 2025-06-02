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
      setError(err.message || 'Failed to load bids.');
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