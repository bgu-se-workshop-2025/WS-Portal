// src/utils/cookieUtils.ts

import Cookies from "js-cookie";
import type { CartDto } from "../../shared/types/dtos";
// Adjust the import path for CartDto if needed

// ────────────────────────────────────────────────────────────────────────────────
// TOKEN COOKIE
// ────────────────────────────────────────────────────────────────────────────────

const TOKEN_KEY = "token";

export const setTokenCookie = (token: string, expiresInSec: number): void => {
  Cookies.set(TOKEN_KEY, token, {
    expires: expiresInSec / 86400,
    secure: true,
    sameSite: "lax",
    path: "/",
  });
};

export const getTokenCookie = (): string | undefined => {
  return Cookies.get(TOKEN_KEY);
};

export const removeTokenCookie = (): void => {
  Cookies.remove(TOKEN_KEY, { path: "/" });
};

// ────────────────────────────────────────────────────────────────────────────────
// GUEST CART COOKIE
// ────────────────────────────────────────────────────────────────────────────────

// Name of the cookie where we store the guest cart JSON
const GUEST_CART_COOKIE = "cart";
// How long (in days) the guest cart cookie should live
const GUEST_CART_EXPIRES_DAYS = 7;

/**
 * Read the “guest cart” from the cookie. If missing or malformed, initialize it to
 * an empty CartDto ({ ownerId: null, stores: [] }) and write that back.
 */
export const readGuestCartFromCookie = (): CartDto => {
  const raw = Cookies.get(GUEST_CART_COOKIE);
  if (raw) {
    try {
      const parsed: CartDto = JSON.parse(raw);
      // Basic shape check: it should at least have an array of stores
      if (parsed.stores && Array.isArray(parsed.stores)) {
        return parsed;
      }
    } catch {
      // Fall through to initialize a fresh empty cart
    }
  }

  // If we reach here, either no cookie or malformed data. Create a new empty cart.
  const emptyCart: CartDto = {
    ownerId: undefined,
    stores: [],
  };

  Cookies.set(GUEST_CART_COOKIE, JSON.stringify(emptyCart), {
    expires: GUEST_CART_EXPIRES_DAYS,
    secure: true,
    sameSite: "lax",
    path: "/",
  });

  return emptyCart;
};

/**
 * Write the provided CartDto back into the “guest cart” cookie (overwriting).
 */
export const writeGuestCartToCookie = (cartObj: CartDto): void => {
  Cookies.set(GUEST_CART_COOKIE, JSON.stringify(cartObj), {
    expires: GUEST_CART_EXPIRES_DAYS,
    secure: true,
    sameSite: "lax",
    path: "/",
  });
};

/**
 * Remove the “guest cart” cookie entirely (e.g. after merging into a server‐side cart).
 */
export const removeGuestCartCookie = (): void => {
  Cookies.remove(GUEST_CART_COOKIE, { path: "/" });
};

export const addProductToGuestCart = (
  storeId: string,
  productId: string,
  quantity: number
): CartDto | undefined => {
  const cart = readGuestCartFromCookie();

  const storeBasket = cart.stores.find((s) => s.storeId === storeId);
  if (!storeBasket) {
    cart.stores.push({
      storeId,
      products: [{ productId, quantity }],
    });
    writeGuestCartToCookie(cart);
    return cart;
  }

  const productEntry = storeBasket.products.find(
    (p) => p.productId === productId
  );
  if (productEntry) {
    productEntry.quantity += quantity;
  } else {
    storeBasket.products.push({ productId, quantity });
  }

  writeGuestCartToCookie(cart);
  return cart;
};

export const removeProductFromGuestCart = (
  storeId: string,
  productId: string
): CartDto | undefined => {
  const cart = readGuestCartFromCookie();

  const storeBasket = cart.stores.find((s) => s.storeId === storeId);
  if (!storeBasket) {
    return;
  }

  storeBasket.products = storeBasket.products.filter(
    (p) => p.productId !== productId
  );

  // If the store basket is now empty, remove it entirely
  if (storeBasket.products.length === 0) {
    cart.stores = cart.stores.filter((s) => s.storeId !== storeId);
  }

  writeGuestCartToCookie(cart);
  return cart;
};

export const updateProductInGuestCart = (
  storeId: string,
  productId: string,
  newQuantity: number
): CartDto | undefined => {
  const cart = readGuestCartFromCookie();

  const storeBasket = cart.stores.find((s) => s.storeId === storeId);
  if (!storeBasket) {
    return;
  }

  const productEntry = storeBasket.products.find(
    (p) => p.productId === productId
  );
  if (!productEntry) {
    return;
  }

  productEntry.quantity = newQuantity;

  writeGuestCartToCookie(cart);
  return cart;
};
