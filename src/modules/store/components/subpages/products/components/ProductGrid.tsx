import React from "react";
import {
  Grid,
  Box,
  Typography,
  Skeleton,
  Alert,
  useTheme,
} from "@mui/material";
import { ProductDto } from "../../../../../../shared/types/dtos";
import ProductCard from "./card/ProductCard";

export interface ProductsGridProps {
  products: ProductDto[] | undefined;
  loading: boolean;
  error?: string;
  setUpdateProducts: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProductsGrid: React.FC<ProductsGridProps> = ({
  products,
  loading,
  error,
  setUpdateProducts,
}) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Grid container spacing={3}>
        {Array.from({ length: 6 }).map((_, idx) => (
          <Grid key={idx} container size={{ xs: 12, sm: 6, md: 4 }}>
            <Box
              sx={{
                height: "100%",
                borderRadius: theme.shape.borderRadius * 2,
                boxShadow: theme.shadows[1],
                overflow: "hidden",
              }}
            >
              <Box sx={{ p: theme.spacing(2) }}>
                <Skeleton variant="text" width="60%" height={32} />
                <Skeleton variant="text" width="80%" height={24} />
                <Skeleton variant="text" width="40%" height={24} />
                <Skeleton
                  variant="rectangular"
                  height={24}
                  sx={{ my: 1, borderRadius: 1 }}
                />
                <Skeleton variant="text" width="50%" height={20} />
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: theme.spacing(2) }}>
        {error}
      </Alert>
    );
  }

  if (!products || products.length === 0) {
    return <Typography>No products found.</Typography>;
  }

  return (
    <Grid container spacing={3}>
      {products.map((p) => (
        <Grid key={p.id} container size={{ xs: 12, sm: 6, md: 4 }}>
          <ProductCard product={p} setUpdateProducts={setUpdateProducts} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductsGrid;
