import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Pagination,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Paper,
} from "@mui/material";

import { ProductDto } from "../../shared/types/dtos";
import { GetProductsPayload } from "../../shared/types/requests";
import { sdk } from "../../sdk/sdk";
import ProductsGrid from "../store/components/subpages/products/components/ProductGrid";

const PRODUCTS_PER_PAGE = 12;

interface SearchFilters {
  query: string;
  minPrice: number;
  maxPrice: number;
  minProductRating: number;
  minStoreRating: number;
  sortBy: string;
}

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Store data for filtering and display
  const [storeData, setStoreData] = useState<Record<string, { name: string; rating: number }>>({});

  // Extract search parameters
  const getFiltersFromParams = useCallback((): SearchFilters => {
    return {
      query: searchParams.get('q') || '',
      minPrice: parseFloat(searchParams.get('minPrice') || '0'),
      maxPrice: parseFloat(searchParams.get('maxPrice') || '10000'),
      minProductRating: parseFloat(searchParams.get('minProductRating') || '0'),
      minStoreRating: parseFloat(searchParams.get('minStoreRating') || '0'),
      sortBy: searchParams.get('sortBy') || 'name_asc',
    };
  }, [searchParams]);

  const [filters, setFilters] = useState<SearchFilters>(getFiltersFromParams());

  // Update filters when URL params change
  useEffect(() => {
    const newFilters = getFiltersFromParams();
    
    // Check if there are any active filters (non-default values)
    const hasActiveFilters = (
      newFilters.minPrice > 0 ||
      newFilters.maxPrice < 10000 ||
      newFilters.minProductRating > 0 ||
      newFilters.minStoreRating > 0
    );
    
    // If no search query AND no active filters, redirect to main page
    if (!newFilters.query.trim() && !hasActiveFilters) {
      navigate('/');
      return;
    }
    
    setFilters(newFilters);
    setPage(0);
  }, [getFiltersFromParams, navigate]);

  // Fetch store data for products
  const fetchStoreData = useCallback(async (products: ProductDto[]) => {
    const storeIds = [...new Set(products.map(p => p.storeId).filter((id): id is string => id != null))];
    const storeDataMap: Record<string, { name: string; rating: number }> = {};

    await Promise.all(
      storeIds.map(async (storeId) => {
        try {
          const store = await sdk.getStore(storeId);
          storeDataMap[storeId] = {
            name: store.name,
            rating: store.rating ?? 0
          };
        } catch (err) {
          console.error(`Failed to fetch store ${storeId}:`, err);
          storeDataMap[storeId] = {
            name: 'Unknown Store',
            rating: 0
          };
        }
      })
    );

    setStoreData(storeDataMap);
    return storeDataMap;
  }, []);

  // Fetch products based on current filters
  const fetchProducts = useCallback(async () => {
    // Check if there are any active filters
    const hasActiveFilters = (
      filters.minPrice > 0 ||
      filters.maxPrice < 10000 ||
      filters.minProductRating > 0 ||
      filters.minStoreRating > 0
    );
    
    // If no search query and no filters, should have been redirected already
    if (!filters.query.trim() && !hasActiveFilters) {
      return;
    }

    setLoading(true);
    setError(undefined);

    const payload: GetProductsPayload = {
      page,
      size: PRODUCTS_PER_PAGE,
      keywords: filters.query.trim() ? [filters.query] : undefined,
      minPrice: filters.minPrice > 0 ? filters.minPrice : undefined,
      maxPrice: filters.maxPrice < 10000 ? filters.maxPrice : undefined,
      sortBy: filters.sortBy !== 'name_asc' ? filters.sortBy : undefined,
    };

    try {
      const items = await sdk.getProducts(payload);
      
      // Fetch store data first
      const currentStoreData = await fetchStoreData(items);
      
      // Filter by ratings on client side since API doesn't support it yet
      const filteredItems = items.filter(product => {
        const productRatingMatch = (product.rating ?? 0) >= filters.minProductRating;
        const storeRatingMatch = product.storeId ? (currentStoreData[product.storeId]?.rating || 0) >= filters.minStoreRating : false;
        return productRatingMatch && storeRatingMatch;
      });
      
      setProducts(filteredItems);
      setTotalResults(filteredItems.length);
      // For simplicity, assume single page for now. In real app, API should return pagination info
      setTotalPages(Math.ceil(filteredItems.length / PRODUCTS_PER_PAGE));
    } catch (err: any) {
      console.error("Failed to load search results:", err);
      setError(err.message || "Failed to load search results");
      setProducts([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, [filters, page, fetchStoreData]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSortChange = (newSortBy: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sortBy', newSortBy);
    navigate(`/search?${newParams.toString()}`);
  };

  const handleRemoveFilter = (filterType: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(filterType);
    navigate(`/search?${newParams.toString()}`);
  };

  const handlePageChange = (_: any, value: number) => {
    setPage(value - 1);
  };

  // Check if there are any active filters for rendering decision
  const hasActiveFilters = (
    filters.minPrice > 0 ||
    filters.maxPrice < 10000 ||
    filters.minProductRating > 0 ||
    filters.minStoreRating > 0
  );

  // Don't render anything if no query and no filters (will redirect)
  if (!filters.query.trim() && !hasActiveFilters) {
    return null;
  }

  return (
    <Box sx={{ p: 4, minHeight: 'calc(100vh - 8rem)' }}>
      {/* Search Results Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {filters.query ? 'Search Results' : 'Filtered Products'}
        </Typography>
        
        {filters.query && (
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Results for: "{filters.query}"
          </Typography>
        )}

        {!filters.query && (
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Discover amazing products from all stores
          </Typography>
        )}

        <Typography variant="body1" color="text.secondary">
          {loading ? 'Loading...' : `${totalResults} products found`}
        </Typography>
      </Box>

      {/* Active Filters */}
      {(filters.minPrice > 0 || filters.maxPrice < 10000 || filters.minProductRating > 0 || filters.minStoreRating > 0) && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Active Filters:
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {filters.minPrice > 0 && (
              <Chip 
                label={`Min Price: $${filters.minPrice}`} 
                onDelete={() => handleRemoveFilter('minPrice')}
                size="small" 
              />
            )}
            {filters.maxPrice < 10000 && (
              <Chip 
                label={`Max Price: $${filters.maxPrice}`} 
                onDelete={() => handleRemoveFilter('maxPrice')}
                size="small" 
              />
            )}
            {filters.minProductRating > 0 && (
              <Chip 
                label={`Min Product Rating: ${filters.minProductRating}★`} 
                onDelete={() => handleRemoveFilter('minProductRating')}
                size="small" 
              />
            )}
            {filters.minStoreRating > 0 && (
              <Chip 
                label={`Min Store Rating: ${filters.minStoreRating}★`} 
                onDelete={() => handleRemoveFilter('minStoreRating')}
                size="small" 
              />
            )}
          </Stack>
        </Paper>
      )}

      {/* Sort Controls */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={filters.sortBy}
            label="Sort By"
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <MenuItem value="name_asc">Name: A to Z</MenuItem>
            <MenuItem value="name_desc">Name: Z to A</MenuItem>
            <MenuItem value="price_asc">Price: Low to High</MenuItem>
            <MenuItem value="price_desc">Price: High to Low</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Search Results */}
      {!loading && !error && products.length === 0 && filters.query && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" gutterBottom>
            No products found
          </Typography>
          <Typography color="text.secondary">
            Try adjusting your search terms or filters
          </Typography>
        </Box>
      )}

      {/* Products Grid with Store Names */}
      <ProductsGridWithStoreNames
        products={products}
        storeData={storeData}
        loading={loading}
        error={error}
        setUpdateProducts={() => {}} // Not needed for search results
        isSeller={false} // Search results are always from user perspective
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

// Custom ProductsGrid component that includes store names
interface ProductsGridWithStoreNamesProps {
  products: ProductDto[] | undefined;
  storeData: Record<string, { name: string; rating: number }>;
  loading: boolean;
  error?: string;
  setUpdateProducts: React.Dispatch<React.SetStateAction<boolean>>;
  isSeller: boolean;
}

const ProductsGridWithStoreNames: React.FC<ProductsGridWithStoreNamesProps> = ({
  products,
  storeData,
  loading,
  error,
  setUpdateProducts,
  isSeller,
}) => {
  if (loading || error || !products) {
    return (
      <ProductsGrid
        products={products}
        loading={loading}
        error={error}
        setUpdateProducts={setUpdateProducts}
        isSeller={isSeller}
      />
    );
  }

  // Create enhanced products with store names for display
  const enhancedProducts = products.map(product => ({
    ...product,
    storeName: product.storeId ? storeData[product.storeId]?.name || 'Unknown Store' : 'Unknown Store',
    storeRating: product.storeId ? storeData[product.storeId]?.rating || 0 : 0,
  }));

  return (
    <ProductsGrid
      products={enhancedProducts}
      loading={loading}
      error={error}
      setUpdateProducts={setUpdateProducts}
      isSeller={isSeller}
    />
  );
};

export default SearchResultsPage; 