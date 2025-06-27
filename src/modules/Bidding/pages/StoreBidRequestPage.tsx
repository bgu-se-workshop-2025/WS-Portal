import React, { useEffect, useCallback } from 'react';
import { Container, Typography, CircularProgress, Alert, Grid, Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import { Pageable } from '../../../shared/types/dtos';
import StoreBidRequestCard from '../components/StoreBidRequestCard';
import useBid from '../hooks/useBid';

const PAGE: Pageable = { page: 0, size: 20 };

const StoreBidRequestPage: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const { requests, loading, error, getBidRequestsOfStore } = useBid();

  const fetchRequests = useCallback(() => {
    if (storeId) getBidRequestsOfStore(storeId, PAGE);
  }, [storeId, getBidRequestsOfStore]);

  useEffect(fetchRequests, [fetchRequests]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Store Bid Requests</Typography>

      {loading.list && (
        <Box textAlign="center" my={2}>
          <CircularProgress />
        </Box>
      )}
      {error && <Alert sx={{ mt: 2 }} severity="error">{error}</Alert>}
      {!loading.list && !error && requests.length === 0 && (
        <Typography variant="body1" sx={{ mt: 2 }}>No bid requests found.</Typography>
      )}

      <Grid container spacing={2} mt={2} alignItems="stretch">
        {requests.map(req => (
          <Grid container size={{xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4}} key={req.bidRequestId}>
            <StoreBidRequestCard request={req} onChanged={fetchRequests} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default StoreBidRequestPage;
