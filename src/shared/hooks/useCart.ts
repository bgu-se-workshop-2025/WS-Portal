import { useState, useEffect, useCallback } from "react";
import { sdk, isAuthenticated } from "../../sdk/sdk";
import * as cookies from "../utils/cookies";
import type { CartDto } from "../../shared/types/dtos";
import { useErrorHandler } from "./useErrorHandler";
import { ErrorHandler } from "../utils/errorHandler";

interface UseCartReturn {
  cart: CartDto | null;
  loading: boolean;
  error: any;
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
  clearError: () => void;
  retry: () => void;
}

// Helper functions for guest cart management
const getGuestCart = (): CartDto | null => {
  try {
    const cartData = cookies.getCartCookie();
    return cartData ? JSON.parse(cartData) : null;
  } catch {
    return null;
  }
};

const setGuestCart = (cart: CartDto | null): void => {
  if (cart) {
    cookies.setCartCookie(JSON.stringify(cart), 7); // 7 days expiry
  } else {
    cookies.removeCartCookie();
  }
};

const addProductToGuestCart = (
  storeId: string,
  productId: string,
  quantity: number
): CartDto | null => {
  const currentCart = getGuestCart();
  if (!currentCart) {
    // Create new cart
    const newCart: CartDto = {
      id: `guest-${Date.now()}`,
      userId: "guest",
      items: [
        {
          id: `${productId}-${Date.now()}`,
          productId,
          storeId,
          quantity,
          price: 0, // Will be updated when fetching product details
        },
      ],
      totalPrice: 0,
    };
    setGuestCart(newCart);
    return newCart;
  }

  // Check if product already exists in cart
  const existingItemIndex = currentCart.items.findIndex(
    (item) => item.productId === productId && item.storeId === storeId
  );

  if (existingItemIndex >= 0) {
    // Update existing item quantity
    currentCart.items[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    currentCart.items.push({
      id: `${productId}-${Date.now()}`,
      productId,
      storeId,
      quantity,
      price: 0, // Will be updated when fetching product details
    });
  }

  setGuestCart(currentCart);
  return currentCart;
};

const removeProductFromGuestCart = (
  storeId: string,
  productId: string
): void => {
  const currentCart = getGuestCart();
  if (!currentCart) return;

  currentCart.items = currentCart.items.filter(
    (item) => !(item.productId === productId && item.storeId === storeId)
  );

  if (currentCart.items.length === 0) {
    setGuestCart(null);
  } else {
    setGuestCart(currentCart);
  }
};

const updateProductInGuestCart = (
  storeId: string,
  productId: string,
  quantity: number
): CartDto | null => {
  const currentCart = getGuestCart();
  if (!currentCart) return null;

  const itemIndex = currentCart.items.findIndex(
    (item) => item.productId === productId && item.storeId === storeId
  );

  if (itemIndex >= 0) {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      currentCart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      currentCart.items[itemIndex].quantity = quantity;
    }

    if (currentCart.items.length === 0) {
      setGuestCart(null);
      return null;
    } else {
      setGuestCart(currentCart);
      return currentCart;
    }
  }

  return currentCart;
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
  
  const { error, handleError, clearError, retry } = useErrorHandler({
    autoClear: false,
  });

  // Fetch the current cart from the server
  const fetchCart = useCallback(async () => {
    setLoading(true);
    clearError();

    try {
      if (isAuthenticated()) {
        // Authenticated user - fetch from server
        const context = ErrorHandler.createContext('useCart', 'fetchCart');
        const fetchedCart: CartDto | null = await sdk.getCart();
        if (!fetchedCart) {
          throw ErrorHandler.processError("Cart is empty or not found", context);
        }
        setCart(fetchedCart);
      } else {
        // Guest user - get from cookies
        const guestCart = getGuestCart();
        setCart(guestCart);
      }
    } catch (err) {
      const context = ErrorHandler.createContext('useCart', 'fetchCart');
      handleError(err, context);
    } finally {
      setLoading(false);
    }
  }, [handleError, clearError]);

  // Add a product to the cart (or increment its quantity if it already exists)
  const addToCart = useCallback(
    async (storeId: string, productId: string, quantity: number) => {
      setLoading(true);
      clearError();
      
      try {
        if (isAuthenticated()) {
          // Authenticated user - add to server
          const context = ErrorHandler.createContext('useCart', 'addToCart', {
            storeId,
            productId,
            quantity,
          });
          const updatedCart: CartDto | null = await sdk.addProductToCart(
            productId,
            { quantity }
          );
          if (!updatedCart) {
            throw ErrorHandler.processError("Failed to add product to cart", context);
          }
          setCart(updatedCart);
        } else {
          // Guest user - add to cookies
          const updatedCart = addProductToGuestCart(storeId, productId, quantity);
          setCart(updatedCart);
        }
      } catch (err) {
        const context = ErrorHandler.createContext('useCart', 'addToCart', {
          storeId,
          productId,
          quantity,
        });
        handleError(err, context);
      } finally {
        setLoading(false);
      }
    },
    [handleError, clearError]
  );

  // Remove a product from the cart entirely
  const removeFromCart = useCallback(
    async (storeId: string, productId: string) => {
      setLoading(true);
      clearError();
      
      try {
        if (isAuthenticated()) {
          // Authenticated user - remove from server
          const context = ErrorHandler.createContext('useCart', 'removeFromCart', {
            storeId,
            productId,
          });
          await sdk.removeProductFromCart(productId);
          await fetchCart(); // Refresh cart after removal
        } else {
          // Guest user - remove from cookies
          removeProductFromGuestCart(storeId, productId);
          setCart(getGuestCart());
        }
      } catch (err) {
        const context = ErrorHandler.createContext('useCart', 'removeFromCart', {
          storeId,
          productId,
        });
        handleError(err, context);
      } finally {
        setLoading(false);
      }
    },
    [fetchCart, handleError, clearError]
  );

  // Update the quantity of a product already in the cart
  const updateQuantity = useCallback(
    async (storeId: string, productId: string, quantity: number) => {
      setLoading(true);
      clearError();
      
      try {
        if (isAuthenticated()) {
          // Authenticated user - update on server
          const context = ErrorHandler.createContext('useCart', 'updateQuantity', {
            storeId,
            productId,
            quantity,
          });
          const updatedCart: CartDto = await sdk.updateProductInCart(
            productId,
            { quantity }
          );
          setCart(updatedCart);
        } else {
          // Guest user - update in cookies
          const updatedCart = updateProductInGuestCart(storeId, productId, quantity);
          setCart(updatedCart);
        }
      } catch (err) {
        const context = ErrorHandler.createContext('useCart', 'updateQuantity', {
          storeId,
          productId,
          quantity,
        });
        handleError(err, context);
      } finally {
        setLoading(false);
      }
    },
    [handleError, clearError]
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
    clearError,
    retry,
  };
};

export default useCart;
