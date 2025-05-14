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
} from "@mui/material";
import { ShoppingCartOutlined } from "@mui/icons-material";

import { sdk } from "../../../../sdk/sdk";

const CartMenu: React.FC = () => {
  const [cartOpen, setCartOpen] = React.useState(false);

  const [cart, setCart] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchCart = async () => {
      const cartData = await sdk.getCart();
      setCart(cartData);
    };
    fetchCart();
  }, []);

  const productsInCart =
    cart?.stores?.flatMap((store: any) =>
      store.products.map((product: any) => ({
        id: product.productId,
        name: product.productId,
        quantity: product.quantity,
        price: product.price,
      }))
    ) || [];

  return (
    <ClickAwayListener onClickAway={() => setCartOpen(false)}>
      <Box position="relative">
        <IconButton
          color="inherit"
          onClick={() => {
            setCartOpen((o) => !o);
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
              minWidth: 250,
              mt: 1,
            }}
          >
            <Typography variant="h6" sx={{ p: 1 }}>
              Cart
            </Typography>
            <Divider />
            <List>
              {productsInCart.map((product: { id: string; name: string; quantity: number; price: number }) => (
                <ListItem key={product.id} disablePadding>
                  <Typography variant="body2">
                    {product.name} x {product.quantity}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Collapse>
      </Box>
    </ClickAwayListener>
  );
};

export default CartMenu;
