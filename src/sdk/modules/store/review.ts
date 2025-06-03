import { ReviewDto } from "../../../shared/types/dtos.ts";
import { SDK } from "../../sdk.ts";


export async function createStoreReview(this: SDK, payload: ReviewDto): Promise<ReviewDto> {
    const response = await this.post(`/review/store/${payload.storeId}`, payload);

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`createStoreReview failed: ${err}`);
    }
    const result = (await response.json()) as ReviewDto;
    return result;
}

export async function createProductReview(this: SDK, payload: ReviewDto): Promise<ReviewDto> {
    const response = await this.post(
        `/review/store/${payload.storeId}/product/${payload.productId}`,
        payload
    );

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`createProductReview failed: ${err}`);
    }
    const result = (await response.json()) as ReviewDto;
    return result;
}




