import React, { useEffect, useCallback } from 'react';
import { Container, Typography, CircularProgress, Alert, Grid, Box } from '@mui/material';
import useBid from '../hooks/useBid';
import UserBidRequestCard from '../components/UserBidRequestCard';
import { Pageable } from '../../../shared/types/dtos';

const PAGE: Pageable = { page: 0, size: 20 };

const UserBidRequestPage: React.FC = () => {
  const {
    getBidRequestsOfUser,
    requests,
    loading,
    error,
  } = useBid();

  const fetchRequests = useCallback(() => {
    getBidRequestsOfUser(PAGE);
  }, [getBidRequestsOfUser]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Bid Requests
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

      {/* Display only when fully loaded, no error, and no requests */}
      {!loading.list && !error && requests.length === 0 && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          No bid requests found.
        </Typography>
      )}

      <Grid container spacing={2} mt={2}>
        {requests.map(req => (
          <Grid container size={{xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4}} key={req.bidRequestId}>
            <UserBidRequestCard request={req} onChanged={fetchRequests} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default UserBidRequestPage;
