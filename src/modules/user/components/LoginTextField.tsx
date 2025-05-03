import React from "react";
import { TextField } from "@mui/material";

import { Resources } from "./LoginTextFieldResources.json"

type LoginTextFieldProps = {
    id: string;
    label: string;
    type?: string;
};

function LoginTextField({ id, label, type }: LoginTextFieldProps) {
    return (
        <TextField
            id={id}
            label={label}
            type={type}
            sx={Resources.Styles.TextField}
            slotProps={{ input: { style: { borderRadius: "1rem" } } }}
        />
    );
};

export default LoginTextField;
