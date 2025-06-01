import React from "react";
import { Box, Typography } from "@mui/material";

const PaymentPage: React.FC = () => {
  return (
    <Box p={4} display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Typography variant="h4" color="primary">
        ✅ You reached the payment page!
      </Typography>
    </Box>
  );
};

export default PaymentPage;
