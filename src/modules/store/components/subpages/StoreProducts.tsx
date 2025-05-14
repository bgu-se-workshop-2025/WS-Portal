import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { ProductDto } from "../../../../shared/types/dtos";
import { GetProductsPayload } from "../../../../shared/types/requests";
import { sdk } from "../../../../sdk/sdk";

interface StoreProductsProps {
  storeId?: string;
}

export const StoreProducts: React.FC<StoreProductsProps> = ({ storeId }) => {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [page, setPage] = useState(0);

  // add‐product dialog state
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPrice, setNewPrice] = useState<number>();
  const [newQuantity, setNewQuantity] = useState<number>();
  const [newCategories, setNewCategories] = useState<string[]>([]);
  const [newAuctionEnd, setNewAuctionEnd] = useState<string>(""); // ISO datetime
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string>();

  const fetchProducts = useCallback(() => {
    if (!storeId) {
      setProducts([]);
      return;
    }
    setLoading(true);
    setError(undefined);

    const payload: GetProductsPayload = { page, size: 12, storeId };
    sdk
      .getProducts(payload)
      .then(setProducts)
      .catch((err: any) => setError(err.message || "Failed to load products"))
      .finally(() => setLoading(false));
  }, [storeId, page]);

  useEffect(() => {
    setPage(0);
    fetchProducts();
  }, [storeId, fetchProducts]);

  const handleAdd = async () => {
    if (!storeId) return;
    setAdding(true);
    setAddError(undefined);

    try {
      const toCreate = {
        name: newName,
        description: newDesc,
        price: newPrice ?? 0,
        quantity: newQuantity ?? 0,
        categories: newCategories,
        auctionEndDate: newAuctionEnd,
      } as Partial<ProductDto>;

      await sdk.createProduct(storeId, toCreate as ProductDto);
      setAddOpen(false);
      // reset form
      setNewName("");
      setNewDesc("");
      setNewPrice(undefined);
      setNewQuantity(undefined);
      setNewCategories([]);
      setNewAuctionEnd("");
      // refresh
      setPage(0);
      fetchProducts();
    } catch (e: any) {
      setAddError(e.message || "Failed to add product");
    } finally {
      setAdding(false);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" fontWeight={600} color="primary">
          📦 Products
        </Typography>
        <Button variant="contained" onClick={() => setAddOpen(true)}>
          Add Product
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : products.length === 0 ? (
        <Typography>No products found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {products.map((p) => (
            <Grid container key={p.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {p.name}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {p.description}
                  </Typography>
                  <Typography>Price: ${p.price}</Typography>
                  <Typography>Quantity: {p.quantity}</Typography>
                  <Typography>Rating: {p.rating.toFixed(1)}</Typography>
                  <Typography>
                    Categories: {p.categories.join(", ") || "—"}
                  </Typography>
                  <Typography>
                    Auction Ends: {new Date(p.auctionEndDate).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* pagination */}
      {products.length > 0 && (
        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
          >
            Previous
          </Button>
          <Typography>Page {page + 1}</Typography>
          <Button
            variant="outlined"
            disabled={products.length < 12}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </Box>
      )}

      {/* Add‐product dialog */}
      <Dialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}
        >
          <TextField
            autoFocus
            label="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <TextField
            label="Description"
            multiline
            rows={3}
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
          />
          <TextField
            label="Price"
            type="number"
            value={newPrice ?? ""}
            onChange={(e) =>
              setNewPrice(e.target.value === "" ? undefined : +e.target.value)
            }
          />
          <TextField
            label="Quantity"
            type="number"
            value={newQuantity ?? ""}
            onChange={(e) =>
              setNewQuantity(
                e.target.value === "" ? undefined : +e.target.value
              )
            }
          />
          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={newCategories}
            onChange={(_, v) => setNewCategories(v)}
            renderInput={(params) => (
              <TextField {...params} label="Categories" />
            )}
          />
          <TextField
            label="Auction End Date"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            value={newAuctionEnd}
            onChange={(e) => setNewAuctionEnd(e.target.value)}
          />
          {addError && (
            <Typography color="error" variant="body2">
              {addError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAdd}
            disabled={adding || !newName}
          >
            {adding ? "Adding…" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StoreProducts;
