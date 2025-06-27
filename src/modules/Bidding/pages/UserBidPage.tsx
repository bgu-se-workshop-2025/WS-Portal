import React, { useEffect, useCallback } from 'react';
import { Container, Typography, CircularProgress, Alert, Grid, Box } from '@mui/material';
import UserBidCard from '../components/UserBidCard';
import useBid from '../hooks/useBid';
import { Pageable } from '../../../shared/types/dtos';

const PAGE: Pageable = { page: 0, size: 20 };

const UserBidsPage: React.FC = () => {
  const { getBidsOfUser, bids, loading, error } = useBid();

  const fetchBids = useCallback(() => {
    getBidsOfUser(PAGE);
  }, [getBidsOfUser]);

  useEffect(() => {
    fetchBids();
  }, [fetchBids]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Bids
      </Typography>

      {loading.list && (
        <Box textAlign="center" my={2}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      {!loading.list && !error && bids.length === 0 && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          No bids found.
        </Typography>
      )}

      <Grid container spacing={2} mt={2} alignItems="stretch">
        {bids.map((bid) => (
          <Grid container size={{xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4}} key={bid.id}>
            <UserBidCard bid={bid} onAction={fetchBids} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default UserBidsPage;
