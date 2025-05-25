// https://github.com/bgu-se-workshop-2025/WS-Api/tree/main/src/main/java/bguse/wsapi/models/store/policies/discount

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

export type BaseDiscountDataModel = {
    type: DiscountTypeTag;
    id?: string;
    title: string;
    description?: string;
    discountPercentage: number;
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