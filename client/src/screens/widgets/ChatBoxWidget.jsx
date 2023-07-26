import {
  Box,
  Typography,
  Button,
  InputBase,
  IconButton,
  useTheme,
} from "@mui/material";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import { useDispatch, useSelector } from "react-redux";
import WidgetWrapper from "components/WidgetWrapper";
import FlexBetween from "components/FlexBetween";
import CircularProgress from "@mui/material/CircularProgress";
import SentimentSatisfiedAltRoundedIcon from "@mui/icons-material/SentimentSatisfiedAltRounded";
// import SendIcon from "@mui/icons-material/Send";
import MyChats from "components/MyChats";
import { useState, useEffect } from "react";
import { configUrl } from "config";
import useApi from "customHooks/useApi";
import ChatMessages from "./chatMessages";
import io from "socket.io-client";
import { setNotification } from "state";

let socket, selectedChatCompare;

const ChatBoxWidget = ({
  selectedChat,
  setSelectedChat,
  setNewChatOpen,
  setEditChat,
}) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState([]);
  const [soketConnected, setSoketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [fetchAgain, setFetchAgain] = useState(false);
  const notifications = useSelector((state) => state.notifications);
  const [loading, setLoading] = useState(false);
  const { fetchData } = useApi();

  const getSender = (users) => {
    return users[0]._id === user._id ? users[1] : users[0];
  };

  useEffect(() => {
    socket = io(configUrl);
    socket.emit("setup", user);
    socket.on("connected", () => setSoketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stopTyping", () => setIsTyping(false));
  }, [user]);

  useEffect(() => {
    socket.on("messageRecieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        const exists = notifications.some(
          (notification) =>
            JSON.stringify(notification) === JSON.stringify(newMessageRecieved)
        );
        if (!exists) {
          dispatch(
            setNotification({
              notifications: [newMessageRecieved, ...notifications],
            })
          );
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat, fetchAgain]);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!soketConnected) return false;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    let timerLength = 4000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stopTyping", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const data = await fetchData(
        `chat/message/${selectedChat._id}`,
        "GET",
        null,
        token
      );
      if (data) {
        setMessages(data);
      }
      setLoading(false);
      socket.emit("joinChat", selectedChat._id);
    } catch (error) {
      setLoading(false);
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.on("stopTyping", selectedChat._id);
      setTyping(false);
      const data = await fetchData(
        `chat/message`,
        "POST",
        {
          content: newMessage,
          chatId: selectedChat,
        },
        token
      );
      if (data) {
        setNewMessage("");
        socket.emit("newMessage", data);
        setMessages([...messages, data]);
      }
    }
  };

  return (
    <WidgetWrapper height="100%">
      <Box
        sx={{
          "& *::-webkit-scrollbar-thumb": {
            backgroundColor: "transparent",
          },
        }}
      >
        {selectedChat ? (
          <>
            <Box sx={{ position: "absolute", width: "93%", top: "0" }}>
              <FlexBetween gap="0.1rem">
                <IconButton onClick={() => setSelectedChat(null)}>
                  <ArrowBackIosRoundedIcon />
                </IconButton>
                <MyChats
                  chat={selectedChat}
                  name={
                    !selectedChat.isGroupChat
                      ? getSender(selectedChat.users).firstName
                      : selectedChat.chatName
                  }
                  profilePic={
                    !selectedChat.isGroupChat
                      ? getSender(selectedChat.users).picturePath
                      : "team.png"
                  }
                  key={selectedChat._id}
                  selectedChat={null}
                  setSelectedChat={() => setEditChat(true)}
                  size="35px"
                />
              </FlexBetween>
            </Box>
            <Box height="calc(100vh - 17rem )" marginTop="3rem">
              {loading ? (
                <Box
                  position="absolute"
                  height="50%"
                  marginLeft="40%"
                  bottom="0"
                >
                  <CircularProgress />
                </Box>
              ) : (
                <ChatMessages messages={messages} isTyping={isTyping} />
              )}
            </Box>

            <Box position="absolute" width="90%" bottom="1rem">
              <FlexBetween gap="0.1rem">
                <InputBase
                  placeholder="Send a message..."
                  onChange={(e) => typingHandler(e)}
                  value={newMessage}
                  sx={{
                    width: "100%",
                    backgroundColor: palette.neutral.light,
                    borderRadius: "2rem",
                    padding: "0.5rem 2rem",
                  }}
                  onKeyDown={sendMessage}
                />
                <IconButton>
                  <SentimentSatisfiedAltRoundedIcon />
                </IconButton>
                {/* <IconButton onClick={() => console.log("sent")}>
                  <SendIcon />
                </IconButton> */}
              </FlexBetween>
            </Box>
          </>
        ) : (
          <Box height="50%" textAlign="center" marginTop="30%">
            <Typography variant="h2" fontWeight="600">
              Select a message
            </Typography>
            <Typography>
              Choose from your existing conversations, start a new one, or just
              keep swimming.
            </Typography>
            <Button
              onClick={() => setNewChatOpen(true)}
              sx={{
                color: palette.background.alt,
                backgroundColor: palette.primary.main,
                borderRadius: "3rem",
                marginTop: "1rem",
                padding: "1rem",
              }}
            >
              New Message
            </Button>
          </Box>
        )}
      </Box>
    </WidgetWrapper>
  );
};

export default ChatBoxWidget;
