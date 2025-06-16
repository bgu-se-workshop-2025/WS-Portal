// import React, { useEffect, useState } from 'react';
// import {
//   Container,
//   Typography,
//   CircularProgress,
//   Alert,
//   Grid,
// } from '@mui/material';
// import { Pageable } from '../../shared/types/dtos';
// import BidRequestCard from './BidRequestCard';
// import { useParams } from 'react-router-dom';
// import useBid from "./hooks/useBid";
// import { sdk } from "./../../sdk/sdk";

// interface BidRequestPageProps {
//   mode: 'user' | 'store';
// }

// const BidRequestPage: React.FC<BidRequestPageProps> = ({ mode }) => {
//   const { storeId } = useParams<{ storeId: string }>();
//   const {
//     getBidRequestsOfUser,
//     getBidRequestsOfStore,
//     loading,
//     error,
//     requests,
//   } = useBid();

//   const [page] = useState(0);
//   const [size] = useState(20);

//   useEffect(() => {
//     const fetch = async () => {
//       const pageable: Pageable = { page, size };
//       try {
//         if (mode === 'user') {
//           const user = await sdk.getCurrentUserProfileDetails();
//           await getBidRequestsOfUser(user.id, pageable);
//         } else if (mode === 'store') {
//           if (!storeId) return;
//           await getBidRequestsOfStore(storeId, pageable);
//         }
//       } catch (err: any) {
//         console.error('Fetch error:', err);
//       }
//     };

//     fetch();
//   // Only run when mode or storeId changes
//   }, [mode, storeId]);

//   return (
//     <Container sx={{ mt: 4 }}>
//       <Typography variant="h4" gutterBottom>
//         {mode === 'user' ? 'My Bid Requests' : 'Store Bid Requests'}
//       </Typography>

//       {loading && <CircularProgress />}
//       {error && <Alert severity="error">{error}</Alert>}

//       {!loading && !error && requests.length === 0 && (
//         <Typography variant="body1" mt={2}>
//           No bid requests found.
//         </Typography>
//       )}

//       <Grid container spacing={2} mt={2}>
//         {requests.map(request => (
//           <Grid container size={{xs: 12, sm: 6, md:4}} key={request.bidRequestId}>
//             <BidRequestCard
//               bidRequest={request}
//               mode={mode}
//               onAction={async () => {
//                 // refetch after an action
//                 if (mode === 'user') {
//                   const userId = await sdk.getCurrentUserProfileDetails().then(u => u.id);
//                   getBidRequestsOfUser(userId, { page, size });
//                 }
//                 else if (storeId) getBidRequestsOfStore(storeId, { page, size });
//               }}
//             />
//           </Grid>
//         ))}
//       </Grid>
//     </Container>
//   );
// };

// export default BidRequestPage;


import React, { useEffect, useState, useCallback } from 'react';
import {
  Container, Typography, CircularProgress,
  Alert, Grid,
} from '@mui/material';
import { Pageable, BidRequestDto } from '../../shared/types/dtos';
import BidRequestCard from './BidRequestCard';
import { useParams } from 'react-router-dom';
import { sdk } from '../../sdk/sdk';

interface BidRequestPageProps {
  mode: 'user' | 'store';
}

const PAGE = 0;
const SIZE = 20;

const BidRequestPage: React.FC<BidRequestPageProps> = ({ mode }) => {
  const { storeId } = useParams<{ storeId: string }>();

  const [requests, setRequests] = useState<BidRequestDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      const pageable: Pageable = { page: PAGE, size: SIZE };
      let data: BidRequestDto[];
      if (mode === 'user') {
        const userId = (await sdk.getCurrentUserProfileDetails()).id;
        data = await sdk.getBidRequestsOfUser(userId, pageable);
      } else {
        if (!storeId) throw new Error('Missing storeId');
        data = await sdk.getBidRequestsOfStore(storeId, pageable);
      }
      setRequests(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [mode, storeId]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">
        {mode === 'user' ? 'My Bid Requests' : 'Store Bid Requests'}
      </Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && requests.length === 0 && (
        <Typography>No bid requests found.</Typography>
      )}
      <Grid container spacing={2} mt={2}>
        {requests.map((req) => (
          <Grid container size={{xs: 12, sm: 6, md: 4}} key={`${req.bidRequestId}-${req.price}-${req.requestStatus}`}>
            <BidRequestCard
              bidRequest={req}
              mode={mode}
              onChanged={fetchRequests}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BidRequestPage;

