import React, { useState, useEffect } from "react";
import { Box, Typography, Container } from "@mui/material";

import StoreSellerToolbar from "./components/subpages/StoreSellerToolbar";
import StoreProducts from "../store/components/subpages/StoreProducts";
import StoreSellers from "../store/components/subpages/StoreSellers";
import StoreSettings from "../store/components/subpages/StoreSettings";
import StoreDiscounts from "../store/components/subpages/StoreDiscounts";

import { StoreDto } from "../../shared/types/dtos";
import { sdk } from "../../sdk/sdk";

type Tab = "products" | "sellers" | "settings" | "discounts";

const SellerStorePage: React.FC<{ id?: string }> = ({ id }) => {
  const [activeTab, setActiveTab] = useState<Tab>("products");
  const [store, setStore] = useState<StoreDto | null>(null);

  useEffect(() => {
    if (!id) return;

    sdk.getStore(id)
      .then((result) => {
        setStore(result);
      })
      .catch((err) => {
        console.error("Failed to fetch store:", err.message);
        setStore(null);
      });
  }, [id]);

  return (
    <Box minHeight="100vh" bgcolor="#f7f7f7" py={6}>
      <Container maxWidth="md">
        <Typography variant="h4" align="center" color="textPrimary" gutterBottom>
          🏪 {store?.name || "Loading..."}
        </Typography>

        <Box display="flex" justifyContent="center" mb={4}>
          <StoreSellerToolbar activeTab={activeTab} onTabChange={setActiveTab} />
        </Box>

        <Box display="flex" justifyContent="center">
          {activeTab === "products" && <StoreProducts storeId={id} />}
          {activeTab === "sellers" && <StoreSellers storeId={id} />}
          {activeTab === "settings" && <StoreSettings storeId={id} />}
          {activeTab === "discounts" && <StoreDiscounts storeId={id} />}
        </Box>
      </Container>
    </Box>
  );
};

export default SellerStorePage;
