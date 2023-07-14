import React, { useEffect, useState } from "react";
import {
  Box,
  useMediaQuery,
  Typography,
  Modal,
  InputBase,
  IconButton,
  useTheme,
  Divider,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import CloseIcon from "@mui/icons-material/Close";
import FlexBetween from "./FlexBetween";

const SearchBar = ({ onSearch }) => {
  const { palette } = useTheme();

  return (
    <FlexBetween
      backgroundColor={palette.neutral.light}
      borderRadius="9px"
      gap="1rem"
      padding="0.1rem 1.5rem"
      justifyContent="flex-start"
    >
      <InputBase
        placeholder="Search..."
        onChange={(e) => onSearch(e)}
        fullWidth
      />
      <IconButton>
        <Search />
      </IconButton>
    </FlexBetween>
  );
};
export default SearchBar;
