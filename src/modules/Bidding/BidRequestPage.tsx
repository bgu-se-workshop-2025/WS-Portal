import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import { Pageable } from '../../shared/types/dtos';
import BidRequestCard from './BidRequestCard';
import { useParams } from 'react-router-dom';
import useBid from "./hooks/useBid";
import { sdk } from "./../../sdk/sdk";

interface BidRequestPageProps {
  mode: 'user' | 'store';
}

const BidRequestPage: React.FC<BidRequestPageProps> = ({ mode }) => {
  const { storeId } = useParams();
  const { getBidRequestsOfUser, getBidRequestsOfStore, loading, error, requests } = useBid();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);

  const fetchBidRequests = useCallback(async () => {
    const pageable: Pageable = { page: page, size: size };

    try {
      if (mode === 'user') {
        const userId = (await sdk.getCurrentUserProfileDetails()).id;
        await getBidRequestsOfUser(userId, pageable);
      } else if (mode === "store") {
        await getBidRequestsOfStore(storeId!, pageable);
      } else {
        throw new Error('Missing storeId for store mode');
      }
    } catch (err: any) {
      console.error(err);
    }
  }, [storeId, mode, getBidRequestsOfUser, getBidRequestsOfStore, page, size]);

  useEffect(() => {
    fetchBidRequests();
  }, [storeId, mode, page, size]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {mode === 'user' ? 'My Bid Requests' : 'Store Bid Requests'}
      </Typography>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && requests.length === 0 && !error && (
        <Typography variant="body1" mt={2}>
          No bid requests were found.
        </Typography>
      )}

      <Grid container spacing={2} mt={2}>
        {requests.map((request) => (
          <Grid container size={{ xs: 12, sm: 6, md: 4 }} key={request.bidRequestId}>
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
