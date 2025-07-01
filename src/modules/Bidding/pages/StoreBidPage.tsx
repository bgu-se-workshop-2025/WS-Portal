import React, { useEffect, useCallback, useState } from 'react';
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Box,
  Button,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { Pageable } from '../../../shared/types/dtos';
import StoreBidCard from '../components/StoreBidCard';
import useBid from '../hooks/useBid';

const PAGE_SIZE = 10;

const StoreBidsPage: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const {
    getBidsOfStore,
    bids,
    loading: { list: loadingList },
    error,
    clearBids,
  } = useBid();
  const [page, setPage] = useState(0);
  const [allLoaded, setAllLoaded] = useState(false);

  const fetchBids = useCallback(async (pageNum: number, append: boolean = false) => {
    if (!storeId) return;
    const pageable: Pageable = { page: pageNum, size: PAGE_SIZE };
    await getBidsOfStore(storeId, pageable, append);
  }, [storeId, getBidsOfStore]);

  // Check if we should show load more button
  const shouldShowLoadMore = !loadingList && !error && bids.length > 0 && !allLoaded && 
    (page === 0 ? bids.length === PAGE_SIZE : bids.length % PAGE_SIZE === 0);

  // Initial load
  useEffect(() => {
    if (storeId) {
      clearBids();
      setPage(0);
      setAllLoaded(false);
      fetchBids(0, false);
    }
  }, [storeId, clearBids, fetchBids]);

  const handleLoadMore = async () => {
    if (!loadingList && !allLoaded && storeId) {
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
        Bids
      </Typography>

      {loadingList && page === 0 && (
        <Box textAlign="center" my={2}>
          <CircularProgress />
        </Box>
      )}

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

      {/* Load More button - only show if we have exactly PAGE_SIZE items or multiples of PAGE_SIZE */}
      {shouldShowLoadMore && (
        <Box textAlign="center" mt={4}>
          <Button variant="outlined" onClick={handleLoadMore}>
            Load More
          </Button>
        </Box>
      )}

      {loadingList && page > 0 && (
        <Box textAlign="center" my={2}>
          <CircularProgress size={24} />
        </Box>
      )}
    </Container>
  );
};

export default StoreBidsPage;
