import React from "react";
import { Box } from "@mui/material";

import NotificationMenu from "../menus/NotificationMenu";
import CartMenu from "../menus/CartMenu";
import AccountMenu from "../menus/AccountMenu";

const IconBar: React.FC = () => {
  return (
    <Box display="flex" alignItems="center" gap={1}>
      <NotificationMenu />
      <CartMenu />
      <AccountMenu />
    </Box>
  );
};

export default IconBar;
