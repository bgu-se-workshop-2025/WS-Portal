import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  useTheme,
  Box,
  Dialog,
  Stack,
  CircularProgress,
  IconButton,
  Tooltip,
  Snackbar,
} from "@mui/material";
import { Add, Close, Delete, ContentCopy, Check } from "@mui/icons-material";
import { useParams } from "react-router-dom";

import { ProductDto } from "../../../../../../../shared/types/dtos";
import { sdk } from "../../../../../../../sdk/sdk";
import UpdateProductDialog from "../UpdateProductDialog";
import RatingComponent from "../../../../../../../shared/components/RatingComponent";
import useDiscounts from "../../../discounts/hooks/useDiscounts";
import StoreDiscountEditor from "../../../discounts/StoreDiscountEditor/StoreDiscountEditor";
import { getLabelForTag } from "../../../discounts/util/discountUtils";
import SellerAuctionProductCard from "./SellerAuctionProductCard";

interface ExtendedProductDto extends ProductDto {
  storeName?: string;
  storeRating?: number;
}

interface SellerProductCardProps {
  product: ExtendedProductDto;
  setUpdateProducts: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProductDisscountControllerDialog = ({ open, setOpen, productId, storeId }: {
  open: boolean,
  setOpen: (open: boolean) => void,
  productId: string,
  storeId: string
}) => {
  const discountHook = useDiscounts({ storeId: storeId, productId: productId });
  const [openEditor, setOpenEditor] = useState(false);

  useEffect(() => {
    discountHook.fetchDiscounts();
  }, []);

  const onCreate = () => {
    setOpenEditor(true);
  }

  return <Dialog open={open}>
    <Stack padding={4} gap={2}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h4">Product Discount Control Panel</Typography>
        <Button onClick={() => setOpen(false)}><Close /></Button>
      </Stack>
      <Stack>
        {discountHook.loading && <CircularProgress />}
        {!discountHook.loading && discountHook.discounts.length > 0 &&
          <Stack gap={2}>
            <Typography variant="h6">Title: </Typography>
            <Typography variant="body2">{discountHook.discounts[0].title}</Typography>
            <Typography variant="h6">Description: </Typography>
            <Typography variant="body2">{discountHook.discounts[0].description}</Typography>
            <Typography variant="h6">Percentage: {discountHook.discounts[0].discountPercentage}%</Typography>
            <Typography variant="h6">Type: {getLabelForTag(discountHook.discounts[0].type)}</Typography>
            <Button onClick={() => discountHook.deleteDiscount(discountHook.discounts[0].id!)}>Delete Discount Policy</Button>
          </Stack>
        }
        {!discountHook.loading && discountHook.discounts.length === 0 &&
          <Stack gap={2}>
            <Typography>No discount policy exists for this product.</Typography>
            <Button onClick={onCreate}>Create one now!</Button>
            {openEditor &&
              <StoreDiscountEditor
                openState={{ open: openEditor, setOpen: setOpenEditor }}
                createDiscount={discountHook.createDiscount}
              />
            }
          </Stack>
        }
        {!discountHook.loading && discountHook.error &&
          <Typography color="error">{discountHook.error}</Typography>
        }
      </Stack>
    </Stack>
  </Dialog>
}

const SellerProductCard: React.FC<SellerProductCardProps> = ({ product, setUpdateProducts }) => {
  const theme = useTheme();
  const { storeId } = useParams<{ storeId: string }>();

  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [discountOpen, setDiscountOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string>();
  const [copySuccess, setCopySuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!storeId) {
    return null; // or show an error
  }

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError(undefined);

    try {
      await sdk.deleteProduct(storeId, product.id!);
      setUpdateProducts((value) => !value);
    } catch (err: any) {
      console.error("Error deleting product:", err);
      setDeleteError(err.message || "Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  const handleOpenEdit = () => {
    setEditOpen(true);
  };

  const handleCloseEdit = () => {
    setEditOpen(false);
  };

  const handleProductUpdated = () => {
    setEditOpen(false);
    setUpdateProducts((value) => !value);
  }

  const handleOpenDiscount = () => {
    setDiscountOpen(true);
  }

  if (product.auctionEndDate && new Date(product.auctionEndDate).getTime() < Date.now()) {
    return null;
  }

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(product.id!);
      setCopied(true);
      setCopySuccess(true);
      setTimeout(() => setCopied(false), 1000);
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (err) {
      console.error('Failed to copy product ID:', err);
    }
  };

  return (
    <>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: theme.shape.borderRadius * 2,
          boxShadow: theme.shadows[1],
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: theme.shadows[4],
          },
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" gutterBottom noWrap sx={{ fontWeight: 500 }}>
            {product.name}
          </Typography>
          <Typography
            variant="body2"
            paragraph
            noWrap
            sx={{ color: theme.palette.text.secondary }}
          >
            {product.description}
          </Typography>

          <Box sx={{ mb: theme.spacing(1) }}>
            {product.auctionEndDate ? (
              <SellerAuctionProductCard
                product={product}
              />
            ) : (              
              <Typography variant="body2">
                <strong>Price:</strong> ${product.price.toFixed(2)}
              </Typography>
            )}

            <Typography variant="body2">
              <strong>Available:</strong> {product.quantity}
            </Typography>
          </Box>

          {/* Product rating: readonly for sellers and guests, rateable for non-sellers */}
          {!product.auctionEndDate && <Box display="flex" alignItems="center" gap={1} mb={1}>
            <RatingComponent
              value={product.rating ?? 0}
              readOnly={true}
              size="medium"
              precision={0.1}
            />
          </Box>}

          {!product.auctionEndDate && <Box>
            <Button onClick={handleOpenDiscount}>Open Discount Settings</Button>
            {discountOpen &&
              <ProductDisscountControllerDialog
                open={discountOpen}
                setOpen={setDiscountOpen}
                productId={product.id!}
                storeId={product.storeId!}
              />
            }
          </Box>}

          {product.categories.length > 0 && (
            <Typography variant="body2">
              <strong>Categories:</strong> {product.categories.join(", ")}
            </Typography>
          )}

          {deleteError && (
            <Typography
              variant="caption"
              color="error"
              sx={{ mt: theme.spacing(1), display: "block" }}
            >
              {deleteError}
            </Typography>
          )}
        </CardContent>

        <CardActions
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            px: theme.spacing(2),
            pb: theme.spacing(2),
          }}
        >
          <Tooltip title="Copy Product ID">
            <IconButton
              size="small"
              onClick={handleCopyId}
              sx={{
                color: copied ? theme.palette.success.main : theme.palette.text.secondary,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              {copied ? <Check /> : <ContentCopy />}
            </IconButton>
          </Tooltip>
          
          <Box>
            <Button
              size="small"
              startIcon={<Add />}
              onClick={handleOpenEdit}
              disabled={deleting}
            >
              Edit
            </Button>
            <Button
              size="small"
              color="error"
              startIcon={<Delete />}
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </Box>
        </CardActions>
      </Card>

      {/* Update Dialog */}
      <UpdateProductDialog
        open={editOpen}
        storeId={storeId}
        existingProduct={product}
        onClose={handleCloseEdit}
        onProductUpdated={handleProductUpdated}
      />

      {/* Copy Success Snackbar */}
      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={() => setCopySuccess(false)}
        message="Product ID copied to clipboard!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
};

export default SellerProductCard;
