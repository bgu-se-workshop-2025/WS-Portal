import React, { useEffect, useCallback, useState } from 'react';
import { Container, Typography, CircularProgress, Alert, Grid, Box, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import { Pageable } from '../../../shared/types/dtos';
import StoreBidRequestCard from '../components/StoreBidRequestCard';
import useBid from '../hooks/useBid';

const PAGE_SIZE = 10;

const StoreBidRequestPage: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const { requests, loading, error, getBidRequestsOfStore, clearRequests } = useBid();
  const [page, setPage] = useState(0);
  const [allLoaded, setAllLoaded] = useState(false);

  const fetchRequests = useCallback(async (pageNum: number, append: boolean = false) => {
    if (storeId) {
      const pageable: Pageable = { page: pageNum, size: PAGE_SIZE };
      await getBidRequestsOfStore(storeId, pageable, append);
    }
  }, [storeId, getBidRequestsOfStore]);

  // Check if we should show load more button
  const shouldShowLoadMore = !loading.list && !error && requests.length > 0 && !allLoaded && 
    (page === 0 ? requests.length === PAGE_SIZE : requests.length % PAGE_SIZE === 0);

  // Initial load
  useEffect(() => {
    if (storeId) {
      clearRequests();
      setPage(0);
      setAllLoaded(false);
      fetchRequests(0, false);
    }
  }, [storeId, clearRequests, fetchRequests]);

  const handleLoadMore = async () => {
    if (!loading.list && !allLoaded && storeId) {
      const nextPage = page + 1;
      setPage(nextPage);
      await fetchRequests(nextPage, true);
      
      // Check if we got fewer results than requested (indicating end of data)
      setTimeout(() => {
        if (requests.length < (nextPage + 1) * PAGE_SIZE) {
          setAllLoaded(true);
        }
      }, 100);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Bid Requests</Typography>

      {loading.list && page === 0 && (
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
            <StoreBidRequestCard request={req} onChanged={() => {
              // reset pagination on any change
              clearRequests();
              setPage(0);
              setAllLoaded(false);
              fetchRequests(0, false);
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

export default StoreBidRequestPage;
