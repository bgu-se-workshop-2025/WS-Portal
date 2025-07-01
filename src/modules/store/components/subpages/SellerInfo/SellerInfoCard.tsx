import React from "react";
import { Avatar, Paper, Typography } from "@mui/material";

interface Props {
  username: string;
  profilePictureUri?: string;
}

const getInitials = (username: string): string => {
  const trimmed = username.trim();
  if (trimmed.length === 0) return "??";
  if (trimmed.length === 1) return (trimmed[0] + trimmed[0]).toUpperCase();
  return (trimmed[0] + trimmed[trimmed.length - 1]).toUpperCase();
};

const SellerPublicCard: React.FC<Props> = ({ username, profilePictureUri }) => {
  const initials = getInitials(username);

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
        minWidth: 220,
        maxWidth: 260,
        height: 220,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        transition: "transform 0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
        },
      }}
    >
      <Avatar
        alt={username}
        src={profilePictureUri && profilePictureUri.trim() !== "" ? profilePictureUri : undefined}
        sx={{
          width: 80,
          height: 80,
          mb: 2,
          fontSize: 28,
          bgcolor: "#1976d2", // Blue accent if no image
        }}
      >
        {(!profilePictureUri || profilePictureUri.trim() === "") && initials}
      </Avatar>
      <Typography variant="subtitle1" fontWeight={600}>
        {username}
      </Typography>
    </Paper>
  );
};

export default SellerPublicCard;
