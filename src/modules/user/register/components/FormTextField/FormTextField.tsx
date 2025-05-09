import { Box, TextField, Tooltip, Typography } from "@mui/material";
import FormTextFieldResources from "./FormTextFieldResources.json";
import InfoIcon from '@mui/icons-material/Info';

export type FormTextFieldProps = {
    id: string;
    label: string;
    type?: string;
    placeholder?: string;
    infoPop?: string;
}

const FormTextField = ({
    id,
    label,
    type = "text",
    placeholder,
    infoPop
}: FormTextFieldProps) => {
    return <TextField
        id={id}
        label={
            <Box sx={FormTextFieldResources.Styles.LabelContainer}>
                <Typography variant="body1">{label}</Typography>
                {infoPop &&
                    <Tooltip arrow title={infoPop}>
                        <InfoIcon fontSize="small" sx={FormTextFieldResources.Styles.PopIcon} />
                    </Tooltip>
                }
            </Box>
        }
        type={type}
        placeholder={placeholder}
        sx={FormTextFieldResources.Styles.Field}
        slotProps={{ input: { style: { borderRadius: "1rem" } } }}
    />
}

export default FormTextField;