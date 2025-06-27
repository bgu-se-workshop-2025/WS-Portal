import React, { useMemo, useCallback, useState } from "react";
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
  Divider,
} from "@mui/material";

import { ProductDto } from "../../../../../../../shared/types/dtos";
import useCart from "../../../../../../../shared/hooks/useCart";
import RatingComponent from "../../../../../../../shared/components/RatingComponent";
import { sdk, isAuthenticated } from "../../../../../../../sdk/sdk";
import CreateBidRequestDialog from "../../../../../../Bidding/CreateBidRequestDialog";

const UserProductCard: React.FC<{
  product: ProductDto;
  setUpdateProducts?: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ product, setUpdateProducts }) => {
  const theme = useTheme();
  const [bidDialogOpen, setBidDialogOpen] = useState(false);

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

  const currentQty = useMemo(() => {
    if (!cart) return 0;
    const basket = cart.stores.find((s) => s.storeId === storeId);
    if (!basket) return 0;
    const entry = basket.products.find((e) => e.productId === product.id);
    return entry?.quantity ?? 0;
  }, [cart, storeId, product.id]);

  const handleIncrement = useCallback(async () => {
    if (currentQty === product.quantity) return;
    if (currentQty === 0) {
      await addToCart(storeId as string, product.id, 1);
    } else {
      await updateQuantity(storeId as string, product.id, currentQty + 1);
    }
  }, [addToCart, currentQty, product.id, updateQuantity]);

  const handleDecrement = useCallback(async () => {
    if (currentQty <= 1) {
      await removeFromCart(storeId as string, product.id);
    } else {
      await updateQuantity(storeId as string, product.id, currentQty - 1);
    }
  }, [currentQty, product.id, removeFromCart, updateQuantity]);

  return (
    <>
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
              readOnly={true}
              size="small"
              precision={0.1}
            />
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
            justifyContent: "space-between",
            alignItems: "center",
            px: theme.spacing(2),
            pb: theme.spacing(2),
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={handleDecrement}
              disabled={cartLoading || currentQty === 0}
              sx={{ minWidth: 32, p: 0 }}
            >
              –
            </Button>

            <Box sx={{ width: 32, textAlign: "center", mx: theme.spacing(1) }}>
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
          </Box>

          {isUserAuthenticated && (
            <>
              <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={() => setBidDialogOpen(true)}
              >
                Bid
              </Button>
            </>
          )}
        </CardActions>
      </Card>

      {storeId && (
        <CreateBidRequestDialog
          open={bidDialogOpen}
          onClose={() => setBidDialogOpen(false)}
          productId={product.id}
          storeId={storeId}
        />
      )}
    </>
  );
};

export default UserProductCard;