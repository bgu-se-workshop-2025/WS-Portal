import { Stack, TextField, Checkbox, FormControlLabel, Select, Menu, MenuItem, SelectChangeEvent } from "@mui/material";
import resources from "../StoreDiscountEditorResources.json";
import { ContainsDiscountDataModel, DiscountDataModel, DiscountTypeTag, CategoryDiscountDataModel, GreaterThanDiscountDataModel } from "../../DiscountTypes";
import { useState } from "react";

const ValueSelectorsStackGap = 2;

export type DiscountValueSelectorProps = {
    policy: DiscountDataModel;
    setPolicy: (policy: DiscountDataModel) => void;
    shouldShowPercentage?: boolean;
}

const PercentageValueSelector = ({ policy, setPolicy, shouldShowPercentage }: DiscountValueSelectorProps) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(0, Math.min(100, Number(event.target.value)));
        setPolicy({ ...policy, discountPercentage: value });
    };

    return shouldShowPercentage ? (
        <TextField
            label={resources.DiscountPercentageLabel}
            type="number"
            value={policy.discountPercentage}
            onChange={handleChange}
            slotProps={{ htmlInput: { min: 0, max: 100 } }}
            fullWidth
        />
    ) : null;
}

const SimpleDiscountValueSelector = ({ policy, setPolicy, shouldShowPercentage = true }: DiscountValueSelectorProps) => {
    return <Stack direction="row" gap={ValueSelectorsStackGap}>
        <PercentageValueSelector
            policy={policy}
            setPolicy={setPolicy}
            shouldShowPercentage={shouldShowPercentage}
        />
    </Stack>
}

const ContainsProductMode = 'product';
const ContainsCategoryMode = 'category';
type ContainsMode = 'product' | 'category';

const ContainsDiscountValueSelector = ({ policy, setPolicy, shouldShowPercentage = true }: DiscountValueSelectorProps) => {
    const typedPolicy = policy as ContainsDiscountDataModel;
    const [mode, setMode] = useState<ContainsMode>(
        typedPolicy.containsCategory ? ContainsCategoryMode : ContainsProductMode
    );

    const handleProductIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPolicy({ ...typedPolicy, containsProductId: event.target.value, containsCategory: undefined });
    };
    const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPolicy({ ...typedPolicy, containsCategory: event.target.value, containsProductId: undefined });
    };

    const handleModeChange = (event: SelectChangeEvent) => {
        const newMode = event.target.value as ContainsMode;
        setMode(newMode);
        if (newMode === ContainsProductMode) {
            setPolicy({ ...typedPolicy, containsCategory: undefined });
        } else {
            setPolicy({ ...typedPolicy, containsProductId: undefined });
        }
    };

    return (
        <Stack gap={ValueSelectorsStackGap}>
            <PercentageValueSelector policy={policy} setPolicy={setPolicy} shouldShowPercentage={shouldShowPercentage} />
            <Select value={mode} onChange={handleModeChange} fullWidth>
                <MenuItem value={ContainsProductMode}>{resources.ContainsProductLabel}</MenuItem>
                <MenuItem value={ContainsCategoryMode}>{resources.ContainsCategoryLabel}</MenuItem>
            </Select>
            {mode === ContainsProductMode ? (
                <TextField
                    label={resources.ProductIdLabel}
                    value={typedPolicy.containsProductId || ""}
                    onChange={handleProductIdChange}
                    fullWidth
                />
            ) : (
                <TextField
                    label={resources.CategoryLabel}
                    value={typedPolicy.containsCategory || ""}
                    onChange={handleCategoryChange}
                    fullWidth
                />
            )}
        </Stack>
    );
};

const CategoryDiscountValueSelector = ({ policy, setPolicy, shouldShowPercentage = true }: DiscountValueSelectorProps) => {
    const typedPolicy = policy as CategoryDiscountDataModel;
    const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPolicy(typedPolicy ? { ...typedPolicy, category: event.target.value } : typedPolicy);
    };

    return <Stack gap={ValueSelectorsStackGap}>
        <PercentageValueSelector policy={policy} setPolicy={setPolicy} shouldShowPercentage={shouldShowPercentage} />
        <TextField label={resources.CategoryLabel} value={typedPolicy.category || ""} onChange={handleCategoryChange} fullWidth />
    </Stack>;
}

const GreaterThanDiscountValueSelector = ({ policy, setPolicy, shouldShowPercentage = true }: DiscountValueSelectorProps) => {
    const typedPolicy = policy as GreaterThanDiscountDataModel;
    const [categoryScoped, setCategoryScoped] = useState<boolean>(!!typedPolicy.greaterThanCategory);
    const handleMinTransactionPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPolicy(typedPolicy ? { ...typedPolicy, minTransactionPrice: Number(event.target.value) } : typedPolicy);
    };

    const handleGreaterThanCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPolicy(typedPolicy ? { ...typedPolicy, greaterThanCategory: event.target.value } : typedPolicy);
    };

    const handleCategoryScopedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCategoryScoped(event.target.checked);
    }

    return <Stack gap={ValueSelectorsStackGap}>
        <PercentageValueSelector policy={policy} setPolicy={setPolicy} shouldShowPercentage={shouldShowPercentage} />
        <TextField
            label={resources.MinimumTransactionPriceLabel}
            type="number"
            value={typedPolicy.minTransactionPrice || 0}
            onChange={handleMinTransactionPriceChange}
            slotProps={{ htmlInput: { min: 0 } }}
            fullWidth
        />
        <FormControlLabel
            control={
                <Checkbox
                    checked={categoryScoped}
                    onChange={handleCategoryScopedChange}
                />
            }
            label={resources.CategoryScopedLabel}
        />
        {categoryScoped &&
            <TextField
                label={resources.CategoryLabel}
                value={typedPolicy.greaterThanCategory || ""}
                onChange={handleGreaterThanCategoryChange}
                fullWidth
            />
        }
    </Stack>
}

const DiscountValueSelector = (tag: DiscountTypeTag, props: DiscountValueSelectorProps) => {
    switch (tag) {
        case "simple_discount_policy":
            return <SimpleDiscountValueSelector {...props} />;
        case "contains_discount_policy":
            return <ContainsDiscountValueSelector {...props} />;
        case "category_discount_policy":
            return <CategoryDiscountValueSelector {...props} />;
        case "greater_than_discount_policy":
            return <GreaterThanDiscountValueSelector {...props} />;
        // Add more cases for different discount types as needed
        default:
            return null; // or a default component
    }
}

export default DiscountValueSelector;