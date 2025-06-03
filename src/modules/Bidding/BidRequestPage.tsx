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
  mode: 'user' | 'store';
}

const BidRequestPage: React.FC<BidRequestPageProps> = ({ mode }) => {
  const { storeId } = useParams<{ storeId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bidRequests, setBidRequests] = useState<BidRequestDto[]>([]);

  const fetchBidRequests = useCallback(async () => {
    setLoading(true);
    setError(null);

    const pageable: Pageable = { page: 0, size: 20 };

    try {
      if (mode === 'user') {
        const user = await sdk.getCurrentUserProfileDetails();
        const data = await sdk.getBidRequestsOfUser(user.id, pageable);
        setBidRequests(data);
      } else if (storeId) {
        const data = await sdk.getBidRequestsOfStore(storeId, pageable);
        setBidRequests(data);
      } else {
        throw new Error('Missing storeId for store mode');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load bid requests.');
      setBidRequests([]);
    } finally {
      setLoading(false);
    }
  }, [storeId, mode]);

  useEffect(() => {
    fetchBidRequests();
  }, [fetchBidRequests]);

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
          <Grid container size={{xs: 12, sm: 6, md: 4}} key={request.bidRequestId}>
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
