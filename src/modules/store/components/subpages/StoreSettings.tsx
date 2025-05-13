import React from "react";
import { Typography, Box } from "@mui/material";

const StoreSettings: React.FC<{ storeId?: string }> = ({ storeId }) => {
  return (
    <Box mt={2}>
      <Typography variant="h5" fontWeight="600" color="primary" display="flex" alignItems="center" gap={1}>
        ⚙️ Store Settings for store ID: {storeId}
      </Typography>
    </Box>
  );
};

export default StoreSettings;
