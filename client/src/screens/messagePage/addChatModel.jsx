import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  Divider,
  TextField,
  Chip,
  Avatar,
  Button,
} from "@mui/material";
import { useSelector } from "react-redux";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import SearchBar from "components/SearchBar";
import MyChats from "components/MyChats";
import MyChatSkelton from "components/MyChatSkelton";
import ModelWrapper from "components/ModelWrapper";
import useApi from "customHooks/useApi";
import { configUrl } from "config";

const ChatModel = ({
  newChatOpen,
  setNewChatOpen,
  accessChat,
  isCreatingGroup,
  setIsCreatingGroup,
  group,
  handleDelete,
  accessGroupChat,
}) => {
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const [searchResult, setSearchResult] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [timer, setTimer] = useState(null);
  const [groupName, setGroupName] = useState("");
  const { fetchData } = useApi();

  const handleSearch = (e) => {
    clearTimeout(timer);
    setSearchLoading(true);
    setTimer(
      setTimeout(async () => {
        const searchString = e.target.value;
        if (searchString) {
          const data = await fetchData(
            `/users?search=${searchString}`,
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
    setGroupName("");
    setIsCreatingGroup(false);
  }, [newChatOpen, setIsCreatingGroup]);

  return (
    <ModelWrapper
      open={newChatOpen}
      onClose={() => setNewChatOpen(false)}
      palette={palette}
      title="New Message"
    >
      {isCreatingGroup && (
        <Box margin="0 6% 1rem">
          <TextField
            required
            fullWidth
            id="outlined-required"
            label="Group Name"
            variant="outlined"
            size="small"
            onChange={(e) => setGroupName(e.target.value)}
          />
        </Box>
      )}
      <Box margin="0 6% 1rem">
        <SearchBar onSearch={(e) => handleSearch(e)} />
      </Box>
      {isCreatingGroup && (
        <Box margin="0 6% 1rem">
          {group.map((member) => {
            return (
              <Chip
                avatar={
                  <Avatar
                    alt={member.firstName}
                    crossOrigin="anonymous"
                    src={`${configUrl}/assets/${member.picturePath}`}
                  />
                }
                label={member.firstName}
                variant="outlined"
                onDelete={() => handleDelete(member)}
                sx={{ marginRight: "0.4rem", marginBottom: "0.2rem" }}
                key={member._id}
              />
            );
          })}
        </Box>
      )}
      <Divider />
      {!isCreatingGroup && (
        <>
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
            onClick={() => {
              setIsCreatingGroup(true);
            }}
          >
            <IconButton
              sx={{ backgroundColor: palette.primary.light, p: "0.6rem" }}
            >
              <Diversity3Icon />
            </IconButton>
            <Typography
              variant="h5"
              component="h2"
              fontWeight="500"
              sx={{ ml: 2 }}
            >
              Create a Group
            </Typography>
          </Box>
          <Divider />
        </>
      )}
      <Box height="69%" sx={{ overflowY: "scroll" }}>
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
      {isCreatingGroup && (
        <Button
          disabled={!groupName}
          onClick={() => accessGroupChat(groupName)}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
            position: "absolute",
            right: "6%",
            bottom: "1rem",
          }}
        >
          CREATE
        </Button>
      )}
    </ModelWrapper>
  );
};
export default ChatModel;
