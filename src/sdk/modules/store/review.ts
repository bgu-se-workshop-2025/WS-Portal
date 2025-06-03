import { ReviewDto } from "../../../shared/types/dtos.ts";
import { SDK } from "../../sdk.ts";


export async function createStoreReview(this: SDK, payload: ReviewDto): Promise<ReviewDto> {
    const safePayload = {
        ...payload,
        title: "",
        body: ""
    };
    const response = await this.post(`/reviews/stores/${payload.storeId}`, safePayload);

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`createStoreReview failed: ${err}`);
    }
    const result = (await response.json()) as ReviewDto;
    return result;
}

export async function createProductReview(this: SDK, payload: ReviewDto): Promise<ReviewDto> {
    const safePayload = {
        ...payload,
        title: "",
        body: ""
    };
    // Explicitly set title and body to empty string, do not allow payload.title/body to override
    safePayload.title = "";
    safePayload.body = "";
    const response = await this.post(
        `/reviews/stores/${payload.storeId}/products/${payload.productId}`,
        safePayload
    );

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`createProductReview failed: ${err}`);
    }
    const result = (await response.json()) as ReviewDto;
    return result;
}




