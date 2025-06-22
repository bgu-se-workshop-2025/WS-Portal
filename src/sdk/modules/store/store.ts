import { SDK } from "../../sdk.ts";
import { StoreDto, ProductDto, SellerDto } from "../../../shared/types/dtos.ts";

const storeController = "stores";
const productController = "products";
const sellerController = "sellers";


export async function createStore(this: SDK, store: StoreDto): Promise<StoreDto> {
    const response = await this.post(`${storeController}`, store, {
        action: 'createStore',
        resource: 'store'
    });

    const result = (await response.json()) as StoreDto;
    return result;
}

export async function updateStore(this: SDK, storeId: string, store: StoreDto): Promise<StoreDto> {
    const response = await this.patch(`${storeController}/${storeId}`, store, {
        action: 'updateStore',
        resource: 'store',
        resourceId: storeId
    });

    const result = (await response.json()) as StoreDto;
    return result;
}

export async function createProduct(this: SDK, storeId: string, product: ProductDto): Promise<ProductDto> {
    const response = await this.post(`${storeController}/${storeId}/${productController}`, product, {
        action: 'createProduct',
        resource: 'product',
        additionalInfo: { storeId }
    });

    const result = (await response.json()) as ProductDto;
    return result;
}

export async function updateProduct(this: SDK, storeId: string, productId: string, product: ProductDto): Promise<ProductDto> {
    console.log(`Updating product ${productId} in store ${storeId}`, product);
    const response = await this.patch(`${storeController}/${storeId}/${productController}/${productId}`, product, {
        action: 'updateProduct',
        resource: 'product',
        resourceId: productId,
        additionalInfo: { storeId }
    });

    const result = (await response.json()) as ProductDto;
    return result;
}

export async function deleteProduct(this: SDK, storeId: string, productId: string): Promise<void> {
    const response = await this.delete(`${storeController}/${storeId}/${productController}/${productId}`, {
        action: 'deleteProduct',
        resource: 'product',
        resourceId: productId,
        additionalInfo: { storeId }
    });
}


export async function addSeller(this: SDK, storeId: string, userId: string, seller: SellerDto): Promise<SellerDto> {
    const response = await this.post(`${storeController}/${storeId}/${sellerController}/${userId}`, seller, {
        action: 'addSeller',
        resource: 'seller',
        resourceId: userId,
        additionalInfo: { storeId, username: userId }
    });

    const result = (await response.json()) as SellerDto;
    return result;
}

export async function removeSeller(this: SDK, storeId: string, sellerId: string): Promise<void> {
    const response = await this.delete(`${storeController}/${storeId}/${sellerController}/${sellerId}`, {
        action: 'removeSeller',
        resource: 'seller',
        resourceId: sellerId,
        additionalInfo: { storeId }
    });
}

export async function getSeller(this: SDK, storeId: string, userId: string): Promise<SellerDto> {
    const response = await this.get(`${storeController}/${storeId}/${sellerController}/${userId}`, {}, {
        action: 'getSeller',
        resource: 'seller',
        resourceId: userId,
        additionalInfo: { storeId }
    });

    const result = (await response.json()) as SellerDto;
    return result;
}

export async function updateManagerPermissions(
  this: SDK,
  storeId: string,
  sellerId: string,
  permissions: string[]
){
  const response = await this.patch(
    `${storeController}/${storeId}/${sellerController}/${sellerId}`, 
    permissions,
    {
        action: 'updateManagerPermissions',
        resource: 'seller',
        resourceId: sellerId,
        additionalInfo: { storeId }
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed to update manager permissions for ${sellerId}: ${err}`);
  }
}


