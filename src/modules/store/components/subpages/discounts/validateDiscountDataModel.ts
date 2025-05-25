import { getCategoryNamesFlatList } from "../../../../../sdk/modules/categories/categories";
import { CategoryDiscountDataModel, CompositeDiscountDataModel, ContainsDiscountDataModel, DiscountDataModel, GreaterThanDiscountDataModel } from "./DiscountTypes";

export default function validateDiscountDataModel(model: DiscountDataModel): string[] {
    const errors: string[] = [];
    if(!model.title || model.title.trim() === "") {
        errors.push("Title is required.");
    }
    if(model.discountPercentage < 0 || model.discountPercentage > 100) {
        errors.push("Discount percentage must be between 0 and 100.");
    }

    switch(model.type) {
        case "simple_discount_policy":
            return errors;
        case "contains_discount_policy":
            return [...errors, ...validateContainsDiscountDataModel(model as ContainsDiscountDataModel)];
        case "category_discount_policy":
            return [...errors, ...validateCategoryDiscountDataModel(model as CategoryDiscountDataModel)];
        case "greater_than_discount_policy":
            return [...errors, ...validateGreaterThanDiscountDataModel(model as GreaterThanDiscountDataModel)];
        case "max_discount_policy":
            return [...errors, ...validateCompositeDiscountDataModel(model as CompositeDiscountDataModel)];
        case "and_discount_policy":
            return [...errors, ...validateCompositeDiscountDataModel(model as CompositeDiscountDataModel)];
        case "xor_discount_policy":
            return [...errors, ...validateCompositeDiscountDataModel(model as CompositeDiscountDataModel)];
        case "or_discount_policy":
            return [...errors, ...validateCompositeDiscountDataModel(model as CompositeDiscountDataModel)];
        default:
            return [...errors, "No such type of discount found. Please contact support."];
    }
}

function validateContainsDiscountDataModel(model: ContainsDiscountDataModel): string[] {
    const errors: string[] = [];
    if(model.quantity <= 0) {
        errors.push("Quantity must be greater than 0.");
    }
    if(!model.containsCategory && !model.containsProductId) {
        errors.push("Either a product ID or a category must be specified.");
    }
    if(!!model.containsCategory && !!model.containsProductId) {
        errors.push("Only one of product ID or category can be specified.");
    }
    if(model.containsCategory && !getCategoryNamesFlatList().includes(model.containsCategory)) {
        errors.push(`Category "${model.containsCategory}" does not exist.`);
    }
    return errors;
}

function validateCategoryDiscountDataModel(model: CategoryDiscountDataModel): string[] {
    if(!model.category || model.category.trim() === "") {
        return ["Category name is required."];
    }
    if(!getCategoryNamesFlatList().reduce((prev, curr, _) => prev || curr === model.category, false)) {
        return [`Category "${model.category}" does not exist.`];
    }
    return [];
}

function validateGreaterThanDiscountDataModel(model: GreaterThanDiscountDataModel): string[] {
    const errors: string[] = [];
    if(model.minTransactionPrice <= 0) {
        errors.push("Minimum transaction price must be greater than 0.");
    }
    if(model.greaterThanCategory && !getCategoryNamesFlatList().includes(model.greaterThanCategory)) {
        errors.push(`Category "${model.greaterThanCategory}" does not exist.`);
    }
    return errors;
}

function validateCompositeDiscountDataModel(model: CompositeDiscountDataModel): string[] {
    const errors: string[] = [];
    if(!model.first) {
        errors.push("First discount is required for composite discounts.");
    } else {
        const firstErrors = validateDiscountDataModel(model.first);
        if(firstErrors.length > 0) {
            errors.push(...firstErrors.map(err => `First discount: ${err}`));
        }
    }
    if(!model.second) {
        errors.push("Second discount is required for composite discounts.");
    } else {
        const secondErrors = validateDiscountDataModel(model.second);
        if(secondErrors.length > 0) {
            errors.push(...secondErrors.map(err => `Second discount: ${err}`));
        }
    }
    return errors;
}

