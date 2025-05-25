import { MenuItem } from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import DiscountResources from "../../DiscountResources.json";
import { useState } from "react";

type DiscountEntry = {
    tag: string;
    label: string;
}

const DiscountTypeSelector = () => {
    const [selectedType, setSelectedType] = useState<string>("");
    const discountTypes: DiscountEntry[] = DiscountResources.DiscountTypes;

    const renderValue = () => {
        const selectedDiscount = discountTypes.find(d => d.tag === selectedType);
        return selectedDiscount ? selectedDiscount.label : "Pick a Discount Policy";
    }

    const handleChange = (event: SelectChangeEvent<string>) => {
        setSelectedType(event.target.value as string);
    }

    return <Select
        displayEmpty
        value={selectedType}
        renderValue={renderValue}
        onChange={handleChange}
    >
        <MenuItem value="" disabled>
            Pick a Discount Policy
        </MenuItem>
        {discountTypes.map((type) => (
            <MenuItem key={type.tag} value={type.tag}>{type.label}</MenuItem>
        ))}
    </Select>
}

export default DiscountTypeSelector;