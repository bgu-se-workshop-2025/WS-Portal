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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
  Snackbar
} from "@mui/material";

import { ProductDto, ShippingAddressDto, PaymentDetails, PaymentMethod, PublicUserDto } from "../../../../../../../shared/types/dtos";
import useCart from "../../../../../../../shared/hooks/useCart";
import RatingComponent from "../../../../../../../shared/components/RatingComponent";
import { sdk, isAuthenticated } from "../../../../../../../sdk/sdk";

const UserProductCard: React.FC<{
  product: ProductDto;
  setUpdateProducts?: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ product, setUpdateProducts }) => {
  const theme = useTheme();
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
  // For auction products:
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
    mailbox: "",});
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    paymentMethod: PaymentMethod.CREDIT_CARD,
    externalId: "",
    payerEmail: "",
    payerId: "",
  });
  const [bidError, setBidError] = useState<string | null>(null);
  const [bidLoading, setBidLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState("");
const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  // Find current quantity of this product in the cart (for this store)
  const currentQty = useMemo(() => {
    if (!cart) return 0;
    const basket = cart.stores.find((s) => s.storeId === storeId);
    if (!basket) return 0;
    const entry = basket.products.find((e) => e.productId === product.id);
    return entry?.quantity ?? 0;
  }, [cart, storeId, product.id]);

  // When incrementing: if currentQty === 0, call addToCart; otherwise updateQuantity
  const handleIncrement = useCallback(async () => {
    if (currentQty === product.quantity) {
      console.log(
        `Cannot add ${product.name} to cart: already at max quantity (${product.quantity})`
      );
      return;
    }
    if (currentQty === 0) {
      await addToCart(storeId as string, product.id, 1);
      console.log(`Added ${product.name} to cart (quantity = 1)`);
    } else {
      await updateQuantity(storeId as string, product.id, currentQty + 1);
      console.log(
        `Increased ${product.name} quantity to ${currentQty + 1} in cart`
      );
    }
  }, [addToCart, currentQty, product.id, product.name, updateQuantity]);

  // When decrementing: if currentQty <= 1, remove entirely; otherwise updateQuantity
  const handleDecrement = useCallback(async () => {
    if (currentQty <= 1) {
      await removeFromCart(storeId as string, product.id);
      console.log(`Removed ${product.name} from cart`);
    } else {
      await updateQuantity(storeId as string, product.id, currentQty - 1);
      console.log(
        `Decreased ${product.name} quantity to ${currentQty - 1} in cart`
      );
    }
  }, [currentQty, product.id, product.name, removeFromCart, updateQuantity]);

  useEffect(() => {
    if (product.auctionEndDate) {
      sdk.getWinningBidPrice(product.id)
        .then(setCurrentTopOffer)
        .catch(() => setCurrentTopOffer(null));
    }
  }, [product.auctionEndDate, product.id]);

  return (
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
              <strong>Current Top Offer:</strong>
              {currentTopOffer !== null
                ? ` $ ${currentTopOffer.toFixed(2)}`
                : " No offers yet"}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <TextField
                size="small"
                label="Your Offer"
                type="number"
                value={bidValue}
                onChange={e => setBidValue(e.target.value)}
                sx={{ mr: 1, width: 120 }}
              />
              <Button
                size="small"
                variant="contained"
                onClick={() => {
                  setBidError(null);
                  if (
                    Number(bidValue) > (currentTopOffer ?? product.price)
                  ) {
                    setDialogOpen(true);
                  } else {
                    setBidError("Offer must be higher than current top offer");
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

        {!product.auctionEndDate && <Box
          sx={{
            mb: theme.spacing(1),
            mt: theme.spacing(2),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Always show partial stars for viewing */}
          <RatingComponent
            value={product.rating}
            readOnly={true}
            size="small"
            precision={0.1}
          />
        </Box>}

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

      {!product.auctionEndDate && <CardActions
        sx={{
          justifyContent: "center",
          alignItems: "center",
          px: theme.spacing(2),
          pb: theme.spacing(2),
        }}
      >
        <Button
          size="small"
          variant="outlined"
          onClick={handleDecrement}
          disabled={cartLoading || currentQty === 0}
          sx={{ minWidth: 32, p: 0 }}
        >
          –
        </Button>

        <Box
          sx={{
            width: 32,
            textAlign: "center",
            mx: theme.spacing(1),
          }}
        >
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
      </CardActions>}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Enter Bid Details</DialogTitle>
        <DialogContent>
          {/* Shipping Address Section */}
          <Typography variant="subtitle1" sx={{ mt: 1, mb: 1 }}>
            Shipping Address
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <TextField
              label="Country"
              value={shippingAddress.country}
              onChange={e => setShippingAddress({ ...shippingAddress, country: e.target.value })}
              fullWidth
            />
            <TextField
              label="City"
              value={shippingAddress.city}
              onChange={e => setShippingAddress({ ...shippingAddress, city: e.target.value })}
              fullWidth
            />
            <TextField
              label="Region"
              value={shippingAddress.region}
              onChange={e => setShippingAddress({ ...shippingAddress, region: e.target.value })}
              fullWidth
            />
            <TextField
              label="Street"
              value={shippingAddress.street}
              onChange={e => setShippingAddress({ ...shippingAddress, street: e.target.value })}
              fullWidth
            />
            <TextField
              label="Zip Code"
              value={shippingAddress.zipCode}
              onChange={e => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
              fullWidth
            />
            <TextField
              label="Home Number"
              value={shippingAddress.homeNumber}
              onChange={e => setShippingAddress({ ...shippingAddress, homeNumber: e.target.value })}
              fullWidth
            />
            <TextField
              label="Apartment Number"
              value={shippingAddress.apartmentNumber}
              onChange={e => setShippingAddress({ ...shippingAddress, apartmentNumber: e.target.value })}
              fullWidth
            />
            <TextField
              label="Mailbox"
              value={shippingAddress.mailbox}
              onChange={e => setShippingAddress({ ...shippingAddress, mailbox: e.target.value })}
              fullWidth
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Payment Details Section */}
          <Typography variant="subtitle1" sx={{ mt: 1, mb: 1 }}>
            Payment Details
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="payment-method-label">Payment Method</InputLabel>
              <Select
                labelId="payment-method-label"
                value={paymentDetails.paymentMethod}
                label="Payment Method"
                onChange={e =>
                  setPaymentDetails({
                    ...paymentDetails,
                    paymentMethod: Number(e.target.value) as PaymentMethod,
                  })
                }
              >
                <MenuItem value={PaymentMethod.CREDIT_CARD}>Credit Card</MenuItem>
                <MenuItem value={PaymentMethod.PAYPAL}>PayPal</MenuItem>
                <MenuItem value={PaymentMethod.APPLE_PAY}>Apple Pay</MenuItem>
                <MenuItem value={PaymentMethod.GOOGLE_PAY}>Google Pay</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Payer Email"
              value={paymentDetails.payerEmail}
              onChange={e => setPaymentDetails({ ...paymentDetails, payerEmail: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={bidLoading}>
            Cancel
          </Button>
          <Button
            onClick={async () => {
              setBidLoading(true);
              setBidError(null);
              try {
                setDialogOpen(false);
                setBidValue("");
                setShippingAddress({
                  country: "",
                  city: "",
                  region: "",
                  street: "",
                  zipCode: "",
                  homeNumber: "",
                  apartmentNumber: "",
                  mailbox: "",
                });
                let profile: PublicUserDto | undefined = undefined;
                try {
                  profile = await sdk.getCurrentUserProfileDetails();
                } catch (e) {
                  console.error("Failed to fetch current user profile:", e);
                }
                if (!profile) {
                  throw new Error("User profile not found. Please log in.");
                }
                setPaymentDetails({
                  paymentMethod: PaymentMethod.CREDIT_CARD,
                  externalId: undefined,
                  payerEmail: "",
                  payerId: "",
                });
                await sdk.placeBid(product.id, {
                  productId: product.id,
                  bidderId: profile.id,
                  bidPrice: Number(bidValue),
                  shippingAddress,
                  paymentDetails,
                });
                setSnackbarMessage("Bid placed successfully!");
                setSnackbarSeverity("success");
                setSnackbarOpen(true);

                const newTopOffer = await sdk.getWinningBidPrice(product.id);
                setCurrentTopOffer(newTopOffer);
              } catch (e: any) {
                setBidError(e?.message || "Failed to place bid");
              } finally {
                setBidLoading(false);
              }
            }}
            variant="contained"
            disabled={bidLoading}
          >
            Submit Bid
          </Button>
        </DialogActions>
        {bidError && (
          <Typography variant="caption" color="error" sx={{ px: 2, pb: 2 }}>
            {bidError}
          </Typography>
        )}
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
    </Card>
  );
};

export default UserProductCard;
