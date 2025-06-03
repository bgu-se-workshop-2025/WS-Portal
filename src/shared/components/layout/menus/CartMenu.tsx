import React from "react";
import {
  Box,
  Paper,
  IconButton,
  ClickAwayListener,
  Collapse,
  List,
  ListItem,
  Divider,
  Typography,
  CircularProgress,
} from "@mui/material";
import { ShoppingCartOutlined } from "@mui/icons-material";

import useCart from "../../../../shared/hooks/useCart";
import type {
  CartStoreBasketDto,
  CartProductEntryDto,
} from "../../../../shared/types/dtos";
import { sdk } from "../../../../sdk/sdk";

const CartMenu: React.FC = () => {
  const [cartOpen, setCartOpen] = React.useState(false);
  const { cart, loading: cartLoading, error, refreshCart } = useCart();

  // Maps for storing fetched names
  const [storeNames, setStoreNames] = React.useState<Record<string, string>>(
    {}
  );
  const [productNames, setProductNames] = React.useState<
    Record<string, string>
  >({});
  const [namesLoading, setNamesLoading] = React.useState(false);

  // Whenever the cart changes (or opens), fetch any missing store/product names
  React.useEffect(() => {
    if (!cart || cart.stores.length === 0) {
      return;
    }

    const fetchNames = async () => {
      setNamesLoading(true);

      try {
        const newStoreNames: Record<string, string> = { ...storeNames };
        const newProductNames: Record<string, string> = { ...productNames };

        // 1) Collect all unique storeIds and productIds from cart.stores
        const storeIds = cart.stores.map((s) => s.storeId);
        const productTuples: Array<{ storeId: string; productId: string }> =
          cart.stores.flatMap((storeBasket: CartStoreBasketDto) =>
            storeBasket.products.map((entry: CartProductEntryDto) => ({
              storeId: storeBasket.storeId,
              productId: entry.productId,
            }))
          );

        // 2) For each storeId not already in storeNames, call sdk.getStore(...)
        await Promise.all(
          storeIds.map(async (storeId) => {
            if (!newStoreNames[storeId]) {
              try {
                const storeDto = await sdk.getStore(storeId);
                newStoreNames[storeId] = storeDto.name;
              } catch {
                // If fetching fails, just leave the ID as-is
                newStoreNames[storeId] = storeId;
              }
            }
          })
        );

        // 3) For each (storeId, productId) not in productNames, call sdk.getProduct(...)
        await Promise.all(
          productTuples.map(async ({ productId }) => {
            if (!newProductNames[productId]) {
              try {
                // Adjust this line if your SDK’s getProduct signature is different
                const productDto = await sdk.getProduct(productId);
                newProductNames[productId] = productDto.name;
              } catch {
                newProductNames[productId] = productId;
              }
            }
          })
        );

        setStoreNames(newStoreNames);
        setProductNames(newProductNames);
      } finally {
        setNamesLoading(false);
      }
    };

    fetchNames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart]);

  // When opening the menu, also refresh the cart contents
  React.useEffect(() => {
    if (cartOpen) {
      refreshCart();
    }
  }, [cartOpen, refreshCart]);

  return (
    <ClickAwayListener onClickAway={() => setCartOpen(false)}>
      <Box position="relative">
        <IconButton
          color="inherit"
          onClick={() => {
            setCartOpen((open) => !open);
          }}
        >
          <ShoppingCartOutlined />
        </IconButton>
        <Collapse in={cartOpen}>
          <Paper
            elevation={3}
            sx={{
              position: "absolute",
              right: 0,
              zIndex: 10,
              minWidth: 300,
              mt: 1,
              maxHeight: 400,
              overflowY: "auto",
            }}
          >
            <Typography variant="h6" sx={{ p: 1 }}>
              Cart
            </Typography>
            <Divider />

            {/* Show spinner while the cart itself is loading */}
            {cartLoading && (
              <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress size={24} />
              </Box>
            )}

            {!cartLoading && error && (
              <Box p={2}>
                <Typography variant="body2" color="error">
                  {error}
                </Typography>
              </Box>
            )}

            {!cartLoading && !error && (
              <List>
                {!cart || cart.stores.length === 0 ? (
                  <ListItem>
                    <Typography variant="body2" sx={{ px: 1 }}>
                      Your cart is empty.
                    </Typography>
                  </ListItem>
                ) : (
                  // For each store in the cart, render a grouped section
                  cart.stores.map((storeBasket: CartStoreBasketDto) => {
                    const { storeId, products } = storeBasket;
                    const storeName = storeNames[storeId] || storeId;

                    return (
                      <Box key={storeId} sx={{ mb: 2 }}>
                        <ListItem disablePadding>
                          <Box sx={{ width: "100%", px: 1, py: 0.5 }}>
                            <Typography variant="subtitle1">
                              <strong>{storeName}</strong>
                              {namesLoading && " (loading...)"}
                            </Typography>
                          </Box>
                        </ListItem>
                        <Divider />

                        {products.length === 0 ? (
                          <ListItem>
                            <Typography
                              variant="body2"
                              sx={{ px: 1, color: "text.secondary" }}
                            >
                              No items from this store.
                            </Typography>
                          </ListItem>
                        ) : (
                          products.map((entry: CartProductEntryDto) => {
                            const { productId, quantity } = entry;
                            const productName =
                              productNames[productId] || productId;

                            return (
                              <ListItem
                                key={`${storeId}-${productId}`}
                                disablePadding
                              >
                                <Box sx={{ width: "100%", px: 2, py: 0.5 }}>
                                  <Typography variant="body2">
                                    <strong>{productName}</strong> × {quantity}
                                    {namesLoading && " (loading...)"}
                                  </Typography>
                                </Box>
                              </ListItem>
                            );
                          })
                        )}
                        <Divider sx={{ mt: 1 }} />
                      </Box>
                    );
                  })
                )}
              </List>
            )}
          </Paper>
        </Collapse>
      </Box>
    </ClickAwayListener>
  );
};

export default CartMenu;
