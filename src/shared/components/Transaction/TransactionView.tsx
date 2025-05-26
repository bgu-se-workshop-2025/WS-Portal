import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Divider,
} from '@mui/material';

export enum PaymentMethod {
  creditCard = 0,
  paypal = 1,
  applePay = 2,
  googlePay = 3,
}

export interface PaymentDetails {
  payerName: string;
  payerEmail: string;
  paymentMethod: PaymentMethod;
  externalId: string;
}

export interface ShippingAddress {
  country: string;
  city: string;
  region?: string;
  street: string;
  zipCode: string;
  homeNumber: string;
  apartmentNumber?: string;
  mailbox?: string;
}

export interface TransactionViewProps {
  buyerName: string;
  dateTime: string;
  paymentDetails: PaymentDetails;
  shippingAddress: ShippingAddress;
}

export const getPaymentMethodLabel = (method: PaymentMethod): string => {
  switch (method) {
    case PaymentMethod.creditCard:
      return 'Credit Card';
    case PaymentMethod.paypal:
      return 'PayPal';
    case PaymentMethod.applePay:
      return 'Apple Pay';
    case PaymentMethod.googlePay:
      return 'Google Pay';
    default:
      return 'Unknown';
  }
};

const TransactionView: React.FC<TransactionViewProps> = ({
  buyerName,
  dateTime,
  paymentDetails,
  shippingAddress,
}) => {
  return (
    <Paper
      elevation={3}
      sx={{
        width: '100%',
        maxWidth: 800,
        px: 3,
        py: 1.5,
        borderRadius: 2,
        backgroundColor: '#f3f4ff',
        margin: 'auto',
        mt: 4,
      }}
    >
      <Stack spacing={2}>
        {/* Buyer Information */}
        <Box>
          <Typography variant="subtitle1" fontWeight={500}>
            Buyer Information
          </Typography>
          <Typography variant="body2">{buyerName}</Typography>
        </Box>

        <Divider />

        {/* Transaction Date */}
        <Box>
          <Typography variant="subtitle1" fontWeight={500}>
            Transaction Date
          </Typography>
          <Typography variant="body2">{dateTime}</Typography>
        </Box>

        <Divider />

        {/* Payment Details */}
        <Box>
          <Typography variant="subtitle1" fontWeight={500}>
            Payment Details
          </Typography>
          <Typography variant="body2">
            <strong>Payer Name:</strong> {paymentDetails.payerName}
          </Typography>
          <Typography variant="body2">
            <strong>Payer Email:</strong> {paymentDetails.payerEmail}
          </Typography>
          <Typography variant="body2">
            <strong>Payment Method:</strong> {getPaymentMethodLabel(paymentDetails.paymentMethod)}
          </Typography>
          <Typography variant="body2">
            <strong>External ID:</strong> {paymentDetails.externalId}
          </Typography>
        </Box>

        <Divider />

        {/* Shipping Address */}
        <Box>
          <Typography variant="subtitle1" fontWeight={500}>
            Shipping Address
          </Typography>
          <Typography variant="body2">
            {shippingAddress.street} {shippingAddress.homeNumber}
            {shippingAddress.apartmentNumber ? `, Apt ${shippingAddress.apartmentNumber}` : ''}
            {shippingAddress.mailbox ? `, Mailbox ${shippingAddress.mailbox}` : ''}
          </Typography>
          <Typography variant="body2">
            {shippingAddress.city}
            {shippingAddress.region ? `, ${shippingAddress.region}` : ''}, {shippingAddress.zipCode}
          </Typography>
          <Typography variant="body2">{shippingAddress.country}</Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

export default TransactionView;
