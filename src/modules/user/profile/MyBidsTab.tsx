import React from "react";
import { UserProfileTabProps } from "./UserProfileTabs";
import { Box, Typography, Stack, Button } from "@mui/material";

const MyBidsTab: React.FC<UserProfileTabProps> = () => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#58a6ff', fontSize: { xs: 20, sm: 24 } }}>
        Bids
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={2}>
        <Button
          variant="contained"
          color="primary"
          sx={{ minWidth: 180, fontSize: { xs: 14, sm: 16 } }}
          href="#BID_REQUESTS_PAGE_URL"
        >
          View Bid Requests
        </Button>
        <Button
          variant="contained"
          color="secondary"
          sx={{ minWidth: 180, fontSize: { xs: 14, sm: 16 } }}
          href="#APPROVED_BIDS_PAGE_URL"
        >
          View Approved Bids
        </Button>
      </Stack>
    </Box>
  );
};

export default MyBidsTab;
