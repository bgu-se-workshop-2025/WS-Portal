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
  Alert,
  Chip,
  Divider,
  useTheme,
} from "@mui/material";
import StoreIcon from "@mui/icons-material/Store";
import {
  Link,
  Outlet,
  useParams,
  useLocation,
  Navigate,
} from "react-router-dom";
import { sdk } from "../../sdk/sdk";
import { StoreDto } from "../../shared/types/dtos";

type TabValue = "products" | "sellers" | "settings" | "discounts";
const TAB_ORDER: TabValue[] = ["products", "sellers", "settings", "discounts"];

const SellerStoreLayout: React.FC = () => {
  const theme = useTheme();
  const { storeId } = useParams<{ storeId: string }>();
  const location = useLocation();

  const [store, setStore] = useState<StoreDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Determine “activeTab” from the URL.
  // E.g. if pathname is "/store/123/sellers" → activeTab = "sellers".
  // Fallback to “products” if no match.
  const activeTab: TabValue = React.useMemo(() => {
    if (!location.pathname || !storeId) return "products";

    // location.pathname might be "/store/123/products", "/store/123/sellers", etc.
    const segments = location.pathname.split("/");
    // ["", "store", "123", "sellers", …]
    const tabSegment = segments[3] as TabValue | undefined;
    return TAB_ORDER.includes(tabSegment as any)
      ? (tabSegment as TabValue)
      : "products";
  }, [location.pathname, storeId]);

  useEffect(() => {
    if (!storeId) return;

    setIsLoading(true);
    setError(null);
    sdk
      .getStore(storeId)
      .then((res) => setStore(res))
      .catch((err) => {
        console.error("Failed to fetch store:", err);
        setError(err.message || "Unknown error occurred");
        setStore(null);
      })
      .finally(() => setIsLoading(false));
  }, [storeId]);

  // If someone visits “/store/:storeId” exactly, redirect to “/store/:storeId/products”
  if (location.pathname === `/store/${storeId}`) {
    return <Navigate to={`/store/${storeId}/products`} replace />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        py: theme.spacing(4),
      }}
    >
      <Container maxWidth="lg">
        {/* ─── BREADCRUMBS ─────────────────────────────────────────────────────────── */}
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

        {/* ─── HERO / HEADER SECTION ───────────────────────────────────────────────── */}
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

          {error && (
            <Chip
              label="Error"
              color="error"
              size="small"
              sx={{
                position: "absolute",
                top: theme.spacing(1),
                right: theme.spacing(1),
              }}
            />
          )}
        </Paper>

        {/* ─── LOADING / ERROR / NO ID STATES ──────────────────────────────────────── */}
        {isLoading && (
          <Box display="flex" justifyContent="center" my={6}>
            <CircularProgress color="primary" size={48} />
          </Box>
        )}

        {!isLoading && error && (
          <Alert severity="error" sx={{ mb: theme.spacing(4) }}>
            {`Failed to load store: ${error}`}
          </Alert>
        )}

        {!storeId && !isLoading && (
          <Alert severity="warning" sx={{ mb: theme.spacing(4) }}>
            No store ID provided. Please navigate via “My Stores” first.
          </Alert>
        )}

        {/* ─── TABS + OUTLET ───────────────────────────────────────────────────────── */}
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
            {/* ─── TABS NAVIGATION ─────────────────────────────────────────────── */}
            <Tabs
              value={activeTab}
              textColor="primary"
              indicatorColor="primary"
              centered
              sx={{ mb: theme.spacing(3) }}
            >
              <Tab
                value="products"
                label="Products"
                component={Link}
                to={`/store/${storeId}/products`}
              />
              <Tab
                value="sellers"
                label="Sellers"
                component={Link}
                to={`/store/${storeId}/sellers`}
              />
              <Tab
                value="settings"
                label="Settings"
                component={Link}
                to={`/store/${storeId}/settings`}
              />
              <Tab
                value="discounts"
                label="Discounts"
                component={Link}
                to={`/store/${storeId}/discounts`}
              />
              <Tab
                value="bids"
                label="Bids"
                component={Link}
                to={`/store/${storeId}/bids`}
              />
              <Tab
                value="bidRequests"
                label="Bid Requests"
                component={Link}
                to={`/store/${storeId}/bids/requests`}
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
