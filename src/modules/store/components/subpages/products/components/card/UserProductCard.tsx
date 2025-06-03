import React, { useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  useTheme,
  Box,
  CircularProgress,
} from "@mui/material";

import { ProductDto } from "../../../../../../../shared/types/dtos";
import useCart from "../../../../../../../shared/hooks/useCart";
import RatingComponent from "../../../../../../../shared/components/RatingComponent";
import { sdk, isAuthenticated } from "../../../../../../../sdk/sdk";

const UserProductCard: React.FC<{
  product: ProductDto;
  setUpdateProducts?: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ product, setUpdateProducts }) => {
  const theme = useTheme();
  const {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    loading: cartLoading,
    error: cartError,
  } = useCart();

  const { storeId } = useParams<{ storeId: string }>();
  const isUserAuthenticated = isAuthenticated();

  // Find current quantity of this product in the cart (for this store)
  const currentQty = useMemo(() => {
    if (!cart) return 0;
    const basket = cart.stores.find((s) => s.storeId === storeId);
    if (!basket) return 0;
    const entry = basket.products.find((e) => e.productId === product.id);
    return entry?.quantity ?? 0;
  }, [cart, storeId, product.id]);

  // When incrementing: if currentQty === 0, call addToCart; otherwise updateQuantity
  const handleIncrement = useCallback(async () => {
    if (currentQty === product.quantity) {
      console.log(
        `Cannot add ${product.name} to cart: already at max quantity (${product.quantity})`
      );
      return;
    }
    if (currentQty === 0) {
      await addToCart(storeId as string, product.id, 1);
      console.log(`Added ${product.name} to cart (quantity = 1)`);
    } else {
      await updateQuantity(storeId as string, product.id, currentQty + 1);
      console.log(
        `Increased ${product.name} quantity to ${currentQty + 1} in cart`
      );
    }
  }, [addToCart, currentQty, product.id, product.name, updateQuantity]);

  // When decrementing: if currentQty <= 1, remove entirely; otherwise updateQuantity
  const handleDecrement = useCallback(async () => {
    if (currentQty <= 1) {
      await removeFromCart(storeId as string, product.id);
      console.log(`Removed ${product.name} from cart`);
    } else {
      await updateQuantity(storeId as string, product.id, currentQty - 1);
      console.log(
        `Decreased ${product.name} quantity to ${currentQty - 1} in cart`
      );
    }
  }, [currentQty, product.id, product.name, removeFromCart, updateQuantity]);

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: theme.shape.borderRadius * 2,
        boxShadow: theme.shadows[1],
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom noWrap sx={{ fontWeight: 500 }}>
          {product.name}
        </Typography>
        <Typography
          variant="body2"
          paragraph
          noWrap
          sx={{ color: theme.palette.text.secondary }}
        >
          {product.description}
        </Typography>

        <Box sx={{ mb: theme.spacing(1) }}>
          <Typography variant="body2">
            <strong>Price:</strong> ${product.price.toFixed(2)}
          </Typography>
          <Typography variant="body2">
            <strong>Available:</strong> {product.quantity}
          </Typography>
        </Box>

        {product.categories.length > 0 && (
          <Typography variant="body2">
            <strong>Categories:</strong> {product.categories.join(", ")}
          </Typography>
        )}
        {product.auctionEndDate && (
          <Typography variant="body2" sx={{ mt: theme.spacing(1) }}>
            <strong>Auction Ends:</strong>{" "}
            {new Date(product.auctionEndDate).toLocaleString()}
          </Typography>
        )}

        <Box
          sx={{
            mb: theme.spacing(1),
            mt: theme.spacing(2),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <RatingComponent
            value={product.rating}
            readOnly={!isUserAuthenticated}
            size="small"
            precision={1}
            onChange={async (newValue) => {
              if (!isUserAuthenticated) return;
              if (!storeId) return;
              try {
                await sdk.createProductReview({
                  id: null,
                  productId: product.id,
                  storeId: storeId,
                  writerId: null,
                  title: null,
                  body: null,
                  rating: Math.round(newValue),
                  date: null,
                });
                setUpdateProducts && setUpdateProducts((v) => !v);
                alert("Thank you for rating the product!");
              } catch (err: any) {
                const msg = "You must purchase this product before you can rate it.";
                alert(msg);
              }
            }}
          />
          <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
            {product.rating > 0 ? `(${product.rating.toFixed(1)})` : ""}
          </Typography>
        </Box>

        {cartError && (
          <Typography
            variant="caption"
            color="error"
            sx={{ mt: theme.spacing(1), display: "block" }}
          >
            {cartError}
          </Typography>
        )}
      </CardContent>

      <CardActions
        sx={{
          justifyContent: "center",
          alignItems: "center",
          px: theme.spacing(2),
          pb: theme.spacing(2),
        }}
      >
        <Button
          size="small"
          variant="outlined"
          onClick={handleDecrement}
          disabled={cartLoading || currentQty === 0}
          sx={{ minWidth: 32, p: 0 }}
        >
          –
        </Button>

        <Box
          sx={{
            width: 32,
            textAlign: "center",
            mx: theme.spacing(1),
          }}
        >
          <Typography variant="body2">{currentQty}</Typography>
        </Box>

        <Button
          size="small"
          variant="outlined"
          onClick={handleIncrement}
          disabled={cartLoading}
          sx={{ minWidth: 32, p: 0 }}
        >
          +
        </Button>

        {cartLoading && (
          <CircularProgress size={20} sx={{ ml: theme.spacing(1) }} />
        )}
      </CardActions>
    </Card>
  );
};

export default UserProductCard;
