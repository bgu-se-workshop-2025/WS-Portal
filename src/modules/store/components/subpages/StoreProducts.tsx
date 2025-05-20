// import React, { useState, useEffect } from 'react';

// interface StoreProductsProps {
//     storeId: string;
// }

// const StoreProducts: React.FC<StoreProductsProps> = ({storeId}) => {
//   return (
//     <div>
//       <h1>Store Products</h1>
//       <p>This is the Store Products page.</p>
//     </div>
//   );
// }

// export default StoreProducts;


import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';                    // Updated import for v7 :contentReference[oaicite:2]{index=2}
import { Box, Typography, CircularProgress } from '@mui/material';

interface Product {
  id: string;
  name: string;
  imageUrl: string;
}

interface StoreProductsProps {
  storeId: string;
}

const StoreProducts: React.FC<StoreProductsProps> = ({ storeId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts([
        { id: '1', name: 'Product A', imageUrl: '' },
        { id: '2', name: 'Product B', imageUrl: '' },
        { id: '3', name: 'Product C', imageUrl: '' },
      ]);
      setLoading(false);
    }, 1000);
  }, [storeId]);

  const handleClick = (productId: string) => {
    console.log('Clicked product:', productId);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Store Products
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid
              key={product.id}
              size={{ xs: 4, sm: 3, md: 2, sx={{ display: 'flex', justifyContent: 'center' }} }}            // Breakpoint sizing via `size` prop :contentReference[oaicite:3]{index=3}
            >
              <Box
                onClick={() => handleClick(product.id)}
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  bgcolor: 'grey.300',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  textAlign: 'center',
                  mx: 'auto',
                }}
              >
                <Typography variant="body2">
                  {product.name}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default StoreProducts;
