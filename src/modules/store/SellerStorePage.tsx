import React, { useState, useEffect } from "react";
import { Box, Typography, Container, Tabs, Tab, Divider, Alert } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useParams, useLocation, Link, Navigate, Outlet } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import MuiLink from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import StoreIcon from "@mui/icons-material/Store";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import RatingComponent from "../../shared/components/RatingComponent";
import { sdk } from "../../sdk/sdk";

import { StoreDto } from "../../shared/types/dtos";

type TabValue = "products" | "sellers" | "settings" | "discounts";
const TAB_ORDER: TabValue[] = ["products", "sellers", "settings", "discounts"];

const SellerStoreLayout: React.FC = () => {
  const theme = useTheme();
  const location = useLocation();
  const { storeId: id } = useParams<{ storeId: string }>();

  const [store, setStore] = useState<StoreDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    sdk.getStore(id)
      .then((result) => {
        setStore(result);
        setIsLoading(false);
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
    const tabSegment = segments[3] as TabValue | undefined;
    return TAB_ORDER.includes(tabSegment as any)
      ? (tabSegment as TabValue)
      : "products";
  }, [location.pathname, id]);

  if (location.pathname === `/store/${id}`) {
    return <Navigate to={`/store/${id}/products`} replace />;
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
              precision={0.1}
              key={`readonly-store-rating-${store.rating}`}
            />
          </Box>
        )}

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
            {`Failed to load store: ${error}`}
          </Alert>
        )}

        {!id && !isLoading && (
          <Alert severity="warning" sx={{ mb: theme.spacing(4) }}>
            No store ID provided. Please navigate via “My Stores” first.
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
