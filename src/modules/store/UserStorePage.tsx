import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Breadcrumbs,
  Link,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  useTheme,
  Grow,
} from "@mui/material";
import StoreIcon from "@mui/icons-material/Store";

import StoreProducts from "./components/subpages/StoreProducts";
import { StoreDto } from "../../shared/types/dtos";
import { sdk } from "../../sdk/sdk";

interface UserStorePageProps {
  id?: string;
}

const UserStorePage: React.FC<UserStorePageProps> = ({ id }) => {
  const theme = useTheme();
  const [store, setStore] = useState<StoreDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
      .catch((err: any) => {
        console.error("Failed to fetch store:", err);
        setError(err.message || "Unknown error");
        setStore(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        pt: theme.spacing(2),
        pb: theme.spacing(4),
      }}
    >
      <Container maxWidth="md">
        {/* ─── BREADCRUMBS ───────────────────────────────────────────────────────── */}
        <Box sx={{ mb: theme.spacing(2) }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="/">
              Home
            </Link>
            <Link underline="hover" color="inherit" href="/stores">
              Stores
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
            height: { xs: 100, sm: 140 },
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

        {/* ─── LOADING STATE ───────────────────────────────────────────────────────── */}
        {isLoading && (
          <Box display="flex" justifyContent="center" my={6}>
            <CircularProgress color="primary" size={48} />
          </Box>
        )}

        {/* ─── ERROR STATE ──────────────────────────────────────────────────────────── */}
        {!isLoading && error && (
          <Alert severity="error" sx={{ mb: theme.spacing(4) }}>
            {`Failed to load store: ${error}`}
          </Alert>
        )}

        {/* ─── NO ID PROVIDED ───────────────────────────────────────────────────────── */}
        {!id && !isLoading && (
          <Alert severity="warning" sx={{ mb: theme.spacing(4) }}>
            No store ID provided. Please select a store from the list.
          </Alert>
        )}

        {/* ─── MAIN CONTENT: PRODUCTS ───────────────────────────────────────────────── */}
        {!isLoading && !error && store && (
          <Grow in timeout={400}>
            <Box>
              <StoreProducts storeId={id} />
            </Box>
          </Grow>
        )}
      </Container>
    </Box>
  );
};

export default UserStorePage;
