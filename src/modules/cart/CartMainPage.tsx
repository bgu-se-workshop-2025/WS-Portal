import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Stack,
  Button,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { CartDto, ProductDto } from "../../shared/types/dtos";
import CartProductItem from "./CartProductItem";
import { useNavigate } from "react-router-dom";
import { sdk } from "../../sdk/sdk";

const mockProducts: ProductDto[] = [
  {
    id: "1",
    name: "Apple Watch",
    description: "Smartwatch from Store A",
    price: 299.99,
    quantity: 50,
    storeId: "store-a",
    rating: 4.2,
    categories: ["electronics"],
    auctionEndDate: "",
  },
  {
    id: "2",
    name: "Nike Shoes",
    description: "Running shoes from Store B",
    price: 119.99,
    quantity: 30,
    storeId: "store-b",
    rating: 4.6,
    categories: ["fashion"],
    auctionEndDate: "",
  },
  {
    id: "3",
    name: "Coffee Maker",
    description: "Appliance from Store C",
    price: 89.99,
    quantity: 20,
    storeId: "store-c",
    rating: 4.0,
    categories: ["kitchen"],
    auctionEndDate: "",
  },
  {
    id: "4",
    name: "T-shirt",
    description: "Cotton T-shirt from Store B",
    price: 39.99,
    quantity: 100,
    storeId: "store-b",
    rating: 4.3,
    categories: ["fashion"],
    auctionEndDate: "",
  },
];

const mockCart: CartDto = {
  ownerId: "test-user",
  stores: [
    {
      storeId: "store-a",
      products: [{ productId: "1", quantity: 1 }],
    },
    {
      storeId: "store-b",
      products: [
        { productId: "2", quantity: 2 },
        { productId: "4", quantity: 1 },
      ],
    },
    {
      storeId: "store-c",
      products: [{ productId: "3", quantity: 1 }],
    },
  ],
};

const CartMainPage = () => {
  const [cart, setCart] = useState<CartDto | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cartFromServer = await sdk.getCart();
        setCart(cartFromServer);
      } catch (error) {
        console.error("Failed to fetch cart from server, using mock cart:", error);
        setCart(mockCart);
      }
    };

    fetchCart();
  }, []);

  const handleQuantityChange = () => {
    console.log("Quantity changed");
  };

  const calculateSubtotal = (): number => {
    let total = 0;
    cart?.stores.forEach((store) => {
      store.products.forEach((item) => {
        const product = mockProducts.find((p) => p.id === item.productId);
        if (product) {
          total += product.price * item.quantity;
        }
      });
    });
    return total;
  };

  const handleCheckout = () => {
    navigate("/public/orders");
  };

  if (!cart || cart.stores.length === 0) {
    return (
      <Typography mt={4} ml={4}>
        🛒 Your cart is empty.
      </Typography>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="flex-start"
      sx={{
        minHeight: "100vh",
        position: "relative",
        backgroundColor: "#f5faff",
        px: 2,
        py: 4,
        gap: 2,
      }}
    >
      {/* LEFT: Cart Section */}
      <Box flex={2}>
        <Paper elevation={1} sx={{ p: 2, borderRadius: 3, backgroundColor: "#ffffff" }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
            display="flex"
            alignItems="center"
            gap={1}
            sx={{ color: "#003366" }}
          >
            <ShoppingCartIcon /> Cart
          </Typography>

          <Stack spacing={3}>
            {cart.stores.map((store) => (
              <Box key={store.storeId}>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  color="primary"
                  gutterBottom
                >
                  🏬 Store: {store.storeId}
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <Stack spacing={1.5}>
                  {store.products.map((entry) => {
                    const product = mockProducts.find(
                      (p) => p.id === entry.productId
                    );
                    if (!product) return null;

                    return (
                      <CartProductItem
                        key={`${store.storeId}-${entry.productId}`}
                        product={product}
                        quantity={entry.quantity}
                        onQuantityChange={handleQuantityChange}
                      />
                    );
                  })}
                </Stack>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Box>

      {/* RIGHT: Order Summary */}
      <Box
        sx={{
          position: "sticky",
          top: 24,
          alignSelf: "flex-start",
          width: 320,
          borderRadius: 3,
          backgroundColor: "#ffffff",
          border: "1px solid #e0e0e0",
          boxShadow: 3,
          p: 3,
          height: "fit-content",
          zIndex: 100,
        }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
          fontSize="1.2rem"
          letterSpacing={0.5}
          mb={1}
          sx={{ color: "#003366" }}
        >
          Order Summary
        </Typography>

        <Typography mb={2} fontWeight={700} sx={{ color: "#003366" }}>
          ${calculateSubtotal().toFixed(2)}
        </Typography>

        <Button
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: "#003366",
            color: "#fff",
            fontWeight: 600,
            borderRadius: "8px",
            py: 1.5,
            "&:hover": {
              backgroundColor: "#002244",
            },
          }}
          onClick={handleCheckout}
        >
          Checkout
        </Button>
      </Box>
    </Box>
  );
};

export default CartMainPage;
