import React from "react";
import { TextField, Stack } from "@mui/material";
import { PaymentDetails } from "../../shared/types/dtos";
import { PaymentDetailsErrors } from "../../shared/types/dtos";

interface Props {
  paymentDetails: PaymentDetails;
  onChange: (details: PaymentDetails) => void;
  disabled?: boolean;
  errors?: PaymentDetailsErrors;
}

const PaymentDetailsForm: React.FC<Props> = ({ paymentDetails: paymentDetails, onChange, errors}) => {
  const setPaymentDetails = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value: fieldValue } = e.target;
    if (name === "payerEmail") {
      onChange({ ...paymentDetails, payerEmail: fieldValue });
    } else {
      onChange({ ...paymentDetails, paymentData: { ...paymentDetails.paymentData, [name]: fieldValue } });
    }
  };

  return (
    <form>
      <Stack spacing={2}>
          <TextField
              required
              label="Card Owner Name"
              name="holder"
              value={paymentDetails.paymentData["holder"] || ""}
              onChange={setPaymentDetails}
              fullWidth
              error={!!errors?.holder}
              helperText={errors?.holder}
          />
          <TextField
            required
            label="Card Owner ID"
            name="id"
            value={paymentDetails.paymentData["id"] || ""}
            onChange={setPaymentDetails}
            fullWidth
            error={!!errors?.holder}
            helperText={errors?.holder}
          />
          <TextField
            required
            label="Card Number"
            name="card_number"
            value={paymentDetails.paymentData["card_number"] || ""}
            onChange={setPaymentDetails}
            fullWidth
            error={!!errors?.holder}
            helperText={errors?.holder}
          />
          <TextField
            required
            label="CVV"
            name="cvv"
            value={paymentDetails.paymentData["cvv"] || ""}
            onChange={setPaymentDetails}
            fullWidth
            error={!!errors?.holder}
            helperText={errors?.holder}
          />
          <TextField
            required
            label="Expiration Month"
            name="month"
            value={paymentDetails.paymentData["month"] || ""}
            onChange={setPaymentDetails}
            fullWidth
            error={!!errors?.holder}
            helperText={errors?.holder}
          />
          <TextField
            required
            label="Expiration Year"
            name="year"
            value={paymentDetails.paymentData["year"] || ""}
            onChange={setPaymentDetails}
            fullWidth
            error={!!errors?.holder}
            helperText={errors?.holder}
          />
          <TextField
            required
            label="Payer Email"
            name="payerEmail"
            value={paymentDetails.payerEmail || ""}
            onChange={setPaymentDetails}
            fullWidth
            error={!!errors?.holder}
            helperText={errors?.holder}
          />
      </Stack>
    </form>
  );
};

export default PaymentDetailsForm;