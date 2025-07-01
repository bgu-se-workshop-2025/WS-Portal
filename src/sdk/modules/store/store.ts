import { SDK } from "../../sdk.ts";
import { StoreDto, ProductDto, SellerDto } from "../../../shared/types/dtos.ts";

const storeController = "stores";
const productController = "products";
const sellerController = "sellers";


export async function createStore(this: SDK, store: StoreDto): Promise<StoreDto> {
    const response = await this.post(`${storeController}`, store);
    
    if(!response.ok) {
        const err = await response.text();
        throw new Error(`Failed to create store ${err}`);
    }

    const result = (await response.json()) as StoreDto;
    return result;
}

export async function updateStore(this: SDK, storeId: string, store: StoreDto): Promise<StoreDto> {
    const response = await this.patch(`${storeController}/${storeId}`, store);
    
    if(!response.ok) {

        throw new Error(`Failed to update store : ${response.status}`);
    }

    const result = (await response.json()) as StoreDto;
    return result;
}

export async function createProduct(this: SDK, storeId: string, product: ProductDto): Promise<ProductDto> {
    const response = await this.post(`${storeController}/${storeId}/${productController}`, product);

    if(!response.ok) {
        const err = await response.text();
        throw new Error(`Failed to create product ${err}`);
    }

    const result = (await response.json()) as ProductDto;
    return result;
}

export async function updateProduct(this: SDK, storeId: string, productId: string, product: ProductDto): Promise<ProductDto> {
    console.log(`Updating product ${productId} in store ${storeId}`, product);
    const response = await this.patch(`${storeController}/${storeId}/${productController}/${productId}`, product);

    if(!response.ok) {
        const err = await response.text();
        throw new Error(`Failed to update product ${productId}: ${err}`);
    }

    const result = (await response.json()) as ProductDto;
    return result;
}

export async function deleteProduct(this: SDK, storeId: string, productId: string): Promise<void> {
    const response = await this.delete(`${storeController}/${storeId}/${productController}/${productId}`);

    if(!response.ok) {
        const err = await response.text();
        throw new Error(`Failed to delete product ${productId}: ${err}`);
    }
}


export async function addSeller(this: SDK, storeId: string, userId: string, seller: SellerDto): Promise<SellerDto> {
    const response = await this.post(`${storeController}/${storeId}/${sellerController}/${userId}`, seller);

    if(!response.ok) {
        const err = await response.text();
        throw new Error(`Failed to add seller ${userId}: ${err}`);
    }

    const result = (await response.json()) as SellerDto;
    return result;
}

export async function removeSeller(this: SDK, storeId: string, sellerId: string): Promise<void> {
    const response = await this.delete(`${storeController}/${storeId}/${sellerController}/${sellerId}`);

    if(!response.ok) {
        const err = await response.text();
        throw new Error(`Failed to remove seller ${sellerId}: ${err}`);
    }
}

export async function getSeller(this: SDK, storeId: string, userId: string): Promise<SellerDto> {
    const response = await this.get(`${storeController}/${storeId}/${sellerController}/${userId}`, {});

    if(!response.ok) {
        const err = await response.text();
        throw new Error(`Failed to get seller ${userId}: ${err}`);
    }

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
    permissions 
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed to update manager permissions for ${sellerId}: ${err}`);
  }
}

export async function deleteStore(this: SDK, storeId: string): Promise<void> {
    const response = await this.delete(`admin/stores/${storeId}`);

    if(!response.ok) {
        const err = await response.text();
        throw new Error(`Failed to delete store ${storeId}: ${err}`);
    }
}

export async function closeStore(this: SDK, storeId: string): Promise<void> {
    const response = await this.delete(`${storeController}/${storeId}`);

    if(!response.ok) {
        const err = await response.text();
        throw new Error(`Failed to close store ${storeId}: ${err}`);
    }
}


