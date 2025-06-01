import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  TextField,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  Pagination,
  Skeleton,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

import { ProductDto } from "../../../../shared/types/dtos";
import { GetProductsPayload } from "../../../../shared/types/requests";
import { sdk, isAuthenticated } from "../../../../sdk/sdk";

interface StoreProductsProps {
  storeId?: string;
}

export const StoreProducts: React.FC<StoreProductsProps> = ({ storeId }) => {
  const theme = useTheme();
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  // “Add Product” dialog state
  const [addOpen, setAddOpen] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>("");
  const [newDesc, setNewDesc] = useState<string>("");
  const [newPrice, setNewPrice] = useState<number | undefined>(undefined);
  const [newQuantity, setNewQuantity] = useState<number | undefined>(undefined);
  const [newCategories, setNewCategories] = useState<string[]>([]);
  const [newAuctionEnd, setNewAuctionEnd] = useState<string>(""); // ISO datetime
  const [adding, setAdding] = useState<boolean>(false);
  const [addError, setAddError] = useState<string>();

  const [isSeller, setIsSeller] = React.useState<boolean | null>(null);
  React.useEffect(() => {
    const fetchData = async () => {
      if (!storeId || isAuthenticated() === false) {
        setIsSeller(false);
        return;
      }

      try {
        const me = await sdk.getCurrentUserProfileDetails();
        const mySeller = await sdk.getSeller(storeId, me.id);
        setIsSeller(mySeller !== null);
      } catch (err: any) {
        setIsSeller(false);
      }
    };

    fetchData();
  }, [storeId]);

  // Fetch products (with pagination)
  const fetchProducts = useCallback(async () => {
    if (!storeId) {
      setProducts([]);
      return;
    }
    setLoading(true);
    setError(undefined);

    const payload: GetProductsPayload = { page: page, size: 12, storeId: storeId };
    try {
      const items = (await sdk.getProducts(payload)) as ProductDto[];

      setProducts(items);
      console.log("Fetched products:", products);
      setTotalPages(1); // Change this to actual total pages if your API supports it
    } catch (err: any) {
      console.error("Failed to load products:", err);
      setError(err.message || "Failed to load products");
      setProducts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [storeId, page]);

  // Initial load & whenever storeId or page changes
  useEffect(() => {
    setPage(0);
    fetchProducts();
  }, [storeId, fetchProducts]);

  // Handle “Add Product” dialog submission
  const handleAdd = async () => {
    if (!storeId) return;
    setAdding(true);
    setAddError(undefined);

    try {
      const toCreate: Partial<ProductDto> = {
        name: newName.trim(),
        description: newDesc.trim(),
        price: newPrice ?? 0,
        quantity: newQuantity ?? 0,
        categories: newCategories,
        auctionEndDate: newAuctionEnd,
      };

      await sdk.createProduct(storeId, toCreate as ProductDto);

      // Close dialog & reset form
      setAddOpen(false);
      setNewName("");
      setNewDesc("");
      setNewPrice(undefined);
      setNewQuantity(undefined);
      setNewCategories([]);
      setNewAuctionEnd("");

      // Refresh first page
      setPage(0);
      fetchProducts();
    } catch (err: any) {
      console.error("Error adding product:", err);
      setAddError(err.message || "Failed to add product");
    } finally {
      setAdding(false);
    }
  };

  // Disable “Add” button unless required fields are filled
  const isAddDisabled =
    adding || newName.trim().length === 0 || newPrice === undefined;

  return (
    <Box sx={{ width: "100%", px: { xs: 2, sm: 0 } }}>
      {/* ─── HEADER & ACTION BAR ───────────────────────────────────────────────── */}
      {isSeller && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: theme.spacing(3),
          }}
        >
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddOpen(true)}
          >
            Add Product
          </Button>
        </Box>
      )}

      {/* ─── CONTENT AREA ───────────────────────────────────────────────────────── */}
      {loading ? (
        // Show six placeholder skeleton cards
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, idx) => (
            <Grid key={idx} container size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: theme.shape.borderRadius * 2,
                  boxShadow: theme.shadows[1],
                  overflow: "hidden",
                }}
              >
                <Box sx={{ p: theme.spacing(2) }}>
                  <Skeleton variant="text" width="60%" height={32} />
                  <Skeleton variant="text" width="80%" height={24} />
                  <Skeleton variant="text" width="40%" height={24} />
                  <Skeleton
                    variant="rectangular"
                    height={24}
                    sx={{ my: 1, borderRadius: 1 }}
                  />
                  <Skeleton variant="text" width="50%" height={20} />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : error ? (
        <Alert severity="error" sx={{ mb: theme.spacing(2) }}>
          {error}
        </Alert>
      ) : products === undefined || products.length === 0 ? (
        <Typography>No products found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {products.map((p) => (
            <Grid key={p.id} container size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: theme.shape.borderRadius * 2,
                  boxShadow: theme.shadows[1],
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    noWrap
                    sx={{ fontWeight: 500 }}
                  >
                    {p.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    paragraph
                    noWrap
                    sx={{ color: theme.palette.text.secondary }}
                  >
                    {p.description}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Price:</strong> ${p.price.toFixed(2)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Quantity:</strong> {p.quantity}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Rating:</strong> {p.rating.toFixed(1)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Categories:</strong>{" "}
                    {p.categories.length ? p.categories.join(", ") : "—"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Auction Ends:</strong>{" "}
                    {new Date(p.auctionEndDate).toLocaleString()}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "flex-end" }}>
                  <Button size="small">Edit</Button>
                  <Button size="small" color="error">
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* ─── PAGINATION BAR ─────────────────────────────────────────────────────── */}
      {products !== undefined && products.length > 0 && (
        <Box
          sx={{
            mt: theme.spacing(4),
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={(_, value) => setPage(value - 1)}
            color="primary"
          />
        </Box>
      )}

      {/* ─── ADD PRODUCT DIALOG ─────────────────────────────────────────────────── */}
      <Dialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Add New Product
          <IconButton
            aria-label="close"
            onClick={() => setAddOpen(false)}
            sx={{
              position: "absolute",
              right: theme.spacing(1),
              top: theme.spacing(1),
              color: theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ mt: theme.spacing(1) }}>
            <Grid container spacing={2}>
              <Grid container size={{ xs: 12 }}>
                <TextField
                  label="Product Name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  fullWidth
                  required
                  disabled={adding}
                />
              </Grid>

              <Grid container size={{ xs: 12 }}>
                <TextField
                  label="Description"
                  multiline
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  fullWidth
                  disabled={adding}
                />
              </Grid>

              <Grid container size={{ xs: 6 }}>
                <TextField
                  label="Price"
                  type="number"
                  value={newPrice ?? ""}
                  onChange={(e) =>
                    setNewPrice(
                      e.target.value === "" ? undefined : +e.target.value
                    )
                  }
                  fullWidth
                  required
                  disabled={adding}
                  InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                />
              </Grid>

              <Grid container size={{ xs: 6 }}>
                <TextField
                  label="Quantity"
                  type="number"
                  value={newQuantity ?? ""}
                  onChange={(e) =>
                    setNewQuantity(
                      e.target.value === "" ? undefined : +e.target.value
                    )
                  }
                  fullWidth
                  disabled={adding}
                  InputProps={{ inputProps: { min: 0, step: 1 } }}
                />
              </Grid>

              <Grid container size={{ xs: 12 }}>
                <Autocomplete
                  multiple
                  freeSolo
                  options={[]}
                  fullWidth
                  value={newCategories}
                  onChange={(_, v) => setNewCategories(v)}
                  renderInput={(params) => (
                    <TextField {...params} label="Categories" fullWidth />
                  )}
                  disabled={adding}
                />
              </Grid>

              <Grid container size={{ xs: 12 }}>
                <TextField
                  label="Auction End Date"
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                  value={newAuctionEnd}
                  onChange={(e) => setNewAuctionEnd(e.target.value)}
                  fullWidth
                  disabled={adding}
                />
              </Grid>

              {addError && (
                <Grid container size={{ xs: 12 }}>
                  <Alert severity="error" variant="outlined">
                    {addError}
                  </Alert>
                </Grid>
              )}
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: theme.spacing(3), pb: theme.spacing(2) }}>
          <Button onClick={() => setAddOpen(false)} disabled={adding}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAdd}
            disabled={isAddDisabled}
          >
            {adding ? "Adding…" : "Add Product"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StoreProducts;
