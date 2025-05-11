import { SDK } from "../../sdk.ts";

const controller = "product";

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: boolean;
    storeId: string;
    avarageRating: number;
}

export async function getProduct(this: SDK, id: string): Promise<Product> {
    const response = await this.get(`${controller}/${id}`, {});

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Get product failed: ${err}`);
    }

    const result = (await response.json()) as Product;
    return result;
}

export interface GetProductsPayload {
    page: number;
    size: number;
    storeId?: string;
    minPrice?: number;
    maxPrice?: number;
    keywords?: string[];
    categories?: string[];
    sortBy?: string;
}

export async function getProducts(this: SDK, payload: GetProductsPayload): Promise<Product[]> {
    const queryParams = new URLSearchParams();
    queryParams.append("page", payload.page.toString());
    queryParams.append("size", payload.size.toString());
    if (payload.storeId) queryParams.append("storeId", payload.storeId);
    if (payload.minPrice !== undefined) queryParams.append("minPrice", payload.minPrice.toString());
    if (payload.maxPrice !== undefined) queryParams.append("maxPrice", payload.maxPrice.toString());
    if (payload.keywords && payload.keywords.length > 0) payload.keywords.forEach(k => queryParams.append("keywords", k));
    if (payload.categories && payload.categories.length > 0) payload.categories.forEach(c => queryParams.append("categories", c));
    if (payload.sortBy) queryParams.append("sortBy", payload.sortBy);

    const response = await this.get(`${controller}?${queryParams.toString()}`, {});

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Get products failed: ${err}`);
    }

    const result = (await response.json()) as Product[];
    return result;
}