import React, { useState } from "react";
import { Box, Typography, Stack } from "@mui/material";
import SellerCard from "./SellerCard";
import SellerPermissionsDialog from "./SellerPermissionsDialog";

// Define permissions type used in both dialog and local state
type PermissionObject = {
  CanAddDiscount: boolean;
  CanRemoveProduct: boolean;
  CanAddProduct: boolean;
  CanModifyPermissions: boolean;
};

interface Seller {
  id: number;
  name: string;
  role: string;
  isYou?: boolean;
  permissions: PermissionObject;
}

const StoreSellers: React.FC<{ storeId?: string }> = ({ storeId }) => {
  const [sellers, setSellers] = useState<Seller[]>([
    {
      id: 1,
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
    {
      id: 2,
      name: "Shalev",
      role: "Moderator",
      permissions: {
        CanAddDiscount: false,
        CanRemoveProduct: false,
        CanAddProduct: false,
        CanModifyPermissions: false,
      },
    },
    {
      id: 3,
      name: "Noam",
      role: "Custom",
      permissions: {
        CanAddDiscount: false,
        CanRemoveProduct: false,
        CanAddProduct: false,
        CanModifyPermissions: false,
      },
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);

  // Simulated current user's permissions
  const currentUserPermissions: (keyof PermissionObject)[] = [
    "CanModifyPermissions",
  ];

  const handleOpenDialog = (seller: Seller) => {
    setSelectedSeller(seller);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedSeller(null);
  };

  const handleSavePermissions = (updatedPermissions: PermissionObject) => {
    setSellers((prev) =>
      prev.map((s) =>
        s.id === selectedSeller!.id
          ? { ...s, permissions: updatedPermissions }
          : s
      )
    );
    handleCloseDialog();
  };

  return (
    <Box width="100%" display="flex" flexDirection="column" alignItems="center">
      <Typography
        variant="h6"
        fontWeight={700}
        color="purple"
        textAlign="center"
        mb={2}
      >
        👥 Store Sellers {storeId}
      </Typography>

      <Stack spacing={2} width="100%" maxWidth="500px">
        {sellers.map((seller) => (
          <SellerCard
            key={seller.id}
            name={seller.name}
            role={seller.role}
            isYou={seller.isYou}
            onSettingsClick={() => handleOpenDialog(seller)}
          />
        ))}
      </Stack>

      {selectedSeller && (
        <SellerPermissionsDialog
          open={dialogOpen}
          sellerName={selectedSeller.name}
          permissions={selectedSeller.permissions}
          canEdit={currentUserPermissions.includes("CanModifyPermissions")}
          onClose={handleCloseDialog}
          onSave={handleSavePermissions}
        />
      )}
    </Box>
  );
};

export default StoreSellers;
