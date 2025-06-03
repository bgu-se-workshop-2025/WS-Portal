import { useState, useEffect, useCallback } from "react";
import { sdk, isAuthenticated } from "../../sdk/sdk";
import * as cookies from "../utils/cookies";
import type { CartDto } from "../../shared/types/dtos";

interface UseCartReturn {
  cart: CartDto | null;
  loading: boolean;
  error: string | null;
  refreshCart: () => Promise<void>;
  addToCart: (
    storeId: string,
    productId: string,
    quantity: number
  ) => Promise<void>;
  removeFromCart: (storeId: string, productId: string) => Promise<void>;
  updateQuantity: (
    storeId: string,
    productId: string,
    quantity: number
  ) => Promise<void>;
}

/**
 * Fetches the current cart, either from the server (if authenticated)
 * or from cookies (if guest).
 */
const getCart = async (): Promise<CartDto | null> => {
  return isAuthenticated()
    ? await sdk.getCart()
    : cookies.readGuestCartFromCookie();
};

/**
 * Adds a product to the cart, either by calling the server API (if authenticated)
 * or updating the guest cart cookie.
 */
const addProductToCart = async (
  storeId: string,
  productId: string,
  quantity: number
): Promise<CartDto | null> => {
  return isAuthenticated()
    ? await sdk.addProductToCart(productId, { quantity })
    : (cookies.addProductToGuestCart(storeId, productId, quantity) as CartDto);
};

/**
 * Removes a product from the cart entirely, either by calling the server API
 * (if authenticated) or updating the guest cart cookie.
 */
const removeProductFromCart = async (
  storeId: string,
  productId: string
): Promise<void> => {
  isAuthenticated()
    ? sdk.removeProductFromCart(productId)
    : cookies.removeProductFromGuestCart(storeId, productId);
};

/**
 * Updates the quantity of a product in the cart, either by calling the server API
 * (if authenticated) or updating the guest cart cookie.
 */
const updateProductInCart = async (
  storeId: string,
  productId: string,
  quantity: number
): Promise<CartDto> => {
  return isAuthenticated()
    ? await sdk.updateProductInCart(productId, { quantity })
    : (cookies.updateProductInGuestCart(
        storeId,
        productId,
        quantity
      ) as CartDto);
};

/**
 * useCart Hook
 * @returns A custom hook for managing the shopping cart.
 * Provides functions to fetch, add, remove, and update products in the cart.
 * Handles both authenticated users (server-side cart) and guests (cookie-based cart).
 */
const useCart = (): UseCartReturn => {
  const [cart, setCart] = useState<CartDto | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch the current cart from the server
  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const fetchedCart: CartDto | null = await getCart();
      if (!fetchedCart) {
        throw new Error("Cart is empty or not found");
      }

      setCart(fetchedCart);
    } catch (err: any) {
      console.error("Error fetching cart:", err);
      setError(err.message || "Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a product to the cart (or increment its quantity if it already exists)
  const addToCart = useCallback(
    async (storeId: string, productId: string, quantity: number) => {
      setLoading(true);
      setError(null);
      try {
        const updatedCart: CartDto | null = await addProductToCart(
          storeId,
          productId,
          quantity
        );
        if (!updatedCart) {
          throw new Error("Failed to add product to cart");
        }

        setCart(updatedCart);
      } catch (err: any) {
        console.error("Error adding product to cart:", err);
        setError(err.message || "Failed to add product to cart");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Remove a product from the cart entirely
  const removeFromCart = useCallback(
    async (storeId: string, productId: string) => {
      setLoading(true);
      setError(null);
      try {
        await removeProductFromCart(storeId, productId);
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
    async (storeId: string, productId: string, quantity: number) => {
      setLoading(true);
      setError(null);
      try {
        const updatedCart: CartDto = await updateProductInCart(
          storeId,
          productId,
          quantity
        );
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

  // On mount, load the cart
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

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
