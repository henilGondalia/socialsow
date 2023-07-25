import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton, useTheme, Divider } from "@mui/material";
import { useSelector } from "react-redux";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import FlexBetween from "components/FlexBetween";
import SearchBar from "components/SearchBar";
import MyChats from "components/MyChats";
import MyChatSkelton from "components/MyChatSkelton";
import ModelWrapper from "components/ModelWrapper";
import useApi from "customHooks/useApi";

const ChatModel = ({ newChatOpen, setNewChatOpen, accessChat }) => {
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const [searchResult, setSearchResult] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  let [timer, setTimer] = useState(null);
  const { fetchData } = useApi();

  const handleSearch = (e) => {
    clearTimeout(timer);
    setSearchLoading(true);
    setTimer(
      setTimeout(async () => {
        const searchString = e.target.value;
        if (searchString) {
          const data = await fetchData(
            `users?search=${searchString}`,
            "GET",
            null,
            token
          );
          if (data) {
            setSearchResult(data);
          }
        } else {
          setSearchResult(null);
        }
      }, 1000)
    );
    setSearchLoading(false);
  };

  useEffect(() => {
    setSearchResult([]);
  }, [newChatOpen]);

  return (
    <ModelWrapper
      open={newChatOpen}
      onClose={() => setNewChatOpen(false)}
      palette={palette}
      title="New Message"
    >
      <Box margin="0 6% 1rem">
        <SearchBar onSearch={(e) => handleSearch(e)} />
      </Box>
      <Divider />
      <Box
        padding="1rem 6%"
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          "&:hover": {
            backgroundColor: palette.primary.light,
            cursor: "pointer",
          },
        }}
      >
        <IconButton
          sx={{ backgroundColor: palette.primary.light, p: "0.6rem" }}
        >
          <Diversity3Icon />
        </IconButton>
        <Typography variant="h5" component="h2" fontWeight="500" sx={{ ml: 2 }}>
          Create a Group
        </Typography>
      </Box>
      <Divider />
      <Box height="69%" sx={{ "overflow-y": "scroll" }}>
        {!searchLoading && searchResult
          ? searchResult.map((user) => {
              return (
                <MyChats
                  chat={user}
                  name={user.firstName}
                  profilePic={user.picturePath}
                  key={user._id}
                  selectedChat={null}
                  setSelectedChat={accessChat}
                  customPadding="1rem 6%"
                  size="55px"
                />
              );
            })
          : searchLoading &&
            [...Array(5)].map((index) => {
              return <MyChatSkelton customPadding="1rem 6%" key={index} />;
            })}
      </Box>
    </ModelWrapper>
  );
};
export default ChatModel;
