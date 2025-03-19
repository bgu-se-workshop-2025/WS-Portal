import React from "react";
import { TextField } from "@mui/material";

type LoginTextFieldProps = {
    id: string;
    label: string;
    type?: string;
};

const LoginTextField: React.FC<LoginTextFieldProps> = ({ id, label, type }) => {
    return (
        <TextField
            id={id}
            label={label}
            type={type}
            sx={{ margin: "0.5rem", width: "30rem" }}
            slotProps={{ input: { style: { borderRadius: "1rem" } } }}
        />
    );
};

export default LoginTextField;
