import { useState, useEffect, useCallback } from "react";
import { sdk } from "../../sdk/sdk";
import type { CartDto } from "../../shared/types/dtos";

interface UseCartReturn {
  cart: CartDto | null;
  loading: boolean;
  error: string | null;
  refreshCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
}

const useCart = (): UseCartReturn => {
  const [cart, setCart] = useState<CartDto | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch the current cart from the server
  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const fetchedCart: CartDto = await sdk.getCart();
      console.log("Fetched cart:", fetchedCart);
      setCart(fetchedCart);
    } catch (err: any) {
      console.error("Error fetching cart:", err);
      setError(err.message || "Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  }, []);

  // On mount, load the cart
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Add a product to the cart (or increment its quantity if it already exists)
  const addToCart = useCallback(async (productId: string, quantity: number) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCart: CartDto = await sdk.addProductToCart(productId, {
        quantity,
      });
      console.log(updatedCart);
      setCart(updatedCart);
    } catch (err: any) {
      console.error("Error adding product to cart:", err);
      setError(err.message || "Failed to add product to cart");
    } finally {
      setLoading(false);
    }
  }, []);

  // Remove a product from the cart entirely
  const removeFromCart = useCallback(
    async (productId: string) => {
      setLoading(true);
      setError(null);
      try {
        await sdk.removeProductFromCart(productId);
        console.log(`Removed product ${productId} from cart`);
        // After removal, fetch the updated cart
        await fetchCart();
      } catch (err: any) {
        console.error("Error removing product from cart:", err);
        setError(err.message || "Failed to remove product from cart");
      } finally {
        setLoading(false);
      }
    },
    [fetchCart]
  );

  // Update the quantity of a product already in the cart
  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      setLoading(true);
      setError(null);
      try {
        const updatedCart: CartDto = await sdk.updateProductInCart(productId, {
          quantity,
        });
        console.log(updatedCart);
        setCart(updatedCart);
      } catch (err: any) {
        console.error("Error updating product quantity:", err);
        setError(err.message || "Failed to update product quantity");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Expose everything
  return {
    cart,
    loading,
    error,
    refreshCart: fetchCart,
    addToCart,
    removeFromCart,
    updateQuantity,
  };
};

export default useCart;
