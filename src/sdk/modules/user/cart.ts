import { SDK } from "../../sdk.ts";
import { CartDto } from "../../../shared/types/dtos.ts";

const cartsController = "carts";
const productsController = "products";

export async function getCart(this: SDK): Promise<CartDto> {
  return await this.getWithErrorHandling<CartDto>(
    `${cartsController}`, 
    {},
    { 
      operation: 'Get Cart',
      component: 'CartService'
    }
  );
}

export async function addProductToCart(this: SDK, productId: string, payload: { quantity: number }): Promise<CartDto> {
  return await this.postWithErrorHandling<CartDto>(
    `${cartsController}/${productsController}/${productId}`,
    payload,
    { 
      operation: 'Add Product to Cart',
      component: 'CartService',
      resourceId: productId,
      additionalData: { quantity: payload.quantity }
    }
  );
}

export async function removeProductFromCart(this: SDK, productId: string): Promise<void> {
  return await this.deleteWithErrorHandling<void>(
    `${cartsController}/${productsController}/${productId}`,
    { 
      operation: 'Remove Product from Cart',
      component: 'CartService',
      resourceId: productId
    }
  );
}

export async function updateProductInCart(this: SDK, productId: string, payload: { quantity: number }): Promise<CartDto> {
  return await this.patchWithErrorHandling<CartDto>(
    `${cartsController}/${productsController}/${productId}`,
    payload,
    { 
      operation: 'Update Product in Cart',
      component: 'CartService',
      resourceId: productId,
      additionalData: { quantity: payload.quantity }
    }
  );
}
