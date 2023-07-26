import React, { useEffect, useState } from "react";
import {
  Box,
  useTheme,
  Divider,
  TextField,
  Chip,
  Avatar,
  Button,
} from "@mui/material";
import { useSelector } from "react-redux";
import SearchBar from "components/SearchBar";
import MyChats from "components/MyChats";
import MyChatSkelton from "components/MyChatSkelton";
import ModelWrapper from "components/ModelWrapper";
import UserWidget from "screens/widgets/UserWidget";
import { configUrl } from "config";
import useApi from "customHooks/useApi";

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

  const getSender = (users) => {
    return users[0]._id === _id ? users[1] : users[0];
  };

  useEffect(() => {
    selectedChat.users && seGroup(selectedChat.users);
    setGroupName(selectedChat.chatName || "");
    setSearchResult([]);
  }, [editChat, selectedChat, seGroup]);

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
      {selectedChat.isGroupChat ? (
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
            onClick={() => updateGroupChat(groupName, selectedChat._id)}
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
      ) : (
        <Box margin="0 4% 1rem">
          <UserWidget
            userId={getSender(selectedChat.users)?._id}
            picturePath={getSender(selectedChat.users)?.picturePath}
          />
        </Box>
      )}
    </ModelWrapper>
  );
};
export default EditChatModel;
