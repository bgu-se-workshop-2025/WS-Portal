import React, { useState, useEffect, useCallback } from "react";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";

import { ProductDto } from "../../../../../shared/types/dtos";
import { GetProductsPayload } from "../../../../../shared/types/requests";
import { sdk, isAuthenticated } from "../../../../../sdk/sdk";

import HeaderBar from "./components/HeaderBar";
import ProductsGrid from "./components/ProductGrid";
import PaginationBar from "./components/PaginationBar";
import AddProductDialog from "./components/AddProductDialog";
import { is } from "date-fns/locale";

const StoreProducts: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  if (!storeId) return null;

  // ───── Local State ─────────────────────────────────────────────────────────
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [isSeller, setIsSeller] = useState<boolean>(false);

  // “Add Product” dialog open/close
  const [addOpen, setAddOpen] = useState<boolean>(false);

  const [updateProducts, setUpdateProducts] = useState<boolean>(false);

  // ───── Check “is seller?” ───────────────────────────────────────────────────
  useEffect(() => {
    const fetchSellerStatus = async () => {
      if (isAuthenticated() === false) {
        setIsSeller(false);
        return;
      }
      try {
        const me = await sdk.getCurrentUserProfileDetails();
        const mySeller = await sdk.getSeller(storeId, me.id);
        setIsSeller(mySeller !== null);
      } catch (err: any) {
        setIsSeller(false);
      }
    };

    fetchSellerStatus();
  }, [storeId]);

  // ───── Fetch Products (with pagination) ─────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(undefined);

    const payload: GetProductsPayload = {
      page,
      size: 12,
      storeId,
    };

    try {
      const items = (await sdk.getProducts(payload)) as ProductDto[];
      setProducts(items);

      // if your API returns total pages or total count, update here
      setTotalPages(1);
    } catch (err: any) {
      console.error("Failed to load products:", err);
      setError(err.message || "Failed to load products");
      setProducts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, storeId]);

  // Initial load and whenever `storeId` or `page` changes
  useEffect(() => {
    setPage(0);
    fetchProducts();
  }, [storeId, fetchProducts, updateProducts]);

  // ───── Handlers ─────────────────────────────────────────────────────────────
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleOpenAddDialog = () => {
    setAddOpen(true);
  };

  const handleCloseAddDialog = () => {
    setAddOpen(false);
  };

  // This is passed down to AddProductDialog
  const handleProductAdded = () => {
    setAddOpen(false);
    setPage(0);
    fetchProducts();
  };

  // ───── Render ───────────────────────────────────────────────────────────────
  return (
    <Box sx={{ width: "100%", px: { xs: 2, sm: 0 } }}>
      {/* HEADER & ACTION BAR */}
      <HeaderBar isSeller={isSeller} onAddClick={handleOpenAddDialog} />

      {/* CONTENT AREA */}
      <ProductsGrid
        products={products}
        loading={loading}
        error={error}
        setUpdateProducts={setUpdateProducts}
        isSeller={isSeller}
      />

      {/* PAGINATION BAR */}
      <PaginationBar
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* ADD PRODUCT DIALOG */}
      <AddProductDialog
        open={addOpen}
        storeId={storeId}
        onClose={handleCloseAddDialog}
        onProductAdded={handleProductAdded}
      />
    </Box>
  );
};

export default StoreProducts;
