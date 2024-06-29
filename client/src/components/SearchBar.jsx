import React from "react";
import { Box, InputBase, IconButton, useTheme, Typography } from "@mui/material";
import { Search } from "@mui/icons-material";
import FlexBetween from "./FlexBetween";
import FlexStart from "./FlexStart";
import WidgetWrapper from "components/WidgetWrapper";
import UserImage from "components/UserImage";
import { margin } from "@mui/system";


const SearchBar = ({ onSearch = () => {}, searchResult }) => {
  const { palette } = useTheme();

  return (
    <Box
      sx={{
        width: "100%",
        position: "relative"
      }}
    >
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
      {console.log("searchResult",searchResult.map((result,index)=>{console.log(result)}))}
      {searchResult && searchResult.length > 0 && (
        <WidgetWrapper  sx={{ width: "100%", position: "absolute", zIndex:"2"}}>
          {searchResult.map((result,index)=> {
            return (
              <FlexBetween key={index} sx={{margin: "1rem 0"}}>
                <FlexStart>
                  <Typography fontSize="1rem" fontWeight="500" marginRight="0.2em">
                    {result.firstName}
                  </Typography>
                  <Typography fontSize="0.8rem"><span className="dot"/> {result.occupation}</Typography>
                </FlexStart>
                <UserImage image={result.picturePath} size="35px"/>
              </FlexBetween>
            )
          })}
        </WidgetWrapper>
      )}
    </Box>
  );
};
export default SearchBar;
