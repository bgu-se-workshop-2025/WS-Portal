import React from "react";
import { TextField } from "@mui/material";

import { Resources } from "./LoginTextFieldResources.json";

type LoginTextFieldProps = {
  id: string;
  label: string;
  type?: string;
  setState?: React.Dispatch<React.SetStateAction<string>>;
};

const LoginTextField: React.FC<LoginTextFieldProps> = ({ id, label, type, setState }) => {
  return (
    <TextField
      id={id}
      label={label}
      onChange={(e) => setState && setState(e.target.value)}
      type={type}
      sx={Resources.Styles.TextField}
      slotProps={{ input: { style: { borderRadius: "1rem" } } }}
    />
  );
};

export default LoginTextField;
