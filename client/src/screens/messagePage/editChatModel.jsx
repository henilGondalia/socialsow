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
import { configUrl } from "config";

const EditChatModel = ({
  editChat,
  setEditChat,
  selectedChat,
  group,
  seGroup,
  accessChat,
  handleDelete,
  updateGroupChat,
}) => {
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const _id = useSelector((state) => state.user._id);
  const [searchResult, setSearchResult] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [timer, setTimer] = useState(null);
  const [groupName, setGroupName] = useState("");

  const handleSearch = (e) => {
    clearTimeout(timer);
    setSearchLoading(true);
    setTimer(
      setTimeout(async () => {
        const searchString = e.target.value;
        if (searchString) {
          const response = await fetch(
            `${configUrl}/users?search=${searchString}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.json();
          setSearchResult(data);
          //   setSearchResult([...data, ...data]);
        } else {
          setSearchResult(null);
        }
      }, 1000)
    );
    setSearchLoading(false);
  };

  const getSender = (users) => {
    return users[0]._id === _id ? users[1] : users[0];
  };

  useEffect(() => {
    console.log("selectedChat", selectedChat);
    selectedChat.users && seGroup(selectedChat.users);
    setGroupName("");
    setSearchResult([]);
    return () => {
      console.log("return");
    };
  }, [editChat]);

  return (
    <ModelWrapper
      open={editChat}
      onClose={() => setEditChat(false)}
      palette={palette}
      title={
        !selectedChat.isGroupChat
          ? getSender(selectedChat.users).firstName
          : selectedChat.chatName
      }
    >
      {selectedChat.isGroupChat && (
        <>
          <Box margin="0 6% 1rem">
            <TextField
              required
              fullWidth
              id="outlined-required"
              label="Group Name"
              variant="outlined"
              size="small"
              onChange={(e) => setGroupName(e.target.value)}
              defaultValue={selectedChat.chatName}
            />
          </Box>
          <Box margin="0 6% 1rem">
            <SearchBar onSearch={(e) => handleSearch(e)} />
          </Box>
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
          <Divider />
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
          <Button
            disabled={!groupName}
            onClick={() => updateGroupChat(groupName)}
            sx={{
              color: palette.background.alt,
              backgroundColor: palette.primary.main,
              borderRadius: "3rem",
              position: "absolute",
              right: "6%",
              bottom: "1rem",
            }}
          >
            Update
          </Button>
        </>
      )}
    </ModelWrapper>
  );
};
export default EditChatModel;
