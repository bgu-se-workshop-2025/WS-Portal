import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Paper,
  IconButton,
  InputBase,
  Collapse,
  ClickAwayListener,
  Box,
} from "@mui/material";
import { SearchOutlined, FilterAltOutlined } from "@mui/icons-material";

import SearchFilter, { SearchFilterType } from "../extra/SearchFilter";

const SearchBar: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Search state
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterOpen, setFilterOpen] = React.useState(false);

  // Filter state
  const [priceRange, setPriceRange] = React.useState<number[]>([0, 1000]);
  const [productRating, setProductRating] = React.useState<number | null>(0);
  const [storeRating, setStoreRating] = React.useState<number | null>(0);

  // Sync with URL parameters when they change
  React.useEffect(() => {
    const query = searchParams.get('q') || '';
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '1000');
    const minProductRating = parseFloat(searchParams.get('minProductRating') || '0');
    const minStoreRating = parseFloat(searchParams.get('minStoreRating') || '0');

    setSearchQuery(query);
    setPriceRange([minPrice, maxPrice]);
    setProductRating(minProductRating);
    setStoreRating(minStoreRating);
  }, [searchParams]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    // Build search parameters
    const params = new URLSearchParams();
    
    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim());
    }
    
    if (priceRange[0] > 0) {
      params.set('minPrice', priceRange[0].toString());
    }
    
    if (priceRange[1] < 1000) {
      params.set('maxPrice', priceRange[1].toString());
    }
    
    if (productRating && productRating > 0) {
      params.set('minProductRating', productRating.toString());
    }
    
    if (storeRating && storeRating > 0) {
      params.set('minStoreRating', storeRating.toString());
    }

    // Navigate to search results
    navigate(`/search?${params.toString()}`);
    setFilterOpen(false);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Automatically open filter menu when user starts typing
    if (!filterOpen) {
      setFilterOpen(true);
    }
  };

  const handleSearchInputFocus = () => {
    // Automatically open filter menu when user focuses on search input
    setFilterOpen(true);
  };

  const handleClickAway = () => {
    if (filterOpen) {
      // Trigger search when closing the filter menu
      handleSearch();
    }
  };

  const clearAllFilters = () => {
    setPriceRange([0, 1000]);
    setProductRating(0);
    setStoreRating(0);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div>
        <Paper
          component="form"
          onSubmit={handleSearch}
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
          <InputBase 
            sx={{ ml: 1, flex: 1 }} 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={handleSearchInputChange}
            onFocus={handleSearchInputFocus}
          />
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
              width: "37.5rem",
              zIndex: 999999,
              position: "relative",
            }}
          >
            {/* Price Range Filter */}
            <SearchFilter
              title="Price Range ($)"
              value={priceRange}
              setValue={setPriceRange}
              type={SearchFilterType.Slider}
              clearValue={[0, 1000]}
            />

            {/* Product Rating Filter */}
            <SearchFilter
              title="Minimum Product Rating"
              value={productRating}
              setValue={setProductRating}
              type={SearchFilterType.Rating}
              clearValue={0}
            />

            {/* Store Rating Filter */}
            <SearchFilter
              title="Minimum Store Rating"
              value={storeRating}
              setValue={setStoreRating}
              type={SearchFilterType.Rating}
              clearValue={0}
            />

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <IconButton
                onClick={clearAllFilters}
                color="inherit"
                size="small"
              >
                Clear All
              </IconButton>
            </Box>
          </Paper>
        </Collapse>
      </div>
    </ClickAwayListener>
  );
};

export default SearchBar;
