import { SDK } from "../../sdk.ts";
import { CartDto } from "../../../shared/types/dtos.ts";

const cartsController = "carts";
const productsController = "products";

export async function getCart(this: SDK): Promise<CartDto> {
  const response = await this.get(`${cartsController}`, {});

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Get cart failed: ${err}`);
  }

  return (await response.json()) as CartDto;
}

export async function addProductToCart(this: SDK, productId: string, payload: { quantity: number }): Promise<CartDto> {
  const response = await this.post(
    `${cartsController}/${productsController}/${productId}`,
    payload
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Add product to cart failed: ${err}`);
  }

  return (await response.json()) as CartDto;
}

export async function removeProductFromCart(this: SDK, productId: string): Promise<void> {
  const response = await this.delete(
    `${cartsController}/${productsController}/${productId}`
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Remove product from cart failed: ${err}`);
  }
}

export async function updateProductInCart(this: SDK, productId: string, payload: { quantity: number }): Promise<CartDto> {
  const response = await this.patch(
    `${cartsController}/${productsController}/${productId}`,
    payload
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Update product quantity failed: ${err}`);
  }
  
  return (await response.json()) as CartDto;
}
