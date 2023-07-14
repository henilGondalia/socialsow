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
import { useSelector } from "react-redux";
import Navbar from "screens/navbar";
import MyChatsWidget from "screens/widgets/MyChatsWidget";
import ChatBoxWidget from "screens/widgets/ChatBoxWidget";
import ChatModel from "./addChatModel";
import EditChatModel from "./editChatModel";
import { configUrl } from "config";

const MessagePage = () => {
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [group, seGroup] = useState([]);
  const [editChat, setEditChat] = useState(false);

  const fetchChats = async () => {
    const response = await fetch(`${configUrl}/chat`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setChats(data);
    // dispatch(setChats({ Chats: data }));
  };

  const accessChat = async (chat) => {
    if (chat && chat._id) {
      const response = await fetch(`${configUrl}/chat`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: chat._id,
        }),
      });
      const data = await response.json();
      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      setNewChatOpen(false);
    }
  };

  const accessGroupChat = async (groupName) => {
    if (groupName) {
      const response = await fetch(`${configUrl}/chat/group`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: groupName,
          users: group.map((member) => {
            return member._id;
          }),
        }),
      });
      const data = await response.json();
      setChats([data, ...chats]);
      setSelectedChat(data);
      setNewChatOpen(false);
    }
  };

  const updateGroupChat = async () => {};

  const handleGroup = (chat) => {
    if (!group.filter((member) => member._id === chat._id)) {
      seGroup([...group, chat]);
    }
  };

  const handleDelete = (chat) => {
    const updatedGroup = group.filter((member) => member._id !== chat._id);
    seGroup(updatedGroup);
  };

  useEffect(() => {
    fetchChats();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    seGroup([]);
    // eslint-disable-next-line
  }, [newChatOpen]);

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        height="calc(100vh - 5rem )"
        padding="2rem 6% 0"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
        overflow="hidden"
      >
        <Box
          flexBasis={isNonMobileScreens ? "26%" : undefined}
          display={!isNonMobileScreens && selectedChat ? "none" : "block"}
          height="calc(100vh - 8rem )"
          position="relative"
        >
          <MyChatsWidget
            chats={chats}
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
            setNewChatOpen={setNewChatOpen}
          />
        </Box>

        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          height="calc(100vh - 8rem )"
          position="relative"
        >
          <ChatBoxWidget
            selectedChat={selectedChat}
            setNewChatOpen={setNewChatOpen}
            setEditChat={setEditChat}
          />
        </Box>
      </Box>
      <ChatModel
        newChatOpen={newChatOpen}
        setNewChatOpen={setNewChatOpen}
        accessChat={isCreatingGroup ? handleGroup : accessChat}
        isCreatingGroup={isCreatingGroup}
        setIsCreatingGroup={setIsCreatingGroup}
        group={group}
        handleDelete={handleDelete}
        accessGroupChat={accessGroupChat}
      />
      {selectedChat && (
        <EditChatModel
          editChat={editChat}
          setEditChat={setEditChat}
          selectedChat={selectedChat}
          group={group}
          seGroup={seGroup}
          accessChat={handleGroup}
          handleDelete={handleDelete}
          updateGroupChat={updateGroupChat}
        />
      )}
    </Box>
  );
};

export default MessagePage;
