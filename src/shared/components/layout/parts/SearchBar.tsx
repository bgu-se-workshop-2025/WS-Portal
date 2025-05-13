import React from "react";

import {
  Paper,
  IconButton,
  InputBase,
  Collapse,
  ClickAwayListener,
} from "@mui/material";

import { SearchOutlined, FilterAltOutlined } from "@mui/icons-material";
import SearchFilter, { SearchFilterType } from "../extra/SearchFilter";

const SearchBar: React.FC = () => {
  const [filterOpen, setFilterOpen] = React.useState(false);

  const [priceRange, setPriceRange] = React.useState<number[]>([0, 1000]);
  const [productRating, setProductRating] = React.useState<number | null>(0);
  const [storeRating, setStoreRating] = React.useState<number | null>(0);

  return (
    <ClickAwayListener onClickAway={() => setFilterOpen(false)}>
      <div>
        <Paper
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            // handle search submit here
          }}
          elevation={1}
          sx={{
            p: "0.125rem 0.5rem",
            display: "flex",
            alignItems: "center",
            width: "37.5rem",
            borderRadius: "1.5rem",
            boxShadow: "0 0.0625rem 0.375rem rgba(32,33,36,0.28)",
          }}
        >
          <IconButton type="submit" sx={{ p: "0.375rem" }} color="inherit">
            <SearchOutlined />
          </IconButton>
          <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search..." />
          <IconButton
            sx={{ p: "0.375rem" }}
            color={filterOpen ? "primary" : "inherit"}
            onClick={() => {
              setFilterOpen((open) => !open);
            }}
          >
            <FilterAltOutlined />
          </IconButton>
        </Paper>

        <Collapse in={filterOpen}>
          <Paper
            elevation={1}
            sx={{
              p: "1rem",
              mt: "0.5rem",
              borderRadius: "1rem",
            }}
          >
            <SearchFilter
              title="Product Price"
              value={priceRange}
              setValue={setPriceRange}
              type={SearchFilterType.Slider}
              clearValue={[0, 1000]}
            />

            <SearchFilter
              title="Product Rating"
              value={productRating}
              setValue={setProductRating}
              type={SearchFilterType.Rating}
              clearValue={0}
            />

            <SearchFilter
              title="Store Rating"
              value={storeRating}
              setValue={setStoreRating}
              type={SearchFilterType.Rating}
              clearValue={0}
            />
          </Paper>
        </Collapse>
      </div>
    </ClickAwayListener>
  );
};

export default SearchBar;
