import React from "react";
import { Button, Stack, Box } from "@mui/material";

type Tab = "products" | "sellers" | "settings" | "discounts" | "transactions";

interface StoreSellerToolbarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { key: Tab; label: string; icon: string }[] = [
  { key: "products",     label: "Products",     icon: "📦" },
  { key: "sellers",      label: "Sellers",      icon: "🧑‍💼" },
  { key: "settings",     label: "Settings",     icon: "⚙️" },
  { key: "discounts",    label: "Discounts",    icon: "🏷️" },
  { key: "transactions", label: "Transactions", icon: "🧾" },  
];

const StoreSellerToolbar: React.FC<StoreSellerToolbarProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <Box width="100%">
      <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <Button
              key={tab.key}
              variant={isActive ? "contained" : "outlined"}
              color={isActive ? "primary" : "inherit"}
              onClick={() => onTabChange(tab.key)}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: 2,
                boxShadow: isActive ? 2 : 0,
              }}
            >
              <span style={{ marginRight: 8 }}>{tab.icon}</span>
              {tab.label}
            </Button>
          );
        })}
      </Stack>
    </Box>
  );
};

export default StoreSellerToolbar;
