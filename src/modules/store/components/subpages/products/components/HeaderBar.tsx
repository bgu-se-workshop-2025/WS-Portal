import React from "react";
import { Box, Button, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface HeaderBarProps {
  isSeller: boolean | null;
  onAddClick: () => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ isSeller, onAddClick }) => {
  const theme = useTheme();

  if (!isSeller) return null;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mb: theme.spacing(3),
      }}
    >
      <Button variant="contained" startIcon={<AddIcon />} onClick={onAddClick}>
        Add Product
      </Button>
    </Box>
  );
};

export default HeaderBar;
