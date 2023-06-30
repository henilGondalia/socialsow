import {
  Box,
  useMediaQuery,
  Grid,
  Paper,
  Typography,
  Select,
  MenuItem,
  Button,
  IconButton,
} from "@mui/material";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "screens/navbar";
import WidgetWrapper from "components/WidgetWrapper";
import { PhotoAlbumOutlined } from "@mui/icons-material";
import PostWidget from "screens/widgets/PostWidget";
import FlexBetween from "components/FlexBetween";

const SavedPage = () => {
  const [savedPosts, setsavedPosts] = useState([]);
  const { userId } = useParams();
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const getsavedPosts = () => {
    const savedPosts = window.localStorage.getItem("savedPosts");
    const data = JSON.parse(savedPosts);
    setsavedPosts(data);
    console.log("19-->", data);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleRemoveItem = (index) => {
    const items = JSON.parse(localStorage.getItem("savedPosts")) || [];
    items.splice(index, 1);
    localStorage.setItem("savedPosts", JSON.stringify(items));
    window.location.reload();
  };

  useEffect(() => {
    getsavedPosts();
  }, []);

  const filteredImages =
    selectedCategory === "all"
      ? savedPosts
      : savedPosts.filter((image) => image.category === selectedCategory);

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
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <WidgetWrapper>
            <Typography variant="h6" component="h2" textAlign="center">
              No Saved Post Found
            </Typography>
          </WidgetWrapper>
        </Box>
      </Box>
    </Box>
  );
};

export default SavedPage;
