import React, { useMemo, useCallback, useState, useEffect } from "react";
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
import { isAuthenticated, sdk } from "../../../../../../../sdk/sdk";
import CreateBidRequestDialog from "../../../../../../Bidding/CreateBidRequestDialog";
import AuctionProductCard from "./AuctionProductCard";

interface ExtendedProductDto extends ProductDto {
  storeName?: string;
  storeRating?: number;
}

const UserProductCard: React.FC<{
  product: ExtendedProductDto;
  setUpdateProducts?: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ product, setUpdateProducts }) => {
  const theme = useTheme();
  const [bidDialogOpen, setBidDialogOpen] = useState(false);
  const [isSellerOfStore, setIsSellerOfStore] = useState(false);

  const {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    loading: cartLoading,
    error: cartError,
  } = useCart();

  const { storeId: urlStoreId } = useParams<{ storeId: string }>();
  const isUserAuthenticated = isAuthenticated();
  
  // Use product's storeId (always available), fallback to URL parameter for backward compatibility
  const storeId = product.storeId || urlStoreId;

  // Check if current user is a seller of this product's store
  useEffect(() => {
    const checkIfSeller = async () => {
      if (!storeId || !isUserAuthenticated) {
        setIsSellerOfStore(false);
        return;
      }

      try {
        const currentUser = await sdk.getCurrentUserProfileDetails();
        await sdk.getSeller(storeId, currentUser.id);
        // If no error is thrown, user is a seller
        setIsSellerOfStore(true);
      } catch {
        // If error is thrown, user is not a seller
        setIsSellerOfStore(false);
      }
    };

    checkIfSeller();
  }, [storeId, isUserAuthenticated]);
 
  // Find current quantity of this product in the cart (for this store)
  const currentQty = useMemo(() => {
    if (!cart || !storeId) return 0;
    const basket = cart.stores.find((s) => s.storeId === storeId);
    if (!basket) return 0;
    const entry = basket.products.find((e) => e.productId === product.id);
    return entry?.quantity ?? 0;
  }, [cart, storeId, product.id]);

  const handleIncrement = useCallback(async () => {
    if (!storeId) return;
    if (currentQty === product.quantity) return;
    
    // Debug logging to check store ID
    console.log('Adding to cart:', {
      productName: product.name,
      productStoreId: product.storeId,
      urlStoreId,
      effectiveStoreId: storeId,
      storeName: product.storeName
    });
    
    if (currentQty === 0) {
      await addToCart(storeId, product.id!, 1);
    } else {
      await updateQuantity(storeId, product.id!, currentQty + 1);
    }
  }, [addToCart, currentQty, product.id, product.quantity, storeId, updateQuantity, urlStoreId, product.storeName]);

  const handleDecrement = useCallback(async () => {
    if (!storeId) return;
    
    if (currentQty <= 1) {
      await removeFromCart(storeId, product.id!);
    } else {
      await updateQuantity(storeId, product.id!, currentQty - 1);
    }
  }, [currentQty, product.id, removeFromCart, storeId, updateQuantity]);

  if (product.auctionEndDate && new Date(product.auctionEndDate).getTime() < Date.now()) {
    return null;
  }

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
          
          {/* Store name subtitle for search results */}
          {product.storeName && (
            <Typography
              variant="subtitle2"
              sx={{ 
                color: theme.palette.primary.main,
                fontWeight: 500,
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}
            >
              {product.storeName}
              {typeof product.storeRating === 'number' && product.storeRating > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                  <RatingComponent
                    value={product.storeRating}
                    readOnly={true}
                    size="small"
                    precision={0.1}
                  />
                  <Typography variant="caption" sx={{ ml: 0.5 }}>
                    ({product.storeRating.toFixed(1)})
                  </Typography>
                </Box>
              )}
            </Typography>
          )}
          
          <Typography
            variant="body2"
            paragraph
            noWrap
            sx={{ color: theme.palette.text.secondary }}
          >
            {product.description}
          </Typography>

          <Box sx={{ mb: theme.spacing(1) }}>
            {product.auctionEndDate ? (
              <AuctionProductCard 
                product={product} 
                setUpdateProducts={setUpdateProducts}
                isUserAuthenticated={isUserAuthenticated}
              />
            ) : (
              <Typography variant="body2">
                <strong>Price:</strong> ${product.price.toFixed(2)}
              </Typography>
            )}
            <Typography variant="body2">
              <strong>Available:</strong> {product.quantity}
            </Typography>
          </Box>

          {product.categories.length > 0 && (
            <Typography variant="body2">
              <strong>Categories:</strong> {product.categories.join(", ")}
            </Typography>
          )}

          {!product.auctionEndDate && (
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
                value={product.rating ?? 0}
                readOnly={true}
                size="small"
                precision={0.1}
              />
            </Box>
          )}

          {!product.auctionEndDate && cartError && (
            <Typography
              variant="caption"
              color="error"
              sx={{ mt: theme.spacing(1), display: "block" }}
            >
              {cartError}
            </Typography>
          )}
        </CardContent>

        {!product.auctionEndDate && storeId && !isSellerOfStore && (
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
        )}

        {/* Show message for sellers of their own store */}
        {!product.auctionEndDate && storeId && isSellerOfStore && (
          <CardActions
            sx={{
              justifyContent: "center",
              alignItems: "center",
              px: theme.spacing(2),
              pb: theme.spacing(2),
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                color: theme.palette.text.secondary,
                fontStyle: 'italic',
                textAlign: 'center'
              }}
            >
              You cannot purchase products from your own store
            </Typography>
          </CardActions>
        )}
      </Card>

      {storeId && !isSellerOfStore && (
        <CreateBidRequestDialog
          open={bidDialogOpen}
          onClose={() => setBidDialogOpen(false)}
          productId={product.id!}
          storeId={storeId}
        />
      )}
    </>
  );
};

export default UserProductCard;