import React from "react";

import {
  Box,
  Slider,
  Rating,
  FormControl,
  FormLabel,
  IconButton,
} from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";

export enum SearchFilterType {
  Slider = "slider",
  Rating = "rating",
}

interface SearchFilterProps {
  title: string;
  value: any;
  setValue: (value: any) => void;
  type: SearchFilterType;
  clearValue?: any;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  title,
  value,
  setValue,
  type,
  clearValue = 0,
}) => {
  const filter = () => {
    switch (type) {
      case SearchFilterType.Slider:
        return (
          <Slider
            value={value}
            onChange={(_e, newValue) => setValue(newValue)}
            valueLabelDisplay="auto"
            valueLabelFormat={(v) => `${v} ₪`}
            min={clearValue[0]}
            max={clearValue[1]}
          />
        );
      case SearchFilterType.Rating:
        return (
          <Rating
            value={value}
            size="large"
            onChange={(_e, newValue) => setValue(newValue)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <FormControl fullWidth sx={{ mb: 2 }}>
      <FormLabel>{title}</FormLabel>
      <Box sx={{ display: "flex" }}>
        {filter()}
        <IconButton
          color="inherit"
          onClick={() => {
            setValue(clearValue);
          }}
          sx={{ p: 0, ml: "1rem" }}
          disabled={JSON.stringify(value) == JSON.stringify(clearValue)}
        >
          <DeleteOutline />
        </IconButton>
      </Box>
    </FormControl>
  );
};

export default SearchFilter;
