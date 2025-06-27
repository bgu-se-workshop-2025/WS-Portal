import React, { useMemo, useCallback, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  useTheme,
  Box,
  CircularProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Alert,
  Snackbar,
} from "@mui/material";

import {
  ProductDto,
  ShippingAddressDto,
  PaymentDetails,
  PaymentMethod,
  PublicUserDto,
} from "../../../../../../../shared/types/dtos";
import useCart from "../../../../../../../shared/hooks/useCart";
import RatingComponent from "../../../../../../../shared/components/RatingComponent";
import { sdk, isAuthenticated } from "../../../../../../../sdk/sdk";
import CreateBidRequestDialog from "../../../../../../Bidding/CreateBidRequestDialog";

const UserProductCard: React.FC<{
  product: ProductDto;
  setUpdateProducts?: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ product, setUpdateProducts }) => {
  const theme = useTheme();
  const [bidDialogOpen, setBidDialogOpen] = useState(false);
  const {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    loading: cartLoading,
    error: cartError,
  } = useCart();

  const { storeId } = useParams<{ storeId: string }>();
  const isUserAuthenticated = isAuthenticated();

  // Auction-specific state
  const [currentTopOffer, setCurrentTopOffer] = useState<number | null>(null);
  const [bidValue, setBidValue] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddressDto>({
    country: "",
    city: "",
    region: "",
    street: "",
    zipCode: "",
    homeNumber: "",
    apartmentNumber: "",
    mailbox: "",
  });
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    paymentMethod: PaymentMethod.CREDIT_CARD,
    externalId: "",
    payerEmail: "",
    payerId: "",
    paymentData: { currency: "ILS" },
  });
  const [bidError, setBidError] = useState<string | null>(null);
  const [bidLoading, setBidLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error"
  >("success");

  const currentQty = useMemo(() => {
    if (!cart) return 0;
    const basket = cart.stores.find((s) => s.storeId === storeId);
    if (!basket) return 0;
    const entry = basket.products.find((e) => e.productId === product.id);
    return entry?.quantity ?? 0;
  }, [cart, storeId, product.id]);

  const handleIncrement = useCallback(async () => {
    if (currentQty === product.quantity) return;
    if (currentQty === 0) {
      await addToCart(storeId!, product.id, 1);
    } else {
      await updateQuantity(storeId!, product.id, currentQty + 1);
    }
  }, [currentQty, product.quantity, addToCart, updateQuantity, product.id, storeId]);

  const handleDecrement = useCallback(async () => {
    if (currentQty <= 1) {
      await removeFromCart(storeId!, product.id);
    } else {
      await updateQuantity(storeId!, product.id, currentQty - 1);
    }
  }, [currentQty, removeFromCart, updateQuantity, product.id, storeId]);

  useEffect(() => {
    if (product.auctionEndDate) {
      sdk
        .getWinningBidPrice(product.id)
        .then(setCurrentTopOffer)
        .catch(() => setCurrentTopOffer(null));
    }
  }, [product.auctionEndDate, product.id]);

  return (
    <>
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
          <Typography variant="h6" gutterBottom noWrap sx={{ fontWeight: 500 }}>
            {product.name}
          </Typography>
          <Typography
            variant="body2"
            paragraph
            noWrap
            sx={{ color: theme.palette.text.secondary }}
          >
            {product.description}
          </Typography>

          <Box sx={{ mb: theme.spacing(1) }}>
            {product.auctionEndDate ? (
              <>
                <Typography variant="body2">
                  <strong>Starting Price:</strong> ${product.price.toFixed(2)}
                </Typography>
                <Typography variant="body2">
                  <strong>Current Top Offer:</strong>{" "}
                  {currentTopOffer != null
                    ? `$${currentTopOffer.toFixed(2)}`
                    : "No offers yet"}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <TextField
                    size="small"
                    label="Your Offer"
                    type="number"
                    value={bidValue}
                    onChange={(e) => setBidValue(e.target.value)}
                    sx={{ mr: 1, width: 120 }}
                  />
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => {
                      setBidError(null);
                      const min = currentTopOffer ?? product.price;
                      if (Number(bidValue) > min) {
                        setDialogOpen(true);
                      } else {
                        setBidError(
                          "Offer must be higher than current top offer"
                        );
                      }
                    }}
                    disabled={bidLoading}
                  >
                    Add Offer
                  </Button>
                </Box>
                {bidError && (
                  <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                    {bidError}
                  </Typography>
                )}
              </>
            ) : (
              <Typography variant="body2">
                <strong>Price:</strong> ${product.price.toFixed(2)}
              </Typography>
            )}
            <Typography variant="body2">
              <strong>Available:</strong> {product.quantity}
            </Typography>
          </Box>

          {product.categories.length > 0 && (
            <Typography variant="body2">
              <strong>Categories:</strong> {product.categories.join(", ")}
            </Typography>
          )}
          {product.auctionEndDate && (
            <Typography variant="body2" sx={{ mt: theme.spacing(1) }}>
              <strong>Auction Ends:</strong>{" "}
              {new Date(product.auctionEndDate).toLocaleString()}
            </Typography>
          )}

          {!product.auctionEndDate && (
            <Box
              sx={{
                mb: theme.spacing(1),
                mt: theme.spacing(2),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <RatingComponent
                value={product.rating}
                readOnly={true}
                size="small"
                precision={0.1}
              />
            </Box>
          )}

          {cartError && (
            <Typography
              variant="caption"
              color="error"
              sx={{ mt: theme.spacing(1), display: "block" }}
            >
              {cartError}
            </Typography>
          )}
        </CardContent>

        <CardActions
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            px: theme.spacing(2),
            pb: theme.spacing(2),
            flexWrap: "wrap",
          }}
        >
          {!product.auctionEndDate && (
            <>
              <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleDecrement}
                  disabled={cartLoading || currentQty === 0}
                  sx={{ minWidth: 32, p: 0 }}
                >
                  –
                </Button>
                <Box sx={{ width: 32, textAlign: "center", mx: theme.spacing(1) }}>
                  <Typography variant="body2">{currentQty}</Typography>
                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleIncrement}
                  disabled={cartLoading}
                  sx={{ minWidth: 32, p: 0 }}
                >
                  +
                </Button>
                {cartLoading && (
                  <CircularProgress size={20} sx={{ ml: theme.spacing(1) }} />
                )}
              </Box>

              {isUserAuthenticated && (
                <>
                  <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => setBidDialogOpen(true)}
                  >
                    Bid
                  </Button>
                </>
              )}
            </>
          )}
        </CardActions>
      </Card>

      {/* Re-add CreateBidRequestDialog for store-seller bids */}
      {storeId && (
        <CreateBidRequestDialog
          open={bidDialogOpen}
          onClose={() => setBidDialogOpen(false)}
          productId={product.id}
          storeId={storeId}
        />
      )}

      {/* Auction offer modal */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {/* ... same auction content */}
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UserProductCard;
