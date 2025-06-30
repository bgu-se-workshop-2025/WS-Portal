import { PaymentDetails, PaymentDetailsErrors } from "../types/dtos";

export function validatePaymentDetails(paymentDetails: PaymentDetails): PaymentDetailsErrors {
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