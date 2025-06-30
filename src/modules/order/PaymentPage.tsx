import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
  Alert,
  Divider,
  CircularProgress,
} from '@mui/material';
import { OrderRequestDetails, PaymentDetails, ShippingAddressDto, UserOrderDto } from '../../shared/types/dtos';
import useCart from '../../shared/hooks/useCart';
import useOrder from './hooks/useOrder';
import ShippingAddressForm from "./ShippingAddressForm";
import PaymentDetailsForm from "./PaymentDetailsForm";
import { PaymentDetailsErrors } from "../../shared/types/dtos";
import { validatePaymentDetails } from "../../shared/utils/validatePaymentDetails";

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

  const [paymentErrors, setPaymentErrors] = useState<PaymentDetailsErrors>({});

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
    if (cartHook.loading || cartHook.error || !cartHook.cart || orderHook.loading) {
      return;
    }
    
    const errors = validatePaymentDetails(paymentDetails);
    setPaymentErrors(errors);
    if (Object.keys(errors).length > 0) {
      setError("Please fix the payment details errors before proceeding.");
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

        <PaymentDetailsForm
          paymentDetails={paymentDetails}
          onChange={setPaymentDetails}
          disabled={loading}
          errors={paymentErrors}
        />

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" gutterBottom>
          Shipping Address
        </Typography>

        <ShippingAddressForm
          shippingAddress={shippingAddress}
          onChange={setShippingAddress}
          disabled={loading}
        />

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
