import { Box, Button, Dialog, Stack, Typography, TextField } from "@mui/material";
import { DiscountDataModel } from "../DiscountTypes";
import { useState } from "react";
import { Close } from "@mui/icons-material";
import StoreDiscountEditorResources from "./StoreDiscountEditorResources.json";
import DiscountTypeSelector from "./components/DiscountTypeSelector";
import DiscountResources from "../DiscountResources.json";

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
            <Stack direction="row" justifyContent="flex-end">
                <Button onClick={() => setOpen(!open)}>
                    <Close />
                </Button>
            </Stack>
            <Stack justifyContent="space-between" height="90%">
                <Stack gap={2}>
                    <Typography variant="h5">{StoreDiscountEditorResources.DiscountEditorTitle}</Typography>
                    {!policy && <DiscountTypeSelector setPolicy={setPolicy} />}
                    {policy && (<Stack gap={1}>
                        <Typography variant="h6">{getLabelForTag(policy.type)}{StoreDiscountEditorResources.DiscountPolicyLabel}</Typography>
                        <TextField label={StoreDiscountEditorResources.DiscountTitleLabel} value={policy?.title || ""} onChange={(e) => setPolicy({ ...policy, title: e.target.value })} />
                        <TextField label={StoreDiscountEditorResources.DiscountDescriptionLabel} value={policy?.description || ""} onChange={(e) => setPolicy({ ...policy, description: e.target.value })} />
                    </Stack>)}
                </Stack>
                <Button onClick={onSave}>{StoreDiscountEditorResources.SaveDiscountButton}</Button>
            </Stack>
        </Box>
    </Dialog>);
}

export default StoreDiscountEditor;