import { Box, InputLabel, TextField, Tooltip } from "@mui/material";
import FormTextFieldResources from "./FormTextFieldResources.json";
import InfoIcon from '@mui/icons-material/Info';
import { useState } from "react";

export type FormTextFieldProps = {
    id: string;
    label: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    validation?: (value: string) => boolean;
    infoPop?: string;
}

const FormTextField = ({
    id,
    label,
    type = "text",
    placeholder,
    required = false,
    validation,
    infoPop
}: FormTextFieldProps) => {
    const [error, setError] = useState(false);

    const handleChange = validation ? (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setError(!validation(value));
    } : undefined;

    return <Box>
        <InputLabel htmlFor={id}>
            {label + (required ? " * " : "")}
            {infoPop &&
                <Tooltip arrow tabIndex={0} title={infoPop} leaveDelay={FormTextFieldResources.Constants.PopCloseDelay}>
                    <InfoIcon fontSize="small" sx={FormTextFieldResources.Styles.PopIcon} />
                </Tooltip>
            }
        </InputLabel>
        <TextField
            id={id}
            type={type}
            error={error}
            required={required}
            placeholder={placeholder}
            onChange={handleChange}
            sx={FormTextFieldResources.Styles.Field}
            slotProps={{ input: { style: { borderRadius: "1rem" } } }}
        />
    </Box>
}

export default FormTextField;