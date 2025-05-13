import React from "react";
import { Box } from "@mui/material";

import { SharedResources } from "../../Resources.json";
import { Resources } from "../layout/Resources.json";

import SearchBar from "./parts/SearchBar";
import IconBar from "./parts/IconBar";
import Logo from "./parts/Logo";

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
        <Logo />
      </Box>
      <Box
        id="search"
        sx={{
          ...Resources.Styles.HeaderSection,
          alignSelf: "flex-start",
          position: "relative",
          mt: "1rem",
        }}
      >
        <SearchBar />
      </Box>
      <Box
        id="icons"
        sx={{
          ...SharedResources.Styles.FlexboxRow,
          ...Resources.Styles.HeaderSection,
        }}
      >
        <IconBar />
      </Box>
    </Box>
  );
};

export default Header;
