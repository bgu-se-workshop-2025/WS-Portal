import React from "react";
import { Box, Typography, CircularProgress, Alert, List, ListItem, ListItemText, Button, Stack } from "@mui/material";
import { sdk } from "../../../sdk/sdk";
import { StoreDto, UserOrderDto, PublicUserDto } from "../../../shared/types/dtos";
import { AppError, ErrorType } from "../../../shared/types/errors";
import { ErrorHandler } from "../../../shared/utils/errorHandler";

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
        // For each store, check if user is a seller using getSeller method
        const sellerStoreIds: string[] = [];
        await Promise.all(
          allStores.map(async (store) => {
            try {
              const seller = await sdk.getSeller(store.id!, user.id);
              if (seller) {
                sellerStoreIds.push(store.id!);
              }
            } catch {
              // User is not a seller in this store, which is expected
            }
          })
        );
        setStores(allStores.filter((s) => sellerStoreIds.includes(s.id!)));
      })
      .catch(async (err) => {
        const appError = await ErrorHandler.processError(err, { action: 'getStores' });
        setStoresError(ErrorHandler.getUserFriendlyMessage(appError));
      })
      .finally(() => setStoresLoading(false));
  }, [user]);

  React.useEffect(() => {
    if (!user) return;
    setOrdersLoading(true);
    setOrdersError(null);
    sdk.getUserOrders({ page: 0, size: PAGE_SIZE })
      .then(setOrders)
      .catch(async (err) => {
        const appError = await ErrorHandler.processError(err, { action: 'getUserOrders' });
        
        // If it's a "no orders found" error, treat it as a normal state
        if (appError.type === ErrorType.NO_ORDERS_FOUND) {
          setOrders([]);
          setOrdersError(null);
        } else {
          setOrdersError(ErrorHandler.getUserFriendlyMessage(appError));
          console.error('Orders fetch error:', appError);
        }
      })
      .finally(() => setOrdersLoading(false));
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
      {/* Active Bids (replaced with buttons) */}
      <Box mt={4} mb={4} p={3} borderRadius={3} boxShadow={3} bgcolor="#f8fafc">
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          Bids
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={2}>
          <Button
            variant="contained"
            color="primary"
            sx={{ minWidth: 180 }}
            href="#BID_REQUESTS_PAGE_URL" // TODO: Replace with actual Bid Requests page URL
          >
            View Bid Requests
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={{ minWidth: 180 }}
            href="#APPROVED_BIDS_PAGE_URL" // TODO: Replace with actual Approved Bids page URL
          >
            View Approved Bids
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default UserProfilePage;
