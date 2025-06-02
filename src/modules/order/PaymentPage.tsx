import React, { useState } from 'react';
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

import {
  PaymentMethod,
  OrderRequestDetails,
  PaymentDetails,
  ShippingAddressDto,
  UserOrderDto,
} from '../../shared/types/dtos';
import { sdk } from '../../sdk/sdk';

const paymentMethods = [
  { label: 'Credit Card', value: PaymentMethod.CREDIT_CARD },
  { label: 'PayPal', value: PaymentMethod.PAYPAL },
  { label: 'Apple Pay', value: PaymentMethod.APPLE_PAY },
  { label: 'Google Pay', value: PaymentMethod.GOOGLE_PAY },
];

const PaymentPage: React.FC = () => {
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    paymentMethod: PaymentMethod.CREDIT_CARD,
    externalId: '',
    payerEmail: '',
    payerId: '',
  });

  const [shippingAddress, setShippingAddress] = useState<ShippingAddressDto>({
    country: '',
    city: '',
    region: '',
    street: '',
    zipCode: '',
    homeNumber: '',
    apartmentNumber: '',
    mailbox: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<UserOrderDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({
      ...prev,
      [name]: name === 'paymentMethod' ? Number(value) : value,
    }));
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const cart = await sdk.getCart();
      const orderRequest: OrderRequestDetails = {
        cart,
        paymentDetails,
        shippingAddress,
      };
      const result = await sdk.createOrder(orderRequest);
      setSuccess(result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
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
            onChange={handlePaymentChange}
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
            label="External Payment ID"
            name="externalId"
            value={paymentDetails.externalId}
            onChange={handlePaymentChange}
            fullWidth
            disabled={loading}
          />
          <TextField
            label="Payer Email"
            name="payerEmail"
            value={paymentDetails.payerEmail}
            onChange={handlePaymentChange}
            fullWidth
            disabled={loading}
          />
          <TextField
            label="Payer ID"
            name="payerId"
            value={paymentDetails.payerId}
            onChange={handlePaymentChange}
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

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
          fullWidth
          sx={{ mt: 4, py: 1.5 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Purchase'}
        </Button>

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
