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

const CartMenu: React.FC = () => {
  const [cartOpen, setCartOpen] = React.useState(false);

  const products = [
    { id: 1, name: "Wireless Mouse", price: 25.99 },
    { id: 2, name: "USB-C Cable", price: 9.99 },
    // Add more products as needed
  ];

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
              top: "100%",
              right: 0,
              mt: 1,
              width: 280,
              maxHeight: 300,
              overflow: "auto",
            }}
          >
            <List dense>
              {products.map((product) => (
                <ListItem key={product.id} disablePadding>
                  <Typography variant="body2">
                    {product.name} - ₪{product.price.toFixed(2)}
                  </Typography>
                </ListItem>
              ))}
              <Divider />
              <ListItem disablePadding>
                <Typography
                  variant="body2"
                  sx={{ textAlign: "center", fontWeight: "bold" }}
                >
                  Total: ₪
                  {products
                    .reduce((total, product) => total + product.price, 0)
                    .toFixed(2)}
                </Typography>
              </ListItem>
            </List>
          </Paper>
        </Collapse>
      </Box>
    </ClickAwayListener>
  );
};

export default CartMenu;
