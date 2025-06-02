import React from "react";

import { Box, Typography } from "@mui/material";
import { Resources } from "../Resources.json";

import { useNavigate } from "react-router-dom";

const Logo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ cursor: "pointer", display: "flex" }} onClick={() => navigate("/")}>
      <Box
        component="img"
        src="/icon.png"
        alt="Kaj Kadir Logo"
        sx={{ width: "4rem" }}
      ></Box>
      <Typography
        variant="h4"
        sx={{ fontFamily: '"IM Fell DW Pica", serif', lineHeight: "4rem" }}
      >
        {Resources.Content.Header.HeaderTitle}
      </Typography>
    </Box>
  );
};

export default Logo;
