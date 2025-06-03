import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Stack, Button } from "@mui/material";
import SellerCard from "./SellerCard";
import SellerPermissionsDialog from "./SellerPermissionsDialog";
import AddSellerDialog from "./AddSellerDialog";
import RemoveSellerDialog from "./RemoveSellerDialog";
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

const StoreSellers = () => {
  const { storeId } = useParams();
	if (!storeId) return;

  const [sellers, setSellers] = useState<Seller[]>([]);
  const [permDialogOpen, setPermDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [selectedSellerToRemove, setSelectedSellerToRemove] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(true);

  const currentUserId = "1"; // Replace with real current user ID



  
  const fetchSellers = () => {
    if (!storeId) return;
    setLoading(true);
    sdk.getStoreOfficials(storeId)
      .then((officials: PublicUserDto[]) => {
        const result: Seller[] = officials.map((u) => ({
          id: u.id,
          name: u.username,
          role: "Manager", // You can replace with u.role if available
          isYou: u.id === currentUserId,
          permissions: {
            CanAddDiscount: false,
            CanRemoveProduct: false,
            CanAddProduct: false,
            CanModifyPermissions: false,
          },
        }));
        setSellers(result);
      })
      .catch(() => setSellers([]))
      .finally(() => setLoading(false));
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
    if (!selectedSeller) return;
    // Optional: update backend with new permissions here via sdk
    setSellers((prev) =>
      prev.map((s) =>
        s.id === selectedSeller.id ? { ...s, permissions: newPerms } : s
      )
    );
    handleClosePerms();
  };

  // Add seller success
  const handleAddSuccess = (newSeller: Seller) => {
    setSellers((prev) => [...prev, newSeller]);
    setAddDialogOpen(false);
  };

  // Remove seller flow
  const handleDeleteSellerClick = (seller: Seller) => {
    setSelectedSellerToRemove(seller);
    setRemoveDialogOpen(true);
  };

  const handleConfirmRemove = async () => {
    if (!selectedSellerToRemove) return;
    try {
      await sdk.removeSeller(storeId!, selectedSellerToRemove.id);
      setSellers((prev) =>
        prev.filter((s) => s.id !== selectedSellerToRemove.id)
      );
    } catch (err: any) {
      alert(err.message || "Failed to remove seller");
    } finally {
      setRemoveDialogOpen(false);
      setSelectedSellerToRemove(null);
    }
  };

  return (
    <Box width="100%" display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h6" mb={2}>
        👥 Store Sellers
      </Typography>

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
            onDeleteClick={() => handleDeleteSellerClick(seller)}
          />
        ))}

        {!loading && sellers.length === 0 && (
          <Typography color="textSecondary" align="center">
            No sellers yet for this store.
          </Typography>
        )}
      </Stack>

      {/* Add Seller Dialog */}
      {storeId && (
        <AddSellerDialog
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          storeId={storeId}
          employerSellerId={currentUserId}
          onSuccess={handleAddSuccess}
        />
      )}

      {/* Permissions Dialog */}
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

      {/* Remove Seller Dialog */}
      <RemoveSellerDialog
        open={removeDialogOpen}
        sellerName={selectedSellerToRemove?.name || ""}
        onClose={() => setRemoveDialogOpen(false)}
        onConfirm={handleConfirmRemove}
      />
    </Box>
  );
};

export default StoreSellers;
