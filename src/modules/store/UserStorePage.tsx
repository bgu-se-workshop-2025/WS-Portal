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
import { Link, Outlet, useParams, useLocation, Navigate } from "react-router-dom";
import { sdk } from "../../sdk/sdk";
import { StoreDto } from "../../shared/types/dtos";
import RatingComponent from "../../shared/components/RatingComponent";
import { isAuthenticated } from "../../sdk/sdk";

const UserStorePage: React.FC = () => {
  const theme   = useTheme();
  const { storeId } = useParams<{ storeId: string }>();
  const location    = useLocation();

  const [store, setStore]       = useState<StoreDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError]         = useState<string | null>(null);
  const [isSeller, setIsSeller] = useState<boolean>(false);

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

  // Redirect “/store/:storeId” → “/store/:storeId/products”
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
              to="/user/dashboard"
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
            flexDirection: "column",
          }}
        >
          <StoreIcon
            sx={{
              fontSize: { xs: 36, sm: 56 },
              mb: 1,
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
        {store && (
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            <RatingComponent
              value={typeof store.rating === "number" && store.rating > 0 ? store.rating : 0}
              readOnly={true}
              size="large"
              precision={0.1}
              key={`readonly-store-rating-${store.rating}`}
            />
          </Box>
        )}

        {/* ─── LOADING / ERROR / NO ID STATES ─────────────────────────────────────── */}
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

        {/* ─── **Only one “Products” Tab** + Outlet ───────────────────────────────── */}
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
              value="products"
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
            </Tabs>

            <Divider sx={{ mb: theme.spacing(3) }} />
            
            <Outlet />
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default UserStorePage;
