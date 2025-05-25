import { Box, Button, Dialog, Stack, Typography, TextField, Divider } from "@mui/material";
import { DiscountDataModel } from "../DiscountTypes";
import { useState } from "react";
import { Close } from "@mui/icons-material";
import StoreDiscountEditorResources from "./StoreDiscountEditorResources.json";
import DiscountTypeSelector from "./components/DiscountTypeSelector";
import DiscountResources from "../DiscountResources.json";
import DiscountValueSelector from "./components/DiscountValueSelector";

const ElementsVerticalMargin = 1;

export type StoreDiscountEditorProps = {
    storeId?: string;
    productId?: string;
    discountId?: string;
    discountState?: DiscountDataModel;
}

const StoreDiscountEditor = ({
    storeId,
    productId,
    discountId,
    discountState
}: StoreDiscountEditorProps) => {
    const [open, setOpen] = useState<boolean>(true);
    const [policy, setPolicy] = useState<DiscountDataModel | undefined>(discountState);
    const tagAndLabelPairs = DiscountResources.DiscountTypes;

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPolicy(policy => policy ? { ...policy, title: event.target.value } : undefined);
    };

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPolicy(policy => policy ? { ...policy, description: event.target.value } : undefined);
    };

    const onSave = () => {
        if (!policy) {
            console.error("No discount policy set.");
            return;
        }
        // Implement save logic here
        console.log("Saving discount policy:", policy);
        console.log("Store ID:", storeId);
        console.log("Product ID:", productId);
        console.log("Discount ID:", discountId);
        setOpen(false);
    }

    const getLabelForTag = (tag: string): string => tagAndLabelPairs.find(pair => pair.tag === tag)?.label || "";

    return (<Dialog open={open}>
        <Box width="32vw" height="88vh" padding="1rem">
            <Stack direction="row" justifyContent="space-between" marginBottom={ElementsVerticalMargin}>
                <Typography marginTop={ElementsVerticalMargin} color="primary" variant="h5">{StoreDiscountEditorResources.DiscountEditorTitle}</Typography>
                <Button onClick={() => setOpen(!open)}>
                    <Close />
                </Button>
            </Stack>
            <Stack justifyContent="space-between" height="90%">
                <Stack gap={2}>
                    <Divider orientation="horizontal" flexItem />
                    {!policy && <DiscountTypeSelector setPolicy={setPolicy} />}
                    {policy && (<Stack gap={1}>
                        <Typography variant="h6">
                            {getLabelForTag(policy.type)}{StoreDiscountEditorResources.DiscountPolicyLabel}
                        </Typography>
                        <TextField
                            label={StoreDiscountEditorResources.DiscountTitleLabel}
                            value={policy?.title || ""}
                            onChange={handleTitleChange}
                        />
                        <TextField
                            label={StoreDiscountEditorResources.DiscountDescriptionLabel}
                            value={policy?.description || ""}
                            onChange={handleDescriptionChange}
                        />
                        {DiscountValueSelector(policy.type, { policy, setPolicy })}
                    </Stack>)}
                </Stack>
                <Button onClick={onSave}>{StoreDiscountEditorResources.SaveDiscountButton}</Button>
            </Stack>
        </Box>
    </Dialog >);
}

export default StoreDiscountEditor;