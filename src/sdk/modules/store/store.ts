import { SDK } from "../../sdk.ts";

const storeController = "stores";
const productController = "products";
const sellerController = "sellers";

export interface StoreDto {
    id: string;
    name: string;
    description: string;
    // TODO Add empty lists???
}

export interface ProductDto {
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    storeId: string;
    rating: number;
    // TODO Add empty lists???
}

export interface SellerDto {
    id: string;
    userId: string;
    storeId: string;
    // TODO seller type
    employerSellerId: string;
    employerUserId: string;
    // TODO Add empty lists???
}

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
        const err = await response.text();
        throw new Error(`Failed to update store ${storeId}: ${err}`);
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
    const response = await this.patch(`${storeController}/${storeId}/${productController}/${productId}`, product);

    if(!response.ok) {
        const err = await response.text();
        throw new Error(`Failed to update product ${productId}: ${err}`);
    }

    const result = (await response.json()) as ProductDto;
    return result;
}

export async function deleteProduct(this: SDK, storeId: string, productId: string): Promise<void> {
    const response = await this.post(`${storeController}/${storeId}/${productController}/${productId}`, {});

    if(!response.ok) {
        const err = await response.text();
        throw new Error(`Failed to delete product ${productId}: ${err}`);
    }
}

export async function addSeller(this: SDK, storeId: string, userId: string, seller: SellerDto): Promise<SellerDto> {
    const response = await this.post(`${storeController}/${storeId}/${sellerController}/${userId}`, seller);

    if(!response.ok) {
        const err = await response.text();
        throw new Error(`Failed to add seller ${err}`);
    }

    const result = (await response.json()) as SellerDto;
    return result;
}

export async function removeSeller(this: SDK, storeId: string, userId: string): Promise<void> {
    const response = await this.post(`${storeController}/${storeId}/${sellerController}/${userId}`, {});

    if(!response.ok) {
        const err = await response.text();
        throw new Error(`Failed to remove seller ${userId}: ${err}`);
    }
}

