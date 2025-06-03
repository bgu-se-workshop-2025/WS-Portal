import React, { useMemo, useCallback } from "react";
import {
  Typography,
  Button,
  Stack,
  Snackbar,
  Paper,
  CircularProgress,
} from "@mui/material";
import { ProductDto } from "../../shared/types/dtos";
import useCart from "../../shared/hooks/useCart";

interface CartProductItemProps {
  product: ProductDto;
  quantity: number;
  onQuantityChange: () => void;
}

const CartProductItem: React.FC<CartProductItemProps> = ({
  product,
  onQuantityChange,
}) => {
  const {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    loading: cartLoading,
    error: cartError,
  } = useCart();

  const currentQty = useMemo(() => {
    if (!cart) return 0;
    const storeEntry = cart.stores.find((store) =>
      store.products.some((p) => p.productId === product.id)
    );
    const productEntry = storeEntry?.products.find((p) => p.productId === product.id);
    return productEntry?.quantity ?? 0;
  }, [cart, product.id]);

  const handleIncrement = useCallback(async () => {
    if (currentQty === 0) {
      await addToCart(product.id, 1);
    } else {
      await updateQuantity(product.id, currentQty + 1);
    }
    onQuantityChange();
  }, [addToCart, updateQuantity, currentQty, product.id, onQuantityChange]);

  const handleDecrement = useCallback(async () => {
    if (currentQty <= 1) {
      await removeFromCart(product.id);
    } else {
      await updateQuantity(product.id, currentQty - 1);
    }
    onQuantityChange();
  }, [removeFromCart, updateQuantity, currentQty, product.id, onQuantityChange]);

  const handleRemove = useCallback(async () => {
    await removeFromCart(product.id);
    onQuantityChange();
  }, [removeFromCart, product.id, onQuantityChange]);

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

      <Typography
        variant="body2"
        gutterBottom
        sx={{ color: "#003366", fontWeight: 600 }}
      >
        Price: ${product.price}
      </Typography>

      <Stack direction="row" spacing={1.5} alignItems="center" mt={2}>
        <Button
          variant="outlined"
          onClick={handleDecrement}
          disabled={cartLoading || currentQty === 0}
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

        <Typography fontWeight={600}>{currentQty}</Typography>

        <Button
          variant="outlined"
          onClick={handleIncrement}
          disabled={cartLoading}
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
          disabled={cartLoading}
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

        {cartLoading && <CircularProgress size={20} sx={{ ml: 1 }} />}
      </Stack>

      {cartError && (
        <Snackbar
          open={true}
          message={cartError}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          ContentProps={{
            sx: {
              backgroundColor: "#ffe0e0",
              color: "#b22222",
              fontWeight: 500,
              px: 3,
              py: 1.5,
              borderRadius: "12px",
              boxShadow: 3,
            },
          }}
        />
      )}
    </Paper>
  );
};

export default CartProductItem;
