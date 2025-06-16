import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import { sdk } from '../../../sdk/sdk';
import { BidDto, Pageable } from '../../../shared/types/dtos';
import UserBidCard from '../components/UserBidCard';

const PAGE: Pageable = { page: 0, size: 20 };

const UserBidsPage: React.FC = () => {
  const [bids, setBids] = useState<BidDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBids = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { id: userId } = await sdk.getCurrentUserProfileDetails();
      const data = await sdk.getBidsOfUser(userId, PAGE);
      setBids(data);
    } catch (err: any) {
        console.log("Reached here");
      console.error('Error fetching user bids:', err);
      setError(err.message);
      setBids([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBids();
  }, [fetchBids]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>My Bids</Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {!loading && !error && bids.length === 0 && (
        <Typography variant="body1" mt={2}>No bids found.</Typography>
      )}
      <Grid container spacing={2} mt={2}>
        {bids.map(bid => (
          <Grid container size={{xs: 12, sm: 6, md: 4}} key={bid.id}>
            <UserBidCard bid={bid} onAction={fetchBids} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default UserBidsPage;
