import { useEffect, useState } from "react";
import { Box, Typography, Stack, Button , Snackbar} from "@mui/material";
import { useParams } from "react-router-dom";
import SellerCard from "./SellerCard";
import SellerPermissionsDialog from "./SellerPermissionsDialog";
import AddSellerDialog from "./AddSellerDialog";
import RemoveSellerDialog from "./RemoveSellerDialog";
import { sdk } from "../../../../sdk/sdk";
import {
  PublicUserDto,
  SellerDto,
} from "../../../../shared/types/dtos";

type PermissionObject = Record<string, boolean>;

interface Seller {
  userId: string;
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
  const [fetchError, setFetchError] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null); 
  const [errorOpen, setErrorOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [allPermissions, setAllPermissions] = useState<string[]>([]); 

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const user = await sdk.getCurrentUserProfileDetails();
        setCurrentUserId(user?.id || "");
      } catch (err) {
        console.error("Failed to get current user ", err);
        setCurrentUserId("");
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    sdk.getStorePermissions()
      .then(setAllPermissions)
      .catch((err) => {
        console.error("Failed to fetch store permissions ", err);
        setAllPermissions([]);
      });
  }, []);

  const fetchSellers = async () => {
    if (!storeId) {
      setSellers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setFetchError("");

    try {
      const officials: PublicUserDto[] = await sdk.getStoreOfficials(storeId);
      const detailedSellers: Seller[] = (
        await Promise.all(
          officials.map(async (u) => {
            try {
              const sellerDto: SellerDto = await sdk.getSeller(storeId, u.id);
              const roleName = sellerDto.type.toString() ?? "Unknown";

              const permsObj: PermissionObject = {};
              (sellerDto.permissions || []).forEach((perm) => {
                permsObj[perm] = true;
              });

              return {
                userId: u.id,
                name: u.username,
                role: roleName,
                isYou: u.id === currentUserId,
                permissions: permsObj,
              };
            } catch (innerErr) {
              console.error(`Failed to fetch seller data for ${u.id} `, innerErr);
              return { userId: "", name: "", role: "", isYou: false, permissions: {} };
            }
          })
        )
      ).filter((s) => s.userId !== "");

      setSellers(detailedSellers);
    } catch (err: any) {
      setSellers([]);
      const msg = err.message || String(err);
      setFetchError(msg.startsWith("Error fetching") ? msg : `Error fetching store officials: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, [storeId, currentUserId]);

  const handleOpenPerms = (seller: Seller) => {
    setSelectedSeller(seller);
    setPermDialogOpen(true);
  };

  const handleClosePerms = () => {
    setPermDialogOpen(false);
    setSelectedSeller(null);
  };

  const handleSavePerms = async (newPerms: PermissionObject) => {
    if (!selectedSeller || !storeId) return;

    try {
      const updatedPermissions: string[] = Object.entries(newPerms)
        .filter(([_, isEnabled]) => isEnabled)
        .map(([perm]) => perm);

      const sellerDto = await sdk.getSeller(storeId, selectedSeller.userId);
      const sellerId = sellerDto.id;

      if (!sellerId) throw new Error("Seller ID not found.");

      await sdk.updateManagerPermissions(storeId, sellerId, updatedPermissions);

      setSellers((prev) =>
        prev.map((s) =>
          s.userId === selectedSeller.userId
            ? { ...s, permissions: newPerms }
            : s
        )
      );
    } catch (err: any) {
      console.error("Failed to update manager permissions ", err);
      setErrorMsg("Failed to save permissions " + (err.message || "Unknown error."));
      setErrorOpen(true); 
    } finally {
      handleClosePerms();
    }
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
    if (!selectedSellerToRemove || !storeId) return;

    try {
      const sellerDto = await sdk.getSeller(storeId, selectedSellerToRemove.userId);
      const sellerId = sellerDto.id;
      if (!sellerId) throw new Error("Seller ID could not be determined for removal.");

      await sdk.removeSeller(storeId, sellerId);
      setSellers((prev) => prev.filter((s) => s.userId !== selectedSellerToRemove.userId));
    } catch (err: any) {
      setErrorMsg("Failed to remove seller " + (err.message || "Unknown error."));
      setErrorOpen(true);
    } finally {
      setRemoveDialogOpen(false);
      setSelectedSellerToRemove(null);
    }
  };

  return (
    <Box width="100%" display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h6" mb={2}>👥 Store Sellers</Typography>

      <Button variant="contained" onClick={() => setAddDialogOpen(true)} sx={{ mb: 3 }}>
        Add Seller
      </Button>

      <Stack spacing={2} width="100%" maxWidth="500px">
        {fetchError && (
          <Typography color="error.main" align="center">{fetchError}</Typography>
        )}
        {!loading && !fetchError && sellers.map((seller) => (
          <SellerCard
            key={seller.userId}
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
        {loading && <Typography align="center">Loading sellers…</Typography>}
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
          allPermissions={allPermissions}
          canEdit={!selectedSeller.isYou}
          isOwner={selectedSeller.role === "OWNER"}
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

      {/*Snackbar pop-up for error */}
      <Snackbar
      open={errorOpen}
      autoHideDuration={6000}
      onClose={() => setErrorOpen(false)}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Box
        sx={{
          backgroundColor: "#fdecea", // ⬅️ Lighter red background
          color: "#611a15",           // ⬅️ Dark red text for readability
          px: 2,
          py: 1.5,
          borderRadius: 1,
          boxShadow: 3,
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <span style={{ fontSize: "1.2rem" }}>❌</span> {errorMsg}
      </Box>
    </Snackbar>

    </Box>
  );
};

export default StoreSellers;
