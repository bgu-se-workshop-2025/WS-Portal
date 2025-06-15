import React from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Button,
  Stack,
} from "@mui/material";
import { sdk } from "../../../sdk/sdk";
import {
  StoreDto,
  UserOrderDto,
  PublicUserDto,
} from "../../../shared/types/dtos";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

  React.useEffect(() => {
    document.title = "My Profile ";
  }, []);

  React.useEffect(() => {
    setUserLoading(true);
    sdk
      .getCurrentUserProfileDetails()
      .then((u) => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setUserLoading(false));
  }, []);

  React.useEffect(() => {
    if (!user) return;
    setStoresLoading(true);
    setStoresError(null);
    sdk
      .getStores({ page: 0, size: PAGE_SIZE })
      .then(async (allStores) => {
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
    sdk
      .getUserOrders({ page: 0, size: PAGE_SIZE })
      .then(setOrders)
      .catch((err) => {
        if (
          (err.message && err.message.includes("404")) ||
          (err.message &&
            err.message.includes("Error fetching user orders"))
        ) {
          setOrders([]);
        } else {
          setOrdersError(
            typeof err === "object" && err !== null && err.message
              ? `Orders error: ${err.message}`
              : `Orders error: ${JSON.stringify(err)}`
          );
        }
        console.error("Orders fetch error:", err);
      })
      .finally(() => setOrdersLoading(false));
  }, [user]);

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
        <Alert severity="warning" sx={{ maxWidth: 500, margin: "0 auto" }}>
          You must be logged in to view your profile. Please{" "}
          <a href="/login">log in</a> or <a href="/register">register</a> to
          access your dashboard.
        </Alert>
      </Box>
    );
  }

  return (
    <Box maxWidth={800} mx="auto" mt={6}>
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        sx={{ fontWeight: 700, letterSpacing: 1 }}
      >
        My Profile
      </Typography>
      <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={4}>
        {/* My Stores */}
        <Box
          flex={1}
          p={3}
          borderRadius={3}
          boxShadow={3}
          bgcolor="#f8fafc"
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            My Stores
          </Typography>
          {storesLoading ? (
            <Box display="flex" justifyContent="center" py={2}>
              <CircularProgress size={28} />
            </Box>
          ) : storesError ? (
            <Alert severity="error">{storesError}</Alert>
          ) : stores.length === 0 ? (
            <Typography color="text.secondary">
              You are not a seller in any stores yet.
            </Typography>
          ) : (
            <List>
              {stores.map((store) => (
                <ListItem
                  key={store.id}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    bgcolor: "#fff",
                    boxShadow: 1,
                    cursor: "pointer",
                    transition: "background 0.2s",
                    "&:hover": {
                      bgcolor: "#e3e8ef",
                      textDecoration: "underline",
                    },
                  }}
                  onClick={() => (window.location.href = `/store/${store.id}`)}
                >
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 500 }}
                      >
                        {store.name}
                      </Typography>
                    }
                    secondary={store.description}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
        {/* Purchase History */}
        <Box
          flex={1}
          p={3}
          borderRadius={3}
          boxShadow={3}
          bgcolor="#f8fafc"
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            Purchase History
          </Typography>
          {ordersLoading ? (
            <Box display="flex" justifyContent="center" py={2}>
              <CircularProgress size={28} />
            </Box>
          ) : ordersError ? (
            <Alert severity="error">{ordersError}</Alert>
          ) : orders.length === 0 ? (
            <Typography color="text.secondary">No purchases found.</Typography>
          ) : (
            <List>
              {orders.map((order) => (
                <ListItem
                  key={order.id}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    bgcolor: "#fff",
                    boxShadow: 1,
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 500 }}
                      >
                        {`Order #${order.id}`}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography component="span" color="text.secondary">
                          Date: {order.time}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Box>

      {/* Bid Buttons */}
      <Box mt={4} mb={4} p={3} borderRadius={3} boxShadow={3} bgcolor="#f8fafc">
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          Bid
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={2}>
          <Button
            variant="contained"
            color="primary"
            sx={{ minWidth: 180 }}
            onClick={() => navigate("/profile/bids/requests")}
          >
            View Bid Requests
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={{ minWidth: 180 }}
            onClick={() => navigate("/profile/bids")}
          >
            View Approved Bids
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default UserProfilePage;
