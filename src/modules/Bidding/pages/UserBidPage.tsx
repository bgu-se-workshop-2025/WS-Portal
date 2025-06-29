import React, { useEffect, useCallback, useState } from 'react';
import { Container, Typography, CircularProgress, Alert, Grid, Box, Button } from '@mui/material';
import UserBidCard from '../components/UserBidCard';
import useBid from '../hooks/useBid';
import { Pageable } from '../../../shared/types/dtos';

const PAGE_SIZE = 10;

const UserBidsPage: React.FC = () => {
  const { getBidsOfUser, bids, loading, error, clearBids } = useBid();
  const [page, setPage] = useState(0);
  const [allLoaded, setAllLoaded] = useState(false);

  const fetchBids = useCallback(async (pageNum: number, append: boolean = false) => {
    const pageable: Pageable = { page: pageNum, size: PAGE_SIZE };
    await getBidsOfUser(pageable, append);
  }, [getBidsOfUser]);

  // Check if we should show load more button
  const shouldShowLoadMore = !loading.list && !error && bids.length > 0 && !allLoaded && 
    (page === 0 ? bids.length === PAGE_SIZE : bids.length % PAGE_SIZE === 0);

  // Initial load
  useEffect(() => {
    clearBids();
    setPage(0);
    setAllLoaded(false);
    fetchBids(0, false);
  }, [clearBids, fetchBids]);

  const handleLoadMore = async () => {
    if (!loading.list && !allLoaded) {
      const nextPage = page + 1;
      setPage(nextPage);
      await fetchBids(nextPage, true);
      
      // Check if we got fewer results than requested (indicating end of data)
      setTimeout(() => {
        if (bids.length < (nextPage + 1) * PAGE_SIZE) {
          setAllLoaded(true);
        }
      }, 100);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Bids
      </Typography>

      {loading.list && page === 0 && (
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
            <UserBidCard bid={bid} onAction={() => {
              // reset pagination on any change
              clearBids();
              setPage(0);
              setAllLoaded(false);
              fetchBids(0, false);
            }} />
          </Grid>
        ))}
      </Grid>

      {/* Load More button - only show if we have exactly PAGE_SIZE items or multiples of PAGE_SIZE */}
      {shouldShowLoadMore && (
        <Box textAlign="center" mt={4}>
          <Button variant="outlined" onClick={handleLoadMore}>
            Load More
          </Button>
        </Box>
      )}

      {loading.list && page > 0 && (
        <Box textAlign="center" my={2}>
          <CircularProgress size={24} />
        </Box>
      )}
    </Container>
  );
};

export default UserBidsPage;
