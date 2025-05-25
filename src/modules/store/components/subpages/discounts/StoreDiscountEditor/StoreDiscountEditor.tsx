import { Box, Button, Dialog, Stack, Typography } from "@mui/material";
import { DiscountDataModel } from "../DiscountTypes";
import { useState } from "react";
import { Close } from "@mui/icons-material";
import DiscountTypeSelector from "./components/DiscountTypeSelector";

export type StoreDiscountEditorProps = {
    storeId?: string;
    productId?: string;
    discountId?: string;
    discountState: DiscountDataModel;
}


const StoreDiscountEditor = () => {
    const [open, setOpen] = useState<boolean>(true);
    return (<Dialog open={open}>
        <Box width="24vw" height="64vh" padding="1rem">
            <Stack direction={"row"} justifyContent={"flex-end"}>
                <Button onClick={() => setOpen(!open)}><Close /></Button>
            </Stack>
            <Stack justifyContent="space-between" height="90%">
                <Stack gap={2}>
                    <Typography variant="h5">Discount Editor</Typography>
                    <DiscountTypeSelector />
                </Stack>
                <Button>Save Discount</Button>
            </Stack>
        </Box>
    </Dialog>);
}

export default StoreDiscountEditor;