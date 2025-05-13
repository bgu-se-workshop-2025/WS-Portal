import React from "react";

import { IconButton } from "@mui/material";
import {
  NotificationsOutlined,
  ShoppingCartOutlined,
  AccountCircleOutlined,
} from "@mui/icons-material";

import { Resources } from "../Resources.json";

const IconBar: React.FC = () => {
  return (
    <>
      <IconButton color="inherit">
        <NotificationsOutlined sx={{ ...Resources.Styles.HeaderIcon }} />
      </IconButton>
      <IconButton color="inherit">
        <ShoppingCartOutlined sx={{ ...Resources.Styles.HeaderIcon }} />
      </IconButton>
      <IconButton color="inherit">
        <AccountCircleOutlined sx={{ ...Resources.Styles.HeaderIcon }} />
      </IconButton>
    </>
  );
};

export default IconBar;
