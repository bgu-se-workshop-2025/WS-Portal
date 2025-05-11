import { SDK } from "../../sdk.ts";

const storeController = "store";
const productController = "product";
export interface Review {
    id: string;
    productId: string;  
    storeId: string;
    writerId: string;
    title: string;
    body: string;
    rating: number;
    date: string;
}

export async function createStoreReview(this: SDK, payload: Review): Promise<Review> {
    const response = await this.post(`${storeController}/${payload.storeId}/`, payload);

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`createStoreReview failed: ${err}`);
    }
    const result = (await response.json()) as Review;
    return result;
}

export async function createProductReview(this: SDK, payload: Review): Promise<Review> {
    const response = await this.post(
        `${storeController}/${payload.storeId}/${productController}/${payload.productId}`,
        payload
    );

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`createProductReview failed: ${err}`);
    }
    const result = (await response.json()) as Review;
    return result;
}




