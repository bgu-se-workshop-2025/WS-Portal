import React from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  IconButton,
} from "@mui/material";
import { FiSettings, FiTrash2 } from "react-icons/fi";

interface SellerCardProps {
  name: string;
  role: string;
  isYou?: boolean;
  onSettingsClick?: () => void;
  onDeleteClick?: () => void;
}

const SellerCard: React.FC<SellerCardProps> = ({
  name,
  role,
  isYou,
  onSettingsClick,
  onDeleteClick,
}) => {
  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        maxWidth: 480,
        px: 3,
        py: 2,
        borderRadius: 2,
        backgroundColor: "#f3f4ff",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
      >
        <Typography
          variant="subtitle1"
          fontWeight={600}
          color="text.primary"
          minWidth={200}
          sx={{ flexShrink: 1 }}
        >
          {name}
          {isYou && (
            <Typography
              component="span"
              variant="body2"
              color="text.secondary"
              ml={1}
            >
              (You)
            </Typography>
          )}
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          mt={{ xs: 1, sm: 0 }}
        >
          <Typography variant="body2" color="text.secondary">
            {role}
          </Typography>
          {onSettingsClick && (
            <IconButton size="small" onClick={onSettingsClick}>
              <FiSettings />
            </IconButton>
          )}
          {onDeleteClick && (
            <IconButton
              size="small"
              color="error"
              onClick={onDeleteClick}
              disabled={isYou}
            >
              <FiTrash2 />
            </IconButton>
          )}
        </Stack>
      </Box>
    </Paper>
  );
};

export default SellerCard;
