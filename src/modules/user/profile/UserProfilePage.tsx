import React from "react";
import { Box, Typography, CircularProgress, Alert, List, ListItem, ListItemText } from "@mui/material";
import { sdk } from "../../../sdk/sdk";
import { StoreDto, UserOrderDto, BidDto, BidRequestDto, PublicUserDto } from "../../../shared/types/dtos";

const PAGE_SIZE = 25;

type Props = {};

const UserProfilePage: React.FC<Props> = () => {
  const [user, setUser] = React.useState<PublicUserDto | null>(null);
  const [userLoading, setUserLoading] = React.useState(true);
  const [stores, setStores] = React.useState<StoreDto[]>([]);
  const [storesLoading, setStoresLoading] = React.useState(true);
  const [storesError, setStoresError] = React.useState<string | null>(null);

  const [orders, setOrders] = React.useState<UserOrderDto[]>([]);
  const [ordersLoading, setOrdersLoading] = React.useState(true);
  const [ordersError, setOrdersError] = React.useState<string | null>(null);

  const [bids, setBids] = React.useState<BidDto[]>([]);
  const [bidRequests, setBidRequests] = React.useState<BidRequestDto[]>([]);
  const [bidsLoading, setBidsLoading] = React.useState(true);
  const [bidsError, setBidsError] = React.useState<string | null>(null);

  React.useEffect(() => {
    document.title = "My Profile ";
  }, []);

  React.useEffect(() => {
    // Fetch user info
    setUserLoading(true);
    sdk.getCurrentUserProfileDetails()
      .then((u) => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setUserLoading(false));
  }, []);

  React.useEffect(() => {
    if (!user) return;
    // Fetch all stores and filter by seller
    setStoresLoading(true);
    setStoresError(null);
    sdk.getStores({ page: 0, size: PAGE_SIZE })
      .then(async (allStores) => {
        // For each store, check if user is a seller
        const sellerStoreIds: string[] = [];
        await Promise.all(
          allStores.map(async (store) => {
            try {
              const officials = await sdk.getStoreOfficials(store.id!);
              if (officials.some((o) => o.id === user.id)) {
                sellerStoreIds.push(store.id!);
              }
            } catch {}
          })
        );
        setStores(allStores.filter((s) => sellerStoreIds.includes(s.id!)));
      })
      .catch((err) => setStoresError(err.message))
      .finally(() => setStoresLoading(false));
  }, [user]);

  React.useEffect(() => {
    if (!user) return;
    setOrdersLoading(true);
    setOrdersError(null);
    sdk.getUserOrders({ page: 0, size: PAGE_SIZE })
      .then(setOrders)
      .catch((err) => {
        // If backend returns 404 or error message contains 'Error fetching user orders', treat as empty
        if (
          (err.message && err.message.includes('404')) ||
          (err.message && err.message.includes('Error fetching user orders'))
        ) {
          setOrders([]);
        } else {
          setOrdersError(
            typeof err === 'object' && err !== null && err.message
              ? `Orders error: ${err.message}`
              : `Orders error: ${JSON.stringify(err)}`
          );
        }
        // eslint-disable-next-line no-console
        console.error('Orders fetch error:', err);
      })
      .finally(() => setOrdersLoading(false));
  }, [user]);

  React.useEffect(() => {
    if (!user) return;
    setBidsLoading(true);
    setBidsError(null);
    Promise.all([
      sdk.getBidsOfUser({ page: 0, size: PAGE_SIZE }),
      sdk.getBidRequestsOfUser({ page: 0, size: PAGE_SIZE })
    ])
      .then(([bids, bidRequests]) => {
        setBids(bids);
        setBidRequests(bidRequests);
      })
      .catch((err) => {
        // If backend returns 404 or error message contains 'Failed to fetch', treat as empty
        if (
          (err.message && err.message.includes('404')) ||
          (err.message && err.message.includes('Failed to fetch'))
        ) {
          setBids([]);
          setBidRequests([]);
        } else {
          setBidsError(
            typeof err === 'object' && err !== null && err.message
              ? `Bids error: ${err.message}`
              : `Bids error: ${JSON.stringify(err)}`
          );
        }
        // eslint-disable-next-line no-console
        console.error('Bids fetch error:', err);
      })
      .finally(() => setBidsLoading(false));
  }, [user]);

  // Check for guest (not logged in)
  if (userLoading) {
    return (
      <Box mt={8} textAlign="center">
        <CircularProgress />
      </Box>
    );
  }
  if (user === null) {
    return (
      <Box mt={8} textAlign="center">
        <Alert severity="warning" sx={{ maxWidth: 500, margin: '0 auto' }}>
          You must be logged in to view your profile. Please <a href="/login">log in</a> or <a href="/register">register</a> to access your dashboard.
        </Alert>
      </Box>
    );
  }

  return (
    <Box maxWidth={800} mx="auto" mt={6}>
      <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 700, letterSpacing: 1 }}>
        My Profile
      </Typography>
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
        {/* My Stores */}
        <Box flex={1} p={3} borderRadius={3} boxShadow={3} bgcolor="#f8fafc">
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            My Stores
          </Typography>
          {storesLoading ? (
            <Box display="flex" justifyContent="center" py={2}><CircularProgress size={28} /></Box>
          ) : storesError ? (
            <Alert severity="error">{storesError}</Alert>
          ) : stores.length === 0 ? (
            <Typography color="text.secondary">You are not a seller in any stores yet.</Typography>
          ) : (
            <List>
              {stores.map((store) => (
                <ListItem
                  key={store.id}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    bgcolor: '#fff',
                    boxShadow: 1,
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    '&:hover': {
                      bgcolor: '#e3e8ef',
                      textDecoration: 'underline',
                    },
                  }}
                  onClick={() => window.location.href = `/store/${store.id}`}
                >
                  <ListItemText
                    primary={<Typography variant="subtitle1" sx={{ fontWeight: 500 }}>{store.name}</Typography>}
                    secondary={store.description}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
        {/* Purchase History */}
        <Box flex={1} p={3} borderRadius={3} boxShadow={3} bgcolor="#f8fafc">
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            Purchase History
          </Typography>
          {ordersLoading ? (
            <Box display="flex" justifyContent="center" py={2}><CircularProgress size={28} /></Box>
          ) : ordersError ? (
            <Alert severity="error">{ordersError}</Alert>
          ) : orders.length === 0 ? (
            <Typography color="text.secondary">No purchases found.</Typography>
          ) : (
            <List>
              {orders.map((order) => (
                <ListItem key={order.id} sx={{ borderRadius: 2, mb: 1, bgcolor: '#fff', boxShadow: 1 }}>
                  <ListItemText
                    primary={<Typography variant="subtitle1" sx={{ fontWeight: 500 }}>{`Order #${order.id}`}</Typography>}
                    secondary={<>
                      <Typography component="span" color="text.secondary">Date: {order.time}</Typography>
                    </>}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Box>
      {/* Active Bids */}
      <Box mt={4} mb={4} p={3} borderRadius={3} boxShadow={3} bgcolor="#f8fafc">
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          Active Bids
        </Typography>
        {bidsLoading ? (
          <Box display="flex" justifyContent="center" py={2}><CircularProgress size={28} /></Box>
        ) : bidsError ? (
          <Alert severity="error">{bidsError}</Alert>
        ) : bids.length === 0 && bidRequests.length === 0 ? (
          <Typography color="text.secondary">No active bids found.</Typography>
        ) : (
          <Box>
            {bids.length > 0 && (
              <>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, mt: 1 }}>Bids</Typography>
                <List>
                  {bids.map((bid) => (
                    <ListItem key={bid.id} sx={{ borderRadius: 2, mb: 1, bgcolor: '#fff', boxShadow: 1 }}>
                      <ListItemText
                        primary={<Typography variant="subtitle2">{`Bid #${bid.id} - Product: ${bid.productId}`}</Typography>}
                        secondary={<>
                          <Typography component="span" color="text.secondary">Price: ${bid.price}</Typography>
                        </>}
                      />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
            {bidRequests.length > 0 && (
              <>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, mt: 2 }}>Bid Requests</Typography>
                <List>
                  {bidRequests.map((req) => (
                    <ListItem key={req.storeId + '-' + req.productId} sx={{ borderRadius: 2, mb: 1, bgcolor: '#fff', boxShadow: 1 }}>
                      <ListItemText
                        primary={<Typography variant="subtitle2">{`Bid Request - Product: ${req.productId}`}</Typography>}
                        secondary={<>
                          <Typography component="span" color="text.secondary">Price: ${req.price} | Status: {req.bidRequestStatus}</Typography>
                        </>}
                      />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default UserProfilePage;
