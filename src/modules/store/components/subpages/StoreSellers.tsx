import React, { useEffect, useState } from "react";
import { Box, Typography, Stack, Button } from "@mui/material";
import SellerCard from "./SellerCard";
import SellerPermissionsDialog from "./SellerPermissionsDialog";
import AddSellerDialog from "./AddSellerDialog";             // ← make sure this path is correct
import { sdk } from "../../../../sdk/sdk";
import { PublicUserDto } from "../../../../shared/types/dtos";

// Permissions structure
type PermissionObject = {
  CanAddDiscount: boolean;
  CanRemoveProduct: boolean;
  CanAddProduct: boolean;
  CanModifyPermissions: boolean;
};

interface Seller {
  id: string;
  name: string;
  role: string;
  isYou?: boolean;
  permissions: PermissionObject;
}

// Fallback data in case the SDK call fails
const fallbackSellers: Seller[] = [
  {
    id: "1",
    name: "Adam",
    role: "Manager",
    isYou: true,
    permissions: {
      CanAddDiscount: true,
      CanRemoveProduct: false,
      CanAddProduct: true,
      CanModifyPermissions: true,
    },
  },
];

const StoreSellers: React.FC<{ storeId?: string }> = ({ storeId }) => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [permDialogOpen, setPermDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);

  const currentUserId = "1"; // ← replace with real logged-in seller ID

  const fetchSellers = () => {
    if (!storeId) return;
    sdk.getStoreOfficials(storeId)
      .then((officials: PublicUserDto[]) => {
        setSellers(
          officials.map((u) => ({
            id: u.id,
            name: u.username,
            role: "Manager",             // or map from u.roles if available
            isYou: u.id === currentUserId,
            permissions: {
              CanAddDiscount: false,
              CanRemoveProduct: false,
              CanAddProduct: false,
              CanModifyPermissions: false,
            },
          }))
        );
      })
      .catch(() => {
        setSellers(fallbackSellers);
      });
  };

  useEffect(fetchSellers, [storeId]);

  // Permissions dialog handlers
  const handleOpenPerms = (seller: Seller) => {
    setSelectedSeller(seller);
    setPermDialogOpen(true);
  };
  const handleClosePerms = () => {
    setPermDialogOpen(false);
    setSelectedSeller(null);
  };
  const handleSavePerms = (newPerms: PermissionObject) => {
    setSellers((prev) =>
      prev.map((s) =>
        s.id === selectedSeller?.id ? { ...s, permissions: newPerms } : s
      )
    );
    handleClosePerms();
  };

  // After adding a seller, re-fetch and close the add‐dialog
  const handleAddSuccess = () => {
    fetchSellers();
    setAddDialogOpen(false);
  };

  return (
    <Box width="100%" display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h6" mb={2}>
        👥 Store Sellers
      </Typography>

      {/* ← Your Add Seller button */}
      <Button
        variant="contained"
        onClick={() => setAddDialogOpen(true)}
        sx={{ mb: 3 }}
      >
        Add Seller
      </Button>

      <Stack spacing={2} width="100%" maxWidth="500px">
        {sellers.map((seller) => (
          <SellerCard
            key={seller.id}
            name={seller.name}
            role={seller.role}
            isYou={seller.isYou}
            onSettingsClick={() => handleOpenPerms(seller)}
          />
        ))}
      </Stack>

      {/* ← Correctly render the AddSellerDialog component */}
      {storeId && (
        <AddSellerDialog
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          storeId={storeId}
          employerSellerId={currentUserId}  // ← don’t forget this prop
          onSuccess={handleAddSuccess}
        />
      )}

      {/* ← Your existing permissions‐editing dialog */}
      {selectedSeller && (
        <SellerPermissionsDialog
          open={permDialogOpen}
          sellerName={selectedSeller.name}
          permissions={selectedSeller.permissions}
          canEdit={true}
          onClose={handleClosePerms}
          onSave={handleSavePerms}
        />
      )}
    </Box>
  );
};

export default StoreSellers;
