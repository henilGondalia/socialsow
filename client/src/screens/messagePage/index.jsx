import React, { useEffect, useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "screens/navbar";
import MyChatsWidget from "screens/widgets/MyChatsWidget";
import ChatBoxWidget from "screens/widgets/ChatBoxWidget";
import ChatModel from "./addChatModel";
import EditChatModel from "./editChatModel";
import useApi from "customHooks/useApi";

const MessagePage = () => {
  const token = useSelector((state) => state.token);
  // const dispatch = useDispatch();
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [group, seGroup] = useState([]);
  const [editChat, setEditChat] = useState(false);
  const { fetchData } = useApi();

  const fetchChats = async () => {
    const data = await fetchData(`chat`, "GET", null, token);
    if (data) {
      setChats(data);
    }
    // dispatch(setChats({ Chats: data }));
  };

  const accessChat = async (chat) => {
    if (chat && chat._id) {
      const data = await fetchData(
        `chat`,
        "POST",
        {
          userId: chat._id,
        },
        token
      );
      if (data) {
        if (!chats.find((c) => c._id === data._id)) {
          setChats([data, ...chats]);
        }
        setSelectedChat(data);
        setNewChatOpen(false);
      }
    }
  };

  const accessGroupChat = async (groupName, chatId = undefined) => {
    if (groupName) {
      let body = {
        name: groupName,
        users: group.map((member) => {
          return member._id;
        }),
      };
      if (chatId) {
        body["chatId"] = chatId;
      }
      const data = await fetchData(`chat/group`, "POST", body, token);
      if (data) {
        if (chats.find((c) => c._id === data._id)) {
          const updateChatIndex = chats.findIndex((c) => c._id === data._id);
          let newChats = chats;
          newChats[updateChatIndex] = data;
          setChats([...newChats]);
        } else {
          setChats([data, ...chats]);
        }
        setSelectedChat(data);
        setNewChatOpen(false);
        setEditChat(false);
      }
    }
  };

  const handleGroup = (chat) => {
    const isAvailable = group.filter((member) => member._id === chat._id);
    if (!isAvailable.length) {
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
            setSelectedChat={setSelectedChat}
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
          updateGroupChat={accessGroupChat}
        />
      )}
    </Box>
  );
};

export default MessagePage;
