import React from "react";
import { Typography, Box } from "@mui/material";

const StoreProducts: React.FC<{ storeId?: string }> = ({ storeId }) => {
  return (
    <Box mt={2}>
      <Typography
        variant="h5"
        fontWeight={600}
        color="primary"
        display="flex"
        alignItems="center"
        gap={1}
      >
        📦 Store Products for store ID: {storeId}
      </Typography>
    </Box>
  );
};

export default StoreProducts;
