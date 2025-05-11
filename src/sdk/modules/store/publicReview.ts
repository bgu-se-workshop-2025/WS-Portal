import { SDK } from "../../sdk.ts";

const controller = "publicReview";

interface PublicReview {
    id: string;
    content: string;
    rating: number;
    storeId: string;
    productId?: string;
}

export async function getStoreReviews(this: SDK, storeId: string, page: number = 0, size: number = 25): Promise<PublicReview[]> {
    const query = new URLSearchParams({ page: page.toString(), size: size.toString() });
    const response = await this.get(`${controller}/store/${storeId}?${query.toString()}`, {});

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Failed to fetch store reviews: ${err}`);
    }

    const result = (await response.json()) as PublicReview[];
    return result;
}

export async function getProductReviews(this: SDK, storeId: string, productId: string, page: number = 0, size: number = 25): Promise<PublicReview[]> {
    const query = new URLSearchParams({ page: page.toString(), size: size.toString() });
    const response = await this.get(`${controller}/store/${storeId}/product/${productId}?${query.toString()}`, {});

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Failed to fetch product reviews: ${err}`);
    }

    const result = (await response.json()) as PublicReview[];
    return result;
}
