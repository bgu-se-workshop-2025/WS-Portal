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
  useTheme,
  Alert,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import StoreIcon from "@mui/icons-material/Store";
import { Link, Outlet, useParams, useLocation } from "react-router-dom";
import { sdk } from "../../sdk/sdk";
import { StoreDto, ProductDto, SellerDto } from "../../shared/types/dtos";
import RatingComponent from "../../shared/components/RatingComponent";
import { isAuthenticated } from "../../sdk/sdk";
import ErrorDisplay from "../../shared/components/ErrorDisplay";
import { useErrorHandler } from "../../shared/hooks/useErrorHandler";
import { withErrorHandling } from "../../shared/utils/errorHandler";
import { ErrorHandler } from "../../shared/utils/errorHandler";
import { ErrorContext } from "../../shared/types/errors";

const UserStorePage: React.FC = () => {
  const theme = useTheme();
  const { storeId } = useParams<{ storeId: string }>();
  const location = useLocation();

  const [store, setStore] = useState<StoreDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSeller, setIsSeller] = useState<boolean>(false);

  const { error, setError, clearError } = useErrorHandler();

  useEffect(() => {
    if (!storeId) return;
    setIsLoading(true);
    clearError();

    const context: ErrorContext = {
      component: 'StoreModule',
      action: 'fetchStore',
      additionalInfo: { storeId }
    };

    withErrorHandling(async () => {
      const res = await sdk.getStore(storeId);
      setStore(res);
      setIsLoading(false);
    }, context, (error) => {
      setError(error);
      setIsLoading(false);
    });

    // Check if user is a seller for this store
    const checkSeller = async () => {
      if (!storeId || isAuthenticated() === false) {
        setIsSeller(false);
        return;
      }
      try {
        const me = await sdk.getCurrentUserProfileDetails();
        const mySeller = await sdk.getSeller(storeId, me.id);
        setIsSeller(!!mySeller);
      } catch {
        setIsSeller(false);
      }
    };
    checkSeller();
  }, [storeId]);

  const getCurrentTab = (): string => {
    const path = location.pathname;
    if (path.includes("/products")) return "products";
    if (path.includes("/reviews")) return "reviews";
    return "products";
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    const currentTab = getCurrentTab();
    if (currentTab !== newValue) {
      window.location.href = `/store/${storeId}/${newValue}`;
    }
  };

  if (!storeId) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <ErrorDisplay
          error="No store ID provided. Please navigate via 'Stores' first."
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
          Stores
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
              if (!storeId) return;
              try {
                await sdk.createStoreReview({
                  id: null,
                  productId: null,
                  storeId: storeId ?? null,
                  writerId: null,
                  title: "",
                  body: "",
                  rating: Math.round(newValue),
                  date: null,
                });
                // Refresh store info after rating
                const updatedStore = await sdk.getStore(storeId);
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

      {/* ─── ERROR DISPLAY ─────────────────────────────────────────────────────────── */}
      {error && (
        <ErrorDisplay
          error={error}
          variant="alert"
          onClose={clearError}
          showRetry={true}
          onRetry={() => {
            if (storeId) {
              setIsLoading(true);
              clearError();
              const context: ErrorContext = {
                component: 'StoreModule',
                action: 'fetchStore',
                additionalInfo: { storeId }
              };
              withErrorHandling(async () => {
                const result = await sdk.getStore(storeId);
                setStore(result);
                setIsLoading(false);
              }, context, (error) => {
                setError(error);
                setIsLoading(false);
              });
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
              <Tab label="Reviews" value="reviews" />
            </Tabs>
          </Paper>

          {/* ─── TAB CONTENT ───────────────────────────────────────────────────────── */}
          <Outlet />
        </>
      )}
    </Container>
  );
};

export default UserStorePage;
