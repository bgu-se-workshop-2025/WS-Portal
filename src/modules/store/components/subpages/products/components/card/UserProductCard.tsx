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
  IconButton,
  Tooltip
} from "@mui/material";
import { ContentCopy, Check } from "@mui/icons-material";

import { ProductDto, ShippingAddressDto, PaymentDetails, PaymentMethod, PublicUserDto } from "../../../../../../../shared/types/dtos";
import useCart from "../../../../../../../shared/hooks/useCart";
import RatingComponent from "../../../../../../../shared/components/RatingComponent";
import { sdk } from "../../../../../../../sdk/sdk";

const UserProductCard: React.FC<{
  product: ProductDto;
  setUpdateProducts?: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ product, setUpdateProducts }) => {
  const theme = useTheme();
  const [copySuccess, setCopySuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    loading: cartLoading,
    error: cartError,
  } = useCart();

  const { storeId } = useParams<{ storeId: string }>();
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
    paymentData: { "currency": "ILS" }
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

  const handleCopyProductId = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(product.id);
      setCopySuccess(true);
      setCopied(true);
      setTimeout(() => {
        setCopySuccess(false);
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy product ID:', err);
    }
  }, [product.id]);

  useEffect(() => {
    if (product.auctionEndDate) {
      sdk.getWinningBidPrice(product.id)
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
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="h6" gutterBottom noWrap sx={{ fontWeight: 500, flex: 1 }}>
              {product.name}
            </Typography>
            <Tooltip title={copied ? "Copied!" : "Copy Product ID"}>
              <IconButton
                size="small"
                onClick={handleCopyProductId}
                sx={{ ml: 1 }}
              >
                {copied ? <Check color="success" /> : <ContentCopy />}
              </IconButton>
            </Tooltip>
          </Box>
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
              required
              label="Country"
              value={shippingAddress.country}
              onChange={e => setShippingAddress({ ...shippingAddress, country: e.target.value })}
              fullWidth
            />
            <TextField
              required
              label="City"
              value={shippingAddress.city}
              onChange={e => setShippingAddress({ ...shippingAddress, city: e.target.value })}
              fullWidth
            />
            <TextField
              required
              label="Region"
              value={shippingAddress.region}
              onChange={e => setShippingAddress({ ...shippingAddress, region: e.target.value })}
              fullWidth
            />
            <TextField
              required
              label="Street"
              value={shippingAddress.street}
              onChange={e => setShippingAddress({ ...shippingAddress, street: e.target.value })}
              fullWidth
            />
            <TextField
              required
              label="Zip Code"
              value={shippingAddress.zipCode}
              onChange={e => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
              fullWidth
            />
            <TextField
              required
              label="Home Number"
              value={shippingAddress.homeNumber}
              onChange={e => setShippingAddress({ ...shippingAddress, homeNumber: e.target.value })}
              fullWidth
            />
            <TextField
              required
              label="Apartment Number"
              value={shippingAddress.apartmentNumber}
              onChange={e => setShippingAddress({ ...shippingAddress, apartmentNumber: e.target.value })}
              fullWidth
            />
            <TextField
              required
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
            <TextField
              required
              label="Card Owner Name"
              name="cardOwnerName"
              value={paymentDetails.paymentData["holder"]}
              onChange={(e) => setPaymentDetails({ ...paymentDetails, paymentData: { ...paymentDetails.paymentData, "holder": e.target.value } })}
              fullWidth
            />

            <TextField
              required
              label="Card Owner ID"
              name="cardOwnerId"
              value={paymentDetails.paymentData["id"]}
              onChange={(e) => setPaymentDetails({ ...paymentDetails, paymentData: { ...paymentDetails.paymentData, "id": e.target.value } })}
              fullWidth
            />

            <TextField
              required
              label="Card Number"
              name="cardNumber"
              value={paymentDetails.paymentData["card_number"]}
              onChange={(e) => setPaymentDetails({ ...paymentDetails, paymentData: { ...paymentDetails.paymentData, "card_number": e.target.value } })}
              fullWidth
            />

            <TextField
              required
              label="CVV"
              name="cvv"
              value={paymentDetails.paymentData["cvv"]}
              onChange={(e) => setPaymentDetails({ ...paymentDetails, paymentData: { ...paymentDetails.paymentData, "cvv": e.target.value } })}
              fullWidth
            />

            <TextField
              required
              label="Expiration Month"
              name="expirationMonth"
              value={paymentDetails.paymentData["month"]}
              onChange={(e) => setPaymentDetails({ ...paymentDetails, paymentData: { ...paymentDetails.paymentData, "month": e.target.value } })}
              fullWidth
            />

            <TextField
              required
              label="Expiration Year"
              name="expirationYear"
              value={paymentDetails.paymentData["year"]}
              onChange={(e) => setPaymentDetails({ ...paymentDetails, paymentData: { ...paymentDetails.paymentData, "year": e.target.value } })}
              fullWidth
            />

            <TextField
              required
              label="Payer Email"
              name="payerEmail"
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
    </>
  );
};

export default UserProductCard;
