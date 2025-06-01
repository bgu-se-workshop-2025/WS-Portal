import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Container,
  Breadcrumbs,
  Link,
  Tabs,
  Tab,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  useTheme,
  Card,
  CardContent,
  Grid,
  Grow,
} from "@mui/material";
import StoreIcon from "@mui/icons-material/Store";

import StoreProducts from "../store/components/subpages/StoreProducts";
import StoreSellers from "../store/components/subpages/StoreSellers";
import StoreSettings from "../store/components/subpages/StoreSettings";
import StoreDiscounts from "../store/components/subpages/StoreDiscounts";

import { StoreDto } from "../../shared/types/dtos";
import { sdk } from "../../sdk/sdk";

type Tab = "products" | "sellers" | "settings" | "discounts";
const DEFAULT_TAB: Tab = "products";

const SellerStorePage: React.FC<{ id?: string }> = ({ id }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>(DEFAULT_TAB);
  const [store, setStore] = useState<StoreDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleTabChange = useCallback(
    (_: React.SyntheticEvent, newTab: Tab) => {
      setActiveTab(newTab);
    },
    []
  );

  useEffect(() => {
    if (!id) {
      setStore(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    sdk
      .getStore(id)
      .then((result) => {
        setStore(result);
      })
      .catch((err) => {
        console.error("Failed to fetch store:", err);
        setError(err.message || "Unknown error occurred");
        setStore(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

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
            <Link underline="hover" color="inherit" href="/">
              Home
            </Link>
            <Link
              underline="hover"
              color="inherit"
              href="/seller/dashboard"
            >
              My Stores
            </Link>
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
          <Typography
            variant="h3"
            component="h1"
            sx={{ fontWeight: 600 }}
          >
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

        {/* ─── LOADING STATE ────────────────────────────────────────────────────────── */}
        {isLoading && (
          <Box display="flex" justifyContent="center" my={6}>
            <CircularProgress color="primary" size={48} />
          </Box>
        )}

        {/* ─── ERROR STATE (ID PROVIDED BUT FETCH FAILED) ───────────────────────────── */}
        {!isLoading && error && (
          <Alert severity="error" sx={{ mb: theme.spacing(4) }}>
            {`Failed to load store: ${error}`}
          </Alert>
        )}

        {/* ─── NO ID SUPPLIED ───────────────────────────────────────────────────────── */}
        {!id && !isLoading && (
          <Alert severity="warning" sx={{ mb: theme.spacing(4) }}>
            No store ID provided. Please navigate via “My Stores” first.
          </Alert>
        )}

        {/* ─── MAIN CONTENT ──────────────────────────────────────────────────────────── */}
        {!isLoading && !error && store && (
          <Grow in timeout={400}>
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
                onChange={handleTabChange}
                centered
                textColor="primary"
                indicatorColor="primary"
                sx={{ mb: theme.spacing(3) }}
              >
                <Tab value="products" label="Products" />
                <Tab value="sellers" label="Sellers" />
                <Tab value="settings" label="Settings" />
                <Tab value="discounts" label="Discounts" />
              </Tabs>

              <Divider sx={{ mb: theme.spacing(3) }} />

              {/* ─── TAB CONTENT PANELS ───────────────────────────────────────────── */}
              {activeTab === "products" && (
                <Grid container spacing={3}>
                  <Grid container size={{ xs: 12 }}>
                    <Card
                      sx={{
                        width: "100%",
                        borderRadius: 2,
                        boxShadow: theme.shadows[1],
                        transition: "transform 0.2s, box-shadow 0.2s",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: theme.shadows[3],
                        },
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          All Products
                        </Typography>
                        <Divider sx={{ mb: theme.spacing(2) }} />
                        <StoreProducts storeId={id} />
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}

              {activeTab === "sellers" && (
                <Card
                  sx={{
                    mb: theme.spacing(2),
                    borderRadius: 2,
                    boxShadow: theme.shadows[1],
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Store Sellers
                    </Typography>
                    <Divider sx={{ mb: theme.spacing(2) }} />
                    <StoreSellers storeId={id} />
                  </CardContent>
                </Card>
              )}

              {activeTab === "settings" && (
                <Card
                  sx={{
                    mb: theme.spacing(2),
                    borderRadius: 2,
                    boxShadow: theme.shadows[1],
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Store Settings
                    </Typography>
                    <Divider sx={{ mb: theme.spacing(2) }} />
                    <StoreSettings storeId={id} />
                  </CardContent>
                </Card>
              )}

              {activeTab === "discounts" && (
                <Card
                  sx={{
                    mb: theme.spacing(2),
                    borderRadius: 2,
                    boxShadow: theme.shadows[1],
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Store Discounts
                    </Typography>
                    <Divider sx={{ mb: theme.spacing(2) }} />
                    <StoreDiscounts storeId={id} />
                  </CardContent>
                </Card>
              )}
            </Paper>
          </Grow>
        )}
      </Container>
    </Box>
  );
};

export default SellerStorePage;
