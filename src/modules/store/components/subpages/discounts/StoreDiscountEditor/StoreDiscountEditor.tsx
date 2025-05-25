import { Box, Button, Dialog, Stack, Typography } from "@mui/material";
import { DiscountDataModel } from "../DiscountTypes";
import { useState } from "react";
import { Close } from "@mui/icons-material";
import StoreDiscountEditorResources from "./StoreDiscountEditorResources.json";
import DiscountTypeSelector from "./components/DiscountTypeSelector";

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

    const onSave = () => {
        if (!policy) {
            console.error("No discount policy set.");
            return;
        }
        // Implement save logic here
        console.log("Saving discount policy:", policy);
        setOpen(false);
    }

    return (<Dialog open={open}>
        <Box width="24vw" height="64vh" padding="1rem">
            <Stack direction="row" justifyContent="flex-end">
                <Button onClick={() => setOpen(!open)}>
                    <Close />
                </Button>
            </Stack>
            <Stack justifyContent="space-between" height="90%">
                <Stack gap={2}>
                    <Typography variant="h5">{StoreDiscountEditorResources.DiscountEditorTitle}</Typography>
                    {!policy && <DiscountTypeSelector setPolicy={setPolicy} />}
                </Stack>
                <Button onClick={onSave}>{StoreDiscountEditorResources.SaveDiscountButton}</Button>
            </Stack>
        </Box>
    </Dialog>);
}

export default StoreDiscountEditor;