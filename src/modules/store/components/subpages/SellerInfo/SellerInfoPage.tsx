import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import { sdk } from "../../../../../sdk/sdk";
import SellerPublicCard from "./SellerInfoCard";

const SellerInfoPage: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const [sellers, setSellers] = useState<[string, string][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const load = async () => {
    if (!storeId) return;
    try {
      const result = await sdk.getPublicSellersInfo(storeId);
      console.log("✅ getPublicSellersInfo result:", result); // <-- LOG HERE
      setSellers(Object.entries(result));
    } catch (err) {
      console.error("❌ Failed to fetch sellers:", err);
      setSellers([]);
    } finally {
      setLoading(false);
    }
  };
  load();
}, [storeId]);


  if (loading) {
    return (
      <Box mt={4} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" align="center" mb={3}>
        Store Sellers
      </Typography>

      <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center">
        {sellers.map(([username, profilePictureUri]) => (
          <Box key={username} flex="1 1 250px" maxWidth="300px">
            <SellerPublicCard
              username={username}
              profilePictureUri={profilePictureUri === "noImage" ? undefined : profilePictureUri}
            />
          </Box>
        ))}
      </Box>

      {sellers.length === 0 && (
        <Typography align="center" mt={4} color="text.secondary">
          No sellers found for this store.
        </Typography>
      )}
    </Box>
  );
};

export default SellerInfoPage;
