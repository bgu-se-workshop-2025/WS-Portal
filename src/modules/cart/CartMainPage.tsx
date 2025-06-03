import { useEffect, useState } from "react";
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
import useCart from "../../shared/hooks/useCart";

const CartMainPage = () => {
  const [cart, setCart] = useState<CartDto | null>(null);
  const [productsMap, setProductsMap] = useState<Record<string, ProductDto>>({});
  const [storeNames, setStoreNames] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  // Pull in the hook’s cart and a method to refresh it
  const { refreshCart, cart: cartFromHook } = useCart();

  // 1️⃣ On mount, fetch the cart via hook
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // 2️⃣ Whenever cartFromHook changes, repopulate local state + fetch details
  useEffect(() => {
    const rebuildLocalState = async () => {
      if (!cartFromHook) return;
      setCart(cartFromHook);

      // Collect all product IDs and store IDs
      const productIds = new Set<string>();
      const storeIds = new Set<string>();

      cartFromHook.stores.forEach(store => {
        store.products.forEach(item => productIds.add(item.productId));
        storeIds.add(store.storeId);
      });

      // Fetch product details in parallel
      const productEntries = await Promise.all(
        Array.from(productIds).map(async (id) => {
          try {
            const product = await sdk.getProduct(id);
            return [id, product] as const;
          } catch {
            return null;
          }
        })
      );
      const filteredProductEntries = (productEntries.filter(Boolean) as [string, ProductDto][]);
      setProductsMap(Object.fromEntries(filteredProductEntries));

      // Fetch store names in parallel
      const storeEntries = await Promise.all(
        Array.from(storeIds).map(async (id) => {
          try {
            const store = await sdk.getStore(id);
            return [id, store.name] as const;
          } catch {
            return null;
          }
        })
      );
      const filteredStoreEntries = (storeEntries.filter(Boolean) as [string, string][]);
      setStoreNames(Object.fromEntries(filteredStoreEntries));
    };

    rebuildLocalState();
  }, [cartFromHook]);

  // 3️⃣ When quantity changes inside a CartProductItem, just refresh the hook’s cart.
  const handleQuantityChange = () => {
    refreshCart();
  };

  const calculateSubtotal = (): number => {
    let total = 0;
    cart?.stores.forEach(store => {
      store.products.forEach(item => {
        const product = productsMap[item.productId];
        if (product) {
          total += product.price * item.quantity;
        }
      });
    });
    return total;
  };

  const handleCheckout = () => {
    navigate("/payment");
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
            {cart.stores.map(store => (
              <Box key={store.storeId}>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  color="primary"
                  gutterBottom
                >
                  🏬 Store: {storeNames[store.storeId] ?? store.storeId}
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <Stack spacing={1.5}>
                  {store.products.map(entry => {
                    const product = productsMap[entry.productId];
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
