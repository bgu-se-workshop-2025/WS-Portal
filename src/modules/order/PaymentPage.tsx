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
} from '@mui/material';
import { OrderRequestDetails, BidOrderRequestDetails, PaymentDetails, ShippingAddressDto, UserOrderDto } from '../../shared/types/dtos';
import useCart from '../../shared/hooks/useCart';
import useOrder from './hooks/useOrder';

const PaymentPage: React.FC = () => {
  const cartHook = useCart();
  const orderHook = useOrder();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<UserOrderDto | undefined>(undefined);

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    externalId: "",
    payerEmail: "",
    payerId: "",
    paymentData: { "currency": "ILS" }
  });

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

  // read bidId param if present
  const params = new URLSearchParams(location.search);
  const bidId = params.get("bidId");

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
    if (cartHook.loading || cartHook.error || !cartHook.cart || orderHook.loading) {
      return;
    }

    if(bidId) {
        // Bid purchase flow
        const bidOrder: BidOrderRequestDetails = {
          bidId,
          paymentDetails,
          shippingAddress,
        };

        try {
          const order = await orderHook.createOrderForBid(bidOrder);
          setSuccess(order);
          console.log("Order with bid created:", order);
        } catch (error: any) {
          setError(error.msg ?? "Unexpected error occurred");
        } finally {
          setLoading(false);
        }
    }

    else {
      const createOrderRequest: OrderRequestDetails = {
      cart: cartHook.cart,
      paymentDetails: paymentDetails,
      shippingAddress: shippingAddress
      };

      try {
        const order = await orderHook.createOrder(createOrderRequest);
        setSuccess(order);
        console.log("Order created:", order);
      } catch (error: any) {
        setError(error.msg ?? "Unexpected error occurred");
      } finally {
        setLoading(false);
      }
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
          />

          <TextField
            required
            label="Card Owner ID"
            name="cardOwnerId"
            value={paymentDetails.paymentData["id"]}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, paymentData: { ...paymentDetails.paymentData, "id": e.target.value } })}
            fullWidth
            disabled={loading}
          />

          <TextField
            required
            label="Card Number"
            name="cardNumber"
            value={paymentDetails.paymentData["card_number"]}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, paymentData: { ...paymentDetails.paymentData, "card_number": e.target.value } })}
            fullWidth
            disabled={loading}
          />

          <TextField
            required
            label="CVV"
            name="cvv"
            value={paymentDetails.paymentData["cvv"]}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, paymentData: { ...paymentDetails.paymentData, "cvv": e.target.value } })}
            fullWidth
            disabled={loading}
          />

          <TextField
            required
            label="Expiration Month"
            name="expirationMonth"
            value={paymentDetails.paymentData["month"]}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, paymentData: { ...paymentDetails.paymentData, "month": e.target.value } })}
            fullWidth
            disabled={loading}
          />

          <TextField
            required
            label="Expiration Year"
            name="expirationYear"
            value={paymentDetails.paymentData["year"]}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, paymentData: { ...paymentDetails.paymentData, "year": e.target.value } })}
            fullWidth
            disabled={loading}
          />

          <TextField
            required
            label="Payer Email"
            name="payerEmail"
            value={paymentDetails.payerEmail}
            onChange={handlePaymentEmailChange}
            fullWidth
            disabled={loading}
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
            disabled={loading}
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
            Purchase {(bidId ? "from bid " : "")}successful! Transaction ID: {success.id}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default PaymentPage;
