import { DiscountTypeTag } from "../../../modules/store/components/subpages/discounts/DiscountTypes";
import { SDK } from "../../sdk";

const storeController = "stores";
const publicStoreController = "public/stores";
const policyResource = "policies";
const productResource = "products";

export type DiscountPolicyParamsDto = {
    type: DiscountTypeTag;
    discountPercentage: number;
    category?: string;
    containsProductId?: string;
    containsCategory?: string;
    quantity?: number;
    minTransactionPrice?: number;
    greaterThanCategory?: string;
    first?: DiscountPolicyParamsDto;
    second?: DiscountPolicyParamsDto;
    preferCheaper?: boolean;
};

export type DiscountDto = {
    id?: string;
    title: string;
    description?: string;
    // no support of expiration and internal description for now
    discountPercentage: number;
    params: DiscountPolicyParamsDto;
};

export async function getDiscountPolicy(
    this: SDK,
    storeId: string,
    policyId: string
): Promise<DiscountDto> {
    const response = await this.get(
        `${publicStoreController}/${storeId}/${policyResource}/${policyId}`,
        {}
    );

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Error fetching discount policy: ${error}`);
    }

    const result = (await response.json()) as DiscountDto;
    return result;
}

export async function getDiscountPolicies(
    this: SDK,
    storeId: string,
    productId?: string
): Promise<DiscountDto[]> {
    const response = await this.get(
        `${publicStoreController}/${storeId}${
            productId ? `/${productResource}/${productId}` : ""
        }/${policyResource}`,
        {}
    );

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Error fetching discount policies: ${error}`);
    }

    const result = (await response.json()) as DiscountDto[];
    return result;
}

export async function createDiscountPolicy(
    this: SDK,
    storeId: string,
    policy: DiscountDto,
    productId?: string
): Promise<DiscountDto> {
    const response = await this.post(
        `${storeController}/${storeId}${
            productId ? `/${productResource}/${productId}` : ""
        }/${policyResource}`,
        policy
    );

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Error creating discount policy: ${error}`);
    }

    const result = (await response.json()) as DiscountDto;
    return result;
}

export async function deleteDiscountPolicy(
    this: SDK,
    storeId: string,
    policyId: string,
    productId?: string
): Promise<void> {
    const response = await this.delete(
        `${storeController}/${storeId}${
            productId
                ? `/${productResource}/${productId}/${policyResource}`
                : `/${policyResource}/${policyId}`
        }`
    );

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Error deleting discount policy: ${error}`);
    }
}
