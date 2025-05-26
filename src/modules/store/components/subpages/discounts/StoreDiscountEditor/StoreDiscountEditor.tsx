import { Box, Button, Dialog, Stack, Typography, TextField, Divider } from "@mui/material";
import { DiscountDataModel } from "../DiscountTypes";
import { useState } from "react";
import { Close } from "@mui/icons-material";
import StoreDiscountEditorResources from "./StoreDiscountEditorResources.json";
import DiscountTypeSelector from "./components/DiscountTypeSelector";
import DiscountValueSelector from "./components/DiscountValueSelector";
import validateDiscountDataModel from "../validateDiscountDataModel";
import { getLabelForTag } from "../util/discountUtils";

const ElementsVerticalMargin = 1;

export type StoreDiscountEditorProps = {
    discountState?: DiscountDataModel;
    openState: {
        open: boolean;
        setOpen: (open: boolean) => void;
    },
    createDiscount: (discount: DiscountDataModel) => Promise<void>;
}

const StoreDiscountEditor = ({
    discountState,
    openState: { open, setOpen },
    createDiscount,
}: StoreDiscountEditorProps) => {
    const [policy, setPolicy] = useState<DiscountDataModel | undefined>(discountState);
    const [errors, setErrors] = useState<string[]>([]);

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPolicy(policy => policy ? { ...policy, title: event.target.value } : undefined);
    };

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPolicy(policy => policy ? { ...policy, description: event.target.value } : undefined);
    };

    const onSave = () => {
        const validationErrors = validateDiscountDataModel(policy, true);
        setErrors(validationErrors);
        if (validationErrors.length > 0 || !policy) {
            return;
        } else {
            createDiscount(policy).then(() => {
                setOpen(false);
            }).catch((error) => {
                console.error("Error saving discount:", error);
                setErrors([...errors, "Something went wrong while saving the discount, contact support if this issue persists."]);
            });
        }
    }

    const handleClose = () => {
        setOpen(false);
        setPolicy(undefined);
        setErrors([]);
    }

    return (<Dialog open={open}>
        <Box width="32vw" height="88vh" padding="1rem">
            <Stack direction="row" justifyContent="space-between" marginBottom={ElementsVerticalMargin}>
                <Typography marginTop={ElementsVerticalMargin} color="primary" variant="h5">{StoreDiscountEditorResources.DiscountEditorTitle}</Typography>
                <Button onClick={handleClose}>
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
                    {errors.length > 0 && (
                        <Stack>
                            {errors.map((error, index) => (
                                <Typography key={index} color="error">
                                    - {error}
                                </Typography>
                            ))}
                        </Stack>
                    )}
                </Stack>
                <Button onClick={onSave}>{StoreDiscountEditorResources.SaveDiscountButton}</Button>
            </Stack>
        </Box>
    </Dialog >);
}

export default StoreDiscountEditor;