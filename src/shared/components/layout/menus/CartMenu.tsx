import React from "react";
import {
  Box,
  Paper,
  IconButton,
  ClickAwayListener,
  Collapse,
  List,
  ListItem,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import { ShoppingCartOutlined } from "@mui/icons-material";

import useCart from "../../../../shared/hooks/useCart";
import type {
  CartStoreBasketDto,
  CartProductEntryDto,
} from "../../../../shared/types/dtos";

const CartMenu: React.FC = () => {
  const [cartOpen, setCartOpen] = React.useState(false);
  const { cart, loading, error, refreshCart } = useCart();

  // When opening the menu, refresh to get latest cart
  React.useEffect(() => {
    if (cartOpen) {
      refreshCart();
    }
  }, [cartOpen, refreshCart]);

  // Flatten all products across all store baskets
  const productsInCart: Array<{
    storeId: string;
    productId: string;
    quantity: number;
  }> =
    cart?.stores?.flatMap((store: CartStoreBasketDto) =>
      store.products.map((entry: CartProductEntryDto) => ({
        storeId: store.storeId,
        productId: entry.productId,
        quantity: entry.quantity,
      }))
    ) || [];

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

            {loading && (
              <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress size={24} />
              </Box>
            )}

            {!loading && error && (
              <Box p={2}>
                <Typography variant="body2" color="error">
                  {error}
                </Typography>
              </Box>
            )}

            {!loading && !error && (
              <List>
                {productsInCart.length === 0 ? (
                  <ListItem>
                    <Typography variant="body2" sx={{ px: 1 }}>
                      Your cart is empty.
                    </Typography>
                  </ListItem>
                ) : (
                  productsInCart.map((item) => (
                    <ListItem
                      key={`${item.storeId}-${item.productId}`}
                      disablePadding
                    >
                      <Box sx={{ width: "100%", px: 1, py: 0.5 }}>
                        <Typography variant="body2">
                          <strong>Store:</strong> {item.storeId}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Product:</strong> {item.productId}{" "}
                          <strong>x</strong> {item.quantity}
                        </Typography>
                      </Box>
                    </ListItem>
                  ))
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
