import React from "react";
import { InputBase, IconButton, useTheme } from "@mui/material";
import { Search } from "@mui/icons-material";
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
