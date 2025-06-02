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
  mode: 'user' | 'store'; // TODO - need to change to what Noam did
}

const BidRequestPage: React.FC<BidRequestPageProps> = ({ mode }) => {
  const { id } = useParams(); // userId or storeId
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bidRequests, setBidRequests] = useState<BidRequestDto[]>([]);

  const fetchBidRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const pageable: Pageable = { page: 0, size: 20 };

      const data =
        mode === 'user'
          ? await sdk.getBidRequestsOfUser(pageable)
          : await sdk.getBidRequestsOfStore(id!, pageable);

      setBidRequests(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load bid requests.');
    } finally {
      setLoading(false);
    }
  }, [id, mode]);

  useEffect(() => {
    if (id) {
      fetchBidRequests();
    }
  }, [id, mode, fetchBidRequests]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {mode === 'user' ? 'My Bid Requests' : 'Store Bid Requests'}
      </Typography>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

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
