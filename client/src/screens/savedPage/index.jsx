import { Box, useMediaQuery, Typography } from "@mui/material";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import { useSelector } from "react-redux";
import Navbar from "screens/navbar";
import WidgetWrapper from "components/WidgetWrapper";

import PostsWidget from "screens/widgets/PostsWidget";

const SavedPage = () => {
  const userId = useSelector((state) => state.user._id);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <WidgetWrapper>
            <Box sx={{ display: "flex" }}>
              <BookmarksIcon />
              <Typography fontSize="1rem" fontWeight="500" marginLeft="1rem">
                My items
              </Typography>
            </Box>
          </WidgetWrapper>
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? "-2rem" : "2rem"}
        >
          <PostsWidget userId={userId} page="isSaved" />

          {/* <WidgetWrapper>
            <Typography variant="h6" component="h2" textAlign="center">
              No Saved Post Found
            </Typography>
          </WidgetWrapper> */}
        </Box>
      </Box>
    </Box>
  );
};

export default SavedPage;
