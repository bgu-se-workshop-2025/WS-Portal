// BidPage.tsx
// TODO - check this page and fix it if needed
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import { sdk } from '../../sdk/sdk';
import { BidDto, Pageable } from '../../shared/types/dtos';
import BidCard from './BidCard';

interface BidPageProps {
  mode: 'user' | 'store'; // TODO - need to change to what Noam did
}

const BidPage: React.FC<BidPageProps> = ({ mode }) => {
  const { id } = useParams(); // userId or productId
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bids, setBids] = useState<BidDto[]>([]);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        setLoading(true);
        setError(null);

        const pageable: Pageable = { page: 0, size: 20 };

        const data =
          mode === 'user'
            ? await sdk.getBidsOfUser(pageable)
            : await sdk.getBidsOfProduct(id!, pageable); // TODO - need getBidsOfStore

        setBids(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load bids.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBids();
    }
  }, [id, mode]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {mode === 'user' ? 'My Bids' : 'Store Bids'}
      </Typography>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={2} mt={2}>
        {bids.map((bid) => (
          <Grid container size = {{xs: 12, sm: 6, md: 4}} key={bid.id}>
            <BidCard bid={bid} mode={mode} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BidPage;
