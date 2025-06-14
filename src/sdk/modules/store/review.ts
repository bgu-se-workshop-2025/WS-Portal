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
        throw new Error(err);
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
    const response = await this.post(
        `/reviews/stores/${payload.storeId}/products/${payload.productId}`,
        safePayload
    );

    if (!response.ok) {
        const err = await response.text();
        throw new Error(err);
    }
    const result = (await response.json()) as ReviewDto;
    return result;
}




