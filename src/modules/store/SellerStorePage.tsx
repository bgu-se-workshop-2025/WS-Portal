import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Breadcrumbs,
  Link as MuiLink,
  Tabs,
  Tab,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
} from "@mui/material";
import StoreIcon from "@mui/icons-material/Store";
import { Link, Outlet, useParams, useLocation, useNavigate } from "react-router-dom";
import { sdk } from "../../sdk/sdk";
import { StoreDto } from "../../shared/types/dtos";
import RatingComponent from "../../shared/components/RatingComponent";
import { isAuthenticated } from "../../sdk/sdk";
import ErrorDisplay from "../../shared/components/ErrorDisplay";
import { useErrorHandler } from "../../shared/hooks/useErrorHandler";
import { ErrorContext } from "../../shared/types/errors";

type TabValue = "products" | "sellers" | "settings" | "discounts";

const TAB_ORDER: TabValue[] = ["products", "sellers", "settings", "discounts"];

const SellerStoreLayout: React.FC = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { storeId: id } = useParams<{ storeId: string }>();

  const [store, setStore] = useState<StoreDto | null>(null);
  const [rateDialogOpen, setRateDialogOpen] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSeller, setIsSeller] = useState<boolean | null>(null);

  const { error, setError, clearError, withErrorHandling } = useErrorHandler();

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    clearError();
    
    const context: ErrorContext = {
      component: 'StoreModule',
      action: 'fetchStore',
      additionalInfo: { storeId: id }
    };

    withErrorHandling(async () => {
      const result = await sdk.getStore(id);
      setStore(result);
      setIsLoading(false);
    }, context);
    
    // Check if user is a seller for this store
    const checkSeller = async () => {
      if (!id || isAuthenticated() === false) {
        setIsSeller(false);
        return;
      }
      try {
        const me = await sdk.getCurrentUserProfileDetails();
        const mySeller = await sdk.getSeller(id, me.id);
        setIsSeller(!!mySeller);
      } catch (err) {
        setIsSeller(false);
      }
    };
    checkSeller();
  }, [id]);

  const handleRateStore = async () => {
    if (isSeller || !isAuthenticated() || !id || userRating === null) return;

    const context: ErrorContext = {
      component: 'StoreModule',
      action: 'rateStore',
      additionalInfo: { storeId: id, rating: userRating }
    };

    await withErrorHandling(async () => {
      await sdk.createStoreReview({
        id: null, // let backend generate
        productId: null,
        storeId: id ?? null,
        writerId: null,
        title: "",
        body: "",
        rating: Math.round(userRating),
        date: null,
      });
      
      // Refresh store info after rating
      const updatedStore = await sdk.getStore(id);
      setStore(updatedStore);
      setRateDialogOpen(false);
      setUserRating(null);
    }, context);
  };

  const getCurrentTab = (): TabValue => {
    const path = location.pathname;
    if (path.includes("/products")) return "products";
    if (path.includes("/sellers")) return "sellers";
    if (path.includes("/settings")) return "settings";
    if (path.includes("/discounts")) return "discounts";
    return "products";
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: TabValue) => {
    const currentTab = getCurrentTab();
    if (currentTab !== newValue) {
      navigate(`/store/${id}/${newValue}`);
    }
  };

  if (!id) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <ErrorDisplay
          error="No store ID provided. Please navigate via 'My Stores' first."
          variant="alert"
          severity="warning"
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* ─── BREADCRUMBS ────────────────────────────────────────────────────────────── */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <MuiLink component={Link} to="/stores" color="inherit">
          My Stores
        </MuiLink>
        <Typography color="text.primary">{store?.name || "Loading..."}</Typography>
      </Breadcrumbs>

      {/* ─── STORE HEADER ───────────────────────────────────────────────────────────── */}
      {store && (
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <RatingComponent
            value={store.rating}
            readOnly={isSeller || !isAuthenticated()}
            size="large"
            precision={1}
            onChange={async (newValue) => {
              if (isSeller || !isAuthenticated()) return;
              if (!id) return;
              try {
                await sdk.createStoreReview({
                  id: null, // let backend generate
                  productId: null,
                  storeId: id ?? null,
                  writerId: null,
                  title: "",
                  body: "",
                  rating: Math.round(newValue),
                  date: null,
                });
                // Refresh store info after rating
                const updatedStore = await sdk.getStore(id);
                setStore(updatedStore);
                alert("Thank you for rating the store!");
              } catch (err: any) {
                alert("You must purchase from this store before you can rate it.");
              }
            }}
          />
          <Typography variant="h6" mt={1}>
            {store.rating > 0 ? `(${store.rating.toFixed(1)})` : ""}
          </Typography>
        </Box>
      )}

      {/* ─── RATE STORE DIALOG ─────────────────────────────────────────────────────── */}
      <Dialog open={rateDialogOpen} onClose={() => setRateDialogOpen(false)}>
        <DialogTitle>Rate This Store</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <RatingComponent value={userRating ?? 0} onChange={setUserRating} size="large" />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleRateStore} disabled={userRating == null}>Submit</Button>
        </DialogActions>
      </Dialog>

      {/* ─── ERROR DISPLAY ─────────────────────────────────────────────────────────── */}
      {error && (
        <ErrorDisplay
          error={error}
          variant="alert"
          onClose={clearError}
          showRetry={true}
          onRetry={() => {
            if (id) {
              setIsLoading(true);
              clearError();
              const context: ErrorContext = {
                component: 'StoreModule',
                action: 'fetchStore',
                additionalInfo: { storeId: id }
              };
              withErrorHandling(async () => {
                const result = await sdk.getStore(id);
                setStore(result);
                setIsLoading(false);
              }, context);
            }
          }}
        />
      )}

      {/* ─── LOADING STATE ─────────────────────────────────────────────────────────── */}
      {isLoading && (
        <Box display="flex" justifyContent="center" my={6}>
          <CircularProgress color="primary" size={48} />
        </Box>
      )}

      {/* ─── STORE CONTENT ─────────────────────────────────────────────────────────── */}
      {!isLoading && !error && store && (
        <>
          {/* ─── TABS ─────────────────────────────────────────────────────────────── */}
          <Paper sx={{ mb: 3 }}>
            <Tabs
              value={getCurrentTab()}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                "& .MuiTab-root": {
                  minHeight: 64,
                  fontSize: "1rem",
                  fontWeight: 500,
                },
              }}
            >
              <Tab
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <StoreIcon />
                    Products
                  </Box>
                }
                value="products"
              />
              <Tab label="Sellers" value="sellers" />
              <Tab label="Settings" value="settings" />
              <Tab label="Discounts" value="discounts" />
            </Tabs>
          </Paper>

          {/* ─── TAB CONTENT ───────────────────────────────────────────────────────── */}
          <Outlet />
        </>
      )}
    </Container>
  );
};

export default SellerStoreLayout;
