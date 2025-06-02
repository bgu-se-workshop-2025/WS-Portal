import { Stack, TextField, Checkbox, FormControlLabel, Select, MenuItem, SelectChangeEvent, Typography } from "@mui/material";
import resources from "../StoreDiscountEditorResources.json";
import DiscountResources from "../../DiscountResources.json";
import { ContainsDiscountDataModel, DiscountDataModel, DiscountTypeTag, CategoryDiscountDataModel, GreaterThanDiscountDataModel, CompositeDiscountDataModel, XorDiscountDataModel } from "../../DiscountTypes";
import { useState } from "react";
import DiscountTypeSelector from "./DiscountTypeSelector";

const ValueSelectorsStackGap = 2;
const CompositePaddingLeft = 4;

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

const CompositeDiscountValueSelector = ({ policy, setPolicy, shouldShowPercentage = false }: DiscountValueSelectorProps) => {
    const typedPolicy = policy as CompositeDiscountDataModel;
    const tagAndLabelPairs = DiscountResources.DiscountTypes as { tag: DiscountTypeTag, label: string }[];

    const updateFirstDiscount = (first: DiscountDataModel | undefined) => {
        setPolicy({ ...typedPolicy, first: first });
    }

    const updateSecondDiscount = (second: DiscountDataModel | undefined) => {
        setPolicy({ ...typedPolicy, second: second });
    }

    const getLabelForTag = (tag: string): string => tagAndLabelPairs.find(pair => pair.tag === tag)?.label || "";

    return <Stack gap={ValueSelectorsStackGap}>
        <PercentageValueSelector policy={policy} setPolicy={setPolicy} shouldShowPercentage={shouldShowPercentage} />
        <Typography variant="h6">
            {resources.CompositeDiscountLabelFirst}{
                typedPolicy.first
                    ? `: (${getLabelForTag(typedPolicy.first.type)}${resources.DiscountPolicyLabel})`
                    : ""
            }
        </Typography>
        <Stack paddingLeft={CompositePaddingLeft}>
            {typedPolicy.first ? DiscountValueSelector(typedPolicy.first.type, {
                policy: typedPolicy.first,
                setPolicy: updateFirstDiscount,
                shouldShowPercentage: !shouldShowPercentage
            }) : <DiscountTypeSelector setPolicy={updateFirstDiscount} />}
        </Stack>
        <Typography variant="h6">
            {resources.CompositeDiscountLabelSecond}{
                typedPolicy.second
                    ? `: (${getLabelForTag(typedPolicy.second.type)}${resources.DiscountPolicyLabel})`
                    : ""
            }
        </Typography>
        <Stack paddingLeft={CompositePaddingLeft}>
            {typedPolicy.second ? DiscountValueSelector(typedPolicy.second.type, {
                policy: typedPolicy.second,
                setPolicy: updateSecondDiscount,
                shouldShowPercentage: !shouldShowPercentage
            }) : <DiscountTypeSelector setPolicy={updateSecondDiscount} />}
        </Stack>
    </Stack>
}

const XorDiscountValueSelector = ({ policy, setPolicy }: DiscountValueSelectorProps) => {
    const typedPolicy = policy as XorDiscountDataModel;

    const handlePreferCheaperChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPolicy({ ...typedPolicy, preferCheaper: event.target.checked });
    };

    return <Stack gap={ValueSelectorsStackGap}>
        <FormControlLabel
            control={
                <Checkbox
                    checked={typedPolicy.preferCheaper}
                    onChange={handlePreferCheaperChange}
                />
            }
            label={resources.PreferCheaperLabel}
        />
        <CompositeDiscountValueSelector
            policy={policy}
            setPolicy={setPolicy}
            shouldShowPercentage={false}
        />
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
        case "max_discount_policy":
            return <CompositeDiscountValueSelector {...props} shouldShowPercentage={false} />;
        case "and_discount_policy":
            return <CompositeDiscountValueSelector {...props} shouldShowPercentage />;
        case "xor_discount_policy":
            return <XorDiscountValueSelector {...props} />;
        case "or_discount_policy":
            return <CompositeDiscountValueSelector {...props} shouldShowPercentage />;
        // Add more cases for different discount types as needed
        default:
            return null; // or a default component
    }
}

export default DiscountValueSelector;