import React, { useEffect, useState, useCallback } from 'react';
import { Container, Typography, CircularProgress, Alert, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import { sdk } from '../../../sdk/sdk';
import { Pageable, BidRequestDto } from '../../../shared/types/dtos';
import StoreBidRequestCard from '../components/StoreBidRequestCard';

const PAGE = 0;
const SIZE = 20;

const StoreBidRequestPage: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const [requests, setRequests] = useState<BidRequestDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const fetchRequests = useCallback(async () => {
    if (!storeId) {
      setError('Missing store ID in URL');
      return;
    }
    setLoading(true);
    setError(undefined);
    try {
      const data = await sdk.getBidRequestsOfStore(storeId, { page: PAGE, size: SIZE });
      setRequests(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">Store Bid Requests</Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && requests.length === 0 && (
        <Typography>No bid requests found.</Typography>
      )}
      <Grid container spacing={2} mt={2}>
        {requests.map(req => (
          <Grid container size={{xs: 12, sm: 6, md: 4}} key={req.bidRequestId}>
            <StoreBidRequestCard request={req} onChanged={fetchRequests} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default StoreBidRequestPage;
