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
import { useNavigate } from 'react-router-dom';
import {
  PaymentMethod,
  OrderRequestDetails,
  PaymentDetails,
  ShippingAddressDto,
  UserOrderDto,
  CartDto,
} from '../../shared/types/dtos';
import { sdk } from '../../sdk/sdk';

const paymentMethods = [
  { label: 'Credit Card', value: PaymentMethod.CREDIT_CARD },
  { label: 'PayPal', value: PaymentMethod.PAYPAL },
  { label: 'Apple Pay', value: PaymentMethod.APPLE_PAY },
  { label: 'Google Pay', value: PaymentMethod.GOOGLE_PAY },
];

// ✅ Toggle this to use mock data or real cart from sdk
const useMockCart = true;

const mockCart: CartDto = {
  ownerId: '123e4567-e89b-12d3-a456-426614174000',
  stores: [
    {
      storeId: '11111111-1111-1111-1111-111111111111',
      products: [
        { productId: 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', quantity: 2 },
        { productId: 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb', quantity: 1 },
      ],
    },
    {
      storeId: '22222222-2222-2222-2222-222222222222',
      products: [
        { productId: 'ccccccc3-cccc-cccc-cccc-cccccccccccc', quantity: 3 },
      ],
    },
  ],
};

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();

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
      const cart = useMockCart ? mockCart : await sdk.getCart();

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

  const handleBack = () => {
    navigate('/back'); // Replace with your actual back path
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

          <Button
            variant="contained"
            color="error"
            onClick={handleBack}
            fullWidth
            sx={{ py: 1.5 }}
            disabled={loading}
          >
            Back
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
