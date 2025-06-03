import React, { useState, useEffect } from "react";
import { Box, Typography, Container, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";

import StoreSellerToolbar from "./components/subpages/StoreSellerToolbar";
import StoreProducts from "../store/components/subpages/StoreProducts";
import StoreSellers from "../store/components/subpages/StoreSellers";
import StoreSettings from "../store/components/subpages/StoreSettings";
import StoreDiscounts from "./components/subpages/discounts/StoreDiscountsPage/StoreDiscountsPage";
import RatingComponent from "../../shared/components/RatingComponent";

import { StoreDto } from "../../shared/types/dtos";
import { sdk } from "../../sdk/sdk";

type Tab = "products" | "sellers" | "settings" | "discounts";

const SellerStorePage: React.FC<{ id?: string }> = ({ id }) => {
  const [activeTab, setActiveTab] = useState<Tab>("products");
  const [store, setStore] = useState<StoreDto | null>(null);
  const [rateDialogOpen, setRateDialogOpen] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [rateError, setRateError] = useState<string>("");

  useEffect(() => {
    if (!id) return;

    sdk.getStore(id)
      .then((result) => {
        setStore(result);
      })
      .catch((err) => {
        console.error("Failed to fetch store:", err.message);
        setStore(null);
      });
  }, [id]);

  const handleRateStore = async () => {
    if (!id || userRating == null) return;
    setRateError("");
    try {
      await sdk.createStoreReview({
        id: null, // let backend generate
        productId: null, // not a product review
        storeId: id ?? null,
        writerId: null, // let backend use current user
        title: null,
        body: null,
        rating: Math.round(userRating),
        date: null,
      });
      // Refresh store info after rating
      const updatedStore = await sdk.getStore(id);
      setStore(updatedStore);
      setRateDialogOpen(false);
      setUserRating(null);
      alert("Thank you for rating the store!");
    } catch (err: any) {
      setRateError(err.message || "You must purchase from this store before rating.");
    }
  };

  return (
    <Box minHeight="100vh" bgcolor="#f7f7f7" py={6}>
      <Container maxWidth="md">
        <Box mt="5rem">
          <Typography variant="h4" align="center" color="textPrimary" gutterBottom>
            🏪 {store?.name || "Loading..."}
          </Typography>
          {store && typeof store.rating === "number" && store.rating > 0 && (
            <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
              <RatingComponent
                value={store.rating}
                readOnly={false}
                size="large"
                precision={1}
                onChange={async (newValue) => {
                  if (!id) return;
                  try {
                    await sdk.createStoreReview({
                      id: null, // let backend generate
                      productId: null, // not a product review
                      storeId: id ?? null,
                      writerId: null, // let backend use current user
                      title: null,
                      body: null,
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
              <Typography variant="h6" ml={1}>({store.rating.toFixed(1)})</Typography>
              <Button sx={{ ml: 2 }} variant="outlined" onClick={() => setRateDialogOpen(true)}>
                Rate Store
              </Button>
            </Box>
          )}

          {/* Inline rating (0 stars or missing) */}
          {store && (typeof store.rating !== "number" || store.rating === 0) && (
            <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
              <RatingComponent
                value={0}
                readOnly={false}
                size="large"
                precision={1}
                onChange={async (newValue) => {
                  if (!id) return;
                  try {
                    await sdk.createStoreReview({
                      id: null,
                      productId: null,
                      storeId: id ?? null,
                      writerId: null,
                      title: null,
                      body: null,
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
              <Typography variant="h6" ml={1}>(No ratings yet)</Typography>
            </Box>
          )}

          <Dialog open={rateDialogOpen} onClose={() => setRateDialogOpen(false)}>
            <DialogTitle>Rate This Store</DialogTitle>
            <DialogContent>
              <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                <RatingComponent value={userRating ?? 0} onChange={setUserRating} size="large" />
                {rateError && <Typography color="error">{rateError}</Typography>}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setRateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleRateStore} disabled={userRating == null}>Submit</Button>
            </DialogActions>
          </Dialog>

          <Box display="flex" justifyContent="center" mb={4}>
            <StoreSellerToolbar activeTab={activeTab} onTabChange={setActiveTab} />
          </Box>

          <Box display="flex" justifyContent="center">
            {activeTab === "products" && <StoreProducts storeId={id} />}
            {activeTab === "sellers" && <StoreSellers storeId={id} />}
            {activeTab === "settings" && <StoreSettings storeId={id} />}
            {activeTab === "discounts" && <StoreDiscounts />}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default SellerStorePage;
