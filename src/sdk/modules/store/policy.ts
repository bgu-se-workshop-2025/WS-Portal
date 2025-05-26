import { DiscountTypeTag } from "../../../modules/store/components/subpages/discounts/DiscountTypes";

const storeController = "stores";
const publicStoreController = "public/stores";
const productExtension = "products";
const policyExtension = "policy";

const resourceScope  = (storeId: string, productId?: string) =>
    `${storeId}${productId ? `/${productExtension}/${productId}` : ""}/${policyExtension}`;

export type DiscountPolicyParams = {
    type: DiscountTypeTag;
    discountPercentage: number;
    category?: string;
    containsProductId?: string;
    containsCategory?: string;
    quantity?: number;
    minTransactionPrice?: number;
    greaterThanCategory?: string;
    first?: DiscountPolicyParams;
    second?: DiscountPolicyParams;
    preferCheaper?: boolean;
}

export type DiscountContract = {
    title: string;
    description?: string;
    // no support of expiration and internal description for now
    discountPercentage: number;
    params: DiscountPolicyParams
}