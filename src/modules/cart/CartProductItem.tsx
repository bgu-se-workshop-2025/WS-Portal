import React, { useState } from "react";
import { ProductDto } from "../../shared/types/dtos";
import { sdk } from "../../sdk/sdk";
import {
  Typography,
  Button,
  Stack,
  Snackbar,
  Paper,
} from "@mui/material";

interface CartProductItemProps {
  product: ProductDto;
  quantity: number;
  onQuantityChange: () => void;
}

const CartProductItem: React.FC<CartProductItemProps> = ({
  product,
  quantity,
  onQuantityChange,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRemove = async () => {
    try {
      await sdk.removeProductFromCart(product.id);
      onQuantityChange();
    } catch (error: any) {
      console.error("Error removing product:", error);
      setErrorMessage(error.message || "Failed to remove product from cart.");
    }
  };

  const handleUpdate = async (newQty: number) => {
    try {
      if (newQty <= 0) return handleRemove();
      await sdk.updateProductInCart(product.id, { quantity: newQty });
      onQuantityChange();
    } catch (error: any) {
      console.error("Error updating product quantity:", error);
      setErrorMessage(error.message || "Failed to update product quantity.");
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 3,
        p: 3,
        backgroundColor: "#ffffff",
        border: "1px solid #e0e0e0",
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: 3 },
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ color: "#003366" }}>
        {product.name}
      </Typography>

      <Typography variant="body2" gutterBottom sx={{ color: "#555" }}>
        {product.description}
      </Typography>

      <Typography variant="body2" gutterBottom sx={{ color: "#003366", fontWeight: 600 }}>
        Price: ${product.price}
      </Typography>

      <Stack direction="row" spacing={1.5} alignItems="center" mt={2}>
        <Button
          variant="outlined"
          onClick={() => handleUpdate(quantity - 1)}
          sx={{
            minWidth: 36,
            borderColor: "#003366",
            color: "#003366",
            "&:hover": {
              backgroundColor: "#e0f0ff",
              borderColor: "#002244",
            },
          }}
        >
          −
        </Button>

        <Typography fontWeight={600}>{quantity}</Typography>

        <Button
          variant="outlined"
          onClick={() => handleUpdate(quantity + 1)}
          sx={{
            minWidth: 36,
            borderColor: "#003366",
            color: "#003366",
            "&:hover": {
              backgroundColor: "#e0f0ff",
              borderColor: "#002244",
            },
          }}
        >
          +
        </Button>

        <Button
          variant="outlined"
          onClick={handleRemove}
          sx={{
            color: "#b22222",
            borderColor: "#b22222",
            "&:hover": {
              backgroundColor: "#fbeaea",
              borderColor: "#a71d1d",
            },
          }}
        >
          Remove
        </Button>
      </Stack>

      <Snackbar
      open={!!errorMessage}
      autoHideDuration={4000}
      onClose={() => setErrorMessage(null)}
      message={errorMessage}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      ContentProps={{
        sx: {
          backgroundColor: "#ffe0e0",     // Light red background
          color: "#b22222",               // Dark red text
          fontWeight: 500,
          px: 3,
          py: 1.5,
          borderRadius: "12px",
          boxShadow: 3,
        },
      }}
    />

    </Paper>
  );
};

export default CartProductItem;
