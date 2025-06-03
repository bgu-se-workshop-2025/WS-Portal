import React from "react";
import { Box, Pagination, useTheme } from "@mui/material";

interface PaginationBarProps {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

const PaginationBar: React.FC<PaginationBarProps> = ({
  page,
  totalPages,
  onPageChange,
}) => {
  const theme = useTheme();

  if (totalPages <= 1) return null;

  return (
    <Box
      sx={{
        mt: theme.spacing(4),
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Pagination
        count={totalPages}
        page={page + 1}
        onChange={(_, value) => onPageChange(value - 1)}
        color="primary"
      />
    </Box>
  );
};

export default PaginationBar;
