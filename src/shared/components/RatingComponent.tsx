import React from "react";
import { Rating, Box } from "@mui/material";

export interface RatingComponentProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: "small" | "medium" | "large";
}

const RatingComponent: React.FC<RatingComponentProps & { precision?: number }> = ({
  value,
  onChange,
  readOnly = false,
  size = "large",
  precision = 1, // default to integer for store
}) => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" minHeight={40}>
      <Rating
        name="rating-component"
        value={value}
        max={5}
        precision={precision}
        size={size}
        readOnly={readOnly}
        onChange={(_e, newValue) => {
          if (onChange && typeof newValue === "number") onChange(newValue);
        }}
        sx={{ fontSize: size === "large" ? 40 : size === "medium" ? 28 : 20 }}
      />
    </Box>
  );
};

export default RatingComponent;
