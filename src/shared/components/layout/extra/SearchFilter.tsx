import React from "react";

import {
  Box,
  Slider,
  Rating,
  FormControl,
  FormLabel,
  IconButton,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
} from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";

export enum SearchFilterType {
  Slider = "slider",
  Rating = "rating",
  MultiSelect = "multiselect",
}

interface SearchFilterProps {
  title: string;
  value: any;
  setValue: (value: any) => void;
  type: SearchFilterType;
  clearValue?: any;
  options?: string[]; // For multi-select
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  title,
  value,
  setValue,
  type,
  clearValue = 0,
  options = [],
}) => {
  const handleMultiSelectChange = (event: any) => {
    const newValue = event.target.value;
    setValue(typeof newValue === 'string' ? newValue.split(',') : newValue);
  };

  const handleCategoryDelete = (categoryToDelete: string) => {
    setValue((categories: string[]) => 
      categories.filter(category => category !== categoryToDelete)
    );
  };

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
      case SearchFilterType.MultiSelect:
        return (
          <Select
            multiple
            value={value}
            onChange={handleMultiSelectChange}
            input={<OutlinedInput />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((item: string) => (
                  <Chip
                    key={item}
                    label={item}
                    size="small"
                    onDelete={() => handleCategoryDelete(item)}
                    onMouseDown={(e) => e.stopPropagation()}
                  />
                ))}
              </Box>
            )}
          >
            {options.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
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
