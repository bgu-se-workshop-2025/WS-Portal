import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  Alert,
  Divider,
  CircularProgress,
} from '@mui/material';
import { OrderRequestDetails, PaymentDetails, PaymentMethod, ShippingAddressDto, UserOrderDto } from '../../shared/types/dtos';
import useCart from '../../shared/hooks/useCart';
import useOrder from './hooks/useOrder';

const paymentMethods = [
  { label: 'Credit Card', value: PaymentMethod.CREDIT_CARD },
  { label: 'PayPal', value: PaymentMethod.PAYPAL },
  { label: 'Apple Pay', value: PaymentMethod.APPLE_PAY },
  { label: 'Google Pay', value: PaymentMethod.GOOGLE_PAY },
];

const PaymentPage: React.FC = () => {
  const cartHook = useCart();
  const orderHook = useOrder();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<UserOrderDto | undefined>(undefined);

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    paymentMethod: PaymentMethod.CREDIT_CARD,
    externalId: "",
    payerEmail: "",
    payerId: "",
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

  useEffect(() => {
    setLoading(cartHook.loading)
    setError(cartHook.error ?? "")
  }, [cartHook.loading, cartHook.error]);

  const handlePaymentDetailsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const choice = event.target.value;
    const options = paymentMethods.filter((item) => item.label === choice);
    if (options.length === 1) {
      setPaymentDetails({ ...paymentDetails, paymentMethod: options[0].value })
    }
  };

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
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Payment Information
        </Typography>

        <Stack spacing={2} mt={2}>
          <TextField
            select
            label="Payment Method"
            name="paymentMethod"
            value={paymentDetails.paymentMethod}
            onChange={handlePaymentDetailsChange}
            fullWidth
            disabled={loading}
          >
            {paymentMethods.map(method => (
              <MenuItem key={method.value} value={method.value}>
                {method.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
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
            Purchase successful! Transaction ID: {success.id}
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
