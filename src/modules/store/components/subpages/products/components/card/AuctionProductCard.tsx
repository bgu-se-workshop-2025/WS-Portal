import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
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
  PaymentDetailsErrors,
} from "../../../../../../../shared/types/dtos";
import { sdk } from "../../../../../../../sdk/sdk";
import ShippingAddressForm from "../../../../../../order/ShippingAddressForm";
import PaymentDetailsForm from "../../../../../../order/PaymentDetailsForm";
import { validatePaymentDetails } from "../../../../../../../shared/utils/validatePaymentDetails";

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const initialShippingAddress: ShippingAddressDto = {
  country: "",
  city: "",
  region: "",
  street: "",
  zipCode: "",
  homeNumber: "",
  apartmentNumber: "",
  mailbox: "",
};

const initialPaymentDetails: PaymentDetails = {
    externalId: "",
    payerEmail: "",
    payerId: "",
    paymentData: {}
};

const AuctionProductCard: React.FC<{
  product: ProductDto;
  setUpdateProducts?: React.Dispatch<React.SetStateAction<boolean>>;
  isUserAuthenticated: boolean;
}> = ({ product, setUpdateProducts, isUserAuthenticated }) => {
  const [currentTopOffer, setCurrentTopOffer] = useState<number | null>(null);
  const [bidValue, setBidValue] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddressDto>(
    initialShippingAddress
  );
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>(
    initialPaymentDetails
  );
  const [bidLoading, setBidLoading] = useState(false);
  const [bidError, setBidError] = useState<string | null>(null);
  const [paymentErrors, setPaymentErrors] = useState<PaymentDetailsErrors>({});

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  useEffect(() => {
    if (product.auctionEndDate) {
      sdk
        .getWinningBidPrice(product.id)
        .then(setCurrentTopOffer)
        .catch(() => setCurrentTopOffer(null));
    }
  }, [product.auctionEndDate, product.id]);

  const handleAddOfferClick = () => {
    setBidError(null);
    if (Number(bidValue) > (currentTopOffer ?? product.price)) {
      setDialogOpen(true);
    } else {
      setBidError("Offer must be higher than current top offer");
    }
  };

  const handleSubmitBid = async () => {
    const errors = validatePaymentDetails(paymentDetails);
    setPaymentErrors(errors);
    if (Object.keys(errors).length > 0) {
      setBidError("Please fix the payment details errors before proceeding.");
      return;
    }

    setBidLoading(true);
    setBidError(null);
    try {
      let profile;
      try {
        profile = await sdk.getCurrentUserProfileDetails();
      } catch (e) {
        setBidError("Could not fetch user profile. Please log in again.");
        setBidLoading(false);
        return;
      }
      await sdk.placeBid(product.id, {
        productId: product.id,
        bidderId: profile.id,
        bidPrice: Number(bidValue),
        shippingAddress,
        paymentDetails: {
          ...paymentDetails,
          payerId: profile.id,
        },
      });
      
      const newTopOffer = await sdk.getWinningBidPrice(product.id);
      setCurrentTopOffer(newTopOffer);

      setSnackbarMessage("Bid placed successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      await sleep(1000);

      setDialogOpen(false);
      setBidValue("");
      setShippingAddress(initialShippingAddress);
      setPaymentDetails({
        ...initialPaymentDetails,
        payerId: profile.id,
      });
      setUpdateProducts?.((u) => !u);
      
    } catch (e: any) {
      setBidError(e?.message || "Failed to place bid");
      setSnackbarMessage(e?.message || "Failed to place bid");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setBidLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 1 }}>
        <Typography variant="body2">
          <strong>Current Top Offer:</strong>{" "}
          {currentTopOffer !== null
            ? `$${currentTopOffer.toFixed(2)}`
            : "No bids yet"}
        </Typography>
        <Typography variant="body2">
          <strong>Starting Price:</strong> ${product.price.toFixed(2)}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
        <TextField
          size="small"
          label="Your Offer"
          type="number"
          value={bidValue}
          onChange={(e) => setBidValue(e.target.value)}
          sx={{ mr: 1, width: 120 }}
        />
        {isUserAuthenticated ? (
            <Button
                size="small"
                variant="contained"
                onClick={handleAddOfferClick}
                disabled={bidLoading}
            >
                Add Offer
            </Button>)
        : (
          <Typography variant="body2" color="text.secondary">
            Please log in to place a bid.
          </Typography>
        )}
      </Box>
      
        <Typography variant="body2" sx={{ mt: 2 }}>
            <strong>Auction Ends:</strong>{" "}
            {new Date(product.auctionEndDate!).toLocaleString()}
        </Typography>
      {bidError && (
        <Typography variant="caption" color="error" sx={{ mt: 1 }}>
          {bidError}
        </Typography>
      )}

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Enter Bid Details</DialogTitle>
            <DialogContent>
                <PaymentDetailsForm
                    paymentDetails={paymentDetails}
                    onChange={setPaymentDetails}
                    disabled={bidLoading}
                    errors={paymentErrors}
                />
                    <Divider sx={{ my: 3 }} />
                <ShippingAddressForm
                    shippingAddress={shippingAddress}
                    onChange={setShippingAddress}
                    disabled={bidLoading}
                />
            </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={bidLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmitBid}
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
        autoHideDuration={4000}
        onClose={(_, reason) => {
            if (reason === "clickaway") return;
            setSnackbarOpen(false);
        }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
        <Alert
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
        >
            {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AuctionProductCard;