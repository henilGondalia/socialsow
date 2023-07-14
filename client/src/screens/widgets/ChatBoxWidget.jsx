import {
  Box,
  useMediaQuery,
  Typography,
  Button,
  InputBase,
  IconButton,
  useTheme,
  Divider,
} from "@mui/material";
import { useSelector } from "react-redux";
import WidgetWrapper from "components/WidgetWrapper";
import FlexBetween from "components/FlexBetween";
import CircularProgress from "@mui/material/CircularProgress";
import SentimentSatisfiedAltRoundedIcon from "@mui/icons-material/SentimentSatisfiedAltRounded";
import Snackbar from "@mui/material/Snackbar";
// import SendIcon from "@mui/icons-material/Send";
import MyChats from "components/MyChats";
import { useState, useEffect } from "react";
import { configUrl } from "config";
import ChatMessages from "./chatMessages";

const ChatBoxWidget = ({ selectedChat, setNewChatOpen, setEditChat }) => {
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const _id = useSelector((state) => state.user._id);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState([]);

  const getSender = (users) => {
    return users[0]._id === _id ? users[1] : users[0];
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      const response = await fetch(
        `${configUrl}/chat/message/${selectedChat._id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
          },
        }
      );
      const data = await response.json();
      setMessages(data);
      setLoading(false);
    } catch (error) {}
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      debugger;
      try {
        const response = await fetch(`${configUrl}/chat/message`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            content: newMessage,
            chatId: selectedChat,
          }),
        });
        setNewMessage("");
        const data = await response.json();
        //       socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={true}
          onClose={false}
          message="Failed to send the Message"
          key="error"
        />;
      }
    }
  };

  useEffect(() => {
    fetchMessages();

    // eslint-disable-next-line
  }, [selectedChat]);

  return (
    <WidgetWrapper height="100%">
      <Box height="calc(100vh - 13rem )" sx={{ overflowY: "scroll" }}>
        {selectedChat ? (
          <>
            <Box>
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
            </Box>
            <Box>
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
                <ChatMessages messages={messages} />
              )}
            </Box>
            <Box position="absolute" width="90%" bottom="1rem">
              <FlexBetween gap="0.1rem">
                <IconButton>
                  <SentimentSatisfiedAltRoundedIcon />
                </IconButton>
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
