import DiscountResources from "../DiscountResources.json";
import { DiscountDataModel } from "../DiscountTypes";

const tagAndLabelPairs = DiscountResources.DiscountTypes;

export function getLabelForTag(tag: string): string {
    return tagAndLabelPairs.find(pair => pair.tag === tag)?.label || "";
}

export function isCategoryScoped(discount: DiscountDataModel): boolean {
    return (discount.type === "category_discount_policy") ||
        (discount.type === "greater_than_discount_policy" && !!discount.greaterThanCategory) ||
        (discount.type === "contains_discount_policy" && !!discount.containsCategory);
}
