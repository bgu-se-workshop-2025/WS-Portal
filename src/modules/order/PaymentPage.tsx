import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  Alert,
  Divider,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import { AuctionBidDto, OrderRequestDetails, PaymentDetails, PaymentDetailsErrors, ShippingAddressDto, UserOrderDto } from '../../shared/types/dtos';
import useCart from '../../shared/hooks/useCart';
import useOrder from './hooks/useOrder';
import { useParams } from "react-router-dom";
import { sdk } from '../../sdk/sdk';

const PaymentPage: React.FC = () => {
  const cartHook = useCart();
  const orderHook = useOrder();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<UserOrderDto | undefined>(undefined);
  const [auctionSuccess, setAuctionSuccess] = useState<AuctionBidDto | undefined>(undefined);
  const { productId, bidPrice } = useParams<{ productId: string; bidPrice: string }>();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  function validatePaymentDetails(paymentDetails: PaymentDetails): PaymentDetailsErrors {
    const errors: PaymentDetailsErrors = {};
    if (!paymentDetails.paymentData.holder) errors.holder = "Required";
    if (!paymentDetails.paymentData.id) errors.id = "Required";
    if (!paymentDetails.paymentData.card_number) errors.card_number = "Required";
    if (!paymentDetails.paymentData.cvv) errors.cvv = "Required";
    if (!paymentDetails.paymentData.month) errors.month = "Required";
    if (!paymentDetails.paymentData.year) errors.year = "Required";
    if (!paymentDetails.payerEmail) errors.payerEmail = "Required";
    return errors;
  }
  
  function setErrorMessage(message: string) {
    setError(message);
    setSuccess(undefined);
    setAuctionSuccess(undefined);
    setSnackbarMessage(message);
    setSnackbarSeverity("error");
    setSnackbarOpen(true);
    console.error(message);
  }

  function setSuccessMessage(userOrderDto: UserOrderDto | undefined) {
    setSuccess(userOrderDto);
    setAuctionSuccess(undefined);
    setError("");
    let message = userOrderDto ? `Purchase successful! Transaction ID: ${userOrderDto.id}` : "Transaction ID unavailable";
    setSnackbarMessage(message);
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
    console.log("order created:" + userOrderDto);
  }

  function setAuctionSuccessMessage(auctionBidDto: AuctionBidDto | undefined) {
    setAuctionSuccess(auctionBidDto);
    setSuccess(undefined);
    setError("");
    let message = auctionBidDto ? `Successfully placed bid of: ${auctionBidDto.bidPrice}` : "bid price unavailable";
    setSnackbarMessage(message);
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
    console.log("Successfully placed bid: ", auctionBidDto);
  }

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    externalId: "",
    payerEmail: "",
    payerId: "",
    paymentData: { "currency": "ILS" }
  });

  const [errors, setPaymentErrors] = useState<PaymentDetailsErrors>({});

  const [shippingAddress, setShippingAddress] = useState<ShippingAddressDto>({
    apartmentNumber: "",
    homeNumber: "",
    country: "",
    mailbox: "",
    zipCode: "",
    street: "",
    region: "",
    city: "",
  });

  useEffect(() => {
    setLoading(cartHook.loading)
    setError(cartHook.error ?? "")
  }, [cartHook.loading, cartHook.error]);

  const handlePaymentEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPaymentDetails({ ...paymentDetails, payerEmail: value })
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (orderHook.loading) {
      return;
    }

    const errors = validatePaymentDetails(paymentDetails);
    setPaymentErrors(errors);
    if (Object.keys(errors).length > 0) {
      setErrorMessage("Missing or invalid payment details");
      return;
    }

    if ((!!productId !== !!bidPrice)) {
      setErrorMessage("Invalid URL - Both productId and bidPrice must be provided for auction bids");
      return;
    }

    if (productId && bidPrice) {
      try {
        const auctionBid: AuctionBidDto = {
          productId: productId,
          bidderId: await sdk.getCurrentUserProfileDetails().then(user => user.id),
          bidPrice: Number(bidPrice),
          paymentDetails: paymentDetails,
          shippingAddress: shippingAddress,
        };
        const bid = await orderHook.placeBid(productId, auctionBid);
        let possibleError = orderHook.error;
        if (possibleError) {
          setErrorMessage(possibleError ?? "Unexpected error occurred");
          return;
        }
        setAuctionSuccessMessage(bid);
      } catch (error: any) {
        setErrorMessage(error.msg ?? "Unexpected error occurred");
      } finally {
        setLoading(false);
      }

      return;
    }
    
    if (cartHook.loading || cartHook.error || !cartHook.cart) {
      return;
    }

    const createOrderRequest: OrderRequestDetails = {
      cart: cartHook.cart,
      paymentDetails: paymentDetails,
      shippingAddress: shippingAddress
    };

    try {
      const order = await orderHook.createOrder(createOrderRequest);
      let possibleError = await orderHook.error;
      if (possibleError) {
        setErrorMessage(possibleError ?? "Unexpected error occurred");
        return;
      }
      setSuccessMessage(order);
    } catch (error: any) {
      setErrorMessage(error.msg ?? "Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Payment Information
        </Typography>

        <Stack spacing={2} mt={2}>
          {/* I haven't made use of the update payment details since it uses a map and kinda complex */}
          <TextField
            required
            label="Card Owner Name"
            name="cardOwnerName"
            value={paymentDetails.paymentData["holder"]}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, paymentData: { ...paymentDetails.paymentData, "holder": e.target.value } })}
            fullWidth
            disabled={loading}
            error={!!errors?.holder}
            helperText={errors?.holder}
          />

          <TextField
            required
            label="Card Owner ID"
            name="cardOwnerId"
            value={paymentDetails.paymentData["id"]}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, paymentData: { ...paymentDetails.paymentData, "id": e.target.value } })}
            fullWidth
            disabled={loading}
            error={!!errors?.id}
            helperText={errors?.id}
          />

          <TextField
            required
            label="Card Number"
            name="cardNumber"
            value={paymentDetails.paymentData["card_number"]}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, paymentData: { ...paymentDetails.paymentData, "card_number": e.target.value } })}
            fullWidth
            disabled={loading}
            error={!!errors?.card_number}
            helperText={errors?.card_number}
          />

          <TextField
            required
            label="CVV"
            name="cvv"
            value={paymentDetails.paymentData["cvv"]}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, paymentData: { ...paymentDetails.paymentData, "cvv": e.target.value } })}
            fullWidth
            disabled={loading}
            error={!!errors?.cvv}
            helperText={errors?.cvv}
          />

          <TextField
            required
            label="Expiration Month"
            name="expirationMonth"
            value={paymentDetails.paymentData["month"]}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, paymentData: { ...paymentDetails.paymentData, "month": e.target.value } })}
            fullWidth
            disabled={loading}
            error={!!errors?.month}
            helperText={errors?.month}
          />

          <TextField
            required
            label="Expiration Year"
            name="expirationYear"
            value={paymentDetails.paymentData["year"]}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, paymentData: { ...paymentDetails.paymentData, "year": e.target.value } })}
            fullWidth
            disabled={loading}
            error={!!errors?.year}
            helperText={errors?.year}
          />

          <TextField
            required
            label="Payer Email"
            name="payerEmail"
            value={paymentDetails.payerEmail}
            onChange={handlePaymentEmailChange}
            fullWidth
            disabled={loading}
            error={!!errors?.payerEmail}
            helperText={errors?.payerEmail}
          />
        </Stack>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" gutterBottom>
          Shipping Address
        </Typography>

        <Stack spacing={2} mt={2}>
          <TextField
            label="Country"
            name="country"
            value={shippingAddress.country}
            onChange={handleShippingChange}
            fullWidth
            disabled={loading}
          />
          <TextField
            label="City"
            name="city"
            value={shippingAddress.city}
            onChange={handleShippingChange}
            fullWidth
            disabled={loading}
          />
          <TextField
            label="Region"
            name="region"
            value={shippingAddress.region}
            onChange={handleShippingChange}
            fullWidth
            disabled={loading}
          />
          <TextField
            label="Street"
            name="street"
            value={shippingAddress.street}
            onChange={handleShippingChange}
            fullWidth
            disabled={loading}
          />
          <TextField
            label="Zip Code"
            name="zipCode"
            value={shippingAddress.zipCode}
            onChange={handleShippingChange}
            fullWidth
            disabled={loading}
          />
          <TextField
            label="Home Number"
            name="homeNumber"
            value={shippingAddress.homeNumber}
            onChange={handleShippingChange}
            fullWidth
            disabled={loading}
          />
          <TextField
            label="Apartment Number"
            name="apartmentNumber"
            value={shippingAddress.apartmentNumber}
            onChange={handleShippingChange}
            fullWidth
            disabled={loading}
          />
          <TextField
            label="Mailbox"
            name="mailbox"
            value={shippingAddress.mailbox}
            onChange={handleShippingChange}
            fullWidth
            disabled={loading}
          />
        </Stack>

        <Stack spacing={2} mt={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!!success || !!auctionSuccess || loading}
            fullWidth
            sx={{ py: 1.5 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Purchase'
            )}
          </Button>
        </Stack>

        {success && (
            <Alert severity="success" sx={{ mt: 3 }}>
              Purchase successful! Transaction ID: {success.id}
            </Alert>
        )}

        {auctionSuccess && (
            <Alert severity="success" sx={{ mt: 3 }}>
              Successfully placed bid of: {auctionSuccess.bidPrice}
            </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}

        <Snackbar
          open={snackbarOpen}
          onClose={() => setSnackbarOpen(false)}
          autoHideDuration={4000}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            severity={snackbarSeverity} 
            sx={{ width: '100%' }}
            onClose={() => setSnackbarOpen(false)}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>

      </Paper>
    </Box>
  );
};

export default PaymentPage;