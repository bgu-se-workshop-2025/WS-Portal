import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Divider,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  useParams,
  useLocation,
  Link,
  Navigate,
  Outlet,
} from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import MuiLink from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import StoreIcon from "@mui/icons-material/Store";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import RatingComponent from "../../shared/components/RatingComponent";
import { sdk } from "../../sdk/sdk";
import { TokenService } from "../../shared/utils/token";

import { StoreDto } from "../../shared/types/dtos";

type TabValue = "products" | "sellers" | "settings" | "discounts" | "transactions";
const TAB_ORDER: TabValue[] = ["products", "sellers", "settings", "discounts", "transactions"];

const SellerStoreLayout: React.FC = () => {
  const theme = useTheme();
  const location = useLocation();
  const { storeId: id } = useParams<{ storeId: string }>();

  const [store, setStore] = useState<StoreDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Rating dialog states
  const [rateDialogOpen, setRateDialogOpen] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [rateError, setRateError] = useState<string>("");
  const [isSeller, setIsSeller] = useState(false);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    sdk
      .getStore(id)
      .then((result) => {
        setStore(result);
        setIsLoading(false);
        // Check if current user is a seller of this store
        // You might need to implement this check based on your authentication system
        // For now, setting to false as a placeholder
        setIsSeller(false);
      })
      .catch((err) => {
        console.error("Failed to fetch store:", err.message || err);
        setError(err.message || "Unknown error occurred");
        setStore(null);
        setIsLoading(false);
      });
  }, [id]);

  const computedActiveTab: TabValue = React.useMemo(() => {
    if (!location.pathname || !id) return "products";

    const segments = location.pathname.split("/");
    const tabSegment = segments[3];
    return tabSegment && TAB_ORDER.includes(tabSegment as TabValue)
      ? (tabSegment as TabValue)
      : "products";
  }, [location.pathname, id]);

  if (location.pathname === `/store/${id}`) {
    return <Navigate to={`/store/${id}/products`} replace />;
  }

  const handleRateStore = async () => {
    if (!id || userRating == null) return;
    setRateError("");
    try {
      await sdk.createStoreReview({
        id: undefined, // let backend generate
        productId: undefined, // not a product review
        storeId: id ?? undefined,
        writerId: undefined, // let backend use current user
        title: undefined,
        body: undefined,
        rating: Math.round(userRating),
        date: undefined,
      });
      // Refresh store info after rating
      const updatedStore = await sdk.getStore(id);
      setStore(updatedStore);
      setRateDialogOpen(false);
      setUserRating(null);
      alert("Thank you for rating the store!");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "You must purchase from this store before rating.";
      setRateError(errorMessage);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        py: theme.spacing(4),
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: theme.spacing(2) }}>
          <Breadcrumbs aria-label="breadcrumb">
            <MuiLink underline="hover" color="inherit" component={Link} to="/">
              Home
            </MuiLink>
            <MuiLink
              underline="hover"
              color="inherit"
              component={Link}
              to="/seller/dashboard"
            >
              My Stores
            </MuiLink>
            <Typography color="text.primary">
              {isLoading ? "Loading…" : store?.name || "Store Not Found"}
            </Typography>
          </Breadcrumbs>
        </Box>

        <Paper
          elevation={0}
          sx={{
            position: "relative",
            height: { xs: 120, sm: 160 },
            bgcolor: "transparent",
            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
            borderRadius: 2,
            mb: theme.spacing(4),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "common.white",
          }}
        >
          <StoreIcon
            sx={{
              fontSize: { xs: 36, sm: 56 },
              mr: theme.spacing(1),
            }}
          />
          <Typography variant="h3" component="h1" sx={{ fontWeight: 600 }}>
            {isLoading ? "Loading Store…" : store?.name || "Store Not Found"}
          </Typography>
        </Paper>

        {store && (
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            <RatingComponent
              value={typeof store.rating === "number" && store.rating > 0 ? store.rating : 0}
              readOnly={true}
              size="large"
              precision={1}
              onChange={async (newValue) => {
                if (isSeller || !TokenService.isAuthenticated) return;
                if (!id) return;
                try {
                  await sdk.createStoreReview({
                    id: undefined, // let backend generate
                    productId: undefined,
                    storeId: id ?? undefined,
                    writerId: undefined,
                    title: undefined,
                    body: undefined,
                    rating: Math.round(newValue),
                    date: undefined,
                  });
                  // Refresh store info after rating
                  const updatedStore = await sdk.getStore(id);
                  setStore(updatedStore);
                  alert("Thank you for rating the store!");
                                 } catch (err: unknown) {
                   const errorMessage = err instanceof Error ? err.message : "You must purchase from this store before you can rate it.";
                   alert(errorMessage);
                 }
              }}
            />
            <Typography variant="h6" mt={1}>
              {(store.rating ?? 0) > 0 ? `(${store.rating!.toFixed(1)})` : ""}
            </Typography>
          </Box>
        )}

        <Dialog open={rateDialogOpen} onClose={() => setRateDialogOpen(false)}>
          <DialogTitle>Rate This Store</DialogTitle>
          <DialogContent>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={2}
            >
              <RatingComponent
                value={userRating ?? 0}
                onChange={setUserRating}
                size="large"
              />
              {rateError && <Typography color="error">{rateError}</Typography>}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRateDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleRateStore}
              disabled={userRating == null}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        {error && (
          <Chip
            label={error}
            color="error"
            size="small"
            sx={{
              position: "absolute",
              top: theme.spacing(1),
              right: theme.spacing(1),
            }}
          />
        )}

        {isLoading && (
          <Box display="flex" justifyContent="center" my={6}>
            <CircularProgress color="primary" size={48} />
          </Box>
        )}

        {!isLoading && error && (
                      <Alert severity="error" sx={{ mb: theme.spacing(4) }}>
              Failed to load store: {error}
            </Alert>
        )}

        {!id && !isLoading && (
                      <Alert severity="warning" sx={{ mb: theme.spacing(4) }}>
              No store ID provided. Please navigate via &quot;My Stores&quot; first.
            </Alert>
        )}

        {!isLoading && !error && store && (
          <Paper
            elevation={3}
            sx={{
              p: theme.spacing(4),
              borderRadius: 2,
              bgcolor: theme.palette.background.paper,
              boxShadow: theme.shadows[2],
            }}
          >
            <Tabs
              value={computedActiveTab}
              textColor="primary"
              indicatorColor="primary"
              centered
              sx={{ mb: theme.spacing(3) }}
            >
              <Tab
                value="products"
                label="Products"
                component={Link}
                to={`/store/${id}/products`}
              />
              <Tab
                value="discounts"
                label="Discounts"
                component={Link}
                to={`/store/${id}/discounts`}
              />
              <Tab
                value="sellers"
                label="Sellers"
                component={Link}
                to={`/store/${id}/sellers`}
              />
              <Tab
                value="settings"
                label="Settings"
                component={Link}
                to={`/store/${id}/settings`}
              />
              <Tab
                value="discounts"
                label="Discounts"
                component={Link}
                to={`/store/${id}/discounts`}
              />
              <Tab
                value="transactions"
                label="Transactions"
                component={Link}
                to={`/store/${id}/transactions`}
              />

            </Tabs>
            <Divider sx={{ mb: theme.spacing(3) }} />
            <Outlet />
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default SellerStoreLayout;
