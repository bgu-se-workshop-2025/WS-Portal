import React from "react";

import { Box, Typography } from "@mui/material";
import { Resources } from "../Resources.json";

const Logo: React.FC = () => {
  return (
    <>
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
    </>
  );
};

export default Logo;
