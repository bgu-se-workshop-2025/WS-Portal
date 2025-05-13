import { ReviewDto } from "../../../shared/types/dtos.ts";
import { SDK } from "../../sdk.ts";

const storeController = "store";
const productController = "product";


export async function createStoreReview(this: SDK, payload: ReviewDto): Promise<ReviewDto> {
    const response = await this.post(`${storeController}/${payload.storeId}/`, payload);

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`createStoreReview failed: ${err}`);
    }
    const result = (await response.json()) as ReviewDto;
    return result;
}

export async function createProductReview(this: SDK, payload: ReviewDto): Promise<ReviewDto> {
    const response = await this.post(
        `${storeController}/${payload.storeId}/${productController}/${payload.productId}`,
        payload
    );

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`createProductReview failed: ${err}`);
    }
    const result = (await response.json()) as ReviewDto;
    return result;
}




