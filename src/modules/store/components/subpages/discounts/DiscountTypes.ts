// https://github.com/bgu-se-workshop-2025/WS-Api/tree/main/src/main/java/bguse/wsapi/models/store/policies/discount

import { DiscountContract, DiscountPolicyParams } from "../../../../../sdk/modules/store/policy";

export type SimpleDiscountTypeTag = "simple_discount_policy";
export type ContainsDiscountTypeTag = "contains_discount_policy";
export type CatregoryDiscountTypeTag = "category_discount_policy";
export type GreaterThanDiscountTypeTag = "greater_than_discount_policy";

export type MaxDiscountTypeTag = "max_discount_policy";
export type AndDiscountTypeTag = "and_discount_policy";
export type XorDiscountTypeTag = "xor_discount_policy";
export type OrDiscountTypeTag = "or_discount_policy";

export type CompositeDiscountTypeTag = MaxDiscountTypeTag
    | AndDiscountTypeTag
    | XorDiscountTypeTag
    | OrDiscountTypeTag;


export type DiscountTypeTag = SimpleDiscountTypeTag
    | ContainsDiscountTypeTag
    | CatregoryDiscountTypeTag
    | GreaterThanDiscountTypeTag
    | CompositeDiscountTypeTag;

export type ResourceScope = {
    storeId?: string;
    productId?: string;
}

export type BaseDiscountDataModel = {
    type: DiscountTypeTag;
    id?: string;
    title: string;
    description?: string;
    discountPercentage: number;
    scope?: ResourceScope;
}

export type SimpleDiscountDataModel = BaseDiscountDataModel & {
    type: SimpleDiscountTypeTag;
}

export type ContainsDiscountDataModel = BaseDiscountDataModel & {
    type: ContainsDiscountTypeTag;
    containsProductId?: string;
    containsCategory?: string;
    quantity: number;
}

export type CategoryDiscountDataModel = BaseDiscountDataModel & {
    type: CatregoryDiscountTypeTag;
    category: string;
}

export type GreaterThanDiscountDataModel = BaseDiscountDataModel & {
    type: GreaterThanDiscountTypeTag;
    minTransactionPrice: number;
    greaterThanCategory?: string;
}

export type BaseCompositeDiscountDataModel = BaseDiscountDataModel & {
    first?: DiscountDataModel;
    second?: DiscountDataModel;
}

export type MaxDiscountDataModel = BaseCompositeDiscountDataModel & {
    type: MaxDiscountTypeTag;
}

export type AndDiscountDataModel = BaseCompositeDiscountDataModel & {
    type: AndDiscountTypeTag;
}

export type XorDiscountDataModel = BaseCompositeDiscountDataModel & {
    type: XorDiscountTypeTag;
    preferCheaper: boolean;
}

export type OrDiscountDataModel = BaseCompositeDiscountDataModel & {
    type: OrDiscountTypeTag;
}

export type CompositeDiscountDataModel = MaxDiscountDataModel
    | AndDiscountDataModel
    | XorDiscountDataModel
    | OrDiscountDataModel;

export type DiscountDataModel = SimpleDiscountDataModel
    | ContainsDiscountDataModel
    | CategoryDiscountDataModel
    | GreaterThanDiscountDataModel
    | CompositeDiscountDataModel;

export function getDiscountDataModel(tag: DiscountTypeTag): DiscountDataModel {
    switch (tag) {
        case "simple_discount_policy":
            return { type: "simple_discount_policy", discountPercentage: 0, title: "" };
        case "contains_discount_policy":
            return { type: "contains_discount_policy", discountPercentage: 0, quantity: 1, title: "" };
        case "category_discount_policy":
            return { type: "category_discount_policy", discountPercentage: 0, category: "", title: "" };
        case "greater_than_discount_policy":
            return { type: "greater_than_discount_policy", discountPercentage: 0, minTransactionPrice: 0, title: "" };
        case "max_discount_policy":
            return { type: "max_discount_policy", discountPercentage: 0, first: undefined, second: undefined, title: "" };
        case "and_discount_policy":
            return { type: "and_discount_policy", discountPercentage: 0, first: undefined, second: undefined, title: "" };
        case "xor_discount_policy":
            return { type: "xor_discount_policy", discountPercentage: 0, preferCheaper: true, first: undefined, second: undefined, title: "" };
        case "or_discount_policy":
            return { type: "or_discount_policy", discountPercentage: 0, first: undefined, second: undefined, title: "" };
        default:
            throw new Error(`Unknown discount type tag ${tag}`);
    }
}

export function getSimpleDiscountContractParams(policy: SimpleDiscountDataModel): DiscountPolicyParams {
    return {
        type: policy.type,
        discountPercentage: policy.discountPercentage
    };
}

export function getContainsDiscountContractParams(policy: ContainsDiscountDataModel): DiscountPolicyParams {
    return {
        type: policy.type,
        discountPercentage: policy.discountPercentage,
        containsProductId: policy.containsProductId,
        containsCategory: policy.containsCategory,
        quantity: policy.quantity
    };
}

export function getCategoryDiscountContractParams(policy: CategoryDiscountDataModel): DiscountPolicyParams {
    return {
        type: policy.type,
        discountPercentage: policy.discountPercentage,
        category: policy.category
    };
}

export function getGreaterThanDiscountContractParams(policy: GreaterThanDiscountDataModel): DiscountPolicyParams {
    return {
        type: policy.type,
        discountPercentage: policy.discountPercentage,
        minTransactionPrice: policy.minTransactionPrice,
        greaterThanCategory: policy.greaterThanCategory
    };
}

export function getMaxDiscountContractParams(policy: MaxDiscountDataModel): DiscountPolicyParams {
    return {
        type: policy.type,
        discountPercentage: policy.discountPercentage,
        first: policy.first ? getDiscountParams(policy.first) : undefined,
        second: policy.second ? getDiscountParams(policy.second) : undefined
    };
}

export function getAndDiscountContractParams(policy: AndDiscountDataModel): DiscountPolicyParams {
    return {
        type: policy.type,
        discountPercentage: policy.discountPercentage,
        first: policy.first ? getDiscountParams(policy.first) : undefined,
        second: policy.second ? getDiscountParams(policy.second) : undefined
    };
}

export function getXorDiscountContractParams(policy: XorDiscountDataModel): DiscountPolicyParams {
    return {
        type: policy.type,
        discountPercentage: policy.discountPercentage,
        first: policy.first ? getDiscountParams(policy.first) : undefined,
        second: policy.second ? getDiscountParams(policy.second) : undefined,
        preferCheaper: policy.preferCheaper
    };
}

export function getOrDiscountContractParams(policy: OrDiscountDataModel): DiscountPolicyParams {
    return {
        type: policy.type,
        discountPercentage: policy.discountPercentage,
        first: policy.first ? getDiscountParams(policy.first) : undefined,
        second: policy.second ? getDiscountParams(policy.second) : undefined
    };
}

export function getDiscountParams(policy: DiscountDataModel): DiscountPolicyParams {
    switch (policy.type) {
        case "simple_discount_policy":
            return getSimpleDiscountContractParams(policy as SimpleDiscountDataModel);
        case "contains_discount_policy":
            return getContainsDiscountContractParams(policy as ContainsDiscountDataModel);
        case "category_discount_policy":
            return getCategoryDiscountContractParams(policy as CategoryDiscountDataModel);
        case "greater_than_discount_policy":
            return getGreaterThanDiscountContractParams(policy as GreaterThanDiscountDataModel);
        case "max_discount_policy":
            return getMaxDiscountContractParams(policy as MaxDiscountDataModel);
        case "and_discount_policy":
            return getAndDiscountContractParams(policy as AndDiscountDataModel);
        case "xor_discount_policy":
            return getXorDiscountContractParams(policy as XorDiscountDataModel);
        case "or_discount_policy":
            return getOrDiscountContractParams(policy as OrDiscountDataModel);
    }
}

export function getDiscountContract(policy: DiscountDataModel): DiscountContract {
    return {
        title: policy.title,
        description: policy.description,
        discountPercentage: policy.discountPercentage,
        params: getDiscountParams(policy)
    };
}

export function getDiscountDataModelFromParams(params: DiscountPolicyParams): DiscountDataModel {
    const data = getDiscountDataModel(params.type);
    switch (data.type) {
        case "simple_discount_policy":
            data.discountPercentage = params.discountPercentage;
            break;
        case "contains_discount_policy":
            data.discountPercentage = params.discountPercentage;
            data.containsProductId = params.containsProductId;
            data.containsCategory = params.containsCategory;
            data.quantity = params.quantity ?? 1; // although should be always defined
            break;
        case "category_discount_policy":
            data.discountPercentage = params.discountPercentage;
            data.category = params.category ?? ""; // should be always defined
            break;
        case "greater_than_discount_policy":
            data.discountPercentage = params.discountPercentage;
            data.minTransactionPrice = params.minTransactionPrice ?? 0; // should be always defined
            data.greaterThanCategory = params.greaterThanCategory;
            break;
        case "max_discount_policy":
            data.discountPercentage = params.discountPercentage;
            data.first = params.first ? getDiscountDataModelFromParams(params.first) : undefined;
            data.second = params.second ? getDiscountDataModelFromParams(params.second) : undefined;
            break;
        case "and_discount_policy":
            data.discountPercentage = params.discountPercentage;
            data.first = params.first ? getDiscountDataModelFromParams(params.first) : undefined;
            data.second = params.second ? getDiscountDataModelFromParams(params.second) : undefined;
            break;
        case "xor_discount_policy":
            data.discountPercentage = params.discountPercentage;
            data.preferCheaper = params.preferCheaper ?? true; // should be always defined
            data.first = params.first ? getDiscountDataModelFromParams(params.first) : undefined;
            data.second = params.second ? getDiscountDataModelFromParams(params.second) : undefined;
            break;
        case "or_discount_policy":
            data.discountPercentage = params.discountPercentage;
            data.first = params.first ? getDiscountDataModelFromParams(params.first) : undefined;
            data.second = params.second ? getDiscountDataModelFromParams(params.second) : undefined;
            break;
    }
    return data;
}

export function getDiscountDataModelFromContract(contract: DiscountContract, storeId: string, productId?: string): DiscountDataModel {
    const resourceScope = { storeId, productId };
    const data = getDiscountDataModelFromParams(contract.params);
    data.id = contract.id;
    data.title = contract.title;
    data.description = contract.description;
    data.discountPercentage = contract.discountPercentage;
    data.scope = resourceScope;
    return data;
}