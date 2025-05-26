import DiscountResources from "../DiscountResources.json";

const tagAndLabelPairs = DiscountResources.DiscountTypes;

export function getLabelForTag(tag: string): string {
    return tagAndLabelPairs.find(pair => pair.tag === tag)?.label || "";
}
