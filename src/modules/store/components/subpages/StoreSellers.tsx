import React, { useEffect, useState } from "react";
import { Box, Typography, Stack, Button } from "@mui/material";
import SellerCard from "./SellerCard";
import SellerPermissionsDialog from "./SellerPermissionsDialog";
import AddSellerDialog from "./AddSellerDialog";
import RemoveSellerDialog from "./RemoveSellerDialog";
import { sdk } from "../../../../sdk/sdk";
import { PublicUserDto } from "../../../../shared/types/dtos";

type PermissionObject = Record<string, boolean>;

interface Seller {
  id: string;
  name: string;
  role: string;
  isYou?: boolean;
  permissions: PermissionObject;
}

const StoreSellers: React.FC<{ storeId?: string }> = ({ storeId }) => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [permDialogOpen, setPermDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [selectedSellerToRemove, setSelectedSellerToRemove] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(""); // 🔹 NEW STATE

  const currentUserId = ;

  const fetchSellers = () => {
    if (!storeId) return;
    setLoading(true);
    setFetchError("");

    sdk.getStoreOfficials(storeId)
      .then((officials: PublicUserDto[]) => {
        const result: Seller[] = officials.map((u) => ({
          id: u.id,
          name: u.username,
          role: "Manager",
          isYou: u.id === currentUserId,
          permissions: ,
        }));
        setSellers(result);
      })
      .catch((err) => {
      setSellers([]);
      setFetchError(`Error fetching store officials: ${err.message || String(err) || "Unknown error"}`);
      }).finally(() => setLoading(false));
  };

  useEffect(fetchSellers, [storeId]);

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
    setSellers((prev) =>
      prev.map((s) =>
        s.id === selectedSeller.id ? { ...s, permissions: newPerms } : s
      )
    );
    handleClosePerms();
  };

  const handleAddSuccess = (newSeller: Seller) => {
    setSellers((prev) => [...prev, newSeller]);
    setAddDialogOpen(false);
  };

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
        {/* 🔹 SHOW FETCH ERROR */}
        {fetchError && (
          <Typography color="error.main" align="center">
            {fetchError}
          </Typography>
        )}

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

        {!loading && !fetchError && sellers.length === 0 && (
          <Typography color="textSecondary" align="center">
            No sellers yet for this store.
          </Typography>
        )}
      </Stack>

      {storeId && (
        <AddSellerDialog
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          storeId={storeId}
          employerSellerId={currentUserId}
          onSuccess={handleAddSuccess}
        />
      )}

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
