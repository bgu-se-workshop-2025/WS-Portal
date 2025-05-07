import { Box, Paper, IconButton, Typography, InputBase } from "@mui/material";
import {
  AccountCircleOutlined,
  ShoppingCartOutlined,
  NotificationsOutlined,
  SearchOutlined,
  FilterAltOutlined,
} from "@mui/icons-material";

import { SharedResources } from "../../Resources.json";
import { Resources } from "../layout/Resources.json";

const zigzag = encodeURIComponent(`
    <svg width="30" height="10" xmlns="http://www.w3.org/2000/svg">
      <polyline points="0,10 15,0 30,10" fill="none" stroke="#ccc" stroke-width="2"/>
    </svg>
  `);

const Header: React.FC = () => {
  return (
    <Box
      sx={{
        ...SharedResources.Styles.FlexboxRow,
        ...Resources.Styles.Header,
        backgroundColor: "background.paper",
        backgroundImage: `url("data:image/svg+xml,${zigzag}")`,
        backgroundRepeat: "repeat-x",
        backgroundPosition: "bottom",
        backgroundSize: "2rem 0.75rem",
        pb: "0.75rem",
      }}
    >
      <Box
        id="logo"
        sx={{
          ...SharedResources.Styles.FlexboxRow,
          ...Resources.Styles.HeaderSection,
        }}
      >
        <Box
          component="img"
          src="./icon.png"
          alt="Kaj Kadir Logo"
          sx={{ width: "4rem", height: "4rem" }}
        ></Box>
        <Typography variant="h4" sx={{ fontFamily: '"IM Fell DW Pica", serif', lineHeight: "4rem" }}>
          {Resources.Content.Header.HeaderTitle}
        </Typography>
      </Box>
      <Box id="search" sx={{ ...Resources.Styles.HeaderSection }}>
        <Paper
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            // handle search submit here
          }}
          elevation={1}
          sx={{
            p: "0.125rem 0.5rem",
            display: "flex",
            alignItems: "center",
            width: "37.5rem",
            borderRadius: "1.5rem",
            boxShadow: "0 0.0625rem 0.375rem rgba(32,33,36,0.28)",
          }}
        >
          <IconButton type="submit" sx={{ p: "0.375rem" }} color="inherit">
            <SearchOutlined />
          </IconButton>
          <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search..." />
          <IconButton sx={{ p: "0.375rem" }} color="inherit">
            <FilterAltOutlined />
          </IconButton>
        </Paper>
      </Box>
      <Box
        id="icons"
        sx={{
          ...SharedResources.Styles.FlexboxRow,
          ...Resources.Styles.HeaderSection,
        }}
      >
        <IconButton color="inherit">
          <NotificationsOutlined sx={{ ...Resources.Styles.HeaderIcon }} />
        </IconButton>
        <IconButton color="inherit">
          <ShoppingCartOutlined sx={{ ...Resources.Styles.HeaderIcon }} />
        </IconButton>
        <IconButton color="inherit">
          <AccountCircleOutlined sx={{ ...Resources.Styles.HeaderIcon }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Header;
