import { MenuItem } from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import DiscountResources from "../../DiscountResources.json";
import { useState } from "react";
import StoreDiscountEditorResources from "../StoreDiscountEditorResources.json";
import { DiscountDataModel, DiscountTypeTag, getDiscountDataModel } from "../../DiscountTypes";

type DiscountEntry = {
    tag: DiscountTypeTag;
    label: string;
}

const DiscountTypeSelector = ({ setPolicy }: { setPolicy: (policy: DiscountDataModel) => void }) => {
    const [selectedType, setSelectedType] = useState<string>("");
    const discountTypes: DiscountEntry[] = DiscountResources.DiscountTypes as DiscountEntry[];

    const renderValue = () => {
        const selectedDiscount = discountTypes.find(d => d.tag === selectedType);
        return selectedDiscount ? selectedDiscount.label : StoreDiscountEditorResources.PickDiscountPolicy;
    }

    const handleChange = (event: SelectChangeEvent<string>) => {
        setSelectedType(event.target.value as string);
        const selectedDiscount = discountTypes.find(d => d.tag === event.target.value);
        if (selectedDiscount && setPolicy) {
            setPolicy(getDiscountDataModel(selectedDiscount.tag));
        }
    }

    return <Select
        displayEmpty
        value={selectedType}
        renderValue={renderValue}
        onChange={handleChange}
    >
        <MenuItem value="" disabled>
            {StoreDiscountEditorResources.PickDiscountPolicy}
        </MenuItem>
        {discountTypes.map((type) => (
            <MenuItem key={type.tag} value={type.tag}>{type.label}</MenuItem>
        ))}
    </Select>
}

export default DiscountTypeSelector;