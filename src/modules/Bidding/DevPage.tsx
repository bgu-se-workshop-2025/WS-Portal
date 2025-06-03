import React, { useState } from 'react';
import { Box, Button, Paper, Stack, Typography, TextField } from '@mui/material';
import CreateBidRequestDialog from './CreateBidRequestDialog';

const DevPage: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [productId, setProductId] = useState('');
  const [storeId, setStoreId] = useState('');

  return (
    <Box sx={{ p: 4 }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
        <Typography variant="h5" gutterBottom>
          Dev Page – Trigger Bid Request Dialog
        </Typography>

        <Stack spacing={2} mt={2}>
          <TextField
            label="Product ID"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            fullWidth
          />
          <TextField
            label="Store ID"
            value={storeId}
            onChange={(e) => setStoreId(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={() => setDialogOpen(true)}
            disabled={!productId || !storeId}
          >
            Open Dialog
          </Button>
        </Stack>
      </Paper>

      <CreateBidRequestDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        productId={productId}
        storeId={storeId}
      />
    </Box>
  );
};

export default DevPage;
